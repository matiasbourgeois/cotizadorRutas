/**
 * ══════════════════════════════════════════════════════════════
 * MEGA TEST: Sistema Actual vs Convenio 40/89 Completo
 * ══════════════════════════════════════════════════════════════
 */

import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';
import { DEFAULTS_CALCULOS, DEFAULTS_RRHH } from '../models/ConfiguracionDefaults.js';

// ══════════════════════════════════════════════════════════════
// MOTOR PROPUESTO CON CONVENIO 40/89
// ══════════════════════════════════════════════════════════════

function calcularCostoRecurso_CCT40(recurso, kmsPorViaje, duracionMin, frecuencia, C = {}) {
  const TIEMPO_CARGA_DESCARGA = C.tiempoCargaDescargaMin || 30;
  const UMBRAL_JORNADA_COMPLETA = C.umbralJornadaCompletaMin || 180;
  const JORNADA_COMPLETA_MINUTOS = C.jornadaCompletaMinutos || 480;
  const DIAS_LABORALES = C.diasLaboralesMes || 22;
  const SEMANAS_MES = C.semanasPorMes || 4.33;

  // ═══ NUEVOS PARÁMETROS CCT 40/89 ═══
  const añosAntiguedad = recurso.antiguedadAnios || 0;
  const porcentajeAntiguedad = (recurso.porcentajeAntiguedadAnio || 1) * añosAntiguedad; // 1% por año
  const porcentajeSAC = 8.33; // Aguinaldo = 1/12 = 8.33% (obligatorio)
  const diasVacaciones = calcularDiasVacaciones(añosAntiguedad);
  const porcentajeVacaciones = (diasVacaciones / 365) * 100; // proporción anual

  // Sueldo base + adicional actividad + antigüedad
  const sueldoConActividad = recurso.sueldoBasico * (1 + (recurso.adicionalActividadPorc || 0) / 100);
  const sueldoAjustado = sueldoConActividad * (1 + porcentajeAntiguedad / 100);

  const valorHora = sueldoAjustado / (recurso.horasLaboralesMensuales || 192);
  const valorJornada = sueldoAjustado / DIAS_LABORALES;

  const tiempoTotalMision = duracionMin + TIEMPO_CARGA_DESCARGA;
  const viajesPorDia = frecuencia.viajesPorDia || 1;
  const tiempoDiarioTotal = tiempoTotalMision * viajesPorDia;
  const esServicioMensual = frecuencia.tipo === 'mensual';
  const diasPorSemana = frecuencia.diasSeleccionados?.length || 0;

  const cantidadViajesAlMes = esServicioMensual
    ? diasPorSemana * viajesPorDia * SEMANAS_MES
    : (frecuencia.vueltasTotales || 1);
  const kmRealesTotales = kmsPorViaje * cantidadViajesAlMes;

  const diasDeTrabajoAlMes = esServicioMensual
    ? diasPorSemana * SEMANAS_MES
    : (frecuencia.vueltasTotales || 1);

  let costoBaseRemunerativo = 0;
  let adicionalFijoNoRemunerativo = 0;
  let kilometrosMinimos = 0;
  let detalle = {};

  if (tiempoDiarioTotal < UMBRAL_JORNADA_COMPLETA) {
    detalle.tipoDeCalculo = 'Servicio Corto (Por Hora)';
    kilometrosMinimos = 150;
    const tiempoAFacturar = Math.max(tiempoTotalMision, recurso.minimoMinutosFacturables || 120);
    const costoViajeIndividual = valorHora * (tiempoAFacturar / 60);
    const valorDiarioAdicional = (recurso.adicionalNoRemunerativoFijo || 0) / DIAS_LABORALES;
    const adicionalProrrateadoPorViaje = valorDiarioAdicional * (tiempoAFacturar / JORNADA_COMPLETA_MINUTOS);

    costoBaseRemunerativo = esServicioMensual ? costoViajeIndividual * cantidadViajesAlMes : costoViajeIndividual;
    adicionalFijoNoRemunerativo = esServicioMensual ? adicionalProrrateadoPorViaje * cantidadViajesAlMes : adicionalProrrateadoPorViaje;
  } else {
    detalle.tipoDeCalculo = 'Servicio Dedicado (Por Jornada)';
    kilometrosMinimos = 350;

    // Horas extra con multiplicador correcto (1.5×)
    const minutosExtraPorDia = Math.max(0, tiempoDiarioTotal - JORNADA_COMPLETA_MINUTOS);
    const costoExtraTotalMes = (minutosExtraPorDia / 60) * valorHora * 1.5 * diasDeTrabajoAlMes;
    costoBaseRemunerativo = (valorJornada * diasDeTrabajoAlMes) + costoExtraTotalMes;

    const adicionalDiario = (recurso.adicionalNoRemunerativoFijo || 0) / DIAS_LABORALES;
    adicionalFijoNoRemunerativo = adicionalDiario * diasDeTrabajoAlMes;

    if (minutosExtraPorDia > 0) {
      detalle.horasExtraDia = +(minutosExtraPorDia / 60).toFixed(1);
      detalle.costoHorasExtra = Math.round(costoExtraTotalMes);
    }
  }

  // Variables por km (sin cambios)
  const kmParaPagar = Math.max(kmRealesTotales, kilometrosMinimos * (esServicioMensual ? 1 : cantidadViajesAlMes));
  const adicionalKm = (recurso.adicionalKmRemunerativo || 0) * kmParaPagar;
  const viaticoKm = (recurso.viaticoPorKmNoRemunerativo || 0) * kmParaPagar;
  const tramosDeCarga = recurso.kmPorUnidadDeCarga ? Math.round(kmRealesTotales / recurso.kmPorUnidadDeCarga) : 0;
  const adicionalPorCargaDescarga = tramosDeCarga * (recurso.adicionalCargaDescargaCadaXkm || 0);

  // ═══ CONSOLIDACIÓN CON NUEVOS COMPONENTES ═══
  const baseRemunerativa = costoBaseRemunerativo + adicionalKm + adicionalPorCargaDescarga;

  // SAC (Aguinaldo) — se provisiona sobre todo lo remunerativo
  const provisionSAC = Math.round(baseRemunerativa * porcentajeSAC / 100);

  // Vacaciones — se provisiona sobre el bruto
  const provisionVacaciones = Math.round(baseRemunerativa * porcentajeVacaciones / 100);

  // Cargas sociales — sobre remunerativo + SAC + Vacaciones (porque también pagan cargas)
  const baseParaCargas = baseRemunerativa + provisionSAC + provisionVacaciones;
  let costoIndirecto = 0;

  if (recurso.tipoContratacion === 'empleado') {
    costoIndirecto = baseParaCargas * ((recurso.porcentajeCargasSociales || 0) / 100);
    detalle.costoIndirectoLabel = `Cargas Sociales (${recurso.porcentajeCargasSociales}%)`;
  } else {
    const subtotalBruto = baseParaCargas + adicionalFijoNoRemunerativo + viaticoKm;
    costoIndirecto = subtotalBruto * ((recurso.porcentajeOverheadContratado || 0) / 100);
    detalle.costoIndirectoLabel = `Overhead (${recurso.porcentajeOverheadContratado}%)`;
  }

  const totalFinal = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm
    + provisionSAC + provisionVacaciones + costoIndirecto;

  detalle = {
    ...detalle,
    antiguedadAnios: añosAntiguedad,
    porcentajeAntiguedad,
    sueldoAjustado: Math.round(sueldoAjustado),
    kmRealesTotales: Math.round(kmRealesTotales),
    kmParaPagar: Math.round(kmParaPagar),
    costoBaseRemunerativo: Math.round(costoBaseRemunerativo),
    adicionalFijoNoRemunerativo: Math.round(adicionalFijoNoRemunerativo),
    adicionalKm: Math.round(adicionalKm),
    viaticoKm: Math.round(viaticoKm),
    adicionalPorCargaDescarga: Math.round(adicionalPorCargaDescarga),
    provisionSAC,
    provisionVacaciones,
    diasVacaciones,
    costoIndirecto: Math.round(costoIndirecto),
  };

  return { totalFinal: Math.round(totalFinal), detalle };
}

