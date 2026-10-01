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
      { slug: "dalpassage-r9b4h7", kind: "step", eyebrow: "Teknisk oversigt · 03.1", title: "Rutenettet", body: "", nextSlug: "kurvesignal-k2f8d4" },
      { slug: "kurvesignal-k2f8d4", kind: "step", eyebrow: "Signalregistrering · 03.2", title: "Målekurve", body: "", nextSlug: "taagekant-v1s5p3", code: "skisko" },
      { slug: "taagekant-v1s5p3", kind: "final", eyebrow: "Gæstearkiv · Udvalgte år", title: "Liste over gæster", body: "Her finder du et udvalg af registrerede gæster fra de seneste år.", documentUrl: "/documents/fjeldro-gaesteliste.pdf", documentLabel: "Fjeldro · Liste over gæster" },
    ],
  },
  {
    id: 4,
    label: "Klippehytten",
    accent: "#547d8d",
    pages: [
      { slug: "klippevind-c6q2y9", kind: "start", eyebrow: "Ankomst til Fjeldro", title: "Turen fra stationen", body: "Fra stationen fører en stemningsfuld gåtur gennem landskabet og frem til resortet. Turen tager cirka 45 minutter i et roligt tempo.", nextSlug: "stenmaerke-f3u8l2", code: "pist" },
      { slug: "stenmaerke-f3u8l2", kind: "step", eyebrow: "Teknisk registrering · 04.1", title: "Segmentpanelet", body: "", nextSlug: "formarkiv-b8n4q6", code: "921" },
      { slug: "formarkiv-b8n4q6", kind: "step", eyebrow: "Formregistrering · 04.2", title: "Figurarkivet", body: "Tre markører danner den godkendte kontrolsekvens.", nextSlug: "skyggetop-k7d1z5" },
      { slug: "skyggetop-k7d1z5", kind: "final", eyebrow: "Teknisk dokumentation", title: "Vedligeholdelsesrapporter", body: "Her finder du de registrerede vedligeholdelsesrapporter for Fjeldro.", documentUrl: "/documents/fjeldro-vedligeholdelsesrapporter.pdf", documentLabel: "Fjeldro · Vedligeholdelsesrapporter" },
    ],
  },
  {
    id: 5,
    label: "Tindehytten",
    accent: "#244e67",
    pages: [
      { slug: "tindesne-h4m7r2", kind: "start", eyebrow: "Himlen mod nord", title: "votutv", body: "", nextSlug: "kamspor-w8p1c6", code: "aurora" },
      { slug: "kamspor-w8p1c6", kind: "step", eyebrow: "Feltregistrering · 05.1", title: "Skæringspunkter", body: "", nextSlug: "lyskreds-e3v7k5" },
      { slug: "lyskreds-e3v7k5", kind: "step", eyebrow: "Forbindelsesnet · 05.2", title: "Ruten gennem sekskanterne", body: "", nextSlug: "stillefjeld-n2g9a4" },
      { slug: "stillefjeld-n2g9a4", kind: "final", eyebrow: "Områdeoversigt", title: "Kort", body: "Her finder du kortet over området ved Fjeldro.", documentUrl: "/documents/fjeldro-kort.pdf", documentLabel: "Fjeldro · Kort" },
    ],
  },
];

export const allPages = tracks.flatMap((track) =>
  track.pages.map((page) => ({ ...page, track }))
);

export function findPage(slug: string) {
  return allPages.find((page) => page.slug === slug);
}
