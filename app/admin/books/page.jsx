// app/admin/books/page.jsx
"use client";
import { useState, useEffect } from "react";
import { fetchBooks } from "@/lib/actions";
import BooksTable from "@/components/BooksTable";
import AddModal from "@/components/AddModal";
import { Library, Search } from "lucide-react";

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    async function loadBooks() {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data);
        setLoading(false);
    }

    function handleCloseModal() {
        setShowAddModal(false);
        loadBooks();
    }

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <Library className="text-gray-400 mx-auto mb-2" size={48} strokeWidth={1.5} />
                <p className="text-gray-600">Memuat data buku...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Buku</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola koleksi buku perpustakaan</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
                >
                    + Tambah Buku
                </button>
            </div>

            {/* Search */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul, penulis, atau kategori..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Buku</div>
                    <div className="text-2xl font-bold text-gray-900">{books.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Stok</div>
                    <div className="text-2xl font-bold text-gray-900">{books.reduce((sum, b) => sum + b.stock, 0)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Dipinjam</div>
                    <div className="text-2xl font-bold text-gray-900">{books.reduce((sum, b) => sum + (b.borrowed || 0), 0)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Tersedia</div>
                    <div className="text-2xl font-bold text-green-600">{books.reduce((sum, b) => sum + (b.stock - (b.borrowed || 0)), 0)}</div>
                </div>
            </div>

            <BooksTable books={filteredBooks} onUpdate={loadBooks} />

            {showAddModal && <AddModal onClose={handleCloseModal} />}
        </div>
    );
}
