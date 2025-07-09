// ruta: cotizadorRutas-backend/controllers/presupuestoController.js

import Presupuesto from '../models/Presupuesto.js';
// --- CAMBIO CLAVE: Importamos el NUEVO servicio y podemos eliminar el viejo ---
import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';
import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';

const COSTO_ADICIONAL_KM_PELIGROSA = 250;


export const calcularPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, frecuencia, detallesCarga } = req.body;
    
    const vehiculo = req.body.vehiculo || null;
    const recursoHumano = req.body.recursoHumano || null;
    const configuracion = req.body.configuracion || {};

    if (!puntosEntrega || !frecuencia) {
      return res.status(400).json({ error: 'Faltan datos de ruta o frecuencia para el cálculo.' });
    }

    const kmsPorViaje = puntosEntrega?.distanciaKm || 0;
    const duracionMin = puntosEntrega?.duracionMin || 0;

    let cantidadViajesMensuales = 0;
    if (frecuencia?.tipo === "mensual") {
      cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
    } else if (frecuencia?.tipo === "esporadico") {
      cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
    }

    const costoVehiculo = vehiculo 
      ? calcularCostoVehiculo(vehiculo, kmsPorViaje, cantidadViajesMensuales, duracionMin, detallesCarga)
      : { totalFinal: 0, detalle: {} };

    const costoRecurso = recursoHumano
      ? calcularCostoTotalRecurso(recursoHumano, kmsPorViaje, duracionMin, frecuencia)
      : { totalFinal: 0, detalle: {} };

    const totalVehiculo = costoVehiculo.totalFinal;
    const totalRecurso = costoRecurso.totalFinal;
    const totalPeajes = (configuracion.costoPeajes || 0) * cantidadViajesMensuales;
    const otrosCostos = configuracion.otrosCostos || 0;

    const subtotalOperativoParcial = totalVehiculo + totalRecurso;
    const porcentajeAdmin = configuracion.costoAdministrativo || 10;
    const totalAdministrativo = Math.round((subtotalOperativoParcial * porcentajeAdmin) / 100);

    let costoAdicionalPeligrosa = 0;
    if (detallesCarga?.tipo === 'peligrosa') {
      const kmsTotalesMensuales = kmsPorViaje * cantidadViajesMensuales;
      costoAdicionalPeligrosa = kmsTotalesMensuales * COSTO_ADICIONAL_KM_PELIGROSA;
    }

    const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos + costoAdicionalPeligrosa;

    const porcentajeGanancia = configuracion.porcentajeGanancia || 15;
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

    res.status(200).json({
      resumenCostos,
      detalleVehiculo: costoVehiculo,
      detalleRecurso: costoRecurso
    });

  } catch (error) {
    console.error('Error al calcular presupuesto:', error);
    res.status(500).json({ error: 'Error interno al calcular', detalles: error.message });
  }
};

export const crearPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, totalKilometros, duracionMin, frecuencia, vehiculo, recursoHumano, configuracion, detallesCarga } = req.body;

    if (!puntosEntrega || !frecuencia || !vehiculo?.datos || !recursoHumano?.datos || !configuracion) {
      return res.status(400).json({ error: 'Faltan datos clave para crear el presupuesto.' });
    }

    const kmsPorViaje = totalKilometros || 0;
    let cantidadViajesMensuales = 0;
    if (frecuencia?.tipo === "mensual") {
      cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
    } else if (frecuencia?.tipo === "esporadico") {
      cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
    }

    const calculoVehiculo = calcularCostoVehiculo(vehiculo.datos, kmsPorViaje, cantidadViajesMensuales, duracionMin, detallesCarga);
    
    const calculoRecurso = calcularCostoTotalRecurso(recursoHumano.datos, kmsPorViaje, duracionMin, frecuencia);

    const totalVehiculo = calculoVehiculo.totalFinal;
    const totalRecurso = calculoRecurso.totalFinal;
    const totalPeajes = (configuracion.costoPeajes || 0) * cantidadViajesMensuales;
    const otrosCostos = configuracion.otrosCostos || 0;

    const subtotalOperativoParcial = totalVehiculo + totalRecurso;
    const porcentajeAdmin = configuracion.costoAdministrativo || 0;
    const totalAdministrativo = Math.round((subtotalOperativoParcial * porcentajeAdmin) / 100);

    let costoAdicionalPeligrosa = 0;
    if (detallesCarga?.tipo === 'peligrosa') {
      const kmsTotalesMensuales = kmsPorViaje * cantidadViajesMensuales;
      costoAdicionalPeligrosa = kmsTotalesMensuales * COSTO_ADICIONAL_KM_PELIGROSA;
    }

    const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos + costoAdicionalPeligrosa;
    const porcentajeGanancia = configuracion.porcentajeGanancia || 0;
    const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
    const totalFinal = totalOperativo + ganancia;

    const presupuestoParaGuardar = new Presupuesto({
      puntosEntrega: puntosEntrega,
      totalKilometros,
      duracionMin,
      frecuencia,
      vehiculo: { datos: vehiculo.datos, calculo: calculoVehiculo },
      recursoHumano: { datos: recursoHumano.datos, calculo: calculoRecurso },
      configuracion,
      detallesCarga,
      resumenCostos: {
        totalVehiculo,
        totalRecurso,
        totalPeajes,
        totalAdministrativo,
        otrosCostos,
        costoAdicionalPeligrosa: Math.round(costoAdicionalPeligrosa),
        totalOperativo: Math.round(totalOperativo),
        ganancia,
        totalFinal
      },
      cliente: configuracion.cliente,
      terminos: configuracion.terminos,
      usuario: req.usuario._id
    });

    const guardado = await presupuestoParaGuardar.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error.message });
  }
};

export const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find({ usuario: req.usuario._id }).sort({ fechaCreacion: -1 });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

export const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el presupuesto' });
  }
};

export const actualizarPresupuesto = async (req, res) => {
  try {
    const actualizado = await Presupuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar presupuesto' });
  }
};

export const eliminarPresupuesto = async (req, res) => {
  try {
    const eliminado = await Presupuesto.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};

// --- CAMBIO CLAVE: Las funciones de PDF ahora llaman al nuevo servicio ---
export const generarPdfPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).send('Presupuesto no encontrado');
    }

    // Llamamos a nuestro nuevo servicio, pidiendo el PDF de tipo 'desglose'
    const pdfBuffer = await generarPdf(presupuesto, 'desglose');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=desglose-${presupuesto._id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error en el controlador al generar PDF:", error);
    res.status(500).send("Error al generar el PDF del presupuesto.");
  }
};

export const generarPdfPropuesta = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).send('Presupuesto no encontrado');
    }

    // Llamamos a nuestro nuevo servicio, pidiendo el PDF de tipo 'propuesta'
    const pdfBuffer = await generarPdf(presupuesto, 'propuesta');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=propuesta-${presupuesto._id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error al generar PDF de propuesta:", error);
    res.status(500).send("Error al generar el PDF de la propuesta.");
  }
};