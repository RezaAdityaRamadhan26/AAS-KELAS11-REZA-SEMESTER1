"use client";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EditModal from "./EditModal";
import { Library, Edit } from "lucide-react";

export default function BooksTable({ books, onUpdate }) {
    const [editingBook, setEditingBook] = useState(null);

    function handleCloseEdit() {
        setEditingBook(null);
        if (onUpdate) onUpdate();
    }

    function handleDelete() {
        if (onUpdate) onUpdate();
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Judul Buku</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pengarang</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Penerbit</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Genre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stok</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Library className="text-gray-400 mx-auto mb-2" size={48} strokeWidth={1.5} />
                                        <p className="text-sm text-gray-500">Tidak ada buku ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                books.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-sm text-gray-900">{b.title}</div>
                                            <div className="text-xs text-gray-500">
                                                {b.publication_year || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{b.author}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{b.publisher}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                                {b.genre || "Umum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{b.stock}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingBook(b)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <DeleteButton bookId={b.id} onDelete={handleDelete} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingBook && (
                <EditModal
                    book={editingBook}
                    onClose={handleCloseEdit}
                />
            )}
        </>
    );
}
