"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice } from "@/lib/format";
import { getOrder, type Order } from "@/lib/orders";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; order: Order };

export function OrderView({ orderId }: { orderId: string }) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const order = getOrder(orderId);
    setState(order ? { status: "ready", order } : { status: "missing" });
  }, [orderId]);

  if (state.status === "loading") {
    return <div className="container-x min-h-[50vh] py-16" aria-busy="true" />;
  }

  if (state.status === "missing") {
    return (
      <div className="container-x py-12 md:py-16">
        <SectionHeading
          as="h1"
          eyebrow={t("order.eyebrow")}
          title={t("order.notFound")}
          text={t("order.notFoundText")}
        />
        <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline mt-8">
          {t("order.continue")}
        </Link>
      </div>
    );
  }

  const { order } = state;
  const date = new Intl.DateTimeFormat(locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="container-x py-12 md:py-16">
      <SectionHeading as="h1" eyebrow={t("order.eyebrow")} title={t("order.title")}>
        <p className="text-cream-2">
          {t("order.thanks")} <span className="font-display text-2xl text-cream">{order.id}</span>
        </p>
      </SectionHeading>

      <p className="mt-8 max-w-2xl border border-brass/50 bg-panel p-5 text-sm leading-relaxed text-cream-2">
        {t("order.demoNote")}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div>
          <p className="caption mb-4 text-cream-3">{t("order.items")}</p>
          <ul className="divide-y divide-line border-y border-line">
            {order.lines.map((l) => (
              <li key={l.slug} className="flex items-start justify-between gap-6 py-4">
                <div>
                  <p className="caption text-cream-3">{l.brand}</p>
                  <Link href={"/" + locale + "/mehsul/" + l.slug} className="font-display text-lg hover:text-brass-2">
                    {l.name}
                  </Link>
                  <p className="text-sm text-cream-2">
                    {l.volumeMl} {t("common.ml")} × {l.qty}
                  </p>
                </div>
                <p className="shrink-0">{formatPrice(l.priceAzn * l.qty, locale)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-cream-2">{t("cart.subtotal")}</dt>
              <dd>{formatPrice(order.subtotal, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream-2">{t("cart.delivery")}</dt>
              <dd>{order.delivery === 0 ? t("cart.free") : formatPrice(order.delivery, locale)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-4 text-base">
              <dt>{t("cart.total")}</dt>
              <dd className="font-display text-xl">{formatPrice(order.total, locale)}</dd>
            </div>
          </dl>
        </div>

        <aside>
          <dl className="flex flex-col gap-5 text-sm">
            <div>
              <dt className="caption mb-1 text-cream-3">{t("order.date")}</dt>
              <dd>{date}</dd>
            </div>
            <div>
              <dt className="caption mb-1 text-cream-3">{t("order.customer")}</dt>
              <dd>
                {order.customer.name}
                <br />
                {order.customer.phone}
              </dd>
            </div>
            <div>
              <dt className="caption mb-1 text-cream-3">{t("order.method")}</dt>
              <dd>{t("order.methods." + order.method)}</dd>
            </div>
            {order.customer.address && (
              <div>
                <dt className="caption mb-1 text-cream-3">{t("order.address")}</dt>
                <dd>{order.customer.address}</dd>
              </div>
            )}
            {order.customer.note && (
              <div>
                <dt className="caption mb-1 text-cream-3">{t("order.note")}</dt>
                <dd>{order.customer.note}</dd>
              </div>
            )}
            <div>
              <dt className="caption mb-1 text-cream-3">{t("order.payment")}</dt>
              <dd>{t("order.paid", { last4: order.cardLast4 })}</dd>
            </div>
          </dl>
          <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline mt-8 w-full">
            {t("order.continue")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
