import mongoose from 'mongoose';

const rutaSchema = new mongoose.Schema({
  puntos: [
    {
      nombre: String,
      lat: Number,
      lng: Number,
      orden: Number
    }
  ],
  distanciaKm: Number,
  duracionMin: Number,
  fecha_creacion: { type: Date, default: Date.now },
  estado: { type: String, default: 'borrador' } // borrador | completa
});

const Ruta = mongoose.model('Ruta', rutaSchema);
export default Ruta;
