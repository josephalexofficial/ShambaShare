import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  href?: string;
};

export function StatCard({ label, value, hint, icon: Icon, href }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
          {label}
        </p>
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-800/10 text-green-800">
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-green-950">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-ink-muted">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="field-panel-strong block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-green-700/25 hover:shadow-[0_12px_28px_rgba(18,32,24,0.06)]"
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="field-panel-strong rounded-2xl p-5">{body}</div>
  );
}
