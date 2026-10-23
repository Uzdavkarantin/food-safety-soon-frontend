import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="flex max-w-lg flex-col items-center py-24 text-center">
      <p className="font-heading text-6xl font-extrabold tracking-tight text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("text")}</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-accent px-5 font-semibold text-white transition-colors hover:bg-accent-strong hover:text-white"
      >
        {t("home")}
      </Link>
    </Container>
  );
}
