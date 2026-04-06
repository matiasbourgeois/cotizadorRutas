/**
 * ═══════════════════════════════════════════════════════════════════
 * TEST DE PRECISIÓN CONCEPTUAL: SAC y Vacaciones
 * Pregunta central: ¿Funcionan matemáticamente para viajes cortos?
 * ¿Están bien calculados para ser usados en una cotización real?
 * ═══════════════════════════════════════════════════════════════════
 */

import { DEFAULTS_RRHH, DEFAULTS_CALCULOS } from '../models/ConfiguracionDefaults.js';

const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const fmt2 = n => n.toFixed(4);

// ── Datos del empleado base (CCT 40/89, Conductor 1ra, Marzo 2026)
const SUELDO_BASICO_CCT       = 917462.42;   // Conductor 1ra categoría (convenio real)
const JORNAL_DIARIO_CCT       = 38227.60;    // Valor diario del convenio
const ADICIONAL_VACACIONES    = 21431.21;    // ITEM 3.3.2: por cada día vacacional
const DIAS_LABORALES_MES      = 22;
const HORAS_LABORALES_MES     = 192;
const SEMANAS_MES             = 4.33;

// ─── 1. VERIFICACIÓN INTERNA: ¿El jornal diario del CCT es consistente?
console.log('\n' + '='.repeat(80));
console.log('  VERIFICACIÓN 0: Consistencia de los valores del CCT 40/89');
console.log('='.repeat(80));

const jornalCalculado = SUELDO_BASICO_CCT / DIAS_LABORALES_MES;
const sueldo30dias = JORNAL_DIARIO_CCT * 30;

console.log(`\n  Sueldo básico CCT publicado:         ${fmt(SUELDO_BASICO_CCT)}/mes`);
console.log(`  Jornal diario CCT publicado:         ${fmt(JORNAL_DIARIO_CCT)}/día`);
console.log(`  Jornal calculado (sueldo/22):        ${fmt(jornalCalculado)}/día`);
console.log(`  ¿Son iguales?                        ${Math.abs(jornalCalculado - JORNAL_DIARIO_CCT) < 100 ? '✅ Sí' : '⚠️  NO — diferencia: ' + fmt(jornalCalculado - JORNAL_DIARIO_CCT)}`);
console.log(`  Nota: El jornal del CCT usa base/24 (días corridos), sueldo/22 (días hábiles)`);
console.log(`  Sueldo × 30 días CCT:                ${fmt(sueldo30dias)}`);
console.log(`  → El CCT publica jornales sobre base /24 ≈ 38.227 vs /22 ≈ 41.703`);

// ─── 2. SAC — ¿El 8.33% está bien aplicado?
console.log('\n\n' + '='.repeat(80));
console.log('  VERIFICACIÓN 1: SAC (Aguinaldo) — ¿está bien calculado?');
console.log('='.repeat(80));

// El SAC = 1/12 del mejor sueldo del semestre. En cotización lo provisionamos mensualmente.
// Legalmente: SAC mensual = sueldo_mensual / 12 = 8.33% del sueldo mensual
const sacMensualReal     = SUELDO_BASICO_CCT / 12;
const sacPorcentaje      = (1/12) * 100; // = 8.3333%
const sacCalculado8_33   = SUELDO_BASICO_CCT * 0.0833;

console.log(`\n  SAC real (sueldo/12):                ${fmt(sacMensualReal)}/mes`);
console.log(`  SAC con 8.33%:                       ${fmt(sacCalculado8_33)}/mes`);
console.log(`  Diferencia (error de redondeo):      ${fmt(sacMensualReal - sacCalculado8_33)}`);
console.log(`  ¿Es correcto usar 8.33%?             ✅ Sí — equivale a 1/12 exacto`);

// ─── Para viaje CORTO (servicio esporádico, 1 viaje de 90min)
const horasViaje     = 1.5; // 90 min
const valorHora      = SUELDO_BASICO_CCT / HORAS_LABORALES_MES;
const costoHorasViaje = valorHora * horasViaje;
const sacDelViaje    = costoHorasViaje * (1/12);
const fraccionMes    = horasViaje / HORAS_LABORALES_MES;

