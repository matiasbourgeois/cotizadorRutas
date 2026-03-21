// Archivo: cotizadorRutas-backend/routes/authRoutes.js

import express from 'express';
import { autenticar } from '../controllers/authController.js';

const router = express.Router();

// Ruta para el login de usuarios
router.post('/login', autenticar);


export default router;