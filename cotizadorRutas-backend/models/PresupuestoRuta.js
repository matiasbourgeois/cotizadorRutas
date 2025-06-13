import mongoose from 'mongoose';

const presupuestoRutaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  kilometros_totales: Number,
  tiempo_estimado_min: Number,
  puntos: [
    {
      descripcion: String,
      lat: Number,
      lng: Number,
      tipo: { type: String, enum: ['direccion', 'localidad'] },
      orden: Number
    }
  ],
  vehiculo: {
    tipo: String,
    combustible: String,
    consumo_litros_cada_100km: Number,
    costo: Number,
    anio: Number
  },
  chofer: {
    tipo_vinculo: { type: String, enum: ['empleado', 'contratado', 'tercerizado'] },
    sueldo: Number,
    honorarios: Number
  },
  costos_extra: {
    peajes: Number,
    patentes: Number,
    seguros: Number,
    generales: Number
  },
  resultado_final: {
    mensual: Number,
    por_viaje: Number,
    rentabilidad: Number
  },
  observaciones: String
});

const PresupuestoRuta = mongoose.model('PresupuestoRuta', presupuestoRutaSchema);
export default PresupuestoRuta;