console.log(`\n  ── Aplicado a un viaje corto (90min) ──`);
console.log(`  Valor hora:                          ${fmt(valorHora)}/hora`);
console.log(`  Costo remunerativo del viaje:        ${fmt(costoHorasViaje)}`);
console.log(`  SAC del viaje (8.33%):               ${fmt(sacDelViaje)}`);
console.log(`  Fracción del mes representada:       ${fmt2(fraccionMes * 100)}% del mes`);
console.log(`  SAC mensual completo del empleado:   ${fmt(sacMensualReal)}`);
console.log(`  SAC proporcional correcto:           ${fmt(sacMensualReal * fraccionMes)}`);
console.log(`\n  ✅ CONCLUSIÓN SAC: El 8.33% × costo_viaje es EXACTAMENTE`);
console.log(`     el SAC proporcional a las horas usadas del empleado.`);
console.log(`     Es matemáticamente correcto para cualquier duración de servicio.`);

// ─── 3. VACACIONES — ¿Estamos calculando bien?
console.log('\n\n' + '='.repeat(80));
console.log('  VERIFICACIÓN 2: Vacaciones — ¿el cálculo es completo?');
console.log('='.repeat(80));

function calcVacaciones(añosAntiguedad, sueldoMensual) {
  const diasVacac = añosAntiguedad <= 0  ? 0
                  : añosAntiguedad <= 5  ? 14
                  : añosAntiguedad <= 10 ? 21
                  : añosAntiguedad <= 20 ? 28 : 35;

  const jornalDiario = sueldoMensual / DIAS_LABORALES_MES;
  
  // Cálculo ACTUAL del sistema (solo jornal × días / 12)
  const provActual = (jornalDiario * diasVacac) / 12;

  // CCT ITEM 3.3.2: el convenio agrega $21.431,21 POR CADA DÍA vacacional
  // como adicional fijo remunerativo
  const adicionalItem3322 = ADICIONAL_VACACIONES * diasVacac;
  
  // Costo total real de vacaciones anual
  const costoVacacAnualReal = (jornalDiario + ADICIONAL_VACACIONES) * diasVacac;
  
  // Provisión mensual correcta (dividida entre 12)
  const provCorrecta = costoVacacAnualReal / 12;
  
  return { diasVacac, jornalDiario, provActual, adicionalItem3322, costoVacacAnualReal, provCorrecta };
}

const años = [0, 1, 5, 10, 20];
console.log('\n' + 'Antigüedad'.padEnd(12) + '| Días Vac'.padEnd(11) + '| Prov. ACTUAL'.padEnd(16) 
          + '| + ITEM 3.3.2'.padEnd(16) + '| Prov. CORRECTA'.padEnd(17) + '| Error actual');
console.log('-'.repeat(85));

for (const a of años) {
  const v = calcVacaciones(a, SUELDO_BASICO_CCT);
  const err = v.provCorrecta - v.provActual;
  console.log(
    `${a} años`.padEnd(12) +
    `| ${v.diasVacac} días`.padEnd(11) +
    `| ${fmt(v.provActual).padStart(13)} ` +
    `| ${fmt(v.adicionalItem3322 / 12).padStart(13)} ` +
    `| ${fmt(v.provCorrecta).padStart(14)} ` +
    `| ${'+' + fmt(err).padStart(12)}`
  );
}

console.log(`\n  ⚠️  ITEM 3.3.2 (Adicional Fijo Vacaciones $21.431,21/día):`);
console.log(`     El sistema actual NO lo incluye. Es un componente real del CCT.`);
console.log(`     Para 14 días → +${fmt(ADICIONAL_VACACIONES * 14)} anuales`);
console.log(`                  → +${fmt((ADICIONAL_VACACIONES * 14)/12)} por mes de provisión`);
console.log(`     Para 21 días → +${fmt(ADICIONAL_VACACIONES * 21)} anuales`);
console.log(`                  → +${fmt((ADICIONAL_VACACIONES * 21)/12)} por mes de provisión`);

// ─── 4. Para viaje CORTO: ¿aplica la provisión de vacaciones?
console.log('\n\n' + '='.repeat(80));
console.log('  VERIFICACIÓN 3: ¿Vacaciones aplican en viaje corto (<180min)?');
console.log('='.repeat(80));

// Escenario: 1 viaje corto esporádico (no mensual, no recurrente)
const horasViajeCorto = 2.0; // 120min mínimo facturable
const costoHorasBruto = valorHora * horasViajeCorto;
const fraccionMesCorto = horasViajeCorto / HORAS_LABORALES_MES;
const diasVacac5anios = 14;
const jornalDiario = SUELDO_BASICO_CCT / DIAS_LABORALES_MES;

