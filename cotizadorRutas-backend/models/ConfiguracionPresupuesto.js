import mongoose from "mongoose";

const configuracionPresupuestoSchema = new mongoose.Schema({
  idRuta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PresupuestoRuta",
    required: true,
    unique: true
  },

  porcentajeAdministrativo: {
    type: Number,
    default: 10
  },

  porcentajeGanancia: {
    type: Number,
    default: 15
  },

  incluirPeajeEnCalculo: {
    type: Boolean,
    default: true
  },

  tipoPresupuesto: {
    type: String,
    enum: ["completo", "resumen"],
    default: "completo"
  },

  observaciones: {
    type: String,
    default: ""
  },

  creadoEn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ConfiguracionPresupuesto", configuracionPresupuestoSchema);
