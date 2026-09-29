import { notFound } from "next/navigation";
import { CodeGate } from "@/app/components/CodeGate";
import { FjeldroMark } from "@/app/components/FjeldroMark";
import { SnowScene } from "@/app/components/SnowScene";
import { RegistryPuzzle } from "@/app/components/RegistryPuzzle";
import { SignalLamps } from "@/app/components/SignalLamps";
import { ConstellationPuzzle } from "@/app/components/ConstellationPuzzle";
import { RadarRoute } from "@/app/components/RadarRoute";
import { allPages, findPage } from "@/lib/tracks";

const spaRules = [
  <>Vi beder alle gæster re<strong>s</strong>pektere den rolige stemning. Samtaler skal føres dæmpet, og mobiltelefoner skal være på lydløs under hele besøget.</>,
  <>Spaområdet er forbeholdt Fjeldros gæster. Dit adgangsbånd skal bæres synligt, så personalet nemt kan hjælpe dig ved behov.</>,
  <>Medbring badetøj og et rent hå<strong>n</strong>dklæde. Badekåber kan hentes ved receptionen og afleveres igen i de markerede kurve.</>,
  <>Tag altid et grundigt brusebad, inden du benytter områd<strong>e</strong>ts bassiner, saunaer og dampbad. Det hjælper os med at holde vandet rent.</>,
  <>Børn under 16 år skal være ledsaget af en voksen. Den voksne har ansvaret for barnet under hele opholdet i spaområdet.</>,
  <>Glas, med<strong>b</strong>ragt mad og egne drikkevarer må ikke tages med ind. Vand og lette forfriskninger kan fås i spaens lounge.</>,
  <>Af hensyn til sikkerheden må der ikke løbes, springes i bassinerne eller dykkes i de lave områder. Gulvene kan være glatte.</>,
  <>Vis hensyn til den fælles r<strong>o</strong>. Musik, videoopkald og fotografering af andre gæster er derfor ikke tilladt.</>,
  <>Efterlad a<strong>l</strong>drig tasker, sko eller andre ejendele på gangarealerne. Benyt skabene i omklædningsrummet, og husk at tømme dit skab efter besøget.</>,
  <>Sauna og dampbad bør benyttes i korte intervaller. Hold pause, drik vand, og kontakt personalet, hvis du føler dig utilpas.</>,
  <>Følg altid personalets anvisninger, og tag hensyn til an<strong>d</strong>re gæster. Ved gentagne overtrædelser kan personalet bede dig forlade området.</>,
];

const gridLetters = [..."QÆMTØAZWKÅRBÜPCXÉNYFJÄSLVGDÇOHŠIÑEUÞ"];

function buildRegistryGrid() {
  let letterIndex = 0;
  let seed = 48271;
  const nextDigit = () => {
    seed = (seed * 16807) % 2147483647;
    return seed % 10;
  };

  return Array.from({ length: 13 }, (_, rowIndex) =>
    Array.from({ length: 13 }, (_, columnIndex) => {
      const isLetter = rowIndex % 2 === 1 && columnIndex % 2 === 1;
      return isLetter ? gridLetters[letterIndex++] : String(nextDigit());
    })
  );
}

const registryGrid = buildRegistryGrid();

const skateMorse = ["...", "-.-", "---.", ".---", "-", "."];

