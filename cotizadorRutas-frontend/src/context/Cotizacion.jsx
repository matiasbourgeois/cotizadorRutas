// ruta: src/context/Cotizacion.jsx

import React, { createContext, useContext, useState } from "react";

const CotizacionContext = createContext();

export const useCotizacion = () => useContext(CotizacionContext);

export const CotizacionProvider = ({ children }) => {
  // Estados para cada paso del cotizador
  const [puntosEntrega, setPuntosEntrega] = useState(null);
  const [frecuencia, setFrecuencia] = useState(null);
  const [vehiculo, setVehiculo] = useState(null); // Solo guarda el objeto del vehículo seleccionado
  const [recursoHumano, setRecursoHumano] = useState(null); // Solo guarda el objeto del R.H. seleccionado

  // Se eliminan los estados costoVehiculo y costoRecursoHumano.
  // La lógica de getPresupuestoCompleto se va al backend.

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
        detallesCarga,
        setDetallesCarga
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};