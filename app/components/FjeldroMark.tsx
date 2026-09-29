export function FjeldroMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand--compact" : ""}`} aria-label="Fjeldro Skiresort">
      <svg viewBox="0 0 120 58" role="img" aria-hidden="true">
        <path d="M8 47 35 15l13 16L61 8l43 39" />
        <path d="m17 47 19-22 11 13 15-20 29 29" />
        <path d="M7 47h99" />
      </svg>
      <div><span>Fjeldro</span><small>SKIRESORT</small></div>
    </div>
  );
}
