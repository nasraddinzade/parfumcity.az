import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/sebet",
    title: dict.meta.cart.title,
    description: dict.meta.cart.description,
    noIndex: true,
  });
}

export default function Page() {
  return <CartPage />;
}
