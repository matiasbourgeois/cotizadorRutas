// utils/armarPresupuestoFinal.js

/**
 * Arma el objeto final de presupuesto con todos los datos recopilados de los pasos.
 * Este objeto será guardado en la base de datos y también usado para generar el PDF.
 *
 * @param {Array} puntosEntrega - Lista de puntos seleccionados (con dirección, orden, etc).
 * @param {Object} frecuencia - Objeto con tipo ("regular" o "esporádico") y viajesMensuales.
 * @param {Object} vehiculo - Objeto con datos y cálculo del costo del vehículo.
 * @param {Object} recursoHumano - Objeto con datos y cálculo del recurso humano.
 * @param {Object} configuracion - Configuración final con peajes, ganancia, impuestos, etc.
 * @returns {Object} Objeto completo de presupuesto.
 */

function armarPresupuestoFinal(puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion) {
  // Calcular total operativo
  const totalVehiculo = vehiculo?.calculo?.totalFinal || 0;
  const totalRecurso = recursoHumano?.calculo?.totalFinal || 0;
  const totalPeajes = configuracion?.costoPeajes || 0;
  const totalAdministrativo = configuracion?.costoAdministrativo || 0;
  const otrosCostos = configuracion?.otrosCostos || 0;

  const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos;

  // Calcular ganancia
  const porcentajeGanancia = configuracion?.porcentajeGanancia || 0;
  const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
  const totalFinal = totalOperativo + ganancia;

  return {
    puntosEntrega,
    totalKilometros: puntosEntrega.reduce((sum, p) => sum + (p.km || 0), 0),

    frecuencia,

    vehiculo: {
      datos: vehiculo?.datos || {},
      calculo: vehiculo?.calculo || {}
    },

    recursoHumano: {
      datos: recursoHumano?.datos || {},
      calculo: recursoHumano?.calculo || {}
    },

    configuracion,

    resumenCostos: {
      totalVehiculo,
      totalRecurso,
      totalPeajes,
      totalAdministrativo,
      otrosCostos,
      totalOperativo,
      ganancia,
      totalFinal
    },

    fechaCreacion: new Date().toISOString()
  };
}

export default armarPresupuestoFinal;
