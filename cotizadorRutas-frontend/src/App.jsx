// Archivo: cotizadorRutas-frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";

// Providers y Layouts
import { CotizacionProvider } from "./context/Cotizacion";
import CotizadorLayout from "./layouts/CotizadorLayout";
import RutaProtegida from "./layouts/RutaProtegida";

// Vistas Públicas
import LoginPage from "./pages/auth/LoginPage";

// Vistas Privadas (Pasos del Cotizador)
import PuntosEntregaPaso from "./pages/puntosEntregaPaso/PuntosEntregaPaso";
import FrecuenciaPaso from "./pages/frecuenciaPaso/FrecuenciaPaso";
import VehiculoPaso from "./pages/vehiculoPaso/VehiculoPaso";
import RecursoHumanoPaso from "./pages/recursoHumanoPaso/RecursoHumanoPaso";
import ConfiguracionPresupuestoPaso from "./pages/configuracionPaso/ConfiguracionPresupuestoPaso";
import HistorialPage from "./pages/HistorialPage";

export default function App() {
  return (
    <Routes>
      {/* ---- RUTAS PÚBLICAS ---- */}
      <Route path="/login" element={<LoginPage />} />

      {/* ---- RUTAS PRIVADAS (requieren login) ---- */}
      <Route path="/" element={<RutaProtegida />}>
        <Route path="/historial" element={<HistorialPage />} />

        <Route
          path="/"
          element={
            <CotizacionProvider>
              <CotizadorLayout />
            </CotizacionProvider>
          }
        >
          <Route index element={<PuntosEntregaPaso />} />
          <Route path="cotizador/frecuencia/:idRuta" element={<FrecuenciaPaso />} />
          <Route path="cotizador/vehiculo/:idRuta" element={<VehiculoPaso />} />
          <Route path="cotizador/recurso-humano/:idRuta" element={<RecursoHumanoPaso />} />
          <Route path="cotizador/configuracion-final" element={<ConfiguracionPresupuestoPaso />} />
        </Route>
      </Route>
    </Routes>
  );
}