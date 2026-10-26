import type { ImageResponse } from "next/og";

type Font = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"] extends (infer F)[] | undefined
  ? F
  : never;

const cache = new Map<string, Promise<ArrayBuffer | null>>();

/**
 * Loads a TrueType file for a Google font so Open Graph images can render
 * Latin-extended and Cyrillic text. Falls back silently to the default font
 * when the network is unavailable.
 */
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  const key = family + ":" + text;
  const existing = cache.get(key);
  if (existing) return existing;
  const task = (async () => {
    try {
      const css = await fetch(
        "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(family) + "&text=" + encodeURIComponent(text),
        // An old user agent makes Google serve TTF, which Satori can read (it cannot read woff2).
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0) Gecko/20100101 Firefox/6.0" } },
      ).then((r) => (r.ok ? r.text() : ""));
      const match = /src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/.exec(css);
      if (!match?.[1]) return null;
      const res = await fetch(match[1]);
      return res.ok ? res.arrayBuffer() : null;
    } catch {
      return null;
    }
  })();
  cache.set(key, task);
  return task;
}

export async function ogFonts(text: string): Promise<Font[]> {
  const [display, sans] = await Promise.all([loadGoogleFont("Playfair Display", text), loadGoogleFont("Jost", text)]);
  const fonts: Font[] = [];
  if (display) fonts.push({ name: "Display", data: display, style: "normal", weight: 400 });
  if (sans) fonts.push({ name: "Sans", data: sans, style: "normal", weight: 400 });
  return fonts;
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
