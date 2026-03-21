import Ruta from '../models/Ruta.js';

// Crear nueva ruta
export const crearRuta = async (req, res) => {
  try {
    const rutaParaGuardar = { ...req.body, usuario: req.usuario._id };
    const nuevaRuta = new Ruta(rutaParaGuardar);

    const guardada = await nuevaRuta.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error("Error al guardar ruta:", error);
    res.status(400).json({ error: 'Error al guardar ruta', detalles: error });
  }
};

// Obtener todas las rutas
export const obtenerRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find({ usuario: req.usuario._id }).sort({ fecha_creacion: -1 });
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
};