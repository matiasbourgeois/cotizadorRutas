// ruta: cotizadorRutas-backend/services/calculos/costoVehiculoService.js
/**
 * Calcula el costo mensual estimado de operar un vehículo en base a sus características,
 * los kilómetros por viaje, la cantidad de viajes al mes y si es un viaje regular o esporádico.
 *
 * @param {Object} vehiculo - Objeto con los datos del vehículo.
 * @param {number} kmsPorViaje - Kilómetros por viaje calculados en el Paso 1.
 * @param {number} cantidadViajesMensuales - Definido en el Paso 2 (Frecuencia).
 * @param {boolean} esViajeRegular - true = regular, false = esporádico (viene del Paso 2).
 * @returns {Object} Objeto con detalle del cálculo y total final.
 */
export default function calcularCostoVehiculo(vehiculo, kmsPorViaje, cantidadViajesMensuales, esViajeRegular) {
  const viajesMensualesEstándar = 22;
  const proporcionUso = esViajeRegular ? 1 : (cantidadViajesMensuales / viajesMensualesEstándar);
  const kmsMensuales = kmsPorViaje * cantidadViajesMensuales;

  // 1. Depreciación del vehículo
  const anioActual = new Date().getFullYear();
  const anioFabricacion = vehiculo.año || anioActual;
  const antiguedad = anioActual - anioFabricacion;
  const incluirDepreciacion = antiguedad <= 10;

  const depreciacion = (incluirDepreciacion && vehiculo.precioVehiculoNuevo && vehiculo.kmsVidaUtilVehiculo && kmsMensuales > 0)
    ? (vehiculo.precioVehiculoNuevo / (vehiculo.kmsVidaUtilVehiculo / kmsMensuales))
    : 0;

  // 2. Costo de cubiertas
  const totalCubiertas = vehiculo.precioCubierta * vehiculo.cantidadCubiertas;
  const cubiertas = vehiculo.kmsVidaUtilCubiertas && kmsMensuales > 0
    ? (totalCubiertas / (vehiculo.kmsVidaUtilCubiertas / kmsMensuales))
    : 0;

  // 3. Costo de aceite
  const aceite = vehiculo.kmsCambioAceite && kmsMensuales > 0
    ? (vehiculo.precioCambioAceite / (vehiculo.kmsCambioAceite / kmsMensuales))
    : 0;

  // 4. Costo de combustible
  const kmsPorLitro = vehiculo.rendimientoKmLitro || 1;
  const combustiblePorKm = vehiculo.usaGNC
    ? vehiculo.precioGNC / kmsPorLitro
    : vehiculo.precioLitroCombustible / kmsPorLitro;
  const combustible = combustiblePorKm * kmsMensuales;

  // 5. Costos fijos mensuales
  const fijosTotales =
    (vehiculo.costoMantenimientoPreventivoMensual || 0) +
    (vehiculo.costoSeguroMensual || 0) +
    (vehiculo.costoPatenteMunicipal || 0) +
    (vehiculo.costoPatenteProvincial || 0);

  const costosFijosProrrateados = fijosTotales * proporcionUso;

  // 6. Total final
  const totalFinal =
    depreciacion +
    cubiertas +
    aceite +
    combustible +
    costosFijosProrrateados;

  // Resultado detallado
  return {
    usoCompleto: esViajeRegular,
    proporcionUso: Number(proporcionUso.toFixed(3)),
    kmsMensuales,
    detalle: {
      depreciacion: Math.round(depreciacion),
      cubiertas: Math.round(cubiertas),
      aceite: Math.round(aceite),
      combustible: Math.round(combustible),
      costosFijosProrrateados: Math.round(costosFijosProrrateados)
    },
    totalFinal: Math.round(totalFinal)
  };
}