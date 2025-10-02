"use client";
import { MusicCard, PlaceCardButton, SpotifyEmbedPlayer } from "@/components";
import { Button } from "@/components/ui/button";
import { Fragment, useState, useEffect } from "react";
import {
  fetchPlaylist,
  convertTracksToGameCards,
  shuffleArray,
  logPreviewStats,
} from "@/lib/spotify-utils";

export type MusicCardType = {
  year: number;
  title: string;
  artist: string;
  spotifyId?: string;
};

type GameState = "placing" | "won" | "lost" | "idle";

export default function Page() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<GameState>("placing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [musicCards, setMusicCards] = useState<MusicCardType[]>([]);
  const [allTracks, setAllTracks] = useState<MusicCardType[]>([]);

  const [currentCard, setCurrentCard] = useState<MusicCardType | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch Spotify playlist data on component mount
  useEffect(() => {
    async function loadPlaylistData() {
      try {
        setLoading(true);
        const playlistId = "5mQVbkcILLiU2aqVOplsMy"; // Clean playlist ID
        const playlist = await fetchPlaylist(playlistId);

        // Convert Spotify tracks to MusicCardType
        const tracks: MusicCardType[] = convertTracksToGameCards(playlist);

        // Log preview statistics
        logPreviewStats(tracks, "All tracks");

        // Shuffle tracks for better gameplay variety
        const shuffledTracks = shuffleArray(tracks);

        // Sort first 4 tracks by year for initial timeline
        const initialCards = shuffledTracks
          .slice(0, 4)
          .sort((a, b) => a.year - b.year);

        setAllTracks(shuffledTracks);
        setMusicCards(initialCards);

        // Set a random track as the current card (not in initial timeline)
        const remainingTracks = shuffledTracks.slice(4);
        if (remainingTracks.length > 0) {
          const randomTrack =
            remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
          setCurrentCard(randomTrack);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load playlist"
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlaylistData();
  }, []);

  function generateNewCard() {
    // Get tracks not currently in the timeline
    const usedTracks = new Set(
      musicCards.map((card) => `${card.title}-${card.artist}`)
    );
    const availableTracks = allTracks.filter(
      (track) => !usedTracks.has(`${track.title}-${track.artist}`)
    );

    if (availableTracks.length > 0) {
      const randomTrack =
        availableTracks[Math.floor(Math.random() * availableTracks.length)];
      setCurrentCard(randomTrack);
      console.log(
        `Selected track: ${randomTrack.title} - ${randomTrack.artist}`
      );
    } else {
      // Fallback if no more tracks available
      setCurrentCard({
        year: Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950,
        title: "Random Song",
        artist: "Random Artist",
      });
    }
  }

  function placeCard(index: number, year: number) {
    if (!currentCard || gameState !== "placing") return;

    let success = false;

    if (index === 0) {
      if (musicCards.length === 0 || musicCards[0].year >= year) {
        success = true;
        setMusicCards([currentCard, ...musicCards]);
      }
    } else if (index === musicCards.length) {
      if (
        musicCards.length === 0 ||
        musicCards[musicCards.length - 1].year <= year
      ) {
        success = true;
        setMusicCards([...musicCards, currentCard]);
      }
    } else {
      if (
        musicCards[index - 1].year <= year &&
        musicCards[index].year >= year
      ) {
        const newCards = [...musicCards];
        newCards.splice(index, 0, currentCard);
        setMusicCards(newCards);
        success = true;
      }
    }

    setSuccess(success);
    setGameState("idle");
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Loading Spotify playlist...
          </h2>
          <p className="text-gray-600">Fetching tracks for your game</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold mb-2">Error loading playlist</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No tracks available</h2>
          <p className="text-gray-600">Unable to load tracks from playlist</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center gap-8 p-8">
      <section className="flex justify-center">
        {gameState === "placing" ? (
          <div className="flex flex-col items-center gap-4">
            <MusicCard musicCard={currentCard} hidden={true} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPlayer(!showPlayer)}
              className="opacity-75 hover:opacity-100"
            >
              {showPlayer ? "🎵 Hide Player" : "🎵 Play Song"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <MusicCard
              musicCard={currentCard}
              hidden={false}
              success={success}
            />
            <Button
              onClick={() => {
                setGameState("placing");
                generateNewCard();
                setShowPlayer(true);
              }}
            >
              Next Card
            </Button>
          </div>
        )}
      </section>
      <section
        id="timeline"
        className="flex items-center gap-4 mt-12 justify-center overflow-x-scroll"
      >
        <PlaceCardButton onClick={() => placeCard(0, currentCard.year)} />
        {musicCards.map((card) => (
          <Fragment key={card.year}>
            <MusicCard musicCard={card} hidden={false} />
            <PlaceCardButton
              onClick={() =>
                placeCard(musicCards.indexOf(card) + 1, currentCard.year)
              }
            />
          </Fragment>
        ))}
      </section>

      {/* Spotify Embed Player */}
      {showPlayer && currentCard?.spotifyId && (
        <SpotifyEmbedPlayer trackId={currentCard.spotifyId} hidden={false} />
      )}
    </main>
  );
}