function calcularDiasVacaciones(años) {
  if (años < 1) return 0;      // No le corresponde aún
  if (años <= 5) return 14;
  if (años <= 10) return 21;
  if (años <= 20) return 28;
  return 35;
}

// ══════════════════════════════════════════════════════════════
// ESCENARIOS
// ══════════════════════════════════════════════════════════════

const C = { ...DEFAULTS_CALCULOS };
const allDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function makeFrecMensual(dias, vpd = 1) {
  return { tipo: 'mensual', diasSeleccionados: allDays.slice(0, dias), viajesPorDia: vpd };
}

function makeEmpleado(antiguedad) {
  return {
    ...DEFAULTS_RRHH.empleado,
    tipoContratacion: 'empleado',
    antiguedadAnios: antiguedad,
  };
}

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const pct = (a, b) => b > 0 ? ((a - b) / b * 100).toFixed(1) + '%' : '0%';

// ══════════════════════════════════════════════════════════════
// TEST 1: Variando frecuencia (empleado 5 años antigüedad)
// ══════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(110));
console.log('  TEST 1: CBA→RC (428km, 360min) — Variando frecuencia semanal');
console.log('  Empleado con 5 años de antigüedad');
console.log('='.repeat(110));

const emp5 = makeEmpleado(5);

const freqTests = [
  { dias: 1, label: '1 día (L)' },
  { dias: 2, label: '2 días (L-M)' },
  { dias: 3, label: '3 días (L-M-X)' },
  { dias: 4, label: '4 días (L-J)' },
  { dias: 5, label: '5 días (L-V)' },
  { dias: 6, label: '6 días (L-S)' },
];

