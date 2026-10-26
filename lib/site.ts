/** Real boutique facts. Nothing here is invented; do not "improve" these numbers. */
export const site = {
  name: "Parfum City",
  since: 2023,
  address: "Nizami küçəsi 111, Nəsimi rayonu, AZ1010, Bakı",
  addressShort: "Nizami küçəsi 111, Bakı",
  phone: "+994 50 995 27 27",
  phoneHref: "tel:+994509952727",
  instagram: "https://instagram.com/parfumcity.az",
  instagramHandle: "@parfumcity.az",
  wolt: "https://wolt.com/az/aze/baku/venue/parfum-city",
  woltFeeAzn: 0.49,
  woltMinOrderAzn: 6,
  woltMinutes: 40,
  hours: { open: "10:30", close: "20:30" },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Parfum City, Nizami küçəsi 111, Nəsimi rayonu, AZ1010, Bakı"),
  geo: { city: "Bakı", district: "Nəsimi rayonu", postalCode: "AZ1010", country: "AZ" },
} as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://parfumcity-az.vercel.app").replace(/\/$/, "");
