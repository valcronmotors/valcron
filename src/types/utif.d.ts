declare module "utif" {
  type IFD = { width: number; height: number; t256?: number[]; t257?: number[] };
  export function decode(buffer: ArrayBuffer): IFD[];
  export function decodeImage(buffer: ArrayBuffer, ifd: IFD): void;
  export function toRGBA8(ifd: IFD): Uint8Array;
}
