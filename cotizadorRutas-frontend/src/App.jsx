// Archivo: cotizadorRutas-frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";

// Providers y Layouts
import { CotizacionProvider } from "./context/Cotizacion";
import CotizadorLayout from "./layouts/CotizadorLayout";
import RutaProtegida from "./layouts/RutaProtegida";

// Vistas Públicas
import LoginPage from "./pages/auth/LoginPage";

// --- CAMBIO CLAVE: Importamos el componente real ---
import PuntosEntregaPaso from "./pages/puntosEntregaPaso/PuntosEntregaPaso";
import FrecuenciaPaso from "./pages/frecuenciaPaso/FrecuenciaPaso";
import VehiculoPaso from "./pages/vehiculoPaso/VehiculoPaso";
import RecursoHumanoPaso from "./pages/recursoHumanoPaso/RecursoHumanoPaso";
import ConfiguracionPresupuestoPaso from "./pages/configuracionPaso/ConfiguracionPresupuestoPaso";
import HistorialPage from "./pages/HistorialPage";
import PropuestaPage from "./pages/propuestaPage/PropuestaPage";
import DesglosePage from "./pages/desglosePage/DesglosePage"; 

export default function App() {
  return (
    <Routes>
      {/* ---- RUTAS PÚBLICAS ---- */}
      <Route path="/login" element={<LoginPage />} />

      {/* ---- RUTAS PRIVADAS (requieren login) ---- */}
      <Route path="/" element={<RutaProtegida />}>
        <Route path="/historial" element={<HistorialPage />} />

        {/* La ruta ahora apunta a nuestro componente real */}
        <Route path="/propuesta/:id" element={<PropuestaPage />} />
        <Route path="/desglose/:id" element={<DesglosePage />} />

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