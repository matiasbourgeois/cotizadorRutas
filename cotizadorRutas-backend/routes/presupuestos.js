
import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  calcularPresupuesto,
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

export default router;