function NatureMorsePanel() {
  return (
    <section className="nature-panel" aria-label="Om naturen omkring Fjeldro">
      <p>Rundt om Fjeldro åbner landskabet sig mellem høje bøgetræer, gamle graner og bløde bakker. Skoven skifter karakter gennem dagen: om morgenen ligger disen lavt mellem stammerne, mens sollyset senere finder vej gennem trækronerne og tegner lyse felter på skovbunden.</p>
      <p>Fra de høje skråninger fører små stier ned mod søen. Her ligger vandet som en rolig flade mellem bakkerne, og på stille dage spejler det både skoven og himlen. Langs bredden kan man høre vandet slå let mod sivene, mens fugle og vind bevæger sig gennem landskabet.</p>
      <p>Området er formet af istidens bevægelser og rummer både stejle stigninger, åbne lysninger og dybe skovpartier. Det gør hver tur forskellig. Én sti følger vandet tæt, en anden snor sig op gennem terrænet, hvor udsigten pludselig viser søen mellem træerne.</p>
      <p>Når mørket falder på, bliver lydene tydeligere. Grenene knager, ugler kalder på tværs af skoven, og små ringe breder sig på søens overflade. Selv tæt på hytterne føles naturen stor, stille og næsten helt uforstyrret.</p>
      <p>Vi beder alle gæster om at passe godt på området. Bliv på de anlagte stier, tag affald med tilbage, og giv både dyr og planter den nødvendige ro. Så kan landskabet omkring Fjeldro fortsat være et sted, hvor man kan sænke tempoet og mærke naturen helt tæt på.</p>
      <div className="morse-edge" aria-hidden="true">
        {skateMorse.map((letter, letterIndex) => (
          <span className="morse-letter" key={letterIndex}>
            {[...letter].map((symbol, symbolIndex) => (
              <i className={symbol === "." ? "morse-dot" : "morse-dash"} key={symbolIndex} />
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return allPages.map(({ slug }) => ({ slug }));
}

export default async function InformationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();
  const isRestricted = page.slug === "gransti-q4v8n1" || page.slug === "signalkammer-t5x9v2";
  const isConstellationPage = page.slug === "snebro-j2c7t4";
  const isRadarPage = page.slug === "radarsignal-c4m8q1";
  const documentUrl = page.documentUrl ?? "/documents/fjeldro-deltagerbrev.pdf";
  const documentLabel = page.documentLabel ?? "Fjeldro · Deltagerinformation";

  return (
    <main className={`public-shell ${isRestricted ? "restricted-shell" : ""} ${isConstellationPage || isRadarPage ? "celestial-shell" : ""}`}>
      <SnowScene />
      <header className="site-header"><FjeldroMark compact /></header>
      <article className={`content-card ${page.kind === "final" ? "content-card--document" : ""} ${isRestricted ? "content-card--restricted" : ""} ${isConstellationPage || isRadarPage ? "content-card--celestial" : ""}`} style={{ "--accent": page.track.accent } as React.CSSProperties}>
        <div className="track-number">{String(page.track.id).padStart(2, "0")}</div>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        {page.body && <p className="lead">{page.body}</p>}
        {page.slug === "nordlys-f7k2m9" && (
          <section className="rules-panel" aria-label="Regler for Fjeldros spaområde">
            <div className="rules-panel__intro">
              <h2>Inden dit besøg</h2>
              <p>Der er adgang til spaområdet fra kl. 07.00 til 22.00. De mest stille tidspunkter er typisk om morgenen og efter kl. 19.00. Vi anbefaler, at du afsætter god tid og drikker vand både før og efter dit besøg.</p>
            </div>
            <h2>Regler i spaområdet</h2>
            <ol>
              {spaRules.map((rule, index) => <li key={index}>{rule}</li>)}
            </ol>
            <p className="rules-note">Tak, fordi du hjælper os med at bevare roen på Fjeldro.</p>
          </section>
        )}
        {page.slug === "gransti-q4v8n1" && (
          <section className="registry" aria-labelledby="registry-heading">
            <div className="registry__header">
              <div>
                <span className="registry__status"><i /> Begrænset område</span>
                <h2 id="registry-heading">Register 13—13</h2>
              </div>
              <span className="registry__id">FR–01 / 271</span>
            </div>
            <RegistryPuzzle grid={registryGrid} />
            <div className="registry__footer"><span>169 datapunkter</span><span>Kontrolstatus: afventer</span></div>
          </section>
        )}
        {page.slug === "signalkammer-t5x9v2" && <SignalLamps />}
        {page.slug === "frostlinje-p8d3w5" && <NatureMorsePanel />}
        {isConstellationPage && page.nextSlug && <ConstellationPuzzle nextSlug={page.nextSlug} />}
        {isRadarPage && <RadarRoute />}
        {page.kind !== "final" && page.nextSlug && page.code && !isConstellationPage && (
          <CodeGate code={page.code} nextSlug={page.nextSlug} />
        )}
        {page.kind === "final" && (
          <section className="document-panel">
            <div className="document-panel__bar">
              <span>{documentLabel}</span>
              <a href={documentUrl} target="_blank" rel="noreferrer">Åbn i nyt vindue ↗</a>
            </div>
            <iframe title={documentLabel} src={`${documentUrl}#view=FitH`} />
          </section>
        )}
      </article>
    </main>
  );
}
