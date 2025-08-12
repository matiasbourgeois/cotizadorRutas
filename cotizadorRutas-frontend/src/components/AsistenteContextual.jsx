// Archivo: cotizadorRutas-frontend/src/components/AsistenteContextual.jsx

import { useEffect, useMemo, useState } from 'react';
import { Paper, Title, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { HelpCircle } from 'lucide-react';
import './Asistente.css';
import TypingText from './TypingText';

const TYPING_SPEED = 25;   // ms por carácter
const BASE_DELAY   = 120;  // retardo inicial del primer tip

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

// Muestra los párrafos de un tip en serie (uno tras otro)
function ParrafosSecuenciales({ texto, onDone, initialDelayMs = 0 }) {
  const parrafos = useMemo(
    () => String(texto ?? '').split(/\n\s*\n/),
    [texto]
  );

  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  // Reiniciar cuando cambia el texto
  useEffect(() => {
    setCurrent(0);
    setFinished(false);
  }, [texto]);

  // Avisar al padre cuando se terminaron todos los párrafos
  useEffect(() => {
    if (!finished && current >= parrafos.length) {
      setFinished(true);
      onDone?.();
    }
  }, [current, parrafos.length, finished, onDone]);

  return (
    <Stack gap={4}>
      {parrafos.map((p, i) => {
        if (i < current) {
          // ya terminado: texto completo, sin cursor
          return (
            <Text key={i} size="sm" c="dimmed">
              {p}
            </Text>
          );
        }
        if (i === current) {
          // activo: se tipea; cuando termina, avanza al siguiente
          return (
            <Text key={i} size="sm" c="dimmed">
              <TypingText
                text={p}
                speed={TYPING_SPEED}
                startDelay={i === 0 ? initialDelayMs : 0}
                showCursor
                onDone={() => setCurrent((prev) => prev + 1)}
              />
            </Text>
          );
        }
        // futuros: aún no se montan
        return null;
      })}
    </Stack>
  );
}

// Render estático de un tip (para los ya finalizados)
function TipEstatico({ texto }) {
  const parrafos = useMemo(
    () => String(texto ?? '').split(/\n\s*\n/),
    [texto]
  );
  return (
    <Stack gap={4}>
      {parrafos.map((p, i) => (
        <Text key={i} size="sm" c="dimmed">
          {p}
        </Text>
      ))}
    </Stack>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────

const AsistenteContextual = ({ consejos }) => {
  if (!consejos || consejos.length === 0) return null;

  // Secuencia total: un tip por vez
  const [activeTip, setActiveTip] = useState(0);

  // Clave textual estable: solo cambia si cambia el contenido de los tips
  const consejosKey = useMemo(
    () => (consejos || []).map(t => t?.texto ?? '').join('||'),
    [consejos]
  );

  // Reiniciar la secuencia solo cuando cambie el contenido real
  useEffect(() => {
    setActiveTip(0);
  }, [consejosKey]);

  return (
    <Paper withBorder p="md" mt="md" radius="md" shadow="sm">
      <Group mb="sm">
        <ThemeIcon variant="filled" color="cyan" size="lg" radius="xl" className="icon-pulse">
          <HelpCircle size={18} />
        </ThemeIcon>
  <Title order={5} c="deep-blue.7">Asistente IA</Title>
  <Text size="xs" c="dimmed" aria-label="descargo">Sugerencias generadas automáticamente</Text>


      </Group>

      <Stack gap="md">
        {consejos.map((tip, i) => {
          if (i < activeTip) {
            // tips anteriores: ya completos (sin animación)
            return <TipEstatico key={i} texto={tip?.texto} />;
          }
          if (i === activeTip) {
            // tip activo: animar párrafos en serie
            return (
              <ParrafosSecuenciales
                key={i}
                texto={tip?.texto}
                initialDelayMs={i === 0 ? BASE_DELAY : 0}
                onDone={() => setActiveTip((prev) => prev + 1)}
              />
            );
          }
          // tips futuros: aún no se montan
          return null;
        })}
      </Stack>
    </Paper>
  );
};

export default AsistenteContextual;
