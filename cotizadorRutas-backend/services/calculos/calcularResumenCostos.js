
import calcularCostoVehiculo from './costoVehiculoService.js';
import calcularCostoTotalRecurso from './costoRecursoHumanoService.js';

const COSTO_ADICIONAL_KM_PELIGROSA = 250;
const SEMANAS_POR_MES = 4.33;

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
  detallesCarga
}) {
  // 1. Calcular viajes mensuales
  let cantidadViajesMensuales = 0;
  if (frecuencia?.tipo === 'mensual') {
    cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * SEMANAS_POR_MES;
  } else if (frecuencia?.tipo === 'esporadico') {
    cantidadViajesMensuales = frecuencia.vueltasTotales || 1;
  }

  // 2. Calcular costos de vehículo y recurso humano
  const calculoVehiculo = vehiculoDatos
    ? calcularCostoVehiculo(vehiculoDatos, kmsPorViaje, cantidadViajesMensuales, duracionMin, detallesCarga)
    : { totalFinal: 0, detalle: {} };

  const calculoRecurso = recursoDatos
    ? calcularCostoTotalRecurso(recursoDatos, kmsPorViaje, duracionMin, frecuencia)
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
    costoAdicionalPeligrosa = kmsTotalesMensuales * COSTO_ADICIONAL_KM_PELIGROSA;
  }

  const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos + costoAdicionalPeligrosa;

  const porcentajeGanancia = Number(configuracion?.porcentajeGanancia ?? 0);
  const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
  const totalFinal = totalOperativo + ganancia;

  const resumenCostos = {
    totalVehiculo,
    totalRecurso,
    totalPeajes,
    totalAdministrativo,
    otrosCostos,
    costoAdicionalPeligrosa: Math.round(costoAdicionalPeligrosa),
    totalOperativo: Math.round(totalOperativo),
    ganancia,
    totalFinal
  };

  return { resumenCostos, calculoVehiculo, calculoRecurso };
}
