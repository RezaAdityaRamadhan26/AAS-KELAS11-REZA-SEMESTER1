import { NextResponse } from "next/server";
import { approveLoan, rejectLoan } from "@/lib/actions";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { loanId, action, reason, adminId } = body;

    if (!loanId || !action) {
      return NextResponse.json(
        { error: "loanId and action are required" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      if (!adminId) {
        return NextResponse.json(
          { error: "adminId is required for approval" },
          { status: 400 }
        );
      }
      await approveLoan(loanId, adminId);
      return NextResponse.json(
        { success: true, message: "Peminjaman berhasil disetujui" },
        { status: 200 }
      );
    }

    if (action === "reject") {
      const rejectReason = reason || "Stok tidak tersedia";
      await rejectLoan(loanId, rejectReason);
      return NextResponse.json(
        { success: true, message: "Peminjaman berhasil ditolak" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'approve' or 'reject'" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal memproses peminjaman" },
      { status: 500 }
    );
  }
}
