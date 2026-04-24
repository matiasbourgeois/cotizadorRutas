/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 MEGA RUNNER — Quotargo Test Suite Completa
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cómo correr:
 *   node tests/runAll.mjs
 *
 * Ejecuta las 5 suites de test en secuencia y reporta un resumen final.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const R  = '\x1b[0m';
const B  = '\x1b[1m';
const G  = '\x1b[32m';
const E  = '\x1b[31m';
const C  = '\x1b[36m';
const W  = '\x1b[33m';
const M  = '\x1b[35m';

const SUITES = [
  { name: '🧮 Motor de Cálculo (CCT 40/89)',    file: 'tests/motorCalculo.test.mjs' },
  { name: '⚡ Edge Cases (inputs extremos)',      file: 'tests/motorCalculo.edgeCases.test.mjs' },
  { name: '📐 Consolidación (invariantes)',       file: 'tests/consolidacion.test.mjs' },
  { name: '🔒 Seguridad (datos sensibles)',       file: 'tests/seguridad.test.mjs' },
  { name: '📊 BI Controller (helpers)',           file: 'tests/biController.test.mjs' },
];

console.log(`\n${B}${M}${'█'.repeat(70)}${R}`);
console.log(`${B}${M}  🚀  QUOTARGO — MEGA TEST SUITE${R}`);
console.log(`${B}${M}      ${SUITES.length} suites · Ejecución secuencial completa${R}`);
console.log(`${B}${M}${'█'.repeat(70)}${R}\n`);

let suitesPasadas = 0;
let suitesFalladas = 0;
const resultados = [];

for (const suite of SUITES) {
  console.log(`${B}${C}${'─'.repeat(70)}${R}`);
  console.log(`${B}${C}  ▶ ${suite.name}${R}`);
  console.log(`${B}${C}${'─'.repeat(70)}${R}\n`);

  const start = Date.now();
  try {
    execSync(`node ${suite.file}`, {
      cwd: root,
      stdio: 'inherit',
      timeout: 30000,
    });
    const elapsed = Date.now() - start;
    suitesPasadas++;
    resultados.push({ ...suite, ok: true, ms: elapsed });
  } catch (err) {
    const elapsed = Date.now() - start;
    suitesFalladas++;
    resultados.push({ ...suite, ok: false, ms: elapsed });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RESUMEN FINAL
// ═══════════════════════════════════════════════════════════════════════════

console.log(`\n${B}${M}${'█'.repeat(70)}${R}`);
console.log(`${B}${M}  🏁  RESUMEN FINAL — QUOTARGO TEST SUITE${R}`);
console.log(`${B}${M}${'█'.repeat(70)}${R}\n`);

for (const r of resultados) {
  const icon = r.ok ? `${G}✅` : `${E}❌`;
  const time = `${r.ms}ms`;
  console.log(`  ${icon}  ${r.name.padEnd(45)} ${time.padStart(8)}${R}`);
}

const totalSuites = suitesPasadas + suitesFalladas;
console.log(`\n  ${'─'.repeat(60)}`);
console.log(`  ${G}✅  Suites OK: ${suitesPasadas} / ${totalSuites}${R}`);

if (suitesFalladas > 0) {
  console.log(`  ${E}❌  Suites FAIL: ${suitesFalladas} / ${totalSuites}${R}`);
  console.log(`\n  ${W}⚠️  Revisá las suites marcadas con ❌ arriba.${R}`);
} else {
  console.log(`\n  ${G}${B}🎉  ¡TODAS LAS SUITES PASARON!${R}`);
  console.log(`  ${G}     El sistema está blindado: motor, edge cases,${R}`);
  console.log(`  ${G}     invariantes, seguridad y BI verificados.${R}`);
}

console.log(`\n${B}${M}${'█'.repeat(70)}${R}\n`);

if (suitesFalladas > 0) process.exit(1);
