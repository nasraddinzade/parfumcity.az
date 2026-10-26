import type { Locale } from "@/lib/i18n/config";

/**
 * Short editorial notes per brand. Only widely documented facts about the
 * houses themselves are stated here; brands we could not verify get no text
 * and the page falls back to a generic sentence built from the catalogue data.
 */
export const brandDescriptions: Partial<Record<string, Record<Locale, string>>> = {
  armani: {
    az: "Giorgio Armani-nin Milan evi. Acqua di Giò, Code, Sì və My Way kimi ətirlər dizayner parfümeriyasının klassikasına çevrilib.",
    ru: "Миланский дом Джорджо Армани. Acqua di Giò, Code, Sì и My Way стали классикой дизайнерской парфюмерии.",
    en: "Giorgio Armani's Milanese house. Acqua di Giò, Code, Sì and My Way have become classics of designer perfumery.",
  },
  brioni: {
    az: "1945-ci ildə Romada yaranmış kişi dərziliyi evi. Ətirləri klassik, təmkinli və geyim xəttinin davamı kimidir.",
    ru: "Римский дом мужского портновского искусства, основанный в 1945 году. Ароматы классические и сдержанные, как продолжение гардероба.",
    en: "A Roman tailoring house founded in 1945. Its fragrances are classic and restrained, an extension of the wardrobe.",
  },
  byredo: {
    az: "Stokholm, 2006. Ben Gorham-ın minimalist evi: sadə flakonlar, aydın kompozisiyalar — Gypsy Water, Bal d'Afrique, Mojave Ghost.",
    ru: "Стокгольм, 2006 год. Минималистичный дом Бена Горэма: простые флаконы и ясные композиции — Gypsy Water, Bal d'Afrique, Mojave Ghost.",
    en: "Stockholm, 2006. Ben Gorham's minimalist house: plain bottles and clear compositions — Gypsy Water, Bal d'Afrique, Mojave Ghost.",
  },
  casamorati: {
    az: "Xerjoff-un XIX əsr Bolonya parfümeriya evinin irsini davam etdirən kolleksiyası. Barokko flakonlar və zəngin, klassik kompozisiyalar.",
    ru: "Коллекция Xerjoff, продолжающая наследие болонской парфюмерии XIX века. Барочные флаконы и насыщенные классические композиции.",
    en: "Xerjoff's collection carrying on the legacy of a 19th-century Bologna perfumery. Baroque bottles and rich, classical compositions.",
  },
  "clive-christian": {
    az: "Britaniya lüks parfümeriya evi, tac formalı tıxacı ilə tanınır. 1872 və X kolleksiyaları yüksək konsentrasiyalı ətirlərdir.",
    ru: "Британский дом люксовой парфюмерии, узнаваемый по пробке в форме короны. Коллекции 1872 и X — ароматы высокой концентрации.",
    en: "A British luxury perfume house known for its crown-shaped stopper. The 1872 and X collections are high-concentration fragrances.",
  },
  "elie-saab": {
    az: "Livanlı kutüryenin ətirləri: çiçəkli, işıqlı, təntənəli — kuturdakı kimi.",
    ru: "Ароматы ливанского кутюрье: цветочные, светлые, торжественные — как и его кутюр.",
    en: "Fragrances from the Lebanese couturier: floral, luminous and ceremonial, like his couture.",
  },
  "essential-parfums": {
    az: "Paris evi: hər ətir tanınmış parfümer tərəfindən yaradılır və əsas inqrediyentin adını daşıyır — Bois Impérial, Nice Bergamote, Mon Vétiver.",
    ru: "Парижский дом: каждый аромат создан известным парфюмером и назван по главному ингредиенту — Bois Impérial, Nice Bergamote, Mon Vétiver.",
    en: "A Paris house where each scent is made by a renowned perfumer and named after its key ingredient — Bois Impérial, Nice Bergamote, Mon Vétiver.",
  },
  givenchy: {
    az: "1952-ci ildə Hubert de Givenchy-nin qurduğu Paris evi. L'Interdit və Gentleman xətləri bu gün də davam edir.",
    ru: "Парижский дом, основанный Юбером де Живанши в 1952 году. Линии L'Interdit и Gentleman продолжаются и сегодня.",
    en: "The Paris house founded by Hubert de Givenchy in 1952. The L'Interdit and Gentleman lines continue to this day.",
  },
  guerlain: {
    az: "Paris, 1828. Ən qədim fəaliyyət göstərən parfümeriya evlərindən biri. Shalimar və Aqua Allegoria kolleksiyası.",
    ru: "Париж, 1828 год. Один из старейших действующих парфюмерных домов. Shalimar и коллекция Aqua Allegoria.",
    en: "Paris, 1828. One of the oldest perfume houses still in business. Shalimar and the Aqua Allegoria collection.",
  },
  hermes: {
    az: "Paris, 1837. Yəhər emalatxanasından başlayan ev; Terre d'Hermès və Un Jardin seriyası onun parfümeriya üslubunu müəyyən edir.",
    ru: "Париж, 1837 год. Дом, начавшийся с шорной мастерской; Terre d'Hermès и серия Un Jardin определяют его парфюмерный стиль.",
    en: "Paris, 1837. A house that began as a saddlery; Terre d'Hermès and the Un Jardin series define its perfumery.",
  },
  "hfc-paris": {
    az: "Haute Fragrance Company — Paris niş evi. Kolleksiyalar musiqi və şəhər mövzularına görə qurulur.",
    ru: "Haute Fragrance Company — парижский нишевый дом. Коллекции собраны вокруг тем музыки и городов.",
    en: "Haute Fragrance Company, a Paris niche house. Its collections are built around themes of music and cities.",
  },
  "jean-paul-gaultier": {
    az: "Fransız kutüryenin ətirləri: Le Male və Classique-in büst formalı flakonları dərhal tanınır.",
    ru: "Ароматы французского кутюрье: флаконы-торсы Le Male и Classique узнаются мгновенно.",
    en: "Fragrances from the French couturier: the torso bottles of Le Male and Classique are instantly recognisable.",
  },
  "juliette-has-a-gun": {
    az: "Romano Ricci-nin Paris evi. Not a Perfume — tək bir molekul üzərində qurulmuş məşhur ətir.",
    ru: "Парижский дом Романо Риччи. Not a Perfume — знаменитый аромат, построенный на одной молекуле.",
    en: "Romano Ricci's Paris house. Not a Perfume is its famous scent built on a single molecule.",
  },
  lancome: {
    az: "Paris, 1935. La Vie Est Belle və Idôle — evin müasir simvolları.",
    ru: "Париж, 1935 год. La Vie Est Belle и Idôle — современные символы дома.",
    en: "Paris, 1935. La Vie Est Belle and Idôle are the house's modern signatures.",
  },
  "memo-paris": {
    az: "Səyahət ilhamlı Paris evi: hər ətir bir yerin xatirəsidir — Irish Leather, African Leather, Marfa.",
    ru: "Парижский дом, вдохновлённый путешествиями: каждый аромат — память о месте. Irish Leather, African Leather, Marfa.",
    en: "A Paris house inspired by travel: each scent is the memory of a place — Irish Leather, African Leather, Marfa.",
  },
  orlov: {
    az: "Orlov Paris — adını məşhur Orlov almazından alan niş ev. Qiymətli daşlara həsr olunmuş kolleksiya.",
    ru: "Orlov Paris — нишевый дом, названный в честь знаменитого бриллианта Орлова. Коллекция посвящена драгоценным камням.",
    en: "Orlov Paris, a niche house named after the famous Orlov diamond. A collection devoted to precious stones.",
  },
  prada: {
    az: "Milan, 1913. Luna Rossa, Paradoxe və Candy — dəqiq, müasir dizayner parfümeriyası.",
    ru: "Милан, 1913 год. Luna Rossa, Paradoxe и Candy — точная, современная дизайнерская парфюмерия.",
    en: "Milan, 1913. Luna Rossa, Paradoxe and Candy — precise, modern designer perfumery.",
  },
  "roja-parfums": {
    az: "Roja Dove-un London evi. Yüksək konsentrasiya, təbii inqrediyentlər və barokko flakonlar — Enigma, Elysium, Danger.",
    ru: "Лондонский дом Роджи Дава. Высокая концентрация, натуральные ингредиенты и барочные флаконы — Enigma, Elysium, Danger.",
    en: "Roja Dove's London house. High concentration, natural materials and baroque bottles — Enigma, Elysium, Danger.",
  },
  sospiro: {
    az: "Xerjoff-un musiqi və opera dünyasından ilhamlanan kolleksiyası: Erba Pura, Accento, Opera.",
    ru: "Коллекция Xerjoff, вдохновлённая миром музыки и оперы: Erba Pura, Accento, Opera.",
    en: "Xerjoff's collection inspired by the world of music and opera: Erba Pura, Accento, Opera.",
  },
  thameen: {
    az: "London niş evi. Hər ətir əfsanəvi bir daş-qaşa həsr olunub — Regent, Cullinan Diamond, Peregrina.",
    ru: "Лондонский нишевый дом. Каждый аромат посвящён легендарной драгоценности — Regent, Cullinan Diamond, Peregrina.",
    en: "A London niche house. Each fragrance is devoted to a legendary jewel — Regent, Cullinan Diamond, Peregrina.",
  },
  "tom-ford": {
    az: "Tom Ford Beauty, 2006. Private Blend kolleksiyası — Oud Wood, Tobacco Vanille, Lost Cherry — və Black Orchid.",
    ru: "Tom Ford Beauty, 2006 год. Коллекция Private Blend — Oud Wood, Tobacco Vanille, Lost Cherry — и Black Orchid.",
    en: "Tom Ford Beauty, 2006. The Private Blend collection — Oud Wood, Tobacco Vanille, Lost Cherry — and Black Orchid.",
  },
  "vilhelm-parfumerie": {
    az: "Nyu-York evi, Jan Ahlgren tərəfindən qurulub. Dear Polly, Morning Chess, Mango Skin.",
    ru: "Нью-йоркский дом, основанный Яном Альгреном. Dear Polly, Morning Chess, Mango Skin.",
    en: "A New York house founded by Jan Ahlgren. Dear Polly, Morning Chess, Mango Skin.",
  },
  widian: {
    az: "Abu-Dabi evi. Ud, ənbər və ədviyyatlar üzərində qurulmuş zəngin Şərq kompozisiyaları.",
    ru: "Дом из Абу-Даби. Насыщенные восточные композиции на основе уда, амбры и специй.",
    en: "A house from Abu Dhabi. Rich oriental compositions built on oud, amber and spices.",
  },
  xerjoff: {
    az: "Turin, 2003. Sergio Momo-nun evi: Naxos, Erba Pura, Alexandria — niş parfümeriyanın ən tanınmış adlarından.",
    ru: "Турин, 2003 год. Дом Серджо Момо: Naxos, Erba Pura, Alexandria — одни из самых известных имён нишевой парфюмерии.",
    en: "Turin, 2003. Sergio Momo's house: Naxos, Erba Pura, Alexandria — among the best-known names in niche perfumery.",
  },
  "yves-saint-laurent": {
    az: "Paris, 1961. Opium, Libre, Black Opium və Y — hər dövrün öz Saint Laurent ətri var.",
    ru: "Париж, 1961 год. Opium, Libre, Black Opium и Y — у каждой эпохи свой аромат Saint Laurent.",
    en: "Paris, 1961. Opium, Libre, Black Opium and Y — every era has its own Saint Laurent scent.",
  },
  zilli: {
    az: "Lion, 1970. Lüks kişi geyimi evi; ətirləri dəri və ağac notları üzərində qurulub.",
    ru: "Лион, 1970 год. Дом люксовой мужской одежды; ароматы построены на кожаных и древесных нотах.",
    en: "Lyon, 1970. A luxury menswear house; its fragrances are built on leather and woody notes.",
  },
};

export function getBrandDescription(slug: string, locale: Locale): string | null {
  return brandDescriptions[slug]?.[locale] ?? null;
}
