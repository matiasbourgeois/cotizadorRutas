// Archivo: cotizadorRutas-backend/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Asegura que no haya dos usuarios con el mismo email
    trim: true,
    lowercase: true, // Guarda el email en minúsculas para consistencia
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // Podríamos añadir más campos a futuro, como 'rol', 'activo', etc.
}, {
  timestamps: true, // Añade 'createdAt' y 'updatedAt' automáticamente
});

// Hook (o middleware) de Mongoose que se ejecuta ANTES de guardar un documento.
// Lo usamos para encriptar la contraseña antes de que se guarde en la base de datos.
userSchema.pre('save', async function (next) {
  // Si la contraseña no ha sido modificada, no hacemos nada y pasamos al siguiente middleware.
  if (!this.isModified('password')) {
    return next();
  }

  // "Salt" es un texto aleatorio que se añade a la contraseña para hacerla más segura.
  const salt = await bcrypt.genSalt(10);
  // "Hash" es el proceso de encriptar la contraseña junto con el "salt".
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Añadimos un método personalizado al schema para comprobar contraseñas.
// Esto nos permitirá verificar el login más adelante.
userSchema.methods.comprobarPassword = async function (passwordFormulario) {
  // Compara la contraseña que envía el usuario en el formulario de login
  // con la contraseña hasheada que está guardada en la base de datos.
  // Devuelve true si coinciden, false si no.
  return await bcrypt.compare(passwordFormulario, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;