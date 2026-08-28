import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="flex flex-col gap-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} food-safety.uz. {t("footer.rights")}.
        </p>
        <SocialLinks />
      </Container>
    </footer>
  );
}
