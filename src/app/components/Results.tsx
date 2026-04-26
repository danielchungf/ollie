"use client";

import Image from "next/image";
import { Doc } from "../../../convex/_generated/dataModel";

type Tally = { boy: number; girl: number; total: number };

export function Results({
  tally,
  votes,
}: {
  tally: Tally;
  votes: Doc<"votes">[];
}) {
  const { boy, girl, total } = tally;
  const boyPct = total === 0 ? 0 : Math.round((boy / total) * 100);
  const girlPct = total === 0 ? 0 : 100 - boyPct;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <h2 className="h2 text-content-primary">Resultados</h2>
        <span className="body-small text-content-tertiary">
          {total} {total === 1 ? "apuesta" : "apuestas"}
        </span>
      </header>

      <div className="flex flex-col gap-4">
        <Bar guess="boy" label="Niño" count={boy} percent={boyPct} />
        <Bar guess="girl" label="Niña" count={girl} percent={girlPct} />
      </div>

      {votes.length > 0 && (
        <div className="grid grid-cols-2 gap-6 border-t border-border-secondary pt-6">
          <VoterColumn
            guess="boy"
            label="Niño"
            voters={votes.filter((v) => v.guess === "boy")}
          />
          <VoterColumn
            guess="girl"
            label="Niña"
            voters={votes.filter((v) => v.guess === "girl")}
          />
        </div>
      )}
    </section>
  );
}

function VoterColumn({
  guess,
  label,
  voters,
}: {
  guess: "boy" | "girl";
  label: string;
  voters: Doc<"votes">[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center gap-2 pb-2">
        <Image
          src={`/${guess}.webp`}
          alt={label}
          width={300}
          height={300}
          className="aspect-square w-full object-contain"
        />
        <span className="h2 text-content-primary">{label}</span>
      </div>
      <ul className="flex flex-col">
        {voters.length === 0 ? (
          <li className="body-small py-2 text-center text-content-quaternary">
            Sin apuestas
          </li>
        ) : (
          voters.map((vote) => (
            <li
              key={vote._id}
              className="border-b border-border-tertiary py-2 text-center last:border-b-0"
            >
              <span className="body-regular text-content-primary">
                {vote.name}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Bar({
  guess,
  label,
  count,
  percent,
}: {
  guess: "boy" | "girl";
  label: string;
  count: number;
  percent: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`/${guess}.webp`}
            alt={label}
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span className="h3 text-content-primary">{label}</span>
        </div>
        <span className="body-small text-content-tertiary">
          {count} ({percent}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className="h-full bg-content-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
