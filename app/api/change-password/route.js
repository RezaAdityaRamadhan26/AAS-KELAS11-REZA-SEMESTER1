import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { userId, oldPassword, newPassword } = await request.json();

  if (!userId || !oldPassword || !newPassword) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Get user's current password
  const users = await query("SELECT password FROM users WHERE id = ?", [
    userId,
  ]);

  if (users.length === 0) {
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );
  }

  const user = users[0];

  // Verify old password
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);

  if (!isValidPassword) {
    return NextResponse.json(
      { error: "Password lama tidak sesuai" },
      { status: 401 }
    );
  }

  // Hash new password
  // Hash password baru dengan bcrypt rounds 6 untuk performa di serverless
  const hashedPassword = await bcrypt.hash(newPassword, 6);

  // Update password
  await query("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    userId,
  ]);

  return NextResponse.json({
    message: "Password berhasil diubah",
  });
}
