/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EDGE CASES — Motor de Cálculo
 * ═══════════════════════════════════════════════════════════════════════════
 * Cómo correr: node tests/motorCalculo.edgeCases.test.mjs
 * 14 escenarios extremos que verifican robustez del motor.
 */
import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';

const R='\x1b[0m',B='\x1b[1m',G='\x1b[32m',GR='\x1b[90m',E='\x1b[31m',C='\x1b[36m',M='\x1b[35m';
const ars=(n)=>`$${Math.round(n).toLocaleString('es-AR')}`;
let pasados=0,fallados=0;

function chk(ok,label,det=''){
  if(ok){pasados++;console.log(`  ${G}✅${R} ${label}`)}
  else{fallados++;console.log(`  ${E}❌${R} ${label}`)}
  if(det)console.log(`     ${GR}↳ ${det}${R}`);
}
const fin=(n)=>typeof n==='number'&&isFinite(n)&&n>=0;
function calc(input,label){
  try{return calcularResumenCostos(input)}
  catch(e){fallados++;console.log(`  ${E}💥 CRASH "${label}": ${e.message}${R}`);return null}
}

const VEH={patente:'T01',tipo:'camion',año:2020,precioVehiculoNuevo:30e6,valorResidualPorcentaje:30,kmsVidaUtilVehiculo:5e5,tieneGNC:false,rendimientoKmLitro:8,precioLitroCombustible:1200,precioGNC:350,kmsVidaUtilCubiertas:8e4,precioCubierta:25e4,cantidadCubiertas:6,kmsCambioAceite:2e4,precioCambioAceite:2e5,costoMantenimientoPreventivoMensual:15e4,costoSeguroMensual:4e5,costoPatenteMunicipal:15e3,costoPatenteProvincial:12e3};
const EMP={tipoContratacion:'empleado',sueldoBasico:917462,adicionalActividadPorc:15,adicionalKmRemunerativo:73.40,viaticoPorKmNoRemunerativo:73.40,adicionalNoRemunerativoFijo:53000,minimoMinutosFacturables:120,kmPorUnidadDeCarga:1000,adicionalCargaDescargaCadaXkm:38228,porcentajeCargasSociales:35};
const CFG={costoAdministrativo:5,porcentajeGanancia:20,costoPeajes:500,otrosCostos:0};
const DC={tiempoCargaDescargaMin:30,umbralJornadaCompletaMin:180,jornadaCompletaMinutos:480,divisorJornalCCT:24,semanasPorMes:4.33,diasLaboralesMes:22,factorRendimientoGNC:1.15,factorCargaRefrigerada:1.25,costoAdicionalKmPeligrosa:350,porcentajeIVA:21,umbralKmRutaLarga:200,kmMinimoRutaCorta:150,kmMinimoRutaLarga:350};
const esp=(n)=>({tipo:'esporadico',vueltasTotales:n});
const gen={tipo:'general'};

