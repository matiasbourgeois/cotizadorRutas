import FrecuenciaRuta from "../models/FrecuenciaRuta.js";

// Crear nueva frecuencia
export const crearFrecuenciaRuta = async (req, res) => {
  try {
    const data = req.body;

    // Determinar modo de asignación automáticamente
    if (data.tipo === "mensual") {
      const cantidadDias = data.diasSeleccionados?.length || 0;
      data.modoAsignacion = cantidadDias >= 3 ? "completo" : "prorrateado";
    }

    data.usuario = req.usuario._id;
    const nuevaFrecuencia = new FrecuenciaRuta(data);
    await nuevaFrecuencia.save();
    res.status(201).json(nuevaFrecuencia);
  } catch (error) {
    console.error("Error al crear frecuencia:", error);
    res.status(500).json({ error: "Error al crear frecuencia", detalle: error.message });
  }
};

// Obtener todas las frecuencias
export const obtenerFrecuenciasRuta = async (req, res) => {
  try {
    const frecuencias = await FrecuenciaRuta.find({ usuario: req.usuario._id }).sort({ creadoEn: -1 });
    res.json(frecuencias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener frecuencias", detalle: error.message });
  }
};

// Obtener frecuencia por ID
export const obtenerFrecuenciaRutaPorId = async (req, res) => {
  try {
    const frecuencia = await FrecuenciaRuta.findOne({ _id: req.params.id, usuario: req.usuario._id });
    if (!frecuencia) return res.status(404).json({ error: "Frecuencia no encontrada" });
    res.json(frecuencia);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar frecuencia", detalle: error.message });
  }
};

// Eliminar frecuencia por ID
export const eliminarFrecuenciaRuta = async (req, res) => {
  try {
    const frecuencia = await FrecuenciaRuta.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
    if (!frecuencia) return res.status(404).json({ error: "Frecuencia no encontrada" });
    res.json({ mensaje: "Frecuencia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar frecuencia", detalle: error.message });
  }
};
