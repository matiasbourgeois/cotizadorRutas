// Archivo: src/context/Cotizacion.jsx (Versión Final Definitiva)

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

  // Las funciones para actualizar el estado no cambian
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

  return (
    <CotizacionContext.Provider
      // ✅ --- LA SOLUCIÓN DEFINITIVA ESTÁ AQUÍ --- ✅
      // En lugar de anidar el estado dentro de un objeto { cotizacion: cotizacion },
      // ahora "esparcimos" todas las propiedades del estado directamente en el 'value'.
      // Esto permite que los demás componentes accedan a 'vehiculo', 'frecuencia', etc.
      // de la forma en que lo están intentando hacer.
      value={{
        ...cotizacion, // <-- Esta línea es la clave del arreglo.

        // Y también pasamos todas las funciones para modificar el estado.
        setPuntosEntrega,
        setFrecuencia,
        setVehiculo,
        setRecursoHumano,
        setDetallesCarga,
        setDirectionsResult,
        setResumenCostos,
        setDetalleVehiculo, 
        setDetalleRecurso,
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};