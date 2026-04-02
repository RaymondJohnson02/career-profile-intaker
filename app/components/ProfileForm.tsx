"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ProfileFormInput } from "@/app/lib/profileSchema";
import type { UseFormReturn } from "react-hook-form";

import {
  areaOptions,
  highestEducationOptions,
  noticePeriodOptions,
  preferredWorkTypeOptions,
  skillOptions,
  targetRoleOptions,
} from "@/app/lib/options";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mt-6 scroll-mt-24 first:mt-0 lg:scroll-mt-28"
    >
      <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-[0_10px_30px_-28px_rgba(0,0,0,0.5)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-950 sm:text-xl">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm text-zinc-600">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
      </div>
    </section>
  );
}

function FieldShell({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-zinc-900">{label}</label>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function controlWrapperClassName(hasError: boolean) {
  return [
    "flex items-center rounded-md bg-zinc-50 pl-3",
    "outline outline-1 -outline-offset-1",
    "focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500",
    hasError ? "outline-red-300 focus-within:outline-red-500" : "outline-zinc-200",
  ].join(" ");
}

function inputClassName() {
  return [
    "block min-w-0 grow bg-transparent py-2 pr-3 pl-1 text-sm text-zinc-900",
    "placeholder:text-zinc-400 focus:outline-none",
  ].join(" ");
}

function textareaClassName(hasError: boolean) {
  return [
    "block w-full rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
    "outline outline-1 -outline-offset-1",
    "placeholder:text-zinc-400",
    "focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500",
    hasError ? "outline-red-300 focus:outline-red-500" : "outline-zinc-200",
  ].join(" ");
}

function selectClassName(hasError: boolean, isPlaceholder: boolean) {
  return [
    "col-start-1 row-start-1 w-full appearance-none rounded-md bg-zinc-50 py-2 pr-9 pl-3 text-sm",
    isPlaceholder ? "text-zinc-400" : "text-zinc-900",
    "outline outline-1 -outline-offset-1",
    "focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500",
    hasError ? "outline-red-300 focus:outline-red-500" : "outline-zinc-200",
  ].join(" ");
}

/** Text / number / textarea placeholders: "Input …" */
function phInput(fieldLabel: string) {
  return `Input ${fieldLabel}`;
}

/** Dropdown first option: "Choose …" */
function phChoose(fieldLabel: string) {
  return `Choose ${fieldLabel}`;
}

function SelectChevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-zinc-400 sm:size-4"
    >
      <path
        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="pointer-events-none ml-3 size-4 shrink-0 text-zinc-400"
    >
      <path
        fillRule="evenodd"
        d="M9.065 11.063a5.25 5.25 0 1 1 1.06-1.06l3.063 3.062a.75.75 0 1 1-1.06 1.06l-3.063-3.062ZM6.75 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SkillsSearchField({
  selectedSkills,
  hasError,
  onAdd,
  onRemove,
}: {
  selectedSkills: string[];
  hasError: boolean;
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pendingSkill, setPendingSkill] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const available = skillOptions.filter((s) => !selectedSkills.includes(s));
  const q = query.trim().toLowerCase();
  const filtered = q
    ? available.filter((s) => s.toLowerCase().includes(q))
    : available;

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (pendingSkill && !filtered.some((s) => s === pendingSkill)) {
      setPendingSkill(null);
    }
  }, [filtered, pendingSkill]);

  const commitAdd = () => {
    if (!pendingSkill) return;
    onAdd(pendingSkill);
    setPendingSkill(null);
    setQuery("");
  };

  const tagClassName = [
    "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
    "border-sky-200 bg-sky-50 text-sky-700",
  ].join(" ");

  return (
    <div className="grid gap-3">
      <div ref={rootRef} className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search skills
        </label>
        <div
          className={[
            "flex min-h-[2.5rem] items-center rounded-md bg-zinc-50",
            "outline outline-1 -outline-offset-1",
            hasError
              ? "outline-red-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-red-500"
              : [
                  "outline-zinc-200",
                  open
                    ? "outline-2 -outline-offset-2 outline-indigo-500"
                    : "focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500",
                ].join(" "),
          ].join(" ")}
        >
          <div className="flex min-w-0 flex-1 items-center">
            <SearchIcon />
            <input
              id={`${listId}-input`}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder="Search skills…"
              autoComplete="off"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              className={[
                inputClassName(),
                "min-h-[2.5rem] py-2.5 pl-2 pr-2",
                "[&::-webkit-search-cancel-button]:appearance-none",
              ].join(" ")}
            />
          </div>
          <div className="flex shrink-0 pr-1">
            <button
              type="button"
              disabled={!pendingSkill}
              onClick={commitAdd}
              className={[
                "h-9 shrink-0 rounded-md px-3 text-sm font-semibold transition-colors",
                pendingSkill
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400",
              ].join(" ")}
            >
              Add
            </button>
          </div>
        </div>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Skill results"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
          >
            {available.length === 0 ? (
              <li className="px-3 py-2 text-xs text-zinc-500" role="presentation">
                All listed skills are added.
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-zinc-500" role="presentation">
                No skills match your search.
              </li>
            ) : (
              filtered.map((skill) => {
                const selected = pendingSkill === skill;
                return (
                  <li key={skill} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      className={[
                        "flex w-full px-3 py-2 text-left text-sm",
                        selected
                          ? "bg-indigo-50 font-medium text-indigo-950"
                          : "text-zinc-900 hover:bg-zinc-50",
                      ].join(" ")}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setPendingSkill(skill);
                        setQuery(skill);
                      }}
                    >
                      {skill}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>

      {selectedSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Selected skills">
          {selectedSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={tagClassName}
              onClick={() => onRemove(skill)}
            >
              <span>{skill}</span>
              <span className="text-sky-500" aria-hidden="true">
                ×
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-500">
          No skills yet — search, pick one from the list, then click Add.
        </p>
      )}
    </div>
  );
}

export function ProfileForm({
  formId,
  form,
  onValidSubmit,
  isSubmittedSuccessfully,
  onStartOver,
}: {
  formId: string;
  form: UseFormReturn<ProfileFormInput>;
  onValidSubmit: (values: ProfileFormInput) => void;
  isSubmittedSuccessfully: boolean;
  onStartOver: () => void;
}) {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    watch,
    setValue,
  } = form;

  const selectedSkills = watch("skills") ?? [];
  const preferredWorkType = watch("preferredWorkType") ?? "";
  const areaValue = watch("area");
  const targetRoleValue = watch("targetRole");
  const highestEducationValue = watch("highestEducation");
  const noticePeriodValue = watch("noticePeriod");

  return (
    <form
      id={formId}
      className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] sm:p-8"
      onSubmit={handleSubmit(onValidSubmit)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
        Define Your Professional Narrative.
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        We treat your career history as a story. Fill in the details below to curate your
        professional identity.
      </p>

      <div className="mt-6">
        <Section id="profile-section-personal" title="Personal Info">
          <FieldShell label="Full name" error={errors.fullName?.message}>
            <div className={controlWrapperClassName(Boolean(errors.fullName))}>
              <input
                {...register("fullName")}
                className={inputClassName()}
                placeholder={phInput("full name")}
                autoComplete="name"
              />
            </div>
          </FieldShell>

          <FieldShell label="Email" error={errors.email?.message}>
            <div className={controlWrapperClassName(Boolean(errors.email))}>
              <input
                {...register("email")}
                className={inputClassName()}
                placeholder={phInput("email")}
                autoComplete="email"
                inputMode="email"
              />
            </div>
          </FieldShell>

          <FieldShell label="Phone number" error={errors.phoneNumber?.message as string | undefined}>
            <div className={controlWrapperClassName(Boolean(errors.phoneNumber))}>
              <input
                {...register("phoneNumber")}
                className={inputClassName()}
                placeholder={phInput("phone number")}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </FieldShell>

          <FieldShell label="Area" error={errors.area?.message}>
            <div className="mt-0.5 grid grid-cols-1">
              <select
                {...register("area")}
                className={selectClassName(Boolean(errors.area), !areaValue)}
                defaultValue=""
              >
                <option value="" disabled>
                  {phChoose("area")}
                </option>
                {areaOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </FieldShell>

          <FieldShell
            label="Address (optional)"
            hint="Max 100"
            error={errors.address?.message}
          >
            <div className={controlWrapperClassName(Boolean(errors.address))}>
              <input
                {...register("address")}
                className={inputClassName()}
                placeholder={phInput("address")}
                maxLength={100}
                autoComplete="street-address"
              />
            </div>
          </FieldShell>

          <div className="sm:col-span-2">
            <FieldShell
              label="Short bio"
              hint="Max 255"
              error={errors.shortBio?.message}
            >
              <textarea
                {...register("shortBio")}
                className={[textareaClassName(Boolean(errors.shortBio)), "h-24 resize-none"].join(
                  " "
                )}
                placeholder={phInput("short bio")}
                maxLength={255}
              />
            </FieldShell>
          </div>
        </Section>

        <Section id="profile-section-experience" title="Experience">
          <FieldShell label="Target role" error={errors.targetRole?.message}>
            <div className="mt-0.5 grid grid-cols-1">
              <select
                {...register("targetRole")}
                className={selectClassName(Boolean(errors.targetRole), !targetRoleValue)}
                defaultValue=""
              >
                <option value="" disabled>
                  {phChoose("target role")}
                </option>
                {targetRoleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </FieldShell>

          <FieldShell
            label="Years of experience"
            hint="0–40"
            error={errors.yearsOfExperience?.message}
          >
            <div className={controlWrapperClassName(Boolean(errors.yearsOfExperience))}>
              <input
                {...register("yearsOfExperience", { valueAsNumber: true })}
                className={inputClassName()}
                type="number"
                inputMode="numeric"
                min={0}
                max={40}
                placeholder={phInput("years of experience")}
              />
            </div>
          </FieldShell>

          <FieldShell label="Current company" error={errors.currentCompany?.message as string | undefined}>
            <div className={controlWrapperClassName(Boolean(errors.currentCompany))}>
              <input
                {...register("currentCompany")}
                className={inputClassName()}
                placeholder={phInput("current company")}
                autoComplete="organization"
              />
            </div>
          </FieldShell>

          <FieldShell label="Last position" error={errors.lastPosition?.message as string | undefined}>
            <div className={controlWrapperClassName(Boolean(errors.lastPosition))}>
              <input
                {...register("lastPosition")}
                className={inputClassName()}
                placeholder={phInput("last position")}
              />
            </div>
          </FieldShell>
        </Section>

        <Section id="profile-section-skills" title="Skills">
          <div className="sm:col-span-2">
            <FieldShell
              label="Skills / tags"
              hint={`${selectedSkills.length} selected`}
              error={errors.skills?.message as string | undefined}
            >
              <div
                className={[
                  "rounded-xl border bg-white p-3",
                  errors.skills ? "border-red-300" : "border-zinc-200",
                ].join(" ")}
              >
                <SkillsSearchField
                  selectedSkills={selectedSkills}
                  hasError={Boolean(errors.skills)}
                  onAdd={(skill) => {
                    if (selectedSkills.includes(skill)) return;
                    setValue("skills", [...selectedSkills, skill], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  onRemove={(skill) => {
                    setValue(
                      "skills",
                      selectedSkills.filter((s) => s !== skill),
                      { shouldValidate: true, shouldDirty: true }
                    );
                  }}
                />
              </div>
            </FieldShell>
          </div>
        </Section>

        <Section id="profile-section-education" title="Education">
          <FieldShell
            label="Highest education"
            error={errors.highestEducation?.message as string | undefined}
          >
            <div className="mt-0.5 grid grid-cols-1">
              <select
                {...register("highestEducation")}
                className={selectClassName(
                  Boolean(errors.highestEducation),
                  !highestEducationValue
                )}
                defaultValue=""
              >
                <option value="" disabled>
                  {phChoose("highest education")}
                </option>
                {highestEducationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </FieldShell>
          <div className="hidden sm:block" />
        </Section>

        <Section id="profile-section-preferences" title="Preferences">
          <FieldShell
            label="Preferred work type"
            error={errors.preferredWorkType?.message as string | undefined}
          >
            <div
              className={[
                "grid grid-cols-3 rounded-xl border bg-zinc-50 p-1",
                errors.preferredWorkType ? "border-red-300" : "border-zinc-200",
              ].join(" ")}
              role="radiogroup"
              aria-label="Preferred work type"
            >
              {preferredWorkTypeOptions.map((opt) => {
                const active = preferredWorkType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={[
                      "h-9 rounded-lg text-xs font-semibold transition-colors",
                      active
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900",
                    ].join(" ")}
                    onClick={() => {
                      setValue("preferredWorkType", opt.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FieldShell>

          <FieldShell
            label="Expected salary"
            error={errors.expectedSalary?.message as string | undefined}
          >
            <div className={controlWrapperClassName(Boolean(errors.expectedSalary))}>
              <input
                {...register("expectedSalary", { valueAsNumber: true })}
                className={inputClassName()}
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={phInput("expected salary")}
              />
            </div>
          </FieldShell>

          <FieldShell
            label="Notice period"
            error={errors.noticePeriod?.message as string | undefined}
          >
            <div className="mt-0.5 grid grid-cols-1">
              <select
                {...register("noticePeriod")}
                className={selectClassName(Boolean(errors.noticePeriod), !noticePeriodValue)}
                defaultValue=""
              >
                <option value="" disabled>
                  {phChoose("notice period")}
                </option>
                {noticePeriodOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </FieldShell>
        </Section>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        {isSubmittedSuccessfully ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Submitted. HR can now review your profile.
          </div>
        ) : (
          <p className="text-xs text-zinc-500">
            Your data is not saved yet (Supabase will be added later).
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Start over
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={[
              "inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold shadow-sm",
              !isValid || isSubmitting
                ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                : "bg-[#0f2a4a] text-white hover:bg-[#0b223b]",
            ].join(" ")}
          >
            {isSubmitting ? "Publishing…" : "Publish Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

