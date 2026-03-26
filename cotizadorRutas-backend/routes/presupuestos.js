import express from 'express';
import rateLimit from 'express-rate-limit';
import checkAuth from '../middleware/authMiddleware.js';
import {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
  calcularPresupuesto,
  obtenerPresupuestoPublico,
  obtenerDesglosePublico,
} from '../controllers/presupuestoController.js';

const router = express.Router();

// Rate limiter para rutas públicas
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.' }
});

// Ruta PÚBLICA — sin autenticación (para compartir propuestas)
router.get('/public/:id', publicLimiter, obtenerPresupuestoPublico);
router.get('/public-desglose/:id', publicLimiter, obtenerDesglosePublico);

router.use(checkAuth);

router.post('/calcular', calcularPresupuesto);

// --- RUTAS CRUD (Crear, Leer, Actualizar, Borrar) ---
router.route('/')
  .get(obtenerPresupuestos)
  .post(crearPresupuesto);

router.route('/:id')
  .get(obtenerPresupuestoPorId)
  .put(actualizarPresupuesto)
  .delete(eliminarPresupuesto);

export default router;