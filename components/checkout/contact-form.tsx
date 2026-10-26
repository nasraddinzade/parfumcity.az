"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatAzPhone, isAzPhone } from "@/lib/card";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "nameShort"),
    phone: z.string().refine(isAzPhone, "phoneInvalid"),
    method: z.enum(["pickup", "wolt", "courier"]),
    address: z.string().trim().max(300).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method !== "pickup" && !data.address) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "addressRequired" });
    }
  });

export type ContactData = z.infer<typeof contactSchema>;

interface Props {
  defaultValues?: Partial<ContactData>;
  onSubmit: (data: ContactData) => void;
}

export function ContactForm({ defaultValues, onSubmit }: Props) {
  const { locale, t } = useI18n();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", method: "pickup", address: "", note: "", ...defaultValues },
    mode: "onTouched",
  });

  const method = watch("method");
  const err = (key?: string) => (key ? t("checkout.errors." + key) : undefined);

  const methods: { value: ContactData["method"]; label: string; text: string; price: string }[] = [
    { value: "pickup", label: t("checkout.contact.pickup"), text: t("checkout.contact.pickupText"), price: t("cart.free") },
    { value: "wolt", label: t("checkout.contact.wolt"), text: t("checkout.contact.woltText"), price: formatPrice(0.49, locale) },
    { value: "courier", label: t("checkout.contact.courier"), text: t("checkout.contact.courierText"), price: "—" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="caption text-cream-3">
            {t("checkout.contact.name")}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t("checkout.contact.namePlaceholder")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="field"
            {...register("name")}
          />
          <p id="name-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.name?.message)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="caption text-cream-3">
            {t("checkout.contact.phone")}
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("checkout.contact.phonePlaceholder")}
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="field"
            {...register("phone", {
              onChange: (e) => setValue("phone", e.target.value.trim() === "" ? "" : formatAzPhone(e.target.value)),
            })}
          />
          <p id="phone-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.phone?.message)}
          </p>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="caption mb-3 text-cream-3">{t("checkout.contact.method")}</legend>
        {methods.map((m) => (
          <label
            key={m.value}
            className={cn(
              "flex cursor-pointer items-start gap-4 border p-4 transition-colors duration-300",
              method === m.value ? "border-cream" : "border-line hover:border-line-strong",
            )}
          >
            <input type="radio" value={m.value} className="mt-1 h-4 w-4 accent-[var(--color-brass)]" {...register("method")} />
            <span className="flex flex-1 flex-col gap-1">
              <span className="flex justify-between gap-4 text-sm">
                <span>{m.label}</span>
                <span className="text-cream-2">{m.price}</span>
              </span>
              <span className="text-xs text-cream-3">{m.text}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {method !== "pickup" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="caption text-cream-3">
            {t("checkout.contact.address")}
          </label>
          <input
            id="address"
            type="text"
            autoComplete="street-address"
            placeholder={t("checkout.contact.addressPlaceholder")}
            aria-invalid={errors.address ? "true" : undefined}
            aria-describedby={errors.address ? "address-error" : undefined}
            className="field"
            {...register("address")}
          />
          <p id="address-error" className="min-h-5 text-xs text-danger" role="alert">
            {err(errors.address?.message)}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="note" className="caption text-cream-3">
          {t("checkout.contact.note")}
        </label>
        <textarea id="note" rows={2} placeholder={t("checkout.contact.notePlaceholder")} className="field resize-none" {...register("note")} />
      </div>

      <button type="submit" className="btn btn-primary self-start">
        {t("checkout.contact.next")}
      </button>
    </form>
  );
}
