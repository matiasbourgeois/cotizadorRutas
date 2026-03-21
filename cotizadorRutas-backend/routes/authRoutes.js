import express from 'express';
import { autenticar, registrar, verificarEmail, reenviarVerificacion } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', autenticar);
router.post('/registro', registrar);
router.get('/verificar/:token', verificarEmail);
router.post('/reenviar-verificacion', reenviarVerificacion);

export default router;