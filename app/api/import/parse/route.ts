import { NextRequest, NextResponse } from "next/server";
import { parseDocument } from "@/lib/import/document-parser";
import { extractCVFromText } from "@/lib/ai/cv-extractor";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const language = formData.get("language") as string || "es";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Parse document to extract text
    const text = await parseDocument(file);

    // Extract structured data using AI
    const cvData = await extractCVFromText(text, language);

    return NextResponse.json({ cvData, rawText: text });
  } catch (error) {
    console.error("Error parsing document:", error);
    return NextResponse.json(
      { error: "Failed to parse document" },
      { status: 500 }
    );
  }
}
