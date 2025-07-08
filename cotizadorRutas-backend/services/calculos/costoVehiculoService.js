// ruta: cotizadorRutas-backend/services/calculos/costoVehiculoService.js
export default function calcularCostoVehiculo(
  vehiculo,
  kmsPorViaje,
  cantidadViajesMensuales,
  // Los siguientes dos parámetros son nuevos y clave para la lógica de tiempo
  duracionMin,
  detallesCarga
) {
  // =================================================================
  // == Etapa 1: Preparación y Cálculos Iniciales
  // =================================================================

  const TIEMPO_CARGA_DESCARGA = 30;
  const UMBRAL_JORNADA_COMPLETA = 180;
  const JORNADA_COMPLETA_MINUTOS = 480; // 8 horas

  // Calculamos el tiempo real de ocupación del vehículo.
  const tiempoTotalMisionVehiculo = duracionMin + TIEMPO_CARGA_DESCARGA;
  const kmsMensuales = kmsPorViaje * cantidadViajesMensuales;

  // =================================================================
  // == Etapa 2: Costos Variables (Sin cambios)
  // =================================================================
  // Esta sección no se modifica. Los costos que dependen de los KM se
  // siguen calculando de la misma manera precisa que antes.

  // 2.1 Depreciación del vehículo
  const anioActual = new Date().getFullYear();
  const anioFabricacion = vehiculo.año || anioActual;
  const antiguedad = anioActual - anioFabricacion;
  const incluirDepreciacion = antiguedad <= 10;
  const valorResidual = (vehiculo.precioVehiculoNuevo || 0) * ((vehiculo.valorResidualPorcentaje || 0) / 100);
  const valorADepreciar = (vehiculo.precioVehiculoNuevo || 0) - valorResidual;
  const depreciacion = (incluirDepreciacion && valorADepreciar > 0 && vehiculo.kmsVidaUtilVehiculo > 0 && kmsMensuales > 0)
    ? (valorADepreciar / (vehiculo.kmsVidaUtilVehiculo / kmsMensuales))
    : 0;

  // 2.2 Costo de cubiertas
  const totalCubiertas = vehiculo.precioCubierta * vehiculo.cantidadCubiertas;
  const cubiertas = vehiculo.kmsVidaUtilCubiertas > 0 && kmsMensuales > 0
    ? (totalCubiertas / (vehiculo.kmsVidaUtilCubiertas / kmsMensuales))
    : 0;

  // 2.3 Costo de aceite
  const aceite = vehiculo.kmsCambioAceite > 0 && kmsMensuales > 0
    ? (vehiculo.precioCambioAceite / (vehiculo.kmsCambioAceite / kmsMensuales))
    : 0;

  // 2.4 Costo de combustible (considerando carga refrigerada)
  let precioLitroCombustibleEfectivo = vehiculo.precioLitroCombustible;
  if (detallesCarga?.tipo === 'refrigerada') {
    precioLitroCombustibleEfectivo *= 1.25;
  }
  const kmsPorLitro = vehiculo.rendimientoKmLitro || 1;
  const combustiblePorKm = vehiculo.usaGNC
    ? vehiculo.precioGNC / kmsPorLitro
    : precioLitroCombustibleEfectivo / kmsPorLitro;
  const combustible = combustiblePorKm * kmsMensuales;

  // =================================================================
  // == Etapa 3: Costos Fijos Prorrateados (NUEVA LÓGICA)
  // =================================================================
  // Esta es la sección mejorada. Asigna los costos fijos según el
  // tiempo de ocupación del vehículo en lugar de la cantidad de viajes.

  const costosFijosMensualesTotales =
    (vehiculo.costoMantenimientoPreventivoMensual || 0) +
    (vehiculo.costoSeguroMensual || 0) +
    (vehiculo.costoPatenteMunicipal || 0) +
    (vehiculo.costoPatenteProvincial || 0);
  
  const costoFijoDiario = costosFijosMensualesTotales / 22;
  let proporcionUsoDiario = 0;

  if (tiempoTotalMisionVehiculo < UMBRAL_JORNADA_COMPLETA) {
    // Para VIAJES CORTOS, se asigna una fracción del costo fijo diario.
    proporcionUsoDiario = tiempoTotalMisionVehiculo / JORNADA_COMPLETA_MINUTOS;
  } else {
    // Para VIAJES LARGOS, se asigna el 100% del costo fijo diario.
    proporcionUsoDiario = 1;
  }

  const costoFijoPorViaje = costoFijoDiario * proporcionUsoDiario;
  const costosFijosProrrateados = costoFijoPorViaje * cantidadViajesMensuales;

  // =================================================================
  // == Etapa 4: Total Final
  // =================================================================

  const totalFinal =
    depreciacion +
    cubiertas +
    aceite +
    combustible +
    costosFijosProrrateados;

  return {
    proporcionUso: proporcionUsoDiario.toFixed(3), // Ahora refleja la proporción diaria
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