import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ success: false, message: "Missing ID" });

    const client = await clientPromise;
    const db = client.db("Surname_Project");

    await db.collection("contributions").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting contribution:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
