import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import { PageContainer } from "@/components/public/layout";
import { GOOGLE_BUSINESS_PROFILE as profile, REAL_DELIVERY_PHOTOS } from "@/lib/valcron-trust";

export function HomeTrust() {
  return <section className="section-light border-y border-[#e8eaed] bg-white py-8" aria-label="Reseñas reales de Valcron">
    <PageContainer>
      <div className="flex flex-col gap-5 rounded-2xl border border-[#e4e6ea] bg-[#f8f7f5] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#676a70]">Conoce la experiencia Valcron</p>
          <h2 className="mt-2 text-2xl font-bold text-[#08090b]">Opiniones reales en Google</h2>
          <p className="mt-2 text-sm text-[#676a70]">{profile.name} · Santo Domingo Este</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-bold text-[#08090b]"><span>{profile.rating.toFixed(1)}/5</span><span className="flex text-[#ec752f]" aria-label="5 de 5 estrellas">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />)}</span><span className="text-sm font-normal">{profile.reviewCount} reseñas en Google</span></p>
          <p className="mt-1 text-xs text-[#676a70]">Verificado el {profile.verifiedOn}.</p>
        </div>
        <a href={profile.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#08090b] px-5 text-sm font-semibold text-white">Ver reseñas en Google <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
      {REAL_DELIVERY_PHOTOS.length > 0 ? <div className="mt-6 grid gap-4 sm:grid-cols-3">{REAL_DELIVERY_PHOTOS.map(photo => <figure key={photo.src}><Image src={photo.src} alt={photo.alt} width={720} height={540} sizes="(max-width:640px) 90vw, 30vw" className="aspect-[4/3] w-full rounded-xl object-cover" /><figcaption className="mt-2 text-sm text-[#676a70]">{photo.caption}</figcaption></figure>)}</div> : null}
    </PageContainer>
  </section>;
}
