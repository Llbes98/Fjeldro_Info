"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CodeGate({ code, nextSlug }: { code: string; nextSlug: string }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = value.trim().toLocaleLowerCase("da-DK");
    if (normalized === code.toLocaleLowerCase("da-DK")) {
      setMessage("Korrekt — åbner næste side …");
      router.push(`/information/${nextSlug}`);
      return;
    }
    setMessage("Det stemmer ikke helt. Prøv igen.");
  }

  return (
    <div className="gate">
      <form onSubmit={submit}>
        <label className="gate__sentence" htmlFor="answer">hvis du vil navigere videre til en ny side, indtast hvilken her:</label>
        <div className="gate__row">
          <input id="answer" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" spellCheck="false" />
          <button type="submit">Fortsæt <span aria-hidden="true">→</span></button>
        </div>
      </form>
      <div className="gate__meta">
        <p className="gate__message" aria-live="polite">{message}</p>
      </div>
    </div>
  );
}
