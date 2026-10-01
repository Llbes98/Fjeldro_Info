"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

type NodeId = "center" | "top" | "left" | "right" | "upperLeft" | "upperRight" | "bottom";
type NetworkNode = { id: NodeId; x: number; y: number; size: "large" | "small" | "center" };
type Edge = { from: NodeId; fromPort: number; to: NodeId; toPort: number };
type OuterCircle = { id: string; node: NodeId; port: number; x: number; y: number };

const targetCode = "5748";
const targetCounts = [5, 7, 4, 8];

const nodes: NetworkNode[] = [
  { id: "upperLeft", x: 24, y: 28, size: "large" },
  { id: "upperRight", x: 76, y: 28, size: "large" },
  { id: "center", x: 50, y: 43, size: "center" },
  { id: "bottom", x: 50, y: 73, size: "large" },
  { id: "top", x: 50, y: 13, size: "small" },
  { id: "left", x: 24, y: 58, size: "small" },
  { id: "right", x: 76, y: 58, size: "small" },
];

const edges: Edge[] = [
  { from: "center", fromPort: 0, to: "top", toPort: 3 },
  { from: "center", fromPort: 4, to: "left", toPort: 1 },
  { from: "center", fromPort: 2, to: "right", toPort: 5 },
  { from: "top", fromPort: 4, to: "upperLeft", toPort: 1 },
  { from: "top", fromPort: 2, to: "upperRight", toPort: 5 },
  { from: "left", fromPort: 0, to: "upperLeft", toPort: 3 },
  { from: "left", fromPort: 2, to: "bottom", toPort: 5 },
  { from: "right", fromPort: 0, to: "upperRight", toPort: 3 },
  { from: "right", fromPort: 4, to: "bottom", toPort: 1 },
];

const outerCircles: OuterCircle[] = [
  { id: "ul-top", node: "upperLeft", port: 0, x: 24, y: 5 },
  { id: "ul-high", node: "upperLeft", port: 5, x: 6.5, y: 17.5 },
  { id: "ul-low", node: "upperLeft", port: 4, x: 6.5, y: 38.5 },
  { id: "ur-top", node: "upperRight", port: 0, x: 76, y: 5 },
  { id: "ur-high", node: "upperRight", port: 1, x: 93.5, y: 17.5 },
  { id: "ur-low", node: "upperRight", port: 2, x: 93.5, y: 38.5 },
  { id: "b-left", node: "bottom", port: 4, x: 33, y: 83 },
  { id: "b-bottom", node: "bottom", port: 3, x: 50, y: 96 },
  { id: "b-right", node: "bottom", port: 2, x: 67, y: 83 },
];

const initialRotations: Record<NodeId, number> = {
  center: 0,
  top: 0,
  left: 0,
  right: 0,
  upperLeft: 0,
  upperRight: 0,
  bottom: 0,
};

const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<NodeId, NetworkNode>;

function basePorts(node: NetworkNode) {
  const paths: Record<NodeId, number[]> = {
    center: [0, 4],
    top: [1, 2, 3],
    left: [1, 2],
    right: [0, 5],
    upperLeft: [0, 3, 4, 5],
    upperRight: [0, 1, 3],
    bottom: [0, 3, 4, 5],
  };
  return paths[node.id];
}

function activePorts(node: NetworkNode, rotation: number) {
  return new Set(basePorts(node).map((port) => (port + rotation) % 6));
}

function inspectNetwork(rotations: Record<NodeId, number>) {
  const ports = Object.fromEntries(nodes.map((node) => [node.id, activePorts(node, rotations[node.id])])) as Record<NodeId, Set<number>>;
  const traversable = edges.filter((edge) => ports[edge.from].has(edge.fromPort) && ports[edge.to].has(edge.toPort));
  const reached = new Set<NodeId>(["center"]);

  let changed = true;
  while (changed) {
    changed = false;
    traversable.forEach((edge) => {
      if (reached.has(edge.from) && !reached.has(edge.to)) { reached.add(edge.to); changed = true; }
      if (reached.has(edge.to) && !reached.has(edge.from)) { reached.add(edge.from); changed = true; }
    });
  }

  const reachedOuter = new Set(
    outerCircles.filter((circle) => reached.has(circle.node) && ports[circle.node].has(circle.port)).map((circle) => circle.id)
  );
  return { ports, traversable, reached, reachedOuter, count: reachedOuter.size };
}

function edgeKey(edge: Edge) {
  return `${edge.from}-${edge.to}`;
}

function TargetCount({ count }: { count: number }) {
  return (
    <div className="hex-code-target" aria-label={`${count} cirkler`}>
      <span>
        {Array.from({ length: count }, (_, index) => <i key={index} />)}
      </span>
    </div>
  );
}

