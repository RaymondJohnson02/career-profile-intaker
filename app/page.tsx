"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CompletenessMeter } from "@/app/components/CompletenessMeter";
import { ProfileForm } from "@/app/components/ProfileForm";
import { SaveProfileModals, type SaveResultPhase } from "@/app/components/SaveProfileModals";
import { computeCompleteness } from "@/app/lib/completeness";
import { PROFILE_FORM_SECTIONS, type ProfileFormSectionId } from "@/app/lib/profileSections";
import { profileSchema, type ProfileFormInput, type ProfileFormValues } from "@/app/lib/profileSchema";

const defaultValues: ProfileFormInput = {
  fullName: "",
  email: "",
  phoneNumber: "",
  area: "",
  address: "",
  shortBio: "",

  targetRole: "",
  yearsOfExperience: 0,
  currentCompany: "",
  lastPosition: "",

  skills: [],
  highestEducation: "",
  preferredWorkType: "",
  expectedSalary: 0,
  noticePeriod: "",
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<ProfileFormSectionId>(
    PROFILE_FORM_SECTIONS[0].id
  );
  const formId = "career-profile-intake-form";

  const [pendingSave, setPendingSave] = useState<ProfileFormValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultPhase, setResultPhase] = useState<SaveResultPhase>(null);

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues,
  });

  const saveFlowLocked = confirmOpen || resultPhase !== null;

  const requestSave = useCallback((rawValues: ProfileFormInput) => {
    const values = profileSchema.parse(rawValues);
    setPendingSave(values);
    setConfirmOpen(true);
  }, []);

  const performSave = useCallback(async (values: ProfileFormValues) => {
    setConfirmOpen(false);
    setResultPhase("loading");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        const message =
          typeof body.error === "string"
            ? body.error
            : "Could not save your profile. Please try again.";
        if (body.code === "EMAIL_DUPLICATE") {
          form.setError("email", { message });
        }
        setResultPhase({ type: "error", message });
        return;
      }
      setSubmitted(true);
      setResultPhase("success");
    } catch {
      setResultPhase({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }, [form]);

  const handleConfirmSave = useCallback(() => {
    if (pendingSave) void performSave(pendingSave);
  }, [pendingSave, performSave]);

  const handleCancelConfirm = useCallback(() => {
    setConfirmOpen(false);
    setPendingSave(null);
  }, []);

  const handleDismissResult = useCallback(() => {
    setResultPhase(null);
    setPendingSave(null);
  }, []);

  const values = useWatch({ control: form.control });

  const completeness = useMemo(() => computeCompleteness(values ?? {}), [values]);

  /** While true, ignore scroll-spy updates (avoids fighting smooth scroll from nav clicks). */
  const scrollSpyPausedRef = useRef(false);
  const navigationGenRef = useRef(0);

  const syncActiveSectionFromScroll = useCallback(() => {
    if (scrollSpyPausedRef.current) return;
    const triggerLine = window.innerHeight * 0.35;
    let chosen: ProfileFormSectionId = PROFILE_FORM_SECTIONS[0].id;
    for (let i = PROFILE_FORM_SECTIONS.length - 1; i >= 0; i--) {
      const id = PROFILE_FORM_SECTIONS[i].id;
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= triggerLine) {
        chosen = id;
        break;
      }
    }
    setActiveSectionId((prev) => (prev === chosen ? prev : chosen));
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncActiveSectionFromScroll);
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    onScrollOrResize();
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, [syncActiveSectionFromScroll]);

  const navigateToSection = useCallback(
    (id: ProfileFormSectionId) => {
      navigationGenRef.current += 1;
      const gen = navigationGenRef.current;
      scrollSpyPausedRef.current = true;
      setActiveSectionId(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

      let completed = false;
      const finishProgrammaticScroll = () => {
        if (completed || navigationGenRef.current !== gen) return;
        completed = true;
        scrollSpyPausedRef.current = false;
        syncActiveSectionFromScroll();
      };

      const fallbackMs = 750;
      const t = window.setTimeout(finishProgrammaticScroll, fallbackMs);
      if ("onscrollend" in window) {
        window.addEventListener(
          "scrollend",
          () => {
            window.clearTimeout(t);
            finishProgrammaticScroll();
          },
          { once: true }
        );
      }
    },
    [syncActiveSectionFromScroll]
  );

  return (
    <div className="min-h-full bg-[#f6f7fb]">
      <SaveProfileModals
        confirmOpen={confirmOpen}
        onConfirmSave={handleConfirmSave}
        onCancelConfirm={handleCancelConfirm}
        resultPhase={resultPhase}
        onDismissResult={handleDismissResult}
      />

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
                type="button"
                aria-busy={resultPhase === "loading"}
                onClick={() => void form.handleSubmit(requestSave)()}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-900 px-3 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                {resultPhase === "loading" ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-zinc-200/70" />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="order-1 mb-4 lg:mb-0 lg:sticky lg:top-6">
            <CompletenessMeter
              result={completeness}
              activeSectionId={activeSectionId}
              onSectionNavigate={navigateToSection}
            />
          </div>

          <div className="lg:order-2">
            <ProfileForm
              formId={formId}
              form={form}
              isSubmittedSuccessfully={submitted}
              saveFlowLocked={saveFlowLocked}
              onValidSubmit={requestSave}
              onStartOver={() => {
                setSubmitted(false);
                setConfirmOpen(false);
                setPendingSave(null);
                setResultPhase(null);
                form.reset(defaultValues);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
