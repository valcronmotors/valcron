"use server";

/* eslint-disable @typescript-eslint/no-unused-vars */

export type CatalogActionState = {
  error?: string;
  success?: string;
  record?: object;
};

const DISABLED = "Este módulo ERP ya no está disponible. Usa Inventario en el website admin.";

export async function createVehiculo(
  _prev: CatalogActionState | null,
  _formData: FormData,
): Promise<CatalogActionState> {
  return { error: DISABLED };
}

export async function updateVehiculo(
  _id: string,
  _prev: CatalogActionState | null,
  _formData: FormData,
): Promise<CatalogActionState> {
  return { error: DISABLED };
}

export async function updateVehiculoFotos(_formData: FormData): Promise<CatalogActionState> {
  return { error: DISABLED };
}

export async function updateVehiclePhotos(
  _id: string,
  _urls: string[],
): Promise<CatalogActionState> {
  return { error: DISABLED };
}

export async function createRepuesto(
  _prev: CatalogActionState | null,
  _formData: FormData,
): Promise<CatalogActionState> {
  return { error: "Repuestos no forma parte del website backend." };
}

export async function updateRepuesto(
  _id: string,
  _prev: CatalogActionState | null,
  _formData: FormData,
): Promise<CatalogActionState> {
  return { error: "Repuestos no forma parte del website backend." };
}
