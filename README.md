# Parfum City — sayt konsepti / дизайн-концепт сайта

Bakıdakı niş və lüks parfümeriya butiki **Parfum City** üçün dizayn-konsept.
Bu, butikin rəsmi saytı deyil: butikin öz saytı yoxdur, konsept soyuq təklif üçün hazırlanıb.

Дизайн-концепт для бакинского бутика нишевой и люксовой парфюмерии **Parfum City**.
Это не официальный сайт бутика: своего сайта у бутика нет, концепт сделан для холодного предложения.

---

## AZ

### Nə var

- 3 dil: `/az` (əsas), `/ru`, `/en`. Kök ünvan `/` seçilmiş dilə yönləndirilir (seçim `NEXT_LOCALE` cookie-də saxlanılır).
- 33 brend və 590 mövqe — `data/products.json` və `data/brands.json` faylından, dəyişdirilmədən.
- Kataloq: axtarış, brend / həcm / konsentrasiya / seqment / qiymət filtrləri, sıralama, 24-lük yükləmə. Filtrlər URL-də saxlanılır, link göndərmək olar.
- Məhsul səhifəsi: eyni ətrin başqa həcmləri, səbət, çatdırılma bloku, eyni brenddən oxşar ətirlər.
- Səbət: `localStorage`-da saxlanılır, sağdan açılan panel, başlıqda sayğac.
- Sifariş imitasiyası: əlaqə → kart → təsdiq. Real ödəniş yoxdur (aşağıya bax).
- SEO: hər səhifədə `title`/`description`, hreflang, Open Graph şəkilləri, `sitemap.xml`, `robots.txt`, JSON-LD (Store, Product).
- Tünd və açıq mövzu: başlıqdakı düymə, seçim `localStorage`-da saxlanılır, səhifə yüklənəndə yanıb-sönmür. Standart mövzu tünddür. Açıq palitra `app/globals.css`-də `:root[data-theme="light"]` blokundadır.

