"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const rowCount = 4;
const columnCount = 8;
const clues = [
  [1, 0, 2, 3, 3, 4, 3],
  [2, 1, 3, 3, 2, 3, 4],
  [2, 3, 3, 2, 1, 1, 3],
];

function neighbours(index: number, cells: boolean[]) {
  const clueRow = Math.floor(index / 7);
  const clueColumn = index % 7;
  const upperLeft = clueRow * columnCount + clueColumn;
  const adjacentCells = [upperLeft, upperLeft + 1, upperLeft + columnCount, upperLeft + columnCount + 1];
  return adjacentCells.filter((cell) => cells[cell]).length;
}

function puzzleIsSolved(cells: boolean[]) {
  return clues.flat().every((clue, index) => neighbours(index, cells) === clue);
}

export function CornerCountPuzzle({ nextSlug }: { nextSlug: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cells, setCells] = useState(() => Array(rowCount * columnCount).fill(false) as boolean[]);
  const [solved, setSolved] = useState(false);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function toggleCell(index: number) {
    if (solved) return;
    const nextCells = [...cells];
    nextCells[index] = !nextCells[index];
    setCells(nextCells);

    if (puzzleIsSolved(nextCells)) {
      setSolved(true);
      timer.current = setTimeout(() => router.push(`/information/${nextSlug}`), 1400);
    }
  }

  return (
    <section className={`corner-puzzle ${solved ? "corner-puzzle--solved" : ""}`} aria-label="Feltregistrering">
      <div className="corner-puzzle__bar">
        <span><i /> 08 × 04</span>
        <strong>{solved ? "Godkendt" : "Afventer"}</strong>
      </div>

      <div className="corner-board">
        <div className="corner-board__cells">
          {cells.map((marked, index) => (
            <button
              className={`corner-cell ${marked ? "corner-cell--marked" : ""}`}
              type="button"
              aria-label={`Felt ${Math.floor(index / columnCount) + 1}, ${index % columnCount + 1}`}
              aria-pressed={marked}
              onClick={() => toggleCell(index)}
              key={index}
            >
              <span>{marked ? "X" : ""}</span>
            </button>
          ))}
        </div>

        {clues.flatMap((row, rowIndex) => row.map((clue, columnIndex) => {
          return (
            <div
              className="corner-clue"
              style={{ left: `${((columnIndex + 1) / columnCount) * 100}%`, top: `${((rowIndex + 1) / rowCount) * 100}%` }}
              aria-label={`Krav: ${clue}`}
              key={`${rowIndex}-${columnIndex}`}
            >
              <span>{clue}</span>
            </div>
          );
        }))}
      </div>
    </section>
  );
}
