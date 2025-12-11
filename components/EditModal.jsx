"use client";
import { useState } from "react";
import { actionUpdateBook } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function EditModal({ book, onClose }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(book.image || "");
    const [uploadedImagePath, setUploadedImagePath] = useState("");
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar (jpg, png, gif, dll)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran file maksimal 5MB');
            return;
        }

        setError('');
        setUploading(true);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadedImagePath(data.imagePath);
            } else {
                setError(data.error || 'Gagal upload gambar');
                setPreviewUrl(book.image || '');
            }
        } catch (err) {
            setError('Gagal upload gambar');
            setPreviewUrl(book.image || '');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.target);

        // If new image uploaded, use it; otherwise keep the old one
        if (uploadedImagePath) {
            formData.set('image', uploadedImagePath);
        } else {
            formData.set('image', book.image || '');
        }

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Buku</label>
                            <div className="flex gap-4">
                                {previewUrl && (
                                    <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border-2 border-orange-200">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                                        <input
                                            type="file"
                                            id="cover-upload-edit"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="cover-upload-edit" className="cursor-pointer">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                            <p className="text-sm font-medium text-gray-700">Klik untuk upload gambar baru</p>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                                        </label>
                                        {uploading && (
                                            <p className="text-sm text-orange-600 mt-2">Mengupload...</p>
                                        )}
                                        {uploadedImagePath && (
                                            <p className="text-sm text-green-600 mt-2">✓ Gambar baru berhasil diupload</p>
                                        )}
                                    </div>
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
