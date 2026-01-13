"use client";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Library } from "lucide-react";

const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});

const roles = [
    { key: "siswa", label: "Siswa" },
    { key: "admin", label: "Admin" },
];

function LoginForm() {
    const router = useRouter();
    const search = useSearchParams();
    const preRole = search.get("role");

    const [role, setRole] = useState(preRole === "admin" ? "admin" : "siswa");
    const [form, setForm] = useState({ username: "", password: "" });
    const [remember, setRemember] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (preRole && (preRole === "admin" || preRole === "siswa")) {
            setRole(preRole);
        }
    }, [preRole]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErr("");
        setLoading(true);

        const parsed = schema.safeParse(form);
        if (!parsed.success) {
            setErr(parsed.error.errors[0].message);
            setLoading(false);
            return;
        }

        try {
            // Add timeout untuk prevent infinite hang
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Login timeout')), 30000) // 30 second timeout
            );

            const res = await Promise.race([
                signIn("credentials", {
                    redirect: false,
                    username: form.username,
                    password: form.password,
                }),
                timeoutPromise
            ]);

            if (res?.error) {
                setErr("Username atau password salah");
                setLoading(false);
                return;
            }

            if (!res?.ok) {
                setErr("Login gagal, coba lagi");
                setLoading(false);
                return;
            }

            // Redirect berdasarkan role yang dipilih (NextAuth sudah set session)
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/student/home");
            }
            // Note: setLoading(false) tidak dipanggil karena page akan redirect
        } catch (error) {
            console.error("Login error:", error);
            setErr(error.message === "Login timeout" ? "Login timeout, coba lagi" : "Terjadi kesalahan saat login");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md"><Library size={28} /></div>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">StarLib</h1>
                    <p className="mt-2 text-lg font-semibold text-slate-700">Selamat Datang Kembali</p>
                    <p className="text-sm text-slate-500">Masuk untuk melanjutkan</p>
                </div>

                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                    {roles.map(r => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setRole(r.key)}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${role === r.key
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                {err && (
                    <div className="mb-4 text-sm px-4 py-3 rounded-lg bg-red-50 text-red-600 border border-red-200">
                        {err}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Masukkan username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            type="password"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Masukkan password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Memproses..." : "Masuk"}
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
                    Belum punya akun? <Link href="/register" className="text-orange-600 font-semibold hover:underline">Daftar Sekarang</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md">
                            <Library size={28} />
                        </div>
                        <p className="mt-4 text-slate-600">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
