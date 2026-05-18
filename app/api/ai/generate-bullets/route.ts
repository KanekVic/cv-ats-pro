import { NextRequest, NextResponse } from "next/server";
import { generateBullets } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { position, company, industry, existingBullets, language } = body;

    if (!position || !company || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: position, company, industry" },
        { status: 400 }
      );
    }

    const bullets = await generateBullets(
      position,
      company,
      industry,
      existingBullets || [],
      language
    );

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("Error generating bullets:", error);
    return NextResponse.json(
      { error: "Failed to generate bullets" },
      { status: 500 }
    );
  }
}
