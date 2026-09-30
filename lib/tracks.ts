export type TrackPage = {
  slug: string;
  kind: "start" | "step" | "final";
  eyebrow: string;
  title: string;
  body: string;
  nextSlug?: string;
  code?: string;
  documentUrl?: string;
  documentLabel?: string;
};

export type Track = {
  id: number;
  label: string;
  accent: string;
  pages: TrackPage[];
};

export const tracks: Track[] = [
  {
    id: 1,
    label: "Nordhytten",
    accent: "#477f9b",
    pages: [
      { slug: "nordlys-f7k2m9", kind: "start", eyebrow: "Fjeldro Spa", title: "Ro og velvære i fjeldet", body: "Spaområdet er skabt som et roligt fristed efter en dag i sneen. Her finder du de praktiske retningslinjer, som hjælper os med at give alle gæster en behagelig oplevelse.", nextSlug: "gransti-q4v8n1", code: "snebold" },
      { slug: "gransti-q4v8n1", kind: "step", eyebrow: "Intern registrering · 01.1", title: "Adgang begrænset", body: "Denne oversigt er ikke en del af Fjeldros gæsteinformation. Kontrollér registreringen, før du fortsætter.", nextSlug: "signalkammer-t5x9v2", code: "91793" },
      { slug: "signalkammer-t5x9v2", kind: "step", eyebrow: "Intern signalstation · 01.2", title: "Signalkammer", body: "Signalstationen sender en fast sekvens gennem otte kredsløb. Observer transmissionen, før du fortsætter.", nextSlug: "udsigt-b6r3x0", code: "lavine" },
      { slug: "udsigt-b6r3x0", kind: "final", eyebrow: "Officiel transportinformation", title: "Transport til og fra Fjeldro", body: "Her finder du den officielle transportplan for ankomst og afrejse.", documentUrl: "/documents/fjeldro-transportplan.pdf", documentLabel: "Fjeldro · Officiel transportplan" },
    ],
  },
  {
    id: 2,
    label: "Isbræhytten",
    accent: "#6e9fb6",
    pages: [
      { slug: "frostlinje-p8d3w5", kind: "start", eyebrow: "Naturen omkring Fjeldro", title: "Mellem skov og sø", body: "", nextSlug: "snebro-j2c7t4", code: "skøjte" },
      { slug: "snebro-j2c7t4", kind: "step", eyebrow: "Observatorium · 02.1", title: "Stjerner over Fjeldro", body: "", nextSlug: "radarsignal-c4m8q1" },
      { slug: "radarsignal-c4m8q1", kind: "step", eyebrow: "Navigationssignal · 02.2", title: "Rutesignal", body: "", nextSlug: "hvidkam-m5a9e2", code: "bjergtop" },
      { slug: "hvidkam-m5a9e2", kind: "final", eyebrow: "Dokumentation · Betalt", title: "Betalte fakturaer", body: "Her finder du dokumentationen for de registrerede og betalte fakturaer.", documentUrl: "/documents/fjeldro-betalte-fakturaer.pdf", documentLabel: "Fjeldro · Betalte fakturaer" },
    ],
  },
  {
    id: 3,
    label: "Fyrrehytten",
    accent: "#315f77",
    pages: [
      { slug: "fyrrespor-x3n6k8", kind: "start", eyebrow: "Faciliteter på Fjeldro", title: "Alt til opholdet", body: "På Fjeldro finder du alt det, der gør dagene på fjeldet både behagelige, varme og fulde af oplevelser.", nextSlug: "dalpassage-r9b4h7", code: "538" },
      { slug: "dalpassage-r9b4h7", kind: "step", eyebrow: "Teknisk oversigt · 03.1", title: "Rutenettet", body: "", nextSlug: "taagekant-v1s5p3" },
      { slug: "taagekant-v1s5p3", kind: "final", eyebrow: "Dokument 03", title: "Information til Fyrrehytten", body: "Dokumentet er klar til dig." },
    ],
  },
  {
    id: 4,
    label: "Klippehytten",
    accent: "#547d8d",
    pages: [
      { slug: "klippevind-c6q2y9", kind: "start", eyebrow: "Ophold 04", title: "Velkommen til Klippehytten", body: "Et ophold i fjeldet kræver det rette udstyr. Skriv det, du selv skal kunne gå med.", nextSlug: "stenmærke-f3u8l2", code: "taske" },
      { slug: "stenmærke-f3u8l2", kind: "step", eyebrow: "Information 04.1", title: "Mærket i stenen", body: "Din reservation gælder i et bestemt antal dage. Skriv antallet med bogstaver.", nextSlug: "skyggetop-k7d1z5", code: "syv" },
      { slug: "skyggetop-k7d1z5", kind: "final", eyebrow: "Dokument 04", title: "Information til Klippehytten", body: "Dokumentet er klar til dig." },
    ],
  },
  {
    id: 5,
    label: "Tindehytten",
    accent: "#244e67",
    pages: [
      { slug: "tindesne-h4m7r2", kind: "start", eyebrow: "Ophold 05", title: "Velkommen til Tindehytten", body: "De sidste forberedelser venter. Skriv det måltid, du skal medbringe til den første dag.", nextSlug: "kamspor-w8p1c6", code: "madpakke" },
      { slug: "kamspor-w8p1c6", kind: "step", eyebrow: "Information 05.1", title: "Sporet langs kammen", body: "Hvilken ugedag begynder opholdet? Skriv dagen for at få adgang til dokumentet.", nextSlug: "stillefjeld-n2g9a4", code: "søndag" },
      { slug: "stillefjeld-n2g9a4", kind: "final", eyebrow: "Dokument 05", title: "Information til Tindehytten", body: "Dokumentet er klar til dig." },
    ],
  },
];

export const allPages = tracks.flatMap((track) =>
  track.pages.map((page) => ({ ...page, track }))
);

export function findPage(slug: string) {
  return allPages.find((page) => page.slug === slug);
}
