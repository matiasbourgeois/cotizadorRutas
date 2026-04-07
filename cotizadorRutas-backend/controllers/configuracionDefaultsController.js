import ConfiguracionDefaults, {
  DEFAULTS_VEHICULO,
  DEFAULTS_RRHH,
  DEFAULTS_CALCULOS,
  DEFAULTS_EMPRESA,
} from '../models/ConfiguracionDefaults.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'logos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${req.usuario._id}${ext}`);
  },
});

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Formato de imagen no soportado'));
  },
});

/**
 * GET /api/configuracion-defaults
 * Devuelve la config del usuario. Si no existe, la crea con defaults.
 */
export const obtenerConfiguracion = async (req, res) => {
  try {
    let config = await ConfiguracionDefaults.findOne({ usuario: req.usuario._id });

    if (!config) {
      config = new ConfiguracionDefaults({ usuario: req.usuario._id });
      await config.save();
    }

    // Auto-migrate flat recursosHumanos → nested (empleado/contratado)
    if (config.recursosHumanos && config.recursosHumanos.sueldoBasico != null && !config.recursosHumanos.empleado) {
      const oldData = config.recursosHumanos.toObject ? config.recursosHumanos.toObject() : { ...config.recursosHumanos };
      delete oldData._id;
      config.recursosHumanos = {
        empleado: { ...oldData },
        contratado: { factorSobreEmpleado: 75 },
      };
      await config.save();
    }

    // Auto-migrate legacy contratados sin factorSobreEmpleado
    if (config.recursosHumanos?.contratado && !config.recursosHumanos.contratado.factorSobreEmpleado) {
      config.recursosHumanos.contratado = { factorSobreEmpleado: 75 };
      await config.save();
    }

    res.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener la configuración', detalle: error.message });
  }
};

/**
 * PUT /api/configuracion-defaults
 * Actualiza parcial o totalmente la config del usuario.
 */
export const actualizarConfiguracion = async (req, res) => {
  try {
    const { vehiculos, recursosHumanos, calculos } = req.body;
    const updateData = {};

    // Merge parcial por tipo de vehículo
    if (vehiculos) {
      for (const tipo of ['utilitario', 'mediano', 'grande', 'camion']) {
        if (vehiculos[tipo]) {
          for (const [campo, valor] of Object.entries(vehiculos[tipo])) {
            updateData[`vehiculos.${tipo}.${campo}`] = valor;
          }
        }
      }
    }

    // Merge parcial RRHH — now per type (empleado/contratado)
    if (recursosHumanos) {
      for (const tipo of ['empleado', 'contratado']) {
        if (recursosHumanos[tipo]) {
          for (const [campo, valor] of Object.entries(recursosHumanos[tipo])) {
            updateData[`recursosHumanos.${tipo}.${campo}`] = valor;
          }
        }
      }
    }

    // Merge parcial cálculos
    if (calculos) {
      for (const [campo, valor] of Object.entries(calculos)) {
        updateData[`calculos.${campo}`] = valor;
      }
    }

    // Merge parcial empresa
    const empresa = req.body.empresa;
    if (empresa) {
      for (const [campo, valor] of Object.entries(empresa)) {
        updateData[`empresa.${campo}`] = valor;
      }
    }

    const config = await ConfiguracionDefaults.findOneAndUpdate(
      { usuario: req.usuario._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar la configuración', detalle: error.message });
  }
};

/**
 * POST /api/configuracion-defaults/reset
 * Resetea a los valores originales hardcodeados.
 */
export const resetearConfiguracion = async (req, res) => {
  try {
    const config = await ConfiguracionDefaults.findOneAndUpdate(
      { usuario: req.usuario._id },
      {
        $set: {
          vehiculos: {
            utilitario: { ...DEFAULTS_VEHICULO.utilitario },
            mediano: { ...DEFAULTS_VEHICULO.mediano },
            grande: { ...DEFAULTS_VEHICULO.grande },
            camion: { ...DEFAULTS_VEHICULO.camion },
          },
          recursosHumanos: {
            empleado: { ...DEFAULTS_RRHH.empleado },
            contratado: { ...DEFAULTS_RRHH.contratado },
          },
          calculos: { ...DEFAULTS_CALCULOS },
          empresa: { ...DEFAULTS_EMPRESA },
        },
      },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (error) {
    console.error('Error al resetear configuración:', error);
    res.status(500).json({ error: 'Error al resetear la configuración', detalle: error.message });
  }
};

/**
 * Helper: Obtiene los defaults de vehículo por tipo para un usuario.
 * Usado internamente por vehiculoController.
 */
export const obtenerDefaultsVehiculoPorTipo = async (usuarioId, tipo) => {
  try {
    const config = await ConfiguracionDefaults.findOne({ usuario: usuarioId });
    if (config?.vehiculos?.[tipo]) {
      return config.vehiculos[tipo].toObject();
    }
  } catch (e) {
    console.error('Error leyendo defaults de vehículo:', e);
  }
  // Fallback a hardcoded
  return DEFAULTS_VEHICULO[tipo] || DEFAULTS_VEHICULO.camion;
};

/**
 * Helper: Obtiene los defaults de RRHH para un usuario.
 * Usado internamente por recursoHumanoController.
 */
export const obtenerDefaultsRRHH = async (usuarioId, tipo = 'empleado') => {
  try {
    const config = await ConfiguracionDefaults.findOne({ usuario: usuarioId });
    if (config?.recursosHumanos?.[tipo]) {
      return config.recursosHumanos[tipo].toObject();
    }
  } catch (e) {
    console.error('Error leyendo defaults de RRHH:', e);
  }
  return { ...(DEFAULTS_RRHH[tipo] || DEFAULTS_RRHH.empleado) };
};

/**
 * Helper: Obtiene las constantes de cálculo del usuario.
 * Usado por presupuestoController para pasarlas a los motores.
 */
export const obtenerConstantesCalculo = async (usuarioId) => {
  try {
    const config = await ConfiguracionDefaults.findOne({ usuario: usuarioId });
    if (config?.calculos) {
      return config.calculos.toObject();
    }
  } catch (e) {
    console.error('Error leyendo constantes de cálculo:', e);
  }
  return { ...DEFAULTS_CALCULOS };
};

/**
 * Helper: Obtiene los datos de empresa del usuario.
 * Usado por los PDFs (PropuestaPage, DesglosePage).
 */
export const obtenerDatosEmpresa = async (usuarioId) => {
  try {
    const config = await ConfiguracionDefaults.findOne({ usuario: usuarioId });
    if (config?.empresa) {
      return config.empresa.toObject();
    }
  } catch (e) {
    console.error('Error leyendo datos de empresa:', e);
  }
  return { ...DEFAULTS_EMPRESA };
};

/**
 * POST /api/configuracion-defaults/logo
 * Sube una imagen de logo para la empresa del usuario.
 */
export const subirLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    await ConfiguracionDefaults.findOneAndUpdate(
      { usuario: req.usuario._id },
      { $set: { 'empresa.logoUrl': logoUrl } },
      { upsert: true }
    );

    res.json({ logoUrl });
  } catch (error) {
    console.error('Error al subir logo:', error);
    res.status(500).json({ error: 'Error al subir el logo', detalle: error.message });
  }
};
