"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { ProspectoRow } from "@/lib/crm";

export function useProspectosSync(initialRows: ProspectoRow[]) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("crm-prospectos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prospectos" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const next = payload.new as ProspectoRow;
            setRows((current) => {
              if (current.some((row) => row.id === next.id)) {
                return current.map((row) => mergeProspecto(row, next));
              }
              return [next, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            const next = payload.new as ProspectoRow;
            setRows((current) =>
              current.map((row) =>
                row.id === next.id ? mergeProspecto(row, next) : row,
              ),
            );
          }

          if (payload.eventType === "DELETE") {
            const id = (payload.old as { id?: string }).id;
            setRows((current) => current.filter((row) => row.id !== id));
          }

          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  function upsert(record: ProspectoRow) {
    setRows((current) => {
      if (current.some((row) => row.id === record.id)) {
        return current.map((row) =>
          row.id === record.id ? mergeProspecto(row, record) : row,
        );
      }
      return [record, ...current];
    });
    router.refresh();
  }

  function move(id: string, estadoCrm: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, estado_crm: estadoCrm } : row,
      ),
    );
  }

  return { rows, upsert, move, setRows };
}

function mergeProspecto(current: ProspectoRow, next: ProspectoRow): ProspectoRow {
  return {
    ...current,
    ...next,
    vehiculo: next.vehiculo ?? current.vehiculo,
    repuesto: next.repuesto ?? current.repuesto,
    empresa: next.empresa ?? current.empresa,
  };
}
