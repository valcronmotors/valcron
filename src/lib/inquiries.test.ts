import { describe, expect, it } from "vitest";
import { canAdminAccessInquiry, canPublicReadInquiry, publicInquiryInsertReturnsRow, validatePublicInquiry } from "@/lib/inquiries";
import {
  clientIpFromRequest,
  inquiryAbuseGuard,
  inquiryFingerprint,
  inquiryIpGuard,
  isInquiryHoneypot,
  resetInquiryAbuseGuard,
} from "@/lib/inquiry-abuse";

describe("public inquiry insert", () => {
  it("requires name and phone or email", () => {
    expect(validatePublicInquiry({ name: "", phone: "8090000000" }).error).toBeTruthy();
    expect(validatePublicInquiry({ name: "Ana" }).error).toMatch(/teléfono o un correo/i);
    expect(validatePublicInquiry({ name: "Ana", phone: "8090000000" }).data?.status).toBe("new");
    expect(validatePublicInquiry({ name: "Ana", email: "ana@example.com" }).data?.source).toBe("web");
    expect(validatePublicInquiry({ name: "A", phone: "8090000000" }).error).toMatch(/nombre válido/i);
    expect(validatePublicInquiry({ name: "Ana", phone: "8090000000", message: "x".repeat(5000) }).data?.message).toHaveLength(4000);
  });

  it("blocks public auction opportunity ids", () => {
    const result = validatePublicInquiry({
      name: "Ana",
      email: "ana@example.com",
      auctionOpportunityId: "11111111-1111-4111-8111-111111111111",
    });
    expect(result.error).toBeTruthy();
    expect(result.data).toBeNull();
  });

  it("denies public reads and allows admin access", () => {
    expect(canPublicReadInquiry()).toBe(false);
    expect(publicInquiryInsertReturnsRow()).toBe(false);
    expect(canAdminAccessInquiry(false)).toBe(false);
    expect(canAdminAccessInquiry(true)).toBe(true);
  });
});

describe("inquiry abuse guard", () => {
  it("treats filled honeypot as bot traffic", () => {
    expect(isInquiryHoneypot("Acme")).toBe(true);
    expect(isInquiryHoneypot("")).toBe(false);
  });

  it("blocks a duplicate fingerprint inside the window", () => {
    resetInquiryAbuseGuard();
    const fingerprint = inquiryFingerprint({
      name: "Ana",
      phone: "8090000000",
      email: null,
      vehicleId: null,
    });
    expect(inquiryAbuseGuard(fingerprint, 1_000).ok).toBe(true);
    expect(inquiryAbuseGuard(fingerprint, 1_500).ok).toBe(false);
    expect(inquiryAbuseGuard(fingerprint, 70_000).ok).toBe(true);
  });

  it("limits repeated submissions from the same IP", () => {
    resetInquiryAbuseGuard();
    for (let i = 0; i < 8; i += 1) {
      expect(inquiryIpGuard("1.1.1.1", 1_000 + i).ok).toBe(true);
    }
    expect(inquiryIpGuard("1.1.1.1", 1_020).ok).toBe(false);
    expect(inquiryIpGuard("2.2.2.2", 1_020).ok).toBe(true);
  });

  it("reads the first forwarded IP", () => {
    const request = new Request("https://valcronmotors.com/api/public/lead", {
      headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
    });
    expect(clientIpFromRequest(request)).toBe("203.0.113.10");
  });
});
