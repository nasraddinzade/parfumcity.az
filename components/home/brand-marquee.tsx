import Link from "next/link";
import { brandsSorted } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";

/** Scrolling strip of every brand name; static wrap when motion is reduced. */
export function BrandMarquee({ locale, label }: { locale: Locale; label: string }) {
  const track = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-3 motion-reduce:pr-0"
    >
      {brandsSorted.map((b) => (
        <li key={b.slug} className="shrink-0">
          <Link
            href={"/" + locale + "/brendler/" + b.slug}
            tabIndex={ariaHidden ? -1 : undefined}
            className="font-display whitespace-nowrap text-xl text-cream-3 transition-colors duration-500 hover:text-cream sm:text-2xl"
          >
            {b.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="border-b border-line py-6">
      <div className="group flex overflow-hidden motion-reduce:container-x">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          {track(false)}
          <div className="motion-reduce:hidden flex">{track(true)}</div>
        </div>
      </div>
    </section>
  );
}
