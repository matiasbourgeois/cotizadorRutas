import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import { obtenerStatsDashboard } from '../controllers/biController.js';

const router = express.Router();

router.get('/stats', checkAuth, obtenerStatsDashboard);

export default router;
