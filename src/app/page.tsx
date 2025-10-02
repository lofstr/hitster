import { MusicCard } from "@/components/musicCard";

const musicCardYears = [1967, 2000, 1999, 1987, 2002, 1964, 1997, 2005, 2012];
export default function Page() {
  return (
    <main className="flex flex-col  justify-center gap-8 p-8">
      <section className="flex justify-center ">
        <MusicCard year={2024} />
      </section>
      <section id="timeline" className="flex items-center gap-4 mt-12">
        {musicCardYears.map((year) => (
          <MusicCard key={year} year={year} />
          <InsertButton></InsertButton>
        ))}
      </section>
    </main>
  );
}
