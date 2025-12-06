import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId, fullName, username, classGrade } = await request.json();

    console.log("Update Profile Request:", {
      userId,
      fullName,
      username,
      classGrade,
    });

    if (!userId || !fullName || !username) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Check if username already exists (excluding current user)
    const existingUser = await query(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, userId]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username sudah digunakan oleh user lain" },
        { status: 409 }
      );
    }

    // Update user profile
    const result = await query(
      "UPDATE users SET full_name = ?, username = ?, class_grade = ? WHERE id = ?",
      [fullName, username, classGrade || null, userId]
    );

    console.log("Update result:", result);

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      updated: result.affectedRows || 0,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
