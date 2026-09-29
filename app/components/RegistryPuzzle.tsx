"use client";

import { CSSProperties, PointerEvent, useCallback, useEffect, useRef, useState } from "react";

type Position = { left: number; top: number; size: number };
type Direction = "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left";

const targetMarkers: { letter: string; direction: Direction }[] = [
  { letter: "W", direction: "top-left" },
  { letter: "P", direction: "right" },
  { letter: "Ñ", direction: "bottom" },
  { letter: "Æ", direction: "bottom-left" },
  { letter: "Š", direction: "top-right" },
];

export function RegistryPuzzle({ grid }: { grid: string[][] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<Position>({ left: 0, top: 0, size: 0 });
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const element = gridRef.current;
    const firstCell = element?.querySelector<HTMLElement>(".registry-grid__base > span");
    const lastCell = element?.querySelector<HTMLElement>(".registry-grid__base > span:last-child");
    if (!element || !firstCell || !lastCell) return;

    const gridRect = element.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    const styles = getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap) || 1;
    const size = firstRect.width * 2 + gap;
    const minimumLeft = firstRect.left - gridRect.left;
    const minimumTop = firstRect.top - gridRect.top;
    const maximumLeft = lastRect.right - gridRect.left - size;
    const maximumTop = lastRect.bottom - gridRect.top - size;

    setLens((current) => ({
      size,
      left: current.size ? Math.min(Math.max(current.left, minimumLeft), maximumLeft) : minimumLeft,
      top: current.size ? Math.min(Math.max(current.top, minimumTop), maximumTop) : minimumTop,
    }));
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [measure]);

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    const element = gridRef.current;
    const firstCell = element?.querySelector<HTMLElement>(".registry-grid__base > span");
    const lastCell = element?.querySelector<HTMLElement>(".registry-grid__base > span:last-child");
    if (!element || !firstCell || !lastCell || !lens.size) return;

    const gridRect = element.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    const minimumLeft = firstRect.left - gridRect.left;
    const minimumTop = firstRect.top - gridRect.top;
    const maximumLeft = lastRect.right - gridRect.left - lens.size;
    const maximumTop = lastRect.bottom - gridRect.top - lens.size;

    setLens({
      size: lens.size,
      left: Math.min(Math.max(event.clientX - gridRect.left - lens.size / 2, minimumLeft), maximumLeft),
      top: Math.min(Math.max(event.clientY - gridRect.top - lens.size / 2, minimumTop), maximumTop),
    });
  }

  function startDragging(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    moveLens(event);
  }

  const lensStyle = {
    "--lens-left": `${lens.left}px`,
    "--lens-top": `${lens.top}px`,
    "--lens-size": `${lens.size}px`,
  } as CSSProperties;

  const cells = grid.flatMap((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      value,
      key: `${rowIndex}-${columnIndex}`,
      isLetter: rowIndex % 2 === 1 && columnIndex % 2 === 1,
      label: `Række ${rowIndex + 1}, kolonne ${columnIndex + 1}: ${value}`,
    }))
  );

  return (
    <>
      <div
        className={`registry-grid ${dragging ? "registry-grid--dragging" : ""}`}
        ref={gridRef}
        role="grid"
        aria-label="Skjult register med 13 rækker og 13 kolonner"
        style={lensStyle}
        onPointerDown={startDragging}
        onPointerMove={(event) => dragging && moveLens(event)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <div className="registry-grid__base">
          {cells.map((cell) => (
            <span className={cell.isLetter ? "registry-grid__letter" : undefined} key={cell.key} role="gridcell" aria-label={cell.label}>
              {cell.value}
            </span>
          ))}
        </div>
        <div className="registry-grid__reveal" aria-hidden="true">
          {cells.map((cell) => (
            <span className={cell.isLetter ? "registry-grid__letter" : undefined} key={cell.key}>{cell.value}</span>
          ))}
        </div>
        <div className="registry-lens" aria-hidden="true"><i /></div>
      </div>

      <section className="target-register" aria-labelledby="target-register-heading">
        <div className="target-register__heading">
          <span>Udvalgte positioner</span>
          <h3 id="target-register-heading">Kontrolpunkter</h3>
        </div>
        <div className="target-markers">
          {targetMarkers.map(({ letter, direction }, index) => (
            <div className="target-marker" key={letter} aria-label={`Kontrolpunkt ${index + 1}: bogstav ${letter}, cirkel ${direction}`}>
              <span className="target-marker__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="target-marker__diagram">
                <strong>{letter}</strong>
                <i className={`target-marker__circle target-marker__circle--${direction}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
