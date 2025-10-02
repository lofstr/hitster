import type { SpotifyPlaylist, SpotifyTrack } from "@/types/spotify";

/**
 * Client-side utilities for working with Spotify data
 */

/**
 * Fetch a playlist from our API
 */
export async function fetchPlaylist(
  playlistId: string
): Promise<SpotifyPlaylist> {
  const response = await fetch(`/api/spotify/playlist/${playlistId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract release year from a Spotify track
 */
export function getTrackYear(track: SpotifyTrack): number {
  const releaseDate = track.album.release_date;
  return new Date(releaseDate).getFullYear();
}

/**
 * Convert Spotify playlist tracks to game cards format
 */
export function convertTracksToGameCards(playlist: SpotifyPlaylist) {
  const tracks = playlist.tracks.items
    .map((item) => item.track)
    .filter(
      (track): track is SpotifyTrack => track !== null && track.type === "track"
    )
    .map((track) => ({
      year: getTrackYear(track),
      title: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      spotifyId: track.id,
      previewUrl: track.preview_url,
      spotifyUri: track.uri,
    }));

  // Debug logging

  console.log(`Total tracks: ${tracks.length}`);

  return tracks;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Debug function to log preview availability
 */
export function logPreviewStats<
  T extends { previewUrl?: string | null; title: string; artist: string }
>(tracks: T[], label: string = "Tracks") {
  const withPreviews = tracks.filter((t) => t.previewUrl);
  const withoutPreviews = tracks.filter((t) => !t.previewUrl);

  console.log(`${label}:`);
  console.log(`  Total: ${tracks.length}`);
  console.log(
    `  With previews: ${withPreviews.length} (${Math.round(
      (withPreviews.length / tracks.length) * 100
    )}%)`
  );
  console.log(
    `  Without previews: ${withoutPreviews.length} (${Math.round(
      (withoutPreviews.length / tracks.length) * 100
    )}%)`
  );

  // Log some examples
  if (withoutPreviews.length > 0) {
    console.log(
      "Examples without previews:",
      withoutPreviews.slice(0, 3).map((t) => `${t.title} - ${t.artist}`)
    );
  }
}
