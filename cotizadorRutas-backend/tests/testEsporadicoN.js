/**
 * ═══════════════════════════════════════════════════════════════
 * TEST: Esporádico con N viajes — ¿calcula bien los totales?
 * ═══════════════════════════════════════════════════════════════
 */

import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';
import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';
import { DEFAULTS_RRHH, DEFAULTS_VEHICULO, DEFAULTS_CALCULOS } from '../models/ConfiguracionDefaults.js';

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const C = { ...DEFAULTS_CALCULOS };
const emp = { ...DEFAULTS_RRHH.empleado, tipoContratacion: 'empleado' };
const veh = { ...DEFAULTS_VEHICULO.camion, año: 2022 };

// ═══════════════════════════════════════════════
// REGLA FUNDAMENTAL: 3 esporádico = 3 × (1 esporádico)
// Si el sistema es consistente, el costo de 3 viajes
// debe ser EXACTAMENTE 3 veces el costo de 1 viaje.
// ═══════════════════════════════════════════════

function calcEsp(km, dur, n) {
  const freq = { tipo: 'esporadico', vueltasTotales: n };
  const rrhh = calcularCostoTotalRecurso(emp, km, dur, freq, C);
  const vhcl = calcularCostoVehiculo(veh, km, n, dur, null, C);
  return {
    rrhh: rrhh.totalFinal,
    vhcl: vhcl.totalFinal,
    total: rrhh.totalFinal + vhcl.totalFinal,
    detalleRRHH: rrhh.detalle,
    detalleVhcl: vhcl,
  };
}

console.log('\n' + '='.repeat(90));
console.log('  TEST ESPORÁDICO: La regla de oro — N viajes = N × (1 viaje)');
console.log('='.repeat(90));

// ── CASO A: Viaje CORTO (60min, 80km) ──────────────────────────

console.log('\n──────────────────────────────────────────────');
console.log('  CASO A: Viaje CORTO (60min de ruta, 80km)');
console.log('  Clasificado como: "Servicio Corto Por Hora" (<180min)');
console.log('──────────────────────────────────────────────\n');

const a1 = calcEsp(80, 60, 1);
const a2 = calcEsp(80, 60, 2);
const a3 = calcEsp(80, 60, 3);

const a1x3_rrhh  = a1.rrhh * 3;
const a1x3_vhcl  = a1.vhcl * 3;
const a1x3_total = a1.total * 3;

console.log(''.padEnd(30) + '| 1 viaje'.padEnd(14) + '| 2 viajes'.padEnd(14) + '| 3 viajes'.padEnd(14) + '| 1×3 esperado   | ¿OK?');
console.log('-'.repeat(90));
console.log(
  'RRHH'.padEnd(30) +
  `| ${fmt(a1.rrhh).padStart(11)} ` +
  `| ${fmt(a2.rrhh).padStart(11)} ` +
  `| ${fmt(a3.rrhh).padStart(11)} ` +
  `| ${fmt(a1x3_rrhh).padStart(13)} ` +
  `| ${a3.rrhh === a1x3_rrhh ? '✅' : '❌ DIFF: ' + fmt(a3.rrhh - a1x3_rrhh)}`
);
console.log(
  'Vehículo'.padEnd(30) +
  `| ${fmt(a1.vhcl).padStart(11)} ` +
  `| ${fmt(a2.vhcl).padStart(11)} ` +
  `| ${fmt(a3.vhcl).padStart(11)} ` +
  `| ${fmt(a1x3_vhcl).padStart(13)} ` +
  `| ${a3.vhcl === a1x3_vhcl ? '✅' : '❌ DIFF: ' + fmt(a3.vhcl - a1x3_vhcl)}`
);
console.log(
  'TOTAL'.padEnd(30) +
  `| ${fmt(a1.total).padStart(11)} ` +
  `| ${fmt(a2.total).padStart(11)} ` +
  `| ${fmt(a3.total).padStart(11)} ` +
  `| ${fmt(a1x3_total).padStart(13)} ` +
  `| ${a3.total === a1x3_total ? '✅' : '❌ DIFF: ' + fmt(a3.total - a1x3_total)}`
);

console.log('\n  Detalle RRHH de 1 viaje:');
console.log(`    costoBaseRemunerativo: ${fmt(a1.detalleRRHH.costoBaseRemunerativo)}`);
console.log(`    adicionalKm:           ${fmt(a1.detalleRRHH.adicionalKm)}`);
console.log(`    viaticoKm:             ${fmt(a1.detalleRRHH.viaticoKm)}`);
console.log(`    kmRealesTotales:       ${a1.detalleRRHH.kmRealesTotales} km`);
console.log(`    kmParaPagar:           ${a1.detalleRRHH.kmParaPagar} km`);

