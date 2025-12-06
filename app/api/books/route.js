import { NextResponse } from "next/server";
import { getAllBooks } from "@/lib/actions";

export async function GET() {
  try {
    const books = await getAllBooks(100);
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
