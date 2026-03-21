// Archivo: cotizadorRutas-backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
  let token;

  // El token JWT generalmente se envía en el header 'Authorization' con el formato "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extraemos el token
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificamos el token con nuestra palabra secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscamos al usuario en la BD con el ID que viene en el token
      //    y adjuntamos el usuario al objeto 'req' (sin la contraseña)
      req.usuario = await User.findById(decoded.id).select('-password');

      // 4. Si todo va bien, pasamos a la siguiente función (el controlador)
      return next();
    } catch (error) {
      return res.status(401).json({ msg: 'Token no válido' });
    }
  }

  // Si no hay token, devolvemos un error
  if (!token) {
    const error = new Error('Token no válido o inexistente');
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;