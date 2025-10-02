import type {
  SpotifyTokenResponse,
  SpotifyPlaylist,
  SpotifyError,
} from "@/types/spotify";

/**
 * Spotify API Client
 * Handles authentication and API calls to Spotify Web API
 */
export class SpotifyApi {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || "";
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";

    if (!this.clientId || !this.clientSecret) {
      throw new Error("Spotify credentials not found in environment variables");
    }
  }

  /**
   * Get access token using Client Credentials flow (for public data)
   * @returns Access token
   */
  async getClientCredentialsToken(): Promise<string> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get client credentials token: ${response.statusText}`
      );
    }

    const tokenData: SpotifyTokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

    return tokenData.access_token;
  }

  /**
   * Refresh the access token using refresh token
   * @returns New access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const tokenData: SpotifyTokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

    if (tokenData.refresh_token) {
      this.refreshToken = tokenData.refresh_token;
    }

    return tokenData.access_token;
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureValidToken(): Promise<void> {
    if (
      !this.accessToken ||
      !this.tokenExpiresAt ||
      Date.now() >= this.tokenExpiresAt
    ) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        // For client credentials flow, get a new token
        await this.getClientCredentialsToken();
      }
    }
  }

  /**
   * Make authenticated request to Spotify API
   */
  private async spotifyRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.ensureValidToken();

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: SpotifyError = await response.json();
      throw new Error(`Spotify API Error: ${errorData.error.message}`);
    }

    return response.json();
  }

  /**
   * Get a playlist by ID
   * @param playlistId - Spotify playlist ID
   * @returns Playlist data
   */
  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    return this.spotifyRequest<SpotifyPlaylist>(`/playlists/${playlistId}`);
  }

  /**
   * Get playlist tracks
   * @param playlistId - Spotify playlist ID
   * @param limit - Number of tracks to return (default: 50, max: 100)
   * @param offset - The index of the first track to return
   * @returns Playlist tracks
   */
  async getPlaylistTracks(
    playlistId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return this.spotifyRequest(
      `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Search for tracks, artists, albums, or playlists
   * @param query - Search query
   * @param type - Type of search (track, artist, album, playlist)
   * @param limit - Number of results to return
   * @returns Search results
   */
  async search(query: string, type: string = "track", limit: number = 20) {
    const encodedQuery = encodeURIComponent(query);
    return this.spotifyRequest(
      `/search?q=${encodedQuery}&type=${type}&limit=${limit}`
    );
  }

  /**
   * Get multiple tracks by IDs
   * @param trackIds - Array of Spotify track IDs
   * @returns Tracks data
   */
  async getTracks(trackIds: string[]) {
    const ids = trackIds.join(",");
    return this.spotifyRequest(`/tracks?ids=${ids}`);
  }

  /**
   * Set access token manually (useful for server-side operations)
   */
  setAccessToken(token: string, expiresIn?: number): void {
    this.accessToken = token;
    if (expiresIn) {
      this.tokenExpiresAt = Date.now() + expiresIn * 1000;
    }
  }

  /**
   * Set refresh token manually
   */
  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }
}

// Export a singleton instance
export const spotifyApi = new SpotifyApi();
