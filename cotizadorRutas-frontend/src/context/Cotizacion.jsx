// Archivo: cotizadorRutas-frontend/src/context/Cotizacion.jsx (Versión Robusta)

import React, { createContext, useContext, useState } from "react";

const CotizacionContext = createContext();

export const useCotizacion = () => useContext(CotizacionContext);

// Definimos un estado inicial claro para todo el cotizador
const initialState = {
  puntosEntrega: null,
  frecuencia: null,
  vehiculo: null,
  recursoHumano: null,
  detallesCarga: { tipo: 'general', pesoKg: 0, valorDeclarado: 0 },
};

export const CotizacionProvider = ({ children }) => {
  // ¿Por qué este cambio?
  // 1.  Ahora tenemos un único estado 'cotizacion' que contiene todo.
  // 2.  Este estado siempre empieza con una estructura definida (initialState),
  //     por lo que 'cotizacion.puntosEntrega' nunca será indefinido, será 'null' al principio.
  const [cotizacion, setCotizacion] = useState(initialState);

  // Creamos funciones específicas para modificar cada parte del estado
  const setPuntosEntrega = (puntos) => {
    setCotizacion(prev => ({ ...prev, puntosEntrega: puntos }));
  };

  const setFrecuencia = (frecuencia) => {
    setCotizacion(prev => ({ ...prev, frecuencia: frecuencia }));
  };

  const setVehiculo = (vehiculo) => {
    setCotizacion(prev => ({ ...prev, vehiculo: vehiculo }));
  };

  const setRecursoHumano = (recursoHumano) => {
    setCotizacion(prev => ({ ...prev, recursoHumano: recursoHumano }));
  };
  
  const setDetallesCarga = (detalles) => {
    setCotizacion(prev => ({ ...prev, detallesCarga: detalles }));
  };

  return (
    <CotizacionContext.Provider
      value={{
        // Pasamos el objeto completo de la cotización
        cotizacion,
        // Y pasamos las funciones para modificarlo
        setPuntosEntrega,
        setFrecuencia,
        setVehiculo,
        setRecursoHumano,
        setDetallesCarga,
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};