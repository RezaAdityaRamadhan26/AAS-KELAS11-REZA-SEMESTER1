"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Book,
    ArrowLeftRight,
    User,
    Bell,
    Grid,
    LogOut,
} from "lucide-react";
import Logout from "@/components/log-out";

const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Buku", href: "/admin/books", icon: Book },
    { name: "Peminjaman", href: "/admin/borrowings", icon: ArrowLeftRight },
];

const studentNavItems = [
    { name: "Beranda", href: "/student/home", icon: LayoutDashboard },
    { name: "Kategori", href: "/student/categories", icon: Grid },
    { name: "Peminjaman Saya", href: "/student/borrowing", icon: ArrowLeftRight },
    { name: "Notifikasi", href: "/student/notification", icon: Bell },
    { name: "Profile", href: "/student/profile", icon: User },
];

export default function Sidebar({ role = "siswa" }) {
    const pathname = usePathname();
    const navItems = role === "admin" ? adminNavItems : studentNavItems;

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
            <div>
                {/* LOGO */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <span className="text-xl font-bold text-orange-600">
                        StarLib
                    </span>
                </div>

                {/* NAV */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 rounded-lg p-3 
                  transition-all duration-200
                  ${active
                                        ? "bg-orange-100 font-semibold text-orange-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }
                `}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* LOGOUT */}
            <div className="mt-8">
                <Logout />
            </div>
        </aside>
    );
}
