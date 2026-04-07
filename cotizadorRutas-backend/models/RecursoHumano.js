import mongoose from "mongoose";

const recursoHumanoSchema = new mongoose.Schema({
  tipoContratacion: { type: String, enum: ["empleado", "contratado"], required: true },

  nombre: String,
  dni: String,
  cuil: String,
  telefono: String,
  email: String,

  // ── Campos para EMPLEADO (CCT 40/89) ──
  sueldoBasico: { type: Number, default: 917462 },
  adicionalActividadPorc: { type: Number, default: 15 },
  adicionalCargaDescargaCadaXkm: { type: Number, default: 38228 },
  kmPorUnidadDeCarga: { type: Number, default: 1000 },

  adicionalKmRemunerativo: { type: Number, default: 73.40 },
  viaticoPorKmNoRemunerativo: { type: Number, default: 73.40 },
  adicionalNoRemunerativoFijo: { type: Number, default: 53000 },

  minimoMinutosFacturables: { type: Number, default: 120 },

  // Costos indirectos
  porcentajeCargasSociales: { type: Number, default: 35 },

  // ── Campo para CONTRATADO (factor sobre empleado) ──
  factorSobreEmpleado: { type: Number, default: 75 },

  observaciones: String,

  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

recursoHumanoSchema.pre('findOneAndUpdate', function () {
  this.set({ actualizadoEn: new Date() });
});

export default mongoose.model("RecursoHumano", recursoHumanoSchema);