import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./json-ld";

describe("structured data serialization", () => {
  it("prevents catalog text from closing the script while preserving its value", () => {
    const data = { description: '</script><script>alert("xss")</script>', price: 12500 };
    const output = serializeJsonLd(data);
    expect(output).not.toContain("<");
    expect(JSON.parse(output)).toEqual(data);
  });
});
