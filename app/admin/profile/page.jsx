"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [editing, setEditing] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Admin</h1>
                <p className="text-sm text-gray-600 mt-1">Kelola informasi akun administrator</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                        {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{session?.user?.name || "Admin Perpustakaan"}</h2>
                                <p className="text-sm text-gray-600">Administrator</p>
                            </div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                            >
                                {editing ? "Batal" : "Edit Profil"}
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    disabled={!editing}
                                    defaultValue={session?.user?.name || ""}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
                                <input
                                    type="text"
                                    disabled={!editing}
                                    defaultValue="199012345678901234"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    disabled={!editing}
                                    defaultValue={session?.user?.email || session?.user?.username || "admin@smktarunabhakti.sch.id"}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    disabled={!editing}
                                    defaultValue="081234567890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                                <input
                                    type="text"
                                    disabled={!editing}
                                    defaultValue="Kepala Perpustakaan"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="mt-4 flex gap-2">
                                <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
                                    Simpan Perubahan
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                                >
                                    Batal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Ubah Password</h2>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
                        Update Password
                    </button>
                </div>
            </div>

            {/* System Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Sistem</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600 mb-1">Role</div>
                        <div className="font-semibold text-gray-900">Administrator</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Status</div>
                        <div className="font-semibold text-green-600">Aktif</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Terakhir Login</div>
                        <div className="font-semibold text-gray-900">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Member Since</div>
                        <div className="font-semibold text-gray-900">Januari 2024</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
