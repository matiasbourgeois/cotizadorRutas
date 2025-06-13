import express from 'express';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
} from '../controllers/presupuestoController.js';

const router = express.Router();

router.get('/', obtenerPresupuestos);
router.get('/:id', obtenerPresupuestoPorId);
router.post('/', crearPresupuesto);
router.put('/:id', actualizarPresupuesto);
router.delete('/:id', eliminarPresupuesto);

export default router;
