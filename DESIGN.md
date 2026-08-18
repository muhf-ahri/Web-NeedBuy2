# DESIGN.md — Full-Color UI Design System

## 1. Overview

Dokumen ini menjadi referensi desain untuk redesign website berbasis **React + TypeScript + Tailwind CSS**.

Arah visual mengikuti referensi desain yang diberikan: **clean, modern, friendly, playful, colorful, dan ringan**, dengan kombinasi:

- **White** sebagai warna utama/fondasi.
- **Blue** sebagai warna sekunder dan identitas visual utama.
- **Yellow** sebagai aksen energi, highlight, dan attention.
- **Red/Coral** sebagai aksen penting untuk status atau elemen dekoratif.
- **Very Light Blue / Warm White** sebagai background section agar halaman tidak terasa datar.

> **PENTING:** Tampilan website harus menggunakan pendekatan **FULL COLOR**. Jangan membuat seluruh interface menjadi putih/abu-abu dengan sedikit warna biru saja. Gunakan warna biru, kuning, dan coral secara konsisten pada CTA, badge, icon, illustration, card accent, status, decoration, dan elemen interaktif.

Desain harus terasa **colorful tetapi tetap clean**, bukan ramai atau berlebihan.

---

# 2. Design Direction

## Visual Keywords

Gunakan karakter visual berikut sebagai pedoman:

- Modern
- Clean
- Friendly
- Playful
- Fresh
- Soft
- Colorful
- Rounded
- Spacious
- Professional
- Mobile-friendly

## Visual Personality

Website harus memberikan kesan:

> **"Modern product website dengan tampilan clean dan colorful yang terasa ramah serta mudah digunakan."**

Hindari desain yang:

- Terlalu gelap.
- Terlalu banyak gradient.
- Monokrom.
- Terlalu banyak border.
- Terlalu banyak shadow berat.
- Terlalu formal/kaku.
- Menggunakan warna neon yang terlalu menyala.
- Memenuhi seluruh layar dengan elemen dekoratif tanpa hierarchy.

---

# 3. Color System

Palet utama diambil dari karakter warna pada referensi.

## Core Palette

| Token | Color | Hex | Penggunaan |
|---|---|---|---|
| `white` | White | `#FFFFFF` | Main background, card, surface |
| `blue` | Primary Blue | `#538CDB` | CTA, link, active state, accent |
| `yellow` | Bright Yellow | `#FFD500` | Highlight, badge, decorative accent |
| `coral` | Coral Red | `#FF4646` | Error, important accent, decorative shape |
| `soft-blue` | Soft Blue | `#F5F5FF` | Section background, subtle surface |
| `soft-yellow` | Soft Yellow | `#FFFCD5` | Highlight background |
| `soft-coral` | Soft Coral | `#FFF0F0` | Error/attention background |
| `text` | Dark Text | `#20242D` | Main heading and body text |
| `muted` | Muted Text | `#737A87` | Secondary text |
| `border` | Light Border | `#E8ECF4` | Divider and subtle border |

### Color Priority

Gunakan hierarchy berikut:

1. **White** — 45–60% visual area.
2. **Blue** — 15–25% visual area.
3. **Soft Blue / light surfaces** — 10–20%.
4. **Yellow** — 5–10%.
5. **Coral** — 3–8%.
6. **Dark text** — secukupnya untuk readability.

Angka tersebut adalah panduan visual, bukan aturan matematika yang wajib diterapkan pada setiap halaman.

---

# 4. Color Usage Rules

## White

White adalah fondasi utama.

Gunakan untuk:

- Main page background.
- Navbar.
- Cards.
- Forms.
- Modal.
- Content surfaces.
- Hero content area.

White tidak berarti semua elemen harus putih.

Gunakan background section yang sangat ringan agar terdapat visual separation.

---

## Blue

Blue adalah **secondary brand color sekaligus primary interactive color**.

Gunakan untuk:

