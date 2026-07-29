import OpenAI from "openai";
import {
  ASSISTANT_MAX_TOKENS,
  ASSISTANT_MODEL,
  buildSystemPrompt,
  isAssistantConfigured,
} from "@/lib/assistant/config";
import type { AssistantRequest, ChatMessage } from "@/lib/assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 12;
const MAX_CONTENT_CHARS = 2000;

// Lightweight per-instance rate limit so nobody can drain the OpenAI credits.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMessage =>
        Boolean(m) &&
        typeof m === "object" &&
        (m as ChatMessage).role !== undefined &&
        typeof (m as ChatMessage).content === "string",
    )
    .map(
      (m): ChatMessage => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.slice(0, MAX_CONTENT_CHARS),
      }),
    )
    .slice(-MAX_MESSAGES);
}

export async function POST(req: Request) {
  if (!isAssistantConfigured()) {
    return Response.json(
      {
        error:
          "The assistant is not configured yet. Add OPENAI_API_KEY to your environment.",
      },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages right now. Please wait a moment." },
      { status: 429 },
    );
  }

  let body: AssistantRequest;
  try {
    body = (await req.json()) as AssistantRequest;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages.length) {
    return Response.json({ error: "No message provided." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = buildSystemPrompt(body.context);

  try {
    const completion = await client.chat.completions.create({
      model: ASSISTANT_MODEL,
      max_tokens: ASSISTANT_MAX_TOKENS,
      temperature: 0.4,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\n(Sorry — the reply was interrupted.)"),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return Response.json(
      { error: "The assistant is unavailable right now. Please try again." },
      { status: 502 },
    );
  }
}
