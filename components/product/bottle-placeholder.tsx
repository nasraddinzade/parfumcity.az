import type { CSSProperties } from "react";
import { brandHue } from "@/lib/placeholder";
import { cn } from "@/lib/cn";

interface Props {
  brand: string;
  label: string;
  className?: string;
  /** Skip the background so the flacon can sit on another surface. */
  transparent?: boolean;
}

/** hsl() built from the brand hue and a theme-provided "saturation lightness" pair (see globals.css). */
const tone = (token: string) => "hsl(var(--h) var(--flacon-" + token + "))";

/**
 * Code-drawn flacon used when no photograph is available. The hue comes from a
 * hash of the brand name, so every house gets its own consistent shade; the
 * saturation and lightness follow the active theme.
 */
export function BottlePlaceholder({ brand, label, className, transparent = false }: Props) {
  const hue = brandHue(brand);
  const id = "b" + hue;
  const initial = brand.trim().charAt(0).toUpperCase();
  const style = { "--h": String(hue) } as CSSProperties;
  return (
    <svg
      viewBox="0 0 300 400"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      <defs>
        <radialGradient id={id + "-bg"} cx="50%" cy="40%" r="70%">
          <stop offset="0%" style={{ stopColor: tone("glass"), stopOpacity: 0.55 }} />
          <stop offset="100%" style={{ stopColor: tone("bg") }} />
        </radialGradient>
        <linearGradient id={id + "-liquid"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: tone("liquid") }} />
          <stop offset="100%" style={{ stopColor: tone("liquid-deep") }} />
        </linearGradient>
        <linearGradient id={id + "-glass"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: tone("glass") }} />
          <stop offset="55%" style={{ stopColor: tone("liquid-deep"), stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: tone("glass") }} />
        </linearGradient>
      </defs>
      {!transparent && <rect width="300" height="400" fill={"url(#" + id + "-bg)"} />}
      <ellipse cx="150" cy="332" rx="78" ry="9" fill="#000" opacity="0.25" />
      <rect x="131" y="62" width="38" height="40" rx="3" style={{ fill: tone("cap") }} />
      <rect x="131" y="62" width="38" height="6" rx="1" fill="#fff" opacity="0.12" />
      <rect x="138" y="102" width="24" height="16" style={{ fill: tone("glass") }} />
      <rect x="92" y="118" width="116" height="206" rx="12" fill={"url(#" + id + "-glass)"} />
      <rect x="101" y="150" width="98" height="166" rx="8" fill={"url(#" + id + "-liquid)"} />
      <rect x="104" y="128" width="2" height="186" rx="1" style={{ fill: tone("highlight") }} />
      <rect x="194" y="140" width="1" height="170" fill="#fff" opacity="0.06" />
      <rect
        x="119"
        y="196"
        width="62"
        height="76"
        fill="none"
        strokeWidth="1"
        style={{ stroke: "var(--flacon-ink)", strokeOpacity: 0.3 }}
      />
      <text
        x="150"
        y="246"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="36"
        style={{ fill: "var(--flacon-ink)", fillOpacity: 0.75 }}
      >
        {initial}
      </text>
    </svg>
  );
}
