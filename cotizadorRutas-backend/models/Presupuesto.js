// En: cotizadorRutas-backend/models/Presupuesto.js

import mongoose from 'mongoose';

const PresupuestoSchema = new mongoose.Schema({
  puntosEntrega: { type: Array, default: [] },
  totalKilometros: Number,
  frecuencia: { type: Object },
  vehiculo: {
    datos: { type: Object },
    calculo: { type: Object }
  },
  recursoHumano: {
    datos: { type: Object },
    calculo: { type: Object }
  },
  configuracion: { type: Object },
  resumenCostos: { type: Object },
  fechaCreacion: { type: Date, default: Date.now }
});

const Presupuesto = mongoose.model('Presupuesto', PresupuestoSchema);
export default Presupuesto;