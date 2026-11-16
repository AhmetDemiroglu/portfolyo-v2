# MOTION_SPEC: scroll odaklı, katmanlı parallax portfolyo

Durum: **Faz 1 (rev 3) ve Faz 2 görsel olarak onaylandı (Ahmet, 2026-11-16).** Lighthouse ve 390 px ölçümü yapıldı (14). Açık kalanlar: kare ölçümü (4x CPU), gerçek cihaz/dokunmatik, Tab odağı. Commit yok. Tarih: 2026-11-16.
Kapsam: yalnız ana sayfa (`/`). Diğer rotalar bölüm 9'da.

## 0. Kararlar (Ahmet, 2026-11-16)

| # | Karar | Seçim |
|---|---|---|
| 1 | Kapsam | Yalnız ana sayfa, v1 |
| 2 | Motor | framer-motion `useScroll` + CSS `position: sticky`, yeni paket yok |
| 3 | Hero pin | **300vh** sarmalayıcı (200vh kaydırma yolu) |
| 4 | Featured pin | Evet. Adım **60vh**, sarmalayıcı 100 + 3 × 60 = **280vh** |
| 5 | Alt yazı | Evet, 4 dil (bölüm 4.5) |

Ahmet'in ek spec değişiklikleri (rev 2):

1. Binalar `scaleY` ile değil **`translateY`** ile yükselir: path bitmiş yükseklikte çizilir, aşağı kaydırılmış başlar, sahne alt kenarı kırpar (4.1).
2. Pencereler **kendi binasının çocuğu**; yanma o binanın yükselmesi bitmeden başlamaz (4.1).
3. Pin içine **kamera**: p 0,35 - 1,00 arası yakın 1 → 1,18, orta 1 → 1,10, uzak 1 → 1,04 scale, origin alt-orta. Başlangıç değerleri, görüp ayarlanır (4.1).
4. p değeri **`useSpring`**'den geçer, tekerlek basamakları yumuşar (7).
5. **`?p=0..1`** debug parametresi (7). Uygulama sırası: önce yalnız hero, görüntüler, kare süresi ölçümü, dur (10).

## 1. Mevcut animasyon yöntemi (kod okumasından)

Yığın: React 19, Vite 7, TanStack Router, Tailwind 3, framer-motion 12. Proje `CLAUDE.md` yok (boş). GSAP, Lenis, ScrollTrigger yok. Hiçbir yerde pin yok.

| Yer | Yöntem | Tür |
|---|---|---|
| Hero girişi | CSS `@keyframes hero-in`, satır başına özel değişkenle gecikme | Yükleme anı, tek sefer. LCP için bilinçli olarak CSS (commit `96fbce4`) |
| Hero metni | `useScroll` + `useTransform`: y 0 → -36%, opacity 1 → 0 (ilerleme 0 → 0,65) | Scrub, iki yönlü |
| `CityScene` | 3 silüet katmanı tek `<path>`, `preserveAspectRatio="none"`. Hero ilerlemesine bağlı y: uzak %26, orta %48, yakın %76, güneş/ay %140 | Scrub |
| Yıldız, bulut | CSS sonsuz döngü (`star-twinkle`, `cloud-drift`) | Zamana bağlı |
| `Reveal` | `whileInView`, `once: true`, margin -60px, 0,7 sn | Tetiklemeli, tek sefer |
| `ParallaxY` / `ParallaxX` / `GhostWord` | Eleman görünürlükte geçerken ±px drift | Scrub |
| `Contours` | `ParallaxY` 70 → -70 | Scrub |
| `VelocityMarquee` | `useVelocity` + `useAnimationFrame`, kaydırma hızına göre yön ve hız | Sürekli |
| Header | `scrollY > 24` sınıf değişimi, `layoutId` alt çizgi | Tetiklemeli |
| About | Zaman çizgisi omurgası `useSpring(scrollYProgress)`, hero y/opacity | Scrub |

Her scroll bileşeni `useReducedMotion()` ile kapanıyor; CSS `hero-in` de `prefers-reduced-motion` ile sönüyor. Tema tokenları `--c-sky-*` ile gök katmanları hem açık hem koyu temada tanımlı.

Ana sayfa bugün: hero 100svh, ribbon, Career, Studio, ribbon, Featured, footer. Toplam 3281 px / 729 px görünüm = **4,5 ekran**.

## 2. Referans siteler (ölçüm)

Araç: Claude in Chrome eklentisi (Chrome DevTools MCP yerine, `CLAUDE.md` tarayıcı kuralı). Pencere 1440x900; canlı sitenin %0 görüntüsü 1440x729 görünümde, diğer tüm görüntüler 1512x673 görünümde alındı. Görüntüler `docs/motion-ref/` içinde, dosya adı yüzde = scroll konumu.

Yalnız ölçülen yazıldı. `window` üzerinde GSAP veya Lenis izi olmaması kütüphane yok demek değildir (bundle içinde olabilir). Canvas sayısı tekniği söylemez. Birim: **ekran** = görünüm yüksekliği; 1 ekran = 100vh.

