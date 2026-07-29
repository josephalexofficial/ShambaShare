"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
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
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
        setMessages((prev) => replaceLast(prev, data.error as string));
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

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Ask ShambaShare assistant"}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-green-900 text-white shadow-[0_14px_36px_rgba(27,77,50,0.4)] transition duration-300 hover:scale-105 active:scale-95 ${
        open ? "rotate-90" : ""
      }`}
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="ShambaShare assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-5 z-[60] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white shadow-[0_24px_60px_rgba(18,32,24,0.25)] transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(32rem, calc(100vh - 8rem))" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[color:var(--line)] bg-gradient-to-br from-green-800 to-green-900 px-4 py-3.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Ask {SITE.name}</p>
            <p className="truncate text-xs text-white/70">
              Tools, bookings & farming help
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-[color:var(--cream-field)]/40 px-4 py-4"
        >
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm text-green-950 shadow-sm">
              {WELCOME}
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-green-700/25 bg-white px-3 py-1.5 text-xs font-medium text-green-800 transition hover:bg-green-800/8"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isLast = i === messages.length - 1;
            const pending = isLast && streaming && m.role === "assistant";
            return (
              <div
                key={i}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                    isUser
                      ? "rounded-tr-sm bg-green-800 text-white"
                      : "rounded-tl-sm bg-white text-green-950"
                  }`}
                >
                  {m.content || (pending ? "" : "")}
                  {pending && !m.content ? (
                    <span className="inline-flex gap-1 py-1 align-middle">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-700" />
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={onSubmit}
          className="flex items-end gap-2 border-t border-[color:var(--line)] bg-white p-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about tools, bookings, farming…"
            className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--cream-field)]/50 px-3 py-2.5 text-sm text-green-950 outline-none ring-green-700 transition placeholder:text-ink-muted/70 focus:bg-white focus:ring-2"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white shadow-[0_8px_18px_rgba(27,77,50,0.22)] transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}

function replaceLast(list: ChatMessage[], content: string): ChatMessage[] {
  if (!list.length) return list;
  const next = list.slice();
  next[next.length - 1] = { ...next[next.length - 1], content };
  return next;
}
