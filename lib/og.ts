import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponse } from "next/og";

type Font = NonNullable<
  ConstructorParameters<typeof ImageResponse>[1]
>["fonts"] extends (infer F)[] | undefined
  ? F
  : never;

const FONT_DIR = join(process.cwd(), "assets", "fonts");

let cached: Promise<Font[]> | null = null;

/**
 * Fonts for Open Graph images, read once from assets/fonts. Jost covers
 * Latin-extended and Cyrillic text; Playfair Display is the display face
 * (Bodoni Moda has no Cyrillic, and Satori needs a single file per face).
 */
export function ogFonts(): Promise<Font[]> {
  if (!cached) {
    cached = Promise.all([
      readFile(join(FONT_DIR, "PlayfairDisplay-Regular.woff")),
      readFile(join(FONT_DIR, "Jost-Regular.woff")),
    ]).then(([display, sans]) => [
      { name: "Display", data: display, style: "normal", weight: 400 },
      { name: "Sans", data: sans, style: "normal", weight: 400 },
    ]);
  }
  return cached;
}

export const ogColors = {
  bg: "#0e0c0a",
  panel: "#1a1614",
  line: "#2c2622",
  cream: "#f2ece2",
  cream2: "#c6bdb0",
  brass: "#b8975a",
} as const;

export const ogSize = { width: 1200, height: 630 } as const;
