import Vehiculo from '../models/Vehiculo.js';

// Crear un vehículo nuevo
export const crearVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = new Vehiculo(req.body);

    // Precargar valores avanzados si faltan
    if (!nuevoVehiculo.rendimientoKmLitro || !nuevoVehiculo.capacidadKg) {
      const defaults = obtenerValoresPorTipo(nuevoVehiculo.tipoVehiculo);
      nuevoVehiculo.rendimientoKmLitro ??= defaults.rendimientoKmLitro;
      nuevoVehiculo.capacidadKg ??= defaults.capacidadKg;
      nuevoVehiculo.volumenM3 ??= defaults.volumenM3;
      nuevoVehiculo.cantidadCubiertas ??= defaults.cantidadCubiertas;
      nuevoVehiculo.precioLitroCombustible ??= defaults.precioLitroCombustible;
      nuevoVehiculo.precioGNC ??= defaults.precioGNC;
      nuevoVehiculo.precioCambioAceite ??= defaults.precioCambioAceite;
      nuevoVehiculo.precioCubierta ??= defaults.precioCubierta;
    }

    await nuevoVehiculo.save();
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el vehículo.', detalle: error.message });
  }
};

export const obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find().sort({ creadoEn: -1 });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículos.', detalle: error.message });
  }
};

export const obtenerVehiculoPorId = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id);
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el vehículo.', detalle: error.message });
  }
};

export const actualizarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el vehículo.', detalle: error.message });
  }
};

export const eliminarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el vehículo.', detalle: error.message });
  }
};

function obtenerValoresPorTipo(tipo) {
  switch (tipo) {
    case 'utilitario':
      return {
        rendimientoKmLitro: 12,
        capacidadKg: 800,
        volumenM3: 5,
        cantidadCubiertas: 4,
        precioLitroCombustible: 690,
        precioGNC: 110,
        precioCambioAceite: 100000,
        precioCubierta: 90000,
        precioVehiculoNuevo: 6500000,
        costoMantenimientoPreventivoMensual: 30000,
        costoSeguroMensual: 25000,
        costoPatenteMunicipal: 8000,
        costoPatenteProvincial: 6000,
        kmsVidaUtilVehiculo: 250000,
        kmsVidaUtilCubiertas: 40000,
        kmsCambioAceite: 10000
      };

    case 'mediano':
      return {
        rendimientoKmLitro: 10,
        capacidadKg: 1200,
        volumenM3: 7,
        cantidadCubiertas: 4,
        precioLitroCombustible: 690,
        precioGNC: 110,
        precioCambioAceite: 120000,
        precioCubierta: 100000,
        precioVehiculoNuevo: 9000000,
        costoMantenimientoPreventivoMensual: 35000,
        costoSeguroMensual: 30000,
        costoPatenteMunicipal: 10000,
        costoPatenteProvincial: 7000,
        kmsVidaUtilVehiculo: 300000,
        kmsVidaUtilCubiertas: 45000,
        kmsCambioAceite: 12000
      };

    case 'grande':
      return {
        rendimientoKmLitro: 7,
        capacidadKg: 2000,
        volumenM3: 10,
        cantidadCubiertas: 6,
        precioLitroCombustible: 700,
        precioGNC: 0,
        precioCambioAceite: 140000,
        precioCubierta: 120000,
        precioVehiculoNuevo: 12000000,
        costoMantenimientoPreventivoMensual: 45000,
        costoSeguroMensual: 40000,
        costoPatenteMunicipal: 12000,
        costoPatenteProvincial: 8000,
        kmsVidaUtilVehiculo: 350000,
        kmsVidaUtilCubiertas: 50000,
        kmsCambioAceite: 15000
      };

    case 'camion':
    default:
      return {
        rendimientoKmLitro: 4,
        capacidadKg: 8000,
        volumenM3: 20,
        cantidadCubiertas: 10,
        precioLitroCombustible: 720,
        precioGNC: 0,
        precioCambioAceite: 180000,
        precioCubierta: 150000,
        precioVehiculoNuevo: 18000000,
        costoMantenimientoPreventivoMensual: 60000,
        costoSeguroMensual: 55000,
        costoPatenteMunicipal: 15000,
        costoPatenteProvincial: 12000,
        kmsVidaUtilVehiculo: 500000,
        kmsVidaUtilCubiertas: 60000,
        kmsCambioAceite: 20000
      };
  }
}

