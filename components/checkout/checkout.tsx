"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactForm, type ContactData } from "@/components/checkout/contact-form";
import { PaymentForm, type PaymentData } from "@/components/checkout/payment-form";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { digitsOnly } from "@/lib/card";
import { getCartLines, getTotals } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { createOrderId, saveOrder, type Order } from "@/lib/orders";
import { useCart } from "@/store/cart";

export function Checkout() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const cartDelivery = useCart((s) => s.delivery);
  const clear = useCart((s) => s.clear);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [placedId, setPlacedId] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const lines = getCartLines(items);
  const method = contact?.method ?? cartDelivery;
  const totals = getTotals(lines, method);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  function onContact(data: ContactData) {
    setContact(data);
    setStep(2);
  }

  function onPayment(data: PaymentData) {
    if (!contact) return;
    setProcessing(true);
    // Simulated authorisation delay. Nothing is sent anywhere.
    window.setTimeout(() => {
      const order: Order = {
        id: createOrderId(),
        createdAt: new Date().toISOString(),
        customer: {
          name: contact.name,
          phone: contact.phone,
          address: contact.method === "pickup" ? undefined : contact.address,
          note: contact.note || undefined,
        },
        method: contact.method,
        lines: lines.map((l) => ({
          slug: l.product.slug,
          brand: l.product.brand,
          name: l.product.name,
          volumeMl: l.product.volumeMl,
          priceAzn: l.product.priceAzn,
          qty: l.qty,
        })),
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        total: totals.total,
        cardLast4: digitsOnly(data.number).slice(-4),
      };
      saveOrder(order);
      setPlacedId(order.id);
      setStep(3);
      clear();
      router.push("/" + locale + "/sifaris/" + order.id);
    }, 1200);
  }

  const steps = [t("checkout.step1"), t("checkout.step2"), t("checkout.step3")];

  return (
    <div ref={topRef} className="container-x scroll-mt-24 py-12 md:py-16">
      <SectionHeading as="h1" eyebrow={t("checkout.eyebrow")} title={t("checkout.title")} />

      <ol
        className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-line pb-5"
        aria-label={t("checkout.stepLabel", { step })}
      >
        {steps.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          return (
            <li
              key={label}
              aria-current={n === step ? "step" : undefined}
              className={cn(
                "caption flex items-center gap-3",
                n === step ? "text-cream" : n < step ? "text-brass" : "text-cream-3",
              )}
            >
              <span className="font-display text-base normal-case tracking-normal">{n}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {!hydrated ? (
        <div className="mt-12 h-40" aria-busy="true" />
      ) : lines.length === 0 && step !== 3 ? (
        <div className="mt-12 flex flex-col items-start gap-4">
          <p className="font-display text-2xl">{t("checkout.emptyCart")}</p>
          <p className="text-cream-2">{t("checkout.emptyCartText")}</p>
          <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline mt-2">
            {t("checkout.goToCatalog")}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="min-w-0">
            {step === 1 && <ContactForm defaultValues={contact ?? { method: cartDelivery }} onSubmit={onContact} />}
            {step === 2 && (
              <PaymentForm
                totalLabel={formatPrice(totals.total, locale)}
                processing={processing}
                onSubmit={onPayment}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <div className="flex flex-col gap-4" aria-live="polite">
                <p className="font-display text-3xl">{t("order.title")}</p>
                <p className="text-cream-2">
                  {t("order.thanks")} <span className="text-cream">{placedId}</span>
                </p>
                {placedId && (
                  <Link href={"/" + locale + "/sifaris/" + placedId} className="btn btn-outline self-start">
                    {t("order.eyebrow")} {placedId}
                  </Link>
                )}
              </div>
            )}
          </div>

          {step !== 3 && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="caption mb-4 text-cream-3">{t("checkout.summary")}</p>
              <ul className="divide-y divide-line border-y border-line">
                {lines.map((l) => (
                  <li key={l.product.slug} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate">{l.product.name}</span>
                      <span className="block text-xs text-cream-3">
                        {l.product.brand} · {l.product.volumeMl} {t("common.ml")} × {l.qty}
                      </span>
                    </span>
                    <span className="shrink-0">{formatPrice(l.product.priceAzn * l.qty, locale)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cream-2">{t("cart.subtotal")}</dt>
                  <dd>{formatPrice(totals.subtotal, locale)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream-2">{t("cart.delivery")}</dt>
                  <dd>{totals.delivery === 0 ? t("cart.free") : formatPrice(totals.delivery, locale)}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-line pt-4 text-base">
                  <dt>{t("cart.total")}</dt>
                  <dd className="font-display text-xl">{formatPrice(totals.total, locale)}</dd>
                </div>
              </dl>
              {method === "courier" && <p className="mt-3 text-xs text-cream-3">{t("checkout.contact.courierText")}</p>}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
