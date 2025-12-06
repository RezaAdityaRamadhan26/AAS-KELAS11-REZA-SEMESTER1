import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser } from "@/lib/actions";

export async function POST(request) {
  try {
    const { username, password, full_name, role, class_grade } =
      await request.json();

    if (!username || !password || !full_name) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const id = await createUser({
      username,
      passwordHash: hash,
      full_name,
      role: role || "siswa",
      class_grade: class_grade || null,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    );
  }
}
