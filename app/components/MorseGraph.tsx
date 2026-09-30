"use client";

import { useEffect, useMemo, useState } from "react";

const morseSequence = ".../-.-/../.../-.-/---//";
const changes = [...morseSequence].map((symbol) => symbol === "." ? 1 : symbol === "-" ? -1 : 0);

const plot = {
  left: 72,
  top: 32,
  width: 804,
  height: 324,
  yMin: -1,
  yMax: 8,
};

function xPosition(index: number) {
  return plot.left + (index / changes.length) * plot.width;
}

function yPosition(value: number) {
  return plot.top + ((plot.yMax - value) / (plot.yMax - plot.yMin)) * plot.height;
}

export function MorseGraph() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const values = useMemo(() => {
    const result = [0];
    changes.forEach((change) => result.push(result[result.length - 1] + change));
    return result;
  }, []);

  useEffect(() => {
    const delay = visibleSteps === changes.length ? 15000 : 2000;
    const timer = setTimeout(() => {
      setVisibleSteps((current) => current === changes.length ? 0 : current + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleSteps]);

  return (
    <section className="morse-graph" aria-label="Animeret koordinatsystem">
      <div className="morse-graph__screen">
        <div className="morse-graph__header">
          <span><i /> Målesignal</span>
          <span>{visibleSteps === changes.length ? "Sekvens komplet" : `${String(visibleSteps).padStart(2, "0")} / ${changes.length}`}</span>
        </div>
        <svg viewBox="0 0 920 405" role="img" aria-label="Graf i et koordinatsystem">
          <defs>
            <pattern id="minor-grid" width="33.5" height="36" patternUnits="userSpaceOnUse">
              <path d="M33.5 0H0V36" className="morse-graph__minor-grid" />
            </pattern>
            <filter id="graph-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} className="morse-graph__plot" />
          <rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} fill="url(#minor-grid)" />

          {Array.from({ length: 10 }, (_, index) => {
            const value = plot.yMin + index;
            const y = yPosition(value);
            return (
              <g key={value}>
                <line x1={plot.left} y1={y} x2={plot.left + plot.width} y2={y} className="morse-graph__major-grid" />
                <text x={plot.left - 15} y={y + 5} textAnchor="end">{value}</text>
              </g>
            );
          })}

          {Array.from({ length: changes.length + 1 }, (_, index) => {
            if (index % 2 !== 0 && index !== changes.length) return null;
            const x = xPosition(index);
            return <text x={x} y={plot.top + plot.height + 27} textAnchor="middle" key={index}>{index}</text>;
          })}

          <line x1={plot.left} y1={yPosition(0)} x2={plot.left + plot.width + 17} y2={yPosition(0)} className="morse-graph__axis" />
          <path d={`M${plot.left + plot.width + 17} ${yPosition(0)}l-10-6v12z`} className="morse-graph__axis-arrow" />
          <line x1={plot.left} y1={plot.top + plot.height} x2={plot.left} y2={plot.top - 16} className="morse-graph__axis" />
          <path d={`M${plot.left} ${plot.top - 16}l-6 10h12z`} className="morse-graph__axis-arrow" />
          <text x={plot.left + plot.width + 27} y={yPosition(0) + 5} className="morse-graph__axis-label">X</text>
          <text x={plot.left - 4} y={plot.top - 23} className="morse-graph__axis-label">Y</text>

          <g filter="url(#graph-glow)">
            {changes.slice(0, visibleSteps).map((_, index) => (
              <line
                x1={xPosition(index)}
                y1={yPosition(values[index])}
                x2={xPosition(index + 1)}
                y2={yPosition(values[index + 1])}
                className={`morse-graph__segment ${index === visibleSteps - 1 ? "morse-graph__segment--new" : ""}`}
                pathLength="1"
                key={`${visibleSteps === 0 ? "reset" : "run"}-${index}`}
              />
            ))}
            {values.slice(0, visibleSteps + 1).map((value, index) => (
              <circle cx={xPosition(index)} cy={yPosition(value)} r={index === visibleSteps ? 5 : 3} className="morse-graph__point" key={index} />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
