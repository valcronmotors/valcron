import Image from "next/image";
import { PageContainer } from "@/components/public/layout";

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
  className = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <section
      className={`section-dark relative isolate min-h-[42vh] overflow-hidden md:min-h-[50vh] ${className}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        fetchPriority="high"
        quality={70}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/92 via-[#08090b]/62 to-[#08090b]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
      <PageContainer className="relative flex min-h-[42vh] items-end pb-10 pt-16 md:min-h-[50vh] md:pb-14 md:pt-20">
        <div className="max-w-[40rem]">
          <p className="kicker">{kicker}</p>
          <h1 className="display-xl mt-4 text-balance text-white">{title}</h1>
          <p className="mt-5 max-w-[36rem] text-[length:var(--text-body-lg)] leading-[1.55] text-white/75">
            {subtitle}
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
