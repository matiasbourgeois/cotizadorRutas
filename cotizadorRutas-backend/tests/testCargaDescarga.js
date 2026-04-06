/**
 * ═══════════════════════════════════════════════════════════════
 * TEST: Lógica de Carga y Descarga — por evento vs por km
 * El contador paga cada 100km. ¿Qué dice el CCT? ¿Qué hace el sistema?
 * ═══════════════════════════════════════════════════════════════
 */

import { DEFAULTS_RRHH, DEFAULTS_CALCULOS } from '../models/ConfiguracionDefaults.js';
import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const SEMANAS_MES = 4.33;

// ── Valores CCT 40/89 Marzo 2026
const JORNAL_DIARIO_CCT    = 38227.60;  // ITEM 4.2.6 — Control de Descarga (1 jornal)
const ADICIONAL_KM_CCT     = 73.39857;  // ITEM 4.2.3 — Horas extras por km
const VIATICO_KM_CCT       = 73.39857;  // ITEM 4.2.4 — Viático por km

// ── Valores del sistema actual (DEFAULTS_RRHH.empleado)
const SYS_KM_INTERVALO     = 1000;      // kmPorUnidadDeCarga
const SYS_MONTO_INTERVALO  = 30160.77;  // adicionalCargaDescargaCadaXkm

const C = { ...DEFAULTS_CALCULOS };
const freq5 = { tipo: 'mensual', diasSeleccionados: ['L','M','X','J','V'], viajesPorDia: 1 };

// ══════════════════════════════════════════════════════════════
// BLOQUE 1: ¿La lógica "cada X km" representa algo del CCT?
// ══════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(80));
console.log('  ANÁLISIS 1: ¿Qué clausula del CCT se aplica por km?');
console.log('='.repeat(80));

console.log(`
  El CCT 40/89 tiene TRES conceptos relacionados con km/distancia:

  ┌─────────────────────────────────────────────────────┐
  │ ITEM 4.2.3 — Hs. extras por km recorrido            │
  │   Valor: $${ADICIONAL_KM_CCT.toFixed(5)}/km                        │
  │   Naturaleza: REMUNERATIVO                           │
  │   Aplicación: por cada km total recorrido            │
  ├─────────────────────────────────────────────────────┤
  │ ITEM 4.2.4 — Viático por km recorrido               │
  │   Valor: $${VIATICO_KM_CCT.toFixed(5)}/km                        │
  │   Naturaleza: NO REMUNERATIVO                        │
  │   Aplicación: por cada km total recorrido            │
  ├─────────────────────────────────────────────────────┤
  │ ITEM 4.2.6 — Control de Descarga                    │
  │   Valor: $${fmt(JORNAL_DIARIO_CCT)} (1 jornal completo)     │
  │   Naturaleza: REMUNERATIVO                           │
  │   Aplicación: por cada EVENTO de control/descarga    │
  └─────────────────────────────────────────────────────┘

  → El sistema ya tiene 4.2.3 y 4.2.4 como adicionalKm + viaticoKm ✅
  → El 4.2.6 es lo que el sistema llama "adicionalCargaDescarga"
  → La pregunta es: ¿cómo se define el "evento"?
`);

// ══════════════════════════════════════════════════════════════
// BLOQUE 2: Lo que hace el contador — cada 100km
// ══════════════════════════════════════════════════════════════

console.log('='.repeat(80));
console.log('  ANÁLISIS 2: "El contador paga cada 100km" — lo que eso implica');
console.log('='.repeat(80));

const rutas = [
  { name: 'Local (50km)',           km: 50  },
  { name: 'CBA→Carlos Paz (80km)', km: 80  },
  { name: 'CBA→RC solo (214km)',    km: 214 },
  { name: 'CBA→RC i/v (428km)',     km: 428 },
  { name: 'CBA→Rosario (400km)',    km: 400 },
  { name: 'CBA→BsAs (700km)',       km: 700 },
];

const intervalos = [
  { label: 'Sistema actual (cada 1.000km)', intervalo: 1000, monto: SYS_MONTO_INTERVALO },
  { label: 'Contador (cada 100km)',          intervalo: 100,  monto: SYS_MONTO_INTERVALO },
  { label: 'CCT ITEM 4.2.6 (por evento=viaje)', intervalo: null, montoFijo: JORNAL_DIARIO_CCT },
];

console.log('\n  ── Costo de Carga/Descarga por VIAJE individual:\n');
console.log('Ruta'.padEnd(28) + '| c/1.000km'.padEnd(14) + '| c/100km'.padEnd(14) + '| por evento (1 jornal)');
console.log('-'.repeat(75));

for (const r of rutas) {
  const tramos1000 = Math.round(r.km / 1000);
  const tramos100  = Math.round(r.km / 100);

  const montoSistema = tramos1000 * SYS_MONTO_INTERVALO;
  const montoContador = tramos100 * SYS_MONTO_INTERVALO;
  const montoEvento = JORNAL_DIARIO_CCT; // 1 jornal por viaje con descarga

  console.log(
    r.name.padEnd(28) +
    `| ${fmt(montoSistema).padStart(11)} ` +
    `| ${fmt(montoContador).padStart(11)} ` +
    `| ${fmt(montoEvento)}`
  );
}

// ══════════════════════════════════════════════════════════════
// BLOQUE 3: Impacto mensual completo (5 días/sem, CBA→RC 428km)
// ══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('  ANÁLISIS 3: Impacto mensual — 5 días/sem, CBA→RC (428km)');
console.log('='.repeat(80));

