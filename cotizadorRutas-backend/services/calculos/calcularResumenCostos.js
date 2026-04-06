
import calcularCostoVehiculo from './costoVehiculoService.js';
import calcularCostoTotalRecurso from './costoRecursoHumanoService.js';
import { DEFAULTS_CALCULOS } from '../../models/ConfiguracionDefaults.js';

/**
 * Función pura que calcula el resumen completo de costos.
 * Usada tanto por calcularPresupuesto (preview) como crearPresupuesto (guardado).
 */
export default function calcularResumenCostos({
  vehiculoDatos,
  recursoDatos,
  kmsPorViaje,
  duracionMin,
  frecuencia,
  configuracion,
  detallesCarga,
  feriadosPorMes = 0,
  constantesCalculo = null
}) {
  // Merge con defaults si no vienen constantes
  const C = { ...DEFAULTS_CALCULOS, ...constantesCalculo };

  // 1. Calcular viajes mensuales
  let cantidadViajesMensuales = 0;
  if (frecuencia?.tipo === 'mensual') {
    const diasBase = (frecuencia.diasSeleccionados?.length || 0) * C.semanasPorMes;
    const diasEfectivos = Math.max(diasBase - feriadosPorMes, 0);
    cantidadViajesMensuales = diasEfectivos * (frecuencia.viajesPorDia || 1);
  } else if (frecuencia?.tipo === 'esporadico') {
    cantidadViajesMensuales = frecuencia.vueltasTotales || 1;
  }

  // 2. Calcular costos de vehículo y recurso humano
  const calculoVehiculo = vehiculoDatos
    ? calcularCostoVehiculo(vehiculoDatos, kmsPorViaje, cantidadViajesMensuales, duracionMin, detallesCarga, C)
    : { totalFinal: 0, detalle: {} };

  const calculoRecurso = recursoDatos
    ? calcularCostoTotalRecurso(recursoDatos, kmsPorViaje, duracionMin, frecuencia, C)
    : { totalFinal: 0, detalle: {} };

  // 3. Calcular resumen consolidado
  const totalVehiculo = calculoVehiculo.totalFinal;
  const totalRecurso = calculoRecurso.totalFinal;
  const totalPeajes = Number(configuracion?.costoPeajes ?? 0) * cantidadViajesMensuales;
  const otrosCostos = Number(configuracion?.otrosCostos ?? 0);

  const subtotalOperativoParcial = totalVehiculo + totalRecurso;
  const porcentajeAdmin = Number(configuracion?.costoAdministrativo ?? 0);
  const totalAdministrativo = Math.round((subtotalOperativoParcial * porcentajeAdmin) / 100);

  let costoAdicionalPeligrosa = 0;
  if (detallesCarga?.tipo === 'peligrosa') {
    const kmsTotalesMensuales = kmsPorViaje * cantidadViajesMensuales;
    costoAdicionalPeligrosa = kmsTotalesMensuales * C.costoAdicionalKmPeligrosa;
  }

  const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos + costoAdicionalPeligrosa;

  const porcentajeGanancia = Number(configuracion?.porcentajeGanancia ?? 0);
  const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
  const totalFinal = totalOperativo + ganancia;

  // 4. Calcular IVA
  const porcentajeIVA = C.porcentajeIVA ?? 21;
  const montoIVA = Math.round(totalFinal * porcentajeIVA / 100);
  const totalConIVA = totalFinal + montoIVA;

  const resumenCostos = {
    totalVehiculo,
    totalRecurso,
    totalPeajes,
    totalAdministrativo,
    otrosCostos,
    costoAdicionalPeligrosa: Math.round(costoAdicionalPeligrosa),
    totalOperativo: Math.round(totalOperativo),
    ganancia,
    totalFinal,
    porcentajeIVA,
    montoIVA,
    totalConIVA,
    cantidadViajesMensuales,
  };

  return { resumenCostos, calculoVehiculo, calculoRecurso };
}
