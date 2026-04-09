/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEGA TEST — Motor de Cálculo Cotizador Logístico
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cómo correr:
 *   node tests/motorCalculo.test.mjs
 *
 * Cubre las 16 ramas del motor de cálculo con datos reales argentinos.
 * Compara resultados reales del motor vs valores esperados calculados
 * manualmente según las fórmulas del CCT 40/89.
 *
 * Tolerancia por redondeo matemático: ±500 ARS (salvo checks exactos con tol=0)
 */

import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';

// ─── ANSI Colors ─────────────────────────────────────────────────────────────
const R  = '\x1b[0m';
const B  = '\x1b[1m';
const G  = '\x1b[32m';
const GR = '\x1b[90m';
const E  = '\x1b[31m';
const W  = '\x1b[33m';
const C  = '\x1b[36m';
const M  = '\x1b[35m';

const TOLERANCIA_DEFAULT = 500; // ARS
const ars = (n) => `$${Math.round(n).toLocaleString('es-AR')}`;
const cerca = (a, b, tol) => Math.abs(a - b) <= tol;

// ─── DATOS BASE ───────────────────────────────────────────────────────────────

/**
 * Vehículo base: camión 2020, bien equipado.
 * Se calculan valores reales de depreciación, cubiertas, aceite, combustible.
 */
const VEHICULO_BASE = {
  patente: 'ABX123',
  tipo: 'camion',
  año: 2020,
  precioVehiculoNuevo: 30_000_000,    // $30M
  valorResidualPorcentaje: 30,         // 30% residual
  kmsVidaUtilVehiculo: 500_000,        // 500k km vida útil
  tieneGNC: false,
  rendimientoKmLitro: 8,              // 8 km/L
  precioLitroCombustible: 1_200,      // $1.200/L
  precioGNC: 350,                      // $350/m³
  kmsVidaUtilCubiertas: 80_000,
  precioCubierta: 250_000,
  cantidadCubiertas: 6,
  kmsCambioAceite: 20_000,
  precioCambioAceite: 200_000,
  costoMantenimientoPreventivoMensual: 150_000,
  costoSeguroMensual: 400_000,
  costoPatenteMunicipal: 15_000,
  costoPatenteProvincial: 12_000,
};

/**
 * Empleado CCT 40/89 — escala Mar 2026 (valores reales).
 * jornal = 917462 × 1.15 / 24 = $43.962
 * costo/min = 43962 / 480 = $91.59/min
 */
const EMPLEADO_BASE = {
  tipoContratacion: 'empleado',
  sueldoBasico: 917_462,
  adicionalActividadPorc: 15,
  adicionalKmRemunerativo: 73.40,
  viaticoPorKmNoRemunerativo: 73.40,
  adicionalNoRemunerativoFijo: 53_000,
  minimoMinutosFacturables: 120,      // mínimo 2h facturables
  kmPorUnidadDeCarga: 1_000,
  adicionalCargaDescargaCadaXkm: 38_228,
  porcentajeCargasSociales: 35,
};

/**
 * Configuración del presupuesto.
 * Los totales incluyen admin 5%, ganancia 20%, peajes $500/viaje, IVA 21%.
 */
const CONFIG_BASE = {
  costoAdministrativo: 5,
  porcentajeGanancia: 20,
  costoPeajes: 500,
  otrosCostos: 0,
};

/**
 * Constantes de cálculo — defaults del sistema.
 * Incluye los 3 parámetros de km mínimos ahora configurables.
 */
const C_DEFAULTS = {
  tiempoCargaDescargaMin: 30,
  umbralJornadaCompletaMin: 180,      // EJE 1: umbral de tiempo
  jornadaCompletaMinutos: 480,
  divisorJornalCCT: 24,
  semanasPorMes: 4.33,
  diasLaboralesMes: 22,
  factorRendimientoGNC: 1.15,
  factorCargaRefrigerada: 1.25,
  costoAdicionalKmPeligrosa: 350,
  porcentajeIVA: 21,
  umbralKmRutaLarga: 200,             // EJE 2: umbral de km
  kmMinimoRutaCorta: 150,             // mínimo facturable rutas cortas
  kmMinimoRutaLarga: 350,             // mínimo facturable rutas largas (= CCT)
};

