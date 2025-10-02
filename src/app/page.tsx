"use client";
import { MusicCard, PlaceCardButton } from "@/components";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";

export type MusicCardType = {
  year: number;
  title: string;
  artist: string;
};

type GameState = "placing" | "won" | "lost" | "idle";

export default function Page() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<GameState>("placing");
  const initialCards: MusicCardType[] = [
    { year: 1967, title: "Purple Haze", artist: "Jimi Hendrix" },
    { year: 1987, title: "With or Without You", artist: "U2" },
    { year: 1999, title: "No Scrubs", artist: "TLC" },
    { year: 2000, title: "Stan", artist: "Eminem" },
  ];

  const [musicCards, setMusicCards] = useState<MusicCardType[]>(initialCards);

  const [currentCard, setCurrentCard] = useState<MusicCardType>({
    year: 2024,
    title: "Title",
    artist: "Artist",
  });

  function generateNewCard() {
    setCurrentCard({
      year: Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950,
      title: "New Title",
      artist: "New Artist",
    });
  }

  function placeCard(index: number, year: number) {
    if (index === 0) {
      if (musicCards[0].year >= year) {
        setSuccess(true);
        setMusicCards([
          { year, title: "New Title", artist: "New Artist" },
          ...musicCards,
        ]);
      }
    } else if (index === musicCards.length) {
      if (musicCards[musicCards.length - 1].year <= year) {
        setSuccess(true);
        setMusicCards([
          ...musicCards,
          { year, title: "New Title", artist: "New Artist" },
        ]);
      }
    } else {
      if (
        musicCards[index - 1].year <= year &&
        musicCards[index].year >= year
      ) {
        const newCards = [...musicCards];
        newCards.splice(index, 0, {
          year,
          title: "New Title",
          artist: "New Artist",
        });
        setMusicCards(newCards);
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    }
    setGameState("idle");
  }

  return (
    <main className="flex flex-col justify-center gap-8 p-8">
      <section className="flex justify-center">
        {gameState === "placing" ? (
          <MusicCard musicCard={currentCard} hidden={true} />
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
    </main>
  );
}
