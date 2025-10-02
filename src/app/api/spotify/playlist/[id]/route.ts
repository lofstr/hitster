import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { spotifyApi } from "@/lib/spotify";

/**
 * GET /api/spotify/playlist/[id]
 * Fetch a Spotify playlist by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playlistId = params.id;

    if (!playlistId) {
      return NextResponse.json(
        { error: "Playlist ID is required" },
        { status: 400 }
      );
    }

    // Get playlist data
    const playlist = await spotifyApi.getPlaylist(playlistId);

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}
