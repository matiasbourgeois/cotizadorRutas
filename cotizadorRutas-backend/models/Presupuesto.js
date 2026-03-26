import mongoose from 'mongoose';

const PresupuestoSchema = new mongoose.Schema({
  puntosEntrega: { type: Array, default: [] },
  totalKilometros: Number,
  duracionMin: Number,
  frecuencia: { type: Object },
  vehiculo: {
    datos: { type: Object },
    calculo: { type: Object }
  },
  detallesCarga: {
    type: Object,
    default: { tipo: 'general', pesoKg: 0, valorDeclarado: 0 }
  },
  recursoHumano: {
    datos: { type: Object },
    calculo: { type: Object }
  },
  configuracion: { type: Object },
  resumenCostos: { type: Object },
  cliente: { type: String, trim: true },
  terminos: { type: String, trim: true },
  empresa: { type: Object, default: {} },

  fechaCreacion: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Presupuesto = mongoose.model('Presupuesto', PresupuestoSchema);
export default Presupuesto;