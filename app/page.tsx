import { FjeldroMark } from "./components/FjeldroMark";
import { SnowScene } from "./components/SnowScene";

export default function Home() {
  return (
    <main className="public-shell landing">
      <SnowScene />
      <section className="welcome-card">
        <FjeldroMark />
        <p className="eyebrow">Velkommen til fjeldet</p>
        <h1>Roen begynder her.</h1>
        <p className="lead">Information om dit ophold på Fjeldro findes via det personlige link i din reservation.</p>
        <div className="status-note"><span /> Resortet gør klar til din ankomst</div>
      </section>
    </main>
  );
}