| Site | Kaydırma | Pin'ler (sarmalayıcı yüksekliği) | Motor izi | Not |
|---|---|---|---|---|
| ahmetdemiroglu.dev | 4,5 ekran | yok | framer-motion | Hero parallax, geri kalan reveal |
| wiro.ae | 10,7 ekran | intro `wi-stage` sticky, 2827 px = **420vh** (4,2 ekran) | Next.js, 18 canvas (gök gradyanı, yıldız), `window`'da Lenis/GSAP izi yok, `.pin-spacer` yok | Ofis sahnesi → pencereye zoom → gök + Pegasus → gece göğü + logo (logo ~%32'de). Tek sahne, scrub. Sonra normal bölümler, yatay kart şeridi |
| vastworld.ai | 11,9 ekran (`div.lenis` kaydırma kabı, window 0) | Tek 6500 px = **965vh** (9,7 ekran) sahne; içinde en az 10 `sticky top-0 h-0` katman, z-index ile üst üste | Astro, Lenis (`window.lenis` var), 9 canvas (2'si tam ekran) | 3D ada, sahne sahne renk değişimi (siyah → beyaz → sarı), üçgen maskeler. Pahalı yol |
| hanusek.com | 26,6 ekran | `bp-pin` 1749 px = **260vh**, `crew-pin` 6056 px = **900vh**, `work-pin` 5518 px = **820vh** | Vanilla JS (`site.js` 7,8 KB: rAF, IntersectionObserver, `prefers-reduced-motion` var), canvas yok | 3 bölümlü pin: adım adım içerik değişimi (6 ajan, 13 proje), sol başlık listesi + sağ görsel. Bize en yakın model |

Çıkarılan kalıplar:

1. **Pinli giriş sahnesi** 300 ile 420vh arası yeterli (wiro 420vh). 900vh üstü (vast, hanusek crew) yalnız çok içerikli sahnede.
2. **Adımlı pin** (hanusek work): sol liste, sağ görsel, adım başına ~60vh. Öne çıkan projeler için uygun.
3. **Sticky + tek ilerleme değeri** (hanusek) GSAP olmadan çalışıyor; Lighthouse dostu.
4. vast ve hanusek hero metnini scroll 0'da tam gösteriyor, sahne scroll ile başlıyor. wiro ise scroll 0'da intro sahnesi gösteriyor, başlık ~%32'de geliyor ("skip intro" düğmesi var). Biz vast/hanusek yolundayız: metin scroll 0'da tam.

## 3. Konsept: silüet şehre dönüşüyor

Hikâye üç perde, Ahmet'in şehir plancılığı geçmişine bağlı: **Plan → İnşa → Hayat**.

- Scroll 0: bugünkü hero aynen (ay/güneş, düz silüetler, metin). LCP ve kimlik korunur.
- Plan: silüetlerin üstünde çizgi çizim (stroke) ile "proje" belirir, blueprint ızgarası parlar.
- İnşa: vinç çalışır, binalar silüetten yükselip çizgileri doldurur, katmanlar derinleşir.
- Hayat: pencereler yanar, ay yükselip küçülür, yıldızlar parlar, alt yazı gelir.
- Pin biter, inşa edilmiş şehir sayfayla birlikte yukarı kayar (çıkış parallax'ı).

Tema: koyu = ay + yıldız, açık = güneş + bulut (bugünkü eşleme). Koreografi aynı, nesne temaya göre. Açık temada "pencere yanması" yerine pencereler koyulaşır (cam tonu, `ink/0.35`). Gün → gece geçişi v1'de yok (token sistemiyle çakışır), v2 adayı.

## 4. Bölüm bölüm spec (ana sayfa, lg ve üstü)

Pin birimi: **sarmalayıcı yüksekliği** (vh) ve **kaydırma yolu** = sarmalayıcı - 100vh. `p` = pin boyunca ilerleme 0..1 (`useScroll({ target: wrapper, offset: ["start start", "end end"] })`).

### 4.1 Hero: "Şehir" (pinli) [zaman çizelgesi ve pencere maddeleri bölüm 12 ile değişti]

| Özellik | Değer |
|---|---|
| Sarmalayıcı | 300vh (`svh`), sticky sahne 100svh, `top: 0` |
| Kaydırma yolu | 200vh |
| Mod | **Scrub**, iki yönlü, p `useSpring` ile yumuşatılmış (bölüm 7). Yalnız yükleme girişi (`hero-in`) tetiklemeli ve bugünkü gibi CSS |
| Mobil | 260svh sarmalayıcı (160svh yol). Bölüm 5 |
| Azaltılmış hareket | Pin yok, sahne scroll 0 halinde statik. Bölüm 6 geçerli |

Zaman çizelgesi (p):

| Perde | p aralığı | Ne olur |
|---|---|---|
| Hero | 0,00 - 0,08 | Scroll ipucu söner (opacity 1 → 0). Başka değişim yok |
| Metin çıkışı | 0,08 - 0,32 | Metin bloğu y 0 → -30%, opacity 1 → 0. 0,32'den sonra `visibility: hidden` (CTA'lar görünmezken Tab ile odaklanmasın) |
| Plan | 0,15 - 0,42 | Blueprint ızgarası opacity 0,5 → 1. Bina dış çizgileri `pathLength` 0 → 1 (soldan sağa 0,06 kademeli). Çizgiler silüetin üstüne, bitmiş bina yüksekliğine kadar |
| Vinç | 0,28 - 0,62 | Orta katmandaki vinç kanca ipi uzar (scaleY 0,2 → 1), kol -6° → 0° → +4° → 0° |
| İnşa: uzak | 0,35 - 0,58 | Uzak katman tek grup, `translateY(+Δ) → 0`. Δ = bitmiş yükseklik - bugünkü silüet yüksekliği (viewBox biriminde, ~%35) |
| İnşa: orta | 0,40 - 0,70 | Orta katman binaları tek tek `translateY(+Δ_i) → 0`, soldan sağa kademeli (her bina 0,12 süre, başlangıç x konumuna göre dağılır). Δ_i bina başına, bitmiş yükseklik bugünkünün ~1,5 katı |
| İnşa: yakın | 0,45 - 0,80 | Yakın katman 14 bina tek tek `translateY(+Δ_i) → 0`, bitmiş yükseklik bugünkünün 1,6..2,1 katı (sabit rastgele), soldan sağa kademeli, bina başına 0,10 |
| Kamera | 0,35 - 1,00 | Katman grupları scale: yakın 1 → 1,18, orta 1 → 1,10, uzak 1 → 1,04. `transform-origin: 50% 100%` (alt-orta). Başlangıç değerleri, görüp ayarlanır |
| Hayat | bina bazlı | Her pencere kendi binasının `<g>` çocuğu. Pencere başlangıcı = binanın bitişi (`s_bina + d_bina`) + 0,02, süre 0,06, aynı binadaki pencereler 0,02 kademeli. Toplam 36 pencere, son pencere ~0,92'de yanar |
| Gök | 0,00 - 0,60 ve 0,70 - 1,00 | Ay/güneş y 0 → -14% (ilk aralık), scale 1 → 0,9 ve x 0 → +3% (ikinci aralık). Yıldız grubu opacity ×1 → ×1,4 (0,70 - 1,00). Bulutlar y 0 → -10% |
| Çizgi sönme | 0,80 - 0,95 | Dış çizgiler opacity 1 → 0,25, ızgara 1 → 0,5 |
| Alt yazı | 0,88 - 1,00 | Alt-orta alt yazı y 16px → 0, opacity 0 → 1 |

Katmanlar ve z sırası (sahne içinde, pin süresince):

| z | Katman | Kaynak | Pin içi hareket | Çıkış parallax'ı (pin sonrası 100vh) |
|---|---|---|---|---|
| 0 | Gök yıkaması | mevcut gradyan | yok | yok |
| 1 | Blueprint ızgarası | mevcut `.blueprint-grid` + maske | opacity | yok |
| 2 | Yıldızlar / bulutlar | mevcut | opacity / y | y +0% |
| 3 | Ay / güneş | mevcut `SunMoon` | y, scale, x | y +70% (bugün %140) |
| 4 | Plan çizgileri | **yeni** stroke'lar, her katmanın kendi grubunun içinde (ayrı grup yok) | pathLength, opacity; kamera scale ve çıkış parallax'ını katmanıyla paylaşır | katmanıyla aynı |
| 5 | Uzak silüet | mevcut path, bitmiş yükseklikte yeniden çizilir | translateY grup, kamera scale 1,04 | y +13% (bugün %26) |
| 6 | Orta silüet + vinç | **yeniden yazılacak**: bina başına `<g>` (path + pencereler), vinç ayrı grup | translateY bina bazlı, vinç, kamera scale 1,10 | y +24% (bugün %48) |
| 7 | Yakın silüet | **yeniden yazılacak**: 14 bina `<g>` (path + pencereler) | translateY bina bazlı, kamera scale 1,18 | y +38% (bugün %76) |
| 8 | Pencereler | **yeni**, her binanın `<g>` çocuğu (toplam 36) | opacity, binayla birlikte kayar | binasıyla aynı |
| 9 | Zemin solması | mevcut | yok | yok |
| 10 | Metin bloğu, alt yazı, scroll ipucu | mevcut + yeni alt yazı | y, opacity | yok |

Çıkış parallax'ı bugünkü değerlerin yarısı: sahne zaten 200vh boyunca hareket etti, çıkışta sakin kalmalı. Kamera scale çıkışta son değerinde kalır (geri sarılmaz).

Varlık işi ve kırpma modeli:

- `NearSkyline` ve `MidSkyline` tek path'ten bina başına `<g>`'ye ayrılır. Her `<g>` içinde bina path'i **bitmiş yükseklikte** çizilir, pencere `<rect>`'leri onun çocuğudur. Komşu binalar 1 px bindirilir (dikiş görünmesin).
- Başlangıç konumu: her `<g>` `translateY(+Δ_i)` ile aşağı kaydırılmış durur. Δ_i öyle seçilir ki p = 0'da görünen üst hat bugünkü silüetle aynı olsun (scroll 0 görüntüsü görsel olarak aynı kalır).
- Kırpma: SVG `absolute bottom-0` ve `overflow: hidden` (inline SVG varsayılanı). SVG alt kenarı = sahne alt kenarı, aşağı kaydırılmış parça görünmez. Ek maske yok.
- `viewBox` her üç SVG'de bitmiş en yüksek binaya göre yeniden yazılır (yükseklik ~2 kat; CSS yüksekliği aynı oranda büyür ki piksel ölçeği değişmesin). `preserveAspectRatio="none"` kalır; translateY viewBox biriminde, x esnemesinden etkilenmez.
- Kamera scale katman grubundaki `motion.div`'e uygulanır (SVG'ye değil), `transform-origin: 50% 100%`. Scale ile genişleyen kenarlar sahnenin `overflow: hidden`'ı ile kırpılır.
- `FarSkyline` tek path kalır, bitmiş yükseklikte çizilip grup olarak kayar. Plan çizgileri yakın + orta binaların bitmiş dış hattından türetilir (aynı koordinatlar, stroke) ve **o katmanın SVG'sinin içinde** durur; ayrı grupta olsaydı kamera scale ve çıkış parallax'ında binalarından kopardı. Yeni SVG dosya yok, hepsi inline.

