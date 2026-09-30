"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ShapeKind = "triangle" | "circle" | "hexagon";
type PatternKind = "vertical" | "horizontal" | "plain";
type SignalColour = "red" | "green" | "yellow" | "purple";
type SignalValue = { colour: SignalColour; amount: 1 | -1 };
type Figure = { id: string; shape: ShapeKind; pattern: PatternKind; values: [SignalValue, SignalValue] };

const figures: Figure[] = [
  { id: "vertical-triangle", shape: "triangle", pattern: "vertical", values: [{ colour: "yellow", amount: 1 }, { colour: "green", amount: -1 }] },
  { id: "vertical-circle", shape: "circle", pattern: "vertical", values: [{ colour: "purple", amount: 1 }, { colour: "green", amount: 1 }] },
  { id: "vertical-hexagon", shape: "hexagon", pattern: "vertical", values: [{ colour: "red", amount: 1 }, { colour: "green", amount: 1 }] },
  { id: "horizontal-triangle", shape: "triangle", pattern: "horizontal", values: [{ colour: "yellow", amount: 1 }, { colour: "red", amount: 1 }] },
  { id: "horizontal-circle", shape: "circle", pattern: "horizontal", values: [{ colour: "purple", amount: 1 }, { colour: "yellow", amount: 1 }] },
  { id: "horizontal-hexagon", shape: "hexagon", pattern: "horizontal", values: [{ colour: "red", amount: 1 }, { colour: "yellow", amount: -1 }] },
  { id: "plain-triangle", shape: "triangle", pattern: "plain", values: [{ colour: "yellow", amount: 1 }, { colour: "purple", amount: 1 }] },
  { id: "plain-circle", shape: "circle", pattern: "plain", values: [{ colour: "purple", amount: 1 }, { colour: "red", amount: 1 }] },
  { id: "plain-hexagon", shape: "hexagon", pattern: "plain", values: [{ colour: "red", amount: -1 }, { colour: "purple", amount: 1 }] },
];

const correctSelection = new Set(["horizontal-triangle", "horizontal-hexagon", "plain-circle"]);
const targetValues: Array<{ colour: SignalColour; amount: number }> = [
  { colour: "red", amount: 3 },
  { colour: "green", amount: 0 },
  { colour: "yellow", amount: 0 },
  { colour: "purple", amount: 1 },
];

const colourNames: Record<SignalColour, string> = { red: "rød", green: "grøn", yellow: "gul", purple: "lilla" };
const shapeNames: Record<ShapeKind, string> = { triangle: "trekant", circle: "cirkel", hexagon: "sekskant" };
const patternNames: Record<PatternKind, string> = { vertical: "lodrette streger", horizontal: "vandrette streger", plain: "uden streger" };

function ShapeGlyph({ shape, pattern, patternId }: { shape: ShapeKind; pattern: PatternKind; patternId: string }) {
  const shapeElement = shape === "triangle"
    ? <path d="M50 9 92 85H8Z" />
    : shape === "circle"
      ? <circle cx="50" cy="50" r="38" />
      : <path d="M27 11h46l23 39-23 39H27L4 50Z" />;

  return (
    <svg className="shape-glyph" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" className="shape-glyph__pattern-base" />
          {pattern === "vertical" && <path d="M3 0V12M9 0V12" className="shape-glyph__pattern-line" />}
          {pattern === "horizontal" && <path d="M0 3H12M0 9H12" className="shape-glyph__pattern-line" />}
        </pattern>
      </defs>
      <g fill={`url(#${patternId})`}>{shapeElement}</g>
      <g className="shape-glyph__edge">{shapeElement}</g>
    </svg>
  );
}

function ColourValue({ value }: { value: SignalValue | { colour: SignalColour; amount: number } }) {
  return (
    <span className={`shape-value shape-value--${value.colour}`} aria-label={`${value.amount} ${colourNames[value.colour]}`}>
      <i />
      <b>{value.amount}</b>
    </span>
  );
}

export function ShapeSelectionPuzzle({ nextSlug }: { nextSlug: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function toggleFigure(id: string) {
    if (solved) return;
    const nextSelected = selected.includes(id)
      ? selected.filter((selection) => selection !== id)
      : selected.length < 3 ? [...selected, id] : selected;

    setSelected(nextSelected);
    if (nextSelected.length === 3 && nextSelected.every((selection) => correctSelection.has(selection))) {
      setSolved(true);
      timer.current = setTimeout(() => router.push(`/information/${nextSlug}`), 1400);
    }
  }

  return (
    <section className={`shape-puzzle ${solved ? "shape-puzzle--solved" : ""}`} aria-label="Figurregistrering">
      <div className="shape-puzzle__brief">
        <p>Hver figur har en farveværdi fordelt på <span className="text-red">rød</span>, <span className="text-green">grøn</span>, <span className="text-yellow">gul</span> eller <span className="text-purple">lilla</span>.</p>
        <p>Vælg tre figurer, hvis samlede farveværdi er:</p>
      </div>

      <div className="shape-puzzle__target" aria-label="Ønskede farveværdier">
        {targetValues.map((value) => <ColourValue value={value} key={value.colour} />)}
      </div>

      <div className="shape-puzzle__matrix-head" aria-hidden="true">
        <span />
        {(["triangle", "circle", "hexagon"] as ShapeKind[]).map((shape) => (
          <ShapeGlyph shape={shape} pattern="plain" patternId={`heading-${shape}`} key={shape} />
        ))}
      </div>

      <div className="shape-puzzle__grid">
        {figures.map((figure, index) => {
          const isSelected = selected.includes(figure.id);
          return (
            <div className="shape-puzzle__cell" key={figure.id}>
              {index % 3 === 0 && <span className={`shape-pattern-key shape-pattern-key--${figure.pattern}`} aria-hidden="true"><i /><i /><i /></span>}
              <button
                className={`shape-choice ${isSelected ? "shape-choice--selected" : ""}`}
                type="button"
                aria-label={`${shapeNames[figure.shape]} med ${patternNames[figure.pattern]}`}
                aria-pressed={isSelected}
                onClick={() => toggleFigure(figure.id)}
              >
                <ShapeGlyph shape={figure.shape} pattern={figure.pattern} patternId={`choice-${figure.id}`} />
                <span className="shape-choice__values">
                  {figure.values.map((value) => <ColourValue value={value} key={value.colour} />)}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="shape-puzzle__status" aria-live="polite">
        <span>{String(selected.length).padStart(2, "0")} / 03</span>
        <strong>{solved ? "Registrering godkendt" : ""}</strong>
      </div>
    </section>
  );
}
