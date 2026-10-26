import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartHydration } from "@/components/providers/cart-hydration";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bodoni",
  display: "swap",
  axes: ["opsz"],
});

// Bodoni Moda has no Cyrillic; Playfair Display fills in those glyphs for Russian headings.
const playfair = Playfair_Display({
  subsets: ["cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0e0c0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.home.title, template: "%s | Parfum City" },
    description: dict.meta.home.description,
    applicationName: "Parfum City",
    formatDetection: { telephone: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={bodoni.variable + " " + playfair.variable + " " + jost.variable}>
      <body className="flex min-h-dvh flex-col bg-ink text-cream">
        <I18nProvider locale={locale} dict={dict}>
          <a
            href="#main"
            className="sr-only z-50 bg-cream px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {dict.nav.skipToContent}
          </a>
          <CartHydration />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
          <CartDrawer />
        </I18nProvider>
      </body>
    </html>
  );
}
