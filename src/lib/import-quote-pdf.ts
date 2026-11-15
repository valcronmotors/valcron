import {
  IMPORT_ESTIMATE_NOTICE,
  OFFICIAL_TAX_NOTICE,
  AUCTION_FEE_NOTICE,
  importCostConfig,
} from "./import-cost-config";
import {
  estimateImport,
  clientQuoteLines,
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
  const clientName = client.trim();
  if (!clientName)
    throw new Error(
      "Escribe el nombre del cliente para descargar la cotización PDF.",
    );
  if (clientName.length > 120)
    throw new Error(
      "El nombre del cliente debe tener como máximo 120 caracteres.",
    );
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
  const drawHeader = () => {
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(0, 0, 0);
    const image = pdf.getImageProperties(logoPng);
    pdf.addImage(
      logoPng,
      image.fileType,
      15,
      4,
      43,
      (43 * image.height) / image.width,
    );
    pdf.setFont(font, "bold");
    pdf.setFontSize(17);
    pdf.text("COTIZACIÓN ESTIMADA", 195, 17, { align: "right" });
    pdf.setFont(font, "normal");
    pdf.setFontSize(9);
    pdf.text(`Fecha: ${date(now)}`, 195, 27, { align: "right" });
    pdf.text(`Vigencia: 7 días · Hasta: ${date(until)}`, 195, 33, {
      align: "right",
    });
    pdf.setFontSize(8.5);
    const address: string[] = pdf.splitTextToSize(
      "Av. Principal No. 20, Brisa Oriental, Santo Domingo Este, R.D.",
      101,
    );
    pdf.text(address, 15, 53);
    pdf.text(
      "RNC: 1-33-62898-8 · Tel: (829) 321-1271",
      15,
      53 + address.length * 4 + 3,
    );
    pdf.setLineWidth(0.25);
    pdf.line(15, 69, 195, 69);
  };
  drawHeader();
  let y = 78;
  const ensureSpace = (height: number) => {
    if (y + height > 272) {
      pdf.addPage();
      drawHeader();
      y = 78;
      return true;
    }
    return false;
  };
  const paragraph = (text: string, size = 10, bold = false) => {
    pdf.setFont(font, bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(printable(text), 178);
    ensureSpace(lines.length * (size * 0.43) + 2);
    pdf.text(lines, 15, y);
    y += lines.length * (size * 0.43) + 2;
  };
  const sectionTitle = (title: string) => {
    ensureSpace(18);
    pdf.setFont(font, "bold");
    pdf.setFontSize(10);
    pdf.text(title, 15, y);
    y += 7;
  };
  sectionTitle("CLIENTE");
  paragraph(clientName, 10);
  y += 3;
  sectionTitle("VEHÍCULO");
  paragraph(`Marca: ${v.make} · Modelo: ${v.model} · Año: ${v.year}`, 10, true);
  paragraph(`País de origen: ${v.country}`, 9.5);
  const specification = [
    `Serie: ${v.series || "No indicada"}`,
    `Combustible: ${v.fuel || "No indicado"}`,
    `Cilindros: ${v.cylinders || "No indicados"}`,
    `CC: ${v.cc || "No indicado"}`,
    `Pasajeros: ${v.passengers || "No indicados"}`,
    `Puertas: ${v.doors || "No indicadas"}`,
    `Tracción: ${v.drive || "No indicada"}`,
    ...(v.cabins || v.loadWeight || v.axles
      ? [
          `Cabinas: ${v.cabins || "No indicadas"}`,
          `Peso de carga: ${v.loadWeight || "No indicado"}`,
          `Ejes: ${v.axles || "No indicados"}`,
        ]
      : []),
  ].join(" · ");
  paragraph(specification, 9);
  if (v.vin) paragraph(`VIN: ${v.vin}`, 9.5);
  paragraph(
    `Subasta: ${v.provider === "copart" ? "Copart" : "IAAI"} · Título: ${v.title === "clean" ? "Clean" : "Rebuilt/Salvage"} · Envío: ${v.shippingMethod === "container" ? "Contenedor" : "RoRo"}`,
    9,
  );
  paragraph(
    result.officialTax
      ? `Impuestos y primera placa: tabla oficial de valores DGA. Tasa: RD$${v.fx}/US$1.`
      : `Valoración manual: ${v.valuation === "table" ? "FOB de referencia indicado" : "Factura"}. FOB ${usd(result.fob)} · CIF ${usd(result.cif)} · Tasa RD$${v.fx}/US$1.`,
    8.5,
  );
  y += 3;
  sectionTitle("DESGLOSE DE COSTOS ESTIMADOS");
  const tableHeader = () => {
    pdf.setFont(font, "bold");
    pdf.setFontSize(9);
    pdf.text("CONCEPTO", 15, y);
    pdf.text("US$", 195, y, { align: "right" });
    pdf.setLineWidth(0.2);
    pdf.line(15, y + 2, 195, y + 2);
    y += 9;
  };
  ensureSpace(15);
  tableHeader();
  const quoteLines = clientQuoteLines(v);
  quoteLines.forEach((line) => {
    pdf.setFont(font, "normal");
    pdf.setFontSize(10);
    const label: string[] = pdf.splitTextToSize(printable(line.label), 125);
    if (ensureSpace(Math.max(8, label.length * 4.5 + 3) + 8)) {
      tableHeader();
      pdf.setFont(font, "normal");
      pdf.setFontSize(10);
    }
    pdf.text(label, 18, y);
    pdf.text(usd(line.usd), 192, y, { align: "right" });
    y += Math.max(8, label.length * 4.5 + 3);
  });
  ensureSpace(24);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.25);
  pdf.line(15, y - 2, 195, y - 2);
  pdf.setFont(font, "bold");
  pdf.setFontSize(10.5);
  pdf.text("TOTAL PUESTO EN RD · ESTIMADO", 15, y + 5);
  pdf.text(usd(result.totalUsd), 195, y + 5, { align: "right" });
  pdf.text(dop(result.totalDop), 195, y + 13, { align: "right" });
  pdf.line(15, y + 17, 195, y + 17);
  y += 25;
  paragraph(
    result.officialTax ? OFFICIAL_TAX_NOTICE : IMPORT_ESTIMATE_NOTICE,
    9,
  );
  paragraph(AUCTION_FEE_NOTICE, 8);
  paragraph(
    result.officialTax
      ? "El importe de tabla sustituye el cálculo por fórmula de impuestos y primera placa; no se suma una segunda liquidación DGA/DGII. Confirma la especificación, el título y la admisibilidad antes de comprar."
      : "Preferencia DR-CAFTA simulada para origen USA, sujeta a acreditación documental y aceptación de la DGA. El país/VIN no acredita por sí solo la preferencia. CO2 seleccionado para presupuesto, sujeto a emisiones certificadas. Año y título sujetos a validación antes de comprar.",
    8,
  );
  pdf.setFont(font, "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  for (let page = 1; page <= pdf.getNumberOfPages(); page++) {
    pdf.setPage(page);
    pdf.setFontSize(8);
    pdf.setLineWidth(0.15);
    pdf.line(15, 280, 195, 280);
    pdf.text("WhatsApp: (829) 321-1271  |  www.valcronmotors.com", 15, 285);
    pdf.text(`${page}/${pdf.getNumberOfPages()}`, 195, 285, { align: "right" });
  }
  return new Uint8Array(pdf.output("arraybuffer"));
}
export async function downloadImportQuote(v: ImportCandidate, client: string) {
  if (!client.trim())
    throw new Error(
      "Escribe el nombre del cliente para descargar la cotización PDF.",
    );
  const response = await fetch("/branding/logo-valcron-blanco.jpg");
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
