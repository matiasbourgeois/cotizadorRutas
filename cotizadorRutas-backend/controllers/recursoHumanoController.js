import RecursoHumano from "../models/RecursoHumano.js";
import { obtenerDefaultsRRHH } from './configuracionDefaultsController.js';

// Crear nuevo recurso humano — usa defaults personalizados del usuario
export const crearRecursoHumano = async (req, res) => {
  try {
    const defaults = await obtenerDefaultsRRHH(req.usuario._id, req.body.tipoContratacion);
    // Lo que manda el user sobreescribe los defaults
    const recursoData = { ...defaults, ...req.body, usuario: req.usuario._id };
    const nuevoRecurso = new RecursoHumano(recursoData);
    await nuevoRecurso.save();
    res.status(201).json(nuevoRecurso);
  } catch (error) {
    console.error("Error al crear recurso humano:", error);
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
    const recurso = await RecursoHumano.findOne({ _id: req.params.id, usuario: req.usuario._id });
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(recurso);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el recurso", detalle: error.message });
  }
};

// Actualizar recurso humano
export const actualizarRecursoHumano = async (req, res) => {
  try {
    const recurso = await RecursoHumano.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      req.body,
      { new: true }
    );
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(recurso);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar", detalle: error.message });
  }
};

// Eliminar recurso humano
export const eliminarRecursoHumano = async (req, res) => {
  try {
    const recurso = await RecursoHumano.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ mensaje: "Recurso humano eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar", detalle: error.message });
  }
};
