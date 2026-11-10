import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(path.join(process.cwd(), "public/branding/valcron-favicon.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "linear-gradient(135deg, #29292d, #080809)", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Satori requires a native image element for the social image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="VM Valcron" width={112} height={112} style={{ background: "#ffffff", borderRadius: 24 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><span style={{ fontSize: 36, fontWeight: 700, letterSpacing: 3 }}>VALCRON MOTORS</span><span style={{ fontSize: 22, color: "#d4d7de" }}>Vehículos e importación en República Dominicana</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>Tu próximo vehículo.</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#ec752f" }}>A tu manera.</div>
        <div style={{ display: "flex", fontSize: 26, color: "#d4d7de" }}>Inventario · Subastas · Importación por encargo</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, borderTop: "1px solid #555", paddingTop: 24 }}>
        <span>{SITE.address.city}, República Dominicana</span>
        <span>valcronmotors.com</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
