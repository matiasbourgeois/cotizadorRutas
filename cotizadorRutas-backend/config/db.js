import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost/cotizadorRutas-db';
    await mongoose.connect(uri);
    console.log('MongoDB conectado:', uri);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default conectarDB;
