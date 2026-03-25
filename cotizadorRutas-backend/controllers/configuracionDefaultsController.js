import ConfiguracionDefaults, {
  DEFAULTS_VEHICULO,
  DEFAULTS_RRHH,
  DEFAULTS_CALCULOS,
} from '../models/ConfiguracionDefaults.js';

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
        contratado: { ...DEFAULTS_RRHH.contratado, ...oldData, porcentajeCargasSociales: 0, adicionalActividadPorc: 0, adicionalNoRemunerativoFijo: 0, sueldoBasico: 600000 },
      };
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
