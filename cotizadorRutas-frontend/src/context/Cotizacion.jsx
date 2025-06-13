import React, { createContext, useContext, useState } from "react";

// 1. Crear el contexto
const CotizacionContext = createContext();

// 2. Hook para usar el contexto
export const useCotizacion = () => useContext(CotizacionContext);

// 3. Componente proveedor
export const CotizacionProvider = ({ children }) => {
  // Paso 1 - Puntos de Entrega
  const [puntosEntrega, setPuntosEntrega] = useState([]);

  // Paso 2 - Frecuencia
  const [frecuencia, setFrecuencia] = useState({
    diasSemana: [],
    tipoFrecuencia: "",
    entregasMensuales: 0,
  });

  // Paso 3 - Vehículo
  const [vehiculo, setVehiculo] = useState(null);

  // 🆕 Resultado de calcularCostoVehiculo
  const [costoVehiculo, setCostoVehiculo] = useState(null);

  // Paso 4 - Recurso Humano
  const [recursoHumano, setRecursoHumano] = useState(null);
  const [costoRecursoHumano, setCostoRecursoHumano] = useState(null);


  // Paso 5 - Configuración Final
  const [configuracion, setConfiguracion] = useState({
    peajes: 0,
    gananciaPorcentaje: 25,
    costoAdministrativo: 10,
    incluirResumen: false,
  });

  // Presupuesto final combinando todo
  const getPresupuestoCompleto = () => ({
    puntosEntrega,
    frecuencia,
    vehiculo,
    costoVehiculo, // ✅ lo incluimos en el resultado final
    recursoHumano,
    configuracion,
  });

  return (
    <CotizacionContext.Provider
      value={{
        puntosEntrega,
        setPuntosEntrega,

        frecuencia,
        setFrecuencia,

        vehiculo,
        setVehiculo,

        costoVehiculo,
        setCostoVehiculo, // ✅ lo exponemos

        recursoHumano,
        setRecursoHumano,
        costoRecursoHumano,
        setCostoRecursoHumano,


        configuracion,
        setConfiguracion,

        getPresupuestoCompleto,
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};
