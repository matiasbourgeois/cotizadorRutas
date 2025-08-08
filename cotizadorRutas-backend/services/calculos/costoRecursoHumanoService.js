// ruta: cotizadorRutas-backend/services/calculos/costoRecursoHumanoService.js

export default function calcularCostoTotalRecurso(
  recurso,
  kmsPorViaje,
  duracionMin,
  frecuencia
) {
  // =================================================================
  // == Etapa 1: Preparación y Cálculos Iniciales
  // =================================================================
  // Aquí definimos todas las constantes y variables base que usaremos.

  const TIEMPO_CARGA_DESCARGA = 30;
  const UMBRAL_JORNADA_COMPLETA = 180;
  const JORNADA_COMPLETA_MINUTOS = 480; // 8 horas

  // Se calcula un "Sueldo Ajustado" que ya incluye el Adicional por Actividad.
  // Este es el verdadero sueldo base para nuestros cálculos de tiempo.
  const sueldoAjustado = recurso.sueldoBasico * (1 + (recurso.adicionalActividadPorc || 0) / 100);

  const valorHora = sueldoAjustado / (recurso.horasLaboralesMensuales || 192);
  const valorJornada = sueldoAjustado / 22;

  // Se calcula el tiempo total de una misión y la frecuencia del servicio.
  const tiempoTotalMision = duracionMin + TIEMPO_CARGA_DESCARGA;
  const viajesPorDia = frecuencia.viajesPorDia || 1;
  const tiempoDiarioTotal = tiempoTotalMision * viajesPorDia;
  const esServicioMensual = frecuencia.tipo === 'mensual';
  const cantidadViajesAlMes = esServicioMensual
    ? (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.12
    : (frecuencia.vueltasTotales || 1);
  const kmRealesTotales = kmsPorViaje * cantidadViajesAlMes;

  let costoBaseRemunerativo = 0;
  let adicionalFijoNoRemunerativo = 0;
  let kilometrosMinimos = 0;
  let detalle = {};

  // =================================================================
  // == Etapa 2: Cálculo del Costo Base (Componente por Tiempo)
  // =================================================================
  // El "cerebro" del sistema: decide si es un viaje corto o largo.

  if (tiempoDiarioTotal < UMBRAL_JORNADA_COMPLETA) {
    // --- Lógica para VIAJE CORTO (< 3 horas) ---
    detalle.tipoDeCalculo = 'Servicio Corto (Por Hora)';
    kilometrosMinimos = 150;

    const tiempoAFacturar = Math.max(tiempoTotalMision, recurso.minimoMinutosFacturables || 120);
    const costoViajeIndividual = valorHora * (tiempoAFacturar / 60);

    // El Adicional Fijo se prorratea según el tiempo facturado.
    const valorDiarioAdicional = (recurso.adicionalNoRemunerativoFijo || 0) / 22;
    const adicionalProrrateadoPorViaje = valorDiarioAdicional * (tiempoAFacturar / JORNADA_COMPLETA_MINUTOS);

    costoBaseRemunerativo = esServicioMensual ? costoViajeIndividual * cantidadViajesAlMes : costoViajeIndividual;
    adicionalFijoNoRemunerativo = esServicioMensual ? adicionalProrrateadoPorViaje * cantidadViajesAlMes : adicionalProrrateadoPorViaje;

} else {
    // --- LÓGICA CORREGIDA PARA VIAJE LARGO (>= 3 horas) ---
    detalle.tipoDeCalculo = 'Servicio Dedicado (Por Jornada)';
    kilometrosMinimos = 350;

    // Calculamos el número real de días de trabajo en el mes.
    const diasDeTrabajoAlMes = esServicioMensual
      ? (frecuencia.diasSeleccionados?.length || 0) * 4.33
      : (frecuencia.vueltasTotales || 1); // Para esporádico, cada vuelta es un "día".

    // Calculamos las horas extra totales del mes.
    const minutosExtraPorDia = Math.max(0, tiempoDiarioTotal - JORNADA_COMPLETA_MINUTOS);
    const costoExtraTotalMes = (minutosExtraPorDia / 60) * valorHora * diasDeTrabajoAlMes;

    // El costo base es el valor de la jornada por los días trabajados, más las horas extra.
    costoBaseRemunerativo = (valorJornada * diasDeTrabajoAlMes) + costoExtraTotalMes;

    // El adicional fijo se calcula sobre los días trabajados.
    const adicionalDiario = (recurso.adicionalNoRemunerativoFijo || 0) / 22;
    adicionalFijoNoRemunerativo = adicionalDiario * diasDeTrabajoAlMes;
  }

  // =================================================================
  // == Etapa 3: Cálculo de Costos Variables (Componente por Distancia)
  // =================================================================

  const kmParaPagar = Math.max(kmRealesTotales, kilometrosMinimos * (esServicioMensual ? 1 : cantidadViajesAlMes));

  const adicionalKm = (recurso.adicionalKmRemunerativo || 0) * kmParaPagar;
  const viaticoKm = (recurso.viaticoPorKmNoRemunerativo || 0) * kmParaPagar;

  const tramosDeCarga = recurso.kmPorUnidadDeCarga ? Math.round(kmRealesTotales / recurso.kmPorUnidadDeCarga) : 0;
  const adicionalPorCargaDescarga = tramosDeCarga * (recurso.adicionalCargaDescargaCadaXkm || 0);

  // =================================================================
  // == Etapa 4: Consolidación y Total Final (con diferenciación)
  // =================================================================

  const baseRemunerativa = costoBaseRemunerativo + adicionalKm + adicionalPorCargaDescarga;
  let costoIndirecto = 0;

  // Se diferencia el costo indirecto si es empleado o contratado.
  if (recurso.tipoContratacion === 'empleado') {
    costoIndirecto = baseRemunerativa * ((recurso.porcentajeCargasSociales || 0) / 100);
    detalle.costoIndirectoLabel = `Cargas Sociales (${recurso.porcentajeCargasSociales}%)`;
  } else { // 'contratado'
    const subtotalBruto = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm;
    costoIndirecto = subtotalBruto * ((recurso.porcentajeOverheadContratado || 0) / 100);
    detalle.costoIndirectoLabel = `Overhead Contratado (${recurso.porcentajeOverheadContratado}%)`;
  }

  const totalFinal = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm + costoIndirecto;

  detalle = {
    ...detalle,
    kmRealesTotales: Math.round(kmRealesTotales),
    kmParaPagar: Math.round(kmParaPagar),
    costoBaseRemunerativo: Math.round(costoBaseRemunerativo),
    adicionalFijoNoRemunerativo: Math.round(adicionalFijoNoRemunerativo),
    adicionalKm: Math.round(adicionalKm),
    viaticoKm: Math.round(viaticoKm),
    adicionalPorCargaDescarga: Math.round(adicionalPorCargaDescarga),
    costoIndirecto: Math.round(costoIndirecto),
  };

  return {
    totalFinal: Math.round(totalFinal),
    detalle,
  };
}