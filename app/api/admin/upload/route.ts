import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { parse } from "csv-parse/sync";

export const runtime = "nodejs"; // ✅ ensure proper streaming env

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const collection = db.collection("surnames");

    const validRows: any[] = [];
    const invalidRows: any[] = [];

    for (const r of records) {
      if (!r.surname || !r.meaning) {
        invalidRows.push({ ...r, reason: "Missing surname or meaning" });
        continue;
      }

      r.key = (r.key || r.surname.toLowerCase()).trim();
      r.certainty_score = parseInt(r.certainty_score || "50");
      r.added_at = new Date();

      validRows.push(r);
    }

    const result = await collection.insertMany(validRows, { ordered: false });

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount,
      invalidRows,
    });
  } catch (err: any) {
    console.error("❌ CSV Upload Error:", err);
    return NextResponse.json({ error: "Import failed", message: err.message }, { status: 500 });
  }
}
