import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db/sql";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query("SELECT 1 AS ok");

    return NextResponse.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("DB health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}