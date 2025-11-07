import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { id, surname, info } = await req.json();
    if (!id || !surname || !info)
      return NextResponse.json({ success: false, message: "Missing data" });

    const client = await clientPromise;
    const db = client.db("Surname_Project");

    // ✅ Move to surnames collection
    await db.collection("surnames").updateOne(
      { key: surname.toLowerCase() },
      {
        $set: {
          surname: surname.toLowerCase(),
          description: info,
          verified: true,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // ✅ Mark as reviewed
    await db
      .collection("contributions")
      .updateOne({ _id: new ObjectId(id) }, { $set: { reviewed: true } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error approving contribution:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
