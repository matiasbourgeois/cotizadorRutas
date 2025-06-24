// ruta: cotizadorRutas-backend/controllers/vehiculoController.js

import Vehiculo from '../models/Vehiculo.js';

export const crearVehiculo = async (req, res) => {
  try {
    const defaults = obtenerValoresPorTipo(req.body.tipoVehiculo);
    const vehiculoData = { ...defaults, ...req.body };
    const vehiculoDataConUsuario = { ...vehiculoData, usuario: req.usuario._id };
    const nuevoVehiculo = new Vehiculo(vehiculoDataConUsuario);
    await nuevoVehiculo.save();
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    // ✅ --- SECCIÓN DE ERROR MEJORADA --- ✅
    console.error("⛔️ FALLO DETALLADO AL CREAR VEHÍCULO:", error);
    res.status(500).json({
      mensaje: 'Error interno al intentar crear el vehículo.',
      error: error.message,
      // En un entorno de desarrollo, podrías enviar el stack completo para depurar
      // stack: error.stack 
    });
  }
};

export const obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find({ usuario: req.usuario._id }).sort({ creadoEn: -1 });
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
      };

    case 'mediano':
      return {
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
      };

    case 'grande':
      return {
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
      };

    case 'camion':
    default:
      return {
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
      };
  }
}