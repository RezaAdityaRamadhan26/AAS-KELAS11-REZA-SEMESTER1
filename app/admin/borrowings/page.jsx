"use client";
import { useState, useEffect } from "react";
import { Library, Check, X } from "lucide-react";

export default function AdminBorrowingsPage() {
    const [activeTab, setActiveTab] = useState("permintaan");
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        setLoading(true);
        const response = await fetch("/api/loans");
        const data = await response.json();
        setLoans(data.loans || []);
        setLoading(false);
    };

    // TODO: ganti adminId dengan user id dari sesi admin saat sudah tersedia
    const handleApprove = async (loanId) => {
        setActionLoading(loanId);
        const response = await fetch("/api/loans/approve", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loanId,
                action: "approve",
                adminId: 1,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Peminjaman disetujui!");
            fetchLoans();
        } else {
            alert(data.error || "Gagal menyetujui peminjaman");
        }
        setActionLoading(null);
    };

    const handleReject = async (loanId) => {
        const reason = prompt("Alasan penolakan:", "Stok tidak tersedia");
        if (!reason) return;

        setActionLoading(loanId);
        const response = await fetch("/api/loans/approve", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loanId,
                action: "reject",
                reason,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Peminjaman ditolak!");
            fetchLoans();
        } else {
            alert(data.error || "Gagal menolak peminjaman");
        }
        setActionLoading(null);
    };

    const filterLoans = () => {
        if (activeTab === "semua") return loans;
        if (activeTab === "permintaan") return loans.filter(l => l.status === "pending");
        if (activeTab === "aktif") return loans.filter(l => l.status === "dipinjam");
        if (activeTab === "dikembalikan") return loans.filter(l => l.status === "kembali");
        if (activeTab === "hilang") return loans.filter(l => l.status === "hilang");
        return loans;
    };

    const filteredLoans = filterLoans();
    const pendingCount = loans.filter(l => l.status === "pending").length;

    const getStatusBadge = (status) => {
        if (status === "dipinjam") return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Dipinjam</span>;
        if (status === "kembali") return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Dikembalikan</span>;
        if (status === "hilang") return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Hilang</span>;
        if (status === "pending") return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Menunggu Approval</span>;
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>;
    };

    const tabs = [
        { key: "permintaan", label: "Permintaan", count: pendingCount },
        { key: "semua", label: "Semua", count: loans.length },
        { key: "aktif", label: "Dipinjam", count: loans.filter(l => l.status === "dipinjam").length },
        { key: "dikembalikan", label: "Dikembalikan", count: loans.filter(l => l.status === "kembali").length },
        { key: "hilang", label: "Hilang", count: loans.filter(l => l.status === "hilang").length }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Peminjaman</h1>
                <p className="text-sm text-gray-600 mt-1">Kelola semua transaksi peminjaman buku</p>
            </div>

            {loading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <p className="text-gray-500">Memuat data peminjaman...</p>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeTab === tab.key
                                    ? "bg-white text-gray-900 shadow"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 ${activeTab === tab.key ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"} text-xs rounded-full`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Siswa / NIS</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Buku</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tgl Permintaan</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jatuh Tempo</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLoans.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <Library className="text-gray-400 mx-auto mb-2" size={48} strokeWidth={1.5} />
                                                <p className="text-sm text-gray-500">Tidak ada data peminjaman</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLoans.map(loan => (
                                            <tr key={loan.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-sm text-gray-900">{loan.user_name}</div>
                                                    <div className="text-xs text-gray-500">NIS: {loan.nis}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{loan.book_title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{new Date(loan.loan_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{new Date(loan.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(loan.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {loan.status === "pending" ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApprove(loan.id)}
                                                                disabled={actionLoading === loan.id}
                                                                className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                            >
                                                                <Check size={14} />
                                                                Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(loan.id)}
                                                                disabled={actionLoading === loan.id}
                                                                className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                            >
                                                                <X size={14} />
                                                                Tolak
                                                            </button>
                                                        </div>
                                                    ) : loan.status === "dipinjam" ? (
                                                        <span className="text-xs text-gray-500">Sedang Dipinjam</span>
                                                    ) : loan.status === "kembali" ? (
                                                        <span className="text-xs text-gray-500">Sudah Dikembalikan</span>
                                                    ) : loan.status === "hilang" ? (
                                                        <span className="text-xs text-gray-500">Hilang</span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
