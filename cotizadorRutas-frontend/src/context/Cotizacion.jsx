// Archivo: src/context/Cotizacion.jsx (Con la nueva función de reseteo)

import React, { createContext, useContext, useState } from "react";

const CotizacionContext = createContext();

export const useCotizacion = () => useContext(CotizacionContext);

const initialState = {
  puntosEntrega: null,
  directionsResult: null,
  frecuencia: null,
  vehiculo: null,
  recursoHumano: null,
  detallesCarga: { tipo: 'general', pesoKg: 0, valorDeclarado: 0 },
  resumenCostos: null,
  detalleVehiculo: null,
  detalleRecurso: null,
};

export const CotizacionProvider = ({ children }) => {
  const [cotizacion, setCotizacion] = useState(initialState);

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
  const setDirectionsResult = (directions) => {
    setCotizacion(prev => ({ ...prev, directionsResult: directions }));
  };
  const setResumenCostos = (resumen) => {
    setCotizacion(prev => ({ ...prev, resumenCostos: resumen }));
  };
  const setDetalleVehiculo = (detalle) => {
    setCotizacion(prev => ({ ...prev, detalleVehiculo: detalle }));
  };
  const setDetalleRecurso = (detalle) => {
    setCotizacion(prev => ({ ...prev, detalleRecurso: detalle }));
  };

  // ✅ NUEVA FUNCIÓN PARA REINICIAR LA COTIZACIÓN
  const resetCotizacion = () => {
    setCotizacion(initialState);
  };

  return (
    <CotizacionContext.Provider
      value={{
        ...cotizacion,

        setPuntosEntrega,
        setFrecuencia,
        setVehiculo,
        setRecursoHumano,
        setDetallesCarga,
        setDirectionsResult,
        setResumenCostos,
        setDetalleVehiculo, 
        setDetalleRecurso,
        resetCotizacion, // <-- ✅ Exportamos la nueva función
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};