### Necə işə salmaq

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # əvvəlcə data yoxlanılır (prebuild), sonra next build
npm run start      # production server
npm run lint
npm run typecheck
```

Vercel-də sayt ünvanı `VERCEL_PROJECT_PRODUCTION_URL`-dən avtomatik götürülür; öz domeniniz üçün `NEXT_PUBLIC_SITE_URL` təyin edin (sitemap, hreflang və OG linkləri üçün).
Kod Vercel-ə bağlı deyil: istənilən Node.js hostinqdə `next build && next start` işləyir.

### Data harada

| Fayl                         | Məzmun                                                                |
| ---------------------------- | --------------------------------------------------------------------- |
| `data/products.json`         | 590 mövqe (id, slug, brend, ad, həcm, konsentrasiya, qiymət, seqment) |
| `data/brands.json`           | 33 brend (ad, slug, seqment, mövqe sayı)                              |
| `data/brand-descriptions.ts` | Brend səhifələri üçün qısa mətnlər (3 dildə)                          |
| `data/images.ts`             | Şəkil xəritəsi (aşağıya bax)                                          |
| `messages/*.json`            | İnterfeys tərcümələri                                                 |
| `types/product.ts`           | Tiplər; `lib/schemas.ts` — zod sxemləri                               |

`npm run build` zamanı `scripts/validate-data.ts` məlumatları zod ilə yoxlayır: slug-ların unikallığı, brend sayları, sahə tipləri. Səhv varsa build dayanır.

### Şəkilləri necə əvəz etmək

Hazırda `products.json`-da `image` sahəsi `null`-dur. Şəkillər `data/images.ts` faylından götürülür:

1. `productImages["<slug>"]` — konkret məhsulun şəkli;
2. yoxdursa `brandImages["<brandSlug>"]` — brendin ümumi şəkli;
3. o da yoxdursa — kodla çəkilmiş flakon (rəng brend adından hesablanır).

Butik öz fotolarını göndərəndə:

- faylları `public/images/products/` və ya `public/images/brands/` qovluğuna qoyun və `data/images.ts`-də `"/images/..."` yolunu yazın; **və ya**
- xarici link yazın (CDN, öz hostinq) və host adını həmin faylda `imageHosts` siyahısına əlavə edin — o, `next.config.ts`-dəki `images.remotePatterns`-ə ötürülür.

Xarici link yüklənməsə, `<ProductImage>` səssizcə çəkilmiş flakona keçir — şəbəkə pozulmur.
Hazırkı 5 foto Wikimedia Commons-dan götürülmüş müvəqqəti nümunələrdir (`public/images/CREDITS.md`).

### Ödəniş imitasiyası

- Real ödəniş sistemi yoxdur, heç bir məlumat heç yerə göndərilmir.
- Kart formasında maska, Luhn yoxlaması və müddət yoxlaması var. Yalnız test nömrələri qəbul olunur: `4242 4242 4242 4242`, `4000 0566 5566 5556`, `5555 5555 5555 4444`, `2223 0031 2200 3222`. Başqa nömrə demo barədə xəbərdarlıqla rədd edilir.
- Sifariş `PC-XXXXXXXXX` nömrəsi ilə `localStorage`-a yazılır (yalnız kartın son 4 rəqəmi saxlanılır) və `/sifariş/<nömrə>` səhifəsində göstərilir. Sifarişdən sonra səbət təmizlənir.
- Çatdırılma: butikdən götürmə — pulsuz; Wolt — 0,49 ₼; kuryer — qiymət telefonla razılaşdırılır, yekuna daxil deyil.

### Stek

Next.js 15 (App Router, TypeScript strict), Tailwind CSS v4 (`@theme` tokenləri, UI-kit yoxdur), zustand (persist), react-hook-form + zod, `next/image`, `next/font/google` (Playfair Display başlıqlar üçün, Jost mətn üçün). Backend və baza yoxdur.

---

## RU

### Что есть

- 3 языка: `/az` (по умолчанию), `/ru`, `/en`. Корень `/` редиректит на выбранный язык (выбор хранится в cookie `NEXT_LOCALE`).
- 33 бренда и 590 позиций из `data/products.json` и `data/brands.json`, без изменений.
- Каталог: поиск, фильтры по бренду / объёму / концентрации / сегменту / цене, сортировка, подгрузка по 24. Состояние фильтров живёт в URL, ссылку можно отправить.
- Карточка товара: другие объёмы того же аромата, корзина, блок доставки, похожие ароматы бренда.
- Корзина в `localStorage`, выезжающая панель справа, счётчик в шапке.
- Имитация заказа: контакты → карта → подтверждение. Реальной оплаты нет (см. ниже).
- SEO: `title`/`description` на каждой странице, hreflang, Open Graph-картинки, `sitemap.xml`, `robots.txt`, JSON-LD (Store, Product).
- Тёмная и светлая тема: кнопка в шапке, выбор хранится в `localStorage` и применяется до отрисовки, без мигания. По умолчанию тёмная. Светлая палитра описана в `app/globals.css` в блоке `:root[data-theme="light"]`, компоненты используют одни и те же токены.

### Как запустить

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # сначала валидация данных (prebuild), потом next build
npm run start      # production-сервер
npm run lint
npm run typecheck
```

На Vercel адрес сайта подставляется автоматически из `VERCEL_PROJECT_PRODUCTION_URL`; для своего домена задайте `NEXT_PUBLIC_SITE_URL` (нужен для sitemap, hreflang и OG-ссылок).
Код не зависит от Vercel: `next build && next start` работает на любом Node.js-хостинге.

### Где лежат данные

| Файл                         | Содержимое                                                                  |
| ---------------------------- | --------------------------------------------------------------------------- |
| `data/products.json`         | 590 позиций (id, slug, бренд, название, объём, концентрация, цена, сегмент) |
| `data/brands.json`           | 33 бренда (название, slug, сегмент, количество позиций)                     |
| `data/brand-descriptions.ts` | Короткие тексты для страниц брендов (3 языка)                               |
| `data/images.ts`             | Карта картинок (см. ниже)                                                   |
| `messages/*.json`            | Переводы интерфейса                                                         |
| `types/product.ts`           | Типы; `lib/schemas.ts` — схемы zod                                          |

При `npm run build` скрипт `scripts/validate-data.ts` проверяет данные через zod: уникальность slug, счётчики брендов, типы полей. При ошибке сборка останавливается.

### Как подменить фотографии

Сейчас поле `image` в `products.json` равно `null`. Картинки берутся из `data/images.ts`:

1. `productImages["<slug>"]` — фото конкретного товара;
2. если нет — `brandImages["<brandSlug>"]`, общая картинка бренда;
3. если и её нет — нарисованный кодом флакон (цвет выводится из названия бренда).

Когда бутик пришлёт свои фото:

- положите файлы в `public/images/products/` или `public/images/brands/` и укажите путь `"/images/..."` в `data/images.ts`; **или**
- укажите внешнюю ссылку (CDN, свой хостинг) и добавьте хост в список `imageHosts` в том же файле — он попадает в `images.remotePatterns` в `next.config.ts`.

Если внешняя ссылка не загрузилась, `<ProductImage>` молча показывает нарисованный флакон, сетка не ломается.
Текущие 5 фото — временные примеры с Wikimedia Commons (`public/images/CREDITS.md`).

### Что именно имитируется в оплате

- Платёжной системы нет, данные никуда не отправляются и не покидают браузер.
- Форма карты: маска, проверка Luhn, проверка срока. Принимаются только тестовые номера: `4242 4242 4242 4242`, `4000 0566 5566 5556`, `5555 5555 5555 4444`, `2223 0031 2200 3222`. Любой другой номер отклоняется с подсказкой, что это демо.
- Заказ с номером `PC-XXXXXXXXX` сохраняется в `localStorage` (из карты хранятся только последние 4 цифры) и показывается на странице `/sifaris/<номер>`. После заказа корзина очищается.
- Доставка: самовывоз — бесплатно; Wolt — 0,49 ₼; курьер — стоимость согласуется по телефону и в итог не входит.

### Стек

Next.js 15 (App Router, TypeScript strict), Tailwind CSS v4 (токены в `@theme`, без UI-китов), zustand (persist), react-hook-form + zod, `next/image`, `next/font/google` (Playfair Display для заголовков, Jost для текста). Бэкенда и базы нет.

### Структура

```
app/[locale]/            страницы: главная, brendler, kolleksiya, mehsul, sebet, odenis, sifaris, butik
app/[locale]/*/opengraph-image.tsx   OG-картинки (шрифты в assets/fonts)
components/              layout, product, catalog, cart, checkout, brands, home, og, seo, ui
lib/                     каталог, фильтры, корзина, заказы, карта, i18n, seo, форматирование
store/cart.ts            zustand-стор корзины
data/                    данные бутика, описания брендов, карта картинок
messages/                словари az / ru / en
scripts/validate-data.ts валидация данных перед сборкой
```
