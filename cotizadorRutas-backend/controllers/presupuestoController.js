
import Presupuesto from '../models/Presupuesto.js';
import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';


export const calcularPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, frecuencia, detallesCarga } = req.body;
    const vehiculo = req.body.vehiculo || null;
    const recursoHumano = req.body.recursoHumano || null;
    const configuracion = req.body.configuracion || {};

    if (!puntosEntrega || !frecuencia) {
      return res.status(400).json({ error: 'Faltan datos de ruta o frecuencia para el cálculo.' });
    }

    const { resumenCostos, calculoVehiculo, calculoRecurso } = calcularResumenCostos({
      vehiculoDatos: vehiculo,
      recursoDatos: recursoHumano,
      kmsPorViaje: puntosEntrega?.distanciaKm || 0,
      duracionMin: puntosEntrega?.duracionMin || 0,
      frecuencia,
      configuracion,
      detallesCarga
    });

    res.status(200).json({
      resumenCostos,
      detalleVehiculo: calculoVehiculo,
      detalleRecurso: calculoRecurso
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

    const { resumenCostos, calculoVehiculo, calculoRecurso } = calcularResumenCostos({
      vehiculoDatos: vehiculo.datos,
      recursoDatos: recursoHumano.datos,
      kmsPorViaje: totalKilometros || 0,
      duracionMin: duracionMin || 0,
      frecuencia,
      configuracion,
      detallesCarga
    });

    const presupuestoParaGuardar = new Presupuesto({
      puntosEntrega,
      totalKilometros,
      duracionMin,
      frecuencia,
      vehiculo: { datos: vehiculo.datos, calculo: calculoVehiculo },
      recursoHumano: { datos: recursoHumano.datos, calculo: calculoRecurso },
      configuracion,
      detallesCarga,
      resumenCostos,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const [presupuestos, total] = await Promise.all([
      Presupuesto.find({ usuario: req.usuario._id })
        .sort({ fechaCreacion: -1 })
        .skip(skip)
        .limit(limit),
      Presupuesto.countDocuments({ usuario: req.usuario._id })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      presupuestos,
      currentPage: page,
      totalPages,
      totalItems: total
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos', detalle: error.message });
  }
};

export const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOne({ _id: req.params.id, usuario: req.usuario._id });
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
    const actualizado = await Presupuesto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
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
    const eliminado = await Presupuesto.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
    if (!eliminado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};