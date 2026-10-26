import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/checkout";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/odenis", title: dict.meta.checkout.title, description: dict.meta.checkout.description, noIndex: true });
}

export default function Page() {
  return <Checkout />;
}
