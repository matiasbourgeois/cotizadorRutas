import express from 'express';
import { autenticar, registrar, verificarEmail, reenviarVerificacion, olvidarPassword, recuperarPassword, authGoogle } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', autenticar);
router.post('/registro', registrar);
router.post('/google', authGoogle);
router.get('/verificar/:token', verificarEmail);
router.post('/reenviar-verificacion', reenviarVerificacion);
router.post('/olvide-password', olvidarPassword);
router.post('/recuperar-password/:token', recuperarPassword);

export default router;