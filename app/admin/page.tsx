import Link from "next/link";
import { FjeldroMark } from "../components/FjeldroMark";
import { tracks } from "@/lib/tracks";

const kindLabel = { start: "Forside", step: "Underside", final: "Slutside" };

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <FjeldroMark compact />
        <div><p className="eyebrow">Internt overblik</p><h1>Sideadministration</h1></div>
        <Link className="admin-home" href="/">Se hovedside ↗</Link>
      </header>
      <p className="admin-intro">Direkte adgang til alle oprettede sider. Koderne er kun vist her til test og redigering.</p>
      <section className="track-grid">
        {tracks.map((track) => (
          <article className="track-card" key={track.id} style={{ "--accent": track.accent } as React.CSSProperties}>
            <div className="track-card__heading"><span>{String(track.id).padStart(2, "0")}</span><div><small>Spor {track.id}</small><h2>{track.label}</h2></div></div>
            <div className="page-list">
              {track.pages.map((page, index) => (
                <div className="page-row" key={page.slug}>
                  <div><span className="page-kind">{kindLabel[page.kind]}</span><strong>{page.title}</strong>{page.code && <code>Kode: {page.code}</code>}</div>
                  <Link href={`/information/${page.slug}`}>Åbn <span aria-hidden="true">↗</span></Link>
                  {index < track.pages.length - 1 && <i className="connector" />}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
