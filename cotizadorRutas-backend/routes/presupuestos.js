// ruta: cotizadorRutas-backend/routes/presupuestos.js

import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  generarPdfPresupuesto,
  calcularPresupuesto,
  generarPdfPropuesta 
} from '../controllers/presupuestoController.js';

const router = express.Router();
router.use(checkAuth);

router.post('/calcular', calcularPresupuesto);

// --- RUTAS CRUD (Crear, Leer, Actualizar, Borrar) ---
router.route('/')
  .get(obtenerPresupuestos)
  .post(crearPresupuesto);

router.route('/:id')
  .get(obtenerPresupuestoPorId)
  .put(actualizarPresupuesto)
  .delete(eliminarPresupuesto);

// --- RUTAS PARA GENERACIÓN DE PDFs ---
router.get('/:id/pdf', generarPdfPresupuesto);       // Para el desglose detallado
router.get('/:id/propuesta', generarPdfPropuesta); // Para la propuesta comercial

export default router;