import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all surnames
export async function GET() {
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const data = await db.collection("surnames").find().toArray();
  return NextResponse.json(data);
}

// POST new surname
export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const result = await db.collection("surnames").insertOne(body);
  return NextResponse.json(result);
}

// PUT (update)
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const result = await db
    .collection("surnames")
    .updateOne({ _id: new ObjectId(id!) }, { $set: body });
  return NextResponse.json(result);
}

// DELETE
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const result = await db.collection("surnames").deleteOne({ _id: new ObjectId(id!) });
  return NextResponse.json(result);
}
