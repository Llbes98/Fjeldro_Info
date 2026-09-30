"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Shape = "empty" | "horizontal" | "vertical" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "tee-up";
type SymbolKind = "bowtie" | "diamond" | "block" | "orb";
type Tile = { shape: Shape; symbol?: SymbolKind };

const fixedCells: Record<number, "S1" | "S2" | "A" | "B" | "C"> = {
  0: "S1",
  4: "A",
  19: "B",
  25: "S2",
  29: "C",
};

const blockedCells = new Set([3, 12]);
const movableCells = Array.from({ length: 30 }, (_, index) => index)
  .filter((index) => !fixedCells[index] && !blockedCells.has(index));

const solutionByCell: Record<number, Tile> = {
  1: { shape: "bottom-right" },
  2: { shape: "bottom-left" },
  5: { shape: "vertical", symbol: "bowtie" },
  6: { shape: "vertical", symbol: "diamond" },
  7: { shape: "top-right" },
  8: { shape: "horizontal", symbol: "bowtie" },
  9: { shape: "top-left" },
  10: { shape: "top-right" },
  11: { shape: "top-left" },
  13: { shape: "empty" },
  14: { shape: "empty" },
  15: { shape: "empty" },
  16: { shape: "empty" },
  17: { shape: "empty" },
  18: { shape: "empty" },
  20: { shape: "empty" },
  21: { shape: "empty" },
  22: { shape: "bottom-right" },
  23: { shape: "horizontal", symbol: "orb" },
  24: { shape: "top-left" },
  26: { shape: "horizontal", symbol: "block" },
  27: { shape: "tee-up" },
  28: { shape: "horizontal", symbol: "diamond" },
};

const targetTiles = movableCells.map((cell) => solutionByCell[cell]);
const permutation = [8, 3, 19, 0, 15, 11, 21, 6, 13, 2, 17, 9, 22, 5, 14, 20, 1, 12, 7, 18, 10, 4, 16];
const initialTiles = permutation.map((index) => targetTiles[index]);

function tileSignature(tile: Tile) {
  return `${tile.shape}:${tile.symbol ?? ""}`;
}

function SymbolGlyph({ kind }: { kind: SymbolKind }) {
  if (kind === "diamond") return <span className="route-symbol route-symbol--diamond" />;
  if (kind === "block") return <span className="route-symbol route-symbol--block" />;
  if (kind === "orb") return <span className="route-symbol route-symbol--orb"><i /></span>;
  return (
    <span className="route-symbol route-symbol--bowtie">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M12 8 H88 L61 50 L88 92 H12 L39 50 Z" />
      </svg>
    </span>
  );
}

function RouteTile({ tile }: { tile: Tile }) {
  const paths: Record<Shape, string[]> = {
    empty: [],
    horizontal: ["M0 50 H100"],
    vertical: ["M50 0 V100"],
    "bottom-right": ["M50 100 V50 H100"],
    "bottom-left": ["M50 100 V50 H0"],
    "top-right": ["M50 0 V50 H100"],
    "top-left": ["M50 0 V50 H0"],
    "tee-up": ["M0 50 H100", "M50 50 V0"],
  };

  return (
    <div className="route-tile__drawing">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {paths[tile.shape].map((path, index) => <path d={path} key={index} />)}
      </svg>
      {tile.symbol && <SymbolGlyph kind={tile.symbol} />}
    </div>
  );
}

const targetRows: Array<{ from: string; symbols: SymbolKind[]; to: string }> = [
  { from: "S1", symbols: ["bowtie", "diamond", "bowtie"], to: "A" },
  { from: "S2", symbols: ["block", "orb"], to: "B" },
  { from: "S2", symbols: ["block", "diamond"], to: "C" },
];

export function RouteSwapPuzzle({ nextSlug }: { nextSlug: string }) {
  const router = useRouter();
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const chooseCell = (cell: number) => {
    if (solved) return;
    const tileIndex = movableCells.indexOf(cell);
    if (tileIndex < 0) return;

    if (selected === null) {
      setSelected(cell);
      return;
    }

    if (selected === cell) {
      setSelected(null);
      return;
    }

    const selectedIndex = movableCells.indexOf(selected);
    const nextTiles = [...tiles];
    [nextTiles[selectedIndex], nextTiles[tileIndex]] = [nextTiles[tileIndex], nextTiles[selectedIndex]];
    setTiles(nextTiles);
    setSelected(null);

    const isSolved = nextTiles.every((tile, index) => tileSignature(tile) === tileSignature(targetTiles[index]));
    if (isSolved) {
      setSolved(true);
      timer.current = setTimeout(() => router.push(`/information/${nextSlug}`), 1500);
    }
  };

  return (
    <section className={`route-puzzle ${solved ? "route-puzzle--solved" : ""}`} aria-label="Rutenet">
      <div className="route-puzzle__board">
        {Array.from({ length: 30 }, (_, cell) => {
          const terminal = fixedCells[cell];
          if (terminal) return <div className={`route-terminal route-terminal--${terminal.toLowerCase()}`} key={cell}><span>{terminal}</span></div>;
          if (blockedCells.has(cell)) return <div className="route-blocked" aria-label="Blokeret felt" key={cell}><i /><i /><i /></div>;
          const tileIndex = movableCells.indexOf(cell);
          return (
            <button
              className={`route-tile ${selected === cell ? "route-tile--selected" : ""}`}
              type="button"
              onClick={() => chooseCell(cell)}
              aria-label={`Rutefelt ${cell + 1}${selected === cell ? ", valgt" : ""}`}
              aria-pressed={selected === cell}
              key={cell}
            >
              <RouteTile tile={tiles[tileIndex]} />
            </button>
          );
        })}
      </div>

      <div className="route-targets" aria-label="Forbindelsesoversigt">
        {targetRows.map((row, rowIndex) => (
          <div className="route-target" key={rowIndex}>
            <strong>{row.from}</strong>
            <div className="route-target__line">
              {row.symbols.map((symbol, symbolIndex) => (
                <span className="route-target__symbol" key={symbolIndex}><SymbolGlyph kind={symbol} /></span>
              ))}
            </div>
            <strong>{row.to}</strong>
          </div>
        ))}
      </div>
      <p className="route-puzzle__status" aria-live="polite">{solved ? "Forbindelser godkendt" : ""}</p>
    </section>
  );
}
