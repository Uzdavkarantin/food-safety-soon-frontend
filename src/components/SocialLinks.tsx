import { siteConfig } from "@/config/site";

const socials = [
  { label: "Telegram", href: siteConfig.social.telegram },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "X", href: siteConfig.social.x },
];

export function SocialLinks({ label }: { label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap content-start gap-2.5">
      {socials.map(({ label: name, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-4 font-medium text-foreground transition-colors hover:border-accent hover:text-link"
        >
          {name}
        </a>
      ))}
    </nav>
  );
}
