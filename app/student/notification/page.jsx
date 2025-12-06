"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, CheckCircle, Info, XCircle, Mail } from "lucide-react";

export default function StudentNotificationPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        const response = await fetch(`/api/notifications?userId=${session.user.id}`);
        const data = await response.json();
        setNotifications(data.notifications || []);
        setLoading(false);
    };

    const handleMarkAllRead = async () => {
        await fetch("/api/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session.user.id,
                action: "markAllRead",
            }),
        });
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read_status).length;

    const getIcon = (type) => {
        if (type === "warning") return <AlertCircle className="text-yellow-500" size={24} />;
        if (type === "success") return <CheckCircle className="text-green-500" size={24} />;
        if (type === "info") return <Info className="text-blue-500" size={24} />;
        if (type === "error") return <XCircle className="text-red-500" size={24} />;
        return <Mail className="text-gray-500" size={24} />;
    };

    const getBgColor = (type, read) => {
        if (read) return "bg-gray-50 border-gray-200";
        if (type === "warning") return "bg-yellow-50 border-yellow-200";
        if (type === "success") return "bg-green-50 border-green-200";
        if (type === "info") return "bg-blue-50 border-blue-200";
        if (type === "error") return "bg-red-50 border-red-200";
        return "bg-white border-gray-200";
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays < 7) return `${diffDays} hari yang lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Memuat notifikasi...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">🔔</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada notifikasi</h3>
                        <p className="text-sm text-gray-600">Notifikasi Anda akan muncul di sini</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`${getBgColor(notif.type, notif.read_status)} border rounded-xl p-5 hover:shadow-md transition`}
                        >
                            <div className="flex gap-4">
                                <div className="text-3xl flex-shrink-0">{getIcon(notif.type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-bold text-gray-900">{notif.title}</h3>
                                        {!notif.read_status && (
                                            <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                                    <span className="text-xs text-gray-500">{formatTime(notif.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
