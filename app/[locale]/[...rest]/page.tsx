import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Catch-all so unknown URLs render the localized not-found page inside the locale layout. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");
  return { title: dict.meta.notFound.title, robots: { index: false, follow: false } };
}

export default function CatchAll() {
  notFound();
}
