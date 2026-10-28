import { describe, expect, it } from "vitest";
import { zipSync } from "fflate";
import { extractImageFilesFromZip } from "@/lib/zip-photo-import";
describe("extractImageFilesFromZip",()=> {
 it("extracts images and ignores unrelated files",async()=>{const zip=zipSync({"lot/front.jpg":new Uint8Array([1,2,3]),"lot/readme.txt":new Uint8Array([4,5])});const files=await extractImageFilesFromZip(new File([zip.slice().buffer as ArrayBuffer],"copart.zip",{type:"application/zip"}));expect(files).toHaveLength(1);expect(files[0].name).toBe("front.jpg");expect(files[0].type).toBe("image/jpeg");});
 it("rejects archives without images",async()=>{const zip=zipSync({"readme.txt":new Uint8Array([1])});await expect(extractImageFilesFromZip(new File([zip.slice().buffer as ArrayBuffer],"empty.zip"))).rejects.toThrow("no contiene fotos");});
});
