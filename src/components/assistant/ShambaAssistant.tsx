"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  RotateCcw,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AssistantMessageContent } from "@/components/assistant/AssistantMessageContent";
import { SITE } from "@/lib/constants";
import {
  getMarketplaceListings,
  isOwnListing,
  type MarketplaceListing,
} from "@/lib/marketplace";
import { ELDORET_CENTER, haversineKm } from "@/lib/seed-equipment";
import type { AssistantListing, ChatMessage } from "@/lib/assistant/types";

const SUGGESTIONS = [
  "What tools can I rent near me?",
  "How do I list my own equipment?",
  "Climate-smart irrigation tips",
];

const WELCOME =
  `Habari! I'm the ${SITE.name} assistant. Ask me about renting or sharing ` +
  `climate-smart tools, how the platform works, or farming tips.`;

function buildListingContext(userId?: string): AssistantListing[] {
  return getMarketplaceListings()
    .filter((item: MarketplaceListing) => item.isAvailable)
    .filter((item) => !isOwnListing(item, userId))
    .map((item) => ({
      title: item.title,
      category: item.category,
      ratePerDay: item.ratePerDay,
      locationLabel: item.locationLabel,
      isAvailable: item.isAvailable,
      distanceKm: haversineKm(
        ELDORET_CENTER.lat,
        ELDORET_CENTER.lng,
        item.locationLat,
        item.locationLng,
      ),
    }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, 15);
}

export function ShambaAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, streaming]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const history: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          context: {
            role: user?.role ?? null,
            county: user?.county ?? null,
            listings: buildListingContext(user?.id),
          },
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res
          .json()
          .catch(() => ({ error: "Something went wrong. Please try again." }));
        setMessages((prev) =>
          replaceLast(prev, String(data.error || "Something went wrong.")),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => replaceLast(prev, acc));
      }
    } catch {
      setMessages((prev) =>
        replaceLast(prev, "Network error. Please check your connection."),
      );
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    send(input);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  }

  function clearChat() {
    if (streaming) return;
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Ask ShambaShare assistant"}
        aria-expanded={open}
        className={`fixed right-4 bottom-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_14px_36px_rgba(27,77,50,0.42)] transition duration-300 hover:scale-105 active:scale-95 sm:right-5 sm:bottom-5 ${
          open ? "rotate-90 scale-95" : ""
        }`}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="ShambaShare assistant"
        aria-hidden={!open}
        className={`fixed right-3 bottom-[5.5rem] z-[60] flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.35rem] border border-green-900/10 bg-[linear-gradient(180deg,#f7faf6_0%,#ffffff_38%)] shadow-[0_28px_70px_rgba(18,32,24,0.28)] transition-all duration-300 sm:right-5 sm:bottom-24 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.98] opacity-0"
        }`}
        style={{ height: "min(36rem, calc(100vh - 7.5rem))" }}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-green-900 via-green-800 to-green-700 px-4 py-3.5 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
              <Sparkles size={18} />
              <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-green-800 bg-emerald-300" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.95rem] font-semibold tracking-tight">
                Ask {SITE.name}
              </p>
              <p className="truncate text-xs text-white/70">
                Tools · bookings · climate-smart farming
              </p>
            </div>
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={clearChat}
                disabled={streaming}
                aria-label="Clear chat"
                title="New chat"
                className="rounded-xl p-2 text-white/75 transition hover:bg-white/12 hover:text-white disabled:opacity-40"
              >
                <RotateCcw size={16} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/12"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4 sm:px-4"
        >
          <MessageRow role="assistant">
            <AssistantMessageContent content={WELCOME} />
          </MessageRow>

          {messages.length === 0 ? (
            <div className="space-y-2 pt-1 pl-11">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Try asking
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-green-800/12 bg-white px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-green-900 shadow-[0_4px_14px_rgba(18,32,24,0.04)] transition hover:-translate-y-0.5 hover:border-green-700/25 hover:shadow-[0_8px_20px_rgba(18,32,24,0.08)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isLast = i === messages.length - 1;
            const pending = isLast && streaming && m.role === "assistant";

            return (
              <MessageRow key={i} role={m.role}>
                {isUser ? (
                  <p className="whitespace-pre-wrap text-[0.9rem] leading-[1.5] text-white">
                    {m.content}
                  </p>
                ) : (
                  <AssistantMessageContent
                    content={m.content}
                    streaming={pending}
                  />
                )}
              </MessageRow>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={onSubmit}
          className="border-t border-[color:var(--line)] bg-white/90 p-3 backdrop-blur-sm"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/55 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus-within:border-green-700/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-700/20">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask about tools, bookings, farming…"
              className="max-h-28 min-h-[2.4rem] flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-green-950 outline-none placeholder:text-ink-muted/65"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Send message"
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white shadow-[0_8px_18px_rgba(27,77,50,0.22)] transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={18} strokeWidth={2.4} />
            </button>
          </div>
          <p className="mt-2 px-1 text-center text-[11px] text-ink-muted/80">
            Enter to send · Shift+Enter for a new line
          </p>
        </form>
      </div>
    </>
  );
}

function MessageRow({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-[0_6px_14px_rgba(18,32,24,0.1)] ${
          isUser
            ? "bg-green-800 text-white"
            : "bg-gradient-to-br from-green-700 to-green-900 text-white"
        }`}
      >
        {isUser ? <UserRound size={15} /> : <Sparkles size={15} />}
      </span>
      <div
        className={`max-w-[calc(100%-2.75rem)] rounded-2xl px-3.5 py-3 shadow-[0_8px_22px_rgba(18,32,24,0.06)] ${
          isUser
            ? "rounded-br-md bg-gradient-to-br from-green-800 to-green-900 text-white"
            : "rounded-bl-md border border-green-900/8 bg-white text-green-950"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function replaceLast(list: ChatMessage[], content: string): ChatMessage[] {
  if (!list.length) return list;
  const next = list.slice();
  next[next.length - 1] = { ...next[next.length - 1], content };
  return next;
}
