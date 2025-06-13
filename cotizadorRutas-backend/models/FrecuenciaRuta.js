import mongoose from "mongoose";

const frecuenciaRutaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["esporadico", "mensual"],
    required: true
  },

  // Solo para esporádico
  vueltasTotales: {
    type: Number,
    default: null
  },

  // Solo para mensual
  diasSeleccionados: {
    type: [String], // ej: ["martes", "jueves"]
    default: []
  },

  viajesPorDia: {
    type: Number,
    default: 1
  },

  // Asignación de chofer y vehículo según frecuencia
  modoAsignacion: {
    type: String,
    enum: ["completo", "prorrateado"],
    default: "prorrateado"
  },

  observaciones: {
    type: String,
    default: ""
  },

  activo: {
    type: Boolean,
    default: true
  },

  creadoEn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("FrecuenciaRuta", frecuenciaRutaSchema);
