// ruta: cotizadorRutas-backend/controllers/vehiculoController.js

import Vehiculo from '../models/Vehiculo.js';

export const crearVehiculo = async (req, res) => {
  try {
    const defaults = obtenerValoresPorTipo(req.body.tipoVehiculo);
    const vehiculoData = { ...defaults, ...req.body };
    const nuevoVehiculo = new Vehiculo(vehiculoData);
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
    // ... (esta función no cambia)
    switch (tipo) {
        case 'utilitario':
          return {
            rendimientoKmLitro: 12,
            capacidadKg: 800,
            volumenM3: 5,
            cantidadCubiertas: 4,
            precioLitroCombustible: 950,
            precioGNC: 450,
            precioCambioAceite: 100000,
            precioCubierta: 150000,
            precioVehiculoNuevo: 25000000,
            costoMantenimientoPreventivoMensual: 40000,
            costoSeguroMensual: 50000,
            costoPatenteMunicipal: 15000,
            costoPatenteProvincial: 20000,
            kmsVidaUtilVehiculo: 300000,
            kmsVidaUtilCubiertas: 50000,
            kmsCambioAceite: 10000,
            valorResidualPorcentaje: 30,
          };
    
        case 'mediano':
          return {
            rendimientoKmLitro: 10,
            capacidadKg: 1500,
            volumenM3: 9,
            cantidadCubiertas: 4,
            precioLitroCombustible: 950,
            precioGNC: 450,
            precioCambioAceite: 140000,
            precioCubierta: 180000,
            precioVehiculoNuevo: 32000000,
            costoMantenimientoPreventivoMensual: 55000,
            costoSeguroMensual: 65000,
            costoPatenteMunicipal: 20000,
            costoPatenteProvincial: 25000,
            kmsVidaUtilVehiculo: 400000,
            kmsVidaUtilCubiertas: 60000,
            kmsCambioAceite: 12000,
            valorResidualPorcentaje: 30,
          };
    
        case 'grande':
          return {
            rendimientoKmLitro: 7,
            capacidadKg: 3000,
            volumenM3: 15,
            cantidadCubiertas: 6,
            precioLitroCombustible: 1050,
            precioGNC: 0,
            precioCambioAceite: 200000,
            precioCubierta: 250000,
            precioVehiculoNuevo: 45000000,
            costoMantenimientoPreventivoMensual: 70000,
            costoSeguroMensual: 80000,
            costoPatenteMunicipal: 30000,
            costoPatenteProvincial: 40000,
            kmsVidaUtilVehiculo: 600000,
            kmsVidaUtilCubiertas: 80000,
            kmsCambioAceite: 15000,
            valorResidualPorcentaje: 25,
          };
    
        case 'camion':
        default:
          return {
            rendimientoKmLitro: 4,
            capacidadKg: 10000,
            volumenM3: 40,
            cantidadCubiertas: 10,
            precioLitroCombustible: 1050,
            precioGNC: 0,
            precioCambioAceite: 250000,
            precioCubierta: 350000,
            precioVehiculoNuevo: 80000000,
            costoMantenimientoPreventivoMensual: 90000,
            costoSeguroMensual: 120000,
            costoPatenteMunicipal: 40000,
            costoPatenteProvincial: 60000,
            kmsVidaUtilVehiculo: 1000000,
            kmsVidaUtilCubiertas: 100000,
            kmsCambioAceite: 20000,
            valorResidualPorcentaje: 20,
          };
      }
}