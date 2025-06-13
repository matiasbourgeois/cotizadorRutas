import PresupuestoRuta from '../models/PresupuestoRuta.js';

// Obtener todos los presupuestos
export const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await PresupuestoRuta.find().sort({ fecha_creacion: -1 });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

// Obtener presupuesto por ID
export const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await PresupuestoRuta.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el presupuesto' });
  }
};

// Crear nuevo presupuesto
export const crearPresupuesto = async (req, res) => {
  try {
    const nuevo = new PresupuestoRuta(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error });
  }
};

// Actualizar presupuesto
export const actualizarPresupuesto = async (req, res) => {
  try {
    const actualizado = await PresupuestoRuta.findByIdAndUpdate(
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

// Eliminar presupuesto
export const eliminarPresupuesto = async (req, res) => {
  try {
    const eliminado = await PresupuestoRuta.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};
