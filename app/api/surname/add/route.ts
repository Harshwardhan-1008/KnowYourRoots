import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { surname, email, paymentStatus } = await req.json();

    if (!surname || !email) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Here paymentStatus will be “paid” once Razorpay success comes later
    const client = await clientPromise;
    const db = client.db("Surname_Project");
    const pending = db.collection("pending_submissions");

    const exists = await pending.findOne({ surname: surname.toLowerCase() });
    if (exists) {
      return NextResponse.json({ success: false, message: "Surname already pending" });
    }

    await pending.insertOne({
      surname: surname.toLowerCase(),
      email,
      status: paymentStatus || "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Submission recorded" });
  } catch (err) {
    console.error("Error in /api/surname/add:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
