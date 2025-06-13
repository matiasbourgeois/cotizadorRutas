// En: cotizadorRutas-backend/controllers/presupuestoController.js

import Presupuesto from '../models/Presupuesto.js'; // <-- Usamos el nuevo modelo
import { generarPresupuestoPDF } from '../services/generadorPdf.js';

// Obtener todos los presupuestos
export const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().sort({ fechaCreacion: -1 });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

// Obtener presupuesto por ID
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

// Crear nuevo presupuesto
export const crearPresupuesto = async (req, res) => {
  try {
    // renombramos el campo idRuta si viene del frontend, para evitar confusiones
    if(req.body.idRuta) {
      req.body.rutaId = req.body.idRuta;
      delete req.body.idRuta;
    }

    const nuevo = new Presupuesto(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(400).json({ error: 'Error al crear presupuesto', detalles: error.message });
  }
};

// Actualizar presupuesto
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

// Eliminar presupuesto
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

// NUEVA FUNCIÓN: Generar y enviar el PDF
export const generarPdfPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById(req.params.id);
        if(!presupuesto) {
            return res.status(404).send('Presupuesto no encontrado');
        }

        const stream = res;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto-${presupuesto._id}.pdf`);

        generarPresupuestoPDF(presupuesto, stream);

    } catch (error) {
        console.error("Error al generar PDF:", error);
        res.status(500).send("Error al generar el PDF");
    }
}