import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { enrichSurnameRecord } from "@/lib/enrich";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rows } = body;
    if (!rows?.length) return NextResponse.json({ error: "No rows provided" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const collection = db.collection("surnames");

    const enrichedRows = [];
    for (const r of rows) {
      const enriched = await enrichSurnameRecord(r);
      enrichedRows.push(enriched);
    }

    const result = await collection.insertMany(enrichedRows, { ordered: false });

    return NextResponse.json({
      success: true,
      inserted: result.insertedCount,
    });
  } catch (err: any) {
    console.error("Commit error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
