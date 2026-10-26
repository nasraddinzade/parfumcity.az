/** Deterministic colour per brand so every house gets its own shade of bottle. */
export function brandHue(brand: string): number {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) >>> 0;
  return h % 360;
}

export interface BottlePalette {
  hue: number;
  bg: string;
  glass: string;
  liquid: string;
  liquidDeep: string;
  highlight: string;
  cap: string;
}

export function bottlePalette(brand: string): BottlePalette {
  const hue = brandHue(brand);
  return {
    hue,
    bg: "hsl(" + hue + " 14% 10%)",
    glass: "hsl(" + hue + " 18% 22%)",
    liquid: "hsl(" + hue + " 32% 34%)",
    liquidDeep: "hsl(" + hue + " 36% 22%)",
    highlight: "hsl(" + hue + " 30% 70% / 0.35)",
    cap: "hsl(" + hue + " 10% 42%)",
  };
}

/** Tiny single-colour SVG used as `blurDataURL` while a remote photo loads. */
export function blurDataUrl(brand: string): string {
  const { bg, glass } = bottlePalette(brand);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="8"><rect width="6" height="8" fill="' +
    bg +
    '"/><rect x="2" y="2" width="2" height="5" fill="' +
    glass +
    '"/></svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
