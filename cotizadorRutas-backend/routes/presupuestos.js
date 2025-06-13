// ruta: cotizadorRutas-backend/routes/presupuestos.js

import express from 'express';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  generarPdfPresupuesto,
  calcularPresupuesto // <-- Importamos la nueva función del controlador
} from '../controllers/presupuestoController.js';

const router = express.Router();

// NUEVA RUTA PARA CÁLCULO/PREVISUALIZACIÓN
router.post('/calcular', calcularPresupuesto);

// RUTAS EXISTENTES
router.get('/', obtenerPresupuestos);
router.get('/:id', obtenerPresupuestoPorId);
router.post('/', crearPresupuesto);
router.put('/:id', actualizarPresupuesto);
router.delete('/:id', eliminarPresupuesto);
router.get('/:id/pdf', generarPdfPresupuesto);

export default router;