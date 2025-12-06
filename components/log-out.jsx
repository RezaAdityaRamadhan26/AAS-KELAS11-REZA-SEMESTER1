"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 rounded-lg p-3 w-full text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Keluar</span>
        </button>
    );
}
