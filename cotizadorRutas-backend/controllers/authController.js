import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { enviarEmailVerificacion, enviarEmailRecuperacion } from '../services/emailService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generarJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const MINUTOS_BLOQUEO = 15;
const MAX_INTENTOS = 5;

export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });

    // Mensaje genérico para no revelar si el email existe o no
    if (!usuario) {
      return res.status(401).json({ msg: 'Email o contraseña incorrectos' });
    }

    // Verificar si la cuenta está bloqueada
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > Date.now()) {
      const minutosRestantes = Math.ceil((usuario.bloqueadoHasta - Date.now()) / 60000);
      return res.status(423).json({
        msg: `Cuenta bloqueada temporalmente. Intentá de nuevo en ${minutosRestantes} minuto(s).`,
      });
    }

    // Verificar si el email fue validado
    if (!usuario.verificado) {
      return res.status(403).json({
        msg: 'Tu cuenta aún no fue verificada. Revisá tu email.',
        noVerificado: true,
      });
    }

    const passwordCorrecto = await usuario.comprobarPassword(password);

    if (!passwordCorrecto) {
      // Incrementar intentos fallidos
      usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;

      if (usuario.intentosFallidos >= MAX_INTENTOS) {
        usuario.bloqueadoHasta = new Date(Date.now() + MINUTOS_BLOQUEO * 60 * 1000);
        await usuario.save();
        return res.status(423).json({
          msg: `Cuenta bloqueada por ${MINUTOS_BLOQUEO} minutos por exceder los intentos permitidos.`,
        });
      }

      await usuario.save();
      return res.status(401).json({ msg: 'Email o contraseña incorrectos' });
    }

    // Login exitoso: resetear intentos
    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    await usuario.save();

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    res.status(500).json({ msg: 'Hubo un error en el servidor' });
  }
};

export const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Validar campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    // Validar política de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      });
    }

    // Verificar email duplicado
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(409).json({ msg: 'Este email ya está registrado' });
    }

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const tokenVerificacionExpira = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Crear usuario
    const usuario = new User({
      nombre,
      email,
      password,
      verificado: false,
      tokenVerificacion,
      tokenVerificacionExpira,
    });
    await usuario.save();

    // Enviar email de verificación
    await enviarEmailVerificacion(email, nombre, tokenVerificacion);

    res.status(201).json({
      msg: 'Cuenta creada exitosamente. Revisá tu email para verificar tu cuenta.',
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ msg: 'Hubo un error al crear la cuenta' });
  }
};

export const verificarEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const usuario = await User.findOne({
      tokenVerificacion: token,
      tokenVerificacionExpira: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({
        msg: 'El enlace de verificación es inválido o ha expirado.',
        expirado: true,
      });
    }

    usuario.verificado = true;
    usuario.tokenVerificacion = undefined;
    usuario.tokenVerificacionExpira = undefined;
    await usuario.save();

    res.json({ msg: 'Cuenta verificada exitosamente. Ya podés iniciar sesión.' });
  } catch (error) {
    console.error('Error al verificar email:', error.message);
    res.status(500).json({ msg: 'Error al verificar la cuenta' });
  }
};

export const reenviarVerificacion = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });

    if (!usuario) {
      // No revelamos si el email existe o no
      return res.json({ msg: 'Si el email está registrado, recibirás un nuevo enlace de verificación.' });
    }

    if (usuario.verificado) {
      return res.status(400).json({ msg: 'Esta cuenta ya está verificada' });
    }

    // Generar nuevo token
    usuario.tokenVerificacion = crypto.randomBytes(32).toString('hex');
    usuario.tokenVerificacionExpira = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await usuario.save();

    await enviarEmailVerificacion(usuario.email, usuario.nombre, usuario.tokenVerificacion);

    res.json({ msg: 'Si el email está registrado, recibirás un nuevo enlace de verificación.' });
  } catch (error) {
    console.error('Error al reenviar verificación:', error.message);
    res.status(500).json({ msg: 'Error al reenviar el email' });
  }
};

export const olvidarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });

    // Respuesta genérica para no revelar si el email existe
    if (!usuario) {
      return res.json({ msg: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' });
    }

    // Generar token de recuperación (válido 1 hora)
    const tokenRecuperacion = crypto.randomBytes(32).toString('hex');
    usuario.tokenRecuperacion = tokenRecuperacion;
    usuario.tokenRecuperacionExpira = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await usuario.save();

    await enviarEmailRecuperacion(usuario.email, usuario.nombre, tokenRecuperacion);

    res.json({ msg: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' });
  } catch (error) {
    console.error('Error al procesar olvido de contraseña:', error.message);
    res.status(500).json({ msg: 'Hubo un error al procesar la solicitud' });
  }
};

export const recuperarPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Validar política de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      });
    }

    const usuario = await User.findOne({
      tokenRecuperacion: token,
      tokenRecuperacionExpira: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({
        msg: 'El enlace de recuperación es inválido o ha expirado.',
        expirado: true,
      });
    }

    // Actualizar contraseña (el pre-save hashea automáticamente)
    usuario.password = password;
    usuario.tokenRecuperacion = undefined;
    usuario.tokenRecuperacionExpira = undefined;
    // Resetear intentos fallidos y bloqueo al cambiar contraseña
    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    await usuario.save();

    res.json({ msg: 'Contraseña actualizada correctamente. Ya podés iniciar sesión.' });
  } catch (error) {
    console.error('Error al recuperar contraseña:', error.message);
    res.status(500).json({ msg: 'Error al restablecer la contraseña' });
  }
};

export const authGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verificar el token de Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Buscar si el usuario ya existe
    let usuario = await User.findOne({ email });

    if (usuario) {
      // Si existe pero se registró con contraseña local
      if (usuario.proveedor === 'local') {
        return res.status(409).json({
          msg: 'Este email ya está registrado con contraseña. Iniciá sesión con tu email y contraseña.',
        });
      }

      // Usuario Google existente → login directo
      return res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id),
      });
    }

    // Usuario nuevo → crear cuenta con Google
    usuario = new User({
      nombre: name,
      email,
      proveedor: 'google',
      verificado: true, // Google ya verificó el email
    });
    await usuario.save();

    res.status(201).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } catch (error) {
    console.error('Error en autenticación con Google:', error.message);
    res.status(401).json({ msg: 'No se pudo verificar la cuenta de Google' });
  }
};