export function HexRouteCode({ nextSlug }: { nextSlug: string }) {
  const router = useRouter();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [rotations, setRotations] = useState(initialRotations);
  const [entered, setEntered] = useState("");
  const [scanning, setScanning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [reachedOuter, setReachedOuter] = useState<Set<string>>(new Set());
  const network = inspectNetwork(rotations);
  const showSignal = scanning || reachedOuter.size > 0;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function rotateNode(id: NodeId) {
    if (scanning || solved) return;
    setReachedOuter(new Set());
    setRotations((current) => ({ ...current, [id]: current[id] + 1 }));
  }

  function inputNumber() {
    if (scanning || solved || entered.length >= targetCode.length) return;
    const result = inspectNetwork(rotations);
    const nextCode = `${entered}${result.count}`;
    setScanning(true);
    setReachedOuter(new Set());

    timers.current.push(setTimeout(() => setReachedOuter(result.reachedOuter), 420));
    timers.current.push(setTimeout(() => {
      setEntered(nextCode);
      setScanning(false);
      if (nextCode === targetCode) {
        setSolved(true);
        timers.current.push(setTimeout(() => router.push(`/information/${nextSlug}`), 1250));
      }
    }, 1050));
  }

  function deleteNumber() {
    if (scanning || solved) return;
    setReachedOuter(new Set());
    setEntered((current) => current.slice(0, -1));
  }

  return (
    <section className={`hex-code ${scanning ? "hex-code--scanning" : ""} ${solved ? "hex-code--solved" : ""}`}>
      <div className="hex-code__targets" aria-label="Målkode">
        {targetCounts.map((count, index) => <TargetCount count={count} key={index} />)}
      </div>

      <div className="hex-network" aria-label="Roterbart forbindelsesnet">
        <svg className="hex-network__routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map((edge) => {
            const from = nodeById[edge.from];
            const to = nodeById[edge.to];
            const active = network.traversable.some((candidate) => edgeKey(candidate) === edgeKey(edge));
            const reached = showSignal && active && network.reached.has(edge.from) && network.reached.has(edge.to);
            return <line className={`${active ? "is-active" : ""} ${reached ? "is-reached" : ""}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} key={edgeKey(edge)} />;
          })}
          {outerCircles.map((circle) => {
            const node = nodeById[circle.node];
            const active = network.ports[circle.node].has(circle.port);
            const reached = showSignal && reachedOuter.has(circle.id);
            return <line className={`${active ? "is-active" : ""} ${reached ? "is-reached" : ""}`} x1={node.x} y1={node.y} x2={circle.x} y2={circle.y} key={circle.id} />;
          })}
        </svg>

        {nodes.map((node) => (
          <button
            className={`hex-node hex-node--${node.size} ${showSignal && network.reached.has(node.id) ? "hex-node--reached" : ""}`}
            type="button"
            style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as CSSProperties}
            aria-label={`Rotér ${node.id === "center" ? "midterste" : "sekskant"}`}
            onClick={() => rotateNode(node.id)}
            key={node.id}
          >
            <svg viewBox="0 0 100 100" style={{ transform: `rotate(${rotations[node.id] * 60}deg)` }} aria-hidden="true">
              {basePorts(node).map((port) => {
                const angle = (port * 60 - 90) * Math.PI / 180;
                return <line x1="50" y1="50" x2={50 + Math.cos(angle) * 48} y2={50 + Math.sin(angle) * 48} key={port} />;
              })}
              <circle cx="50" cy="50" r={node.id === "center" ? 12 : 6} />
            </svg>
          </button>
        ))}

        {outerCircles.map((circle) => (
          <span
            className={`hex-outer-circle ${reachedOuter.has(circle.id) ? "hex-outer-circle--reached" : ""}`}
            style={{ "--circle-x": `${circle.x}%`, "--circle-y": `${circle.y}%` } as CSSProperties}
            key={circle.id}
          />
        ))}
      </div>

      <div className="hex-code__display" aria-label={`Indtastet kode: ${entered || "tom"}`}>
        {Array.from({ length: 4 }, (_, index) => <span className={entered[index] ? "is-filled" : ""} key={index}>{entered[index] ?? ""}</span>)}
      </div>
      <div className="hex-code__controls">
        <button type="button" onClick={deleteNumber} disabled={scanning || solved || entered.length === 0}>Slet tal</button>
        <button type="button" onClick={inputNumber} disabled={scanning || solved || entered.length === 4}>{scanning ? "Kontrollerer…" : "Indsæt tal"}</button>
      </div>
    </section>
  );
}
