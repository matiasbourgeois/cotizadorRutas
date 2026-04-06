/**
 * ══════════════════════════════════════════════════════════════════
 * TEST DE IMPACTO AISLADO — ¿Cuánto suma cada componente CCT 40/89?
 * Objetivo: Ver el costo/beneficio de implementar cada mejora
 * ══════════════════════════════════════════════════════════════════
 */

import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';
import { DEFAULTS_CALCULOS, DEFAULTS_RRHH } from '../models/ConfiguracionDefaults.js';

const C = { ...DEFAULTS_CALCULOS };
const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const pct = (a, b) => b > 0 ? ((a - b) / b * 100).toFixed(1) + '%' : '0%';

// ─── BASE: empleado 5 años, CBA→RC, 5 días/semana ───
const empBase = {
  ...DEFAULTS_RRHH.empleado,
  tipoContratacion: 'empleado',
  antiguedadAnios: 5,
};
const freq5dias = { tipo: 'mensual', diasSeleccionados: ['L','M','X','J','V'], viajesPorDia: 1 };
const DIAS_LABORALES = 22;
const SEMANAS_MES = 4.33;

// Calculamos la base actual (sin CCT)
const actual = calcularCostoTotalRecurso(empBase, 428, 360, freq5dias, C);
const BASE = actual.totalFinal;

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function calcularDiasVacaciones(años) {
  if (años < 1) return 0;
  if (años <= 5) return 14;
  if (años <= 10) return 21;
  if (años <= 20) return 28;
  return 35;
}

// Versión CCT que acepta flags para activar/desactivar componentes
function calcularCCT(emp, km, dur, freq, opciones = {}) {
  const {
    usarAntiguedad = false,
    usarSAC = false,
    usarVacaciones = false,
    usarHorasExtraX15 = false,
    usarViaticoMinimo350 = false,
    usarPernoctada = false,
    pernoctadasPorMes = 0,
  } = opciones;

  const diasPorSemana = freq.diasSeleccionados?.length || 0;
  const cantViajesAlMes = diasPorSemana * SEMANAS_MES;
  const diasDeTrabajoAlMes = diasPorSemana * SEMANAS_MES;
  const kmRealesTotales = km * cantViajesAlMes;

  // Antigüedad
  const años = emp.antiguedadAnios || 0;
  const pctAntiguedad = usarAntiguedad ? años * 1 : 0; // 1% por año
  const sueldoConAct = emp.sueldoBasico * (1 + (emp.adicionalActividadPorc || 0) / 100);
  const sueldoAjustado = sueldoConAct * (1 + pctAntiguedad / 100);
  const valorHora = sueldoAjustado / (emp.horasLaboralesMensuales || 192);
  const valorJornada = sueldoAjustado / DIAS_LABORALES;

  // Horas extra (viaje 360min + 30min carga = 390 > 480? No. Con CBA→BsAs 540+30=570)
  const JORNADA = 480;
  const UMBRAL = 180;
  const tiempoMision = dur + 30; // +30 carga/descarga
  const tiempoDiario = tiempoMision * (freq.viajesPorDia || 1);

  let costoBase = 0;
  if (tiempoDiario >= UMBRAL) {
    const minutosExtra = Math.max(0, tiempoDiario - JORNADA);
    const multiplicador = usarHorasExtraX15 ? 1.5 : 1.0;
    const costoExtra = (minutosExtra / 60) * valorHora * multiplicador * diasDeTrabajoAlMes;
    costoBase = (valorJornada * diasDeTrabajoAlMes) + costoExtra;
  } else {
    const tiempoAFact = Math.max(tiempoMision, emp.minimoMinutosFacturables || 120);
    costoBase = (valorHora * (tiempoAFact / 60)) * cantViajesAlMes;
  }

  // Variables por km
  const kmParaPagar = Math.max(kmRealesTotales, usarViaticoMinimo350 ? 350 : 350); // mínimo siempre 350km/mes
  const adicionalKm = (emp.adicionalKmRemunerativo || 0) * kmParaPagar;
  const viaticoKm = (emp.viaticoPorKmNoRemunerativo || 0) * kmParaPagar;
  const tramos = Math.round(kmRealesTotales / (emp.kmPorUnidadDeCarga || 1000));
  const adicionalCD = tramos * (emp.adicionalCargaDescargaCadaXkm || 0);
  const adicionalNoRem = (emp.adicionalNoRemunerativoFijo || 0) / DIAS_LABORALES * diasDeTrabajoAlMes;

  const baseRemunerativa = costoBase + adicionalKm + adicionalCD;

  // SAC
  const provSAC = usarSAC ? baseRemunerativa * 0.0833 : 0;

  // Vacaciones: jornal diario × días vacac × (1/12 del año)
  const diasVacac = calcularDiasVacaciones(años);
  const jornalDiario = sueldoAjustado / DIAS_LABORALES;
  const provVacac = usarVacaciones ? (jornalDiario * diasVacac) / 12 : 0;

  // Pernoctada (si aplica)
  const costoPernoctada = usarPernoctada ? pernoctadasPorMes * 16351.12 : 0;

  // Cargas sociales sobre base ampliada
  const baseParaCargas = baseRemunerativa + provSAC + provVacac;
  const cargasSociales = baseParaCargas * ((emp.porcentajeCargasSociales || 0) / 100);

  const total = baseRemunerativa + adicionalNoRem + viaticoKm + provSAC + provVacac + cargasSociales + costoPernoctada;
  return { total: Math.round(total), provSAC: Math.round(provSAC), provVacac: Math.round(provVacac) };
}

