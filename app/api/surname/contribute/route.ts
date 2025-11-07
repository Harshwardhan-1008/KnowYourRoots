import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { surname, email, info } = body;

    // ✅ Validation
    if (!surname || !email || !info) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Surname_Project");

    // ✅ Insert into new "contributions" collection
    const result = await db.collection("contributions").insertOne({
      surname: surname.toLowerCase(),
      email,
      info,
      reviewed: false, // for admin dashboard
      createdAt: new Date(),
    });

    if (result.insertedId) {
      return NextResponse.json({
        success: true,
        message: "Contribution saved successfully!",
      });
    }

    return NextResponse.json(
      { success: false, message: "Failed to save contribution." },
      { status: 500 }
    );
  } catch (error) {
    console.error("❌ Error in contribute route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
