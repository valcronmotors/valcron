import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/public/layout";

export function HomeSignatureBlue() {
  return (
    <Section className="section-accent" tight>
      <PageContainer>
        <div className="mx-auto max-w-[34rem] text-center">
          <h2 className="display-lg text-balance text-white">
            ¿No encuentras
            <span className="block">el vehículo que buscas?</span>
          </h2>
          <p className="mt-4 text-[length:var(--text-body-lg)] text-white/85">
            Dinos cuál buscas.
          </p>
          <Link href="/solicitar-vehiculo" className="btn-primary mt-7">
            Solicitar vehículo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
}
