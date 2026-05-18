import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experience, industry, language } = body;

    if (!experience || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: experience, industry" },
        { status: 400 }
      );
    }

    const summary = await generateSummary(experience, industry, language);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
