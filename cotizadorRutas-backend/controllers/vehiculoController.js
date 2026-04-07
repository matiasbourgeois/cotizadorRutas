
import Vehiculo from '../models/Vehiculo.js';
import { obtenerDefaultsVehiculoPorTipo } from './configuracionDefaultsController.js';

export const crearVehiculo = async (req, res) => {
  try {
    // Lee los defaults personalizados del usuario (de la DB, no hardcodeados)
    const defaults = await obtenerDefaultsVehiculoPorTipo(req.usuario._id, req.body.tipoVehiculo);
    // Lo que manda el user sobreescribe los defaults
    const vehiculoData = { ...defaults, ...req.body, usuario: req.usuario._id };
    const nuevoVehiculo = new Vehiculo(vehiculoData);
    await nuevoVehiculo.save();
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: `Ya tenés un vehículo registrado con la patente "${req.body.patente}".`,
      });
    }
    console.error("Error al crear vehículo:", error);
    res.status(500).json({
      mensaje: 'Error interno al intentar crear el vehículo.',
      error: error.message,
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
    const vehiculo = await Vehiculo.findOne({ _id: req.params.id, usuario: req.usuario._id });
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el vehículo.', detalle: error.message });
  }
};

export const actualizarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      req.body,
      { new: true }
    );
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el vehículo.', detalle: error.message });
  }
};

export const eliminarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el vehículo.', detalle: error.message });
  }
};