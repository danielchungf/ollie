"use client";

import { useState } from "react";
import Image from "next/image";

type Guess = "boy" | "girl";
type FieldError = { field: "name" | "guess"; message: string };

export function VoteForm({
  onSubmit,
  peekKeyword,
}: {
  onSubmit: (name: string, guess: Guess) => Promise<void>;
  peekKeyword?: string;
}) {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState<Guess | null>(null);
  const [error, setError] = useState<FieldError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError({ field: "name", message: "Por favor, escribe tu nombre." });
      return;
    }

    const isPeek =
      peekKeyword !== undefined &&
      trimmed.toLowerCase() === peekKeyword.toLowerCase();

    if (!isPeek && !guess) {
      setError({ field: "guess", message: "Elige niño o niña." });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(trimmed, guess ?? "boy");
    } catch (err) {
      setError({
        field: "name",
        message: err instanceof Error ? err.message : "Algo salió mal.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const nameErrored = error?.field === "name";
  const guessErrored = error?.field === "guess";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="h4 text-content-secondary">Tu nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Tío Danny"
          className={`rounded-lg border bg-bg-primary px-4 py-3 body-regular text-content-primary placeholder:text-content-quaternary outline-none focus:border-content-primary ${
            nameErrored ? "border-red-500" : "border-border-primary"
          }`}
          maxLength={60}
          autoComplete="name"
        />
        {nameErrored && (
          <p className="body-small text-red-600">{error?.message}</p>
        )}
      </label>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <GuessButton
            value="boy"
            label="Niño"
            selected={guess === "boy"}
            errored={guessErrored}
            onClick={() => setGuess("boy")}
          />
          <GuessButton
            value="girl"
            label="Niña"
            selected={guess === "girl"}
            errored={guessErrored}
            onClick={() => setGuess("girl")}
          />
        </div>
        {guessErrored && (
          <p className="body-small text-red-600">{error?.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-lg bg-bg-primary-action px-4 py-3 h3 text-content-on-action shadow-button transition-colors hover:bg-bg-primary-action-hover disabled:opacity-50"
      >
        {submitting ? "Confirmando…" : "Confirmar"}
      </button>
    </form>
  );
}

function GuessButton({
  value,
  label,
  selected,
  errored,
  onClick,
}: {
  value: Guess;
  label: string;
  selected: boolean;
  errored: boolean;
  onClick: () => void;
}) {
  const borderClass = errored
    ? "border-red-500"
    : selected
      ? "border-content-primary"
      : "border-border-primary";
  const bgClass = selected
    ? "bg-bg-tertiary"
    : "bg-bg-primary hover:bg-bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-1 overflow-hidden rounded-lg border transition-all ${borderClass} ${bgClass}`}
    >
      <Image
        src={`/${value}.webp`}
        alt={label}
        width={400}
        height={400}
        className="aspect-square w-full object-contain"
      />
      <span className="h2 pb-3 text-content-primary">{label}</span>
    </button>
  );
}
