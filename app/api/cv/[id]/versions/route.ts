import { NextRequest, NextResponse } from "next/server";
import { getCVVersions } from "@/lib/cv/versioning";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const versions = await getCVVersions(params.id);

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Error fetching CV versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}
