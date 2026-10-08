"use client";

import { useId } from "react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { configuredSocialLinks, SITE, whatsappHref } from "@/lib/site";

function InstagramIcon({ className, gradientId }: { className?: string; gradientId: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="45%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="17.15" cy="6.85" r="1.15" fill="#fff" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.55 19.2v-5.95h2l.3-2.32h-2.3V9.35c0-.67.18-1.13 1.15-1.13h1.23V6.15c-.21-.03-.94-.09-1.79-.09-1.77 0-2.98 1.08-2.98 3.06v1.71H9.1v2.32h2.06v5.95h2.39z"
      />
    </svg>
  );
}

const darkBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none";
const lightBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e4e6ea] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#2B6CFF]/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] motion-reduce:transform-none";

const iconClass = "h-[1.375rem] w-[1.375rem]";

export function SocialLinks({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const extra = configuredSocialLinks();
  const boxClass = tone === "light" ? lightBox : darkBox;
  const gradientId = `ig-${useId().replace(/:/g, "")}`;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className={boxClass}
        aria-label="WhatsApp de Valcron Motors"
      >
        <span className="inline-flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-[0.35rem] bg-[#25D366] text-white">
          <WhatsAppIcon className="h-3.5 w-3.5" />
        </span>
      </a>
      {extra.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={boxClass}
          aria-label={item.label}
        >
          {item.id === "instagram" ? (
            <InstagramIcon className={iconClass} gradientId={`${gradientId}-${item.id}`} />
          ) : (
            <FacebookIcon className={iconClass} />
          )}
        </a>
      ))}
    </div>
  );
}

/** Footer social row — equal 44px targets, sharp SVG brand marks, gloss-black contrast. */
const footerSocialClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.06] text-white transition duration-200 hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function FooterSocialIcons({ className = "" }: { className?: string }) {
  const gradientId = `footer-ig-${useId().replace(/:/g, "")}`;

  return (
    <nav
      aria-label="Redes sociales de Valcron Motors"
      className={`flex items-center gap-3 ${className}`}
    >
      <a
        href={SITE.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={footerSocialClass}
        aria-label="Facebook de Valcron Motors"
      >
        <FacebookIcon className={iconClass} />
      </a>
      <a
        href={SITE.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={footerSocialClass}
        aria-label="Instagram de Valcron Motors"
      >
        <InstagramIcon className={iconClass} gradientId={gradientId} />
      </a>
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={footerSocialClass}
        aria-label="WhatsApp de Valcron Motors"
      >
        <span className="inline-flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-[0.35rem] bg-[#25D366] text-white">
          <WhatsAppIcon className="h-3.5 w-3.5" />
        </span>
      </a>
    </nav>
  );
}

export function SocialFollowBlock({ className = "" }: { className?: string }) {
  return <FooterSocialIcons className={className} />;
}

export function hasConfiguredSocialNetworks() {
  return Boolean(SITE.instagramUrl || SITE.facebookUrl);
}
