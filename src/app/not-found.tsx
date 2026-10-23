import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="uz">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-accent">404</p>
        <p className="text-muted">Sahifa topilmadi / Страница не найдена / Not found</p>
        <Link
          href="/uz"
          className="inline-flex min-h-12 items-center rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-strong hover:text-white"
        >
          Bosh sahifa
        </Link>
      </body>
    </html>
  );
}
