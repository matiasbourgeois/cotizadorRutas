// Ejecutar: node tests/testCalculos.js

import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';
import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';
import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';

const SEMANAS_POR_MES = 4.33;
let passed = 0;
let failed = 0;

function assert(testName, actual, expected, tolerance = 1) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`  ✅ ${testName}: ${actual} (esperado: ${expected})`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}: ${actual} (esperado: ${expected}, diff: ${diff})`);
    failed++;
  }
}

function assertNotNaN(testName, value) {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    console.log(`  ✅ ${testName}: ${value} (válido)`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}: ${value} (inválido — NaN o Infinity)`);
    failed++;
  }
}

// =========================================================
// Datos de prueba
// =========================================================

const vehiculoBase = {
  marca: 'TestCar', modelo: 'X100', año: 2022,
  tipoVehiculo: 'utilitario',
  precioVehiculoNuevo: 30000000,
  valorResidualPorcentaje: 20,
  kmsVidaUtilVehiculo: 300000,
  precioCubierta: 150000, cantidadCubiertas: 4, kmsVidaUtilCubiertas: 50000,
  precioCambioAceite: 80000, kmsCambioAceite: 10000,
  rendimientoKmLitro: 10,
  precioLitroCombustible: 1200,
  tieneGNC: false, precioGNC: 0,
  costoMantenimientoPreventivoMensual: 50000,
  costoSeguroMensual: 80000,
  costoPatenteMunicipal: 15000,
  costoPatenteProvincial: 20000,
};

const recursoBase = {
  nombre: 'Test Chofer',
  tipoContratacion: 'empleado',
  sueldoBasico: 723858,
  adicionalActividadPorc: 15,
  horasLaboralesMensuales: 192,
  minimoMinutosFacturables: 120,
  adicionalKmRemunerativo: 57.90,
  viaticoPorKmNoRemunerativo: 57.90,
  adicionalNoRemunerativoFijo: 50000,
  adicionalCargaDescargaCadaXkm: 30160.77,
  kmPorUnidadDeCarga: 1000,
  porcentajeCargasSociales: 30,
  porcentajeOverheadContratado: 10,
};

// =========================================================
// T1: Viaje corto, mensual, empleado
// =========================================================
console.log('\n📋 T1: Viaje corto, mensual, 5 días, empleado');
{
  const kms = 50;
  const duracion = 90; // < 180 → viaje corto
  const frecuencia = { tipo: 'mensual', diasSeleccionados: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], viajesPorDia: 1 };
  const viajesMes = 5 * 1 * SEMANAS_POR_MES; // 21.65

  const resultV = calcularCostoVehiculo(vehiculoBase, kms, viajesMes, duracion, { tipo: 'general' });
  const resultR = calcularCostoTotalRecurso(recursoBase, kms, duracion, frecuencia);

  assertNotNaN('Vehículo totalFinal', resultV.totalFinal);
  assertNotNaN('RRHH totalFinal', resultR.totalFinal);
  assert('Vehículo kmsMensuales', resultV.kmsMensuales, kms * viajesMes);
  assert('RRHH tipoDeCalculo', resultR.detalle.tipoDeCalculo === 'Servicio Corto (Por Hora)' ? 1 : 0, 1, 0);
  assert('proporcionUso es number', typeof resultV.proporcionUso === 'number' ? 1 : 0, 1, 0);
}

// =========================================================
// T2: Viaje largo, mensual, 3 días, empleado
// =========================================================
console.log('\n📋 T2: Viaje largo, mensual, 3 días, empleado');
{
  const kms = 300;
  const duracion = 240; // > 180 → viaje largo
  const frecuencia = { tipo: 'mensual', diasSeleccionados: ['lunes', 'miercoles', 'viernes'], viajesPorDia: 1 };
  const viajesMes = 3 * 1 * SEMANAS_POR_MES; // 12.99

  const resultV = calcularCostoVehiculo(vehiculoBase, kms, viajesMes, duracion, { tipo: 'general' });
  const resultR = calcularCostoTotalRecurso(recursoBase, kms, duracion, frecuencia);

  assertNotNaN('Vehículo totalFinal', resultV.totalFinal);
  assertNotNaN('RRHH totalFinal', resultR.totalFinal);
  assert('RRHH tipoDeCalculo', resultR.detalle.tipoDeCalculo === 'Servicio Dedicado (Por Jornada)' ? 1 : 0, 1, 0);
  // Viaje largo: proporción de uso debe ser 1
  assert('proporcionUso = 1', resultV.proporcionUso, 1, 0);
}

