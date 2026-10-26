import type { Metadata } from "next";
import { OrderView } from "@/components/checkout/order-view";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; orderId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, orderId } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/sifaris/" + orderId,
    title: dict.meta.order.title + " " + orderId,
    description: dict.meta.order.description,
    noIndex: true,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { orderId } = await params;
  // Orders live only in the visitor's browser, so the page is rendered client-side from localStorage.
  return <OrderView orderId={orderId} />;
}
