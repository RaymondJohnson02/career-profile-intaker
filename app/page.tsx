"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CompletenessMeter } from "@/app/components/CompletenessMeter";
import { ProfileForm } from "@/app/components/ProfileForm";
import { computeCompleteness } from "@/app/lib/completeness";
import { profileSchema, type ProfileFormInput, type ProfileFormValues } from "@/app/lib/profileSchema";

const defaultValues: ProfileFormInput = {
  fullName: "",
  email: "",
  targetRole: "",
  yearsOfExperience: 0,
  skills: [],
  shortBio: "",
  area: "",
  address: "",
  preferredWorkType: "",
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const formId = "career-profile-intake-form";

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues,
  });

  const values = useWatch({ control: form.control });

  const completeness = useMemo(() => computeCompleteness(values ?? {}), [values]);

  return (
    <div className="min-h-full bg-[#f6f7fb]">
      <header className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-sm">
                CPI
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-zinc-950 sm:text-base">
                  Career Profile Intake
                </h1>
                <p className="mt-0.5 text-xs text-zinc-600 sm:text-sm">
                  Define your professional narrative and track completeness.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="submit"
                form={formId}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-900 px-3 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-zinc-200/70" />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="lg:order-1 lg:sticky lg:top-6">
            <CompletenessMeter result={completeness} />
          </div>

          <div className="lg:order-2">
            <ProfileForm
              formId={formId}
              form={form}
              isSubmittedSuccessfully={submitted}
              onValidSubmit={(rawValues) => {
                profileSchema.parse(rawValues);
                setSubmitted(true);
              }}
              onStartOver={() => {
                setSubmitted(false);
                form.reset(defaultValues);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
