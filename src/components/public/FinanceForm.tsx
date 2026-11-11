"use client";

import { useSearchParams } from "next/navigation";
import { FinanceSimulator } from "@/components/public/FinanceSimulator";

export function FinanceForm() {
  const params = useSearchParams();
  const price = Number(params.get("monto"));
  const down = Number(params.get("inicialDop"));
  return <FinanceSimulator priceUsd={Number.isFinite(price) && price > 0 ? price : 25000} downPaymentDop={params.has("inicialDop") && Number.isFinite(down) && down >= 0 ? down : null} />;
}
