"use client";

import type { ProfileFormInput } from "@/app/lib/profileSchema";
import type { UseFormReturn } from "react-hook-form";

import {
  areaOptions,
  preferredWorkTypeOptions,
  skillOptions,
  targetRoleOptions,
} from "@/app/lib/options";

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

function baseInputClassName(hasError: boolean) {
  return [
    "h-10 w-full border-b bg-transparent px-0 text-sm text-zinc-950 outline-none",
    "placeholder:text-zinc-400",
    "focus:border-zinc-400",
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-zinc-200",
  ].join(" ");
}

function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldShell label="Full name" error={errors.fullName?.message}>
            <input
              {...register("fullName")}
              className={baseInputClassName(Boolean(errors.fullName))}
              placeholder="e.g. Raymond Smith"
              autoComplete="name"
            />
          </FieldShell>
        </div>

        <div className="sm:col-span-2">
          <FieldShell label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              className={baseInputClassName(Boolean(errors.email))}
              placeholder="e.g. raymond@email.com"
              autoComplete="email"
              inputMode="email"
            />
          </FieldShell>
        </div>

        <FieldShell label="Target role" error={errors.targetRole?.message}>
          <select
            {...register("targetRole")}
            className={baseInputClassName(Boolean(errors.targetRole))}
            defaultValue=""
          >
            <option value="" disabled>
              Select a role
            </option>
            {targetRoleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          label="Years of experience"
          hint="0–40"
          error={errors.yearsOfExperience?.message}
        >
          <input
            {...register("yearsOfExperience", { valueAsNumber: true })}
            className={baseInputClassName(Boolean(errors.yearsOfExperience))}
            type="number"
            inputMode="numeric"
            min={0}
            max={40}
            placeholder="e.g. 3"
          />
        </FieldShell>

        <div className="sm:col-span-2">
          <FieldShell
            label="Skills & expertise"
            hint={`${selectedSkills.length} selected`}
            error={errors.skills?.message as string | undefined}
          >
            <div
              className={[
                "rounded-xl border bg-white p-3",
                errors.skills ? "border-red-300" : "border-zinc-200",
              ].join(" ")}
            >
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => {
                  const checked = selectedSkills.includes(skill);
                  return (
                    <label
                      key={skill}
                      className={[
                        "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                        checked
                          ? "border-sky-200 bg-sky-50 text-sky-700"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => {
                          setValue(
                            "skills",
                            toggleInArray(selectedSkills, skill),
                            { shouldValidate: true, shouldDirty: true }
                          );
                        }}
                      />
                      <span>{skill}</span>
                      {checked ? (
                        <span className="text-sky-500" aria-hidden="true">
                          ×
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          </FieldShell>
        </div>

        <div className="sm:col-span-2">
          <FieldShell
            label="Short bio"
            hint="Max 255"
            error={errors.shortBio?.message}
          >
            <textarea
              {...register("shortBio")}
              className={[
                baseInputClassName(Boolean(errors.shortBio)),
                "h-24 resize-none py-2.5",
              ].join(" ")}
              placeholder="A short intro about your background, strengths, and what you're looking for."
              maxLength={255}
            />
          </FieldShell>
        </div>

        <FieldShell label="Area" error={errors.area?.message}>
          <select
            {...register("area")}
            className={baseInputClassName(Boolean(errors.area))}
            defaultValue=""
          >
            <option value="" disabled>
              Select an area
            </option>
            {areaOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          label="Preferred work type"
          error={errors.preferredWorkType?.message}
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
                    active ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
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

        <div className="sm:col-span-2">
          <FieldShell
            label="Address"
            hint="Max 100"
            error={errors.address?.message}
          >
            <input
              {...register("address")}
              className={baseInputClassName(Boolean(errors.address))}
              placeholder="e.g. City, Country"
              maxLength={100}
              autoComplete="street-address"
            />
          </FieldShell>
        </div>
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

