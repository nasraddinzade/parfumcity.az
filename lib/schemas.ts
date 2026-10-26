import { z } from "zod";

export const segmentSchema = z.enum(["niche", "designer"]);
export const concentrationSchema = z.enum(["EDP", "EDT", "ExDP", "Parfum", "Digər"]);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

export const productSchema = z
  .object({
    id: slug,
    slug,
    brand: z.string().min(1),
    brandSlug: slug,
    name: z.string().min(1),
    volumeMl: z.number().int().positive(),
    concentration: concentrationSchema,
    priceAzn: z.number().int().positive(),
    segment: segmentSchema,
    image: z.string().url().nullable(),
  })
  .strict();

export const brandSchema = z
  .object({
    name: z.string().min(1),
    slug,
    segment: segmentSchema,
    count: z.number().int().nonnegative(),
  })
  .strict();

export const productsSchema = z.array(productSchema);
export const brandsSchema = z.array(brandSchema);
