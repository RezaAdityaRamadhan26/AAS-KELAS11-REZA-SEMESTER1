import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const start = Date.now();
    const [result] = await db.execute("SELECT 1 as ok");
    const duration = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      responseTime: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
