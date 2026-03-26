import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import conectarDB from "./config/db.js";

// Rutas
import presupuestoRoutes from "./routes/presupuestos.js";
import rutasRoutes from "./routes/rutas.js";
import vehiculosRoutes from "./routes/vehiculos.js"; 
import recursosHumanosRoutes from "./routes/recursosHumanos.js";  
import frecuenciasRutaRoutes from "./routes/frecuenciasRuta.js";
import authRoutes from "./routes/authRoutes.js";
import configuracionDefaultsRoutes from "./routes/configuracionDefaults.js";
import biRoutes from "./routes/biRoutes.js";

dotenv.config();
conectarDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const whitelist = [
  'https://cotizadorlogistico.site',
  'https://www.cotizadorlogistico.site',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:6174',
  'http://localhost:6175'
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

app.use(cors(corsOptions));

app.use(express.json());

// ─── Rate Limiting ───────────────────────────────────────────────────────
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intentá de nuevo en 15 minutos.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión. Esperá 15 minutos.' }
});

// Servir archivos estáticos (logos, uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/test-server", (req, res) => {
  res.send("El servidor principal está funcionando!");
});
// Rutas API
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/vehiculos", vehiculosRoutes); 
app.use("/api/recursos-humanos", recursosHumanosRoutes);
app.use("/api/frecuencias-ruta", frecuenciasRutaRoutes);
app.use("/api/configuracion-defaults", configuracionDefaultsRoutes);
app.use("/api/bi", biRoutes);

app.get("/", (req, res) => {
  res.send("API Cotizador Rutas funcionando");
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
