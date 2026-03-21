import mongoose from 'mongoose';

const VehiculoSchema = new mongoose.Schema({
  // 📌 Datos obligatorios cargados manualmente
  tipoVehiculo: {
    type: String,
    enum: ['utilitario', 'mediano', 'grande', 'camion'],
    required: true
  },
  patente: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  año: {
    type: Number,
    required: true
  },
  tipoCombustible: {
    type: String,
    enum: ['nafta', 'gasoil'],
    required: true
  },
  tieneGNC: {
    type: Boolean,
    default: false
  },

  // ⚙️ Configuración técnica y económica base
  rendimientoKmLitro: {
    type: Number,
    default: 10
  },
  capacidadKg: {
    type: Number,
    default: null
  },
  volumenM3: {
    type: Number,
    default: null
  },
  cantidadCubiertas: {
    type: Number,
    default: null
  },
  precioCubierta: {
    type: Number,
    default: null
  },
  precioCambioAceite: {
    type: Number,
    default: null
  },
  precioLitroCombustible: {
    type: Number,
    default: null
  },
  precioGNC: {
    type: Number,
    default: null
  },
  precioVehiculoNuevo: {
    type: Number,
    default: null
  },

  // 🧾 Costos fijos mensuales
  costoMantenimientoPreventivoMensual: {
    type: Number,
    default: null
  },
  costoSeguroMensual: {
    type: Number,
    default: null
  },
  costoPatenteMunicipal: {
    type: Number,
    default: null
  },
  costoPatenteProvincial: {
    type: Number,
    default: null
  },

  // 📏 Parámetros de desgaste por km
  kmsVidaUtilVehiculo: {
    type: Number,
    default: null
  },

  valorResidualPorcentaje: {
    type: Number,
    default: 30 // por defecto 30%
  },

  kmsVidaUtilCubiertas: {
    type: Number,
    default: null
  },


  kmsCambioAceite: {
    type: Number,
    default: null
  },

  // 📝 Otros
  observaciones: {
    type: String,
    default: ''
  },

  // 🕒 Timestamps
  creadoEn: {
    type: Date,
    default: Date.now
  },
  actualizadoEn: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

VehiculoSchema.pre('findOneAndUpdate', function () {
  this.set({ actualizadoEn: new Date() });
});

const Vehiculo = mongoose.model('Vehiculo', VehiculoSchema);
export default Vehiculo;
