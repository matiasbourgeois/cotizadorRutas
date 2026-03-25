
import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import './Asistente.css';
import TypingText from './TypingText';

const TYPING_SPEED = 25;
const BASE_DELAY   = 120;

// Sequential paragraph typing within a single tip
function ParrafosSecuenciales({ texto, onDone, initialDelayMs = 0 }) {
  const parrafos = useMemo(
    () => String(texto ?? '').split(/\n\s*\n/),
    [texto]
  );

  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setCurrent(0);
    setFinished(false);
  }, [texto]);

  useEffect(() => {
    if (!finished && current >= parrafos.length) {
      setFinished(true);
      onDone?.();
    }
  }, [current, parrafos.length, finished, onDone]);

  return (
    <>
      {parrafos.map((p, i) => {
        if (i < current) {
          return (
            <div key={i} className="ai-tip">
              <div className="ai-tip-bullet" />
              <span className="ai-tip-text">{p}</span>
            </div>
          );
        }
        if (i === current) {
          return (
            <div key={i} className="ai-tip">
              <div className="ai-tip-bullet" />
              <span className="ai-tip-text">
                <TypingText
                  text={p}
                  speed={TYPING_SPEED}
                  startDelay={i === 0 ? initialDelayMs : 0}
                  showCursor
                  onDone={() => setCurrent((prev) => prev + 1)}
                />
              </span>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

// Static tip (already typed)
function TipEstatico({ texto }) {
  const parrafos = useMemo(
    () => String(texto ?? '').split(/\n\s*\n/),
    [texto]
  );
  return (
    <>
      {parrafos.map((p, i) => (
        <div key={i} className="ai-tip">
          <div className="ai-tip-bullet" />
          <span className="ai-tip-text">{p}</span>
        </div>
      ))}
    </>
  );
}

const AsistenteContextual = ({ consejos }) => {
  if (!consejos || consejos.length === 0) return null;

  const [activeTip, setActiveTip] = useState(0);

  const consejosKey = useMemo(
    () => (consejos || []).map(t => t?.texto ?? '').join('||'),
    [consejos]
  );

  useEffect(() => {
    setActiveTip(0);
  }, [consejosKey]);

  return (
    <div className="ai-card">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-icon"><Sparkles size={13} /></div>
        <span className="ai-title">Asistente IA</span>
        <span className="ai-subtitle">Auto-generado</span>
      </div>

      {/* Tips */}
      <div className="ai-tips">
        {consejos.map((tip, i) => {
          if (i < activeTip) {
            return <TipEstatico key={i} texto={tip?.texto} />;
          }
          if (i === activeTip) {
            return (
              <ParrafosSecuenciales
                key={i}
                texto={tip?.texto}
                initialDelayMs={i === 0 ? BASE_DELAY : 0}
                onDone={() => setActiveTip((prev) => prev + 1)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default AsistenteContextual;
