"use client";

import { useEffect, useRef } from "react";

interface SpotifyEmbedPlayerProps {
  trackId: string | null;
  hidden?: boolean;
}

export function SpotifyEmbedPlayer({
  trackId,
  hidden = false,
}: SpotifyEmbedPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!trackId || !iframeRef.current) return;

    // Reload the iframe with a new track to trigger autoplay
    // Note: Autoplay only works on first user interaction due to browser policies
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    iframeRef.current.src = embedUrl;
  }, [trackId]);

  if (!trackId) {
    return null;
  }

  // Spotify Embed URL that auto-plays
  // Use the proper compact embed format
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${hidden ? "hidden" : ""}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Player"
        className="rounded-lg shadow-lg"
        style={{ minWidth: "300px", maxWidth: "500px" }}
      />
    </div>
  );
}
