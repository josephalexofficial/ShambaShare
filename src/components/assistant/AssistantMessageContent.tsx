"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Lightweight, chat-friendly renderer for assistant replies.
 * Supports paragraphs, bullet/numbered lists, bold, italic, inline code,
 * and clickable /portal/... paths — without a heavy markdown dependency.
 */

type Props = {
  content: string;
  streaming?: boolean;
};

export function AssistantMessageContent({ content, streaming }: Props) {
  const trimmed = content.trimEnd();

  if (!trimmed) {
    return (
      <span className="inline-flex items-center gap-1.5 py-0.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700 [animation-delay:-0.28s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700 [animation-delay:-0.14s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700" />
      </span>
    );
  }

  const blocks = splitBlocks(trimmed);

  return (
    <div className="space-y-2.5 text-[0.9rem] leading-[1.55] text-green-950">
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-1.5 pl-0.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-green-700"
                  />
                  <span className="min-w-0 flex-1">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={i} className="space-y-1.5 pl-0.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-800/10 text-[11px] font-bold text-green-800">
                    {j + 1}
                  </span>
                  <span className="min-w-0 flex-1">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(block.text)}
          </p>
        );
      })}
      {streaming ? (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse rounded-full bg-green-700"
        />
      ) : null}
    </div>
  );
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function splitBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullets: string[] | null = null;
  let numbers: string[] | null = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    const joined = paragraph.join("\n").trim();
    if (joined) blocks.push({ type: "p", text: joined });
    paragraph = [];
  }

  function flushList() {
    if (bullets?.length) blocks.push({ type: "ul", items: bullets });
    if (numbers?.length) blocks.push({ type: "ol", items: numbers });
    bullets = null;
    numbers = null;
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);

    if (!line.trim()) {
      flushList();
      flushParagraph();
      continue;
    }

    if (bullet) {
      flushParagraph();
      if (numbers) {
        flushList();
      }
      bullets = bullets ?? [];
      bullets.push(bullet[1]);
      continue;
    }

    if (numbered) {
      flushParagraph();
      if (bullets) {
        flushList();
      }
      numbers = numbers ?? [];
      numbers.push(numbered[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushList();
  flushParagraph();
  return blocks.length ? blocks : [{ type: "p", text }];
}

function renderInline(text: string): ReactNode[] {
  // Split on bold **...**, italic *...*, code `...`, and /portal/... paths.
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\/portal\/[a-zA-Z0-9/_-]+)/g;
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-green-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      part.length > 2 &&
      !part.startsWith("**")
    ) {
      return (
        <em key={i} className="italic text-green-900/90">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={i}
          className="rounded-md bg-green-800/10 px-1.5 py-0.5 font-mono text-[0.8em] font-medium text-green-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("/portal/")) {
      return (
        <Link
          key={i}
          href={part}
          className="inline-flex items-center rounded-md bg-green-800/10 px-1.5 py-0.5 font-mono text-[0.8em] font-semibold text-green-800 underline-offset-2 transition hover:bg-green-800/15 hover:underline"
        >
          {part}
        </Link>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
