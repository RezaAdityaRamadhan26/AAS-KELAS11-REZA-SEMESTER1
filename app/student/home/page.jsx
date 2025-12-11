"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Library, CheckCircle, BookOpen, Search, Hand } from "lucide-react";

export default function StudentHomePage() {
    const { data: session } = useSession();
    const [books, setBooks] = useState([]);
    const [searchType, setSearchType] = useState("judul");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [borrowDays, setBorrowDays] = useState(7);

    useEffect(() => {
        fetch("/api/books")
            .then(res => res.json())
            .then(data => setBooks(data.books || []));
    }, []);

    const filteredBooks = books.filter(book => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        if (searchType === "judul") return book.title.toLowerCase().includes(query);
        if (searchType === "penulis") return book.author.toLowerCase().includes(query);
        if (searchType === "genre") return book.genre?.toLowerCase().includes(query);
        return true;
    });

    const handleBorrowClick = (book) => {
        if (book.stock > 0) {
            setSelectedBook(book);
            setShowModal(true);
        }
    };

    const handleBorrowSubmit = async () => {
        if (!selectedBook || !session?.user?.id) return;

        try {
            const loanDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + borrowDays);

            const response = await fetch("/api/loans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    bookId: selectedBook.id,
                    loanDate: loanDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Permintaan peminjaman dikirim! Menunggu persetujuan admin...");
                setShowModal(false);
                setSelectedBook(null);
                setBorrowDays(7);
                fetch("/api/books")
                    .then(res => res.json())
                    .then(data => setBooks(data.books || []));
            } else {
                alert(data.error || "Gagal meminjam buku");
            }
        } catch {
            alert("Terjadi kesalahan");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header dengan Greeting */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold flex items-center gap-2">Selamat Datang, {session?.user?.name || "Siswa"}!</h1>
                <p className="text-orange-100 mt-1">Temukan buku favoritmu dan mulai membaca hari ini</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Library className="text-blue-600" size={20} /></div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{books.length}</div>
                            <div className="text-sm text-gray-600">Total Buku</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="text-green-600" size={20} /></div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{books.filter(b => b.stock > 0).length}</div>
                            <div className="text-sm text-gray-600">Tersedia</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><BookOpen className="text-orange-600" size={20} /></div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{books.filter(b => b.borrowed > 0).length}</div>
                            <div className="text-sm text-gray-600">Dipinjam</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white border border-orange-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Cari Buku</h2>
                <div className="flex gap-3 mb-4">
                    {["judul", "penulis", "genre"].map(type => (
                        <button
                            key={type}
                            onClick={() => setSearchType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${searchType === type
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Cari berdasarkan ${searchType}...`}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Buku Populer Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Buku Populer</h2>
                    <button className="text-orange-600 text-sm font-medium hover:underline">Lihat Semua →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredBooks.slice(0, 12).map(book => (
                        <div key={book.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group">
                            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                {book.image ? (
                                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <BookOpen className="text-orange-500" size={48} strokeWidth={1.5} />
                                )}
                                {book.stock > 0 ? (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                                        Tersedia
                                    </div>
                                ) : (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                                        Dipinjam
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                        {book.genre || "Umum"}
                                    </span>
                                    <button
                                        onClick={() => handleBorrowClick(book)}
                                        disabled={book.stock === 0}
                                        className={`px-3 py-1 text-xs font-semibold rounded transition ${book.stock > 0
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {book.stock > 0 ? "Pinjam" : "Habis"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Peminjaman */}
            {showModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pinjam Buku</h2>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex gap-4">
                                <div className="w-20 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded flex items-center justify-center flex-shrink-0">
                                    {selectedBook.image ? (
                                        <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-full object-cover rounded" />
                                    ) : (
                                        <BookOpen className="text-orange-500" size={32} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{selectedBook.title}</h3>
                                    <p className="text-sm text-gray-600 mb-1">Penulis: {selectedBook.author}</p>
                                    <p className="text-sm text-gray-600">Stok: {selectedBook.stock} buku</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Durasi Peminjaman
                            </label>
                            <select
                                value={borrowDays}
                                onChange={(e) => setBorrowDays(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value={3}>3 Hari</option>
                                <option value={7}>7 Hari (1 Minggu)</option>
                                <option value={14}>14 Hari (2 Minggu)</option>
                                <option value={21}>21 Hari (3 Minggu)</option>
                            </select>
                        </div>

                        <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-900">
                                <span className="font-semibold">Tanggal Kembali:</span>{" "}
                                {new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedBook(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBorrowSubmit}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition font-semibold"
                            >
                                Pinjam Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
