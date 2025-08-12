// Archivo: src/components/TypingText.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function TypingText({
  text = "",
  speed = 25,        // ms por carácter
  startDelay = 120,  // retardo inicial
  showCursor = true,
  className,
  style,
  onDone,
}) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  // ⬇️ IMPORTANTE: guardamos el callback en un ref para no reiniciar el efecto
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  const timerRef = useRef({ start: null, tick: null });

  // Respeta "reduced motion" del SO
  const reduced = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const full = String(text ?? "");

    if (reduced) {
      setOut(full);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setOut("");
    setDone(false);
    clearTimeout(timerRef.current.start);
    clearTimeout(timerRef.current.tick);

    let i = 0;
    timerRef.current.start = setTimeout(function tick() {
      if (i <= full.length) {
        setOut(full.slice(0, i));
        i += 1;
        timerRef.current.tick = setTimeout(tick, speed);
      } else {
        setDone(true);
        onDoneRef.current?.();
      }
    }, Math.max(0, startDelay));

    return () => {
      clearTimeout(timerRef.current.start);
      clearTimeout(timerRef.current.tick);
    };
    // ⬇️ OJO: NO dependemos de onDone (usa el ref)
  }, [text, speed, startDelay, reduced]);

  return (
    <span
      className={className}
      style={{ whiteSpace: "pre-wrap", ...style }}
      aria-live="polite"
    >
      {out}
      {showCursor && !done ? <span className="typing-cursor">|</span> : null}
    </span>
  );
}