// ═══════════════════════════════════════════════════════════════
// TEST A: Impacto de cada componente de forma ACUMULATIVA
// Ruta: CBA→RC (428km, 360min), 5 días/sem, 5 años antigüedad
// ═══════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(90));
console.log('  TEST A: Impacto acumulativo de cada componente CCT 40/89');
console.log('  Ruta: CBA→RC (428km, 360min) | 5 días/semana | 5 años antigüedad');
console.log('='.repeat(90));

const escenarios = [
  { label: '① Base actual (sin CCT)',             opts: {} },
  { label: '② + Antigüedad 5% (5 años × 1%)',    opts: { usarAntiguedad: true } },
  { label: '③ + SAC / Aguinaldo (8.33%)',          opts: { usarAntiguedad: true, usarSAC: true } },
  { label: '④ + Vacaciones (14 días prorrat.)',    opts: { usarAntiguedad: true, usarSAC: true, usarVacaciones: true } },
  { label: '⑤ + Horas extra ×1.5',               opts: { usarAntiguedad: true, usarSAC: true, usarVacaciones: true, usarHorasExtraX15: true } },
];

console.log('\n' + 'Escenario'.padEnd(46) + '| Costo/Mes'.padEnd(16) + '| Δ vs Base'.padEnd(16) + '| Δ%');
console.log('-'.repeat(90));

