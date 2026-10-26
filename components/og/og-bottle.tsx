import { bottlePalette } from "@/lib/placeholder";

/** Flacon silhouette for Open Graph images (plain divs so Satori can draw it). */
export function OgBottle({ brand, initial }: { brand: string; initial: string }) {
  const p = bottlePalette(brand);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 220 }}>
      <div style={{ width: 54, height: 50, backgroundColor: p.cap, borderRadius: 4 }} />
      <div style={{ width: 34, height: 18, backgroundColor: p.glass }} />
      <div
        style={{
          width: 170,
          height: 250,
          backgroundColor: p.glass,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(180deg, " + p.liquid + " 0%, " + p.liquidDeep + " 100%)",
        }}
      >
        <div
          style={{
            width: 88,
            height: 104,
            border: "1px solid rgba(242,236,226,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            color: "rgba(242,236,226,0.8)",
          }}
        >
          {initial}
        </div>
      </div>
    </div>
  );
}
