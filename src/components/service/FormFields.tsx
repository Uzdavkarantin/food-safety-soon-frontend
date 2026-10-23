"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/icons/Icon";
import type { FormField } from "./types";

const labelClass = "flex min-w-0 flex-col gap-2 text-[15px] font-medium";
const controlClass =
  "box-border w-full rounded-[10px] border border-border bg-surface px-3.5 text-[15px] font-normal text-foreground focus:border-accent focus:shadow-[0_0_0_3px_rgba(31,86,196,0.18)] focus:outline-none";

function FileField({ field }: { field: Extract<FormField, { type: "file" }> }) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // The native form reset clears the input; clear the shown file name with it.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const clear = () => setName("");
    form.addEventListener("reset", clear);
    return () => form.removeEventListener("reset", clear);
  }, []);

  return (
    <label htmlFor={field.id} className={labelClass}>
      {field.label}
      <span className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-accent-border bg-surface-soft p-5 text-center font-normal text-muted">
        <Icon className="h-7 w-7 text-link">
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </Icon>
        <span>{name || field.hint}</span>
        {/* Local only: the file is never uploaded anywhere. */}
        <input
          ref={inputRef}
          id={field.id}
          name={field.id}
          type="file"
          accept="image/*"
          onChange={(e) => setName(e.target.files?.[0]?.name ?? "")}
          className="max-w-full py-2 text-sm text-foreground"
        />
      </span>
    </label>
  );
}

function Control({ field }: { field: FormField }) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={field.id}
          name={field.id}
          defaultValue={field.value}
          className={`${controlClass} min-h-28 resize-y py-3 leading-normal`}
        />
      );
    case "select":
      return (
        <span className="relative">
          <select
            id={field.id}
            name={field.id}
            className={`${controlClass} min-h-12 cursor-pointer appearance-none py-[11px] pr-11 leading-snug`}
          >
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 h-[18px] w-[18px] -translate-y-1/2 text-muted"
          />
        </span>
      );
    case "file":
      return null;
    default:
      return (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          defaultValue={field.value}
          min={field.type === "number" ? 0 : undefined}
          className={`${controlClass} min-h-12 py-[11px] leading-snug`}
        />
      );
  }
}

// Textarea and file fields span the full width; the rest share one auto-fit grid.
export function FormFields({ fields }: { fields: FormField[] }) {
  const wide = fields.filter((f) => f.type === "textarea" || f.type === "file");
  const grid = fields.filter((f) => f.type !== "textarea" && f.type !== "file");

  return (
    <>
      {wide.map((field) =>
        field.type === "file" ? (
          <FileField key={field.id} field={field} />
        ) : (
          <label key={field.id} htmlFor={field.id} className={labelClass}>
            {field.label}
            <Control field={field} />
          </label>
        ),
      )}
      {grid.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5">
          {grid.map((field) => (
            <label key={field.id} htmlFor={field.id} className={labelClass}>
              {field.label}
              <Control field={field} />
            </label>
          ))}
        </div>
      ) : null}
    </>
  );
}
