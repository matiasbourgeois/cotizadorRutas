// En: cotizadorRutas-backend/routes/presupuestos.js

import express from 'express';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  generarPdfPresupuesto // <-- Importamos la nueva función
} from '../controllers/presupuestoController.js';

const router = express.Router();

router.get('/', obtenerPresupuestos);
router.get('/:id', obtenerPresupuestoPorId);
router.post('/', crearPresupuesto);
router.put('/:id', actualizarPresupuesto);
router.delete('/:id', eliminarPresupuesto);

// NUEVA RUTA
router.get('/:id/pdf', generarPdfPresupuesto);

export default router;