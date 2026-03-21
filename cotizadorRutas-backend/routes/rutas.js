import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import {
  crearRuta,
  obtenerRutas
} from '../controllers/rutaController.js';

const router = express.Router();
router.use(checkAuth);

router.post('/', crearRuta);
router.get('/', obtenerRutas);

export default router;
