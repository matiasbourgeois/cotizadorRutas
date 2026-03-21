// Archivo: cotizadorRutas-backend/crearUsuario.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import User from './models/User.js';

// Carga las variables de entorno
dotenv.config();

// --- CONFIGURA AQUÍ LOS DATOS DEL NUEVO USUARIO ---
const nuevoUsuario = {
  nombre: 'test test',
  email: 'test@test.com',
  password: 'test', // Escribe aquí la contraseña en texto plano
};
// -------------------------------------------------

const crearNuevoUsuario = async () => {
  try {
    // Conectamos a la base de datos
    await conectarDB();

    // Verificamos si el email ya existe
    const existeUsuario = await User.findOne({ email: nuevoUsuario.email });
    if (existeUsuario) {
      console.log(`❌ El usuario con el email '${nuevoUsuario.email}' ya existe.`);
      process.exit(1); // Salimos del script si ya existe
    }

    // Creamos el usuario en memoria
    const usuario = new User(nuevoUsuario);
    // Lo guardamos en la base de datos (aquí se ejecutará el pre-save para hashear el password)
    await usuario.save();

    console.log('✅ ¡Usuario creado exitosamente!');
    console.log('Nombre:', nuevoUsuario.nombre);
    console.log('Email:', nuevoUsuario.email);

  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
  } finally {
    // Cerramos la conexión a la base de datos
    await mongoose.connection.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
};

// Ejecutamos la función
crearNuevoUsuario();