console.log('\n  Detalle RRHH de 3 viajes:');
console.log(`    costoBaseRemunerativo: ${fmt(a3.detalleRRHH.costoBaseRemunerativo)}`);
console.log(`    adicionalKm:           ${fmt(a3.detalleRRHH.adicionalKm)}`);
console.log(`    viaticoKm:             ${fmt(a3.detalleRRHH.viaticoKm)}`);
console.log(`    kmRealesTotales:       ${a3.detalleRRHH.kmRealesTotales} km`);
console.log(`    kmParaPagar:           ${a3.detalleRRHH.kmParaPagar} km`);

// ── CASO B: Viaje LARGO (360min, 428km CBA→RC) ─────────────────

console.log('\n──────────────────────────────────────────────');
console.log('  CASO B: Viaje LARGO (360min de ruta, 428km)');
console.log('  Clasificado como: "Servicio Dedicado Por Jornada" (>=180min)');
console.log('──────────────────────────────────────────────\n');

const b1 = calcEsp(428, 360, 1);
const b2 = calcEsp(428, 360, 2);
const b3 = calcEsp(428, 360, 3);

const b1x3_rrhh  = b1.rrhh * 3;
const b1x3_vhcl  = b1.vhcl * 3;
const b1x3_total = b1.total * 3;

console.log(''.padEnd(30) + '| 1 viaje'.padEnd(14) + '| 2 viajes'.padEnd(14) + '| 3 viajes'.padEnd(14) + '| 1×3 esperado   | ¿OK?');
console.log('-'.repeat(90));
console.log(
  'RRHH'.padEnd(30) +
  `| ${fmt(b1.rrhh).padStart(11)} ` +
  `| ${fmt(b2.rrhh).padStart(11)} ` +
  `| ${fmt(b3.rrhh).padStart(11)} ` +
  `| ${fmt(b1x3_rrhh).padStart(13)} ` +
  `| ${b3.rrhh === b1x3_rrhh ? '✅' : '❌ DIFF: ' + fmt(b3.rrhh - b1x3_rrhh)}`
);
console.log(
  'Vehículo'.padEnd(30) +
  `| ${fmt(b1.vhcl).padStart(11)} ` +
  `| ${fmt(b2.vhcl).padStart(11)} ` +
  `| ${fmt(b3.vhcl).padStart(11)} ` +
  `| ${fmt(b1x3_vhcl).padStart(13)} ` +
  `| ${b3.vhcl === b1x3_vhcl ? '✅' : '❌ DIFF: ' + fmt(b3.vhcl - b1x3_vhcl)}`
);
console.log(
  'TOTAL'.padEnd(30) +
  `| ${fmt(b1.total).padStart(11)} ` +
  `| ${fmt(b2.total).padStart(11)} ` +
  `| ${fmt(b3.total).padStart(11)} ` +
  `| ${fmt(b1x3_total).padStart(13)} ` +
  `| ${b3.total === b1x3_total ? '✅' : '❌ DIFF: ' + fmt(b3.total - b1x3_total)}`
);

console.log('\n  Detalle RRHH de 1 viaje largo:');
console.log(`    costoBaseRemunerativo:  ${fmt(b1.detalleRRHH.costoBaseRemunerativo)}`);
console.log(`    adicionalKm:            ${fmt(b1.detalleRRHH.adicionalKm)}`);
console.log(`    kmRealesTotales:        ${b1.detalleRRHH.kmRealesTotales} km`);
console.log(`    kmParaPagar:            ${b1.detalleRRHH.kmParaPagar} km`);

console.log('\n  Detalle RRHH de 3 viajes largos:');
console.log(`    costoBaseRemunerativo:  ${fmt(b3.detalleRRHH.costoBaseRemunerativo)}`);
console.log(`    adicionalKm:            ${fmt(b3.detalleRRHH.adicionalKm)}`);
console.log(`    kmRealesTotales:        ${b3.detalleRRHH.kmRealesTotales} km`);
console.log(`    kmParaPagar:            ${b3.detalleRRHH.kmParaPagar} km`);

// ── CASO C: Precio por viaje individual ────────────────────────

console.log('\n\n' + '='.repeat(90));
console.log('  CONSISTENCIA: precio/viaje individual = mismo sin importar N');
console.log('='.repeat(90));

console.log('\n  VIAJE CORTO (80km, 60min):');
console.log(`    1 viaje total:    ${fmt(a1.total)} → precio/viaje: ${fmt(a1.total / 1)}`);
console.log(`    2 viajes totales: ${fmt(a2.total)} → precio/viaje: ${fmt(a2.total / 2)}`);
console.log(`    3 viajes totales: ${fmt(a3.total)} → precio/viaje: ${fmt(a3.total / 3)}`);

console.log('\n  VIAJE LARGO (428km, 360min):');
console.log(`    1 viaje total:    ${fmt(b1.total)} → precio/viaje: ${fmt(b1.total / 1)}`);
console.log(`    2 viajes totales: ${fmt(b2.total)} → precio/viaje: ${fmt(b2.total / 2)}`);
console.log(`    3 viajes totales: ${fmt(b3.total)} → precio/viaje: ${fmt(b3.total / 3)}`);

console.log('\n' + '='.repeat(90) + '\n');
process.exit(0);
