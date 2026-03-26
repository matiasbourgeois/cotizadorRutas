import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  resetearConfiguracion,
  subirLogo,
  uploadLogo,
} from '../controllers/configuracionDefaultsController.js';

const router = express.Router();

router.get('/', checkAuth, obtenerConfiguracion);
router.put('/', checkAuth, actualizarConfiguracion);
router.post('/reset', checkAuth, resetearConfiguracion);
router.post('/logo', checkAuth, uploadLogo.single('logo'), subirLogo);

export default router;
