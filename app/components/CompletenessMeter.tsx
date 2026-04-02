"use client";

import type { CompletenessResult } from "@/app/lib/completeness";

const steps = [
  { label: "Personal info", active: true },
  { label: "Experience", active: false },
  { label: "Education", active: false },
  { label: "Skills", active: false },
  { label: "Preferences", active: false },
] as const;

export function CompletenessMeter({ result }: { result: CompletenessResult }) {
  return (
    <aside className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)]">
      <div>
        <p className="text-sm font-semibold text-zinc-950">Profile Intake</p>
        <p className="mt-1 text-xs text-zinc-600">
          Step 1 of 5: Experience &amp; Personal Branding
        </p>
      </div>

      <nav className="mt-4 rounded-xl bg-zinc-50 p-2">
        <ul className="grid gap-1">
          {steps.map((s) => (
            <li key={s.label}>
              <div
                className={[
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm",
                  s.active ? "bg-white shadow-sm" : "text-zinc-700",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    s.active ? "bg-emerald-500" : "bg-zinc-300",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span className={s.active ? "font-semibold text-zinc-950" : ""}>
                  {s.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-950">
            {result.percent}% Complete
          </p>
          <p className="text-[11px] font-semibold tracking-wide text-zinc-500">
            ALMOST THERE
          </p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
            style={{ width: `${result.percent}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-600">
          Completing your profile increases your visibility to HR reviewers.
        </p>
      </div>
    </aside>
  );
}

