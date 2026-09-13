import { formatDop, formatUsd } from "@/lib/money";
import type { CotizacionItem } from "@/lib/crm";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type QuotePrintPayload = {
  numero: string;
  fecha: string;
  companyName: string;
  rnc: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  interes: string;
  tasa: number;
  items: CotizacionItem[];
  subtotalUsd: number;
  totalUsd: number;
  totalDop: number;
  notas: string;
};

export function openQuotePrintWindow(payload: QuotePrintPayload) {
  const rows = payload.items
    .map((item) => {
      const lineUsd = item.cantidad * item.precio_unitario_usd;
      const lineDop = item.cantidad * item.precio_unitario_dop;
      return `<tr>
        <td>${escapeHtml(item.descripcion)}</td>
        <td class="num">${item.cantidad}</td>
        <td class="num">${escapeHtml(formatUsd(item.precio_unitario_usd))}</td>
        <td class="num">${escapeHtml(formatDop(item.precio_unitario_dop))}</td>
        <td class="num">${escapeHtml(formatUsd(lineUsd))}</td>
        <td class="num">${escapeHtml(formatDop(lineDop))}</td>
      </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(payload.numero)} · ${escapeHtml(payload.companyName)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #0f172a;
      background: #e2e8f0;
    }
    .sheet {
      width: 900px;
      margin: 24px auto;
      background: #fff;
      padding: 40px 48px;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
    }
    .brand {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 4px solid #0e7490;
      padding-bottom: 20px;
    }
    .mark {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0e7490, #155e75);
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .eyebrow { font-size: 11px; letter-spacing: 0.28em; color: #0e7490; font-weight: 700; }
    h1 { margin: 4px 0 0; font-size: 26px; }
    .meta { text-align: right; }
    .meta strong { display: block; font-size: 22px; color: #0e7490; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 28px 0; }
    .card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 18px; background: #f8fafc; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { text-align: left; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #cbd5e1; padding: 10px 8px; }
    td { padding: 12px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .num { text-align: right; white-space: nowrap; }
    .totals { margin-top: 24px; display: flex; justify-content: flex-end; }
    .totals table { width: 360px; }
    .totals td { border: 0; padding: 6px 8px; }
    .totals .grand { font-size: 18px; font-weight: 800; color: #0e7490; }
    footer { margin-top: 36px; font-size: 12px; color: #64748b; }
    @media print {
      body { background: #fff; }
      .sheet { margin: 0; width: auto; box-shadow: none; padding: 12mm; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <div class="mark">
        <div class="logo">${escapeHtml(payload.companyName.slice(0, 3).toUpperCase())}</div>
        <div>
          <div class="eyebrow">COTIZACIÓN FORMAL</div>
          <h1>${escapeHtml(payload.companyName)}</h1>
          <div>RNC ${escapeHtml(payload.rnc)}</div>
        </div>
      </div>
      <div class="meta">
        <strong>${escapeHtml(payload.numero)}</strong>
        <div>${escapeHtml(payload.fecha)}</div>
        <div>Tasa ${escapeHtml(String(payload.tasa))} DOP / USD</div>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="label">Cliente</div>
        <div style="margin-top:8px;font-weight:700">${escapeHtml(payload.clienteNombre)}</div>
        <div>${escapeHtml(payload.clienteTelefono || "Sin teléfono")}</div>
        <div>${escapeHtml(payload.clienteEmail || "Sin correo")}</div>
      </div>
      <div class="card">
        <div class="label">Interés / referencia</div>
        <div style="margin-top:8px">${escapeHtml(payload.interes)}</div>
        <div style="margin-top:8px">Validez: 15 días calendario</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th class="num">Cant.</th>
          <th class="num">P. unit. USD</th>
          <th class="num">P. unit. DOP</th>
          <th class="num">Total USD</th>
          <th class="num">Total DOP</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <table>
        <tr><td>Subtotal USD</td><td class="num">${escapeHtml(formatUsd(payload.subtotalUsd))}</td></tr>
        <tr><td>Total USD</td><td class="num">${escapeHtml(formatUsd(payload.totalUsd))}</td></tr>
        <tr><td class="grand">Total DOP</td><td class="num grand">${escapeHtml(formatDop(payload.totalDop))}</td></tr>
      </table>
    </div>
    ${
      payload.notas
        ? `<footer><strong>Notas:</strong> ${escapeHtml(payload.notas)}</footer>`
        : ""
    }
    <footer>
      Documento generado por Valcron System. Los valores en DOP usan la tasa de cambio vigente al momento de la cotización.
    </footer>
  </div>
  <script>window.onload = function () { window.print(); }<\/script>
</body>
</html>`;

  const popup = window.open("", "_blank", "noopener,noreferrer,width=980,height=1200");
  if (!popup) {
    return { error: "El navegador bloqueó la ventana de impresión. Permite pop-ups para exportar el PDF." };
  }
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  return { error: null as string | null };
}
