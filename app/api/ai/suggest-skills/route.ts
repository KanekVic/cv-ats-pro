import { NextRequest, NextResponse } from "next/server";
import { suggestSkills } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry, position, experience, language } = body;

    if (!industry || !position) {
      return NextResponse.json(
        { error: "Missing required fields: industry, position" },
        { status: 400 }
      );
    }

    const skills = await suggestSkills(
      industry,
      position,
      experience || "",
      language
    );

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return NextResponse.json(
      { error: "Failed to suggest skills" },
      { status: 500 }
    );
  }
}
