import { notFound } from "next/navigation";
import Image from "next/image";
import { CodeGate } from "@/app/components/CodeGate";
import { FjeldroMark } from "@/app/components/FjeldroMark";
import { SnowScene } from "@/app/components/SnowScene";
import { RegistryPuzzle } from "@/app/components/RegistryPuzzle";
import { SignalLamps } from "@/app/components/SignalLamps";
import { ConstellationPuzzle } from "@/app/components/ConstellationPuzzle";
import { RadarRoute } from "@/app/components/RadarRoute";
import { RouteSwapPuzzle } from "@/app/components/RouteSwapPuzzle";
import { MorseGraph } from "@/app/components/MorseGraph";
import { SlidingSegmentMask } from "@/app/components/SlidingSegmentMask";
import { ShapeSelectionPuzzle } from "@/app/components/ShapeSelectionPuzzle";
import { CornerCountPuzzle } from "@/app/components/CornerCountPuzzle";
import { HexRouteCode } from "@/app/components/HexRouteCode";
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

const facilities = [
  {
    title: "Café og samlingssted",
    text: "I Fjeldros café kan du begynde dagen med noget varmt, finde en rolig plads mellem turene og samles med de andre gæster, når dagens oplevelser skal deles.",
  },
  {
    title: "Værelser med fjeldro",
    text: "De hyggelige værelser er indrettet med god plads til både afslapning og udstyr. Her kan du trække dig tilbage, få varmen og vågne klar til en ny dag.",
  },
  {
    title: "Spa og sauna",
    text: "Efter timer i den friske luft venter spaområdet og den varme sauna. Området er skabt til rolige stunder, ømme ben og ny energi.",
  },
  {
    title: "Tørrekælder",
    text: "Vådt overtøj, støvler og handsker kan hænges i tørrekælderen, så udstyret er tørt og klar, når turen fortsætter næste morgen.",
  },
  {
    title: "Skipister og vinterspor",
    text: "Omkring Fjeldro ligger både brede pister og mindre spor gennem landskabet. Der er muligheder for fart, udsigt og ture i et roligere tempo.",
  },
];

function PatternBanner({ pattern }: { pattern: "crescents" | "steps" | "rings" }) {
  return (
    <div className={`facility-banner facility-banner--${pattern}`} aria-hidden="true">
      {Array.from({ length: pattern === "rings" ? 8 : 9 }, (_, index) => <i key={index} />)}
    </div>
  );
}

