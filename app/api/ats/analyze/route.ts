import { NextRequest, NextResponse } from "next/server";
import { analyzeATS } from "@/lib/ai/ats-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvContent, jobDescription, jobTitle, language } = body;

    if (!cvContent || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: cvContent, jobDescription" },
        { status: 400 }
      );
    }

    const analysis = await analyzeATS(cvContent, jobDescription, jobTitle, language);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error analyzing ATS:", error);
    return NextResponse.json(
      { error: "Failed to analyze ATS" },
      { status: 500 }
    );
  }
}
