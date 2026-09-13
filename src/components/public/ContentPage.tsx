import { PublicShell } from "@/components/public/SiteChrome";
import { SITE } from "@/lib/site";

export function ContentPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PublicShell>
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl text-[#F4F5F7]">{title}</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-[#8A909A]">{children}</div>
        <p className="mt-10 text-sm text-[#F4F5F7]">
          {SITE.address.full} · {SITE.email}
        </p>
      </main>
    </PublicShell>
  );
}
