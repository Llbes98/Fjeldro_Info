"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Point = [number, number];
type LightState = 1 | 2;
type TargetPoint = { point: Point; state: LightState };
type Constellation = { name: string; points: TargetPoint[] };

const constellations: Constellation[] = [
  {
    name: "Vinterstien",
    points: [
      { point: [0, 2], state: 1 }, { point: [1, 3], state: 2 }, { point: [2, 2], state: 1 },
      { point: [3, 1], state: 2 }, { point: [4, 2], state: 1 },
    ],
  },
  {
    name: "Nordstjernen",
    points: [
      { point: [1, 1], state: 1 }, { point: [1, 2], state: 1 }, { point: [1, 3], state: 1 },
      { point: [2, 2], state: 2 }, { point: [3, 2], state: 2 },
    ],
  },
  {
    name: "Fjeldkronen",
    points: [
      { point: [1, 0], state: 1 }, { point: [0, 1], state: 2 }, { point: [1, 2], state: 2 },
      { point: [0, 3], state: 1 }, { point: [2, 2], state: 1 },
    ],
  },
];

function pointKey([row, column]: Point) {
  return `${row}:${column}`;
}

function areNeighbours(first: Point, second: Point) {
  return Math.max(Math.abs(first[0] - second[0]), Math.abs(first[1] - second[1])) === 1;
}

function connections(points: Point[], connectors: Point[]) {
  const connectorKeys = new Set(connectors.map(pointKey));
  return points.flatMap((point, index) =>
    points.slice(index + 1).flatMap((otherPoint) =>
      areNeighbours(point, otherPoint) && (connectorKeys.has(pointKey(point)) || connectorKeys.has(pointKey(otherPoint)))
        ? [[point, otherPoint] as [Point, Point]]
        : []
    )
  );
}

function signature(points: TargetPoint[]) {
  const minimumRow = Math.min(...points.map(({ point: [row] }) => row));
  const minimumColumn = Math.min(...points.map(({ point: [, column] }) => column));
  return points
    .map(({ point: [row, column], state }) => `${row - minimumRow}:${column - minimumColumn}:${state}`)
    .sort()
    .join("|");
}

function ConstellationIcon({ constellation, solved }: { constellation: Constellation; solved: boolean }) {
  const rawPoints = constellation.points.map(({ point }) => point);
  const connectorPoints = constellation.points.filter(({ state }) => state === 2).map(({ point }) => point);
  const minimumRow = Math.min(...rawPoints.map(([row]) => row));
  const maximumRow = Math.max(...rawPoints.map(([row]) => row));
  const minimumColumn = Math.min(...rawPoints.map(([, column]) => column));
  const maximumColumn = Math.max(...rawPoints.map(([, column]) => column));
  const rowSpan = maximumRow - minimumRow;
  const columnSpan = maximumColumn - minimumColumn;
  const coordinate = ([row, column]: Point) => ({
    x: columnSpan === 0 ? 60 : 22 + (column - minimumColumn) * (76 / columnSpan),
    y: rowSpan === 0 ? 60 : 18 + (row - minimumRow) * (84 / rowSpan),
  });

  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`${constellation.name}${solved ? " løst" : " uløst"}`}>
      {connections(rawPoints, connectorPoints).map(([from, to], index) => {
        const start = coordinate(from);
        const end = coordinate(to);
        return <line key={index} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
      })}
      {constellation.points.map(({ point }, index) => {
        const position = coordinate(point);
        return <circle key={index} cx={position.x} cy={position.y} r="5" />;
      })}
    </svg>
  );
}

export function ConstellationPuzzle({ nextSlug }: { nextSlug: string }) {
  const [lights, setLights] = useState<Record<number, LightState>>({});
  const [solved, setSolved] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("Signal klar");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const router = useRouter();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const activeEntries = Object.entries(lights).map(([index, state]) => ({ index: Number(index), state }));
  const activePoints = activeEntries.map(({ index }) => [Math.floor(index / 6), index % 6] as Point);
  const connectorPoints = activeEntries.filter(({ state }) => state === 2).map(({ index }) => [Math.floor(index / 6), index % 6] as Point);

  function toggleLamp(index: number) {
    if (locked) return;

    const currentState = lights[index];
    const whiteCount = activeEntries.filter(({ state }) => state === 1).length;
    const blueCount = activeEntries.filter(({ state }) => state === 2).length;
    const nextLights = { ...lights };

    if (!currentState) {
      if (whiteCount >= 3) { setMessage("03 / 03"); return; }
      nextLights[index] = 1;
    } else if (currentState === 1) {
      if (blueCount >= 2) { setMessage("02 / 02"); return; }
      nextLights[index] = 2;
    } else {
      delete nextLights[index];
    }

    setLights(nextLights);
    setMessage("Signal ændret");

    const nextEntries = Object.entries(nextLights).map(([lightIndex, state]) => ({ index: Number(lightIndex), state }));
    if (nextEntries.length !== 5) return;

    const candidate: TargetPoint[] = nextEntries.map(({ index: lightIndex, state }) => ({
      point: [Math.floor(lightIndex / 6), lightIndex % 6], state,
    }));
    const matchIndex = constellations.findIndex(
      (constellation, constellationIndex) => !solved.includes(constellationIndex) && signature(constellation.points) === signature(candidate)
    );
    if (matchIndex === -1) return;

    const nextSolved = [...solved, matchIndex];
    setSolved(nextSolved);
    setLocked(true);
    setMessage(`${constellations[matchIndex].name} registreret`);

    if (nextSolved.length === constellations.length) {
      timers.current.push(setTimeout(() => router.push(`/information/${nextSlug}`), 1800));
      return;
    }

    timers.current.push(setTimeout(() => {
      setLights({}); setLocked(false); setMessage("Signal klar");
    }, 1050));
  }

  return (
    <section className="constellation-puzzle">
      <div className="constellation-targets" aria-label="Stjernetegn">
        {constellations.map((constellation, index) => {
          const isSolved = solved.includes(index);
          return (
            <article className={`constellation-target ${isSolved ? "constellation-target--solved" : ""}`} key={constellation.name}>
              <div className="constellation-target__sky"><ConstellationIcon constellation={constellation} solved={isSolved} /></div>
              <span>{constellation.name}</span><small>{isSolved ? "Registreret" : "—"}</small>
            </article>
          );
        })}
      </div>
      <div className="star-console">
        <div className="star-console__status"><span><i /> 6 × 6</span><span>{solved.length}/3</span></div>
        <div className="star-grid">
          <svg className="star-grid__connections" viewBox="0 0 600 600" aria-hidden="true">
            {connections(activePoints, connectorPoints).map(([from, to], index) => (
              <line key={index} x1={(from[1] + .5) * 100} y1={(from[0] + .5) * 100} x2={(to[1] + .5) * 100} y2={(to[0] + .5) * 100} />
            ))}
          </svg>
          {Array.from({ length: 36 }, (_, index) => {
            const state = lights[index];
            return (
              <button
                className={`star-lamp ${state === 1 ? "star-lamp--lit" : ""} ${state === 2 ? "star-lamp--connector" : ""}`}
                key={index} type="button"
                aria-label={`Lampe, række ${Math.floor(index / 6) + 1}, kolonne ${(index % 6) + 1}`}
                aria-pressed={Boolean(state)} onClick={() => toggleLamp(index)}
              ><i /></button>
            );
          })}
        </div>
        <p className="star-console__message" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
