/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONSOLIDACIÓN — Invariantes Matemáticas del Motor
 * ═══════════════════════════════════════════════════════════════════════════
 * Cómo correr: node tests/consolidacion.test.mjs
 *
 * Verifica que las fórmulas de consolidación SIEMPRE se cumplan,
 * sin importar la combinación de inputs. Genera múltiples combinaciones
 * y valida 10 invariantes contra cada una.
 */
import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';

const R='\x1b[0m',B='\x1b[1m',G='\x1b[32m',GR='\x1b[90m',E='\x1b[31m',C='\x1b[36m',M='\x1b[35m';
const ars=(n)=>`$${Math.round(n).toLocaleString('es-AR')}`;
let pasados=0,fallados=0;

function chk(ok,label,det=''){
  if(ok){pasados++;console.log(`  ${G}✅${R} ${label}`)}
  else{fallados++;console.log(`  ${E}❌${R} ${label}`);if(det)console.log(`     ${GR}↳ ${det}${R}`)}
}

const VEH={patente:'T01',tipo:'camion',año:2020,precioVehiculoNuevo:30e6,valorResidualPorcentaje:30,kmsVidaUtilVehiculo:5e5,tieneGNC:false,rendimientoKmLitro:8,precioLitroCombustible:1200,precioGNC:350,kmsVidaUtilCubiertas:8e4,precioCubierta:25e4,cantidadCubiertas:6,kmsCambioAceite:2e4,precioCambioAceite:2e5,costoMantenimientoPreventivoMensual:15e4,costoSeguroMensual:4e5,costoPatenteMunicipal:15e3,costoPatenteProvincial:12e3};
const EMP={tipoContratacion:'empleado',sueldoBasico:917462,adicionalActividadPorc:15,adicionalKmRemunerativo:73.40,viaticoPorKmNoRemunerativo:73.40,adicionalNoRemunerativoFijo:53000,minimoMinutosFacturables:120,kmPorUnidadDeCarga:1000,adicionalCargaDescargaCadaXkm:38228,porcentajeCargasSociales:35};
const DC={tiempoCargaDescargaMin:30,umbralJornadaCompletaMin:180,jornadaCompletaMinutos:480,divisorJornalCCT:24,semanasPorMes:4.33,diasLaboralesMes:22,factorRendimientoGNC:1.15,factorCargaRefrigerada:1.25,costoAdicionalKmPeligrosa:350,porcentajeIVA:21,umbralKmRutaLarga:200,kmMinimoRutaCorta:150,kmMinimoRutaLarga:350};

// ─── Combinaciones a probar ────────────────────────────────────────────────
const COMBOS = [
  { id:'C-ESP-EMP-GEN', frec:{tipo:'esporadico',vueltasTotales:1}, rec:EMP, carga:{tipo:'general'}, cfg:{costoAdministrativo:5,porcentajeGanancia:20,costoPeajes:500,otrosCostos:0}, km:150, min:120 },
  { id:'C-ESP-EMP-REF', frec:{tipo:'esporadico',vueltasTotales:3}, rec:EMP, carga:{tipo:'refrigerada'}, cfg:{costoAdministrativo:10,porcentajeGanancia:15,costoPeajes:1000,otrosCostos:5000}, km:300, min:400 },
  { id:'C-ESP-CON-PEL', frec:{tipo:'esporadico',vueltasTotales:2}, rec:{tipoContratacion:'contratado',factorSobreEmpleado:75}, carga:{tipo:'peligrosa'}, cfg:{costoAdministrativo:5,porcentajeGanancia:25,costoPeajes:200,otrosCostos:0}, km:250, min:200 },
  { id:'C-MEN-EMP-GEN', frec:{tipo:'mensual',diasSeleccionados:['L','M','X','J','V'],viajesPorDia:1}, rec:EMP, carga:{tipo:'general'}, cfg:{costoAdministrativo:5,porcentajeGanancia:20,costoPeajes:500,otrosCostos:0}, km:80, min:210 },
  { id:'C-MEN-EMP-REF', frec:{tipo:'mensual',diasSeleccionados:['L','M','X'],viajesPorDia:2}, rec:EMP, carga:{tipo:'refrigerada'}, cfg:{costoAdministrativo:8,porcentajeGanancia:30,costoPeajes:300,otrosCostos:1000}, km:50, min:90 },
  { id:'C-MEN-CON-GEN', frec:{tipo:'mensual',diasSeleccionados:['L','M'],viajesPorDia:1}, rec:{tipoContratacion:'contratado',factorSobreEmpleado:100}, carga:{tipo:'general'}, cfg:{costoAdministrativo:0,porcentajeGanancia:0,costoPeajes:0,otrosCostos:0}, km:400, min:500 },
];

