import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const data = await db
      .collection("contributions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error fetching contributions:", err);
    return NextResponse.json([], { status: 500 });
  }
}