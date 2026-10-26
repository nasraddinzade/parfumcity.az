import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

interface Props {
  products: readonly Product[];
  /** How many of the first cards load eagerly (above the fold). */
  priorityCount?: number;
  className?: string;
  columns?: 3 | 4;
}

export function ProductGrid({ products, priorityCount = 0, className, columns = 4 }: Props) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <li key={p.slug} className="relative">
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
