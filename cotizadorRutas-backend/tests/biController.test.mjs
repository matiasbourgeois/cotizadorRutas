/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BI CONTROLLER — Tests de helpers puros
 * ═══════════════════════════════════════════════════════════════════════════
 * Cómo correr: node tests/biController.test.mjs
 *
 * Testea las funciones helper del BI controller (parsearPeriodo, formatearMes)
 * sin necesidad de MongoDB ni Express.
 */

const R='\x1b[0m',B='\x1b[1m',G='\x1b[32m',GR='\x1b[90m',E='\x1b[31m',C='\x1b[36m',M='\x1b[35m';
let pasados=0,fallados=0;

function chk(ok,label,det=''){
  if(ok){pasados++;console.log(`  ${G}✅${R} ${label}`)}
  else{fallados++;console.log(`  ${E}❌${R} ${label}`);if(det)console.log(`     ${GR}↳ ${det}${R}`)}
}

// ── Reimplementar las funciones helper (son internas al controller) ──────────
// Las copiamos aquí para testearlas de forma aislada.

function parsearPeriodo(periodo) {
  const hoy = new Date();
  switch (periodo) {
    case '1m':
      return { fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1), mesesTendencia: 2 };
    case '3m':
      return { fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1), mesesTendencia: 3 };
    case '6m':
      return { fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1), mesesTendencia: 6 };
    case '1y':
      return { fechaInicio: new Date(hoy.getFullYear() - 1, hoy.getMonth(), 1), mesesTendencia: 12 };
    case 'all':
    default:
      return { fechaInicio: null, mesesTendencia: 12 };
  }
}

function formatearMes(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const nombre = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}${C}  📊  BI CONTROLLER — Helpers & Períodos${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

const hoy = new Date();

// B-01: parsearPeriodo('1m')
console.log(`${B}${M}  ─── parsearPeriodo ───${R}\n`);
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('1m');
  const esperado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  chk(fechaInicio.getTime() === esperado.getTime(), 'B-01: 1m → fecha inicio correcta', fechaInicio.toISOString());
  chk(mesesTendencia === 2, 'B-01b: 1m → mesesTendencia = 2');
}

// B-02: parsearPeriodo('6m')
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('6m');
  const esperado = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
  chk(fechaInicio.getTime() === esperado.getTime(), 'B-02: 6m → fecha inicio correcta', fechaInicio.toISOString());
  chk(mesesTendencia === 6, 'B-02b: 6m → mesesTendencia = 6');
}

// B-03: parsearPeriodo('1y')
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('1y');
  const esperado = new Date(hoy.getFullYear() - 1, hoy.getMonth(), 1);
  chk(fechaInicio.getTime() === esperado.getTime(), 'B-03: 1y → fecha inicio correcta', fechaInicio.toISOString());
  chk(mesesTendencia === 12, 'B-03b: 1y → mesesTendencia = 12');
}

// B-04: parsearPeriodo('all')
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('all');
  chk(fechaInicio === null, 'B-04: all → fechaInicio = null');
  chk(mesesTendencia === 12, 'B-04b: all → mesesTendencia = 12');
}

// B-05: parsearPeriodo con valor inválido
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('xyz');
  chk(fechaInicio === null, 'B-05: input inválido → fallback a all (null)');
  chk(mesesTendencia === 12, 'B-05b: input inválido → mesesTendencia = 12');
}

// B-06: parsearPeriodo('3m')
{
  const { fechaInicio, mesesTendencia } = parsearPeriodo('3m');
  const esperado = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1);
  chk(fechaInicio.getTime() === esperado.getTime(), 'B-06: 3m → fecha correcta', fechaInicio.toISOString());
  chk(mesesTendencia === 3, 'B-06b: 3m → mesesTendencia = 3');
}

// formatearMes tests
console.log(`\n${B}${M}  ─── formatearMes ───${R}\n`);
{
  const meses = [
    ['2026-01', 'Ene'], ['2026-02', 'Feb'], ['2026-03', 'Mar'],
    ['2026-04', 'Abr'], ['2026-05', 'May'], ['2026-06', 'Jun'],
    ['2026-07', 'Jul'], ['2026-08', 'Ago'], ['2026-09', 'Sept'],
    ['2026-10', 'Oct'], ['2026-11', 'Nov'], ['2026-12', 'Dic'],
  ];
  for (const [input, expected] of meses) {
    const result = formatearMes(input);
    chk(result === expected, `B-07: formatearMes('${input}') = '${expected}'`, `got: '${result}'`);
  }
}

// RESUMEN
const total=pasados+fallados;
console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}  🏁  BI CONTROLLER — RESULTADO${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`  ${G}✅  Pasados: ${pasados} / ${total}${R}`);
if(fallados>0){console.log(`  ${E}❌  Fallados: ${fallados}${R}`)}
else{console.log(`\n  ${G}${B}📊  ¡BI HELPERS VERIFICADOS!${R}`)}
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);
if(fallados>0) process.exit(1);