// ─── HELPER: navegar path en objeto ──────────────────────────────────────────
const get = (obj, path) =>
  path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);

// ─── RUNNER DE CHECKS ─────────────────────────────────────────────────────────
let pasados = 0, fallados = 0;

function runChecks(checks, result) {
  for (const chk of checks) {
    const actual = get(result, chk.campo);
    const tol = chk.tolerancia !== undefined ? chk.tolerancia : TOLERANCIA_DEFAULT;

    // Check: el string contiene una substring
    if (chk.contiene !== undefined) {
      const ok = typeof actual === 'string' &&
                 actual.toLowerCase().includes(chk.contiene.toLowerCase());
      imprimirCheck(ok, chk.label, `"${actual}"`, `debe contener "${chk.contiene}"`);
      continue;
    }

    // Check: el valor es DISTINTO de (para verificar que NO es N2)
    if (chk.esDistintoDe !== undefined) {
      const ok = Math.abs(actual - chk.esDistintoDe) > tol;
      imprimirCheck(ok, chk.label, ars(actual), `debe ser ≠ ${ars(chk.esDistintoDe)}`);
      continue;
    }

    // Check: el valor es aproximadamente igual (con tolerancia)
    const ok = cerca(actual, chk.valor, tol);
    const diff = actual - chk.valor;
    const diffStr = diff !== 0
      ? ` (diff: ${diff > 0 ? '+' : ''}${ars(diff)}, ${((Math.abs(diff)/Math.abs(chk.valor))*100).toFixed(2)}%)`
      : '';
    imprimirCheck(ok, chk.label, `${ars(actual)}${diffStr}`, `esperado: ${ars(chk.valor)} ±${ars(tol)}`);
  }
}

function imprimirCheck(ok, label, actual, esperado) {
  if (ok) {
    pasados++;
    console.log(`  ${G}✅${R} ${label}`);
    console.log(`     ${GR}↳ ${actual}${R}`);
  } else {
    fallados++;
    console.log(`  ${E}❌${R} ${label}`);
    console.log(`     ${GR}↳ Actual: ${actual} | Esperado: ${esperado}${R}`);
  }
}

function miniResumen(result) {
  const { resumenCostos: res, calculoRecurso: rrhh, calculoVehiculo: veh } = result;
  const tipo = rrhh?.detalle?.tipoDeCalculo || 'N/A';
  const kmr  = rrhh?.detalle?.kmRealesTotales ?? '—';
  const kmp  = rrhh?.detalle?.kmParaPagar ?? '—';
  console.log(`\n  ${GR}┌─ Cálculo ────────────────────────────────────────────────────┐${R}`);
  console.log(`  ${GR}│ RRHH: ${ars(rrhh.totalFinal).padEnd(14)} Vehículo: ${ars(veh?.totalFinal || 0).padEnd(12)} Admin: ${ars(res.totalAdministrativo)}${R}`);
  console.log(`  ${GR}│ Op.: ${ars(res.totalOperativo).padEnd(15)} Ganancia: ${ars(res.ganancia).padEnd(12)} c/IVA: ${ars(res.totalConIVA)}${R}`);
  console.log(`  ${GR}│ Tipo RRHH: ${tipo.substring(0, 50)}${R}`);
  console.log(`  ${GR}│ km reales: ${kmr}  →  km a pagar: ${kmp}  (viajes/mes: ${res.cantidadViajesMensuales?.toFixed(2)})${R}`);
  console.log(`  ${GR}└─────────────────────────────────────────────────────────────┘${R}\n`);
}

// ─── TEST CASES ───────────────────────────────────────────────────────────────

