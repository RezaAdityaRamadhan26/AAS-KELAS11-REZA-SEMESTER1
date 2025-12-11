import Link from "next/link";
import Image from "next/image";
import { getAllBooks } from "@/lib/actions";
import { BookOpen, Search, Library } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const books = await getAllBooks(8);

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold"><Library size={20} /></div>
              <span className="text-xl font-bold text-orange-600">StarLib</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#beranda" className="text-gray-700 hover:text-orange-600">Beranda</Link>
              <Link href="#populer" className="text-gray-700 hover:text-orange-600">Buku Populer</Link>
              <Link href="#fitur" className="text-gray-700 hover:text-orange-600">Fitur</Link>
              <Link href="#tentang" className="text-gray-700 hover:text-orange-600">Tentang</Link>
              <Link href="/login" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90">Masuk</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="/images/library.jpg"
          alt="Library"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Perpustakaan Digital</h1>
            <h2 className="text-4xl font-bold mb-6">SMK Taruna Bhakti</h2>
            <p className="text-lg mb-8 text-gray-200">Akses ribuan koleksi buku digital kapan saja, dimana saja. Tingkatkan pengetahuan dengan mudah dan cepat.</p>
            <div className="flex gap-4">
              <Link href="/register" className="px-8 py-3 bg-white text-orange-600 rounded-full font-medium hover:bg-gray-100">Mulai Sekarang</Link>
              <Link href="#populer" className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10">Jelajahi Buku</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
              <div className="text-gray-600">Koleksi Buku</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">1200+</div>
              <div className="text-gray-600">Siswa Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Kategori</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Akses Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Buku Populer Section */}
      <section id="populer" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Buku Populer</h2>
            <p className="text-gray-600">Koleksi buku terpopuler yang sering dipinjam</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map(book => (
              <div key={book.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="text-orange-500" size={64} strokeWidth={1.5} />
                  )}
                  {book.stock > 0 ? (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Tersedia
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      Dipinjam
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      {book.genre || "Umum"}
                    </span>
                    <Link href="/login" className="text-orange-600 text-sm font-semibold hover:underline">
                      Pinjam →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/login" className="inline-flex px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:opacity-90 transition">
              Lihat Semua Buku
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-orange-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Koleksi Lengkap</h3>
              <p className="text-gray-600 text-sm">Ribuan buku dari berbagai kategori dan penulis terbaik</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="text-orange-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Pencarian Mudah</h3>
              <p className="text-gray-600 text-sm">Temukan buku yang Anda cari dengan cepat dan akurat</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Notifikasi Otomatis</h3>
              <p className="text-gray-600 text-sm">Dapatkan pengingat untuk pengembalian buku</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Statistik Personal</h3>
              <p className="text-gray-600 text-sm">Pantau riwayat dan statistik peminjaman Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold"><Library size={20} /></div>
                <span className="text-xl font-bold">StarLib</span>
              </div>
              <p className="text-gray-400 text-sm">Perpustakaan Digital SMK Taruna Bhakti</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Menu</h3>
              <div className="space-y-2 text-sm">
                <div><Link href="#beranda" className="text-gray-400 hover:text-white">Beranda</Link></div>
                <div><Link href="#populer" className="text-gray-400 hover:text-white">Buku Populer</Link></div>
                <div><Link href="#fitur" className="text-gray-400 hover:text-white">Fitur</Link></div>
                <div><Link href="#tentang" className="text-gray-400 hover:text-white">Tentang</Link></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Layanan</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-400">Peminjaman Buku</div>
                <div className="text-gray-400">Perpanjangan Otomatis</div>
                <div className="text-gray-400">Rekomendasi Buku</div>
                <div className="text-gray-400">Notifikasi</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Kontak</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Jl. Raya Bekasi KM 28</div>
                <div>Cakung, Jakarta Timur</div>
                <div>info@smktarunabhakti.sch.id</div>
                <div>(021) 4600561</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 StarLib - SMK Taruna Bhakti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
