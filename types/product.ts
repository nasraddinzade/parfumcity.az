export type Segment = "niche" | "designer";

export type Concentration = "EDP" | "EDT" | "ExDP" | "Parfum" | "Digər";

export interface Product {
  id: string;
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  volumeMl: number;
  concentration: Concentration;
  priceAzn: number;
  segment: Segment;
  image: string | null;
}

export interface Brand {
  name: string;
  slug: string;
  segment: Segment;
  count: number;
}

export const CONCENTRATIONS: readonly Concentration[] = ["EDP", "EDT", "ExDP", "Parfum", "Digər"];
export const SEGMENTS: readonly Segment[] = ["niche", "designer"];
