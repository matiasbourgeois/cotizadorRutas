
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      return res.status(401).json({ msg: 'Token no válido' });
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente');
    return res.status(401).json({ msg: error.message });
  }
};
export default checkAuth;