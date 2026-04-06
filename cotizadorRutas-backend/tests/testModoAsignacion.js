/**
 * ══════════════════════════════════════════════════════════════
 * TEST MEGA: Comparación Lógica Actual vs Propuesta (modoAsignacion)
 * ══════════════════════════════════════════════════════════════
 * 
 * Simula el cálculo de RRHH con la lógica ACTUAL y con la PROPUESTA
 * para múltiples escenarios reales de negocio.
 */

import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';
import { DEFAULTS_CALCULOS, DEFAULTS_RRHH } from '../models/ConfiguracionDefaults.js';

// ══════════════════════════════════════════════════════════════
// MOTOR PROPUESTO (copia modificada para comparar)
// ══════════════════════════════════════════════════════════════

function calcularCostoTotalRecurso_PROPUESTO(recurso, kmsPorViaje, duracionMin, frecuencia, C = {}) {
  const TIEMPO_CARGA_DESCARGA = C.tiempoCargaDescargaMin || 30;
  const UMBRAL_JORNADA_COMPLETA = C.umbralJornadaCompletaMin || 180;
  const JORNADA_COMPLETA_MINUTOS = C.jornadaCompletaMinutos || 480;
  const DIAS_LABORALES = C.diasLaboralesMes || 22;
  const SEMANAS_MES = C.semanasPorMes || 4.33;
  const UMBRAL_MODO_COMPLETO = 4; // 4+ días/semana = dedicado

  const sueldoAjustado = recurso.sueldoBasico * (1 + (recurso.adicionalActividadPorc || 0) / 100);
  const valorHora = sueldoAjustado / (recurso.horasLaboralesMensuales || 192);
  const valorJornada = sueldoAjustado / DIAS_LABORALES;

  const tiempoTotalMision = duracionMin + TIEMPO_CARGA_DESCARGA;
  const viajesPorDia = frecuencia.viajesPorDia || 1;
  const tiempoDiarioTotal = tiempoTotalMision * viajesPorDia;
  const esServicioMensual = frecuencia.tipo === 'mensual';
  
  const diasPorSemana = frecuencia.diasSeleccionados?.length || 0;
  const cantidadViajesAlMes = esServicioMensual
    ? diasPorSemana * (frecuencia.viajesPorDia || 1) * SEMANAS_MES
    : (frecuencia.vueltasTotales || 1);
  const kmRealesTotales = kmsPorViaje * cantidadViajesAlMes;

  // ═══ NUEVA LÓGICA: determinar modoAsignacion ═══
  const modoAsignacion = (esServicioMensual && diasPorSemana >= UMBRAL_MODO_COMPLETO) 
    ? 'completo' : 'prorrateado';

  const diasDeTrabajoAlMes = esServicioMensual
    ? diasPorSemana * SEMANAS_MES
    : (frecuencia.vueltasTotales || 1);

  let costoBaseRemunerativo = 0;
  let adicionalFijoNoRemunerativo = 0;
  let kilometrosMinimos = 0;
  let detalle = { modoAsignacion };

  if (tiempoDiarioTotal < UMBRAL_JORNADA_COMPLETA) {
    // VIAJE CORTO — siempre prorrateado (no tiene sentido dedicar full-time para viajes cortos)
    detalle.tipoDeCalculo = 'Servicio Corto (Por Hora)';
    kilometrosMinimos = 150;
    const tiempoAFacturar = Math.max(tiempoTotalMision, recurso.minimoMinutosFacturables || 120);
    const costoViajeIndividual = valorHora * (tiempoAFacturar / 60);
    const valorDiarioAdicional = (recurso.adicionalNoRemunerativoFijo || 0) / DIAS_LABORALES;
    const adicionalProrrateadoPorViaje = valorDiarioAdicional * (tiempoAFacturar / JORNADA_COMPLETA_MINUTOS);

    costoBaseRemunerativo = esServicioMensual ? costoViajeIndividual * cantidadViajesAlMes : costoViajeIndividual;
    adicionalFijoNoRemunerativo = esServicioMensual ? adicionalProrrateadoPorViaje * cantidadViajesAlMes : adicionalProrrateadoPorViaje;

  } else {
    // SERVICIO DEDICADO — aplica modoAsignacion
    detalle.tipoDeCalculo = 'Servicio Dedicado (Por Jornada)';
    kilometrosMinimos = 350;

    if (modoAsignacion === 'completo') {
      // ═══ MODO COMPLETO: sueldo entero + horas extra ═══
      costoBaseRemunerativo = sueldoAjustado; // 100% del sueldo mensual

      // Horas extra: si trabaja más de 8hs/día
      const minutosExtraPorDia = Math.max(0, tiempoDiarioTotal - JORNADA_COMPLETA_MINUTOS);
      if (minutosExtraPorDia > 0) {
        // Multiplicador 1.5× por ley laboral
        const costoExtraTotalMes = (minutosExtraPorDia / 60) * valorHora * 1.5 * diasDeTrabajoAlMes;
        costoBaseRemunerativo += costoExtraTotalMes;
        detalle.horasExtraDia = (minutosExtraPorDia / 60).toFixed(1);
        detalle.costoHorasExtra = Math.round(costoExtraTotalMes);
      }

      // Días extra (sábados si trabaja >5 días/semana y el contrato es L-V)
      const diasExtraPorSemana = Math.max(0, diasPorSemana - 5); // días fuera de L-V
      if (diasExtraPorSemana > 0 && esServicioMensual) {
        const diasExtraMes = diasExtraPorSemana * SEMANAS_MES;
        // Jornada extra a 1.5× (o 2× si es domingo, pero simplificamos a 1.5)
        const costosDiasExtra = valorJornada * diasExtraMes * 1.5;
        costoBaseRemunerativo += costosDiasExtra;
        detalle.diasExtraSemana = diasExtraPorSemana;
        detalle.costoDiasExtra = Math.round(costosDiasExtra);
      }

      // Adicional fijo: se calcula sobre el mes completo
      adicionalFijoNoRemunerativo = recurso.adicionalNoRemunerativoFijo || 0;

    } else {
      // ═══ MODO PRORRATEADO (lógica actual sin cambios) ═══
      const minutosExtraPorDia = Math.max(0, tiempoDiarioTotal - JORNADA_COMPLETA_MINUTOS);
      const costoExtraTotalMes = (minutosExtraPorDia / 60) * valorHora * 1.5 * diasDeTrabajoAlMes;
      costoBaseRemunerativo = (valorJornada * diasDeTrabajoAlMes) + costoExtraTotalMes;

      const adicionalDiario = (recurso.adicionalNoRemunerativoFijo || 0) / DIAS_LABORALES;
      adicionalFijoNoRemunerativo = adicionalDiario * diasDeTrabajoAlMes;
    }
  }

  const kmParaPagar = Math.max(kmRealesTotales, kilometrosMinimos * (esServicioMensual ? 1 : cantidadViajesAlMes));
  const adicionalKm = (recurso.adicionalKmRemunerativo || 0) * kmParaPagar;
  const viaticoKm = (recurso.viaticoPorKmNoRemunerativo || 0) * kmParaPagar;
  const tramosDeCarga = recurso.kmPorUnidadDeCarga ? Math.round(kmRealesTotales / recurso.kmPorUnidadDeCarga) : 0;
  const adicionalPorCargaDescarga = tramosDeCarga * (recurso.adicionalCargaDescargaCadaXkm || 0);

  const baseRemunerativa = costoBaseRemunerativo + adicionalKm + adicionalPorCargaDescarga;
  let costoIndirecto = 0;
  if (recurso.tipoContratacion === 'empleado') {
    costoIndirecto = baseRemunerativa * ((recurso.porcentajeCargasSociales || 0) / 100);
  } else {
    const subtotalBruto = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm;
    costoIndirecto = subtotalBruto * ((recurso.porcentajeOverheadContratado || 0) / 100);
  }

  const totalFinal = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm + costoIndirecto;

  detalle = {
    ...detalle,
    kmRealesTotales: Math.round(kmRealesTotales),
    kmParaPagar: Math.round(kmParaPagar),
    costoBaseRemunerativo: Math.round(costoBaseRemunerativo),
    adicionalFijoNoRemunerativo: Math.round(adicionalFijoNoRemunerativo),
    adicionalKm: Math.round(adicionalKm),
    viaticoKm: Math.round(viaticoKm),
    adicionalPorCargaDescarga: Math.round(adicionalPorCargaDescarga),
    costoIndirecto: Math.round(costoIndirecto),
  };

  return { totalFinal: Math.round(totalFinal), detalle };
}

