"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <div className="container-x flex min-h-[60vh] flex-col justify-center py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("errors.notFoundEyebrow")}
        title={t("errors.notFoundTitle")}
        text={t("errors.notFoundText")}
      />
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href={"/" + locale} className="btn btn-primary">
          {t("errors.backHome")}
        </Link>
        <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline">
          {t("errors.toCatalog")}
        </Link>
      </div>
    </div>
  );
}
