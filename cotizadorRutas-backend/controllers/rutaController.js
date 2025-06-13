// controllers/rutaController.js
import Ruta from '../models/Ruta.js';

// Crear nueva ruta
export const crearRuta = async (req, res) => {
  try {
    const nuevaRuta = new Ruta(req.body);
    const guardada = await nuevaRuta.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar ruta', detalles: error });
  }
};

// Obtener todas las rutas
export const obtenerRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find().sort({ fecha_creacion: -1 });
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
};
