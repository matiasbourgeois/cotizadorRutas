// ruta: cotizadorRutas-backend/services/calculos/costoRecursoHumanoService.js
export default function calcularCostoTotalRecurso(
  recurso,
  kmsPorViaje,
  cantidadViajesMensuales
) {
  const viajesMensualesEstándar = 22;
  const usoCompleto = cantidadViajesMensuales >= viajesMensualesEstándar;
  const proporcionUso = usoCompleto
    ? 1
    : Number((cantidadViajesMensuales / viajesMensualesEstándar).toFixed(4));

  const kmTotales = kmsPorViaje * cantidadViajesMensuales;
  const tramos1000km = recurso.kmPorUnidadDeCarga
    ? Math.floor(kmTotales / recurso.kmPorUnidadDeCarga)
    : 0;

  const tipo = recurso.tipoContratacion;

  let sueldoProporcional = null;
  let adicionalActividad = null;
  let adicionalKm = recurso.adicionalKmRemunerativo * Math.max(kmTotales, recurso.minKmRemunerativo || 0);
  let viaticoKm = recurso.viaticoPorKmNoRemunerativo * Math.max(kmTotales, recurso.minKmNoRemunerativo || 0);
  let adicionalFijo = recurso.adicionalNoRemunerativoFijo * proporcionUso;
  let adicionalPorKmLote = tramos1000km * recurso.adicionalCargaDescargaCadaXkm;

  if (tipo === "empleado" || tipo === "contratado") {
    sueldoProporcional = recurso.sueldoBasico * proporcionUso;
    adicionalActividad = sueldoProporcional * (recurso.adicionalActividadPorc / 100);
  }

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
    cargasSociales = subtotalBruto * (recurso.porcentajeCargasSociales / 100);
    porcentajeCargasAplicado = recurso.porcentajeCargasSociales;
  } else if (tipo === "contratado") {
    cargasSociales = subtotalBruto * (recurso.porcentajeOverheadContratado / 100);
    porcentajeCargasAplicado = recurso.porcentajeOverheadContratado;
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