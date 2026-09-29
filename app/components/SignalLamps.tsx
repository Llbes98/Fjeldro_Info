"use client";

import { useEffect, useState } from "react";

const sequence = [
  [6, 3],
  [6, 8],
  [1, 7],
  [6, 2],
  [6, 7],
  [3, 8],
];

const SIGNAL_TIME = 720;
const SHORT_PAUSE = 480;
const LONG_PAUSE = 2800;

export function SignalLamps() {
  const [activeLamps, setActiveLamps] = useState<number[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    function wait(duration: number) {
      return new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, duration);
      });
    }

    async function play() {
      await wait(900);

      while (!cancelled) {
        for (let index = 0; index < sequence.length; index += 1) {
          if (cancelled) return;
          setStep(index + 1);
          setActiveLamps(sequence[index]);
          await wait(SIGNAL_TIME);
          if (cancelled) return;
          setActiveLamps([]);
          await wait(index === sequence.length - 1 ? LONG_PAUSE : SHORT_PAUSE);
        }
      }
    }

    play();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="signal-board" aria-label="Automatisk signalvisning">
      <div className="signal-board__header">
        <div><span>Signalkreds</span><strong>Aktiv transmission</strong></div>
        <div className="signal-board__pulse"><i /> sekvens {String(step).padStart(2, "0")}/06</div>
      </div>
      <div className="signal-board__lamps">
        {Array.from({ length: 8 }, (_, index) => {
          const lampNumber = index + 1;
          const isActive = activeLamps.includes(lampNumber);
          return (
            <div
              className={`signal-lamp signal-lamp--${lampNumber} ${isActive ? "signal-lamp--active" : ""}`}
              key={lampNumber}
              aria-label={`Lampe ${lampNumber}${isActive ? " lyser" : " er slukket"}`}
            >
              <i />
            </div>
          );
        })}
      </div>
      <div className="signal-board__footer">
        <span>Automatisk gentagelse</span>
        <span>To kanaler pr. signal</span>
      </div>
    </section>
  );
}