### 4.2 Teknoloji şeridi (TechRibbon)

Değişmez. Pin yok. Hız bağlı sürekli hareket kalır. Hero pin'i bitince ribbon doğal akışla gelir.

### 4.3 Career: "Hikâye"

| Özellik | Değer |
|---|---|
| Pin | yok |
| Katmanlar | Ghost word x +100 → -160 (mevcut), Contours y +70 → -70 (**eklenir**, bugün bu bölümde yok) |
| Mod | Ghost ve contours scrub. Paragraflar, kart ızgarası `Reveal` tetiklemeli (mevcut) |
| Yeni | Stat sayaçları: 0 → hedef, 1,2 sn, ease-out, `once: true`. "9+", "2+", "10+", "3" biçimi korunur |
| Mobil | aynı |
| Azaltılmış hareket | sayaçlar hedef değerde statik |

### 4.4 Studio (SeptimusLab kartı)

| Özellik | Değer |
|---|---|
| Pin | yok |
| Katmanlar | Contours ±70 (mevcut), 3 telefon ParallaxY (mevcut: 50→-30, -30→40, 70→-50) |
| Mod | Scrub (mevcut). Kart `Reveal` yok, **eklenir** (bugün kart doğrudan render) |
| Yeni | Blueprint ızgarası maske ile belirir: `mask-size` 0 → 100%, 0,9 sn, tetiklemeli tek sefer |

### 4.5 Alt yazı metni (hero, p 0,88 - 1,00)

Yeni i18n anahtarı `home.city_caption`, 4 dil:

| Dil | Metin |
|---|---|
| tr | Önce plan. Sonra inşa. |
| en | Plan first. Then build. |
| de | Erst planen. Dann bauen. |
| es | Primero el plan. Luego la obra. |

Mono, `tracking-[0.3em]`, `text-muted`, alt-orta, scroll ipucunun yerinde. Karar 5 "hayır" ise bu bölüm düşer.

### 4.6 Öne çıkan projeler (pinli, karar 4)

Model: hanusek `work-pin`. Sol liste, sağ cihaz sahnesi.

| Özellik | Değer |
|---|---|
| Sarmalayıcı | 100vh + 3 adım × 60vh = **280vh** (md ve lg aynı) |
| Sticky sahne | 100svh, `top: 0`, üstte 64px header payı |
| Mod | **Karma**: ilerleme çubuğu ve cihaz drift'i scrub (yumuşatılmış p); içerik değişimi adımlı |
| Adım | `index = clamp(floor(p × 3), 0, 2)`, %4 histerezis (eşik etrafında titreme olmasın). Adım başına 60vh yol |
| Sol | Başlık "Selected work" (mevcut `SectionHeading`), 3 proje adı `font-display text-4xl`, aktif `text-ink`, diğerleri `text-muted`, sayaç `01 / 03`, aktif projenin 3 etiketi |
| Sağ | Aktif `PhoneMockup` (3 proje de telefon): giriş y 24 → 0, opacity 0 → 1, scale 0,96 → 1, spring (stiffness 220, damping 28). Çıkan y 0 → -24, opacity → 0. Arka plan glow rengi `accentColor` ile 0,4 sn geçiş |
| Scrub | Dikey ilerleme çizgisi scaleY 0 → 1 (sol kenar). Aktif mockup adım içinde y +12 → -12 drift |
| Klavye | Proje adları `Link`, odak alınca o adım aktif olur |
| Mobil (< md) | Pin yok. Bugünkü 3 kartlık ızgara, `Reveal` |
| Azaltılmış hareket | Pin yok, ızgara |

### 4.7 Footer

Değişmez. `Reveal` tetiklemeli.

### 4.8 Kaydırma bütçesi

Ölçülen: masaüstü bugün 4,5 ekran (3281 / 729 px), mobil bugün 6,3 ekran (4221 / 673 px, 500 px genişlik). Satır değerleri yaklaşık (görüntülerden), yalnız toplamlar ölçüldü.

| Bölüm | Bugün, lg (yaklaşık) | Öneri (lg) |
|---|---|---|
| Hero | 1,0 ekran | 3,0 |
| Ribbon | 0,1 | 0,1 |
| Career | 1,1 | 1,1 |
| Studio | 0,8 | 0,8 |
| Ribbon | 0,1 | 0,1 |
| Featured | 1,0 | 2,8 |
| Footer | 0,5 | 0,5 |
| **Toplam** | **4,6 (ölçülen 4,5)** | **8,4** |

