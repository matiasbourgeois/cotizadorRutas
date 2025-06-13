import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/cotizadorRutas-db');
    console.log('MongoDB conectado: localhost');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default conectarDB;
