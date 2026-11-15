import {
  IMPORT_ESTIMATE_NOTICE,
  AUCTION_FEE_NOTICE,
  importCostConfig,
} from "./import-cost-config";
import {
  estimateImport,
  vehicleDescription,
  type ImportCandidate,
} from "./import-estimate";
import { formatDecimal } from "./money";
const usd = (n: number) => `US$${formatDecimal(n, 2)}`;
const dop = (n: number) => `RD$${formatDecimal(n, 2)}`;
// Core renderer accepts logo bytes so the identical PDF can be tested outside the browser.
export async function createImportQuotePdf(
  v: ImportCandidate,
  client: string,
  logoPng: string,
  now = new Date(),
  fonts?: { regular: string; bold: string },
) {
  const result = estimateImport(v);
  if (!result)
    throw new Error(
      "Completa los datos válidos del vehículo antes de descargar.",
    );
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  if (fonts) {
    pdf.addFileToVFS("ValcronQuote-Regular.ttf", fonts.regular);
    pdf.addFont("ValcronQuote-Regular.ttf", "ValcronQuote", "normal");
    pdf.addFileToVFS("ValcronQuote-Bold.ttf", fonts.bold);
    pdf.addFont("ValcronQuote-Bold.ttf", "ValcronQuote", "bold");
  }
  const font = fonts ? "ValcronQuote" : "helvetica";
  const printable = (s: string) =>
    s
      .replace(/CO₂/g, "CO2")
      .replace(/[\u0000-\u001f]/g, " ")
      .slice(0, 1800);
  const until = new Date(now);
  until.setDate(until.getDate() + importCostConfig.quoteValidityDays);
  const date = (d: Date) =>
    d.toLocaleDateString("es-DO", { timeZone: "America/Santo_Domingo" });
  pdf.setFillColor(18, 20, 23);
  pdf.rect(0, 0, 210, 42, "F");
  pdf.addImage(logoPng, "PNG", 15, 5, 31, 31);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont(font, "bold");
  pdf.setFontSize(19);
  pdf.text("COTIZACIÓN ESTIMADA", 54, 18);
  pdf.setFont(font, "normal");
  pdf.setFontSize(10);
  pdf.text("Valcron Motors Group, SRL", 54, 26);
  pdf.text("Importación por encargo a República Dominicana", 54, 33);
  pdf.setTextColor(30, 32, 36);
  pdf.setFontSize(10);
  pdf.text(
    `Fecha: ${date(now)}   |   Válida hasta: ${date(until)} (7 días)`,
    15,
    51,
  );
  let y = 59;
  const ensureSpace = (height: number) => {
    if (y + height > 272) {
      pdf.addPage();
      y = 20;
    }
  };
  const paragraph = (text: string, size = 10, bold = false) => {
    pdf.setFont(font, bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(printable(text), 178);
    ensureSpace(lines.length * (size * 0.43) + 3);
    pdf.text(lines, 15, y);
    y += lines.length * (size * 0.43) + 3;
  };
  if (client.trim()) paragraph(`Cliente: ${client.trim().slice(0, 120)}`);
  paragraph(vehicleDescription(v), 11, true);
  paragraph(
    `Subasta: ${v.provider === "copart" ? "Copart" : "IAAI"} | Título: ${v.title === "clean" ? "Clean" : "Rebuilt/Salvage"} | Envío: ${v.shippingMethod === "container" ? "Contenedor" : "RoRo"} | Valoración: ${v.valuation === "table" ? "Tabla DGA (FOB indicado)" : "Factura"}`,
  );
  paragraph(
    `FOB de referencia: ${usd(result.fob)} | CIF de referencia: ${usd(result.cif)} | Cambio: RD$${v.fx}/US$1`,
    9,
  );
  ensureSpace(25);
  y += 3;
  pdf.setFillColor(244, 245, 247);
  pdf.rect(15, y - 5, 180, 9, "F");
  pdf.setFont(font, "bold");
  pdf.text("CONCEPTO ESTIMADO", 18, y + 1);
  pdf.text("US$", 192, y + 1, { align: "right" });
  y += 13;
  const quoteLines = result.lines
    .filter((line) => !["insurance", "unloading"].includes(line.key))
    .map((line) =>
      line.key === "freight"
        ? {
            ...line,
            label:
              v.shippingMethod === "container"
                ? "Flete marítimo, seguro y descarga"
                : "Flete marítimo y seguro",
            usd: line.usd + result.insurance + result.unloading,
          }
        : line,
    );
  quoteLines.forEach((line) => {
    pdf.setFont(font, "normal");
    pdf.setFontSize(10);
    const label: string[] = pdf.splitTextToSize(printable(line.label), 125);
    ensureSpace(Math.max(10, label.length * 4.5 + 3));
    pdf.text(label, 18, y);
    pdf.text(usd(line.usd), 192, y, { align: "right" });
    y += Math.max(10, label.length * 4.5 + 3);
  });
  ensureSpace(25);
  pdf.setFillColor(255, 242, 231);
  pdf.rect(15, y - 3, 180, 22, "F");
  pdf.setFont(font, "bold");
  pdf.setFontSize(11);
  pdf.text("TOTAL PUESTO EN RD · ESTIMADO", 18, y + 4);
  pdf.text(usd(result.totalUsd), 192, y + 4, { align: "right" });
  pdf.text(dop(result.totalDop), 192, y + 12, { align: "right" });
  y += 29;
  paragraph(IMPORT_ESTIMATE_NOTICE, 9);
  paragraph(AUCTION_FEE_NOTICE, 8);
  paragraph(
    "Preferencia DR-CAFTA simulada para origen USA, sujeta a acreditación documental y aceptación de la DGA. El país/VIN no acredita por sí solo la preferencia. CO2 seleccionado para presupuesto, sujeto a emisiones certificadas. Año y título sujetos a validación antes de comprar.",
    8,
  );
  pdf.setFont(font, "bold");
  pdf.setTextColor(165, 77, 28);
  pdf.setFontSize(10);
  for (let page = 1; page <= pdf.getNumberOfPages(); page++) {
    pdf.setPage(page);
    pdf.setFontSize(9);
    pdf.text("WhatsApp: (829) 321-1271  |  www.valcronmotors.com", 15, 285);
    pdf.text(`${page}/${pdf.getNumberOfPages()}`, 195, 285, { align: "right" });
  }
  return new Uint8Array(pdf.output("arraybuffer"));
}
export async function downloadImportQuote(v: ImportCandidate, client: string) {
  const response = await fetch("/branding/valcron-logo-dark.webp");
  if (!response.ok)
    throw new Error("No se pudo cargar el logo. Intenta descargar nuevamente.");
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar el PDF.");
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const loadFont = async (name: string) => {
    const r = await fetch(`/fonts/quote/ValcronQuote-${name}.ttf`);
    if (!r.ok) throw new Error("No se pudo cargar la tipografía del PDF.");
    const bytes = new Uint8Array(await r.arrayBuffer());
    if (
      bytes.length < 12 ||
      bytes[0] !== 0 ||
      bytes[1] !== 1 ||
      bytes[2] !== 0 ||
      bytes[3] !== 0
    )
      throw new Error(
        "No se pudo cargar la tipografía del PDF. Recarga e intenta nuevamente.",
      );
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
  };
  const [regular, bold] = await Promise.all([
    loadFont("Regular"),
    loadFont("Bold"),
  ]);
  const bytes = await createImportQuotePdf(
    v,
    client,
    canvas.toDataURL("image/png"),
    new Date(),
    { regular, bold },
  );
  const url = URL.createObjectURL(
    new Blob([bytes as BlobPart], { type: "application/pdf" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    `Valcron-cotizacion-${v.make}-${v.model}-${v.year}.pdf`.replace(
      /[^a-zA-Z0-9.\-]/g,
      "-",
    );
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