function FacilitiesPanel() {
  return (
    <section className="facilities-panel" aria-label="Faciliteter på Fjeldro">
      <PatternBanner pattern="crescents" />
      <div className="facilities-panel__intro">
        <h2>Et sted til hele dagen</h2>
        <p>Uanset om dagen står på lange ture, høj fart eller afslapning indenfor, er Fjeldros faciliteter samlet tæt på hinanden. Du kan gå direkte fra sne og kulde til varme rum, god mad og tid til at falde til ro.</p>
      </div>

      <PatternBanner pattern="steps" />
      <div className="facility-list">
        {facilities.map((facility, index) => (
          <article className="facility-item" key={facility.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{facility.title}</h3>
              <p>{facility.text}</p>
            </div>
          </article>
        ))}
      </div>

      <PatternBanner pattern="rings" />
      <div className="facility-colour-code" aria-hidden="true">
        <i className="facility-colour-code__field facility-pattern--steps" />
        <i className="facility-colour-code__field facility-pattern--crescents" />
        <i className="facility-colour-code__field facility-pattern--rings" />
        <i className="facility-colour-code__field facility-pattern--crescents" />
        <i className="facility-colour-code__field facility-pattern--crescents" />
        <i className="facility-colour-code__field facility-pattern--rings" />
      </div>
    </section>
  );
}

function WalkCipher() {
  return (
    <Image
      className="walk-cipher"
      src="/images/fjeldro-traeer.svg"
      width={2481}
      height={317}
      alt="Træer og snefnug langs skovbrynet"
      unoptimized
    />
  );
}

function StationWalkPanel() {
  return (
    <section className="station-walk" aria-label="Gåturen fra stationen til Fjeldro">
      <div className="station-walk__facts">
        <span><strong>Ca. 45 min.</strong> til fods</span>
        <span><strong>Rolig rute</strong> gennem skov og åbent landskab</span>
      </div>
      <div className="station-walk__text">
        <h2>Den første del af opholdet</h2>
        <p>Når toget har forladt perronen, bliver lydene fra stationen hurtigt svagere. Vejen begynder roligt og fører videre mod skoven, hvor granerne står tættere, og sneen dæmper hvert skridt.</p>
        <p>Undervejs skifter ruten mellem små skovpartier og åbne stræk med udsigt til de omkringliggende bakker. På klare dage kan man ane fjeldet længere fremme, mens lysene fra Fjeldro langsomt dukker op mellem træerne.</p>
        <p>Stien er afmærket hele vejen. Beregn cirka 45 minutter, gå i et behageligt tempo, og brug turen til at lade rejsen falde til ro, inden du når resortet.</p>
      </div>
    </section>
  );
}

function NorthernLightsPanel() {
  return (
    <section className="northern-lights-panel" aria-label="Information om nordlys">
      <div className="northern-lights-panel__sky" aria-hidden="true">
        <i /><i /><i />
        <span>Nord · 00:00–03:00</span>
      </div>
      <div className="northern-lights-panel__text">
        <h2>Lys over fjeldet</h2>
        <p>På klare aftener kan mørket over <strong>Fjeldro</strong> blive brudt af lange bånd af grønt, blåt og violet lys. De bevæger sig langsomt hen over himlen og kan på få minutter skifte fra en svag glød til tydelige bølger mellem stjernerne.</p>
        <p>Nordlys opstår, når energirige partikler fra solen møder gasser højt oppe i Jordens atmosfære. Farven afhænger blandt andet af, hvilke gasser partiklerne rammer, og hvor højt over jordoverfladen lyset dannes.</p>
        <p>Omkring <strong>Fjeldro</strong> er udsigten bedst på kolde, skyfrie nætter, hvor luften er tør, og kunstigt lys ikke overdøver himlen. Kig mod nord, og giv øjnene tid til at vænne sig til mørket.</p>
        <p>Fra de åbne områder ved <strong>Fjeldro</strong> kan lyset ofte ses fra sen aften og ind i nattens første timer. Tag varmt tøj på, hold afstand til markerede vinterspor, og brug gerne en svag lygte på vej tilbage.</p>
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
  const isRoutePuzzlePage = page.slug === "dalpassage-r9b4h7";
  const documentUrl = page.documentUrl ?? "/documents/fjeldro-deltagerbrev.pdf";
  const documentLabel = page.documentLabel ?? "Fjeldro · Deltagerinformation";

  return (
    <main className={`public-shell ${isRestricted ? "restricted-shell" : ""} ${isConstellationPage || isRadarPage ? "celestial-shell" : ""} ${page.slug === "klippevind-c6q2y9" ? "walk-shell" : ""}`}>
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
        {page.slug === "fyrrespor-x3n6k8" && <FacilitiesPanel />}
        {isRoutePuzzlePage && page.nextSlug && <RouteSwapPuzzle nextSlug={page.nextSlug} />}
        {page.slug === "kurvesignal-k2f8d4" && <MorseGraph />}
        {page.slug === "klippevind-c6q2y9" && <StationWalkPanel />}
        {page.slug === "stenmaerke-f3u8l2" && <SlidingSegmentMask />}
        {page.slug === "formarkiv-b8n4q6" && page.nextSlug && <ShapeSelectionPuzzle nextSlug={page.nextSlug} />}
        {page.slug === "tindesne-h4m7r2" && <NorthernLightsPanel />}
        {page.slug === "kamspor-w8p1c6" && page.nextSlug && <CornerCountPuzzle nextSlug={page.nextSlug} />}
        {page.slug === "lyskreds-e3v7k5" && page.nextSlug && <HexRouteCode nextSlug={page.nextSlug} />}
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
      {page.slug === "klippevind-c6q2y9" && <WalkCipher />}
    </main>
  );
}
