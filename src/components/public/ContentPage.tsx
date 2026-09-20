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
    <main className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <p className="kicker">{kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted">{children}</div>
      <p className="mt-12 text-sm text-foreground">
        {SITE.address.full} · {SITE.email}
      </p>
    </main>
  );
}
