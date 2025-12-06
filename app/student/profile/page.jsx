"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function StudentProfilePage() {
    const { data: session } = useSession();
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [classGrade, setClassGrade] = useState("");
    const [message, setMessage] = useState("");

    // Set initial values when session is loaded
    useEffect(() => {
        if (session?.user) {
            setFullName(session.user.name || "");
            setUsername(session.user.username || "");
            setClassGrade(session.user.class_grade || "");
        }
    }, [session]);

    const handleSave = async () => {
        setMessage("");
        try {
            const response = await fetch("/api/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    fullName,
                    username,
                    classGrade
                })
            });

            const data = await response.json();
            setMessage("Profil berhasil diperbarui! Silakan login kembali...");
            setEditing(false);

            // Logout and redirect to login to refresh session
            setTimeout(async () => {
                await signOut({ redirect: true, callbackUrl: "/login" });
            }, 1500);
        } catch (error) {
            setMessage("Terjadi kesalahan saat memperbarui profil!");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                <p className="text-sm text-gray-600 mt-1">Kelola informasi akun Anda</p>
            </div>

            {message && (
                <div className={`p-3 rounded-lg ${message.includes("berhasil") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                        {session?.user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{session?.user?.name || "Nama Siswa"}</h2>
                                <p className="text-sm text-gray-600">{session?.user?.role === "siswa" ? "Siswa" : "Admin"}</p>
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
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    disabled={!editing}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                                <input
                                    type="text"
                                    disabled={!editing}
                                    value={classGrade}
                                    onChange={(e) => setClassGrade(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                                >
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
        </div>
    );
}
