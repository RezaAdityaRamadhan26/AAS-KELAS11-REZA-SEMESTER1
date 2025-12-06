"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Library, BookOpen } from "lucide-react";

export default function StudentBorrowingPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("sedang");
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        if (session?.user?.id) {
            fetch(`/api/loans?userId=${session.user.id}`)
                .then(res => res.json())
                .then(data => setLoans(data.loans || []));
        }
    }, [session]);

    // Filter berdasarkan status database: pending, dipinjam, kembali, hilang
    const activeLoans = loans.filter(l => l.status === "pending" || l.status === "dipinjam");
    const historyLoans = loans.filter(l => l.status === "kembali" || l.status === "hilang");

    const displayLoans = activeTab === "sedang" ? activeLoans : historyLoans;

    const getStatusBadge = (status) => {
        if (status === "pending") return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Menunggu Approval</span>;
        if (status === "dipinjam") return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Dipinjam</span>;
        if (status === "kembali") return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Dikembalikan</span>;
        if (status === "hilang") return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Hilang</span>;
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Peminjaman Saya</h1>
                <p className="text-sm text-gray-600 mt-1">Kelola dan pantau status peminjaman buku Anda</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("sedang")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === "sedang"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Sedang Dipinjam
                    {activeLoans.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            {activeLoans.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("riwayat")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition ${activeTab === "riwayat"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Riwayat
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {displayLoans.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <Library className="text-gray-400 mx-auto mb-4" size={64} strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {activeTab === "sedang" ? "Tidak ada peminjaman aktif" : "Belum ada riwayat"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {activeTab === "sedang"
                                ? "Mulai pinjam buku dari halaman beranda"
                                : "Riwayat peminjaman Anda akan muncul di sini"}
                        </p>
                    </div>
                ) : (
                    displayLoans.map(loan => (
                        <div key={loan.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                            <div className="flex gap-4">
                                {/* Book Thumbnail */}
                                <div className="w-24 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {loan.book_image ? (
                                        <img
                                            src={loan.book_image}
                                            alt={loan.book_title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="text-orange-500" size={32} strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Book Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{loan.book_title}</h3>
                                            <p className="text-sm text-gray-600">{loan.author || "Penulis tidak diketahui"}</p>
                                        </div>
                                        {getStatusBadge(loan.status)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Tanggal Pinjam</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {new Date(loan.loan_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Jatuh Tempo</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {new Date(loan.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                        {loan.return_date && (
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Tanggal Kembali</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(loan.return_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
