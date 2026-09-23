import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { SITE, mapsDirectionsUrl, officeTelHref } from "@/lib/site";

export function HomeLocation() {
  return (
    <section className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="kicker">Ubicación</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111] sm:text-5xl">
          Visítanos en
          <span className="block">Santo Domingo Este.</span>
        </h2>
        <div className="mt-10 max-w-xl">
          <p className="flex gap-3 text-sm leading-relaxed text-[#525252]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C7A96B]" aria-hidden="true" />
            <span>
              <span className="block font-medium text-[#111]">{SITE.facebookDisplay}</span>
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.country}
            </span>
          </p>
          <p className="mt-5 flex gap-3 text-sm text-[#525252]">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C7A96B]" aria-hidden="true" />
            <a href={officeTelHref()} className="hover:text-[#111] hover:underline">
              {SITE.officePhoneDisplay}
            </a>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-primary">
              Ir a contacto
            </Link>
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
