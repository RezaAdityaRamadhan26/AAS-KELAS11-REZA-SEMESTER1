"use client";
import { actionDeleteBook } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ bookId, onDelete }) {
    const router = useRouter();

    async function handleDelete() {
        if (confirm("Hapus buku ini?")) {
            await actionDeleteBook(bookId);
            if (onDelete) {
                onDelete();
            } else {
                router.refresh();
            }
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
            title="Hapus"
        >
            <Trash2 size={18} />
        </button>
    );
}