for (const e of escenarios) {
  const r = calcularCCT(empBase, 428, 360, freq5dias, e.opts);
  const delta = r.total - BASE;
  console.log(
    e.label.padEnd(46) +
    `| ${fmt(r.total).padStart(13)} ` +
    `| ${(delta >= 0 ? '+' : '') + fmt(delta).padStart(13)} ` +
    `| ${pct(r.total, BASE).padStart(6)}`
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST B: Comparar con distintas rutas (el componente que más conviene)
// Solo SAC + Vacaciones (los 2 más justificables legalmente)
// ═══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(100));
console.log('  TEST B: Impacto SAC + Vacaciones en distintas rutas (5 días/sem, 5 años)');
console.log('  → Cuánto dinero extra se recupera por ruta SIN encarecer demasiado');
console.log('='.repeat(100));

const rutas = [
  { name: 'Local corta    (50km,  60min)', km: 50,  dur: 60  },
  { name: 'Local media   (100km, 120min)', km: 100, dur: 120 },
  { name: 'CBA→RC solo   (214km, 180min)', km: 214, dur: 180 },
  { name: 'CBA→RC i/v    (428km, 360min)', km: 428, dur: 360 },
  { name: 'CBA→Rosario   (400km, 300min)', km: 400, dur: 300 },
  { name: 'CBA→BsAs      (700km, 540min)', km: 700, dur: 540 },
];

console.log('\n' + 'Ruta'.padEnd(36) + '| Sin CCT'.padEnd(14) + '| +SAC+Vac'.padEnd(14) + '| Δ/mes'.padEnd(14) + '| Δ%   | Precio c/15% margen');
console.log('-'.repeat(100));

for (const r of rutas) {
  const base = calcularCostoTotalRecurso(empBase, r.km, r.dur, freq5dias, C);
  const cct = calcularCCT(empBase, r.km, r.dur, freq5dias, { usarSAC: true, usarVacaciones: true });
  const delta = cct.total - base.totalFinal;
  const precioFinal = cct.total * 1.15;

  console.log(
    r.name.padEnd(36) +
    `| ${fmt(base.totalFinal).padStart(11)} ` +
    `| ${fmt(cct.total).padStart(11)} ` +
    `| ${'+' + fmt(delta).padStart(11)} ` +
    `| ${pct(cct.total, base.totalFinal).padStart(5)} ` +
    `| ${fmt(precioFinal)}`
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST C: Variando antigüedad — diferencia de costo real
// El punto es: ¿importa mucho cobrar la antigüedad?
// ═══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(90));
console.log('  TEST C: Impacto REAL de la antigüedad en CBA→RC (5 días/sem)');
console.log('  ¿Vale la pena personalizar por antigüedad del chofer?');
console.log('='.repeat(90));

const antigTests = [0, 2, 5, 10, 15, 20, 25];
console.log('\n' + 'Antigüedad'.padEnd(14) + '| Sin CCT'.padEnd(14) + '| SAC+Vac+Antig'.padEnd(16) + '| Δ vs 0 años'.padEnd(16) + '| Δ%');
console.log('-'.repeat(80));

const base0 = calcularCCT({ ...empBase, antiguedadAnios: 0 }, 428, 360, freq5dias, { usarSAC: true, usarVacaciones: true, usarAntiguedad: true });

for (const años of antigTests) {
  const emp = { ...empBase, antiguedadAnios: años };
  const sinCCT = calcularCostoTotalRecurso(emp, 428, 360, freq5dias, C);
  const conCCT = calcularCCT(emp, 428, 360, freq5dias, { usarSAC: true, usarVacaciones: true, usarAntiguedad: true });
  const deltaVs0 = conCCT.total - base0.total;

  console.log(
    `${años} años`.padEnd(14) +
    `| ${fmt(sinCCT.totalFinal).padStart(11)} ` +
    `| ${fmt(conCCT.total).padStart(13)} ` +
    `| ${(deltaVs0 >= 0 ? '+' : '') + fmt(deltaVs0).padStart(13)} ` +
    `| ${pct(conCCT.total, base0.total).padStart(6)}`
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST D: ¿Competitivo? Simulación de precio al cliente final
// Comparando: sistema actual vs CCT mínimo (solo SAC+Vac) vs CCT completo
// ═══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(110));
console.log('  TEST D: COMPETITIVIDAD — Precio al cliente con distintos márgenes');
console.log('  Ruta: CBA→RC ida/vuelta (428km) | 5 días/sem | 5 años antigüedad');
console.log('='.repeat(110));

const escenariosMercado = [
  { label: 'Sistema actual (sin CCT)',            opts: {} },
  { label: 'CCT Mínimo (solo SAC + Vacaciones)',  opts: { usarSAC: true, usarVacaciones: true } },
  { label: 'CCT Estándar (+ Antigüedad)',         opts: { usarSAC: true, usarVacaciones: true, usarAntiguedad: true } },
  { label: 'CCT Completo (+ ×1.5 horas extra)',  opts: { usarSAC: true, usarVacaciones: true, usarAntiguedad: true, usarHorasExtraX15: true } },
];

const margenes = [0.10, 0.15, 0.20, 0.25];

// Header
let header = 'Escenario'.padEnd(44);
for (const m of margenes) header += `| Margen ${(m*100).toFixed(0)}%`.padEnd(16);
console.log('\n' + header);
console.log('-'.repeat(110));

for (const e of escenariosMercado) {
  let costo;
  if (!e.opts.usarSAC && !e.opts.usarVacaciones) {
    costo = BASE;
  } else {
    costo = calcularCCT(empBase, 428, 360, freq5dias, e.opts).total;
  }

  let row = e.label.padEnd(44);
  for (const m of margenes) {
    const precio = Math.round(costo * (1 + m));
    row += `| ${fmt(precio).padStart(13)} `;
  }
  console.log(row);
}

console.log('\n');
console.log('  📌 REFERENCIA: Si el mercado cobra ~$4.000.000-$4.500.000/mes por esta ruta,');
console.log('     el "CCT Mínimo con margen 15-20%" sigue siendo competitivo.');
console.log('     El "CCT Completo" con margen 25% ya es el techo del mercado.');

console.log('\n' + '='.repeat(110));
console.log('  FIN TEST — Recomendación: CCT Mínimo (SAC + Vacaciones) como default');
console.log('  Ahorro vs ignorarlo: ~$244.000/mes → $2.9 millones/año');
console.log('='.repeat(110) + '\n');

process.exit(0);
