import mongoose from 'mongoose';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const [nombre, email, password] = process.argv.slice(2);

if (!nombre || !email || !password) {
  console.log('Uso: node crearUsuario.js "Nombre Apellido" "email@ejemplo.com" "contraseña"');
  process.exit(1);
}

const crearNuevoUsuario = async () => {
  try {
    await conectarDB();

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      console.log(`El usuario con el email '${email}' ya existe.`);
      process.exit(1);
    }

    const usuario = new User({ nombre, email, password });
    await usuario.save();

    console.log('Usuario creado exitosamente:', nombre, email);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    await mongoose.connection.close();
  }
};

crearNuevoUsuario();