// ══════════════════════════════════════════════════════════════
// ESCENARIOS DE TEST
// ══════════════════════════════════════════════════════════════

const empleado = {
  ...DEFAULTS_RRHH.empleado,
  tipoContratacion: 'empleado',
  nombre: 'Test Empleado'
};

const contratado = {
  ...DEFAULTS_RRHH.contratado,
  tipoContratacion: 'contratado',
  nombre: 'Test Contratado'
};

const C = { ...DEFAULTS_CALCULOS };

const allDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function makeFrecuencia(dias, viajesPorDia = 1) {
  return {
    tipo: 'mensual',
    diasSeleccionados: allDays.slice(0, dias),
    viajesPorDia,
  };
}

const scenarios = [
  // Ruta corta (90 min): debería ser Servicio Corto
  { name: 'Ruta Corta 90min | 1 día/sem',    km: 80,  dur: 90,  dias: 1, viajes: 1 },
  { name: 'Ruta Corta 90min | 3 días/sem',   km: 80,  dur: 90,  dias: 3, viajes: 1 },
  { name: 'Ruta Corta 90min | 5 días/sem',   km: 80,  dur: 90,  dias: 5, viajes: 1 },
  
  // Ruta media (150 min = 2.5hs): Servicio Corto (+30 carga = 180 → justo en el umbral)
  { name: 'Ruta Media 150min | 3 días/sem',  km: 180, dur: 150, dias: 3, viajes: 1 },
  { name: 'Ruta Media 150min | 5 días/sem',  km: 180, dur: 150, dias: 5, viajes: 1 },
  
  // Ruta Córdoba-Río Cuarto (360 min ida+vuelta): Servicio Dedicado
  { name: 'CBA→RC i/v 360min | 2 días/sem',  km: 428, dur: 360, dias: 2, viajes: 1 },
  { name: 'CBA→RC i/v 360min | 3 días/sem',  km: 428, dur: 360, dias: 3, viajes: 1 },
  { name: 'CBA→RC i/v 360min | 4 días/sem',  km: 428, dur: 360, dias: 4, viajes: 1 },
  { name: 'CBA→RC i/v 360min | 5 días/sem',  km: 428, dur: 360, dias: 5, viajes: 1 },
  { name: 'CBA→RC i/v 360min | 6 días/sem',  km: 428, dur: 360, dias: 6, viajes: 1 },
  
  // Ruta larga (540 min = 9hs): supera jornada, genera horas extra
  { name: 'Ruta Larga 540min | 5 días/sem',  km: 600, dur: 540, dias: 5, viajes: 1 },
  { name: 'Ruta Larga 540min | 6 días/sem',  km: 600, dur: 540, dias: 6, viajes: 1 },
];

