import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="uz">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-6xl font-semibold text-brand">404</p>
        <p className="text-muted">Sahifa topilmadi / Страница не найдена / Not found</p>
        <Link
          href="/uz"
          className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Bosh sahifa
        </Link>
      </body>
    </html>
  );
}