const TESTS = [

  // ══════════════════════════════════════════════════════════════════════════
  // GRUPO A — Los 3 Niveles de RRHH (N1B Mínimo, N1B Proporcional, N1A, N2)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'TC-01', grupo: 'RRHH — Nivel 1B: Mínimo Facturable',
    descripcion: [
      'Entrega urbana CABA: 30 km, 90 min duración.',
      'tiempoTotal = 90+30 = 120 min = minimoMinutosFacturables → rama MÍNIMO.',
      'kmMin = 150 (30 < 200 km). Se factura: max(30, 150) = 150 km.',
      'sueldoAjust = 917462×1.15 = 1.055.081 → jornal = 43.962 → costo/min = 91.59',
      'costoBase = 120 × 91.59 = 10.990 | adicionalKm = 73.40×150 = 11.010',
      'adicionalFijo = 53000 × 120/480 = 13.250 | cargas = 22000 × 0.35 = 7.700',
      'TOTAL RRHH = 22.000 + 13.250 + 11.010 + 7.700 = 53.960',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 30, duracionMin: 90,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo',       contiene: 'Mín',          label: 'Nivel RRHH debe ser "Mínimo Facturable"' },
      { campo: 'calculoRecurso.detalle.horasFacturadasPorViaje', valor: 2.0, tolerancia: 0.01, label: 'Horas facturadas = 2.0 h (el mínimo CCT)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',         valor: 150, tolerancia: 0, label: 'kmParaPagar = 150 (mínimo corto aplicado, no 30 km reales)' },
      { campo: 'calculoRecurso.detalle.adicionalKm',         valor: Math.round(73.40 * 150), tolerancia: 1, label: `adicionalKm = ${Math.round(73.40 * 150)} ($73.40 × 150 km)` },
      { campo: 'calculoRecurso.totalFinal',                  valor: 53_961, label: 'Total RRHH ≈ $53.961' },
    ],
  },

  {
    id: 'TC-02', grupo: 'RRHH — Nivel 1B: Proporcional',
    descripcion: [
      'Reparto semi-urbano: 80 km, 140 min.',
      'tiempoTotal = 140+30 = 170 min → entre mínimo(120) y umbral(180) → PROPORCIONAL.',
      'costoBase = 170 × 91.59 = 15.570 | adicionalKm = 73.40×150 = 11.010',
      'adicionalFijo = 53000 × 170/480 = 18.771',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 80, duracionMin: 140,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo',           contiene: 'Proporcional', label: 'Nivel RRHH = Proporcional (entre 2h y 3h)' },
      { campo: 'calculoRecurso.detalle.horasFacturadasPorViaje', valor: 2.83, tolerancia: 0.02, label: 'Horas facturadas ≈ 2.83h (170 min / 60)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',             valor: 150, tolerancia: 0, label: 'kmParaPagar = 150 (los 80 km reales < mínimo corto 150)' },
    ],
  },

  {
    id: 'TC-03', grupo: '⭐ CRÍTICO — Ambos umbrales exactos: 200 km + 180 min',
    descripcion: [
      'kmsPorViaje = 200: 200 < 200 es FALSE → usa km_min LARGO = 350 (no 150!).',
      'duracionMin = 150: + 30 C/D = 180 min → exactamente en umbral → JORNADA COMPLETA.',
      'costoBase = jornal = 43.962 | kmParaPagar = max(200, 350) = 350',
      'adicionalKm = 73.40×350 = 25.690 | adicionalFijo = 53000×180/480 = 19.875',
      'TOTAL RRHH = 69.652 + 19.875 + 25.690 + 24.378 = 139.595',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 200, duracionMin: 150,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo', contiene: 'Jornada Completa', label: 'Nivel RRHH = Jornada Completa (180 min inclusive)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',   valor: 350, tolerancia: 0, label: '🔑 kmParaPagar = 350 (200 NO es < 200, activa km_min LARGO)' },
      { campo: 'calculoRecurso.detalle.kmRealesTotales', valor: 200, tolerancia: 0, label: 'km reales = 200 (el mínimo 350 domina porque 350 > 200)' },
      { campo: 'calculoRecurso.totalFinal', valor: 139_595, label: 'Total RRHH ≈ $139.595' },
    ],
  },

  {
    id: 'TC-04', grupo: 'RRHH — Nivel 1A: Horas Extra ×1.5',
    descripcion: [
      'Larga distancia: 400 km, 570 min. tiempoTotal = 600 min > 480 (jornada).',
      'Extras = 120 min × 91.59 × 1.5 = 16.486. costoBase = 43.962 + 16.486 = 60.448.',
      'kmParaPagar = max(400, 350) = 400 km REALES ganan al mínimo CCT.',
      'TOTAL RRHH = 89.808 + 53.000 + 29.360 + 31.432 = 203.600',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 400, duracionMin: 570,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo',     contiene: 'Extra',  label: 'Nivel RRHH incluye Horas Extra' },
      { campo: 'calculoRecurso.detalle.horasExtraPorViaje', valor: 2.0, tolerancia: 0.05, label: 'horasExtraPorViaje = 2.0h (120 min / 60)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',       valor: 400, tolerancia: 0, label: '🔑 kmParaPagar = 400 km REALES (ganan al mínimo 350)' },
      { campo: 'calculoRecurso.totalFinal', valor: 203_600, label: 'Total RRHH ≈ $203.600' },
    ],
  },

  {
    id: 'TC-05', grupo: 'RRHH — Nivel 2: Sueldo Mensual Completo (sin extras)',
    descripcion: [
      'Chofer full-time: mensual 5 días/semana, 80 km/día, 210 min/viaje.',
      'esSueldoCompleto = true (mensual && 5 >= 4) → Nivel 2.',
      'costoBase = sueldoAjustado = 1.055.081 (directo, no jornal × días).',
      'tiempoExtra = max(0, 240-480) = 0 → sin extras.',
      'cantidadViajes = 5 × 4.33 = 21.65 | kmReales = 80 × 21.65 = 1.732',
      'kmParaPagar = max(1.732, 150×1) = 1.732 (reales > mínimo mensual)',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 80, duracionMin: 210,
      frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M','X','J','V'], viajesPorDia: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo', contiene: 'Sueldo Mensual Completo', label: 'Nivel RRHH = N2 "Sueldo Mensual Completo"' },
      { campo: 'calculoRecurso.detalle.costoBaseRemunerativo', valor: 1_055_081, label: 'costoBase = $1.055.081 (sueldoAjustado directo, no jornal × días)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar', valor: 1_732, label: 'kmParaPagar = 1.732 km reales (> mínimo mensual 150 km)' },
    ],
  },

  {
    id: 'TC-06', grupo: 'RRHH — Nivel 2: Sueldo Mensual + Horas Extra',
    descripcion: [
      'Full-time 4 días/semana, 510 min/viaje. tiempoTotal = 540 > 480.',
      'N2 base: 1.055.081. Extras = 60 extra_min × 91.59 × 1.5 × 17.32 viajes.',
      'costoBase = sueldoAjust + horasExtra_mensual',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 100, duracionMin: 510,
      frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M','X','J'], viajesPorDia: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo', contiene: 'Extra', label: 'Nivel RRHH = N2 + Horas Extra' },
      { campo: 'calculoRecurso.detalle.horasExtraPorViaje', valor: 1.0, tolerancia: 0.05, label: 'horasExtraPorViaje = 1.0h (60 extra_min / 60)' },
      { campo: 'calculoRecurso.detalle.costoBaseRemunerativo', esDistintoDe: 1_055_081, tolerancia: 5_000, label: 'costoBase > sueldoAjust (tiene horas extra sumadas)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar', valor: 1_732, label: 'kmParaPagar = 1.732 km reales (100 × 17.32 > mínimo)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GRUPO B — EJE 2: Km mínimos (el "cliff" y casos extremos)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'TC-07A', grupo: '⭐ CLIFF km: 199 km → usa mínimo CORTO (150)',
    descripcion: [
      '199 km: condición "199 < 200" es TRUE → kmMin = 150.',
      'kmReales = 199 > 150 mínimo → se paga lo REAL: kmParaPagar = 199.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 199, duracionMin: 80,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.kmParaPagar', valor: 199, tolerancia: 0, label: 'kmParaPagar = 199 km reales (superan el mínimo corto 150)' },
      { campo: 'calculoRecurso.detalle.adicionalKm',  valor: Math.round(73.40 * 199), tolerancia: 1, label: `adicionalKm = ${Math.round(73.40 * 199)} ($73.40 × 199 km reales)` },
    ],
  },

  {
    id: 'TC-07B', grupo: '⭐ CLIFF km: 200 km → usa mínimo LARGO (350)',
    descripcion: [
      '200 km: condición "200 < 200" es FALSE → kmMin = 350.',
      'kmReales 200 < mínimo 350 → se paga el MÍNIMO: kmParaPagar = 350.',
      '⚠️ Diferencia vs TC-07A: +$22.148 en km components por solo 1 km más.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 200, duracionMin: 80,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.kmParaPagar', valor: 350, tolerancia: 0, label: '🔑 kmParaPagar = 350 (mínimo LARGO, 200 km reales son insuficientes)' },
      { campo: 'calculoRecurso.detalle.adicionalKm',  valor: Math.round(73.40 * 350), tolerancia: 1, label: `adicionalKm = ${Math.round(73.40 * 350)} ($73.40 × 350 km mínimo)` },
    ],
  },

  {
    id: 'TC-08', grupo: 'Km reales > mínimo LARGO (km reales ganan)',
    descripcion: [
      '500 km/viaje, 2 viajes esporádicos. kmReales=500×2=1.000.',
      'kmMin = 350 × 2 viajes = 700. Pero max(1.000, 700) = 1.000 → km reales.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 500, duracionMin: 300,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 2 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.kmRealesTotales', valor: 1_000, tolerancia: 0, label: 'kmReales = 1.000 (500 km × 2 viajes)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',     valor: 1_000, tolerancia: 0, label: 'kmParaPagar = 1.000 km REALES (ganan al mínimo 700)' },
      { campo: 'calculoRecurso.detalle.adicionalKm',     valor: Math.round(73.40 * 1000), tolerancia: 1, label: `adicionalKm = ${Math.round(73.40 * 1000)} (sobre 1.000 km reales)` },
    ],
  },

  {
    id: 'TC-15', grupo: 'Esporádico múltiples viajes: km_min × cantidad',
    descripcion: [
      '5 viajes esporádicos de 50 km. Cada viaje tiene su propio mínimo CCT.',
      'kmReales = 50×5 = 250. kmMin = 150 × 5 viajes = 750.',
      'max(250, 750) = 750 → El mínimo multiplica. Factor 3× sobre km reales.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 50, duracionMin: 60,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 5 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.kmRealesTotales', valor: 250, tolerancia: 0, label: 'kmReales = 250 (50 km × 5 viajes)' },
      { campo: 'calculoRecurso.detalle.kmParaPagar',     valor: 750, tolerancia: 0, label: '🔑 kmParaPagar = 750 (150 mínimo × 5 viajes = factor 3× sobre reales)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GRUPO C — Tipos de carga (refrigerada, GNC, peligrosa)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'TC-09', grupo: 'Carga Refrigerada — combustible nafta ×1.25',
    descripcion: [
      'Distribución de alimentos fríos. Equipo de frío += 25% consumo nafta.',
      'precioCombustible_efectivo = 1200 × 1.25 = 1500 $/L',
      'combustible = (1500/8) × 120 km = 22.500',
      'Sin refrigerada: (1200/8) × 120 = 18.000. Diferencia: +$4.500.',
    ],
    input: {
      vehiculoDatos: { ...VEHICULO_BASE, tieneGNC: false },
      recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 120, duracionMin: 90,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'refrigerada' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoVehiculo.detalle.combustible', valor: Math.round((1200 * 1.25 / 8) * 120), tolerancia: 1, label: `combustible = ${Math.round((1200 * 1.25 / 8) * 120)} (factor ×1.25 aplicado)` },
    ],
    notas: [`Sin refrigerada sería: ${ars((1200 / 8) * 120)} | Extra por refrigeración: ${ars((1200 * 0.25 / 8) * 120)}`],
  },

  {
    id: 'TC-10', grupo: 'GNC — factor ×1.15 rendimiento, SIN factor refrigerada',
    descripcion: [
      'GNC con carga refrigerada. El equipo de frío tiene motor independiente.',
      'GNC usa su propio rendimiento augmentado (×1.15) e IGNORA factorCargaRefrigerada.',
      'rendimientoKmGNC = 8 × 1.15 = 9.2 km/m³',
      'combustible = (350 / 9.2) × 120 = 4.565. Si se aplicara ×1.25 sería 5.707 — INCORRECTO.',
    ],
    input: {
      vehiculoDatos: { ...VEHICULO_BASE, tieneGNC: true },
      recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 120, duracionMin: 90,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'refrigerada' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoVehiculo.detalle.combustible', valor: Math.round((350 / (8 * 1.15)) * 120), tolerancia: 1, label: `combustible GNC = ${Math.round((350 / (8 * 1.15)) * 120)} (SIN ×1.25 aunque sea refrigerada)` },
    ],
    notas: [`Si aplicara incorrectamente ×1.25 sería ${ars((350 * 1.25 / (8 * 1.15)) * 120)}`],
  },

  {
    id: 'TC-11', grupo: 'Carga Peligrosa — $350/km en consolidación final',
    descripcion: [
      'Transporte de químicos: 200 km × 3 viajes = 600 km totales mensuales.',
      'adicional peligrosa = 600 km × $350/km = $210.000.',
      'Se suma en calcularResumenCostos, DESPUÉS de vehículo+RRHH, ANTES del margen.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 200, duracionMin: 150,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 3 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'peligrosa' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'resumenCostos.costoAdicionalPeligrosa', valor: 210_000, tolerancia: 0, label: 'adicional peligrosa = $210.000 (600 km × $350 — exacto)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GRUPO D — Feriados, contratado, vehículo viejo
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'TC-12A', grupo: 'Feriados: 4 días/semana → SE descuentan',
    descripcion: [
      '4 días/semana con feriadosPorMes = 1.',
      'diasBase = 4 × 4.33 = 17.32. diasEfectivos = max(17.32 - 1, 0) = 16.32.',
      'cantidadViajes = 16.32 (no 17.32).',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 80, duracionMin: 120,
      frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M','X','J'], viajesPorDia: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
      feriadosPorMes: 1,
    },
    checks: [
      { campo: 'resumenCostos.cantidadViajesMensuales', valor: 4 * 4.33 - 1, tolerancia: 0.5, label: 'cantidadViajes ≈ 16.32 (con 1 feriado descontado)' },
    ],
  },

  {
    id: 'TC-12B', grupo: 'Feriados: 3 días/semana → NO se descuentan',
    descripcion: [
      '3 días/semana, feriadosPorMes = 0 (el controlador no llama a la API).',
      'diasBase = 3 × 4.33 = 12.99. Sin descuento: cantidadViajes = 12.99.',
      'Diferencia vs TC-12A: 3.33 viajes menos por mes.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 80, duracionMin: 120,
      frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M','X'], viajesPorDia: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
      feriadosPorMes: 0,
    },
    checks: [
      { campo: 'resumenCostos.cantidadViajesMensuales', valor: 3 * 4.33, tolerancia: 0.5, label: 'cantidadViajes ≈ 12.99 (sin descuento de feriados)' },
    ],
  },

  {
    id: 'TC-13', grupo: 'Contratado 75% sobre empleado CCT equivalente',
    descripcion: [
      'Mismo viaje con contratado (factor 75%). Debe ser 75% del empleado equivalente.',
      'El empleado equivalente se calcula con DEFAULTS_RRHH.empleado, no con el recurso real.',
      'factorAplicado = 0.75 exacto.',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE,
      recursoDatos: { tipoContratacion: 'contratado', factorSobreEmpleado: 75 },
      kmsPorViaje: 150, duracionMin: 120,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo', contiene: '75%', label: 'tipoDeCalculo menciona el factor aplicado (75%)' },
      { campo: 'calculoRecurso.detalle.factorAplicado', valor: 0.75, tolerancia: 0.001, label: 'factorAplicado = 0.75 exacto' },
    ],
    notas: ['totalContratado = costoEmpleadoEquivalente × 0.75 (usando defaults CCT)'],
  },

  {
    id: 'TC-14', grupo: 'Vehículo con >10 años de antigüedad: sin depreciación',
    descripcion: [
      'Camión año 2010 → antigüedad > 10 años → incluirDepreciacion = false.',
      'depreciacion = $0. Todos los demás costos se calculan normal.',
      'Con año 2020 la depreciación sería ~$1.260/mes.',
    ],
    input: {
      vehiculoDatos: { ...VEHICULO_BASE, año: 2010 },
      recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 100, duracionMin: 120,
      frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoVehiculo.detalle.depreciacion', valor: 0, tolerancia: 0, label: 'depreciacion = $0 (año 2010, antigüedad > 10 años)' },
    ],
    notas: [`Con año 2020 la depreciación sería ~$1.260/mes`],
  },

  {
    id: 'TC-16', grupo: 'Mensual 2 días/sem → NO activa N2 (usa jornal por viaje)',
    descripcion: [
      '2 días/semana: esSueldoCompleto = mensual && 2 >= 4 → FALSE.',
      'Viaje de 210 min + 30 C/D = 240 min >= 180 → N1A Jornada Completa.',
      'costoBase = jornal × cantidadViajes (no sueldo mensual directo).',
    ],
    input: {
      vehiculoDatos: VEHICULO_BASE, recursoDatos: EMPLEADO_BASE,
      kmsPorViaje: 80, duracionMin: 210,
      frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M'], viajesPorDia: 1 },
      configuracion: CONFIG_BASE, detallesCarga: { tipo: 'general' },
      constantesCalculo: C_DEFAULTS,
    },
    checks: [
      { campo: 'calculoRecurso.detalle.tipoDeCalculo', contiene: 'Jornada Completa', label: 'Nivel = N1A Jornada Completa (no N2 sueldo mensual)' },
      { campo: 'calculoRecurso.detalle.costoBaseRemunerativo', esDistintoDe: 1_055_081, tolerancia: 5_000, label: 'costoBase ≠ $1.055.081 (si fuera N2 sería exactamente ese valor)' },
    ],
    notas: ['cantidadViajes = 2 × 4.33 = 8.66, costoBase = jornal × 8.66 ≈ $380.912'],
  },

];

// ─── EJECUTAR TODOS LOS TESTS ────────────────────────────────────────────────

console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}${C}  🧪  MEGA TEST — Motor de Cálculo Cotizador Logístico${R}`);
console.log(`${C}      16 casos · todas las ramas · datos CCT 40/89 reales${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

// Datos base calculados (para mostrar en el encabezado)
const sueldoAjust = Math.round(917_462 * 1.15);
const jornal     = Math.round(sueldoAjust / 24);
const costMin    = (jornal / 480).toFixed(2);
console.log(`${GR}  📊 Datos base CCT Mar 2026:${R}`);
console.log(`${GR}     sueldoAjust = ${ars(sueldoAjust)} | jornal = ${ars(jornal)} | costo/min = $${costMin}${R}`);
console.log(`${GR}     umbralKm = 200 km | kmMinCorto = 150 | kmMinLargo = 350${R}\n`);

let grupoActual = '';
for (const test of TESTS) {
  // Separador de grupo si cambia
  if (test.grupo !== grupoActual) {
    grupoActual = test.grupo;
  }

  console.log(`${B}${M}  ─── ${test.id} — ${test.grupo}${R}`);
  for (const linea of test.descripcion) console.log(`  ${GR}  ${linea}${R}`);
  console.log();

  let result;
  try {
    result = calcularResumenCostos(test.input);
  } catch (err) {
    fallados++;
    console.log(`  ${E}💥 ERROR AL EJECUTAR: ${err.message}${R}`);
    console.error(err);
    console.log();
    continue;
  }

  runChecks(test.checks, result);

  if (test.notas) {
    for (const nota of test.notas) console.log(`  ${W}  ℹ️  ${nota}${R}`);
  }

  miniResumen(result);
}

// ─── RESUMEN FINAL ────────────────────────────────────────────────────────────
const totalChecks = pasados + fallados;
const allOk = fallados === 0;
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}  🏁  RESULTADO FINAL${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`  ${G}✅  Pasados: ${pasados} / ${totalChecks}${R}`);
if (fallados > 0) {
  console.log(`  ${E}❌  Fallados: ${fallados} / ${totalChecks}${R}`);
  console.log(`\n  ${W}Revisá los tests marcados con ❌ arriba para ver el detalle.${R}`);
} else {
  console.log(`\n  ${G}${B}🎉  ¡TODOS LOS CHECKS PASARON! El motor funciona correctamente.${R}`);
  console.log(`  ${G}    Todas las ramas del CCT 40/89 producen los valores esperados.${R}`);
}
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

if (!allOk) process.exit(1);