- Primary button.
- Active navigation.
- Links.
- Icon accent.
- Progress indicator.
- Selected state.
- Important decorative shapes.
- Illustration accent.
- Focus state.
- Section heading accent.

Contoh:

```text
Primary CTA → Blue background + White text
Active menu → Blue text/icon + Soft Blue background
Link → Blue
Important statistic → Blue
```

Jangan menggunakan blue pada seluruh teks atau seluruh background halaman.

---

## Yellow

Yellow digunakan sebagai **energetic accent**.

Gunakan untuk:

- Highlight.
- Small badge.
- Decorative circle.
- Illustration.
- Important positive accent.
- Achievement/reward.
- Attention element yang tidak bersifat error.

Yellow sebaiknya tidak digunakan sebagai warna body text karena contrast-nya rendah.

---

## Coral / Red

Coral digunakan sebagai **secondary accent dan semantic danger color**.

Gunakan untuk:

- Error.
- Delete/danger action.
- Warning tertentu.
- Important notification.
- Decorative shape.
- Illustration accent.

Untuk error UI gunakan background soft coral dan text coral/dark red agar tetap readable.

---

# 5. Full-Color Requirement

## WAJIB

Setiap halaman harus terasa memiliki warna.

Contoh penggunaan:

```text
Navbar
→ White + Blue active state

Hero
→ White + Blue headline accent + Yellow decoration + Coral decoration

Cards
→ White card + Blue icon + colored accent

CTA
→ Blue background + White text

Badge
→ Soft Yellow + Dark text

Success
→ Blue/green-compatible light surface

Warning
→ Soft Yellow

Error
→ Soft Coral + Coral

Illustration
→ Blue + Yellow + Coral
```

## Jangan

```text
❌ White background
❌ Gray text
❌ Gray cards
❌ Gray borders
❌ Blue button
```

saja untuk seluruh website.

Gunakan kombinasi warna agar halaman mempunyai **visual rhythm**.

---

# 6. Typography

Gunakan font modern dan rounded.

## Recommended Font

**Poppins**

Fallback:

```css
font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
```

Jika Poppins tidak tersedia, gunakan system sans-serif.

## Font Weight

| Usage | Weight |
|---|---:|
| Hero heading | 700 |
| Page heading | 700 |
| Section heading | 600–700 |
| Card heading | 600 |
| Body | 400 |
| Secondary text | 400 |
| Button | 500–600 |
| Label | 500 |

## Typography Style

Heading:

- Bold.
- Short.
- High contrast.
- Line-height sekitar 1.1–1.25.

Body:

- Comfortable line-height.
- Jangan terlalu kecil.
- Gunakan muted text untuk informasi sekunder.

---

# 7. Layout System

Gunakan layout yang spacious.

## Container

Recommended:

```text
max-width: 1280px
margin: 0 auto
padding: 24px
```

Pada desktop:

```text
max-width: 1200–1280px
```

Pada tablet:

```text
padding: 32px
```

Pada mobile:

```text
padding: 16–20px
```

---

# 8. Spacing

Gunakan spacing yang konsisten.

Recommended Tailwind scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
```

Gunakan whitespace yang cukup.

Jangan membuat setiap section terlalu padat.

---

# 9. Border Radius

Gunakan rounded corner sebagai salah satu karakter utama desain.

Recommended:

```text
rounded-lg    → small components
rounded-xl    → cards
rounded-2xl   → large cards
rounded-3xl   → hero/feature sections
rounded-full  → buttons, badges, avatars
```

Default card:

```text
rounded-2xl
```

Button:

```text
rounded-full
```

---

# 10. Shadow

Shadow harus lembut.

Gunakan:

```text
shadow-sm
shadow-md
```

Untuk hero/card besar dapat menggunakan shadow yang sedikit lebih prominent tetapi tetap soft.

Hindari:

```text
❌ Heavy black shadow
❌ Strong drop shadow
❌ Neumorphism berlebihan
```

---

# 11. Navigation / Navbar

Navbar mengikuti konsep minimal dan clean.

## Desktop

Struktur:

```text
Logo | Navigation Links | CTA
```

Contoh:

```text
[ Logo ]

