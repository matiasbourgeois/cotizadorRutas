import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  resetearConfiguracion,
} from '../controllers/configuracionDefaultsController.js';

const router = express.Router();

router.get('/', checkAuth, obtenerConfiguracion);
router.put('/', checkAuth, actualizarConfiguracion);
router.post('/reset', checkAuth, resetearConfiguracion);

export default router;
