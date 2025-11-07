import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // ✅ unwrap Promise
    const key = slug.toLowerCase();

    const client = await clientPromise;
    const db = client.db("Surname_Project"); // change name if needed
    const collection = db.collection("surnames");

    const doc = await collection.findOne({ key });

    if (!doc) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    // remove Mongo _id
    const { _id, ...data } = doc;

    return NextResponse.json({ found: true, data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching surname:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
