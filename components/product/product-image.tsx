"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BottlePlaceholder } from "@/components/product/bottle-placeholder";
import { resolveProductImage } from "@/data/images";
import { cn } from "@/lib/cn";
import { blurDataUrl, bottlePalette } from "@/lib/placeholder";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  /** Responsive `sizes` for next/image; always pass the real layout width. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Product photo with a silent fallback: if the external host refuses the
 * request (hotlink protection, 404), the code-drawn flacon takes its place
 * without breaking the grid.
 */
export function ProductImage({ product, sizes, priority = false, className }: Props) {
  const resolved = resolveProductImage(product);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  useEffect(() => {
    setFailedSrc(null);
  }, [resolved.src]);

  const alt = product.brand + " " + product.name + " " + product.volumeMl + " ml";
  const showPhoto = resolved.src !== null && failedSrc !== resolved.src;

  return (
    <div
      className={cn("relative aspect-[3/4] w-full overflow-hidden", className)}
      style={{ backgroundColor: bottlePalette(product.brand).bg }}
    >
      {showPhoto ? (
        <Image
          src={resolved.src}
          alt={alt}
          width={600}
          height={800}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={blurDataUrl(product.brand)}
          className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
          onError={() => setFailedSrc(resolved.src)}
        />
      ) : (
        <BottlePlaceholder
          brand={product.brand}
          label={alt}
          className="transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
}