console.log('\n' + 'Frecuencia'.padEnd(22) + 
  '| ACTUAL'.padEnd(16) + 
  '| CCT40/89'.padEnd(16) + 
  '| Diferencia'.padEnd(14) + 
  '| +%'.padEnd(10) +
  '| SAC'.padEnd(13) + 
  '| Vacac.'.padEnd(13) + 
  '| Antig.%');
console.log('-'.repeat(110));

for (const t of freqTests) {
  const freq = makeFrecMensual(t.dias);
  const actual = calcularCostoTotalRecurso(emp5, 428, 360, freq, C);
  const prop = calcularCostoRecurso_CCT40(emp5, 428, 360, freq, C);
  const diff = prop.totalFinal - actual.totalFinal;

  console.log(
    t.label.padEnd(22) +
    `| ${fmt(actual.totalFinal).padStart(13)} ` +
    `| ${fmt(prop.totalFinal).padStart(13)} ` +
    `| ${(diff >= 0 ? '+' : '') + fmt(diff).padStart(11)} ` +
    `| ${pct(prop.totalFinal, actual.totalFinal).padStart(7)} ` +
    `| ${fmt(prop.detalle.provisionSAC).padStart(10)} ` +
    `| ${fmt(prop.detalle.provisionVacaciones).padStart(10)} ` +
    `| ${prop.detalle.porcentajeAntiguedad}%`
  );
}

// ══════════════════════════════════════════════════════════════
// TEST 2: Variando antigüedad (CBA→RC, 5 días/sem)
// ══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(110));
console.log('  TEST 2: CBA→RC 5 días/sem — Variando antigüedad del chofer');
console.log('='.repeat(110));

const antigTests = [0, 1, 3, 5, 8, 10, 15, 20, 25];

console.log('\n' + 'Antigüedad'.padEnd(16) + 
  '| Sueldo Ajust.'.padEnd(18) + 
  '| ACTUAL'.padEnd(16) + 
  '| CCT40/89'.padEnd(16) + 
  '| Diferencia'.padEnd(14) + 
  '| +%'.padEnd(10) +
  '| SAC'.padEnd(13) + 
  '| Vacac.'.padEnd(13) + 
  '| Días Vac.');
console.log('-'.repeat(110));

for (const años of antigTests) {
  const emp = makeEmpleado(años);
  const freq = makeFrecMensual(5);
  const actual = calcularCostoTotalRecurso(emp, 428, 360, freq, C);
  const prop = calcularCostoRecurso_CCT40(emp, 428, 360, freq, C);
  const diff = prop.totalFinal - actual.totalFinal;

  console.log(
    `${años} años`.padEnd(16) +
    `| ${fmt(prop.detalle.sueldoAjustado).padStart(15)} ` +
    `| ${fmt(actual.totalFinal).padStart(13)} ` +
    `| ${fmt(prop.totalFinal).padStart(13)} ` +
    `| ${(diff >= 0 ? '+' : '') + fmt(diff).padStart(11)} ` +
    `| ${pct(prop.totalFinal, actual.totalFinal).padStart(7)} ` +
    `| ${fmt(prop.detalle.provisionSAC).padStart(10)} ` +
    `| ${fmt(prop.detalle.provisionVacaciones).padStart(10)} ` +
    `| ${prop.detalle.diasVacaciones}`
  );
}

// ══════════════════════════════════════════════════════════════
// TEST 3: Variando tipo de ruta (empleado 5 años, 5 días/sem)
// ══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(110));
console.log('  TEST 3: Empleado 5 años, 5 días/sem — Variando ruta');
console.log('='.repeat(110));

const rutaTests = [
  { name: 'Local corta (50km, 60min)', km: 50, dur: 60 },
  { name: 'Local media (100km, 120min)', km: 100, dur: 120 },
  { name: 'CBA→Carlos Paz (80km, 90min)', km: 80, dur: 90 },
  { name: 'CBA→RC solo ida (214km, 180min)', km: 214, dur: 180 },
  { name: 'CBA→RC ida/vuelta (428km, 360min)', km: 428, dur: 360 },
  { name: 'CBA→Rosario (400km, 300min)', km: 400, dur: 300 },
  { name: 'CBA→BsAs (700km, 540min)', km: 700, dur: 540 },
  { name: 'CBA→Mendoza (600km, 480min)', km: 600, dur: 480 },
];

