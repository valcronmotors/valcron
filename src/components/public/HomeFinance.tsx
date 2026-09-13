"use client";

import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/money";
import type { PublicVehicle } from "@/lib/public-catalog";
import { publicVehicleTitle } from "@/lib/public-catalog";
import { monthlyPayment } from "@/lib/public-filters";
import { SITE, whatsappHref } from "@/lib/site";

const fieldClass = "field-input";

export function HomeFinance({ vehicles }: { vehicles: PublicVehicle[] }) {
  const priced = vehicles.filter((vehicle) => vehicle.precioVentaUsd > 0);
  const [vehicleId, setVehicleId] = useState(priced[0]?.id ?? "");
  const [downPct, setDownPct] = useState(20);
  const [plazo, setPlazo] = useState(48);

  const selected = priced.find((vehicle) => vehicle.id === vehicleId) ?? priced[0];
  const amount = selected?.precioVentaUsd ?? 25000;
  const down = Math.round(amount * (Math.max(downPct, 20) / 100));
  const financed = Math.max(amount - down, 0);
  const cuota = monthlyPayment(financed, plazo);

  const href = useMemo(
    () =>
      whatsappHref(
        [
          `Hola, solicito pre-evaluación bancaria con ${SITE.shortName}.`,
          selected ? `Vehículo: ${publicVehicleTitle(selected)}` : null,
          `Monto: ${formatUsd(amount)}`,
          `Inicial: ${formatUsd(down)} (${Math.max(downPct, 20)}%)`,
          `Plazo: ${plazo} meses`,
          `Cuota ilustrativa: ${formatUsd(cuota)} / mes`,
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    [amount, cuota, down, downPct, plazo, selected],
  );

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="kicker">Financiamiento</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Simula tu cuota
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Inicial desde 20% y plazos de 24 a 72 meses. La pre-evaluación se envía directo al
            WhatsApp {SITE.whatsapp}. La aprobación la define cada banco.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_12px_40px_rgba(11,12,16,0.05)] md:p-8">
          <label className="block text-sm text-muted">
            Vehículo
            <select
              value={selected?.id ?? ""}
              onChange={(event) => setVehicleId(event.target.value)}
              className={fieldClass}
            >
              {priced.length === 0 ? <option value="">USD 25,000 de referencia</option> : null}
              {priced.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {publicVehicleTitle(vehicle)} · {formatUsd(vehicle.precioVentaUsd)}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block text-sm text-muted">
            Inicial {Math.max(downPct, 20)}% · {formatUsd(down)}
            <input
              type="range"
              min={20}
              max={60}
              step={1}
              value={downPct}
              onChange={(event) => setDownPct(Number(event.target.value))}
              className="mt-4 w-full accent-accent"
            />
          </label>

          <label className="mt-5 block text-sm text-muted">
            Plazo
            <select
              value={plazo}
              onChange={(event) => setPlazo(Number(event.target.value))}
              className={fieldClass}
            >
              {[24, 36, 48, 60, 72].map((months) => (
                <option key={months} value={months}>
                  {months} meses
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 grid gap-3 rounded-xl border border-accent/35 bg-white p-4 sm:grid-cols-3">
            <div>
              <p className="kicker">Monto</p>
              <p className="mt-1 text-lg text-foreground">{formatUsd(amount)}</p>
            </div>
            <div>
              <p className="kicker">A financiar</p>
              <p className="mt-1 text-lg text-foreground">{formatUsd(financed)}</p>
            </div>
            <div>
              <p className="kicker">Cuota</p>
              <p className="mt-1 text-lg text-accent">{formatUsd(cuota)}</p>
            </div>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp mt-6 w-full"
          >
            Solicitar pre-evaluación por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
