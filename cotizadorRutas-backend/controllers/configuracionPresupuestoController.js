import ConfiguracionPresupuesto from "../models/ConfiguracionPresupuesto.js";

// Crear nueva configuración
export const crearConfiguracionPresupuesto = async (req, res) => {
  try {
    const { idRuta } = req.body;

    // Verificar si ya existe una config para esa ruta
    const existente = await ConfiguracionPresupuesto.findOne({ idRuta });
    if (existente) {
      return res.status(400).json({ error: "Ya existe una configuración para esta ruta." });
    }

    const nueva = new ConfiguracionPresupuesto(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear configuración:", error);
    res.status(500).json({ error: "Error al crear configuración" });
  }
};

// Obtener por ID de ruta
export const obtenerConfiguracionPorRuta = async (req, res) => {
  try {
    const { idRuta } = req.params;
    const config = await ConfiguracionPresupuesto.findOne({ idRuta });

    if (!config) return res.status(404).json({ error: "Configuración no encontrada" });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener configuración" });
  }
};

// Actualizar configuración
export const actualizarConfiguracionPresupuesto = async (req, res) => {
  try {
    const { idRuta } = req.params;

    const configActualizada = await ConfiguracionPresupuesto.findOneAndUpdate(
      { idRuta },
      req.body,
      { new: true }
    );

    if (!configActualizada) return res.status(404).json({ error: "Configuración no encontrada" });
    res.json(configActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
};

// Eliminar configuración (opcional)
export const eliminarConfiguracion = async (req, res) => {
  try {
    const { idRuta } = req.params;
    const eliminado = await ConfiguracionPresupuesto.findOneAndDelete({ idRuta });
    if (!eliminado) return res.status(404).json({ error: "Configuración no encontrada" });

    res.json({ mensaje: "Configuración eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar configuración" });
  }
};
