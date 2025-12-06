import { getAllLoans, getAllBooks } from "@/lib/actions";
import db from "@/lib/db";
import { Library, BookOpen, Users, Clock, CheckCircle } from "lucide-react";

export default async function AdminDashboardPage() {
    const loans = await getAllLoans();
    const books = await getAllBooks(1000);

    // Get total students (users dengan role siswa)
    const [studentsResult] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'siswa'");
    const totalStudents = studentsResult[0].count; const totalBooks = books.length;
    const borrowedBooks = books.reduce((sum, book) => sum + (book.borrowed || 0), 0);
    const activeLoans = loans.filter(l => l.status === "active");
    const lateLoans = loans.filter(l => {
        if (l.status !== "active") return false;
        const dueDate = new Date(l.due_date);
        return dueDate < new Date();
    });

    const recentLoans = loans.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan perpustakaan Anda</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Library className="text-blue-600" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Total Buku</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{totalBooks}</div>
                    <div className="text-xs text-gray-500 mt-1">Koleksi buku</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-orange-600" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Buku Dipinjam</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{borrowedBooks}</div>
                    <div className="text-xs text-gray-500 mt-1">{activeLoans.length} peminjaman aktif</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Total Siswa</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
                    <div className="text-xs text-gray-500 mt-1">Siswa terdaftar</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-red-600" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Terlambat</div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">{lateLoans.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Perlu perhatian</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Peminjaman Terbaru */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Peminjaman Terbaru</h2>
                        <a href="/admin/borrowings" className="text-sm text-orange-600 font-medium hover:underline">
                            Lihat Semua →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentLoans.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">Tidak ada peminjaman terbaru</p>
                        ) : (
                            recentLoans.map(loan => (
                                <div key={loan.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {loan.user_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-gray-900 truncate">{loan.user_name}</div>
                                        <div className="text-xs text-gray-600 truncate">{loan.book_title}</div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {loan.status === "active" ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                Aktif
                                            </span>
                                        ) : loan.status === "returned" ? (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                                Selesai
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                                {loan.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Keterlambatan Pengembalian */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Keterlambatan Pengembalian</h2>
                        <a href="/admin/borrowings" className="text-sm text-orange-600 font-medium hover:underline">
                            Lihat Semua →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {lateLoans.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="text-green-500 mx-auto mb-2" size={48} strokeWidth={1.5} />
                                <p className="text-sm text-gray-500">Tidak ada keterlambatan</p>
                            </div>
                        ) : (
                            lateLoans.slice(0, 5).map(loan => {
                                const dueDate = new Date(loan.due_date);
                                const today = new Date();
                                const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                                return (
                                    <div key={loan.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {loan.user_name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-gray-900 truncate">{loan.user_name}</div>
                                            <div className="text-xs text-gray-600 truncate">{loan.book_title}</div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                {daysLate} hari
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
