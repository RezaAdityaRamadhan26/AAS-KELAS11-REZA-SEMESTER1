"use client";
import { useState } from "react";
import { actionUpdateBook } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function EditModal({ book, onClose }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [coverUrl, setCoverUrl] = useState(book.image || "");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.target);
        await actionUpdateBook(book.id, formData);
        router.refresh();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Edit Buku</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                {error && <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link Cover Buku</label>
                            <div className="flex gap-4">
                                {coverUrl && (
                                    <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        name="image"
                                        type="text"
                                        value={coverUrl}
                                        onChange={(e) => setCoverUrl(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Masukkan URL gambar baru atau kosongkan jika tidak ingin mengubah</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Buku *</label>
                            <input name="title" defaultValue={book.title} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pengarang *</label>
                            <input name="author" defaultValue={book.author} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Penerbit *</label>
                            <input name="publisher" defaultValue={book.publisher} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Terbit *</label>
                            <input name="publication_year" type="number" min="1900" max={new Date().getFullYear()} defaultValue={book.publication_year} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                            <input name="genre" defaultValue={book.genre} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                            <input name="stock" type="number" min="0" defaultValue={book.stock} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                            <textarea name="description" rows="3" defaultValue={book.description || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Deskripsi atau sinopsis buku" />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition">
                            {loading ? 'Menyimpan...' : 'Update Buku'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
