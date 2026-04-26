"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { VoteForm } from "./components/VoteForm";
import { Results } from "./components/Results";

const PEEK_KEYWORD = "verresultados";

type View =
  | { mode: "form" }
  | { mode: "voted"; name: string }
  | { mode: "peek" };

export default function Home() {
  const tally = useQuery(api.votes.tally);
  const votes = useQuery(api.votes.list);
  const cast = useMutation(api.votes.cast);
  const remove = useMutation(api.votes.remove);

  const [view, setView] = useState<View>({ mode: "form" });

  if (tally === undefined || votes === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="body-small text-content-tertiary">Cargando…</p>
      </main>
    );
  }

  const handleRemove = async (id: Id<"votes">) => {
    await remove({ id, secret: PEEK_KEYWORD });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col gap-10">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="h1 text-content-primary">Ollie — ¿niño o niña?</h1>
          <p className="body-regular text-content-secondary">
            Haz tu apuesta.
          </p>
        </header>

        {view.mode === "form" && (
          <VoteForm
            peekKeyword={PEEK_KEYWORD}
            onSubmit={async (name, guess) => {
              if (name.toLowerCase() === PEEK_KEYWORD) {
                setView({ mode: "peek" });
                return;
              }
              await cast({ name, guess });
              setView({ mode: "voted", name });
            }}
          />
        )}

        {view.mode === "voted" && (
          <>
            <p className="body-regular text-center text-content-secondary">
              ¡Gracias, {view.name}! Ya tenemos tu apuesta.
            </p>
            <Results tally={tally} votes={votes} />
          </>
        )}

        {view.mode === "peek" && (
          <Results tally={tally} votes={votes} onRemove={handleRemove} />
        )}
      </div>
    </main>
  );
}