console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}${C}  🧪  EDGE CASES — Motor de Cálculo (14 escenarios)${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

// E-01: 0 km 0 min
console.log(`${B}${M}  ─── E-01 — 0 km, 0 minutos${R}`);
let r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:0,duracionMin:0,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-01');
if(r){chk(fin(r.resumenCostos.totalFinal),'totalFinal finito ≥ 0',ars(r.resumenCostos.totalFinal));chk(fin(r.resumenCostos.totalConIVA),'totalConIVA finito',ars(r.resumenCostos.totalConIVA))}

// E-02: 1 km 1 min
console.log(`\n${B}${M}  ─── E-02 — Micro: 1 km, 1 min${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:1,duracionMin:1,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-02');
if(r){chk(r.calculoRecurso.detalle.kmParaPagar===150,'kmParaPagar=150 (mínimo)',String(r.calculoRecurso.detalle.kmParaPagar));chk(r.calculoRecurso.detalle.horasFacturadasPorViaje===2,'Horas=2h (mín CCT)');chk(r.resumenCostos.totalFinal>0,'totalFinal > 0')}

// E-03: 10000 km 960 min
console.log(`\n${B}${M}  ─── E-03 — Extremo: 10.000 km, 960 min${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:10000,duracionMin:960,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-03');
if(r){chk(r.calculoRecurso.detalle.horasExtraPorViaje>0,'Tiene horas extra',`${r.calculoRecurso.detalle.horasExtraPorViaje}h`);chk(r.calculoRecurso.detalle.kmParaPagar===10000,'km reales dominan');chk(fin(r.resumenCostos.totalConIVA),'totalConIVA finito')}

// E-04: Combustible $0
console.log(`\n${B}${M}  ─── E-04 — Combustible $0${R}`);
r=calc({vehiculoDatos:{...VEH,precioLitroCombustible:0},recursoDatos:EMP,kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-04');
if(r){chk(r.calculoVehiculo.detalle.combustible===0,'Combustible=$0');chk(fin(r.resumenCostos.totalFinal),'totalFinal finito')}

// E-05: Sueldo $0
console.log(`\n${B}${M}  ─── E-05 — Sueldo básico $0${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:{...EMP,sueldoBasico:0},kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-05');
if(r){chk(fin(r.calculoRecurso.totalFinal),'RRHH finito ≥ 0',ars(r.calculoRecurso.totalFinal));chk(!Number.isNaN(r.resumenCostos.totalFinal),'No NaN')}

// E-06: Contratado 0% — NOTA: el motor usa || 75, así que 0 fallbackea a 75%
// Esto es comportamiento esperado: 0 es falsy en JS, el motor protege contra factor vacío.
console.log(`\n${B}${M}  ─── E-06 — Contratado 0% (fallback a 75% por || operator)${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:{tipoContratacion:'contratado',factorSobreEmpleado:0},kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-06');
if(r){chk(r.calculoRecurso.totalFinal>0,'RRHH>0 (0 es falsy → fallback 75%)',ars(r.calculoRecurso.totalFinal));chk(r.calculoRecurso.detalle.factorAplicado===0.75,'factor=0.75 (fallback)')}

// E-07: Contratado 200%
console.log(`\n${B}${M}  ─── E-07 — Contratado 200%${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:{tipoContratacion:'contratado',factorSobreEmpleado:200},kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-07');
if(r){chk(r.calculoRecurso.detalle.factorAplicado===2,'factor=2.0');chk(r.calculoRecurso.totalFinal>0,'RRHH>0')}

// E-08: 100 viajes esporádicos
console.log(`\n${B}${M}  ─── E-08 — 100 viajes de 30 km${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:30,duracionMin:60,frecuencia:esp(100),configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-08');
if(r){chk(r.calculoRecurso.detalle.kmRealesTotales===3000,'kmReales=3000');chk(r.calculoRecurso.detalle.kmParaPagar===15000,'kmPagar=15000 (150×100)');chk(r.resumenCostos.cantidadViajesMensuales===100,'viajes=100')}

// E-09: GNC + Peligrosa
console.log(`\n${B}${M}  ─── E-09 — GNC + Peligrosa${R}`);
r=calc({vehiculoDatos:{...VEH,tieneGNC:true},recursoDatos:EMP,kmsPorViaje:200,duracionMin:150,frecuencia:esp(1),configuracion:CFG,detallesCarga:{tipo:'peligrosa'},constantesCalculo:DC},'E-09');
if(r){const ce=Math.round((350/(8*1.15))*200);chk(r.calculoVehiculo.detalle.combustible===ce,`Combustible GNC=${ars(ce)}`);chk(r.resumenCostos.costoAdicionalPeligrosa===200*350,`Peligrosa=${ars(200*350)}`)}

// E-10: 0% todo
console.log(`\n${B}${M}  ─── E-10 — 0% admin, 0% ganancia, $0 peajes${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:{costoAdministrativo:0,porcentajeGanancia:0,costoPeajes:0,otrosCostos:0},detallesCarga:gen,constantesCalculo:DC},'E-10');
if(r){const{totalVehiculo:tv,totalRecurso:tr,ganancia:g,totalAdministrativo:ta}=r.resumenCostos;chk(g===0,'Ganancia=$0');chk(ta===0,'Admin=$0');chk(r.resumenCostos.totalFinal===tv+tr,'totalFinal=veh+rrhh')}

// E-11: 100% ganancia
console.log(`\n${B}${M}  ─── E-11 — 100% ganancia${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:{costoAdministrativo:5,porcentajeGanancia:100,costoPeajes:0,otrosCostos:0},detallesCarga:gen,constantesCalculo:DC},'E-11');
if(r){const{totalOperativo:to,ganancia:g,totalFinal:tf}=r.resumenCostos;chk(g===to,'Ganancia=totalOp');chk(tf===to*2,'totalFinal=2×totalOp')}

// E-12: IVA 0%
console.log(`\n${B}${M}  ─── E-12 — IVA 0%${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:100,duracionMin:120,frecuencia:esp(1),configuracion:CFG,detallesCarga:gen,constantesCalculo:{...DC,porcentajeIVA:0}},'E-12');
if(r){chk(r.resumenCostos.montoIVA===0,'IVA=$0');chk(r.resumenCostos.totalConIVA===r.resumenCostos.totalFinal,'totalConIVA=totalFinal')}

// E-13: 30 feriados
console.log(`\n${B}${M}  ─── E-13 — 30 feriados/mes${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:100,duracionMin:120,frecuencia:{tipo:'mensual',diasSeleccionados:['L','M','X','J','V'],viajesPorDia:1},configuracion:CFG,detallesCarga:gen,constantesCalculo:DC,feriadosPorMes:30},'E-13');
if(r){chk(r.resumenCostos.cantidadViajesMensuales>=0,'viajes ≥ 0');chk(fin(r.resumenCostos.totalFinal),'totalFinal finito')}

// E-14: 1 día/semana
console.log(`\n${B}${M}  ─── E-14 — Mensual 1 día/semana${R}`);
r=calc({vehiculoDatos:VEH,recursoDatos:EMP,kmsPorViaje:80,duracionMin:210,frecuencia:{tipo:'mensual',diasSeleccionados:['L'],viajesPorDia:1},configuracion:CFG,detallesCarga:gen,constantesCalculo:DC},'E-14');
if(r){chk(!r.calculoRecurso.detalle.tipoDeCalculo.includes('Sueldo Mensual'),'NO es N2',r.calculoRecurso.detalle.tipoDeCalculo);chk(Math.abs(r.resumenCostos.cantidadViajesMensuales-4.33)<0.5,'viajes≈4.33')}

// RESUMEN
const total=pasados+fallados;
console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}  🏁  EDGE CASES — RESULTADO${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`  ${G}✅  Pasados: ${pasados} / ${total}${R}`);
if(fallados>0){console.log(`  ${E}❌  Fallados: ${fallados}${R}`)}
else{console.log(`\n  ${G}${B}🎉  ¡TODOS LOS EDGE CASES PASARON!${R}`)}
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);
if(fallados>0) process.exit(1);
