"use client";

import { useEffect, useRef, useState } from "react";

type SymbolType = "dot" | "ring" | "square" | "diamond";

const baseRoute: [number, number][] = [
  [20, 430], [120, 430], [120, 190], [315, 190], [315, 300], [385, 230],
  [455, 300], [525, 230], [595, 300], [665, 230], [595, 160], [500, 160], [500, 70],
];
const routeOffset: [number, number] = [480, -360];
const radarRoutePath = Array.from({ length: 5 }, (_, copyIndex) => {
  const offsetIndex = copyIndex - 2;
  return baseRoute
    .slice(copyIndex === 0 ? 0 : 1)
    .map(([x, y]) => `${copyIndex === 0 && x === baseRoute[0][0] && y === baseRoute[0][1] ? "M" : "L"}${x + routeOffset[0] * offsetIndex} ${y + routeOffset[1] * offsetIndex}`)
    .join(" ");
}).join(" ");

const markers: { progress: number; type: SymbolType }[] = [
  { progress: .07, type: "square" },
  { progress: .237, type: "square" },
  { progress: .307, type: "ring" },
  { progress: .37, type: "ring" },
  { progress: .519, type: "diamond" },
  { progress: .657, type: "ring" },
  { progress: .77, type: "dot" },
  { progress: .91, type: "dot" },
];

const guideCards = [
  { lines: "plus", symbol: "dots", letters: ["H", "P", "Z", "M"] },
  { lines: "plus", symbol: "square", letters: ["B", "S", "Y", "J"] },
  { lines: "plus", symbol: "ring", letters: ["U", "F", "R", "L"] },
  { lines: "cross", symbol: "dots", letters: ["D", "K", "W", "O"] },
  { lines: "cross", symbol: "diamond", letters: ["X", "N", "G", "V"] },
  { lines: "cross", symbol: "ring", letters: ["C", "I", "T", "Q"] },
];

function SymbolGlyph({ type }: { type: SymbolType }) {
  return <span className={`symbol-glyph symbol-glyph--${type}`} aria-label={type} />;
}

function SignalGuide() {
  return (
    <div className="signal-guide">
      <div className="signal-guide__grid">
        {guideCards.map((card, index) => (
          <div className={`guide-card guide-card--${card.lines}`} key={index}>
            {card.letters.map((letter, letterIndex) => {
              const plusPositions = ["top-left", "top-right", "bottom-left", "bottom-right"];
              const crossPositions = ["top", "right", "bottom", "left"];
              const position = (card.lines === "plus" ? plusPositions : crossPositions)[letterIndex];
              return <span className={`guide-letter guide-letter--${position}`} key={position}>{letter}</span>;
            })}
            <svg viewBox="0 0 100 100" aria-hidden="true">
              {card.lines === "plus" ? (
                <><line x1="50" y1="4" x2="50" y2="96" /><line x1="4" y1="50" x2="96" y2="50" /></>
              ) : (
                <><line x1="12" y1="12" x2="88" y2="88" /><line x1="88" y1="12" x2="12" y2="88" /></>
              )}
              {card.symbol === "dots" && card.lines === "plus" && <><circle cx="42" cy="42" r="3" /><circle cx="58" cy="42" r="3" /><circle cx="42" cy="58" r="3" /><circle cx="58" cy="58" r="3" /></>}
              {card.symbol === "dots" && card.lines === "cross" && <><circle cx="50" cy="38" r="3" /><circle cx="62" cy="50" r="3" /><circle cx="50" cy="62" r="3" /><circle cx="38" cy="50" r="3" /></>}
              {card.symbol === "square" && <rect x="38" y="38" width="24" height="24" />}
              {card.symbol === "diamond" && <rect x="38" y="38" width="24" height="24" transform="rotate(45 50 50)" />}
              {card.symbol === "ring" && <circle cx="50" cy="50" r="15" />}
            </svg>
          </div>
        ))}
      </div>
      <div className="signal-guide__singles">
        <span><i className="signal-single signal-single--dot" /> A</span>
        <span><i className="signal-single signal-single--ring" /> E</span>
      </div>
    </div>
  );
}

export function RadarRoute() {
  const pathRef = useRef<SVGPathElement>(null);
  const [frame, setFrame] = useState({ progress: 0, trail: 0, x: 20, y: 430 });
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    let previousPaint = 0;
    const cycleDuration = 19000;

    function animate(time: number) {
      if (time - previousPaint > 32) {
        const cycle = time % cycleDuration;
        let progress = 0;
        let trail = 0;

        if (cycle < 7000) {
          progress = .307 * (cycle / 7000);
          trail = .22;
        } else if (cycle < 10200) {
          progress = .307;
          trail = .22 * (1 - (cycle - 7000) / 3200);
        } else {
          progress = .307 + .693 * ((cycle - 10200) / 8800);
          trail = Math.min(.22, progress - .307);
        }

        const route = pathRef.current;
        const routePoint = route
          ? route.getPointAtLength(route.getTotalLength() * ((2 + progress) / 5))
          : { x: 20, y: 430 };
        setFrame({ progress, trail, x: routePoint.x, y: routePoint.y });
        previousPaint = time;
      }
      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const currentMarker = [...markers].reverse().find((marker) => frame.progress >= marker.progress) ?? markers[0];
  const routeProgress = 2 + frame.progress;
  const trailStart = routeProgress - frame.trail;

  return (
    <section className="radar-module">
      {!guideOpen ? (
        <>
          <div className="radar-symbol" aria-live="polite"><SymbolGlyph type={currentMarker.type} /></div>
          <div className="radar-screen">
            <svg viewBox="0 0 600 600" role="img" aria-label="Animeret rutesignal">
              <defs><clipPath id="radar-clip"><circle cx="300" cy="300" r="276" /></clipPath></defs>
              <g className="radar-grid" clipPath="url(#radar-clip)">
                <circle cx="300" cy="300" r="276" /><circle cx="300" cy="300" r="205" /><circle cx="300" cy="300" r="132" /><circle cx="300" cy="300" r="61" />
                <line x1="24" y1="300" x2="576" y2="300" /><line x1="300" y1="24" x2="300" y2="576" />
                <line x1="105" y1="105" x2="495" y2="495" /><line x1="495" y1="105" x2="105" y2="495" />
              </g>
              <g clipPath="url(#radar-clip)">
                <g transform={`translate(${300 - frame.x} ${300 - frame.y})`}>
                  <path
                    className="radar-route radar-route--trail"
                    d={radarRoutePath}
                    pathLength="5"
                    ref={pathRef}
                    strokeDasharray={`${frame.trail} ${5 - frame.trail}`}
                    strokeDashoffset={-trailStart}
                  />
                </g>
              </g>
              <circle className="radar-center-halo" cx="300" cy="300" r="18" />
              <circle className="radar-center" cx="300" cy="300" r="7" />
            </svg>
          </div>
        </>
      ) : (
        <SignalGuide />
      )}
      <div className="radar-controls">
        <span>FR–NAV / 02.2</span>
        <button type="button" aria-expanded={guideOpen} onClick={() => setGuideOpen((open) => !open)}>{guideOpen ? "Skjul signalnøgle" : "Vis signalnøgle"}</button>
      </div>
    </section>
  );
}
