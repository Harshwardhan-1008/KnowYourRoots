import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Surname from "@/lib/models/Surname";

export const runtime = "nodejs";

interface UploadRecord {
  surname: string;
  shortSummary?: string;
  description?: string;
  origin?: string;
  published?: boolean;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ Parse JSON and cast to UploadRecord[]
    const records = (await req.json()) as unknown as UploadRecord[];

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid JSON format. Expected an array." },
        { status: 400 }
      );
    }

    const invalidRows: UploadRecord[] = [];
    const validRows: UploadRecord[] = [];

    // ✅ Explicit type for r (Fixes "type unknown" issue)
    for (const r of records as UploadRecord[]) {
      if (!r.surname || !r.description) {
        invalidRows.push({
          ...r,
          reason: "Missing surname or description",
        } as any);
        continue;
      }

      validRows.push({
        surname: r.surname.trim(),
        shortSummary: r.shortSummary?.trim() || "",
        description: r.description.trim(),
        origin: r.origin?.trim() || "Unknown",
        published: r.published ?? true,
      });
    }

    if (validRows.length > 0) {
      await Surname.insertMany(validRows, { ordered: false });
    }

    return NextResponse.json({
      inserted: validRows.length,
      rejected: invalidRows.length,
      invalidRows,
      message: "Upload completed",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
