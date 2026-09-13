"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SALE_CHANNEL_BADGE, VEHICLE_STATE_BADGE } from "@/lib/badges";
import { normalizeSaleChannel, type SaleChannel } from "@/lib/parts";
import { isVehicleState, type VehicleState } from "@/lib/vehicle-costs";

const fallbackBadge = "bg-white/10 text-slate-300 ring-white/15";

export function VehicleStatusBadge({ estado }: { estado: string | null }) {
  const value = estado && isVehicleState(estado) ? estado : null;
  const className = value ? VEHICLE_STATE_BADGE[value] : fallbackBadge;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}
    >
      {estado || "Sin estado"}
    </span>
  );
}

export function SaleChannelBadge({ channel }: { channel: string }) {
  const normalized = normalizeSaleChannel(channel);
  const className = normalized
    ? SALE_CHANNEL_BADGE[normalized]
    : fallbackBadge;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}
    >
      {normalized ?? channel}
    </span>
  );
}

export function SaleChannelBadges({
  channels,
}: {
  channels: string[] | null | undefined;
}) {
  const items = (channels ?? [])
    .map((channel) => normalizeSaleChannel(channel))
    .filter((channel): channel is SaleChannel => channel !== null);

  if (items.length === 0) {
    return <span className="text-slate-500">—</span>;
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((channel) => (
        <SaleChannelBadge key={channel} channel={channel} />
      ))}
    </span>
  );
}

export function VehicleStatusFilterPills({
  value,
  onChange,
}: {
  value: "todos" | VehicleState;
  onChange: (value: "todos" | VehicleState) => void;
}) {
  const options: Array<"todos" | VehicleState> = [
    "todos",
    "En Subasta",
    "En Tránsito",
    "En Taller",
    "Disponible",
    "Vendido",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
              selected
                ? "bg-cyan-400 text-slate-950 ring-cyan-300"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            }`}
          >
            {option === "todos" ? "Todos" : option}
          </button>
        );
      })}
    </div>
  );
}

export function VehicleLink({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/vehiculos/${id}`}
      className="text-cyan-300 hover:text-cyan-200"
    >
      {children}
    </Link>
  );
}
