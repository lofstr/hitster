"use client";
import { MusicCard, PlaceCardButton } from "@/components";
import { useState } from "react";

export default function Page() {
  const [musicCardYears, setMusicCardYears] = useState([
    1967, 1987, 1999, 2000,
  ]);
  const [currentCard, setCurrentCard] = useState(2024);

  function placeCard(index: number, year: number) {
    if (index === 0) {
      if (musicCardYears[0] >= year) {
        setMusicCardYears([year, ...musicCardYears]);
        setCurrentCard(Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950);
      }
    } else if (index === musicCardYears.length) {
      if (musicCardYears[musicCardYears.length - 1] <= year) {
        setMusicCardYears([...musicCardYears, year]);
        setCurrentCard(Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950);
      }
    } else {
      if (musicCardYears[index - 1] <= year && musicCardYears[index] >= year) {
        const newYears = [...musicCardYears];
        newYears.splice(index, 0, year);
        setMusicCardYears(newYears);
        setCurrentCard(Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950);
      }
    }
  }

  return (
    <main className="flex flex-col justify-center gap-8 p-8">
      <section className="flex justify-center">
        <MusicCard year={currentCard} />
      </section>
      <section
        id="timeline"
        className="flex items-center gap-4 mt-12 justify-center overflow-x-scroll"
      >
        <PlaceCardButton onClick={() => placeCard(0, currentCard)} />
        {musicCardYears.map((year) => (
          <>
            <MusicCard key={year} year={year} />
            <PlaceCardButton
              onClick={() =>
                placeCard(musicCardYears.indexOf(year) + 1, currentCard)
              }
            />
          </>
        ))}
      </section>
    </main>
  );
}
