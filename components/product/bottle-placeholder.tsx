import { bottlePalette } from "@/lib/placeholder";
import { cn } from "@/lib/cn";

interface Props {
  brand: string;
  label: string;
  className?: string;
  /** Skip the background so the flacon can sit on another surface. */
  transparent?: boolean;
}

/**
 * Code-drawn flacon used when no photograph is available. The hue comes from a
 * hash of the brand name, so every house gets its own consistent shade.
 */
export function BottlePlaceholder({ brand, label, className, transparent = false }: Props) {
  const p = bottlePalette(brand);
  const id = "b" + p.hue;
  const initial = brand.trim().charAt(0).toUpperCase();
  return (
    <svg
      viewBox="0 0 300 400"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("block h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={id + "-bg"} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={p.glass} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.bg} />
        </radialGradient>
        <linearGradient id={id + "-liquid"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.liquid} />
          <stop offset="100%" stopColor={p.liquidDeep} />
        </linearGradient>
        <linearGradient id={id + "-glass"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={p.glass} />
          <stop offset="55%" stopColor={p.liquidDeep} stopOpacity="0.6" />
          <stop offset="100%" stopColor={p.glass} />
        </linearGradient>
      </defs>
      {!transparent && <rect width="300" height="400" fill={"url(#" + id + "-bg)"} />}
      <ellipse cx="150" cy="332" rx="78" ry="9" fill="#000" opacity="0.35" />
      <rect x="131" y="62" width="38" height="40" rx="3" fill={p.cap} />
      <rect x="131" y="62" width="38" height="6" rx="1" fill="#fff" opacity="0.12" />
      <rect x="138" y="102" width="24" height="16" fill={p.glass} />
      <rect x="92" y="118" width="116" height="206" rx="12" fill={"url(#" + id + "-glass)"} />
      <rect x="101" y="150" width="98" height="166" rx="8" fill={"url(#" + id + "-liquid)"} />
      <rect x="104" y="128" width="2" height="186" rx="1" fill={p.highlight} />
      <rect x="194" y="140" width="1" height="170" fill="#fff" opacity="0.06" />
      <rect x="119" y="196" width="62" height="76" fill="none" stroke="#f2ece2" strokeOpacity="0.28" strokeWidth="1" />
      <text
        x="150"
        y="246"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="36"
        fill="#f2ece2"
        fillOpacity="0.72"
      >
        {initial}
      </text>
    </svg>
  );
}
