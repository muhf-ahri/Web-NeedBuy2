# NeedBuy — Frontend

Antarmuka marketplace berbasis kebutuhan. React 19 · TypeScript · Vite ·
Tailwind CSS 4 · React Router · Framer Motion.

Backend-nya ada di repo terpisah (`needbuy-backend`). Panduan deploy lengkap
untuk kedua sisi ada di repo `needbuy-submission`.

---

## Menjalankan di laptop

**Prasyarat:** Node.js 20+ dan backend yang sudah jalan.

```bash
npm install
cp .env.example .env    # lalu isi nilainya
npm run dev
```

Buka <http://localhost:5173>.

### Isi `.env`

| Variable | Contoh | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:4000/api/v1` | Alamat backend, sudah termasuk `/api/v1` |
| `VITE_MIDTRANS_CLIENT_KEY` | `Mid-client-…` | **Client** key, bukan server key |

> Vite membakar setiap variabel berawalan `VITE_` ke dalam bundle JavaScript.
> Apa pun yang ditaruh di sana bisa dibaca siapa saja lewat devtools di situs
> yang sudah dideploy. Jangan pernah menaruh Midtrans **server** key,
> `GOOGLE_CLIENT_SECRET`, atau kredensial apa pun di berkas ini.

### Membuka dari perangkat lain

Dev server sudah disetel `host: true`, jadi HP di Wi-Fi yang sama bisa membuka
`http://<ip-lan-laptop>:5173`. Alamat lengkapnya dicetak Vite sebagai baris
**Network** saat start.

---

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Dev server dengan hot reload |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Membuka hasil build secara lokal |
| `npm run lint` | Oxlint |

---

## Struktur

```
src/
├── api/          pemanggilan HTTP per domain (products, cart, orders, …)
├── components/   komponen UI, dikelompokkan per halaman
│   ├── layout/   Navbar, Footer, mega menu kategori
│   └── ui/       elemen dasar yang dipakai berulang
├── contexts/     Auth, Cart, Wishlist
├── hooks/        pengambilan data yang dipakai lebih dari satu halaman
├── pages/        satu berkas per rute
│   ├── admin/    panel admin
│   └── seller/   dasbor penjual
├── types/        tipe bersama
└── utils/        format rupiah, alamat, Snap Midtrans
```

Panduan visual lengkap (palet, tipografi, komponen) ada di
[DESIGN.md](DESIGN.md).

---

## Deploy

Di-deploy ke Vercel dari repo ini. `vercel.json` mengatur rewrite SPA — tanpa
itu, me-refresh halaman selain `/` menghasilkan 404.

Dua environment variable di atas harus diisi di dashboard Vercel, bukan
di-commit. Langkah lengkapnya ada di repo `needbuy-submission`.