console.log('\n' + 'Ruta'.padEnd(40) + 
  '| Tipo Cálculo'.padEnd(30) + 
  '| ACTUAL'.padEnd(16) + 
  '| CCT40/89'.padEnd(16) + 
  '| +%'.padEnd(10) +
  '| Costo/km ACT'.padEnd(16) +
  '| Costo/km CCT');
console.log('-'.repeat(140));

for (const r of rutaTests) {
  const freq = makeFrecMensual(5);
  const actual = calcularCostoTotalRecurso(emp5, r.km, r.dur, freq, C);
  const prop = calcularCostoRecurso_CCT40(emp5, r.km, r.dur, freq, C);
  const kmMes = r.km * 5 * 4.33;
  const costoKmAct = actual.totalFinal / kmMes;
  const costoKmProp = prop.totalFinal / kmMes;

  console.log(
    r.name.padEnd(40) +
    `| ${prop.detalle.tipoDeCalculo.padEnd(27)} ` +
    `| ${fmt(actual.totalFinal).padStart(13)} ` +
    `| ${fmt(prop.totalFinal).padStart(13)} ` +
    `| ${pct(prop.totalFinal, actual.totalFinal).padStart(7)} ` +
    `| $${costoKmAct.toFixed(2).padStart(12)} ` +
    `| $${costoKmProp.toFixed(2).padStart(12)}`
  );
}

// ══════════════════════════════════════════════════════════════
// DETALLE COMPLETO: Tu caso real
// ══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('  DETALLE LÍNEA POR LÍNEA: CBA→RC, 6 días/sem, 5 años antigüedad');
console.log('='.repeat(80));

const freqReal = makeFrecMensual(6);
const actualReal = calcularCostoTotalRecurso(emp5, 428, 360, freqReal, C);
const propReal = calcularCostoRecurso_CCT40(emp5, 428, 360, freqReal, C);

const conceptos = [
  ['Sueldo Base / Jornal',   actualReal.detalle.costoBaseRemunerativo,  propReal.detalle.costoBaseRemunerativo],
  ['Adicional por KM',       actualReal.detalle.adicionalKm,           propReal.detalle.adicionalKm],
  ['Viáticos por KM',        actualReal.detalle.viaticoKm,             propReal.detalle.viaticoKm],
  ['Carga/Descarga',         actualReal.detalle.adicionalPorCargaDescarga, propReal.detalle.adicionalPorCargaDescarga],
  ['Adicional Fijo No Rem.', actualReal.detalle.adicionalFijoNoRemunerativo, propReal.detalle.adicionalFijoNoRemunerativo],
  ['Prov. SAC (Aguinaldo)',  0,                                         propReal.detalle.provisionSAC],
  ['Prov. Vacaciones',       0,                                         propReal.detalle.provisionVacaciones],
  ['Cargas Sociales',        actualReal.detalle.costoIndirecto,        propReal.detalle.costoIndirecto],
];

console.log('\n' + 'Concepto'.padEnd(30) + '| ACTUAL'.padEnd(16) + '| CCT 40/89'.padEnd(16) + '| Diferencia');
console.log('-'.repeat(80));

let sumAct = 0, sumProp = 0;
for (const [label, act, prop] of conceptos) {
  const diff = prop - act;
  sumAct += act;
  sumProp += prop;
  console.log(
    label.padEnd(30) +
    `| ${fmt(act).padStart(13)} ` +
    `| ${fmt(prop).padStart(13)} ` +
    `| ${(diff >= 0 ? '+' : '') + fmt(diff).padStart(11)}`
  );
}
console.log('-'.repeat(80));
console.log(
  'TOTAL'.padEnd(30) +
  `| ${fmt(actualReal.totalFinal).padStart(13)} ` +
  `| ${fmt(propReal.totalFinal).padStart(13)} ` +
  `| ${'+' + fmt(propReal.totalFinal - actualReal.totalFinal).padStart(11)}`
);
console.log(`\nDiferencia porcentual: +${pct(propReal.totalFinal, actualReal.totalFinal)}`);
console.log(`Costo oculto que hoy NO estás cobrando: ${fmt(propReal.totalFinal - actualReal.totalFinal)}/mes`);

// Precio final al cliente
const margen = 0.15;
const precioActual = actualReal.totalFinal * (1 + margen);
const precioProp = propReal.totalFinal * (1 + margen);
console.log(`\nSi cobrás 15% de margen:`);
console.log(`  Precio actual al cliente: ${fmt(precioActual)}/mes`);
console.log(`  Precio CCT 40/89:        ${fmt(precioProp)}/mes (${pct(precioProp, precioActual)} más)`);

console.log('\n' + '='.repeat(80));
console.log('  FIN DE TEST');
console.log('='.repeat(80) + '\n');

process.exit(0);
