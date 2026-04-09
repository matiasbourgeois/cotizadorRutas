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
  // ═══ EMPLEADO — CCT 40/89, Escala Marzo 2026 (Conductor 1ra Categoría) ═══
  empleado: {
    sueldoBasico: 917462,                  // CCT Marzo 2026: Conductor 1ra
    adicionalActividadPorc: 15,             // ITEM 3.1.3 (configurable por rama)
    adicionalCargaDescargaCadaXkm: 38228,   // ITEM 4.2.6: Control de descarga = 1 jornal ($38.227,60)
    kmPorUnidadDeCarga: 1000,
    adicionalKmRemunerativo: 73.40,         // ITEM 4.2.3: Horas extras por km recorrido
    viaticoPorKmNoRemunerativo: 73.40,      // ITEM 4.2.4: Viático por km recorrido
    adicionalNoRemunerativoFijo: 53000,      // Suma no remunerativa Marzo 2026
    minimoMinutosFacturables: 120,
    porcentajeCargasSociales: 35,
  },

  // ═══ CONTRATADO — Factor sobre empleado ═══
  // El costo del contratado se calcula como un % del costo del empleado equivalente.
  // 75% = el contratado cuesta 25% menos que un empleado (basado en: contribuciones
  // patronales 24%, SAC 8.33%, vacaciones 4%, ART 3.5%, monotributo Cat G, IIBB 3%).
  contratado: {
    factorSobreEmpleado: 75,                // % del costo del empleado CCT equivalente
  },
};

export const DEFAULTS_CALCULOS = {
  tiempoCargaDescargaMin: 30,
  umbralJornadaCompletaMin: 180,
  jornadaCompletaMinutos: 480,
  divisorJornalCCT: 24,              // CCT 40/89: sueldo mensual ÷ 24 = jornal diario
  factorRendimientoGNC: 1.15,
  factorCargaRefrigerada: 1.25,
  costoAdicionalKmPeligrosa: 350,
  semanasPorMes: 4.33,
  diasLaboralesMes: 22,
  porcentajeIVA: 21,
  // ── Km mínimos facturables al cliente (RRHH CCT 40/89) ──
  // El CCT obliga a pagar 350 km mínimo al chofer. Estos valores controlan
  // qué mínimo se traslada al cliente según la distancia del viaje.
  umbralKmRutaLarga: 200,   // rutas ≥ este valor usan el mínimo largo
  kmMinimoRutaCorta: 150,   // mínimo km facturable en rutas cortas
  kmMinimoRutaLarga: 350,   // mínimo km facturable en rutas largas (= CCT)
};

export const DEFAULTS_EMPRESA = {
  nombre: 'Mi Empresa',
  slogan: 'Transporte y Logística',
  cuit: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  colorPrimario: '#3A56A5',
  colorAcento: '#11B7CD',
  logoUrl: '',
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
  // ── Campos empleado (CCT 40/89) ──
  sueldoBasico: Number,
  adicionalActividadPorc: Number,
  adicionalCargaDescargaCadaXkm: Number,
  kmPorUnidadDeCarga: Number,
  adicionalKmRemunerativo: Number,
  viaticoPorKmNoRemunerativo: Number,
  adicionalNoRemunerativoFijo: Number,
  minimoMinutosFacturables: Number,
  porcentajeCargasSociales: Number,

  // ── Campos contratado (factor sobre empleado) ──
  factorSobreEmpleado: Number,
}, { _id: false });

const calculosDefaultsSchema = new mongoose.Schema({
  tiempoCargaDescargaMin: Number,
  umbralJornadaCompletaMin: Number,
  jornadaCompletaMinutos: Number,
  divisorJornalCCT: Number,
  factorRendimientoGNC: Number,
  factorCargaRefrigerada: Number,
  costoAdicionalKmPeligrosa: Number,
  semanasPorMes: Number,
  diasLaboralesMes: Number,
  porcentajeIVA: Number,
  // Km mínimos facturables al cliente (CCT 40/89)
  umbralKmRutaLarga: Number,
  kmMinimoRutaCorta: Number,
  kmMinimoRutaLarga: Number,
}, { _id: false });

const empresaSchema = new mongoose.Schema({
  nombre: { type: String, default: 'Mi Empresa' },
  slogan: { type: String, default: 'Transporte y Logística' },
  cuit: { type: String, default: '' },
  telefono: { type: String, default: '' },
  email: { type: String, default: '' },
  direccion: { type: String, default: '' },
  ciudad: { type: String, default: '' },
  colorPrimario: { type: String, default: '#3A56A5' },
  colorAcento: { type: String, default: '#11B7CD' },
  logoUrl: { type: String, default: '' },
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
    empleado:   { type: rrhhDefaultsSchema, default: () => ({ ...DEFAULTS_RRHH.empleado }) },
    contratado: { type: rrhhDefaultsSchema, default: () => ({ ...DEFAULTS_RRHH.contratado }) },
  },
  calculos: {
    type: calculosDefaultsSchema,
    default: () => ({ ...DEFAULTS_CALCULOS }),
  },
  empresa: {
    type: empresaSchema,
    default: () => ({ ...DEFAULTS_EMPRESA }),
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
