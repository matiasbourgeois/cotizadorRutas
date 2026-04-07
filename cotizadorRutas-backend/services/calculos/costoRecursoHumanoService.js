
export default function calcularCostoTotalRecurso(
  recurso,
  kmsPorViaje,
  duracionMin,
  frecuencia,
  C = {}
) {
  // Bifurcar por tipo de contratación
  if (recurso.tipoContratacion === 'contratado') {
    return calcularCostoContratado(recurso, kmsPorViaje, duracionMin, frecuencia, C);
  }
  return calcularCostoEmpleado(recurso, kmsPorViaje, duracionMin, frecuencia, C);
}


// ═════════════════════════════════════════════════════════════════════
// EMPLEADO — Lógica CCT 40/89 (Escala Marzo 2026)
// 3 niveles: Mínimo/Proporcional → Jornada Completa → Sueldo Mensual
// ═════════════════════════════════════════════════════════════════════

function calcularCostoEmpleado(recurso, kmsPorViaje, duracionMin, frecuencia, C) {
  // ═══ Constantes ═══
  const TIEMPO_CARGA_DESCARGA    = C.tiempoCargaDescargaMin     || 30;
  const JORNADA_COMPLETA_MINUTOS = C.jornadaCompletaMinutos     || 480;
  const UMBRAL_JORNADA           = C.umbralJornadaCompletaMin   || 180;
  const DIVISOR_JORNAL           = C.divisorJornalCCT           || 24;
  const SEMANAS_MES              = C.semanasPorMes              || 4.33;
  const MINIMO_MINUTOS           = recurso.minimoMinutosFacturables || 120;

  const sueldoAjustado = recurso.sueldoBasico * (1 + (recurso.adicionalActividadPorc || 0) / 100);
  const jornalCCT      = sueldoAjustado / DIVISOR_JORNAL;
  const costoPorMinuto = jornalCCT / JORNADA_COMPLETA_MINUTOS;

  const tiempoTotalMision = duracionMin + TIEMPO_CARGA_DESCARGA;
  const esServicioMensual = frecuencia.tipo === 'mensual';
  const diasPorSemana     = frecuencia.diasSeleccionados?.length || 0;
  const esSueldoCompleto  = esServicioMensual && diasPorSemana >= 4;

  // ═══ Cantidad de viajes ═══
  const cantidadViajesAlMes = esServicioMensual
    ? diasPorSemana * (frecuencia.viajesPorDia || 1) * SEMANAS_MES
    : (frecuencia.vueltasTotales || 1);

  const kmRealesTotales = kmsPorViaje * cantidadViajesAlMes;

  // ═══════════════════════════════════════════════════════════════
  // NIVEL 2: SUELDO MENSUAL COMPLETO (mensual ≥4 días/semana)
  // ═══════════════════════════════════════════════════════════════
  let costoBaseRemunerativo;
  let adicionalFijoNoRemunerativo;
  let tipoDeCalculo;
  let hsFacturadas;
  let hsExtra = 0;
  let costoHorasExtra = 0;

  if (esSueldoCompleto) {
    // Base = sueldo mensual completo (el chofer está dedicado)
    costoBaseRemunerativo = sueldoAjustado;
    adicionalFijoNoRemunerativo = recurso.adicionalNoRemunerativoFijo || 0;

    // Horas extra: si un viaje individual supera 8h, se suman al mensual
    const tiempoExtraMin = Math.max(0, tiempoTotalMision - JORNADA_COMPLETA_MINUTOS);
    if (tiempoExtraMin > 0) {
      hsExtra = tiempoExtraMin / 60;
      costoHorasExtra = tiempoExtraMin * costoPorMinuto * 1.5 * cantidadViajesAlMes;
      costoBaseRemunerativo += costoHorasExtra;
      tipoDeCalculo = `Sueldo Mensual + ${hsExtra.toFixed(2)}h Extra/viaje (×1.5)`;
    } else {
      tipoDeCalculo = 'Sueldo Mensual Completo';
    }

    hsFacturadas = JORNADA_COMPLETA_MINUTOS / 60; // 8h referencial

  // ═══════════════════════════════════════════════════════════════
  // NIVEL 1: JORNAL CCT (esporádico o mensual <4 días/semana)
  // ═══════════════════════════════════════════════════════════════
  } else {
    const tiempoAFacturar = Math.max(tiempoTotalMision, MINIMO_MINUTOS);
    hsFacturadas = tiempoAFacturar / 60;

    let costoViajeIndividual;

    if (tiempoAFacturar > JORNADA_COMPLETA_MINUTOS) {
      // NIVEL 3: Horas extra
      const tiempoExtraMin = tiempoAFacturar - JORNADA_COMPLETA_MINUTOS;
      hsExtra = tiempoExtraMin / 60;
      costoViajeIndividual = jornalCCT + (tiempoExtraMin * costoPorMinuto * 1.5);
      tipoDeCalculo = `Jornada Completa + ${hsExtra.toFixed(2)}h Extra (×1.5)`;

    } else if (tiempoAFacturar >= UMBRAL_JORNADA) {
      // Misión ≥ 3h → JORNADA COMPLETA
      costoViajeIndividual = jornalCCT;
      tipoDeCalculo = 'Jornada Completa';

    } else if (tiempoTotalMision <= MINIMO_MINUTOS) {
      // Misión corta → mínimo 2h
      costoViajeIndividual = MINIMO_MINUTOS * costoPorMinuto;
      tipoDeCalculo = `Mínimo Facturable (${(MINIMO_MINUTOS / 60).toFixed(0)}h)`;

    } else {
      // Proporcional (entre 2h y 3h)
      costoViajeIndividual = tiempoAFacturar * costoPorMinuto;
      tipoDeCalculo = `Proporcional ${hsFacturadas.toFixed(2)}h`;
    }

    const adicionalProrrateadoPorViaje =
      (recurso.adicionalNoRemunerativoFijo || 0) * (Math.min(tiempoAFacturar, JORNADA_COMPLETA_MINUTOS) / JORNADA_COMPLETA_MINUTOS);

    costoBaseRemunerativo       = costoViajeIndividual         * cantidadViajesAlMes;
    adicionalFijoNoRemunerativo = adicionalProrrateadoPorViaje * cantidadViajesAlMes;
  }

  // ═══ Costos por km (igual para todos los niveles) ═══
  const kilometrosMinimos = kmsPorViaje < 200 ? 150 : 350;
  const kmParaPagar = Math.max(
    kmRealesTotales,
    kilometrosMinimos * (esServicioMensual ? 1 : cantidadViajesAlMes)
  );

  const adicionalKm               = (recurso.adicionalKmRemunerativo    || 0) * kmParaPagar;
  const viaticoKm                 = (recurso.viaticoPorKmNoRemunerativo || 0) * kmParaPagar;
  const tramosDeCarga             = recurso.kmPorUnidadDeCarga
    ? Math.round(kmRealesTotales / recurso.kmPorUnidadDeCarga) : 0;
  const adicionalPorCargaDescarga = tramosDeCarga * (recurso.adicionalCargaDescargaCadaXkm || 0);

  // ═══ Consolidación ═══
  const baseRemunerativa = costoBaseRemunerativo + adicionalKm + adicionalPorCargaDescarga;
  const costoIndirecto   = baseRemunerativa * ((recurso.porcentajeCargasSociales || 0) / 100);
  const totalFinal       = baseRemunerativa + adicionalFijoNoRemunerativo + viaticoKm + costoIndirecto;

  // ═══ Detalle para front ═══
  const detalle = {
    tipoDeCalculo,
    horasFacturadasPorViaje: +hsFacturadas.toFixed(2),
    ...(hsExtra > 0 && {
      horasExtraPorViaje: +hsExtra.toFixed(2),
      costoHorasExtra: Math.round(costoHorasExtra),
    }),
    kmRealesTotales:             Math.round(kmRealesTotales),
    kmParaPagar:                 Math.round(kmParaPagar),
    // Campos individuales (compatibilidad con PDF desglose)
    costoBaseRemunerativo:       Math.round(costoBaseRemunerativo),
    adicionalFijoNoRemunerativo: Math.round(adicionalFijoNoRemunerativo),
    adicionalKm:                 Math.round(adicionalKm),
    viaticoKm:                   Math.round(viaticoKm),
    adicionalPorCargaDescarga:   Math.round(adicionalPorCargaDescarga),
    costoIndirecto:              Math.round(costoIndirecto),
    costoIndirectoLabel:         `Cargas Sociales (${recurso.porcentajeCargasSociales}%)`,
    // Campos fusionados (para Resumen Operativo simplificado)
    adicionalKmTotal:            Math.round(adicionalKm + viaticoKm),
    adicionalesCCT:              Math.round(adicionalFijoNoRemunerativo + adicionalPorCargaDescarga),
  };

  return { totalFinal: Math.round(totalFinal), detalle };
}


