import { NextRequest, NextResponse } from "next/server";
import { restoreCVVersion } from "@/lib/cv/versioning";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const version = await restoreCVVersion(params.versionId);

    return NextResponse.json({ version });
  } catch (error) {
    console.error("Error restoring CV version:", error);
    return NextResponse.json(
      { error: "Failed to restore version" },
      { status: 500 }
    );
  }
}
