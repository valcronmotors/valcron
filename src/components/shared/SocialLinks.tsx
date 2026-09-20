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
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#8134af" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="white" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2" />
      <path
        fill="white"
        d="M13.6 19v-6.2h2.1l.3-2.4h-2.4V8.9c0-.7.2-1.2 1.2-1.2h1.3V5.5c-.2 0-1-.1-2-1.1-1.1 0-1.9.7-1.9 2v1.9H10v2.4h2.1V19h1.5z"
      />
    </svg>
  );
}

const darkBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/5 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:border-white/25 hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none lg:h-12 lg:w-12";
const lightBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ececea] bg-white transition duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:border-[#C7A96B]/50 hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] motion-reduce:transform-none lg:h-12 lg:w-12";

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
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#25d366] text-white">
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
            <InstagramIcon className="h-6 w-6" gradientId={`${gradientId}-${item.id}`} />
          ) : (
            <FacebookIcon className="h-6 w-6" />
          )}
        </a>
      ))}
    </div>
  );
}

const footerSocialClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-[0.85rem] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none sm:h-11 sm:w-11 lg:h-12 lg:w-12";

export function FooterSocialIcons({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Redes sociales de Valcron Motors" className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${footerSocialClass} bg-[#25D366] text-white`}
        aria-label="WhatsApp de Valcron Motors"
      >
        <WhatsAppIcon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
      </a>
      <a
        href={SITE.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={footerSocialClass}
        aria-label="Instagram de Valcron Motors"
      >
        <InstagramIcon className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12" gradientId="footer-ig-gradient" />
      </a>
      <a
        href={SITE.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={footerSocialClass}
        aria-label="Facebook de Valcron Motors"
      >
        <FacebookIcon className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
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