const KM_RUTA       = 428;
const VIAJES_MES    = 5 * SEMANAS_MES; // ~21.65
const KM_MES_TOTAL  = KM_RUTA * VIAJES_MES;

// Sistema actual (cada 1000km)
const tramos1000Mes  = Math.round(KM_MES_TOTAL / 1000);
const monto1000Mes   = tramos1000Mes * SYS_MONTO_INTERVALO;

// Contador (cada 100km)
const tramos100Mes   = Math.round(KM_MES_TOTAL / 100);
const monto100Mes    = tramos100Mes * SYS_MONTO_INTERVALO;

// Por evento (1 jornal por viaje)
const montoPorEvento = JORNAL_DIARIO_CCT * VIAJES_MES;

// CCT real (4.2.3 + 4.2.4 que ya están en el sistema = por km directo)
const montoKmDirecto = (ADICIONAL_KM_CCT + VIATICO_KM_CCT) * KM_MES_TOTAL;

console.log(`\n  km/mes totales: ${Math.round(KM_MES_TOTAL).toLocaleString('es-AR')} km | Viajes: ~${VIAJES_MES.toFixed(1)}/mes\n`);
console.log('Interpretación'.padEnd(38) + '| Tramos'.padEnd(10) + '| Costo/mes');
console.log('-'.repeat(60));
console.log(
  'A) Sistema actual (cada 1.000km)'.padEnd(38) +
  `| ${tramos1000Mes.toString().padStart(7)} ` +
  `| ${fmt(monto1000Mes)}`
);
console.log(
  'B) Contador (cada 100km)'.padEnd(38) +
  `| ${tramos100Mes.toString().padStart(7)} ` +
  `| ${fmt(monto100Mes)}`
);
console.log(
  'C) CCT puro (1 jornal por viaje)'.padEnd(38) +
  `| ${Math.round(VIAJES_MES).toString().padStart(7)} ` +
  `| ${fmt(montoPorEvento)}`
);
console.log(
  'D) CCT 4.2.3+4.2.4 ($/km directo)'.padEnd(38) +
  `| (km)`.padStart(9) +
  `  | ${fmt(montoKmDirecto)}`
);

console.log('\n  📌 OBSERVACIÓN CLAVE:');
console.log(`  → Opción A (sistema): $${SYS_MONTO_INTERVALO.toLocaleString('es-AR')} cada 1.000km = $${(SYS_MONTO_INTERVALO/1000).toFixed(2)} efectivo por km`);
console.log(`  → Opción B (contador): $${SYS_MONTO_INTERVALO.toLocaleString('es-AR')} cada 100km = $${(SYS_MONTO_INTERVALO/100).toFixed(2)} efectivo por km`);
console.log(`  → CCT 4.2.3+4.2.4: $${(ADICIONAL_KM_CCT + VIATICO_KM_CCT).toFixed(2)} directo por km`);
console.log(`\n  El "cada 100km" del contador con el mismo monto del sistema`);
console.log(`  es 10x más caro que el sistema. ¿Es así o el monto también cambia?`);

// ══════════════════════════════════════════════════════════════
// BLOQUE 4: ¿Cuál sería el monto correcto por km para igualar el CCT?
// ══════════════════════════════════════════════════════════════

console.log('\n\n' + '='.repeat(80));
console.log('  ANÁLISIS 4: ¿Cuál sería el monto coherente con el CCT?');
console.log('='.repeat(80));

// El "adicionalCargaDescargaCadaXkm" del sistema parece ser una simplificación
// del ITEM 4.2.3 (extras por km). Veamos si los valores son coherentes:

const efectivoSistema = SYS_MONTO_INTERVALO / SYS_KM_INTERVALO; // $/km efectivo
const cctPorKm = ADICIONAL_KM_CCT; // $/km del CCT

console.log(`\n  Sistema actual (${SYS_MONTO_INTERVALO} / ${SYS_KM_INTERVALO}km) = $${efectivoSistema.toFixed(2)}/km`);
console.log(`  CCT ITEM 4.2.3 puro = $${cctPorKm.toFixed(5)}/km`);
console.log(`  DIFERENCIA: $${(efectivoSistema - cctPorKm).toFixed(2)}/km`);
console.log(`\n  → El sistema usa $30.16/km para "carga/descarga",`);
console.log(`    el CCT define $73.40/km para el item de horas extras por km.`);
console.log(`    Si lo del contador es "cada 100km el 4.2.6 (1 jornal)",`);
console.log(`    eso sería: $38.227 cada 100km = $382.27/km... eso es ALTÍSIMO.`);
console.log(`\n  INTERPRETACIÓN MÁS LÓGICA:`);
console.log(`  El contador probablemente paga 1 jornal por cada VIAJE completo`);
console.log(`  y usa "100km" como el umbral mínimo para que aplique el ítem.`);
console.log(`  (o sea: si el viaje supera los 100km → paga el jornal de control de descarga)`);

const montoPorEventoConUmbral100 = JORNAL_DIARIO_CCT * VIAJES_MES;
console.log(`\n  Con esa lectura → $${fmt(JORNAL_DIARIO_CCT)} × ${VIAJES_MES.toFixed(1)} viajes = ${fmt(montoPorEventoConUmbral100)}/mes`);
console.log(`  Vs sistema actual: ${fmt(monto1000Mes)}/mes`);
console.log(`  DIFERENCIA: ${fmt(montoPorEventoConUmbral100 - monto1000Mes)} más costoso con lógica del contador`);

console.log('\n' + '='.repeat(80) + '\n');
process.exit(0);
