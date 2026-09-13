import { LandingCostCalculator } from "@/components/admin/LandingCostCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora Landing Cost",
};

export default function LandingCostPage() {
  return <LandingCostCalculator />;
}
