
import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  crearVehiculo,
  obtenerVehiculos,
  obtenerVehiculoPorId,
  actualizarVehiculo,
  eliminarVehiculo
} from '../controllers/vehiculoController.js';

const router = express.Router();
router.use(checkAuth);

router.post('/', crearVehiculo);
router.get('/', obtenerVehiculos);
router.get('/:id', obtenerVehiculoPorId);
router.put('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;
