"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="Contact"
        title="Let’s build climate-smart access together"
        description="Questions about ShambaShare, partnerships with cooperatives, or the EldoHub hackathon demo — send a note."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="field-panel-strong rounded-xl p-6">
          <h2 className="font-display text-xl font-semibold text-green-950">
            Direct channels
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                Focus region
              </span>
              Eldoret · Uasin Gishu
            </li>
            <li>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                Product
              </span>
              Climate-smart equipment sharing
            </li>
            <li>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                Coordination
              </span>
              SMS-first · Pay on delivery
            </li>
          </ul>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="field-panel-strong rounded-xl p-6 sm:p-8"
        >
          {submitted ? (
            <div className="py-8 text-center">
              <p className="font-display text-2xl font-semibold text-green-950">
                Message noted
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                Thanks — this demo form is ready for wiring to email or Supabase
                later. Your details were captured in the browser session only.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Full name
                </span>
                <input
                  required
                  name="name"
                  className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-green-950">
                  Message
                </span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full rounded-md border border-[color:var(--line)] bg-white/90 px-3 py-2.5 outline-none ring-green-700 focus:ring-2"
                />
              </label>
              <Button type="submit" className="w-full sm:w-auto">
                Send message
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
