import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/ai/cover-letter";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, position, jobDescription, experience, skills, tone, language } = body;

    if (!fullName || !company || !position || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, company, position, jobDescription" },
        { status: 400 }
      );
    }

    const coverLetter = await generateCoverLetter({
      fullName,
      email: email || "",
      phone: phone || "",
      company,
      position,
      jobDescription,
      experience: experience || "",
      skills: skills || [],
      tone: tone || "professional",
      language: language || "es",
    });

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
