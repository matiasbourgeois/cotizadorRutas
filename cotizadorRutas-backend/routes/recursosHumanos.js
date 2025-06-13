import express from "express";
import {
  crearRecursoHumano,
  obtenerRecursosHumanos,
  obtenerRecursoHumanoPorId,
  actualizarRecursoHumano,
  eliminarRecursoHumano
} from "../controllers/recursoHumanoController.js";

const router = express.Router();

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
