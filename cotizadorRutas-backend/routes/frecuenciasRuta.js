import express from "express";
import checkAuth from '../middleware/authMiddleware.js';
import {
  crearFrecuenciaRuta,
  obtenerFrecuenciasRuta,
  obtenerFrecuenciaRutaPorId,
  eliminarFrecuenciaRuta
} from "../controllers/frecuenciaRutaController.js";

const router = express.Router();
router.use(checkAuth);

// Crear una nueva frecuencia
router.post("/", crearFrecuenciaRuta);

// Obtener todas las frecuencias
router.get("/", obtenerFrecuenciasRuta);

// Obtener una frecuencia por ID
router.get("/:id", obtenerFrecuenciaRutaPorId);

// Eliminar una frecuencia por ID
router.delete("/:id", eliminarFrecuenciaRuta);

export default router;