// =========================================================
// T3: Viaje corto, esporádico, 1 vuelta, contratado
// =========================================================
console.log('\n📋 T3: Viaje corto, esporádico, 1 vuelta, contratado');
{
  const recursoContratado = { ...recursoBase, tipoContratacion: 'contratado' };
  const kms = 80;
  const duracion = 60;
  const frecuencia = { tipo: 'esporadico', vueltasTotales: 1 };

  const resultV = calcularCostoVehiculo(vehiculoBase, kms, 1, duracion, { tipo: 'general' });
  const resultR = calcularCostoTotalRecurso(recursoContratado, kms, duracion, frecuencia);

  assertNotNaN('Vehículo totalFinal', resultV.totalFinal);
  assertNotNaN('RRHH totalFinal', resultR.totalFinal);
  assert('RRHH usa overhead contratado', resultR.detalle.costoIndirectoLabel.includes('Overhead') ? 1 : 0, 1, 0);
  // Mínimo facturable: 120 min (el viaje es 60+30=90 min, pero se factura 120 min)
  assert('RRHH tipoDeCalculo', resultR.detalle.tipoDeCalculo === 'Servicio Corto (Por Hora)' ? 1 : 0, 1, 0);
}

// =========================================================
// T4: Viaje largo, esporádico, 5 vueltas, empleado
// =========================================================
console.log('\n📋 T4: Viaje largo, esporádico, 5 vueltas, empleado');
{
  const kms = 400;
  const duracion = 300;
  const frecuencia = { tipo: 'esporadico', vueltasTotales: 5 };

  const resultV = calcularCostoVehiculo(vehiculoBase, kms, 5, duracion, { tipo: 'general' });
  const resultR = calcularCostoTotalRecurso(recursoBase, kms, duracion, frecuencia);

  assertNotNaN('Vehículo totalFinal', resultV.totalFinal);
  assertNotNaN('RRHH totalFinal', resultR.totalFinal);
  assert('RRHH tipoDeCalculo', resultR.detalle.tipoDeCalculo === 'Servicio Dedicado (Por Jornada)' ? 1 : 0, 1, 0);
  assert('Vehículo kmsMensuales', resultV.kmsMensuales, 400 * 5);
}

// =========================================================
// T5: Vehículo GNC + carga refrigerada
// =========================================================
console.log('\n📋 T5: Vehículo GNC + carga refrigerada');
{
  const vehiculoGNC = { ...vehiculoBase, tieneGNC: true, precioGNC: 600 };
  const kms = 100;
  const duracion = 120;
  const viajesMes = 20;

  // Con GNC, el factor ×1.25 de refrigerada NO aplica (solo aplica a combustible líquido)
  const resultSinRefri = calcularCostoVehiculo(vehiculoGNC, kms, viajesMes, duracion, { tipo: 'general' });
  const resultConRefri = calcularCostoVehiculo(vehiculoGNC, kms, viajesMes, duracion, { tipo: 'refrigerada' });

  assertNotNaN('GNC totalFinal', resultSinRefri.totalFinal);
  // GNC + refrigerada NO debería cambiar el costo de combustible
  assert('GNC ignora refrigerada para combustible', resultSinRefri.detalle.combustible, resultConRefri.detalle.combustible, 0);
}

