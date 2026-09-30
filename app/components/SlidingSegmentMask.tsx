"use client";

import { useRef, useState } from "react";

const digitSegments: Record<string, string[]> = {
  "9": ["a", "b", "c", "d", "f", "g"],
  "2": ["a", "b", "d", "e", "g"],
  "1": ["b", "c"],
};

const segmentRects: Record<string, { x: number; y: number; width: number; height: number }> = {
  a: { x: 21, y: 13, width: 91, height: 15 },
  b: { x: 113, y: 27, width: 15, height: 82 },
  c: { x: 113, y: 126, width: 15, height: 82 },
  d: { x: 21, y: 208, width: 91, height: 15 },
  e: { x: 5, y: 126, width: 15, height: 82 },
  f: { x: 5, y: 27, width: 15, height: 82 },
  g: { x: 21, y: 110, width: 91, height: 15 },
};

const panelCutouts = [
  { x: 231, y: 52, width: 17, height: 76, radius: 8.5 },
  { x: 304, y: 52, width: 17, height: 76, radius: 8.5 },
  { x: 151, y: 131, width: 85, height: 17, radius: 8.5 },
  { x: 138, y: 151, width: 17, height: 76, radius: 8.5 },
  { x: 395, y: 151, width: 17, height: 76, radius: 8.5 },
  { x: 475, y: 34, width: 85, height: 17, radius: 8.5 },
  { x: 475, y: 230, width: 85, height: 17, radius: 8.5 },
];

function SevenSegmentDigit({ digit, x }: { digit: string; x: number }) {
  return (
    <g transform={`translate(${x} 22)`}>
      {digitSegments[digit].map((segment) => {
        const rect = segmentRects[segment];
        return <rect {...rect} rx="7.5" key={segment} />;
      })}
    </g>
  );
}

export function SlidingSegmentMask() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ pointerX: 0, offset: 0 });
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const clampOffset = (value: number) => {
    const width = stageRef.current?.clientWidth ?? 700;
    return Math.max(width * -.72, Math.min(width * .72, value));
  };

  const moveBy = (amount: number) => setOffset((current) => clampOffset(current + amount));

  return (
    <section className="segment-mask-puzzle" aria-label="Flytbart segmentpanel">
      <div className="segment-mask-stage" ref={stageRef}>
        <svg className="segment-mask-digits" viewBox="0 0 707 281" aria-label="7-segment tallet 921">
          <g className="segment-mask-digits__segments">
            <SevenSegmentDigit digit="9" x={72} />
            <SevenSegmentDigit digit="2" x={282} />
            <SevenSegmentDigit digit="1" x={505} />
          </g>
        </svg>

        <div
          className={`segment-mask-panel ${dragging ? "segment-mask-panel--dragging" : ""}`}
          style={{ transform: `translateX(${offset}px)` }}
          role="slider"
          tabIndex={0}
          aria-label="Flyt panelet mod højre eller venstre"
          aria-valuemin={-1000}
          aria-valuemax={1000}
          aria-valuenow={Math.round(offset)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); moveBy(-18); }
            if (event.key === "ArrowRight") { event.preventDefault(); moveBy(18); }
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragStart.current = { pointerX: event.clientX, offset };
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (!dragging) return;
            setOffset(clampOffset(dragStart.current.offset + event.clientX - dragStart.current.pointerX));
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
        >
          <svg viewBox="-566 0 1839 281" aria-hidden="true">
            <defs>
              <mask id="segment-panel-cutouts">
                <rect x="-566" width="1839" height="281" fill="#fff" />
                <g fill="#000">
                  {panelCutouts.map((hole, index) => (
                    <rect key={index} x={hole.x} y={hole.y} width={hole.width} height={hole.height} rx={hole.radius} />
                  ))}
                </g>
              </mask>
            </defs>
            <rect x="-561" y="5" width="1829" height="271" className="segment-mask-panel__fill" mask="url(#segment-panel-cutouts)" />
            <rect x="-561" y="5" width="1829" height="271" className="segment-mask-panel__border" />
            <g className="segment-mask-panel__hole-edges">
              {panelCutouts.map((hole, index) => (
                <rect key={index} x={hole.x} y={hole.y} width={hole.width} height={hole.height} rx={hole.radius} />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <div className="segment-mask-controls" aria-hidden="true"><span>←</span><i /><span>→</span></div>
    </section>
  );
}
