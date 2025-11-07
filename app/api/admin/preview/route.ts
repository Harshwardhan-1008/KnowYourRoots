import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const records = await req.json();

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid JSON format — expected an array of objects" },
        { status: 400 }
      );
    }

    const validatedOutput = records.map((item: any) => {
      const r = item as any; // allow dynamic input
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!r.surname || !r.shortSummary || !r.description || !r.origin) {
        errors.push("Required fields missing (surname, shortSummary, description, origin)");
      }

      if (!r.published) warnings.push("Record is not marked as published");
      if (!r.key) warnings.push("Missing key field");

      return {
        data: r,
        errors,
        warnings,
      };
    });

    return NextResponse.json(
      {
        message: "Validation complete",
        previewCount: validatedOutput.length,
        result: validatedOutput,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON — failed to parse" },
      { status: 500 }
    );
  }
}
