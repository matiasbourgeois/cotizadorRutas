import mongoose from 'mongoose';

// ═══════════════════════════════════════════════════════════════════
// Valores hardcodeados originales (fallback si no hay config)
// ═══════════════════════════════════════════════════════════════════

export const DEFAULTS_VEHICULO = {
  utilitario: {
    rendimientoKmLitro: 12,
    capacidadKg: 800,
    volumenM3: 4,
    cantidadCubiertas: 4,
    precioLitroCombustible: 1400,
    precioGNC: 700,
    precioCambioAceite: 150000,
    precioCubierta: 110000,
    precioVehiculoNuevo: 25000000,
    costoMantenimientoPreventivoMensual: 50000,
    costoSeguroMensual: 50000,
    costoPatenteMunicipal: 15000,
    costoPatenteProvincial: 20000,
    kmsVidaUtilVehiculo: 600000,
    kmsVidaUtilCubiertas: 75000,
    kmsCambioAceite: 10000,
    valorResidualPorcentaje: 30,
  },
  mediano: {
    rendimientoKmLitro: 10,
    capacidadKg: 1500,
    volumenM3: 9,
    cantidadCubiertas: 4,
    precioLitroCombustible: 1500,
    precioGNC: 700,
    precioCambioAceite: 180000,
    precioCubierta: 200000,
    precioVehiculoNuevo: 32000000,
    costoMantenimientoPreventivoMensual: 60000,
    costoSeguroMensual: 100000,
    costoPatenteMunicipal: 20000,
    costoPatenteProvincial: 25000,
    kmsVidaUtilVehiculo: 600000,
    kmsVidaUtilCubiertas: 75000,
    kmsCambioAceite: 12000,
    valorResidualPorcentaje: 30,
  },
  grande: {
    rendimientoKmLitro: 7,
    capacidadKg: 3000,
    volumenM3: 15,
    cantidadCubiertas: 6,
    precioLitroCombustible: 1500,
    precioGNC: 700,
    precioCambioAceite: 250000,
    precioCubierta: 250000,
    precioVehiculoNuevo: 45000000,
    costoMantenimientoPreventivoMensual: 70000,
    costoSeguroMensual: 150000,
    costoPatenteMunicipal: 30000,
    costoPatenteProvincial: 40000,
    kmsVidaUtilVehiculo: 600000,
    kmsVidaUtilCubiertas: 75000,
    kmsCambioAceite: 16000,
    valorResidualPorcentaje: 30,
  },
  camion: {
    rendimientoKmLitro: 4,
    capacidadKg: 10000,
    volumenM3: 40,
    cantidadCubiertas: 8,
    precioLitroCombustible: 1500,
    precioGNC: 0,
    precioCambioAceite: 300000,
    precioCubierta: 400000,
    precioVehiculoNuevo: 80000000,
    costoMantenimientoPreventivoMensual: 200000,
    costoSeguroMensual: 250000,
    costoPatenteMunicipal: 40000,
    costoPatenteProvincial: 60000,
    kmsVidaUtilVehiculo: 600000,
    kmsVidaUtilCubiertas: 100000,
    kmsCambioAceite: 20000,
    valorResidualPorcentaje: 30,
  },
};

export const DEFAULTS_RRHH = {
  sueldoBasico: 723858,
  adicionalActividadPorc: 15,
  adicionalCargaDescargaCadaXkm: 30160.77,
  kmPorUnidadDeCarga: 1000,
  adicionalKmRemunerativo: 57.90,
  minKmRemunerativo: 350,
  viaticoPorKmNoRemunerativo: 57.90,
  minKmNoRemunerativo: 350,
  adicionalNoRemunerativoFijo: 50000,
  horasLaboralesMensuales: 192,
  minimoMinutosFacturables: 120,
  porcentajeCargasSociales: 30,
  porcentajeOverheadContratado: 10,
};

export const DEFAULTS_CALCULOS = {
  tiempoCargaDescargaMin: 30,
  umbralJornadaCompletaMin: 180,
  jornadaCompletaMinutos: 480,
  factorRendimientoGNC: 1.15,
  factorCargaRefrigerada: 1.25,
  costoAdicionalKmPeligrosa: 250,
  semanasPorMes: 4.33,
  diasLaboralesMes: 22,
};

// ═══════════════════════════════════════════════════════════════════
// Sub-schemas
// ═══════════════════════════════════════════════════════════════════

const vehiculoDefaultsSchema = new mongoose.Schema({
  rendimientoKmLitro: Number,
  capacidadKg: Number,
  volumenM3: Number,
  cantidadCubiertas: Number,
  precioLitroCombustible: Number,
  precioGNC: Number,
  precioCambioAceite: Number,
  precioCubierta: Number,
  precioVehiculoNuevo: Number,
  costoMantenimientoPreventivoMensual: Number,
  costoSeguroMensual: Number,
  costoPatenteMunicipal: Number,
  costoPatenteProvincial: Number,
  kmsVidaUtilVehiculo: Number,
  kmsVidaUtilCubiertas: Number,
  kmsCambioAceite: Number,
  valorResidualPorcentaje: Number,
}, { _id: false });

const rrhhDefaultsSchema = new mongoose.Schema({
  sueldoBasico: Number,
  adicionalActividadPorc: Number,
  adicionalCargaDescargaCadaXkm: Number,
  kmPorUnidadDeCarga: Number,
  adicionalKmRemunerativo: Number,
  minKmRemunerativo: Number,
  viaticoPorKmNoRemunerativo: Number,
  minKmNoRemunerativo: Number,
  adicionalNoRemunerativoFijo: Number,
  horasLaboralesMensuales: Number,
  minimoMinutosFacturables: Number,
  porcentajeCargasSociales: Number,
  porcentajeOverheadContratado: Number,
}, { _id: false });

const calculosDefaultsSchema = new mongoose.Schema({
  tiempoCargaDescargaMin: Number,
  umbralJornadaCompletaMin: Number,
  jornadaCompletaMinutos: Number,
  factorRendimientoGNC: Number,
  factorCargaRefrigerada: Number,
  costoAdicionalKmPeligrosa: Number,
  semanasPorMes: Number,
  diasLaboralesMes: Number,
}, { _id: false });

// ═══════════════════════════════════════════════════════════════════
// Main Schema — Una config por usuario
// ═══════════════════════════════════════════════════════════════════

const configuracionDefaultsSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  vehiculos: {
    utilitario: { type: vehiculoDefaultsSchema, default: () => ({ ...DEFAULTS_VEHICULO.utilitario }) },
    mediano:    { type: vehiculoDefaultsSchema, default: () => ({ ...DEFAULTS_VEHICULO.mediano }) },
    grande:     { type: vehiculoDefaultsSchema, default: () => ({ ...DEFAULTS_VEHICULO.grande }) },
    camion:     { type: vehiculoDefaultsSchema, default: () => ({ ...DEFAULTS_VEHICULO.camion }) },
  },
  recursosHumanos: {
    type: rrhhDefaultsSchema,
    default: () => ({ ...DEFAULTS_RRHH }),
  },
  calculos: {
    type: calculosDefaultsSchema,
    default: () => ({ ...DEFAULTS_CALCULOS }),
  },
  actualizadoEn: {
    type: Date,
    default: Date.now,
  },
});

configuracionDefaultsSchema.pre('findOneAndUpdate', function () {
  this.set({ actualizadoEn: new Date() });
});

export default mongoose.model('ConfiguracionDefaults', configuracionDefaultsSchema);