// ══════════════════════════════════════════════════════════════
// EJECUCCIÓN
// ══════════════════════════════════════════════════════════════

const sueldoAjustado = empleado.sueldoBasico * (1 + empleado.adicionalActividadPorc / 100);
console.log(`\n${'═'.repeat(120)}`);
console.log(`  TEST MEGA: Comparación ACTUAL vs PROPUESTO — Empleado`);
console.log(`  Sueldo Básico: $${empleado.sueldoBasico.toLocaleString('es-AR')} | +${empleado.adicionalActividadPorc}% Act. = $${Math.round(sueldoAjustado).toLocaleString('es-AR')}/mes`);
console.log(`  Cargas Sociales: ${empleado.porcentajeCargasSociales}% | Adic. Km: $${empleado.adicionalKmRemunerativo}/km | Viático: $${empleado.viaticoPorKmNoRemunerativo}/km`);
console.log(`${'═'.repeat(120)}\n`);

// Header
console.log(
  'Escenario'.padEnd(42) +
  '│ Modo   ' +
  '│ Base ACTUAL'.padEnd(15) +
  '│ Base PROP.'.padEnd(15) +
  '│ ΔBASE'.padEnd(12) +
  '│ Total ACTUAL'.padEnd(16) +
  '│ Total PROP.'.padEnd(16) +
  '│ ΔTOTAL'.padEnd(12) +
  '│ Δ%'
);
console.log('─'.repeat(150));

for (const s of scenarios) {
  const freq = makeFrecuencia(s.dias, s.viajes);
  
  const actual = calcularCostoTotalRecurso(empleado, s.km, s.dur, freq, C);
  const propuesto = calcularCostoTotalRecurso_PROPUESTO(empleado, s.km, s.dur, freq, C);
  
  const deltaBase = propuesto.detalle.costoBaseRemunerativo - actual.detalle.costoBaseRemunerativo;
  const deltaTotal = propuesto.totalFinal - actual.totalFinal;
  const deltaPct = actual.totalFinal > 0 ? ((deltaTotal / actual.totalFinal) * 100).toFixed(1) : '0';
  
  const modo = propuesto.detalle.modoAsignacion || 'prorr.';
  
  console.log(
    s.name.padEnd(42) +
    `│ ${modo.padEnd(7)}` +
    `│ $${actual.detalle.costoBaseRemunerativo.toLocaleString('es-AR').padStart(12)}` +
    `│ $${propuesto.detalle.costoBaseRemunerativo.toLocaleString('es-AR').padStart(12)}` +
    `│ ${(deltaBase >= 0 ? '+' : '') + deltaBase.toLocaleString('es-AR').padStart(10)}` +
    `│ $${actual.totalFinal.toLocaleString('es-AR').padStart(13)}` +
    `│ $${propuesto.totalFinal.toLocaleString('es-AR').padStart(13)}` +
    `│ ${(deltaTotal >= 0 ? '+' : '') + deltaTotal.toLocaleString('es-AR').padStart(10)}` +
    `│ ${deltaPct}%`
  );
}

