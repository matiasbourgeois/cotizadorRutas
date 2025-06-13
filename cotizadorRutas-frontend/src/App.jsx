import { Routes, Route } from "react-router-dom";
import { CotizacionProvider } from "./context/Cotizacion";

// Layout
import CotizadorLayout from "./layouts/CotizadorLayout";

// Pasos
import PuntosEntregaPaso from "./pages/puntosEntregaPaso/PuntosEntregaPaso";
import FrecuenciaPaso from "./pages/frecuenciaPaso/FrecuenciaPaso";
import VehiculoPaso from "./pages/vehiculoPaso/VehiculoPaso";
import RecursoHumanoPaso from "./pages/recursoHumanoPaso/RecursoHumanoPaso";
import ConfiguracionPresupuestoPaso from "./pages/configuracionPaso/ConfiguracionPresupuestoPaso";

export default function App() {
  return (
    <CotizacionProvider>
      <Routes>
        {/* Envolvemos todas las rutas del cotizador con el nuevo layout */}
        <Route element={<CotizadorLayout />}>
          <Route path="/" element={<PuntosEntregaPaso />} />
          <Route path="/cotizador/frecuencia/:idRuta" element={<FrecuenciaPaso />} />
          <Route path="/cotizador/vehiculo/:idRuta" element={<VehiculoPaso />} />
          <Route path="/cotizador/recurso-humano/:idRuta" element={<RecursoHumanoPaso />} />
          <Route path="/cotizador/configuracion-final" element={<ConfiguracionPresupuestoPaso />} />
        </Route>
      </Routes>
    </CotizacionProvider>
  );
}