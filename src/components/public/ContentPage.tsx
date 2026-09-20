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
    <main className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111]">{title}</h1>
        <div className="mt-10 space-y-5 text-sm leading-relaxed text-[#404040] [&_a]:text-[#262626] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-black [&_h2]:text-[#111] [&_h3]:text-[#111]">
          {children}
        </div>
        <p className="mt-12 text-sm text-[#404040]">
          {SITE.address.full} · {SITE.email}
        </p>
      </div>
    </main>
  );
}
