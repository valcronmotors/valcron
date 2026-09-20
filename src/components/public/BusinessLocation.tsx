import { mapsDirectionsUrl, officeTelHref, SITE, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

type LocationVariant = "full" | "compact" | "cta";
type LocationTone = "light" | "dark";

function AddressBlock({ className, showName = true }: { className?: string; showName?: boolean }) {
  return (
    <address className={`not-italic ${className ?? ""}`}>
      {showName ? <p className="font-semibold">{SITE.facebookDisplay}</p> : null}
      <p className={showName ? "mt-1" : undefined}>
        {SITE.address.street}
        <br />
        {SITE.address.city}
        <br />
        {SITE.address.country}
      </p>
    </address>
  );
}

function LocationActions({
  tone,
  compact = false,
}: {
  tone: LocationTone;
  compact?: boolean;
}) {
  const light = tone === "light";
  const base =
    "inline-flex h-11 items-center justify-center rounded-[0.9rem] px-5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7A96B]";
  const primary = light
    ? "bg-[#111] text-white hover:bg-[#1c1c1c]"
    : "bg-white text-[#111] hover:bg-[#C7A96B]";
  const secondary = light
    ? "border border-[#111] text-[#111] hover:bg-[#111] hover:text-white"
    : "border border-white/20 text-white hover:bg-white/10";

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-6"}`}>
      <a
        href={mapsDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${primary}`}
      >
        Cómo llegar
      </a>
      <a
        href={whatsappHref("Hola, quiero coordinar una visita a Valcron Motors Group.")}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${secondary}`}
      >
        <WhatsAppIcon className="mr-2 h-3.5 w-3.5" />
        WhatsApp
      </a>
    </div>
  );
}

function GoogleBusinessMap({
  variant,
  tone,
}: {
  variant: "full" | "compact";
  tone: LocationTone;
}) {
  const frame =
    variant === "compact"
      ? "h-[180px] w-full min-w-0 sm:h-[200px] lg:h-[190px] lg:max-w-[360px]"
      : "h-[320px] w-full min-w-0 sm:h-[360px] lg:h-[480px]";

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        tone === "dark" ? "border-white/10 bg-[#0D0E10]" : "border-[#ececea] bg-[#111]"
      } ${frame}`}
    >
      <iframe
        title={SITE.maps.embedTitle}
        src={SITE.maps.embedSrc}
        className={`h-full w-full border-0 ${tone === "dark" ? "grayscale contrast-125" : ""}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function BusinessLocation({
  variant = "full",
  tone = "light",
  heading,
}: {
  variant?: LocationVariant;
  tone?: LocationTone;
  heading?: string;
}) {
  const light = tone === "light";

  if (variant === "compact") {
    return (
      <div className="min-w-0 w-full lg:max-w-[360px]">
        <GoogleBusinessMap variant="compact" tone={tone} />
        <a
          href={mapsDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.14em] ${
            light ? "text-[#111] hover:underline" : "text-[#C7A96B] hover:text-white"
          }`}
        >
          Cómo llegar
        </a>
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <aside
        className={`rounded-2xl border p-5 sm:p-6 ${
          light ? "border-[#ececea] bg-white text-[#404040]" : "border-white/10 bg-[#0D0E10] text-[#D4D4D4]"
        }`}
      >
        <p className={`text-sm font-semibold ${light ? "text-[#111]" : "text-white"}`}>
          {heading ?? "¿Necesitas asesoría para comprar o importar tu vehículo?"}
        </p>
        <p className="mt-3 text-sm">Visítanos en:</p>
        <AddressBlock className={`mt-2 text-sm ${light ? "text-[#111]" : "text-white"}`} />
        <LocationActions tone={tone} compact />
      </aside>
    );
  }

  return (
    <section className={light ? "section-light bg-[#faf9f6]" : "bg-[#050608]"}>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-5 py-14 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <p className="kicker">{heading ?? "Visítanos"}</p>
          <h2
            className={`mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl ${
              light ? "text-[#111]" : "text-white"
            }`}
          >
            {SITE.facebookDisplay}
          </h2>
          <AddressBlock className={`mt-5 text-sm leading-relaxed ${light ? "text-[#404040]" : "text-[#D4D4D4]"}`} showName={false} />
          <p className={`mt-5 text-sm ${light ? "text-[#404040]" : "text-[#D4D4D4]"}`}>
            Oficina{" "}
            <a className={light ? "text-[#111] hover:underline" : "text-white hover:underline"} href={officeTelHref()}>
              {SITE.officePhoneDisplay}
            </a>
          </p>
          <p className={`mt-2 text-sm ${light ? "text-[#404040]" : "text-[#D4D4D4]"}`}>
            WhatsApp{" "}
            <a
              className={light ? "text-[#111] hover:underline" : "text-white hover:underline"}
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE.whatsappDisplay}
            </a>
          </p>
          <LocationActions tone={tone} />
        </div>
        <div className="min-w-0">
          <GoogleBusinessMap variant="full" tone={tone} />
        </div>
      </div>
    </section>
  );
}
