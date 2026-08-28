"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function diff(target: number) {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function Countdown({ date }: { date: string }) {
  const t = useTranslations("countdown");
  const target = new Date(date).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (Number.isNaN(target)) return null;

  const units: Array<[keyof typeof time, string]> = [
    ["days", t("days")],
    ["hours", t("hours")],
    ["minutes", t("minutes")],
    ["seconds", t("seconds")],
  ];

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-4">
        {units.map(([key, label]) => (
          <li
            key={key}
            className="min-w-0 rounded-xl border border-border bg-surface px-3 py-2 text-center"
          >
            <span className="block text-2xl font-semibold tabular-nums text-foreground">
              {String(time[key]).padStart(2, "0")}
            </span>
            <span className="block text-xs uppercase tracking-wide text-muted">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
