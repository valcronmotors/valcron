"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft } from "lucide-react";
import { linkInventoryVehicleToAuction } from "@/app/actions/vehicles";
import { AdminError, AdminInput, AdminPrimaryButton, AdminSelect } from "@/components/admin/ui";
export function AdminConvertVehicleToAuctionButton({vehicleId}:{vehicleId:string}) {
 const router=useRouter(); const [provider,setProvider]=useState<"copart"|"iaa"|"manheim"|"other">("copart"); const [lot,setLot]=useState(""); const [error,setError]=useState<string|null>(null); const [pending,startTransition]=useTransition();
 function convert(){setError(null);startTransition(async()=>{const result=await linkInventoryVehicleToAuction(vehicleId,lot,provider);if(result.error){setError(result.error);if(result.id)router.push(`/admin/subastas/${result.id}`);return;}if(result.id)router.push(`/admin/subastas/${result.id}`);router.refresh();});}
 return <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] sm:items-end">
 <label className="grid gap-1 text-sm font-medium text-[var(--admin-text)]">Casa de subasta<AdminSelect value={provider} onChange={e=>setProvider(e.target.value as typeof provider)}><option value="copart">Copart</option><option value="iaa">IAAI</option><option value="manheim">Manheim</option><option value="other">Otra</option></AdminSelect></label>
 <label className="grid gap-1 text-sm font-medium text-[var(--admin-text)]">Número de lote<AdminInput value={lot} onChange={e=>setLot(e.target.value)} placeholder="Ej. 50669396" maxLength={80}/></label>
 <AdminPrimaryButton type="button" disabled={pending||!lot.trim()} onClick={convert}><ArrowRightLeft className="mr-2 h-4 w-4"/>{pending?"Vinculando…":"Vincular oportunidad"}</AdminPrimaryButton><div className="sm:col-span-3"><AdminError message={error}/></div></div>;
}
