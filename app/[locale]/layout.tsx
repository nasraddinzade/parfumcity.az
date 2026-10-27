import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartHydration } from "@/components/providers/cart-hydration";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Playfair Display keeps visible hairlines at small sizes on light backgrounds
// (a true didone such as Bodoni thins out there) and covers Cyrillic natively.
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
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
  width: "device-width",
  initialScale: 1,
};

/** Applies the saved theme before paint so a light-theme visitor never sees a dark flash. */
const themeScript =
  "(function(){try{var t=localStorage.getItem('parfumcity-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.home.title, template: "%s | Parfum City" },
    description: createTranslator(dict)("meta.home.description"),
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
    <html
      lang={htmlLang[locale]}
      className={playfair.variable + " " + jost.variable}
      // data-theme is set by the inline script before hydration, so the attribute may legitimately differ.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
