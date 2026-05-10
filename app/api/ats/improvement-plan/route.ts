import { NextRequest, NextResponse } from "next/server";
import { generateImprovementPlan } from "@/lib/ai/ats-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvContent, jobDescription, analysis, language } = body;

    if (!cvContent || !jobDescription || !analysis) {
      return NextResponse.json(
        { error: "Missing required fields: cvContent, jobDescription, analysis" },
        { status: 400 }
      );
    }

    const plan = await generateImprovementPlan(
      cvContent,
      jobDescription,
      analysis,
      language
    );

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error generating improvement plan:", error);
    return NextResponse.json(
      { error: "Failed to generate improvement plan" },
      { status: 500 }
    );
  }
}
