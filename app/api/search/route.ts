// ✅ Force Node.js runtime (MongoDB won't work on Edge)
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Surname from "@/lib/models/Surname";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const surnames = await Surname.find(
    {
      surname: { $regex: query, $options: "i" }, // contains search text
    },
    { surname: 1, _id: 0 }
  )
    .limit(8)
    .lean();

  return NextResponse.json(surnames);
}
