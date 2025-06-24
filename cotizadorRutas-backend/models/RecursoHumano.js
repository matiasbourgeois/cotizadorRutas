import mongoose from "mongoose";

const recursoHumanoSchema = new mongoose.Schema({
  tipoContratacion: { type: String, enum: ["empleado", "contratado"], required: true },

  nombre: String,
  dni: String,
  cuil: String,
  telefono: String,
  email: String,

  // Sueldo base y adicionales comunes
  sueldoBasico: { type: Number, default: 723858 },
  adicionalActividadPorc: { type: Number, default: 15 },
  adicionalCargaDescargaCadaXkm: { type: Number, default: 30160.77 },
  kmPorUnidadDeCarga: { type: Number, default: 1000 },

  // Común a empleados y contratados
  adicionalKmRemunerativo: { type: Number, default: 57.90 },
  minKmRemunerativo: { type: Number, default: 350 },
  viaticoPorKmNoRemunerativo: { type: Number, default: 57.90 },
  minKmNoRemunerativo: { type: Number, default: 350 },
  adicionalNoRemunerativoFijo: { type: Number, default: 50000 },

  // Costos adicionales según tipo de contratación
  porcentajeCargasSociales: { type: Number, default: 30 },          // Solo aplica a empleados
  porcentajeOverheadContratado: { type: Number, default: 10 },      // Solo aplica a contratados

  observaciones: String,

  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model("RecursoHumano", recursoHumanoSchema);

