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
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    trim: true,
  },
  proveedor: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  verificado: {
    type: Boolean,
    default: false,
  },
  tokenVerificacion: {
    type: String,
  },
  tokenVerificacionExpira: {
    type: Date,
  },
  intentosFallidos: {
    type: Number,
    default: 0,
  },
  bloqueadoHasta: {
    type: Date,
  },
  tokenRecuperacion: {
    type: String,
  },
  tokenRecuperacionExpira: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Pre-save: hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparar contraseña del formulario con la hasheada
userSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;