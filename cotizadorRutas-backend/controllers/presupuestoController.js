
import Presupuesto from '../models/Presupuesto.js';
import calcularResumenCostos from '../services/calculos/calcularResumenCostos.js';
import { calcularFeriadosPorMes } from '../services/feriadosService.js';
import { obtenerConstantesCalculo, obtenerDatosEmpresa } from './configuracionDefaultsController.js';


export const calcularPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, frecuencia, detallesCarga } = req.body;
    const vehiculo = req.body.vehiculo || null;
    const recursoHumano = req.body.recursoHumano || null;
    const configuracion = req.body.configuracion || {};

    if (!puntosEntrega || !frecuencia) {
      return res.status(400).json({ error: 'Faltan datos de ruta o frecuencia para el cálculo.' });
    }

    // Cargar constantes de cálculo del usuario
    const constantesCalculo = await obtenerConstantesCalculo(req.usuario._id);

    // Calcular feriados si es frecuencia mensual con 4+ días
    let feriadosPorMes = 0;
    if (frecuencia?.tipo === 'mensual' && frecuencia.diasSeleccionados?.length >= 4) {
      feriadosPorMes = await calcularFeriadosPorMes(frecuencia.diasSeleccionados);
    }

    const { resumenCostos, calculoVehiculo, calculoRecurso } = calcularResumenCostos({
      vehiculoDatos: vehiculo,
      recursoDatos: recursoHumano,
      kmsPorViaje: puntosEntrega?.distanciaKm || 0,
      duracionMin: puntosEntrega?.duracionMin || 0,
      frecuencia,
      configuracion,
      detallesCarga,
      feriadosPorMes,
      constantesCalculo
    });

    res.status(200).json({
      resumenCostos,
      detalleVehiculo: calculoVehiculo,
      detalleRecurso: calculoRecurso
    });

  } catch (error) {
    console.error('Error al calcular presupuesto:', error);
    res.status(500).json({ error: 'Error interno al calcular', detalles: error.message });
  }
};

export const crearPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, totalKilometros, duracionMin, frecuencia, vehiculo, recursoHumano, configuracion, detallesCarga } = req.body;

    if (!puntosEntrega || !frecuencia || !vehiculo?.datos || !recursoHumano?.datos || !configuracion) {
      return res.status(400).json({ error: 'Faltan datos clave para crear el presupuesto.' });
    }

    // Cargar constantes de cálculo del usuario
    const constantesCalculo = await obtenerConstantesCalculo(req.usuario._id);

    // Calcular feriados si es frecuencia mensual con 4+ días
    let feriadosPorMes = 0;
    if (frecuencia?.tipo === 'mensual' && frecuencia.diasSeleccionados?.length >= 4) {
      feriadosPorMes = await calcularFeriadosPorMes(frecuencia.diasSeleccionados);
    }

    const { resumenCostos, calculoVehiculo, calculoRecurso } = calcularResumenCostos({
      vehiculoDatos: vehiculo.datos,
      recursoDatos: recursoHumano.datos,
      kmsPorViaje: totalKilometros || 0,
      duracionMin: duracionMin || 0,
      frecuencia,
      configuracion,
      detallesCarga,
      feriadosPorMes,
      constantesCalculo
    });

    // Cargar datos de empresa del usuario
    const empresaDatos = await obtenerDatosEmpresa(req.usuario._id);

    const presupuestoParaGuardar = new Presupuesto({
      puntosEntrega,
      totalKilometros,
      duracionMin,
      frecuencia,
      vehiculo: { datos: vehiculo.datos, calculo: calculoVehiculo },
      recursoHumano: { datos: recursoHumano.datos, calculo: calculoRecurso },
      configuracion,
      detallesCarga,
      resumenCostos,
      cliente: configuracion.cliente,
      terminos: configuracion.terminos,
      empresa: empresaDatos,
      usuario: req.usuario._id
    });

    const guardado = await presupuestoParaGuardar.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error.message });
  }
};

