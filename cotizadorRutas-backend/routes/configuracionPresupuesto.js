import express from "express";
import {
  crearConfiguracionPresupuesto,
  obtenerConfiguracionPorRuta,
  actualizarConfiguracionPresupuesto,
} from "../controllers/configuracionPresupuestoController.js";

const router = express.Router();

router.post("/", crearConfiguracionPresupuesto);
router.get("/:idRuta", obtenerConfiguracionPorRuta);
router.put("/:idRuta", actualizarConfiguracionPresupuesto);

export default router;
