export function SnowScene() {
  return (
    <div className="snow-scene" aria-hidden="true">
      <span className="flake flake--one">✦</span>
      <span className="flake flake--two">✧</span>
      <span className="flake flake--three">✦</span>
      <div className="ridge ridge--back" />
      <div className="ridge ridge--front" />
      <div className="tree-line">{Array.from({ length: 17 }, (_, i) => <i key={i} />)}</div>
    </div>
  );
}
