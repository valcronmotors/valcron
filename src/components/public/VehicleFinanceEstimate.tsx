import { formatDecimal } from "@/lib/money";
import { vehicleFinanceEstimate } from "@/lib/vehicle-finance";
import type { PublicVehicle } from "@/types/vehicle";

export function VehicleFinanceEstimate({ vehicle, compact = false }: { vehicle: PublicVehicle; compact?: boolean }) {
  const estimate = vehicleFinanceEstimate(vehicle);
  if (!estimate) return null;
  return (
    <div className="mt-3 rounded-xl border border-[#edddd1] bg-[#fff7f0] p-3 text-[#24211f]">
      {estimate.explicitDownPayment ? <p className="text-sm font-semibold">Inicial: RD${formatDecimal(estimate.downPaymentDop, 0)}</p> : null}
      <p className="text-sm font-semibold">Cuota estimada desde RD${formatDecimal(Math.ceil(estimate.monthlyDop), 0)}/mes</p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#676a70]">
        {estimate.months} meses · tasa ilustrativa {estimate.annualRate * 100}% anual.
        {!estimate.explicitDownPayment ? ` Inicial estimada de RD$${formatDecimal(estimate.downPaymentDop, 0)}.` : ""}
        {!compact ? ` Cambio ilustrativo RD$${estimate.exchangeRate}/US$1. Cuota estimada, sujeta a evaluación y aprobación bancaria; confirma la cotización final.` : " Sujeta a aprobación bancaria y cotización final."}
      </p>
    </div>
  );
}
