// ruta: cotizadorRutas-backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

// Rutas
import presupuestoRoutes from "./routes/presupuestos.js";
import rutasRoutes from "./routes/rutas.js";
import vehiculosRoutes from "./routes/vehiculos.js"; 
import recursosHumanosRoutes from "./routes/recursosHumanos.js";  
import frecuenciasRutaRoutes from "./routes/frecuenciasRuta.js";
// La siguiente línea se elimina porque el archivo de ruta ya no existe
// import configuracionPresupuestoRoutes from "./routes/configuracionPresupuesto.js";

dotenv.config();
conectarDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/rutas", rutasRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/vehiculos", vehiculosRoutes); 
app.use("/api/recursos-humanos", recursosHumanosRoutes);
app.use("/api/frecuencias-ruta", frecuenciasRutaRoutes);
// La siguiente línea se elimina porque el archivo de ruta ya no existe
// app.use("/api/configuracion-presupuesto", configuracionPresupuestoRoutes);

app.get("/", (req, res) => {
  res.send("API Cotizador Rutas funcionando ✅");
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});