Overview
Features
Screens
Testimonials
Pricing

[ Get Started ]
```

Style:

- Background white.
- Fixed/sticky jika diperlukan.
- Rounded container jika menggunakan floating navbar.
- Active navigation menggunakan blue.
- CTA menggunakan blue.
- Tidak menggunakan navbar hitam.

## Mobile

Gunakan:

```text
[ Logo ]                [ Menu ]
```

Menu dapat menggunakan mobile drawer.

---

# 12. Hero Section

Hero adalah area yang paling visual.

Struktur:

```text
┌─────────────────────────────────────────────┐
│                                             │
│  Badge                                      │
│                                             │
│  Main Heading                  Illustration │
│  Supporting text               / Product    │
│                                             │
│  [ Primary CTA ] [ Secondary CTA ]          │
│                                             │
│  Supporting information                     │
│                                             │
└─────────────────────────────────────────────┘
```

## Hero Rules

Gunakan:

- White background.
- Blue heading accent.
- Blue CTA.
- Yellow decorative shape.
- Coral decorative shape.
- Soft blue surface.
- Product/mockup/illustration sebagai focal point.

Hero tidak boleh terasa seperti halaman corporate yang kaku.

---

# 13. Buttons

## Primary Button

```text
Background: #538CDB
Text: #FFFFFF
Radius: full
```

Hover:

```text
Blue sedikit lebih gelap
```

Contoh:

```tsx
<button className="
  rounded-full
  bg-[#538CDB]
  px-6 py-3
  font-semibold
  text-white
  transition
  hover:bg-[#467BC7]
">
  Get Started
</button>
```

## Secondary Button

Gunakan:

```text
White background
Blue border
Blue text
```

Contoh:

```tsx
<button className="
  rounded-full
  border border-[#538CDB]
  bg-white
  px-6 py-3
  font-semibold
  text-[#538CDB]
  transition
  hover:bg-[#F5F5FF]
">
  Learn More
</button>
```

## Accent Button

Untuk aksi tertentu:

```text
Yellow background
Dark text
```

Jangan menggunakan yellow sebagai tombol utama pada seluruh website.

---

# 14. Cards

Card harus clean dan rounded.

Recommended:

```text
bg-white
rounded-2xl
border border-[#E8ECF4]
shadow-sm
```

Namun jangan membuat seluruh card identik.

Gunakan variasi:

### Blue Accent Card

```text
White card
Blue icon
Soft Blue background
```

### Yellow Accent Card

```text
White card
Yellow icon/accent
Soft Yellow background
```

### Coral Accent Card

```text
White card
Coral icon/accent
Soft Coral background
```

Tujuannya membuat dashboard/landing page lebih hidup.

---

# 15. Feature Section

Gunakan layout:

```text
Section heading
Supporting description

[ Feature Card ]
[ Feature Card ]
[ Feature Card ]
```

Atau:

```text
Text content      Illustration
```

Feature icon dapat menggunakan:

- Blue
- Yellow
- Coral

Gunakan icon dengan container:

```text
w-12
h-12
rounded-xl
```

---

# 16. Decorative Elements

Desain referensi menggunakan elemen dekoratif sederhana.

Gunakan:

- Circle.
- Small dots.
- Curved line.
- Abstract blob.
- Triangle.
- Small star/spark.
- Floating card.
- Soft colored shape.

Warna dekorasi:

```text
Blue
Yellow
Coral
Soft Blue
```

## Rules

Dekorasi:

- Tidak boleh mengganggu content.
- Tidak boleh mengurangi readability.
- Tidak harus ada di setiap section.
- Gunakan opacity jika terlalu dominan.
- Pada mobile, beberapa dekorasi boleh disembunyikan.

---

# 17. Illustrations

Illustration style:

- Friendly.
- Simple.
- Rounded.
- Minimal detail.
- Modern.
- Colorful.

Gunakan kombinasi:

```text
Blue + Yellow + Coral + White
```

Hindari illustration yang terlalu realistis jika keseluruhan website menggunakan style flat/modern.

---

# 18. Forms

Form harus terasa simple dan approachable.

Input:

```text
bg-white
border #E8ECF4
rounded-xl
```

Focus:

```text
border #538CDB
ring #538CDB dengan opacity rendah
```

Label:

```text
font-medium
text #20242D
```

Placeholder:

```text
text #9AA1AD
```

Error:

```text
border #FF4646
text #FF4646
bg #FFF0F0
```

---

# 19. Badges

Badge dapat menggunakan warna berbeda berdasarkan konteks.

### Blue

```text
bg-[#F5F5FF]
text-[#538CDB]
```

### Yellow

```text
bg-[#FFFCD5]
text-[#7A6500]
```

### Coral

```text
bg-[#FFF0F0]
text-[#FF4646]
```

Gunakan `rounded-full`.

---

# 20. Tables

Jika website mempunyai dashboard/table:

- Header menggunakan soft blue atau white.
- Active row dapat memiliki soft blue background.
- Status menggunakan colored badge.
- Border tipis.
- Row spacing cukup.
- Hindari table yang terlalu padat.

Contoh:

```text
Product     Status       Stock
────────────────────────────────
Product A   Active       120
Product B   Pending      50
Product C   Low Stock    8
```

Status:

```text
Active    → Blue
Pending   → Yellow
Danger    → Coral
```

---

# 21. Dashboard

Dashboard harus menggunakan prinsip **color-coded information**.

Contoh statistic cards:

```text
┌──────────────────┐
│ Total Users      │
│ 12,450            │
│ +12.5%            │
│ Blue accent       │
└──────────────────┘

┌──────────────────┐
│ Revenue          │
│ Rp 24.5M          │
│ +8.2%             │
│ Yellow accent     │
└──────────────────┘

┌──────────────────┐
│ Pending          │
│ 128               │
│ Coral accent      │
└──────────────────┘
```

Jangan menggunakan semua statistic card dengan warna yang sama.

---

# 22. Sections

Setiap section dapat menggunakan salah satu dari:

```text
White
Soft Blue
Soft Yellow
Very Light Neutral
```

Contoh:

```text
Hero
↓
White

Features
↓
Soft Blue

Statistics
↓
White

Testimonials
↓
Soft Yellow

CTA
↓
Blue
```

Dengan demikian halaman mempunyai visual flow.

---

# 23. CTA Section

CTA harus menjadi salah satu area paling colorful.

Recommended:

```text
Background: #538CDB
Text: white
Accent: yellow + coral
```

Contoh:

```text
┌─────────────────────────────────────────────┐
│                                             │
│       Ready to get started?                │
│                                             │
│    Start your journey today.               │
│                                             │
│           [ Get Started ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

Gunakan dekorasi yellow/coral secara subtle.

---

# 24. Footer

Footer tidak harus hitam.

Gunakan:

```text
White
Soft Blue
```

atau section dengan:

```text
Blue background
White text
```

Jika menggunakan blue footer:

- Heading: White.
- Body: Soft White.
- Links: White/Soft Blue.
- Hover: Yellow.

---

# 25. Responsive Design

Website wajib responsive.

## Breakpoints

Gunakan Tailwind default:

```text
sm  → 640px
md  → 768px
lg  → 1024px
xl  → 1280px
2xl → 1536px
```

## Mobile

Pada mobile:

- Hero menjadi single column.
- Illustration berada di bawah text.
- Navbar berubah menjadi hamburger.
- Grid menjadi 1 column.
- CTA button dapat full-width.
- Padding dikurangi.
- Decorative elements dikurangi.
- Typography diturunkan secara proporsional.

Contoh:

```text
Desktop:

Text                 Illustration


Mobile:

Text
CTA
Illustration
```

---

# 26. Animation & Interaction

Animation harus smooth dan ringan.

Gunakan:

```text
transition-all
duration-200
duration-300
ease-out
```

Interaction:

- Button sedikit berubah warna ketika hover.
- Card dapat naik sedikit ketika hover.
- Illustration dapat menggunakan subtle floating animation.
- Navigation active state harus jelas.
- Modal/dropdown menggunakan fade/scale ringan.

Hindari:

```text
❌ Excessive bouncing
❌ Flashing animation
❌ Animation terlalu cepat
❌ Semua element bergerak bersamaan
```

---

# 27. Accessibility

Walaupun desain colorful, readability tetap menjadi prioritas.

Wajib:

- Text memiliki contrast yang cukup.
- Jangan menggunakan yellow sebagai body text.
- Button memiliki state yang jelas.
- Focus state terlihat.
- Icon tidak menjadi satu-satunya indikator status.
- Form mempunyai label.
- Image mempunyai alt text.
- Interactive element dapat digunakan dengan keyboard.

---

# 28. Tailwind Color Tokens

Gunakan token warna agar implementasi konsisten.

Contoh konfigurasi:

```ts
// tailwind.config.ts

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#538CDB',
          yellow: '#FFD500',
          coral: '#FF4646',
        },
        surface: {
          blue: '#F5F5FF',
          yellow: '#FFFCD5',
          coral: '#FFF0F0',
        },
        text: {
          DEFAULT: '#20242D',
          muted: '#737A87',
        },
        border: '#E8ECF4',
      },
    },
  },
}
```

Kemudian gunakan:

```tsx
bg-brand-blue
text-brand-blue
bg-brand-yellow
bg-brand-coral

bg-surface-blue
bg-surface-yellow
bg-surface-coral

text-text
text-text-muted
border-border
```

---

# 29. Suggested Tailwind Utility Patterns

## Page

```tsx
<div className="min-h-screen bg-white text-text">
```

## Container

```tsx
<div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
```

## Section

```tsx
<section className="py-16 sm:py-20 lg:py-24">
```

## Card

```tsx
<div className="
  rounded-2xl
  border border-border
  bg-white
  p-6
  shadow-sm
">
```

## Primary CTA

```tsx
<button className="
  rounded-full
  bg-brand-blue
  px-6 py-3
  font-semibold
  text-white
  transition-colors
  hover:bg-[#467BC7]
  focus:outline-none
  focus:ring-4
  focus:ring-brand-blue/20
">
```

---

# 30. Component Design Rules

Gunakan reusable components.

Recommended structure:

```text
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   │
│   └── sections/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Statistics.tsx
│       ├── Testimonials.tsx
│       └── CTA.tsx
```

Jangan membuat style yang sama berulang kali di banyak file.

---

# 31. Page Composition

Gunakan struktur visual seperti:

```text
Navbar
│
├── Hero
│
├── Features
│
├── Statistics
│
├── Product / Screens Showcase
│
├── Testimonials
│
├── Pricing / CTA
│
└── Footer
```

Jika website bukan landing page, gunakan prinsip yang sama untuk dashboard, authentication, management page, dan halaman lainnya.

---

# 32. Image / Product Showcase

Jika terdapat screenshot aplikasi, device mockup, atau product image:

- Letakkan pada white/soft-blue surface.
- Gunakan rounded-2xl atau rounded-3xl.
- Gunakan shadow ringan.
- Tambahkan floating information card.
- Gunakan blue/yellow/coral sebagai visual accent.

Contoh:

```text
             ┌───────────────┐
             │   Balance     │
             │   $415.28      │
             └───────────────┘

                  ┌───────┐
                  │ PHONE │
                  │       │
                  │ APP   │
                  │       │
                  └───────┘
```

---

# 33. Visual Hierarchy

Setiap halaman harus memiliki hierarchy yang jelas:

```text
1. Primary Heading
2. Supporting Text
3. Primary CTA
4. Main Visual
5. Supporting Content
6. Secondary Information
```

Gunakan ukuran, weight, spacing, dan color untuk membuat hierarchy.

Jangan mengandalkan warna saja.

---

# 34. Do & Don't

## DO

- Gunakan white sebagai foundation.
- Gunakan blue sebagai warna identitas utama.
- Gunakan yellow dan coral sebagai accent.
- Buat halaman terasa colorful.
- Gunakan rounded corners.
- Gunakan whitespace.
- Gunakan illustration modern.
- Gunakan soft shadows.
- Gunakan responsive layout.
- Gunakan reusable components.
- Pertahankan contrast yang baik.

## DON'T

- Jangan membuat website full grayscale.
- Jangan menggunakan hanya white + gray + blue.
- Jangan menggunakan black sebagai background utama.
- Jangan menggunakan gradient di setiap komponen.
- Jangan menggunakan shadow terlalu berat.
- Jangan menggunakan terlalu banyak warna berbeda di luar palette.
- Jangan menggunakan yellow untuk text panjang.
- Jangan membuat semua komponen berwarna sekaligus.
- Jangan mengorbankan readability demi visual.
- Jangan membuat mobile sebagai versi desktop yang diperkecil.

---

# 35. Color Balance Example

Contoh visual balance yang diinginkan:

```text
WHITE
████████████████████████████████████████

BLUE
████████████

SOFT BLUE
████████

YELLOW
████

CORAL
███
```

Intinya:

> **White menjadi canvas, Blue menjadi identity, Yellow dan Coral menjadi visual energy.**

---

# 36. Final Design Rule

Semua halaman yang dibuat setelah redesign harus mengikuti prinsip:

> **Clean + Modern + Full Color + Friendly + Spacious**

Dengan aturan utama:

```text
MAIN FOUNDATION
→ White

SECONDARY / BRAND
→ Blue #538CDB

ACCENT
→ Yellow #FFD500
→ Coral #FF4646

SOFT SURFACES
→ #F5F5FF
→ #FFFCD5
→ #FFF0F0

TEXT
→ #20242D
→ #737A87
```

**Jangan membuat tampilan menjadi dominan abu-abu.**

Jika sebuah halaman terasa terlalu plain, tambahkan:

- Blue accent,
- Yellow highlight,
- Coral decorative element,
- Colored icon,
- Soft colored section,
- Illustration,
- atau colored CTA.

Namun tetap pertahankan whitespace dan hierarchy.

---

# 37. Final Checklist

Sebelum sebuah page dianggap selesai, pastikan:

- [ ] White menjadi foundation utama.
- [ ] Blue digunakan sebagai secondary/brand color.
- [ ] Website terlihat full color.
- [ ] Yellow digunakan sebagai accent.
- [ ] Coral digunakan sebagai accent/status.
- [ ] Tidak terlalu banyak warna baru di luar palette.
- [ ] Typography konsisten.
- [ ] Border radius konsisten.
- [ ] Shadow ringan.
- [ ] CTA terlihat jelas.
- [ ] Card tidak terlalu monoton.
- [ ] Hover dan focus state tersedia.
- [ ] Responsive pada mobile, tablet, dan desktop.
- [ ] Contrast text dapat dibaca.
- [ ] Decorative elements tidak mengganggu content.
- [ ] UI terasa modern, friendly, dan clean.

---

## Design Philosophy

**"White creates clarity. Blue creates trust. Yellow creates energy. Coral creates personality."**

Gunakan keempat karakter tersebut secara seimbang untuk menghasilkan interface React + Tailwind yang **full color, modern, clean, friendly, dan konsisten** dengan referensi desain.
