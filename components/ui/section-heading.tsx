import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  eyebrow?: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, text, as = "h2", align = "left", className, children }: Props) {
  const Tag = as;
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={cn("font-display text-balance", as === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl")}>
        {title}
      </Tag>
      {text && <p className="max-w-xl text-pretty text-cream-2">{text}</p>}
      {children}
    </div>
  );
}
