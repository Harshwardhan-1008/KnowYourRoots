import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Surname from "@/lib/models/Surname";

export const runtime = "nodejs";

type UploadRecord = {
  surname: string;
  shortSummary?: string;
  description?: string;
  origin?: string;
  published?: boolean;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const json = await req.json();

    if (!Array.isArray(json)) {
      return NextResponse.json(
        { error: "Invalid JSON format. Expected an array." },
        { status: 400 }
      );
    }

    // ✅ Force type so TS never marks any item as "unknown"
    const records = json as UploadRecord[];

    const invalidRows: any[] = [];
    const validRows: UploadRecord[] = [];

    for (const r of records) {
      if (!r.surname || !r.description) {
        invalidRows.push({ ...r, reason: "Missing surname or description" });
        continue;
      }

      validRows.push({
        surname: r.surname,
        shortSummary: r.shortSummary || "",
        description: r.description || "",
        origin: r.origin || "Unknown",
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
