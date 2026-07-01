import { NextResponse } from "next/server";
import { getTVSeasonDetails } from "@/lib/tmdb";

interface Params {
  params: Promise<{ id: string; season_number: string }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const seasonNumber = parseInt(resolvedParams.season_number);
    const details = await getTVSeasonDetails(id, seasonNumber);
    return NextResponse.json(details);
  } catch (error) {
    console.error("API error fetching season details:", error);
    return NextResponse.json({ error: "Failed to fetch season details" }, { status: 500 });
  }
}
