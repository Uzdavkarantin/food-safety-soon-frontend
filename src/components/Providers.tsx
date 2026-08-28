"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      scriptProps={{
        type:
          typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
    >
      {children}
    </ThemeProvider>
  );
}
