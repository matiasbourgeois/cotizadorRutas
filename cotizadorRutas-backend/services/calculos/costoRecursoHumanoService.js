// ruta: cotizadorRutas-backend/services/calculos/costoRecursoHumanoService.js
export default function calcularCostoTotalRecurso(
  recurso,
  kmsPorViaje,
  cantidadViajesMensuales,
  esViajeRegular
) {
  const viajesMensualesEstándar = 22;
  const usoCompleto = cantidadViajesMensuales >= viajesMensualesEstándar;
  const proporcionUso = usoCompleto
    ? 1
    : Number((cantidadViajesMensuales / viajesMensualesEstándar).toFixed(4));

  const kmTotales = kmsPorViaje * cantidadViajesMensuales;

  let kmParaAdicional = kmTotales;
  let kmParaViatico = kmTotales;

  // Aplicamos la regla del mínimo de KM solo si es un viaje regular/mensual
  if (esViajeRegular) {
    kmParaAdicional = Math.max(kmTotales, recurso.minKmRemunerativo || 0);
    kmParaViatico = Math.max(kmTotales, recurso.minKmNoRemunerativo || 0);
  }
  // Para viajes esporádicos, se usarán los kmTotales reales.

  const tramos1000km = recurso.kmPorUnidadDeCarga
    ? Math.floor(kmTotales / recurso.kmPorUnidadDeCarga)
    : 0;

  const tipo = recurso.tipoContratacion;

  let sueldoProporcional = (recurso.sueldoBasico || 0) * proporcionUso;
  let adicionalActividad = ((recurso.sueldoBasico || 0) * ((recurso.adicionalActividadPorc || 0) / 100)) * proporcionUso;
  
  // ✅ LÍNEAS CORREGIDAS: Usan las variables de km correctas y no la lógica antigua.
  let adicionalKm = (recurso.adicionalKmRemunerativo || 0) * kmParaAdicional;
  let viaticoKm = (recurso.viaticoPorKmNoRemunerativo || 0) * kmParaViatico;
  
  let adicionalFijo = (recurso.adicionalNoRemunerativoFijo || 0) * proporcionUso;
  let adicionalPorKmLote = tramos1000km * (recurso.adicionalCargaDescargaCadaXkm || 0);

  const subtotalBruto =
    sueldoProporcional +
    adicionalActividad +
    adicionalFijo +
    adicionalKm +
    viaticoKm +
    adicionalPorKmLote;

  let cargasSociales = 0;
  let porcentajeCargasAplicado = 0;

  if (tipo === "empleado") {
    // Base remunerativa para el cálculo de cargas sociales
    const baseRemunerativa = sueldoProporcional + adicionalActividad + adicionalKm + adicionalPorKmLote;
    cargasSociales = baseRemunerativa * ((recurso.porcentajeCargasSociales || 0) / 100);
    porcentajeCargasAplicado = recurso.porcentajeCargasSociales || 0;
  } else if (tipo === "contratado") {
    cargasSociales = subtotalBruto * ((recurso.porcentajeOverheadContratado || 0) / 100);
    porcentajeCargasAplicado = recurso.porcentajeOverheadContratado || 0;
  }

  const totalFinal = subtotalBruto + cargasSociales;

  return {
    usoCompleto,
    proporcionUso,
    kmTotales,
    tramos1000km,
    detalle: {
      sueldoProporcional: Math.round(sueldoProporcional),
      adicionalActividad: Math.round(adicionalActividad),
      adicionalFijo: Math.round(adicionalFijo),
      adicionalKm: Math.round(adicionalKm),
      viaticoKm: Math.round(viaticoKm),
      adicionalPorKmLote: Math.round(adicionalPorKmLote),
      subtotalBruto: Math.round(subtotalBruto),
      cargasSociales: Math.round(cargasSociales),
      porcentajeCargasAplicado,
    },
    totalFinal: Math.round(totalFinal),
  };
}