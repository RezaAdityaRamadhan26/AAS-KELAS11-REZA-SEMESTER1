"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Library } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const role = "siswa";

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.target);
        const full_name = formData.get("full_name");
        const username = formData.get("username");
        const nis = formData.get("nis");
        const kelas = formData.get("kelas");
        const password = formData.get("password");
        const confirm = formData.get("confirm_password");

        if (!full_name || !username || !password) {
            setError("Nama, username, dan password wajib diisi");
            setLoading(false);
            return;
        }
        if (!nis || !kelas) {
            setError("NIS dan Kelas wajib diisi");
            setLoading(false);
            return;
        }
        if (password !== confirm) {
            setError("Konfirmasi password tidak cocok");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    full_name,
                    role,
                    class_grade: role === "siswa" ? kelas : null,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Terjadi kesalahan");
                setLoading(false);
                return;
            }
            router.push("/login?role=" + role);
        } catch {
            setError("Terjadi kesalahan sistem");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md"><Library size={28} /></div>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">StarLib</h1>
                    <p className="mt-2 text-lg font-semibold text-slate-700">Buat Akun Baru</p>
                    <p className="text-sm text-slate-500">Daftar untuk bergabung</p>
                </div>

                {error && (
                    <div className="mb-4 text-sm px-4 py-3 rounded-lg bg-red-50 text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                        <input name="full_name" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Nama lengkap" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">NIS</label>
                        <input name="nis" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nomor Induk Siswa" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Kelas</label>
                        <input name="kelas" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Contoh: XII RPL 1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input name="username" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Buat Username" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input name="password" type="password" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Minimal 8 karakter" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
                        <input name="confirm_password" type="password" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Masukkan Kembali password" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
                    >
                        {loading ? "Mendaftar..." : "Daftar"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-500">atau</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <Link href="/" className="block w-full text-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    Kembali ke Beranda
                </Link>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Sudah punya akun? <Link href="/login" className="text-orange-600 font-semibold hover:underline">Masuk</Link>
                </p>
            </div>
        </div>
    );
}
