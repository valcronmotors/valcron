import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { resetInquiryAbuseGuard } from "@/lib/inquiry-abuse";

const { createClient, insert } = vi.hoisted(() => ({ createClient: vi.fn(), insert: vi.fn() }));
vi.mock("@/utils/supabase/server", () => ({ createClient }));

function request(body: unknown) {
  return new Request("https://www.valcronmotors.com/api/public/lead", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

describe("public lead endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetInquiryAbuseGuard();
    const query = { select: vi.fn(), eq: vi.fn(), gte: vi.fn(), limit: vi.fn(), then: vi.fn() };
    for (const key of ["select", "eq", "gte", "limit"] as const) query[key].mockReturnValue(query);
    query.then.mockImplementation((resolve) => resolve({ data: [], error: null }));
    insert.mockResolvedValue({ error: null });
    createClient.mockResolvedValue({ from: () => ({ ...query, insert }) });
  });

  it.each([null, [], "invalid", 3])("rejects non-object JSON without contacting Supabase: %j", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(createClient).not.toHaveBeenCalled();
  });

  it("persists a valid form payload and rejects repeat submissions", async () => {
    const body = { nombre: "Prueba auditoría", telefono: "8095550100", mensaje: "Solicitud de prueba" };
    expect((await POST(request(body))).status).toBe(201);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ name: body.nombre, phone: body.telefono, source: "web" }));
    expect((await POST(request(body))).status).toBe(429);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("returns a safe error when storage fails", async () => {
    insert.mockResolvedValue({ error: { code: "TEST_FAILURE" } });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect((await POST(request({ nombre: "Prueba auditoría", telefono: "8095550100" }))).status).toBe(500);
    } finally { log.mockRestore(); }
  });
});
