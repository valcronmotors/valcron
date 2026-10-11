import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "linear-gradient(135deg, #29292d, #080809)", color: "white" }}>
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 5, color: "#ec752f" }}>VALCRON MOTORS GROUP</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>Más opciones.</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#ec752f" }}>Más cerca de ti.</div>
        <div style={{ display: "flex", fontSize: 26, color: "#d4d7de" }}>Vehículos · Búsqueda personalizada · Bancos locales</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, borderTop: "1px solid #555", paddingTop: 24 }}>
        <span>{SITE.address.city}, República Dominicana</span>
        <span>valcronmotors.com</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