// ═════════════════════════════════════════════════════════════════════
// CONTRATADO — Factor sobre empleado CCT equivalente
// ═════════════════════════════════════════════════════════════════════
// El costo del contratado = costo del empleado equivalente × factor.
// Default 75%, basado en la diferencia de cargas entre relación de
// dependencia y monotributo (contrib. patronales, SAC, vacaciones, ART).

import { DEFAULTS_RRHH } from '../../models/ConfiguracionDefaults.js';

function calcularCostoContratado(recurso, kmsPorViaje, duracionMin, frecuencia, C) {
  // 1. Calcular como si fuera empleado (usando defaults CCT del empleado)
  const empleadoEquivalente = {
    ...DEFAULTS_RRHH.empleado,
    tipoContratacion: 'empleado',
  };

  const resultadoEmpleado = calcularCostoEmpleado(
    empleadoEquivalente, kmsPorViaje, duracionMin, frecuencia, C
  );

  // 2. Aplicar factor (default 75 si no tiene)
  const factor = (recurso.factorSobreEmpleado || 75) / 100;
  const totalContratado = Math.round(resultadoEmpleado.totalFinal * factor);

  // 3. Armar detalle compatible con el front
  return {
    totalFinal: totalContratado,
    detalle: {
      tipoDeCalculo: `Factor ${recurso.factorSobreEmpleado || 75}% sobre empleado CCT`,
      costoEmpleadoEquivalente: resultadoEmpleado.totalFinal,
      factorAplicado: factor,
      // Datos del empleado equivalente para referencia en el desglose
      horasFacturadasPorViaje: resultadoEmpleado.detalle.horasFacturadasPorViaje,
      kmRealesTotales: resultadoEmpleado.detalle.kmRealesTotales,
      kmParaPagar: resultadoEmpleado.detalle.kmParaPagar,
      // Campos de compatibilidad con el front
      costoBaseRemunerativo: Math.round(resultadoEmpleado.detalle.costoBaseRemunerativo * factor),
      adicionalFijoNoRemunerativo: Math.round(resultadoEmpleado.detalle.adicionalFijoNoRemunerativo * factor),
      adicionalKm: Math.round(resultadoEmpleado.detalle.adicionalKm * factor),
      viaticoKm: Math.round(resultadoEmpleado.detalle.viaticoKm * factor),
      adicionalPorCargaDescarga: Math.round((resultadoEmpleado.detalle.adicionalPorCargaDescarga || 0) * factor),
      costoIndirecto: Math.round(resultadoEmpleado.detalle.costoIndirecto * factor),
      costoIndirectoLabel: `Factor ${recurso.factorSobreEmpleado || 75}% sobre CCT`,
    }
  };
}