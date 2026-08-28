import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="flex max-w-lg flex-col items-center py-24 text-center">
      <p className="text-6xl font-semibold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 text-muted">{t("text")}</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
      >
        {t("home")}
      </Link>
    </Container>
  );
}
