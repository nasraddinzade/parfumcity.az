"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isExpiryInFuture,
  luhnCheck,
  parseExpiry,
  TEST_CARD_NUMBERS,
} from "@/lib/card";

export const paymentSchema = z.object({
  number: z
    .string()
    .refine((v) => digitsOnly(v).length === 16, { message: "cardNumberLength", abort: true })
    .refine((v) => luhnCheck(digitsOnly(v)), { message: "cardLuhn", abort: true })
    .refine((v) => TEST_CARD_NUMBERS.has(digitsOnly(v)), { message: "cardNotTest" }),
  name: z.string().trim().min(2, "cardName"),
  expiry: z
    .string()
    .refine((v) => parseExpiry(v) !== null, { message: "expiryFormat", abort: true })
    .refine((v) => isExpiryInFuture(v), { message: "expiryPast" }),
  cvc: z.string().regex(/^\d{3}$/, "cvc"),
});

export type PaymentData = z.infer<typeof paymentSchema>;

interface Props {
  totalLabel: string;
  processing: boolean;
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}

export function PaymentForm({ totalLabel, processing, onSubmit, onBack }: Props) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { number: "", name: "", expiry: "", cvc: "" },
    mode: "onTouched",
  });

  const err = (key?: string) => (key ? t("checkout.errors." + key) : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8" autoComplete="off">
      <div
        role="note"
        className="flex flex-col gap-2 border border-brass/60 bg-panel p-5"
      >
        <p className="caption text-brass">{t("checkout.payment.demoTitle")}</p>
        <p className="text-sm leading-relaxed text-cream-2">{t("checkout.payment.demoText")}</p>
      </div>

      <fieldset disabled={processing} className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="card-number" className="caption text-cream-3">
            {t("checkout.payment.cardNumber")}
          </label>
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            aria-invalid={errors.number ? "true" : undefined}
            aria-describedby="card-number-hint card-number-error"
            className="field tracking-[0.12em]"
            {...register("number", { onChange: (e) => setValue("number", formatCardNumber(e.target.value)) })}
          />
          <p id="card-number-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.number?.message)}
          </p>
          <p id="card-number-hint" className="text-xs text-cream-3">
            {t("checkout.payment.testHint")}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="card-name" className="caption text-cream-3">
            {t("checkout.payment.cardName")}
          </label>
          <input
            id="card-name"
            type="text"
            autoComplete="off"
            placeholder={t("checkout.payment.cardNamePlaceholder")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "card-name-error" : undefined}
            className="field uppercase"
            {...register("name")}
          />
          <p id="card-name-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.name?.message)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="card-expiry" className="caption text-cream-3">
            {t("checkout.payment.expiry")}
          </label>
          <input
            id="card-expiry"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("checkout.payment.expiryPlaceholder")}
            maxLength={5}
            aria-invalid={errors.expiry ? "true" : undefined}
            aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
            className="field"
            {...register("expiry", { onChange: (e) => setValue("expiry", formatExpiry(e.target.value)) })}
          />
          <p id="card-expiry-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.expiry?.message)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="card-cvc" className="caption text-cream-3">
            {t("checkout.payment.cvc")}
          </label>
          <input
            id="card-cvc"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder="•••"
            maxLength={3}
            aria-invalid={errors.cvc ? "true" : undefined}
            aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
            className="field"
            {...register("cvc", { onChange: (e) => setValue("cvc", digitsOnly(e.target.value).slice(0, 3)) })}
          />
          <p id="card-cvc-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.cvc?.message)}
          </p>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onBack} disabled={processing} className="link-line self-start text-sm text-cream-2 hover:text-cream">
          {t("checkout.payment.back")}
        </button>
        <button type="submit" disabled={processing} className="btn btn-primary sm:min-w-56" aria-busy={processing}>
          {processing ? t("checkout.payment.processing") : t("checkout.payment.pay", { total: totalLabel })}
        </button>
      </div>
    </form>
  );
}