console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}${C}  🧪  CONSOLIDACIÓN — Invariantes Matemáticas${R}`);
console.log(`${C}      10 invariantes × ${COMBOS.length} combinaciones = ${COMBOS.length * 10} checks${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

for (const combo of COMBOS) {
  console.log(`${B}${M}  ─── ${combo.id}${R}`);
  console.log(`  ${GR}km=${combo.km} min=${combo.min} frec=${combo.frec.tipo} recurso=${combo.rec.tipoContratacion} carga=${combo.carga.tipo}${R}\n`);

  const result = calcularResumenCostos({
    vehiculoDatos: VEH, recursoDatos: combo.rec,
    kmsPorViaje: combo.km, duracionMin: combo.min,
    frecuencia: combo.frec, configuracion: combo.cfg,
    detallesCarga: combo.carga, constantesCalculo: DC,
  });

  const rs = result.resumenCostos;
  const tv = rs.totalVehiculo;
  const tr = rs.totalRecurso;
  const tp = rs.totalPeajes;
  const ta = rs.totalAdministrativo;
  const ot = rs.otrosCostos;
  const ap = rs.costoAdicionalPeligrosa;
  const to = rs.totalOperativo;
  const ga = rs.ganancia;
  const tf = rs.totalFinal;
  const iv = rs.montoIVA;
  const tc = rs.totalConIVA;

  // I-01: totalOperativo = sum of components
  const sumComp = tv + tr + tp + ta + ot + ap;
  chk(Math.abs(to - sumComp) <= 1, 'I-01: totalOp = veh+rrhh+peajes+admin+otros+peligrosa', `${ars(to)} vs ${ars(sumComp)}`);

  // I-02: ganancia = totalOp × %ganancia / 100
  const gaExpected = Math.round(to * combo.cfg.porcentajeGanancia / 100);
  chk(Math.abs(ga - gaExpected) <= 1, 'I-02: ganancia = totalOp × %ganancia', `${ars(ga)} vs ${ars(gaExpected)}`);

  // I-03: totalFinal = totalOp + ganancia
  chk(tf === to + ga, 'I-03: totalFinal = totalOp + ganancia', `${ars(tf)} = ${ars(to)} + ${ars(ga)}`);

  // I-04: montoIVA = totalFinal × %IVA / 100
  const ivExpected = Math.round(tf * 21 / 100);
  chk(Math.abs(iv - ivExpected) <= 1, 'I-04: IVA = totalFinal × 21%', `${ars(iv)} vs ${ars(ivExpected)}`);

  // I-05: totalConIVA = totalFinal + montoIVA
  chk(tc === tf + iv, 'I-05: totalConIVA = totalFinal + IVA', `${ars(tc)} = ${ars(tf)} + ${ars(iv)}`);

  // I-06: admin = (veh + rrhh) × %admin / 100
  const taExpected = Math.round((tv + tr) * combo.cfg.costoAdministrativo / 100);
  chk(Math.abs(ta - taExpected) <= 1, 'I-06: admin = (veh+rrhh) × %admin', `${ars(ta)} vs ${ars(taExpected)}`);

  // I-07: totalFinal >= totalOperativo
  chk(tf >= to, 'I-07: totalFinal ≥ totalOperativo', `${ars(tf)} ≥ ${ars(to)}`);

  // I-08: totalConIVA >= totalFinal
  chk(tc >= tf, 'I-08: totalConIVA ≥ totalFinal', `${ars(tc)} ≥ ${ars(tf)}`);

  // I-09: Idempotencia — calcular 2 veces = mismo resultado
  const result2 = calcularResumenCostos({
    vehiculoDatos: VEH, recursoDatos: combo.rec,
    kmsPorViaje: combo.km, duracionMin: combo.min,
    frecuencia: combo.frec, configuracion: combo.cfg,
    detallesCarga: combo.carga, constantesCalculo: DC,
  });
  chk(result2.resumenCostos.totalFinal === tf, 'I-09: Idempotente (2 ejecuciones = mismo resultado)', `${ars(result2.resumenCostos.totalFinal)} = ${ars(tf)}`);

  // I-10: cantidadViajes >= 0
  chk(rs.cantidadViajesMensuales >= 0, 'I-10: cantidadViajes ≥ 0', String(rs.cantidadViajesMensuales));

  console.log();
}

// RESUMEN
const total=pasados+fallados;
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}  🏁  CONSOLIDACIÓN — RESULTADO${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`  ${G}✅  Pasados: ${pasados} / ${total}${R}`);
if(fallados>0){console.log(`  ${E}❌  Fallados: ${fallados}${R}`)}
else{console.log(`\n  ${G}${B}🎉  ¡TODAS LAS INVARIANTES SE CUMPLEN!${R}`)}
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);
if(fallados>0) process.exit(1);
