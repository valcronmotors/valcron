"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type InventoryTable = "vehiculos" | "repuestos";

export function useInventorySync<T extends { id: string }>(
  table: InventoryTable,
  initialRows: T[],
) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [baseline, setBaseline] = useState(initialRows);

  if (initialRows !== baseline) {
    setBaseline(initialRows);
    setRows(initialRows);
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`inventory-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const next = payload.new as T;
            setRows((current) => {
              if (current.some((row) => row.id === next.id)) {
                return current.map((row) =>
                  row.id === next.id ? { ...row, ...next } : row,
                );
              }
              return [next, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            const next = payload.new as T;
            setRows((current) =>
              current.map((row) =>
                row.id === next.id ? { ...row, ...next } : row,
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
  }, [router, table]);

  function upsert(record: T) {
    setRows((current) => {
      if (current.some((row) => row.id === record.id)) {
        return current.map((row) => (row.id === record.id ? record : row));
      }
      return [record, ...current];
    });
    router.refresh();
  }

  return { rows, upsert };
}
