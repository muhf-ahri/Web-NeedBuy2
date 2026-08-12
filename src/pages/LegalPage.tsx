// src/pages/LegalPage.tsx
//
// Empat halaman footer (terms, privacy, shipping, contact) berbagi satu layout.
// Isinya beda, strukturnya sama — jadi satu komponen dengan peta konten, bukan
// empat file yang saling menyalin.
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon, { type IconName } from '../components/ui/Icon';

type Section = { heading: string; body: string[] };
type Doc = { title: string; intro: string; icon: IconName; updated: string; sections: Section[] };

export const LEGAL_DOCS: Record<string, Doc> = {
  terms: {
    title: 'Syarat & Ketentuan',
    icon: 'shield',
    updated: '12 Agustus 2026',
    intro:
      'Dengan membuat akun dan berbelanja di NeedBuy, kamu setuju pada ketentuan di bawah ini.',
    sections: [
      {
        heading: '1. Akun',
        body: [
          'Satu orang boleh memiliki satu akun pembeli. Kamu bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi di akunmu.',
          'Kami dapat menonaktifkan akun yang terbukti melakukan penipuan, memanipulasi kupon, atau menyalahgunakan sistem ulasan.',
        ],
      },
      {
        heading: '2. Pesanan dan harga',
        body: [
          'Harga yang berlaku adalah harga yang tercatat saat pesanan dibuat. Perubahan harga oleh penjual setelah itu tidak mengubah pesanan yang sudah berjalan.',
          'Satu checkout yang berisi produk dari beberapa penjual akan dipecah menjadi beberapa pesanan — satu pesanan per penjual, masing-masing dengan nomor pesanan sendiri.',
        ],
      },
      {
        heading: '3. Pembayaran',
        body: [
          'Pembayaran online diproses lewat Midtrans. NeedBuy tidak pernah menyimpan nomor kartu kamu.',
          'Pesanan dengan status Menunggu Pembayaran otomatis dibatalkan bila tidak dibayar sampai batas waktu yang tertera, dan stok dikembalikan ke penjual.',
        ],
      },
      {
        heading: '4. Kupon',
        body: [
          'Kupon berlaku sesuai masa aktif, kuota, dan minimum belanja yang tertera pada kupon. Kupon nggak bisa ditukar jadi uang.',
          'Kupon yang sudah diklaim melekat pada akun dan tidak bisa dipindahkan ke akun lain.',
        ],
      },
      {
        heading: '5. Ulasan',
        body: [
          'Ulasan hanya bisa ditulis untuk barang yang sudah kamu terima. Ulasan yang memuat data pribadi orang lain, ujaran kebencian, atau promosi akan dihapus.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Kebijakan Privasi',
    icon: 'lock',
    updated: '12 Agustus 2026',
    intro: 'Ini data yang kami kumpulkan, alasannya, dan kendali yang kamu punya atasnya.',
    sections: [
      {
        heading: 'Data yang kami simpan',
        body: [
          'Data akun (nama, email, nomor telepon), alamat pengiriman, riwayat pesanan, isi percakapan dengan penjual, dan kebutuhan yang kamu tulis di fitur Needs.',
          'Kata sandi disimpan dalam bentuk hash. Tim NeedBuy tidak bisa membacanya.',
        ],
      },
      {
        heading: 'Cara kami memakainya',
        body: [
          'Memproses pesanan, menghubungkanmu dengan penjual, dan mencocokkan produk dengan kebutuhan yang kamu tulis.',
          'Kami tidak menjual data kamu ke pihak ketiga.',
        ],
      },
      {
        heading: 'Pihak ketiga',
        body: [
          'Midtrans memproses pembayaran dan menerima nama, email, serta nominal transaksi. Jasa kurir menerima alamat pengiriman.',
        ],
      },
      {
        heading: 'Kendali kamu',
        body: [
          'Kamu bisa memperbarui data akun kapan saja dari halaman Profil, dan meminta penghapusan akun lewat halaman Hubungi Kami. Data pesanan tetap kami simpan selama diwajibkan untuk pembukuan.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Info Pengiriman',
    icon: 'truck',
    updated: '12 Agustus 2026',
    intro: 'Perjalanan pesanan dari penjual sampai ke depan pintumu.',
    sections: [
      {
        heading: 'Waktu proses',
        body: [
          'Penjual memproses pesanan dalam 1x24 jam kerja setelah pembayaran diterima. Pesanan COD langsung masuk antrean proses tanpa menunggu pembayaran.',
        ],
      },
      {
        heading: 'Estimasi tiba',
        body: [
          'Jabodetabek 1-2 hari. Pulau Jawa 2-4 hari. Luar Jawa 3-7 hari. Estimasi dihitung sejak pesanan berstatus Dikirim.',
        ],
      },
      {
        heading: 'Ongkos kirim',
        body: [
          'Ongkos kirim dihitung per penjual saat checkout. Karena satu checkout bisa jadi beberapa pesanan, ongkos kirim bisa muncul lebih dari satu kali.',
        ],
      },
      {
        heading: 'Paket bermasalah',
        body: [
          'Kalau paket belum tiba tujuh hari setelah status Dikirim, hubungi penjual lewat menu Pesan. Kalau tidak ada tanggapan dalam 2x24 jam, ajukan laporan lewat Hubungi Kami.',
        ],
      },
    ],
  },
  contact: {
    title: 'Hubungi Kami',
    icon: 'mail',
    updated: '12 Agustus 2026',
    intro: 'Pilih jalur yang paling cepat menyelesaikan masalahmu.',
    sections: [
      {
        heading: 'Soal satu pesanan',
        body: [
          'Hubungi penjualnya langsung lewat menu Pesan. Penjual yang memegang stok dan resi, jadi jawabannya paling cepat datang dari sana.',
        ],
      },
      {
        heading: 'Soal akun, pembayaran, atau kupon',
        body: [
          'Email: bantuan@needbuy.id — sertakan nomor pesanan bila ada. Kami balas pada hari kerja, maksimal 1x24 jam.',
        ],
      },
      {
        heading: 'Laporan penyalahgunaan',
        body: [
          'Email: laporan@needbuy.id untuk produk palsu, penipuan, atau ulasan yang melanggar ketentuan.',
        ],
      },
      {
        heading: 'Alamat',
        body: ['NeedBuy Indonesia, Jl. Casablanca Raya Kav. 88, Jakarta Selatan 12870.'],
      },
    ],
  },
};

const LegalPage: React.FC = () => {
  const { pathname } = useLocation();
  const key = pathname.replace('/', '');
  const doc = LEGAL_DOCS[key] ?? LEGAL_DOCS.terms;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-10 py-10">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center shrink-0">
            <Icon name={doc.icon} size={20} />
          </span>
          <div>
            <h1 className="text-[26px] font-bold text-[#101319] leading-tight">{doc.title}</h1>
            <p className="text-[12px] text-[#737686]">Diperbarui {doc.updated}</p>
          </div>
        </div>

        <p className="mt-5 text-[15px] text-[#434655] leading-relaxed">{doc.intro}</p>

        <div className="mt-8 space-y-7">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[15px] font-bold text-[#101319] mb-2">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-[14px] text-[#434655] leading-relaxed mb-2">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
