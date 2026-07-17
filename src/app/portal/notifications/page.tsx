"use client";

import Link from "next/link";
import { ArrowRight, Bell, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNotifications } from "@/components/portal/NotificationsProvider";
import { Button } from "@/components/ui/Button";

export default function PortalNotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-green-950">
            Notifications
          </h1>
          <p className="mt-2 text-ink-muted">
            Requests, returns, and alerts tailored to your role.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 ? (
            <>
              <p className="text-sm font-semibold text-green-800">
                {unreadCount} unread
              </p>
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl px-4 py-2.5"
                onClick={markAllAsRead}
              >
                <CheckCheck size={16} />
                Mark all as read
              </Button>
            </>
          ) : (
            <p className="text-sm font-medium text-ink-muted">All caught up</p>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="field-panel-strong rounded-2xl px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-800/10 text-green-800">
            <Bell size={26} />
          </span>
          <p className="mt-5 text-2xl font-semibold text-green-950">
            You’re all caught up
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            New booking updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => (
            <article
              key={note.id}
              className={`rounded-2xl border border-[color:var(--line)] p-5 transition ${
                note.read
                  ? "bg-white/70"
                  : "bg-green-800/8 shadow-[0_8px_24px_rgba(18,32,24,0.04)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!note.read ? (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-green-700"
                        aria-hidden
                      />
                    ) : null}
                    <h2 className="font-semibold text-green-950">{note.title}</h2>
                    {!note.read ? (
                      <span className="rounded-md bg-green-800/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-800">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {note.body}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {note.href ? (
                      <Link
                        href={note.href}
                        onClick={() => {
                          if (!note.read) markAsRead(note.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-800 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-900"
                      >
                        Open
                        <ArrowRight size={14} />
                      </Link>
                    ) : null}
                    {!note.read ? (
                      <button
                        type="button"
                        onClick={() => markAsRead(note.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-semibold text-green-900 transition hover:bg-[color:var(--cream-field)]"
                      >
                        <Check size={14} />
                        Mark as read
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-1 text-xs font-medium text-ink-muted">
                        <Check size={12} />
                        Read
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-ink-muted">
                  {note.time}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
