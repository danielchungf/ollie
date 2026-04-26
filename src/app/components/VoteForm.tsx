"use client";

import { useState } from "react";
import Image from "next/image";

type Guess = "boy" | "girl";

export function VoteForm({
  onSubmit,
  peekKeyword,
}: {
  onSubmit: (name: string, guess: Guess) => Promise<void>;
  peekKeyword?: string;
}) {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState<Guess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Por favor, escribe tu nombre.");
      return;
    }

    const isPeek =
      peekKeyword !== undefined &&
      trimmed.toLowerCase() === peekKeyword.toLowerCase();

    if (!isPeek && !guess) {
      setError("Elige niño o niña.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(trimmed, guess ?? "boy");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="h4 text-content-secondary">Tu nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Tío Danny"
          className="rounded-lg border border-border-primary bg-bg-primary px-4 py-3 body-regular text-content-primary placeholder:text-content-quaternary outline-none focus:border-content-primary"
          maxLength={60}
          autoComplete="name"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <GuessButton
          value="boy"
          label="Niño"
          selected={guess === "boy"}
          onClick={() => setGuess("boy")}
        />
        <GuessButton
          value="girl"
          label="Niña"
          selected={guess === "girl"}
          onClick={() => setGuess("girl")}
        />
      </div>

      {error && (
        <p className="body-small text-content-secondary">{error}</p>
      )}

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
  onClick,
}: {
  value: Guess;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-1 overflow-hidden rounded-lg border transition-all ${
        selected
          ? "border-content-primary bg-bg-tertiary"
          : "border-border-primary bg-bg-primary hover:bg-bg-secondary"
      }`}
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
