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

    // Merge parcial RRHH
    if (recursosHumanos) {
      for (const [campo, valor] of Object.entries(recursosHumanos)) {
        updateData[`recursosHumanos.${campo}`] = valor;
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
          recursosHumanos: { ...DEFAULTS_RRHH },
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
export const obtenerDefaultsRRHH = async (usuarioId) => {
  try {
    const config = await ConfiguracionDefaults.findOne({ usuario: usuarioId });
    if (config?.recursosHumanos) {
      return config.recursosHumanos.toObject();
    }
  } catch (e) {
    console.error('Error leyendo defaults de RRHH:', e);
  }
  return { ...DEFAULTS_RRHH };
};
