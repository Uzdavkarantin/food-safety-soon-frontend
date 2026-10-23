"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/Badge";
import type { Tone } from "@/config/services";
import { FormFields } from "./FormFields";
import type { ServiceForm } from "./types";

// Demo form + sample result. No network: submitting shows the result,
// the reset button restores the default values and hides it (as in the design).
export function ServiceDemo({
  form,
  resultTitle,
  badge,
  disclaimer,
  children,
}: {
  form: ServiceForm;
  resultTitle: string;
  badge: { label: string; tone: Tone };
  disclaimer: string;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(true);

  return (
    <>
      <section className="flex flex-col gap-5 rounded-[20px] border border-border bg-surface p-5 sm:p-7">
        <h2 className="font-heading text-[22px] font-bold">{form.title}</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setShown(true);
          }}
          onReset={() => setShown(false)}
        >
          <FormFields fields={form.fields} />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl bg-accent px-[22px] font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              {form.submit}
            </button>
            <button
              type="reset"
              className="inline-flex min-h-12 cursor-pointer items-center rounded-xl border border-border bg-surface px-[18px] font-semibold text-foreground transition-colors hover:border-accent"
            >
              {form.reset}
            </button>
          </div>
        </form>
      </section>

      {shown ? (
        <section
          aria-live="polite"
          className="flex flex-col gap-[18px] rounded-[20px] border border-border bg-surface p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-[22px] font-bold">{resultTitle}</h2>
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
          {children}
          <p className="text-sm text-muted">{disclaimer}</p>
        </section>
      ) : null}
    </>
  );
}
