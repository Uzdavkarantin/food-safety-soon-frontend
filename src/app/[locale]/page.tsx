import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TechSection } from "@/components/home/TechSection";
import { NumbersSection } from "@/components/home/NumbersSection";
import { JourneySection } from "@/components/home/JourneySection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Hero />
      <ServicesSection />
      <TechSection />
      <NumbersSection />
      <JourneySection />
    </>
  );
}
