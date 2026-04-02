"use client";

import type { CompletenessResult } from "@/app/lib/completeness";
import { PROFILE_FORM_SECTIONS, type ProfileFormSectionId } from "@/app/lib/profileSections";

export function CompletenessMeter({
  result,
  activeSectionId,
  onSectionNavigate,
}: {
  result: CompletenessResult;
  activeSectionId: ProfileFormSectionId;
  onSectionNavigate: (id: ProfileFormSectionId) => void;
}) {
  const activeIndex = PROFILE_FORM_SECTIONS.findIndex((s) => s.id === activeSectionId);
  const stepDisplay = activeIndex >= 0 ? activeIndex + 1 : 1;
  const currentLabel =
    activeIndex >= 0 ? PROFILE_FORM_SECTIONS[activeIndex].label : PROFILE_FORM_SECTIONS[0].label;

  return (
    <aside className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)]">
      <div>
        <p className="text-sm font-semibold text-zinc-950">Profile Intake</p>
        <p className="hidden mt-1 text-xs text-zinc-600 lg:block">
          Step {stepDisplay} of {PROFILE_FORM_SECTIONS.length}: {currentLabel}
        </p>
      </div>

      <nav
        className="mt-4 hidden rounded-xl bg-zinc-50 p-2 lg:block"
        aria-label="Form sections"
      >
        <ul className="grid gap-1">
          {PROFILE_FORM_SECTIONS.map((s) => {
            const active = s.id === activeSectionId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSectionNavigate(s.id)}
                  className={[
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-white font-semibold text-zinc-950 shadow-sm"
                      : "text-zinc-700 hover:bg-zinc-100/80",
                  ].join(" ")}
                  aria-current={active ? "location" : undefined}
                >
                  <span
                    className={[
                      "h-2 w-2 shrink-0 rounded-full",
                      active ? "bg-emerald-500" : "bg-zinc-300",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span>{s.label}</span>
                </button>
              </li>
            );
          })}
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