Mobil: bugün 6,3 + hero pin ek yolu 1,6 = **~7,9 ekran** (Featured mobilde pin'siz, ek yok).

## 5. Mobil davranış (< md, 768px)

- Birimler `svh`. iOS adres çubuğu `vh`'yi değiştirir, sticky sahne zıplar.
- Hero pin kalır, 260svh (160svh yol). Dokunmatikte bir fiske ~1 ekran; 200vh yol mobilde uzun hissedilir.
- Kamera scale mobilde yarıya iner (yakın 1,09, orta 1,05, uzak 1,02): dar ekranda 1,18 yakın katmanı kenarlardan taşırır.
- Katman sadeleştirme: uzak katman `< sm`'de kaldırılmaz, bugünkü yükseklik oranları (150/180/110 px) korunur. Pencere sayısı 36 → 20 (`< sm`).
- Plan çizgileri mobilde 0,06 yerine 0,03 kademeli (daha hızlı tamamlanır).
- Öne çıkan projeler mobilde pin'siz ızgara (4.6).
- Metin bloğu çıkışı aynı; CTA'lar p 0,32'de gizlenir.
- Ölçüm: 390 px genişlik (bu turda yakalanan görüntü 500 px, Chrome pencere alt sınırı; gerçek ölçüm cihaz emülasyonuyla yapılacak). Yatay taşma 0, CLS 0.

## 6. Azaltılmış hareket (`prefers-reduced-motion: reduce`)

- Hero sarmalayıcı `min-h-[100svh]`'ye düşer, pin yok. Sahne **scroll 0 halinde** statik (p = 0: binalar aşağı kaydırılmış, bugünkü silüet görünür, çizgi yok, kamera 1). Yalnız görünür bölgedeki pencereler yanık (opacity 1, metinle çakışmaz). Bitmiş hal (p = 1) kullanılmaz: yükselmiş binalar metin bloğunun ve CTA'ların arkasına girer. Metin bloğu tam görünür, alt yazı yok.
- Dönüşüm dondurmak yetmez: sarmalayıcı daralmazsa 200vh boş kaydırma kalır.
- `useSpring` devre dışı, p doğrudan 0.
- Rev 3: `--day` 0 (koyu) / 1 (açık), ay ve güneş scroll 0 konumunda, sönük ızgara görünür, görünür bölgedeki yanan gruplar koyu temada 1, açık temada cam tonunda. Çizgi yok.
- Öne çıkan projeler ızgara, sayaçlar statik, ribbon statik (mevcut), `Reveal` kapalı (mevcut).
- Tek kaynak: `useReducedMotion()`; CSS tarafında `@media (prefers-reduced-motion: reduce)` ile sarmalayıcı yüksekliği (JS'siz de doğru olsun).

## 7. Motor ve performans

**Öneri: framer-motion + CSS sticky, yeni bağımlılık yok.**

- İlerleme: sarmalayıcı başına bir `useScroll`. Ham değer `useSpring`'den geçer: `useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 })`. Tekerlek basamakları (100 px'lik sıçramalar) yumuşar. Her şey (büyük katmanlar, `--p`, Featured adım indeksi) yumuşatılmış p'den türer, ham p hiçbir yerde kullanılmaz; aksi halde katmanlar birbirinden kopar. About sayfasındaki omurga aynı yöntemle çalışıyor (120 / 28).
- Spring gecikmesi: pin bırakıldığı anda p hedefin 1-2 kare gerisinde olabilir. 140 / 30 ile gecikme < 120 ms. Kabul: pin çıkışında görünür zıplama yoksa değer kalır, varsa stiffness 180'e çıkar.
- Büyük katmanlar (metin, ay, uzak grup, kamera scale) `useTransform(pSmooth, ...)` ile.
- Çok sayıda küçük eleman (binalar, pencereler, çizgiler): sahne köküne tek `--p` özel değişkeni (`useMotionValueEvent` → `style.setProperty`). Her bina `<g>` inline `--s` (başlangıç), `--d` (süre) ve `--dy` (Δ_i, **px birimli**, ör. `--dy: 120px`; SVG içinde 1px = 1 viewBox birimi) taşır. Birimsiz sayı `translateY`'de geçersizdir ve transform tümden düşer, CSS: `transform: translateY(calc(var(--dy) * (1 - clamp(0, (var(--p) - var(--s)) / var(--d), 1))))`. Pencere: `opacity: clamp(0, (var(--p) - var(--s)) / var(--d), 1)`, `--s` değeri binasının `--s + --d + 0,02`'si. Kare başına 1 stil yazımı, N motion value yok. `--p` yumuşatılmış p'den yazılır.
- Yalnız `transform` ve `opacity`. Sahnede `filter`, `backdrop-filter`, layout özelliği yok. 4 katman grubunda `will-change: transform`, sahnede `contain: paint`.
- Sticky, `overflow: hidden` atası altında çalışmaz. Ana sayfa kökü temiz; hero `section` bugün `overflow-hidden`, yeni yapıda `overflow-hidden` sticky çocuğa iner. Projects/skills/contact kökleri `overflow-hidden`; ileride pin gerekirse `overflow: clip`.
- Lenis / yumuşak kaydırma yok: Lighthouse, erişilebilirlik ve mevcut `scroll-behavior: smooth` ile çakışır.
- Lighthouse: LCP elemanı h1 kalır (scroll 0'da değişiklik yok). Sarmalayıcı yükseklikleri CSS'te, JS ölçümü yok, CLS 0. Prerender denemesi hafızada (89 → 57), tekrar denenmez.
- Hedef: 4x CPU kısıtlamasında pin boyunca düşen kare 0 ve LoAF 0 (tek eşik, 7.2).

### 7.1 Debug parametresi `?p=0..1`

- Yalnız `import.meta.env.DEV` (üretim bundle'ına girmez).
- `?p=0.5` varsa hero sahnesi `useScroll` ve `useSpring`'e bağlanmaz; p sabit 0,5 motion value olur, aynı zaman çizelgesinden geçer. Sayfa scroll 0'da durur, sticky sahne görünür, `hero-in` girişi normal oynar.
- `?p` ile üretilen görüntü, scroll ile aynı p'ye gelinen görüntüyle aynı olmalı (kabul 8). Bunu sağlamak için debug yolunda ayrı bir "freeze" kodu yok, yalnız kaynak motion value değişir.
- `?p` aralık dışıysa (NaN, > 1) yok sayılır.
- Görüntü alma: Chrome'da `http://localhost:5199/?p=0`, `0.3`, `0.5`, `0.8`, `1` sırayla açılır, her biri 1440x900 ve 390 px genişlikte çekilir, `docs/motion-ref/build-p{xx}.jpg` olarak kaydedilir.

### 7.2 Kare süresi ölçümü (pin boyunca)

İki yöntem, ikisi de Faz 1'de uygulanır.

1. **Betikli tarama (Claude çalıştırır).** Chrome'da `javascript_tool` ile: `scroll-behavior: auto` yapılır, `PerformanceObserver({ type: "long-animation-frame" })` kurulur, rAF döngüsü `performance.now()` farklarını toplar; bu sırada `scrollTo` pin yolunu 3 saniyede 60 adımda tarar (ileri, sonra geri). rAF farkı kare aralığıdır, 60 Hz'de 16,7 ms altına inmez; bu yüzden ölçü süre değil **düşen kare**dir. Önce yenileme aralığı ölçülür (ilk 60 boş karenin medyanı, ör. 16,7 veya 8,3 ms). Çıktı: kare sayısı, yenileme aralığının **1,5 katını aşan kare sayısı** (düşen kare), maks aralık, LoAF kayıtları (50 ms üstü, script kaynağıyla). Sonuç `docs/motion-ref/perf-T1.json`'a yazılır. 4x CPU kısıtlaması DevTools'suz uygulanamaz; bu yöntem kısıtlamasız taban ölçümüdür.
2. **Chrome Performance paneli (Ahmet, 2 dk).** DevTools > Performance, CPU "4x slowdown", kayıt başlat, hero pin'ini tekerlekle baştan sona kaydır, durdur. Bakılacak: Frames şeridinde kırmızı (dropped) kare var mı, Main şeridinde 50 ms üstü uzun görev var mı, "Scripting" toplamı. Ekran görüntüsü sohbete yapıştırılır, Claude yorumlar.

Tek eşik (bölüm 7, 7.2 ve kabul 9 için aynı): **pin boyunca düşen kare 0 ve LoAF 0** (yöntem 2'de Frames şeridinde kırmızı kare 0). Eşik aşılırsa sıra: `will-change` ve `contain` kontrolü, sonra bina grubu sayısını azalt (yakın 14 → 10, orta birleştir), sonra pencere sayısı. Kamera scale Ahmet'e sorulmadan kaldırılmaz.

## 8. Kabul ölçütleri

1. Scroll 0'da hero bugünkü görüntüyle görsel olarak aynı (açık ve koyu tema; bina dikişlerinde fark yok). Rev 3 gevşetmesi: binalarda sönük pencere ızgarası scroll 0'da da görünür, tek fark budur.
2. Hero pin'i ileri ve geri aynı yolu izler, hiçbir adımda zıplama yok.
3. Lighthouse mobil performans puanı bugünkü değerin en az -2 puan içinde (önce bugünkü puan ölçülür).
4. 390 px genişlikte yatay taşma 0, CLS 0.
5. `prefers-reduced-motion` açıkken masaüstü sayfa 8,4 değil ~4,5 ekran, pin yok, sahne statik (bölüm 6).
8. `?p=0,5` ile açılan sayfa, scroll ile 0,5'e gelinen sahneyle aynı görüntüyü verir (debug parametresi gerçek zaman çizelgesini kullanır).
9. Kare: 4x CPU kısıtlamasında pin boyunca düşen kare 0 ve LoAF 0 (tek eşik, bölüm 7.2).
6. Klavye ile Tab sırası: görünmez CTA'ya odak düşmez.
7. Arayüz metinlerinde em dash yok, asistan adı yok.

## 9. Kapsam dışı (v2 adayları)

- Diğer rotalarda pin (about zaman çizgisi hanusek `crew` modeline uygun).
- Açık temada gün → gece geçişi (token sistemi değişir).
- Hero ile Featured arasında ortak gök katmanı (şehir sayfa boyunca arkada kalır).
- Ses, imleç efekti, yatay kaydırma şeridi.

## 10. Uygulama sırası (onay sonrası, ajan hızı)

### Faz 1: yalnız hero, sonra dur

1. Silüetleri bina bazlı `<g>`'ye ayır (path + pencereler), viewBox'ları yeniden yaz, plan çizgilerini türet. ~2 saat.
2. Hero sarmalayıcı 300vh + sticky sahne, `useScroll` → `useSpring` → `--p` ve `useTransform` zaman çizelgesi, kamera scale, alt yazı i18n (4 dil). ~2 saat.
3. `?p=` debug parametresi (7.1). ~20 dk.
4. Chrome'da `?p=0 / 0.3 / 0.5 / 0.8 / 1` görüntüleri, masaüstü ve 390 px, açık ve koyu tema. `docs/motion-ref/build-*.jpg`. ~20 dk.
5. Kare süresi: yöntem 7.2.1 çalıştırılır, sonuç yazılır; yöntem 7.2.2 için Ahmet'e 2 dakikalık adım listesi verilir. **Burada durulur**, görüntüler ve ölçüm Ahmet'e sunulur. Faz 2 Ahmet'in "devam" demesiyle başlar.

Faz 1 dokunmadığı yerler: ribbon, Career, Studio, Featured, footer, diğer rotalar. Scroll 0 görüntüsü bugünkünün aynısı kalır (kabul 1).

### Faz 2: sayfanın kalanı

| İş | Süre |
|---|---|
| Career sayaç, Studio reveal + ızgara maskesi | 45 dk |
| Featured adımlı pin (280vh, 60vh adım) | 2 saat |
| Chrome'da masaüstü + mobil + azaltılmış hareket + Lighthouse ölçümü | 1,5 saat |

Toplam iki faz: **~9 saat** ajan işi, artı Ahmet'in iki kısa kontrolü (Faz 1 sonu görüntü onayı, Performance paneli kaydı).

## Ekler

- `docs/motion-ref/live-*.jpg`: canlı site %0/25/50/75/100 (masaüstü) + mobil hero.
- `docs/motion-ref/wiro-*.jpg`, `vast-*.jpg`, `hanusek-*.jpg`: referanslar, yüzde ve bölüm adıyla.
- Bu klasör henüz commit edilmedi (üçüncü taraf görüntüler; push = canlı deploy).

## 11. Faz 1 sonucu (2026-11-16)

Uygulanan: `src/components/scenery/city-data.ts` (bina geometrisi), `CityScene.tsx` (yeniden yazıldı), `src/components/motion/useHeroProgress.ts` (scroll → spring, `?p=` ve `?spring=0` yalnız dev), `src/routes/index.tsx` Hero, `src/index.css` "City build" bloğu, 4 dilde `home.city_caption`. Diğer bölümler dokunulmadı. `tsc` ve `vite build` temiz; üretim bundle'ında `get("p")` yok (grep ile doğrulandı). Hiçbir şey commit edilmedi.

**Mobil doğrulanmadı.** Chrome penceresi 1512 px altına inmedi, başsız Chrome 390 px'te canlı siteyi de sağdan kesti (araç kusuru), görüntüler silindi. Mobil ölçüm Chrome cihaz emülasyonuyla (DevTools) yapılacak.

Görüntüler: `docs/motion-ref/build-{dark,light}-p{000,030,050,080,100}.jpg` (1512x729; p100 alt yazı düzeltmesinden sonra 1440x729), `build-dark-p000-zoom.png` ile `live-000-zoom.png` (aynı bölge, bina ve sabit pencere karşılaştırması).

Onaylı spec'ten sapmalar (Ahmet'in bilmesi gereken):

1. Yakın katman 16 bina (spec 14): eski path'in gerçek parça sayısı 16, scroll 0 görüntüsü için korundu.
2. Pencere: 51 zamanlı + 8 sabit (spec 36). Sayı `city-data.ts`'te bina başına üretimden geliyor; azaltılabilir.
3. Yıldız "×1,4 parlama" yerine 8 ek yıldız 0,70 - 1,00 arasında beliriyor (opacity 1 aşılamaz).
4. Blueprint ızgarası "0,5 → 1" yerine mevcut ızgara 1'de kalıyor, üstüne accent renkli ikinci ızgara 0 → 1 → 0 biniyor (scroll 0 görüntüsü değişmesin diye).
5. İki hata düzeltildi: alt yazı ortalanmıyordu (inline transform `-translate-x-1/2`'yi eziyordu), 8 sabit pencere p = 0'da `extra` kadar aşağıdaydı. İkisi de görüntüyle doğrulandı.

Kabul kontrolleri:

| # | Ölçüt | Sonuç |
|---|---|---|
| 1 | Scroll 0 görsel aynı | Evet, iki tema; zoom karşılaştırmasında bina ve pencere konumları eşleşiyor |
| 2 | İleri/geri aynı yol, zıplama yok | **Kontrol edilmedi** (yalnız durağan kareler çekildi) |
| 4 | Yatay taşma 0 | Masaüstü evet; mobil ölçülemedi |
| 6 | Görünmez CTA'ya odak yok | Kod: `visibility: hidden` p > 0,32. **Tab ile denenmedi** |
| 7 | Em dash / asistan adı yok | Evet |
| 8 | `?p=0,5` = scroll 0,5 | Evet, aynı görüntü, `--p` 0,5000 |
| 9 | Düşen kare 0, LoAF 0 | **Hayır** |

Kare ölçümü (yöntem 7.2.1, ham veri `docs/motion-ref/perf-T1.json`). Ekran 120 Hz (8,3 ms), eşik 12,5 ms, CPU kısıtlaması yok, 182 kare / tekrar:

| Durum | Düşen kare | LoAF |
|---|---|---|
| Canlı site, eski hero (taban) | 2 / 1 / 3 | yok |
| Yeni hero, üretim önizlemesi, temiz ölçüm, yüklemeden 3 s sonra, 5 tekrar | 27 / 20 / 24 / 22 / 20 | 87, 54, 54 ms |
| Aynı sayfa, 60 s boş bekledikten sonra, 5 tekrar | 12 / 19 / 10 / 21 / 13 | 55 ms |
| Dev sunucusu, ısınmış sayfa, 8 ardışık yapılandırma (kontrol dahil) | hepsi 0 | yok |

Varyant ölçümleri (CSS ile katman kapatma, `perf-T1.json`) **ipucu düzeyinde**: varyant sırası zaman sırasıyla aynı, tekrarlar arası yayılım (8 - 24) katmanlar arası farka yakın, bazıları build ile aynı anda koştu. Hipotezler, kanıt değil:

- H1: kare başı SVG değişimi (bina `translateY`, plan `stroke-dashoffset`) üç tam genişlik SVG'yi yeniden boyatıyor. SVG değişimleri kapalıyken 1 - 15, sahne gizliyken 0 - 1 düştü.
- H2: kamera scale katman rasterini her karede yeniliyor. Yalnız kamera açıkken 3 - 14 düştü.
- H3: `useSpring` her kaydırma olayında yeni animasyon kuruyor, 50 - 90 ms LoAF'lar yalnız spring açıkken görüldü (`?spring=0` ile 11 - 12 düşme, LoAF yok).
- Dev sunucusunda ısınmış sayfanın 0 düşürmesi H1 ile çelişiyor; nedeni bilinmiyor.

Atıfı Ahmet'in 4x CPU Performance paneli kaydı yapar (boyama, script ve GC'yi ayrı gösterir). Kayıt sonrası seçenekler: bina grubu azaltma (spec sırası), binaları ayrı `div` + küçük## 12. Rev 3: bina bazlı koreografi, gün döngüsü, pencere ızgarası (2026-11-16)

Faz 1 görseli reddedildi. Bu bölüm 4.1'deki zaman çizelgesinin, katman tablosundaki "Plan çizgileri" ve "Pencereler" satırlarının ve 7'deki CSS formüllerinin yerine geçer. Pin (300vh), spring, kamera, `?p=`, çıkış parallax'ı, alt yazı aynen kalır. Kod yazılmadı.

### 12.1 Hata araştırması: 1288 px'te çizgiler binalara oturmuyor

**Yeniden üretilemedi.** Ekran kaydı (`.mov`) macOS geçici klasöründen okunamadı ("Operation not permitted"); karelerine bakılamadı. Chrome penceresi 1512 px altına inmediği için 1288 ve 763 px, aynı sayfada tek iframe'in genişliği değiştirilerek ölçüldü (medya sorguları iframe genişliğine göre çalışır). Dört görüntü: `docs/motion-ref/bug-{1288,763}-p{050,100}.jpg`.

Yapılan kontrol (p = 1, çizgi opacity 1'e zorlandı): her katmanın plan path'inin köşe noktaları `getScreenCTM` ile ekran koordinatına çevrildi, binaların `getBoundingClientRect` üst kenarıyla karşılaştırıldı.

| Koşul | Yakın kat: çizgi üst sınırı - binalar üst sınırı | Kendi köşesi olan her bina |
|---|---|---|
| 1288 px, koyu | 0,0 px | 0,0 px |
| 1288 px, açık | 0,0 px | 0,0 px |
| 763 px, koyu | 0,0 px | 0,0 px |
| 1288 px, kamera scale kapalı | 0,0 px | 0,0 px |
| 1288 px, SVG yüksekliği 300 px'e zorlanmış | 0,0 px | 0,0 px |

Orta kat için aynı tablo, aynı sonuç. Scroll sonunda `--p` her iki genişlikte 1,0000 (travel - 1 px'te 0,9993). p = 0,5'te çizgiler iki genişlikte de aynı biçimde binaların üstünde (binalar henüz yükselmemiş).

Elde olan iki açıklama, kanıtlanmış değil:

1. Çizgiler bitmiş yükseklikte, binalardan 0,3 - 0,6 p önce çiziliyor (plan 0,15 - 0,42, yakın binalar 0,45 - 0,80). O aralıkta çizgi havada. DevTools açılınca pin yolu kısalıyor (1458 → 1166 px), aynı `scrollY` daha yüksek p'ye düşüyor, binalar bitmiş görünüyor. Yani iki genişlikte aynı p karşılaştırılmamış olabilir.
2. Orta katın çizgisi (scale 1,10) yakın binaların (1,18) arkasından yatay parçalar halinde görünüyor; yakın binaya "oturmayan" çizgi gibi okunuyor.

İkisi de rev 3 ile ortadan kalkıyor (çizgi yalnız binasının slotunda ve yalnız yakın katta). Kayıt yine de görülmeli: `.mov` dosyasını proje klasörüne (`docs/motion-ref/`) bırak, kareleri çıkarıp hangi p'de ne göründüğünü yazarım.

### 12.2 Bina bazlı koreografi

**Tek kuyruk, 3 şerit.** 36 bina (16 yakın + 20 orta) sabit tohumlu karışık sırayla tek kuyruğa girer; sıradaki bina boşalan ilk şeride alınır (greedy). Aynı anda en çok 3 bina inşaatta. Başlangıçlar koddan hesaplanıp `city-data.ts`'e sabit yazılır (`--s`). Alternatif sıra: soldan sağa dalga (onay sorusu 1).

| Faz | Yakın kat | Orta kat | Uzak kat |
|---|---|---|---|
| Çizgi çizilir | `--s` … +0,020. Binanın **bitmiş dış hattı**, kapalı şekil, alt-sol köşeden saat yönünde, `pathLength=1`, `stroke-dashoffset` 1 → 0 | yok | yok |
| Bina yükselir | +0,020 … +0,065 (`translateY(--dy)` → 0) | `--s` … +0,045 | 0,15 - 0,35 tek grup |
| Çizgi söner | +0,050 … +0,075 (opacity 1 → 0, yükselişin sonuyla örtüşür) | yok | yok |
| Pencereler | 12.4 | 12.4 | yok |
| Slot | 0,075 | 0,045 | |
| Toplam iş | 16 × 0,075 = 1,20 | 20 × 0,045 = 0,90 | |
| Kuyruk aralığı | 3 şeritle (1,20 + 0,90) / 3 = 0,70 → **0,15 … 0,85** | | |

Çizgi kuralları: yalnız yakın katta, bina başına kapalı şekil, yalnız o binanın slotunda var; başka zaman çizgi yok. **Çizgi yükselen `<g>`'nin dışında durur** (aynı SVG'de ayrı `plans` grubunda, bitmiş koordinatlarda); içinde olsaydı `--dy` kadar aşağıdan başlardı. Orta katın plan çizgisi kaldırılır. Accent renk, 1,5 px, `vector-effect: non-scaling-stroke`.

Kamera (0,35 - 1,00), çıkış parallax'ı, metin çıkışı (0,08 - 0,32), alt yazı (0,88 - 1,00) değişmez. "Plan ızgarası parlaması" kaldırılır.

CSS (bina `<g>`: `--s`, `--dy`; çizgi path: aynı `--s`): çizgi `stroke-dashoffset: calc(1 - clamp(0, (var(--p) - var(--s)) / 0.02, 1))`, `opacity: calc(1 - clamp(0, (var(--p) - var(--s) - 0.05) / 0.025, 1))`; bina `translateY(calc(var(--dy) * (1 - clamp(0, (var(--p) - var(--s) - 0.02) / 0.045, 1))))` (orta katta `- 0` ve `/ 0.045`).

### 12.3 Gün döngüsü (pin boyunca bir tam tur)

Tek kaynak `--day` (0 gece, 1 gündüz), p'den türetilir, sahne köküne `--p` ile birlikte yazılır. Gündüz rampası hero metni (0,32'ye kadar görünür) gittikten sonra başlar; açık metin aydınlanan gök üstüne düşmez.

Koyu tema (scroll 0 gece):

| p | `--day` | Ay | Güneş | Yıldız / bulut |
|---|---|---|---|---|
| 0,00 - 0,25 | 0 | scroll 0 konumunda | yok | yıldız 1, bulut 0 |
| 0,25 - 0,45 | 0 → 0,85 (smoothstep, 0,30'dan itibaren) | batar: y +45%, x +8%, opacity 1 → 0 (0,25 - 0,42) | doğar: sol-alttan (x -35%, y +40%) yay, opacity 0 → 1 (0,38 - 0,46) | yıldız 1 → 0, bulut 0 → 1 |
| 0,45 - 0,60 | 0,85 | yok | yay tepesi 0,53'te (y -10%, x 0), sonra sağa iner | bulut sürükleniyor |
| 0,60 - 0,90 | 0,85 → 0 | geri gelir: sağ-alttan yükselip scroll 0 konumuna oturur (0,70 - 0,92), opacity 0 → 1 | batar: x +35%, y +40%, opacity 1 → 0 (0,62 - 0,74) | yıldız 0 → 1 (+ 8 ek yıldız), bulut 1 → 0 |
| 0,90 - 1,00 | 0 | yerinde, scale 0,9 | yok | yıldız 1 |

`--day` tepe değeri 0,85 (onay sorusu 3): gök kağıt beyazına çıkmaz, header `bg-paper/85` ile okunur kalır.

Gök katmanları: bugünkü koyu ve açık token setleri `:root`'ta temadan bağımsız iki ad altına kopyalanır (`--sky-night-*`, `--sky-day-*`: top, far, mid, near, paper). Gök yıkaması iki `div`: gece gradyanı opacity `1 - --day`, gündüz gradyanı `--day`. Silüet dolguları `color-mix(in srgb, <gece> calc((1 - var(--day)) * 100%), <gündüz>)` (Chrome 111+, Safari 16.2+; desteklenmeyende gece tonu kalır). Güneş ve ay gövdeleri tema sınıfından kopar, `--day` ve kendi yol değişkenlerine bağlanır. Scroll 0: `--day` 0, ay yerinde → bugünkü hero ile aynı.

**Açık tema önerisi A (önerilen):** döngü ters, gündüz → gece → gündüz. `--day` 1 → 0,15 → 1 (gece dibi 0,15: tam siyaha inmez). Güneş 0,25 - 0,42'de batar, ay 0,38 - 0,46'da doğup 0,53'te tepe yapar, 0,62 - 0,74'te batar, güneş 0,70 - 0,92'de geri gelip scroll 0 konumuna oturur. Scroll 0 bugünkü açık hero ile aynı; sayfa açık bölümlere gündüz haliyle bağlanır. **B:** açık temada da gece başlar; scroll 0 değişir, önerilmez.

### 12.4 Pencere ızgarası

- Her binada kat ve sütun ızgarası (Ahmet düzeltmesi 2026-11-16: ilk hal tabana kadar iniyordu ve sıktı): sütun adımı 22, kat adımı 20 birim, kenar payı 12, **tabandan 120 birim yukarıda biter** (sokak seviyesi ve zemin solması boş). Hücre 5 × 7, toplam 627 hücre tek path'lerde. Mobil ayrı adım yok.
- **Sönük ızgara** binanın statik parçası: `rgb(var(--c-ink) / 0.10)`, koyu temada `rgb(var(--c-base) / 0.07)`. Scroll 0 görüntüsü değişmesin diye 0,10 - 0,25'te opacity 0 → 1 ile belirir (onay sorusu 5). Bugünkü 8 sabit yanık pencere kalır.
- **Yanan gruplar** bina başına 2 - 3 `<g class="city-lit">`, her grup hücrelerin %30 - 50'si (sabit tohum, komşu kat kümeleri). Opacity iki kapının çarpımı:
  - bina kapısı: `clamp(0, (var(--p) - var(--s) - slot) / 0.05, 1)`, grup başına + grupIndex × 0,03;
  - gece kapısı: `1 - var(--day) * var(--lit-day-off)`; koyu temada `--lit-day-off` 1 (gündüzde söner, akşam `--day` 0,85 → 0'a inerken geri yanar), açık temada 0 (bina bitince yanar, sönmez).
  - Sonuç: bir bina bittiğinde pencereleri hemen yanar (bina bazlı adım korunur); koyu temada gündüz fazında (0,45 - 0,60) biten binaların pencereleri akşam 0,60 - 0,90'da `--day` ile birlikte yanar. Erken biten binalar için iki ayrı an yok: akşam çöküşü tüm şehri aynı rampayla aydınlatır, bina kapısı zaten 1'dir. Ahmet'in bilmesi gereken: "bina bitince yan" ile "gece çökerken yan" ancak bu çarpımla birleşiyor; gündüzde biten binalar akşama kadar karanlık.
  - Dolgu: koyu temada sıcak `rgb(255 222 170 / 0.9)`; açık temada `color-mix` ile `--day`'e göre sıcak (gece) ↔ cam `rgb(var(--c-ink) / 0.45)` (gündüz). Açık temada p = 1'de pencereler cam tonunda, "yanık" değil.
- Pencere adedi 36'dan ~520 hücre + ~90 gruba çıkıyor; SVG yeniden boyama maliyeti büyür. Perf kaydı ertelendi; kabul 9 Faz 2 sonunda ölçülür.

### 12.5 Onay soruları (rev 3)

| # | Soru | Öneri |
|---|---|---|
| 1 | İnşa sırası | Sabit tohumlu karışık, tek kuyruk 3 şerit. Alternatif: soldan sağa dalga |
| 2 | Açık tema döngüsü | A: gündüz → gece → gündüz, pencereler gündüz cam tonuna döner |
| 3 | Gündüz tepe değeri | `--day` en fazla 0,85 |
| 4 | Ay dönüş konumu | Scroll 0 konumu, scale 0,9 |
| 5 | Sönük ızgara belirme | 0,10 - 0,25'te belirir. Alternatif: scroll 0'da da görünür |
| 6 | Koyu temada gündüz biten binalar | Pencereleri akşama kadar karanlık (12.4). Alternatif: bitince yansın, gündüz sönmesin |

Kod bu altı cevap gelince başlar. Tahmin: 12.2 + 12.4 ~2,5 saat, 12.3 ~2 saat, görüntü ve kontrol ~45 dk.

### 12.6 Rev 3 kararları (Ahmet, 2026-11-16) ve son düzeltmeler

| # | Karar |
|---|---|
| 1 | Sıra **dıştan merkeze**: kenar binalar önce, merkez son, hafif karışık. Metin 0,32'ye kadar görünür; merkez binalar metnin arkasında yükselmez |
| 2 | Açık tema A (gündüz → gece → gündüz) |
| 3 | `--day` tepe 0,85 |
| 4 | Ay scroll 0 konumuna döner, scale 0,9 |
| 5 | Sönük ızgara scroll 0'da da görünür; kabul 1 buna göre gevşetildi |
| 6 | Gece kapısı grup başına: her yanan gruba rastgele `--thr` (0,2 - 0,7); `--day` eşiğin altına inince yanar, üstüne çıkınca söner. Tek akşam rampası yok |

Ek düzeltmeler:

- **Çizgi fazı** binanın slotundan 0,05 önce başlar, 0,04 sürer (0,02 = ~30 px scroll görünmüyordu). Şerit süresine sayılmaz; şerit yalnız yükselişi (0,045 yakın, 0,045 orta) tutar. Çizgi yükselişin ortasında sönmeye başlar (`--s` + 0,03 … + 0,055).
- **Düğüm sayısı:** ~520 `<rect>` yerine bina başına tek sönük ızgara `<path>` (hücreler alt yol olarak) ve yanan grup başına tek `<path>`. Yakın kat 2 grup, orta kat 1 - 2 grup. Hedef ~130 düğüm (36 bina + 36 ızgara + ~60 grup + 16 çizgi).
- **Safari:** `vector-effect: non-scaling-stroke` + `pathLength` + `preserveAspectRatio="none"` kombinasyonu Safari'de doğrulanır (ölçüm 12.7).
- `.mov` gerekmiyor.

### 12.7 Rev 3 hero sonucu (2026-11-16)

Uygulanan: `city-data.ts` (tek kuyruk 3 şerit, dıştan merkeze karışık sıra, ızgara ve yanan grup path'leri, çizgi path'leri), `CityScene.tsx` (gün döngüsü `--day`, iki gök katmanı, `color-mix` silüetler, güneş/ay yolları temaya göre, çizgiler yükselen grubun dışında), `index.css` "City build" bloğu. `tsc` temiz, konsol hatası yok. Commit yok.

| Ölçüm | Değer |
|---|---|
| SVG düğümü | 198 (36 bina + 36 ızgara + 52 yanan grup + 16 çizgi + vinç + sabit pencere path'i). Hedef ~130 idi; kalan fark yanan gruplar (yakın 2, orta 1) |
| Son bina bitişi | p = 0,69 |
| Yanan grup payı | hücrelerin %12 - 22'si (ilk deneme %30 - 50 cepheyi tümüyle yakıyordu, düşürüldü) |
| Safari | Doğrulandı: `?p=0.4`'te çizgi kısmi çizilmiş (dashoffset çalışıyor), ince stroke (non-scaling), `color-mix` tonu uygulanmış. Safari penceresi 574 px (mobil dal) |

Görüntüler: `docs/motion-ref/rev3-{dark,light}-p*.jpg`.

Ahmet'in bilmesi gereken:

1. Koyu temada gece başı (p < 0,30) biten binaların pencereleri hemen yanıyor (`--day` 0 < `--thr`); hero metni görünürken sağ ve sol kenarda yanık pencereler var (`rev3-dark-p025`).
2. Header: `?p` görüntülerinde sayfa scroll 0'da olduğu için header şeffaf, gündüz fazında nav yazısı silik görünüyor. Gerçek kaydırmada header `bg-paper/85` alır. Açık temada gece fazında (0,45 - 0,60) aynı sorun ters yönde: koyu nav yazısı koyu gök üstünde, header arka planı açık olduğu için okunur.
3. Açık temada güneş geri dönerken (0,75) bulutun arkasından geçiyor (`rev3-light-p075`), ay da koyu temada aynı. Bulut konumu ya da gövde yolu ayarlanabilir.
4. Koyu temada gündüz fazında (0,40 - 0,55) zemin solması paper rengine gittiği için alt kenarda gri bant var; açık temanın scroll 0 görünümüyle aynı mantık.
5. Kabul 2 (ileri/geri zıplama), 6 (Tab odağı), mobil ve kare ölçümü bu turda yapılmadı.

## 13. Faz 2 sonucu (2026-11-16)

Önce hero düzeltmesi: koyu temada sokak seviyesindeki gri bant, gündüz zemin solmasının (`city-ground-day`, kağıt rengine giden gradyan) gece katmanının altında her zaman açık kalmasından geliyordu. Artık iki zemin katmanı da `--day` ile çapraz geçiyor (`rev3-dark-p000-ground.png`).

Uygulanan:

| Bölüm | Değişiklik | Dosya |
|---|---|---|
| Career | Stat sayaçları 0 → hedef, 1,2 sn, tek sefer, ek korunur ("9+"); azaltılmış harekette statik. `Contours` eklendi | `src/components/motion/CountUp.tsx`, `routes/index.tsx` |
| Studio | Kart `Reveal` içinde; blueprint ızgarası `clip-path` ile soldan sağa 0,9 sn'de beliriyor (tek sefer) | `routes/index.tsx` |
| Featured | `FeaturedPinned`: 280vh sarmalayıcı, sticky 100svh sahne, 3 adım, %4 histerezis, spring'li ilerleme çizgisi, adım içi ±12 px drift, telefon sahnesi spring ile değişiyor, glow rengi projeye göre. md altı ve azaltılmış harekette eski ızgara | `src/components/FeaturedPinned.tsx`, `src/components/motion/useIsDesktop.ts` |

Ölçüm (Chrome, 1512 px): sayfa 8,2 ekran (spec 8,4), konsol hatası yok, `tsc` temiz. 500 px iframe: Featured ızgaraya düşüyor, yatay taşma yok, 7,4 ekran. Görüntüler `docs/motion-ref/faz2-*`.

Yapılmayan: kabul 2 (ileri/geri zıplama), 6 (Tab odağı), gerçek mobil emülasyon, kare ölçümü, Lighthouse. Commit yok.

## 14. Lighthouse ve mobil ölçüm (2026-11-16)

### 14.1 Lighthouse (kabul 3)

Lighthouse 12.8.2 CLI, mobil profil (simüle kısıtlama), başsız Chrome, yerel `vite preview`. Baz: `git HEAD` (b60d489) build'i. Yeni: çalışma ağacı. Dönüşümlü 3'er koşu, medyan. Ham özet `docs/motion-ref/lighthouse-T1.json`.

| | Baz | Yeni |
|---|---|---|
| Puan (3 koşu) | 90 / 92 / 92 | 91 / 91 / 92 |
| **Medyan puan** | **92** | **91** |
| FCP | 2,19 s | 2,27 s |
| LCP | 3,11 s | 3,06 s |
| TBT | 18 ms | 24 ms |
| CLS | 0 | 0 |
| DOM düğümü | 505 | 701 |
| Ana iş parçacığı | 2,13 s | 2,46 s |

Kabul 3 (en fazla -2 puan): **geçti, -1.** LCP elemanı iki build'de de scroll ipucu metni; hero h1 değil. En uzun görevler `gtag` (74, 58 ms), hero kodundan uzun görev yok. Canlı site puanı (önceki ölçüm 84) ağ koşulu farklı olduğu için bu tabloyla karşılaştırılmaz.

### 14.2 Mobil, 390 px

Chrome'da 390 x 700 iframe (medya sorguları iframe genişliğine göre çalışır; dokunmatik, `svh` ve iOS adres çubuğu emüle edilmedi). Görüntüler `docs/motion-ref/mobile390-*`.

| Ölçüm | Değer |
|---|---|
| Hero sarmalayıcı | 2,6 ekran (260svh), kaydırma yolu 1120 px |
| Scroll sonunda `--p` | 1,0000 |
| Kamera scale (uzak / orta / yakın) | 1,02 / 1,05 / 1,09 (mobil yarı değer) |
| Featured | Pin yok, 3 kartlık ızgara |
| Sayfa | 8,1 ekran (tahmin 7,9) |
| Yatay taşma | yok |
| Scroll 0: h1, CTA'lar | h1 128 - 258 px, CTA'lar 482 - 588 px, silüet üstü 480 px |

Bulgular:

1. **Ay/güneş kicker metnine biniyor** (scroll 0, iki tema): kicker 390 px'te iki satıra kırılıyor, gök cismi `right-[6%] top-[9%]` ile "AHMET" kelimesinin üstüne düşüyor. **Canlı sitede de aynı** (`mobile390-moon-overlap-new-vs-live.png`), bu işle gelmedi.
2. **Şehir ekranın alt üçte birinde kalıyor.** İnşa boyunca üst %65 boş gök. Mobil SVG yükseklikleri (220 / 360 / 300 px) masaüstünün oranında küçültüldü; dar ekranda silüet basık görünüyor.
3. İkinci CTA'nın alt kısmı ve scroll ipucu silüetle üst üste (scroll 0); canlıda da aynı düzen.

### 14.3 Mobil düzeltmeler (Ahmet onayı, 2026-11-16)

| Bulgu | Düzeltme | Doğrulama |
|---|---|---|
| Ay/güneş kicker'a biniyor | `sm` altında gök cismi 64 → 40 px, `right-[6%]` → `right-[4%]`, glow ve krater boyları orantılı küçüldü | Kicker satırlarıyla kesişme yok: 390 px'te ay 325 - 365, metin en sağ 303; 360 px'te ay 296, metin 288 |
| Şehir alt üçte birde | `md` altında SVG yükseklikleri ×1,4: uzak 300 → 420, orta 360 → 500, yakın 220 → 310 px | p = 1'de şehir ekranın alt ~%45'i. Masaüstü değişmedi (480 / 600 / 380) |

Bilinen yan etki: mobilde scroll 0'da silüet daha yüksek, ikinci CTA artık silüetin önünde duruyor (z-10, okunuyor). Kabul 1 masaüstü için geçerli kalır; mobil scroll 0 bilerek değişti. Görüntüler `docs/motion-ref/mobile390-fix-*`.

## 15. Canlı sonrası düzeltmeler (Ahmet, 2026-11-16)

| Geri bildirim | Neden | Düzeltme |
|---|---|---|
| Açık temada alt kısım parlıyor, KAYDIR okunmuyor | Zemin solması 96 px ve tam kağıt rengine gidiyordu, ipucu bu bandın içindeydi | Solma 48 px ve en fazla %22 kağıt (parlama bandı kalktı). İpucu çerçevesiz: açık renk, kalın, 11 px; yakın silüetin üstünde durur (hap denemesi Ahmet tarafından reddedildi) |
| İlk 2-3 scroll tepkisiz | Kuyruk 0,15'te, kamera 0,35'te, ay 0,25'te başlıyordu; ilk ~220 px yalnız ipucu sönüyordu | Kuyruk başlangıcı 0,06 (ilk çizgi p 0,01), uzak kat 0,01, kamera 0,02, ay ilk scroll'la batmaya başlar, metin 0,02'de kaymaya başlar. Son bina bitişi 0,69 → 0,60. Scroll 0 değişmedi |
| Featured: başlığa tıklayınca projeler sayfası açılıyor | Başlıklar `Link` idi | Başlıklar düğme: o projenin adımının ortasına yumuşak kaydırır (kitap ayracı). "Tüm projeler" bağlantısı kaldı |
| Tek telefon sıkıcı | | Proje başına 3 telefonlu yelpaze: ortada mevcut ekran, arkada iki mağaza ekranı (`gallery`). Kaynak `SaaS/MARKETING/*` ham ekranları, 400 px webp, 6 dosya toplam ~147 KB, lazy |
| Hızlı scroll'da telefonlar titriyor | Adım içi drift her adım sınırında 24 px sıçrıyordu; `AnimatePresence mode="wait"` atlanan adımların çıkışlarını sıraya diziyordu | Drift kaldırıldı. Üç yelpaze hep mount, CSS transition ile çapraz geçiş (0,5 sn); hızlı geçişte yalnız hedef değişir. Adım ham scroll'dan okunur (spring gecikmesi yok). 12 hızlı ileri-geri sıçramadan sonra tek yelpaze görünür kaldı |

Adım uzunluğu 60vh olarak kaldı (ayar: `FeaturedPinned.tsx` `h-[280vh]`).
