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

dotenv.config();
conectarDB();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Lista de dominios permitidos
const whitelist = [
  'https://cotizadorlogistico.site',
  'https://www.cotizadorlogistico.site',
  'http://localhost:5174' // <-- AÑADIMOS ESTA LÍNEA
];


const corsOptions = {
  origin: function (origin, callback) {
    // Permitimos la conexión si el origen está en nuestra lista blanca
    // o si no hay origen (como en las pruebas de servidor a servidor o Postman)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

// Usamos cors con las opciones configuradas
app.use(cors(corsOptions));
// ----------------------------

app.use(express.json());

// Rutas API
app.use("/api/rutas", rutasRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/vehiculos", vehiculosRoutes); 
app.use("/api/recursos-humanos", recursosHumanosRoutes);
app.use("/api/frecuencias-ruta", frecuenciasRutaRoutes);

app.get("/", (req, res) => {
  res.send("API Cotizador Rutas funcionando ✅");
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
