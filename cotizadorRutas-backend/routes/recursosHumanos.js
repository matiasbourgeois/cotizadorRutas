import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import {
  crearRecursoHumano,
  obtenerRecursosHumanos,
  obtenerRecursoHumanoPorId,
  actualizarRecursoHumano,
  eliminarRecursoHumano
} from "../controllers/recursoHumanoController.js";

const router = express.Router();
router.use(checkAuth);

// Crear nuevo
router.post("/", crearRecursoHumano);

// Obtener todos
router.get("/", obtenerRecursosHumanos);

// Obtener uno por ID
router.get("/:id", obtenerRecursoHumanoPorId);

// Actualizar por ID
router.put("/:id", actualizarRecursoHumano);

// Eliminar por ID
router.delete("/:id", eliminarRecursoHumano);

export default router;
