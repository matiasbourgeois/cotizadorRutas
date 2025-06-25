// En: cotizadorRutas-backend/models/Presupuesto.js
import mongoose from 'mongoose';

const PresupuestoSchema = new mongoose.Schema({
  puntosEntrega: { type: Array, default: [] },
  totalKilometros: Number,
  duracionMin: Number, // <--- AÑADIDO: Guardaremos la duración aquí
  frecuencia: { type: Object },
  vehiculo: {
    datos: { type: Object },
    calculo: { type: Object }
  },
  detallesCarga: { // <--- MODIFICADO: Aseguramos que se guarde el objeto completo
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

  fechaCreacion: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Presupuesto = mongoose.model('Presupuesto', PresupuestoSchema);
export default Presupuesto;