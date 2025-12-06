import { NextResponse } from "next/server";
import { getLoans, getAllLoans, createLoan } from "@/lib/actions";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Jika userId tidak ada, return semua loans (untuk admin)
    if (!userId) {
      const loans = await getAllLoans();
      return NextResponse.json({ loans });
    }

    // Jika ada userId, return loans untuk user itu saja (untuk siswa)
    const loans = await getLoans(userId);
    return NextResponse.json({ loans });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, bookId, loanDate, dueDate } = body;

    if (!userId || !bookId || !loanDate || !dueDate) {
      return NextResponse.json(
        { error: "userId, bookId, loanDate, and dueDate are required" },
        { status: 400 }
      );
    }

    const loanId = await createLoan({ userId, bookId, loanDate, dueDate });
    return NextResponse.json(
      { success: true, loanId, message: "Buku berhasil dipinjam" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal meminjam buku" },
      { status: 500 }
    );
  }
}
