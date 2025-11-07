// app/api/surnames/coords/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const coll = db.collection("surnames");

    // Return only docs that have coordinates
    const docs = await coll
      .find(
        {
          place_lat: { $exists: true, $ne: null },
          place_lng: { $exists: true, $ne: null },
        },
        {
          projection: { key: 1, surname: 1, place_lat: 1, place_lng: 1, region: 1 },
        }
      )
      .toArray();

    // normalize lat/lng to numbers
    const data = docs.map((d) => ({
      key: d.key,
      surname: d.surname,
      lat: Number(d.place_lat),
      lng: Number(d.place_lng),
      region: d.region || null,
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error("Coords API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
