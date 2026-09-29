import Link from "next/link";
import { FjeldroMark } from "./components/FjeldroMark";
import { SnowScene } from "./components/SnowScene";

export default function NotFound() {
  return <main className="public-shell landing"><SnowScene /><section className="welcome-card"><FjeldroMark /><p className="eyebrow">404 · Fjeldro</p><h1>Stien ender her.</h1><p className="lead">Det link, du har fulgt, findes ikke.</p><Link className="text-link" href="/">Til Fjeldro</Link></section></main>;
}
