/**
 * Servicio que consulta la API de Nager.Date para obtener feriados
 * nacionales de Argentina y calcular el ajuste por feriados.
 * 
 * API: https://date.nager.at/api/v3/PublicHolidays/{año}/AR
 */

// Cache en memoria para no consultar la API en cada request
const cache = {};

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * Obtiene los feriados públicos de Argentina para un año dado.
 * Los cachea en memoria para evitar llamadas repetidas.
 */
async function obtenerFeriadosArgentina(anio) {
  if (cache[anio]) return cache[anio];

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${anio}/AR`);
    if (!response.ok) throw new Error(`API respondió con status ${response.status}`);

    const feriados = await response.json();
    cache[anio] = feriados;
    return feriados;
  } catch (error) {
    console.error('Error al consultar API de feriados:', error.message);
    return [];
  }
}

/**
 * Calcula cuántos feriados promedio por mes caen en los días de operación.
 * 
 * @param {string[]} diasSeleccionados - Array de días en español: ['lunes', 'martes', ...]
 * @returns {number} Cantidad promedio de feriados por mes que caen en días operativos
 * 
 * Ejemplo: Si operás de lunes a viernes, y hay 12 feriados en el año
 * que caen en días de semana, retorna 12/12 = ~1 feriado/mes.
 */
export async function calcularFeriadosPorMes(diasSeleccionados = []) {
  if (!diasSeleccionados || diasSeleccionados.length === 0) return 0;

  const anioActual = new Date().getFullYear();
  const feriados = await obtenerFeriadosArgentina(anioActual);

  if (feriados.length === 0) return 0;

  // Normalizar días seleccionados a lowercase
  const diasNormalizados = diasSeleccionados.map(d => d.toLowerCase().trim());

  // Contar feriados que caen en días operativos
  let feriadosEnDiasOperativos = 0;
  for (const feriado of feriados) {
    const fechaFeriado = new Date(feriado.date + 'T12:00:00');
    const diaSemana = DIAS_SEMANA[fechaFeriado.getDay()];

    if (diasNormalizados.includes(diaSemana)) {
      feriadosEnDiasOperativos++;
    }
  }

  // Promedio mensual
  return Math.round((feriadosEnDiasOperativos / 12) * 100) / 100;
}