// =========================================================
// T6: Vehículo >10 años + carga peligrosa
// =========================================================
console.log('\n📋 T6: Vehículo >10 años, carga peligrosa');
{
  const vehiculoViejo = { ...vehiculoBase, año: 2010 };
  const kms = 200;
  const duracion = 150;
  const viajesMes = 10;

  const result = calcularCostoVehiculo(vehiculoViejo, kms, viajesMes, duracion, { tipo: 'peligrosa' });

  assertNotNaN('Vehículo totalFinal', result.totalFinal);
  // Antigüedad > 10 años → depreciación = 0
  assert('Sin depreciación (>10 años)', result.detalle.depreciacion, 0, 0);

  // El costo adicional peligrosa se calcula en calcularResumenCostos, no en el servicio del vehículo
  const resumen = calcularResumenCostos({
    vehiculoDatos: vehiculoViejo,
    recursoDatos: recursoBase,
    kmsPorViaje: kms,
    duracionMin: duracion,
    frecuencia: { tipo: 'esporadico', vueltasTotales: viajesMes },
    configuracion: {},
    detallesCarga: { tipo: 'peligrosa' }
  });
  const esperadoPeligrosa = kms * viajesMes * 250;
  assert('Costo adicional peligrosa', resumen.resumenCostos.costoAdicionalPeligrosa, esperadoPeligrosa);
}

// =========================================================
// T7: Consistencia calcular vs crear (misma función compartida)
// =========================================================
console.log('\n📋 T7: Consistencia — mismos inputs = mismos outputs');
{
  const kms = 150;
  const duracion = 100;
  const frecuencia = { tipo: 'mensual', diasSeleccionados: ['lunes', 'martes', 'miercoles'], viajesPorDia: 2 };
  const configuracion = { costoPeajes: 500, costoAdministrativo: 10, otrosCostos: 5000, porcentajeGanancia: 15 };

  const result1 = calcularResumenCostos({
    vehiculoDatos: vehiculoBase, recursoDatos: recursoBase,
    kmsPorViaje: kms, duracionMin: duracion,
    frecuencia, configuracion, detallesCarga: { tipo: 'general' }
  });

  const result2 = calcularResumenCostos({
    vehiculoDatos: vehiculoBase, recursoDatos: recursoBase,
    kmsPorViaje: kms, duracionMin: duracion,
    frecuencia, configuracion, detallesCarga: { tipo: 'general' }
  });

  assert('totalFinal idéntico', result1.resumenCostos.totalFinal, result2.resumenCostos.totalFinal, 0);
  assert('totalVehiculo idéntico', result1.resumenCostos.totalVehiculo, result2.resumenCostos.totalVehiculo, 0);
  assert('totalRecurso idéntico', result1.resumenCostos.totalRecurso, result2.resumenCostos.totalRecurso, 0);
  assert('ganancia idéntica', result1.resumenCostos.ganancia, result2.resumenCostos.ganancia, 0);
}

// =========================================================
// T8: Edge cases — valores mínimos
// =========================================================
console.log('\n📋 T8: Edge cases — 1 km, 1 viaje, valores mínimos');
{
  const kms = 1;
  const duracion = 10;
  const viajesMes = 1;

  const resultV = calcularCostoVehiculo(vehiculoBase, kms, viajesMes, duracion, { tipo: 'general' });
  const resultR = calcularCostoTotalRecurso(recursoBase, kms, duracion, { tipo: 'esporadico', vueltasTotales: 1 });

  assertNotNaN('Edge: Vehículo totalFinal', resultV.totalFinal);
  assertNotNaN('Edge: RRHH totalFinal', resultR.totalFinal);
  assert('Edge: Vehículo total >= 0', resultV.totalFinal >= 0 ? 1 : 0, 1, 0);
  assert('Edge: RRHH total >= 0', resultR.totalFinal >= 0 ? 1 : 0, 1, 0);
  assertNotNaN('Edge: proporcionUso', resultV.proporcionUso);

  // Resumen con valores mínimos
  const resumen = calcularResumenCostos({
    vehiculoDatos: vehiculoBase, recursoDatos: recursoBase,
    kmsPorViaje: kms, duracionMin: duracion,
    frecuencia: { tipo: 'esporadico', vueltasTotales: 1 },
    configuracion: {}, detallesCarga: { tipo: 'general' }
  });
  assertNotNaN('Edge: resumen totalFinal', resumen.resumenCostos.totalFinal);
}

// =========================================================
// Resumen
// =========================================================
console.log(`\n${'='.repeat(50)}`);
console.log(`  RESULTADOS: ${passed} pasaron ✅, ${failed} fallaron ❌`);
console.log(`${'='.repeat(50)}`);

process.exit(failed > 0 ? 1 : 0);
