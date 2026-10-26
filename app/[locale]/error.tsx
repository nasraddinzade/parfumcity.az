"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale, t } = useI18n();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <div className="container-x flex min-h-[60vh] flex-col justify-center py-16">
      <SectionHeading
        as="h1"
        eyebrow={t("errors.errorEyebrow")}
        title={t("errors.errorTitle")}
        text={t("errors.errorText")}
      />
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="btn btn-primary">
          {t("errors.retry")}
        </button>
        <Link href={"/" + locale} className="btn btn-outline">
          {t("errors.backHome")}
        </Link>
      </div>
    </div>
  );
}
