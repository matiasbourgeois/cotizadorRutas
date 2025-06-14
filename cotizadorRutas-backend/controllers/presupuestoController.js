// ruta: cotizadorRutas-backend/controllers/presupuestoController.js

import Presupuesto from '../models/Presupuesto.js';
import { generarPresupuestoPDF_Avanzado } from '../services/generadorPdfAvanzado.js';
import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';
import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';

export const calcularPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion } = req.body;

    if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano || !configuracion) {
        return res.status(400).json({ error: 'Faltan datos para el cálculo.' });
    }

    const kmsPorViaje = puntosEntrega?.distanciaKm || 0;
    let cantidadViajesMensuales = 0;
    if (frecuencia?.tipo === "mensual") {
        cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
    } else if (frecuencia?.tipo === "esporadico") {
        cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
    }
    const esViajeRegular = frecuencia?.tipo === "mensual";

    const costoVehiculo = calcularCostoVehiculo(
        vehiculo,
        kmsPorViaje,
        cantidadViajesMensuales,
        esViajeRegular
    );

    const costoRecurso = calcularCostoTotalRecurso(
        recursoHumano,
        kmsPorViaje,
        cantidadViajesMensuales
    );

    const totalVehiculo = costoVehiculo.totalFinal;
    const totalRecurso = costoRecurso.totalFinal;
    const totalPeajes = (configuracion.costoPeajes || 0) * cantidadViajesMensuales;
    const totalAdministrativo = configuracion.costoAdministrativo || 0;
    const otrosCostos = configuracion.otrosCostos || 0;

    const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos;
    const porcentajeGanancia = configuracion.porcentajeGanancia || 0;
    const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
    const totalFinal = totalOperativo + ganancia;

    const resumenCostos = {
        totalVehiculo,
        totalRecurso,
        totalPeajes,
        totalAdministrativo,
        otrosCostos,
        totalOperativo,
        ganancia,
        totalFinal
    };

    res.status(200).json({
        resumenCostos,
        detalleVehiculo: costoVehiculo,
        detalleRecurso: costoRecurso
    });

  } catch (error) {
    console.error('Error al calcular presupuesto:', error);
    res.status(500).json({ error: 'Error interno al calcular', detalles: error.message });
  }
};

export const crearPresupuesto = async (req, res) => {
  try {
    const { puntosEntrega, totalKilometros, frecuencia, vehiculo, recursoHumano, configuracion } = req.body;

     if (!puntosEntrega || !frecuencia || !vehiculo?.datos || !recursoHumano?.datos || !configuracion) {
        return res.status(400).json({ error: 'Faltan datos para crear el presupuesto.' });
    }

    const kmsPorViaje = totalKilometros || 0;
    let cantidadViajesMensuales = 0;
    if (frecuencia?.tipo === "mensual") {
        cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
    } else if (frecuencia?.tipo === "esporadico") {
        cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
    }
    const esViajeRegular = frecuencia?.tipo === "mensual";

    const calculoVehiculo = calcularCostoVehiculo(vehiculo.datos, kmsPorViaje, cantidadViajesMensuales, esViajeRegular);
    const calculoRecurso = calcularCostoTotalRecurso(recursoHumano.datos, kmsPorViaje, cantidadViajesMensuales);

    const totalVehiculo = calculoVehiculo.totalFinal;
    const totalRecurso = calculoRecurso.totalFinal;
    const totalPeajes = (configuracion.costoPeajes || 0) * cantidadViajesMensuales;
    const totalAdministrativo = configuracion.costoAdministrativo || 0;
    const otrosCostos = configuracion.otrosCostos || 0;

    const totalOperativo = totalVehiculo + totalRecurso + totalPeajes + totalAdministrativo + otrosCostos;
    const porcentajeGanancia = configuracion.porcentajeGanancia || 0;
    const ganancia = Math.round((totalOperativo * porcentajeGanancia) / 100);
    const totalFinal = totalOperativo + ganancia;
    
    const presupuestoParaGuardar = new Presupuesto({
      puntosEntrega,
      totalKilometros,
      frecuencia,
      vehiculo: {
        datos: vehiculo.datos,
        calculo: calculoVehiculo
      },
      recursoHumano: {
        datos: recursoHumano.datos,
        calculo: calculoRecurso
      },
      configuracion,
      resumenCostos: {
        totalVehiculo,
        totalRecurso,
        totalPeajes,
        totalAdministrativo,
        otrosCostos,
        totalOperativo,
        ganancia,
        totalFinal
      },
    });

    console.log("📄 Objeto que se guardará en la BD:", JSON.stringify(presupuestoParaGuardar, null, 2));

    const guardado = await presupuestoParaGuardar.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error.message });
  }
};

export const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().sort({ fechaCreacion: -1 });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

export const obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);
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
    const actualizado = await Presupuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const eliminado = await Presupuesto.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};


export const generarPdfPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById(req.params.id);
        if(!presupuesto) {
            return res.status(404).send('Presupuesto no encontrado');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=propuesta-${presupuesto._id}.pdf`);
        
        // 👇 **CAMBIO CLAVE: Usamos el nuevo generador avanzado**
        await generarPresupuestoPDF_Avanzado(presupuesto, res);

    } catch (error) {
        console.error("Error en el controlador al generar PDF avanzado:", error);
        res.status(500).send("Error al generar el PDF del presupuesto.");
    }
}

