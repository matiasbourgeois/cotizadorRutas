import express from 'express';
import {
  crearRuta,
  obtenerRutas
} from '../controllers/rutaController.js';

const router = express.Router();

router.post('/', crearRuta);
router.get('/', obtenerRutas);

export default router;
