"use client";

import type { ReactNode } from "react";

export type SaveResultPhase = null | "loading" | "success" | { type: "error"; message: string };

function ModalBackdrop({
  children,
  onBackdropClick,
}: {
  children: ReactNode;
  onBackdropClick?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onBackdropClick}
    >
      {children}
    </div>
  );
}

export function SaveProfileModals({
  confirmOpen,
  onConfirmSave,
  onCancelConfirm,
  resultPhase,
  onDismissResult,
}: {
  confirmOpen: boolean;
  onConfirmSave: () => void;
  onCancelConfirm: () => void;
  resultPhase: SaveResultPhase;
  onDismissResult: () => void;
}) {
  return (
    <>
      {confirmOpen ? (
        <ModalBackdrop onBackdropClick={onCancelConfirm}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-confirm-title"
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="save-confirm-title" className="text-lg font-semibold text-zinc-950">
              Save profile?
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Your answers will be sent to Supabase for HR review. Continue?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onCancelConfirm}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmSave}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                Save
              </button>
            </div>
          </div>
        </ModalBackdrop>
      ) : null}

      {resultPhase !== null ? (
        <ModalBackdrop
          onBackdropClick={
            resultPhase === "loading"
              ? undefined
              : () => {
                  onDismissResult();
                }
          }
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="save-result-title"
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {resultPhase === "loading" ? (
              <>
                <h2 id="save-result-title" className="text-lg font-semibold text-zinc-950">
                  Saving…
                </h2>
                <p className="mt-2 text-sm text-zinc-600">Sending your profile to the server.</p>
                <div className="mt-6 flex justify-center">
                  <div
                    className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900"
                    aria-hidden="true"
                  />
                </div>
              </>
            ) : resultPhase === "success" ? (
              <>
                <h2 id="save-result-title" className="text-lg font-semibold text-emerald-900">
                  Saved successfully
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Your profile was stored. HR can review it in Supabase.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onDismissResult}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="save-result-title" className="text-lg font-semibold text-red-900">
                  Save failed
                </h2>
                <p className="mt-2 text-sm leading-6 text-red-800/90">{resultPhase.message}</p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onDismissResult}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </ModalBackdrop>
      ) : null}
    </>
  );
}
