// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { CotizacionProvider } from "./context/Cotizacion"; // ✅ Ruta correcta

import CotizadorRutas from "./pages/puntosEntregaPaso/PuntosEntregaPaso";
import FrecuenciaPaso from "./pages/frecuenciaPaso/FrecuenciaPaso";
import VehiculoPaso from "./pages/vehiculoPaso/VehiculoPaso";
import RecursoHumanoPaso from "./pages/recursoHumanoPaso/RecursoHumanoPaso";
import ConfiguracionPresupuestoPaso from "./pages/configuracionPaso/ConfiguracionPresupuestoPaso";

export default function App() {
  return (
    <CotizacionProvider> {/* ✅ Envolver toda la app */}
      <Routes>
        {/* Paso 1: Puntos de entrega */}
        <Route path="/" element={<CotizadorRutas />} />

        {/* Paso 2: Frecuencia */}
        <Route path="/cotizador/frecuencia/:idRuta" element={<FrecuenciaPaso />} />

        {/* Paso 3: Vehículo */}
        <Route path="/cotizador/vehiculo/:idRuta" element={<VehiculoPaso />} />

        {/* Paso 4: Recurso Humano */}
        <Route path="/cotizador/recurso-humano/:idRuta" element={<RecursoHumanoPaso />} />

        {/* Paso 5: Configuración final */}
        <Route path="/cotizador/configuracion-final" element={<ConfiguracionPresupuestoPaso />} />
      </Routes>
    </CotizacionProvider>
  );
}
