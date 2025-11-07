import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();
    const records = parse(text, { columns: true, skip_empty_lines: true, trim: true });

    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const collection = db.collection("surnames");

    const preview: any[] = [];
    for (const r of records) {
      const warnings: string[] = [];
      const errors: string[] = [];

      if (!r.surname || !r.meaning) errors.push("Missing surname or meaning");
      if (!r.origin_type) warnings.push("Origin type missing");
      if (!r.source_urls) warnings.push("No sources provided");

      const key = (r.key || r.surname.toLowerCase()).trim();
      const exists = await collection.findOne({ key });
      if (exists) warnings.push("Duplicate (already exists)");

      preview.push({
        ...r,
        key,
        status: errors.length ? "invalid" : "valid",
        warnings,
        errors,
      });
    }

    return NextResponse.json({
      success: true,
      preview: preview.slice(0, 100),
      total: records.length,
    });
  } catch (err: any) {
    console.error("Preview error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
