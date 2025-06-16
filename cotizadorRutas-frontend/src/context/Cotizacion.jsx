// ruta: src/context/Cotizacion.jsx

import React, { createContext, useContext, useState } from "react";

const CotizacionContext = createContext();

export const useCotizacion = () => useContext(CotizacionContext);

export const CotizacionProvider = ({ children }) => {
  // Estados para cada paso del cotizador
  const [puntosEntrega, setPuntosEntrega] = useState(null);
  const [frecuencia, setFrecuencia] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [recursoHumano, setRecursoHumano] = useState(null);
  
  // ✅ LÍNEA FALTANTE AÑADIDA
  // Aquí declaramos el estado para los detalles de la carga.
  const [detallesCarga, setDetallesCarga] = useState({ tipo: 'general', pesoKg: 0, valorDeclarado: 0 });


  return (
    <CotizacionContext.Provider
      value={{
        puntosEntrega,
        setPuntosEntrega,
        frecuencia,
        setFrecuencia,
        vehiculo,
        setVehiculo,
        recursoHumano,
        setRecursoHumano,
        // Ahora estas variables sí existen y pueden ser pasadas en el contexto
        detallesCarga,
        setDetallesCarga
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};