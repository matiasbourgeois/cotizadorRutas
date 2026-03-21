// Archivo: cotizadorRutas-backend/controllers/authController.js

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
  // El token se "firma" con una palabra secreta. Esta debe estar en tus variables de entorno.
  // El token expirará en 30 días.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Dentro de authController.js

export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Comprobar si el usuario existe
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: 'El usuario no existe' });
    }

    // 2. Comprobar si la contraseña es correcta
    const passwordCorrecto = await usuario.comprobarPassword(password);
    if (passwordCorrecto) {
      // 3. Si todo es correcto, generamos y devolvemos el token
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id),
      });
    } else {
      return res.status(403).json({ msg: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};