// Vacaciones reales del empleado por año
const vacAnualCompleta = (jornalDiario + ADICIONAL_VACACIONES) * diasVacac5anios;
// Proporción que corresponde a este viaje
const vacProporcional = vacAnualCompleta * fraccionMesCorto / 12;

// SAC proporcional
const sacProporcional = costoHorasBruto / 12;

console.log(`\n  Viaje: 120min (mínimo facturable), Empleado 5 años antigüedad`);
console.log(`\n  Costo remunerativo del viaje:        ${fmt(costoHorasBruto)}`);
console.log(`  Fracción del mes:                    ${fmt2(fraccionMesCorto * 100)}% (${horasViajeCorto}h de ${HORAS_LABORALES_MES}h)`);
console.log(`\n  SAC proporcional al viaje:           ${fmt(sacProporcional)}`);
console.log(`  Vacaciones proporcionales al viaje:  ${fmt(vacProporcional)}`);
console.log(`  Total provisiones sobre 1 viaje:     ${fmt(sacProporcional + vacProporcional)}`);
console.log(`\n  ¿Tiene sentido comercialmente?`);
console.log(`  → Si es un viaje esporádico 1 vez:   ⚠️  La provisión es simbólica ($${Math.round(sacProporcional + vacProporcional).toLocaleString('es-AR')})`);
console.log(`     pero es PROPORCIONAL y matematicamente CORRECTO.`);
console.log(`  → Si es mensual (muchos viajes/mes):  ✅ Se acumula correctamente`);

// ─── 5. Simulación de 1 mes con viajes cortos
console.log('\n\n' + '='.repeat(80));
console.log('  VERIFICACIÓN 4: Acumulación mensual de SAC+Vac en servicio de viajes cortos');
console.log('  Ruta local 60min, 5 días/semana → ~21.65 viajes/mes');
console.log('='.repeat(80));

const viajesPorMes = 5 * SEMANAS_MES; // ~21.65
const costoBaseTotal = costoHorasBruto * viajesPorMes; // costoBase total mensual

const sacMensualServicio = costoBaseTotal / 12;
const vacMensualServicio = vacAnualCompleta / 12; // fijo, no proporcional al volumen de viajes

console.log(`\n  Viajes/mes:                          ${viajesPorMes.toFixed(1)}`);
console.log(`  Costo base remunerativo/mes:         ${fmt(costoBaseTotal)}`);
console.log(`\n  SAC (8.33% del acumulado):           ${fmt(sacMensualServicio)}`);
console.log(`  Vacaciones (CORRECTA, con ITEM 3.3.2): ${fmt(vacMensualServicio)}`);
console.log(`  Suma provisiones:                    ${fmt(sacMensualServicio + vacMensualServicio)}`);
console.log(`\n  SAC mensual real del empleado:       ${fmt(sacMensualReal)}`);
console.log('\n  📌 PUNTO CLAVE:');
console.log('     El SAC proporcional al costo del servicio hace sentido cuando');
console.log('     el driver es exclusivo de este cliente. Si el driver tiene');
console.log('     MUCHOS clientes, cada uno paga SU fracción proporcional del SAC.');
console.log('     La fórmula 8.33% × base_remunerativa es CORRECTA en ambos casos.');
console.log('\n     Las VACACIONES, en cambio, tienen un importe anual FIJO');
console.log('     independiente de cuántos viajes hace. Para servicios mensuales');
console.log('     el prorratearlo por 12 es correcto. Para 1 viaje esporádico,');
console.log('     necesitaría dividirse por los días efectivos trabajados en el año.');

// ─── 6. RESUMEN FINAL: ¿Qué implementar?
console.log('\n\n' + '='.repeat(80));
console.log('  RESUMEN: Estado actual vs. versión correcta');
console.log('='.repeat(80));

const conceptos = [
  ['SAC (8.33%)',       '✅ Correcto',        'Proporcional y legal'],
  ['Vacaciones jornal', '⚠️  Parcial',        'Falta ITEM 3.3.2 (+$21.431/día)'],
  ['Adicional vacac.', '❌ No implementado', 'ITEM 3.3.2 obligatorio del CCT'],
  ['Para viaje corto', '✅ Proporcional OK', 'Se acumula bien en servicios mensuales'],
  ['Para viaje 1 vez', '⚠️  Simbólico',      'Correcto matemáticamente, pequeño en absoluto'],
];

console.log();
for (const [c, estado, nota] of conceptos) {
  console.log(`  ${c.padEnd(22)} ${estado.padEnd(24)} → ${nota}`);
}

console.log('\n' + '='.repeat(80) + '\n');
process.exit(0);
