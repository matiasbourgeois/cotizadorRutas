import RecursoHumano from "../models/RecursoHumano.js";

// Crear nuevo recurso humano
export const crearRecursoHumano = async (req, res) => {
  try {
    const nuevoRecurso = new RecursoHumano({ ...req.body, usuario: req.usuario._id });
    await nuevoRecurso.save();
    res.status(201).json(nuevoRecurso);
  } catch (error) {
    console.error("❌ ERROR AL CREAR RECURSO HUMANO:", error); // 🔥 esto es lo que falta
    res.status(500).json({ error: "Error al crear el recurso humano" });
  }
};


// Obtener todos los recursos humanos
export const obtenerRecursosHumanos = async (req, res) => {
  try {
    const recursos = await RecursoHumano.find({ usuario: req.usuario._id }).sort({ creadoEn: -1 });
    res.json(recursos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los recursos", detalle: error.message });
  }
};

// Obtener uno por ID
export const obtenerRecursoHumanoPorId = async (req, res) => {
  try {
    const recurso = await RecursoHumano.findById(req.params.id);
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(recurso);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el recurso", detalle: error.message });
  }
};

// Actualizar recurso humano
export const actualizarRecursoHumano = async (req, res) => {
  try {
    const recurso = await RecursoHumano.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(recurso);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar", detalle: error.message });
  }
};

// Eliminar recurso humano
export const eliminarRecursoHumano = async (req, res) => {
  try {
    const recurso = await RecursoHumano.findByIdAndDelete(req.params.id);
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ mensaje: "Recurso humano eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar", detalle: error.message });
  }
};