// ── PÚBLICO: datos para compartir propuesta (sin auth) ──
export const obtenerPresupuestoPublico = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).json({ error: 'Propuesta no encontrada' });
    }

    // Devolvemos todo lo necesario para renderizar la propuesta
    // Excluimos: cálculos internos detallados, configuración interna, usuario
    const p = presupuesto.toObject();
    res.json({
      _id: p._id,
      empresa: p.empresa,
      cliente: p.cliente,
      terminos: p.terminos,
      puntosEntrega: p.puntosEntrega,
      totalKilometros: p.totalKilometros,
      duracionMin: p.duracionMin,
      frecuencia: p.frecuencia,
      detallesCarga: p.detallesCarga,
      fechaCreacion: p.fechaCreacion,
      resumenCostos: { totalFinal: p.resumenCostos?.totalFinal || 0 },
      vehiculo: { datos: p.vehiculo?.datos }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propuesta pública' });
  }
};

// ── PÚBLICO: datos para compartir desglose (sin auth) ──
// SEGURIDAD: filtramos datos sensibles (márgenes, ganancia, config interna)
export const obtenerDesglosePublico = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
    if (!presupuesto) {
      return res.status(404).json({ error: 'Desglose no encontrado' });
    }
    const p = presupuesto.toObject();

    // Filtrar resumenCostos: solo mostrar totales, ocultar márgenes internos
    const resumenSeguro = {
      totalVehiculo: p.resumenCostos?.totalVehiculo || 0,
      totalRecurso: p.resumenCostos?.totalRecurso || 0,
      totalPeajes: p.resumenCostos?.totalPeajes || 0,
      totalAdministrativo: p.resumenCostos?.totalAdministrativo || 0,
      otrosCostos: p.resumenCostos?.otrosCostos || 0,
      costoAdicionalPeligrosa: p.resumenCostos?.costoAdicionalPeligrosa || 0,
      totalOperativo: p.resumenCostos?.totalOperativo || 0,
      totalFinal: p.resumenCostos?.totalFinal || 0,
      porcentajeIVA: p.resumenCostos?.porcentajeIVA || 21,
      montoIVA: p.resumenCostos?.montoIVA || 0,
      totalConIVA: p.resumenCostos?.totalConIVA || 0,
      // ❌ NO incluimos: ganancia (monto ni %)
    };

    res.json({
      _id: p._id,
      empresa: p.empresa,
      cliente: p.cliente,
      puntosEntrega: p.puntosEntrega,
      totalKilometros: p.totalKilometros,
      duracionMin: p.duracionMin,
      frecuencia: p.frecuencia,
      detallesCarga: p.detallesCarga,
      fechaCreacion: p.fechaCreacion,
      vehiculo: p.vehiculo,
      recursoHumano: p.recursoHumano,
      resumenCostos: resumenSeguro,
      // ❌ NO incluimos: configuracion (tiene % ganancia, % admin), usuario
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener desglose público' });
  }
};

export const obtenerPresupuestos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const [presupuestos, total] = await Promise.all([
      Presupuesto.find({ usuario: req.usuario._id })
        .sort({ fechaCreacion: -1 })
        .skip(skip)
        .limit(limit),
      Presupuesto.countDocuments({ usuario: req.usuario._id })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      presupuestos,
      currentPage: page,
      totalPages,
      totalItems: total
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos', detalle: error.message });
  }
};

export const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOne({ _id: req.params.id, usuario: req.usuario._id });
    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el presupuesto' });
  }
};

export const actualizarPresupuesto = async (req, res) => {
  try {
    // Sanitizar: solo permitir campos editables
    const camposPermitidos = ['cliente', 'terminos', 'configuracion', 'detallesCarga'];
    const datosLimpios = {};
    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) {
        datosLimpios[campo] = req.body[campo];
      }
    }

    const actualizado = await Presupuesto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      datosLimpios,
      { new: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar presupuesto' });
  }
};

export const eliminarPresupuesto = async (req, res) => {
  try {
    const eliminado = await Presupuesto.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
    if (!eliminado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};