// ══════════════════════════════════════════════════════════════
// DETALLE de los escenarios más interesantes
// ══════════════════════════════════════════════════════════════

console.log(`\n\n${'═'.repeat(100)}`);
console.log(`  DETALLE CASO: CBA→RC | 6 días/sem (tu caso real)`);
console.log(`${'═'.repeat(100)}`);

const freq6 = makeFrecuencia(6);
const actual6 = calcularCostoTotalRecurso(empleado, 428, 360, freq6, C);
const prop6 = calcularCostoTotalRecurso_PROPUESTO(empleado, 428, 360, freq6, C);

console.log('\n--- ACTUAL ---');
console.log(JSON.stringify(actual6.detalle, null, 2));
console.log(`TOTAL: $${actual6.totalFinal.toLocaleString('es-AR')}`);

console.log('\n--- PROPUESTO ---');
console.log(JSON.stringify(prop6.detalle, null, 2));
console.log(`TOTAL: $${prop6.totalFinal.toLocaleString('es-AR')}`);

console.log(`\n\n${'═'.repeat(100)}`);
console.log(`  DETALLE CASO: CBA→RC | 5 días/sem (L-V estándar)`);
console.log(`${'═'.repeat(100)}`);

const freq5 = makeFrecuencia(5);
const actual5 = calcularCostoTotalRecurso(empleado, 428, 360, freq5, C);
const prop5 = calcularCostoTotalRecurso_PROPUESTO(empleado, 428, 360, freq5, C);

console.log('\n--- ACTUAL ---');
console.log(JSON.stringify(actual5.detalle, null, 2));
console.log(`TOTAL: $${actual5.totalFinal.toLocaleString('es-AR')}`);

console.log('\n--- PROPUESTO ---');
console.log(JSON.stringify(prop5.detalle, null, 2));
console.log(`TOTAL: $${prop5.totalFinal.toLocaleString('es-AR')}`);

console.log(`\n\n${'═'.repeat(100)}`);
console.log(`  DETALLE CASO: CBA→RC | 3 días/sem (prorrateado)`);
console.log(`${'═'.repeat(100)}`);

const freq3 = makeFrecuencia(3);
const actual3 = calcularCostoTotalRecurso(empleado, 428, 360, freq3, C);
const prop3 = calcularCostoTotalRecurso_PROPUESTO(empleado, 428, 360, freq3, C);

console.log('\n--- ACTUAL ---');
console.log(JSON.stringify(actual3.detalle, null, 2));
console.log(`TOTAL: $${actual3.totalFinal.toLocaleString('es-AR')}`);

console.log('\n--- PROPUESTO ---');
console.log(JSON.stringify(prop3.detalle, null, 2));
console.log(`TOTAL: $${prop3.totalFinal.toLocaleString('es-AR')}`);

console.log(`\n\n${'═'.repeat(100)}`);
console.log(`  DETALLE CASO: Ruta Larga 540min | 5 días/sem (horas extra)`);
console.log(`${'═'.repeat(100)}`);

const freqL = makeFrecuencia(5);
const actualL = calcularCostoTotalRecurso(empleado, 600, 540, freqL, C);
const propL = calcularCostoTotalRecurso_PROPUESTO(empleado, 600, 540, freqL, C);

console.log('\n--- ACTUAL (hora extra ×1) ---');
console.log(JSON.stringify(actualL.detalle, null, 2));
console.log(`TOTAL: $${actualL.totalFinal.toLocaleString('es-AR')}`);

console.log('\n--- PROPUESTO (hora extra ×1.5) ---');
console.log(JSON.stringify(propL.detalle, null, 2));
console.log(`TOTAL: $${propL.totalFinal.toLocaleString('es-AR')}`);

console.log(`\n${'═'.repeat(120)}`);
console.log('  FIN DE TEST');
console.log(`${'═'.repeat(120)}\n`);

process.exit(0);
