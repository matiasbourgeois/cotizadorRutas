
import { Routes, Route, Navigate } from "react-router-dom";

// Providers y Layouts
import { CotizacionProvider } from "./context/Cotizacion";
import MainLayout from "./layouts/MainLayout";
import CotizadorLayout from "./layouts/CotizadorLayout";
import RutaProtegida from "./layouts/RutaProtegida";

// Vistas Públicas
import LoginPage from "./pages/auth/LoginPage";
import RegistroPage from "./pages/auth/RegistroPage";
import VerificarEmailPage from "./pages/auth/VerificarEmailPage";
import LandingPage from "./pages/LandingPage";

// Pasos del cotizador
import PuntosEntregaPaso from "./pages/puntosEntregaPaso/PuntosEntregaPaso";
import FrecuenciaPaso from "./pages/frecuenciaPaso/FrecuenciaPaso";
import VehiculoPaso from "./pages/vehiculoPaso/VehiculoPaso";
import RecursoHumanoPaso from "./pages/recursoHumanoPaso/RecursoHumanoPaso";
import ConfiguracionPresupuestoPaso from "./pages/configuracionPaso/ConfiguracionPresupuestoPaso";
import HistorialPage from "./pages/HistorialPage";
import PropuestaPage from "./pages/propuestaPage/PropuestaPage";
import DesglosePage from "./pages/desglosePage/DesglosePage"; 

// Nuevas páginas (Fase 2)
import GestionVehiculos from "./pages/gestion/GestionVehiculos";
import GestionRRHH from "./pages/gestion/GestionRRHH";
import DashboardBI from "./pages/bi/DashboardBI";
import ConfiguracionGlobal from "./pages/configuracion/ConfiguracionGlobal";

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/verificar/:token" element={<VerificarEmailPage />} />

      {/* Rutas privadas (requieren login) */}
      <Route path="/" element={<RutaProtegida />}>

        {/* MainLayout: sidebar con navegación principal — wrapped in CotizacionProvider */}
        <Route element={
          <CotizacionProvider>
            <MainLayout />
          </CotizacionProvider>
        }>

          {/* Root → Cotizador */}
          <Route index element={<Navigate to="/cotizador" replace />} />

          {/* Cotizador: layout ligero (solo cálculo en tiempo real) */}
          <Route path="cotizador" element={<CotizadorLayout />}>
            <Route index element={<PuntosEntregaPaso />} />
            <Route path="frecuencia/:idRuta" element={<FrecuenciaPaso />} />
            <Route path="vehiculo/:idRuta" element={<VehiculoPaso />} />
            <Route path="recurso-humano/:idRuta" element={<RecursoHumanoPaso />} />
            <Route path="configuracion-final" element={<ConfiguracionPresupuestoPaso />} />
          </Route>

          {/* Historial */}
          <Route path="historial" element={<HistorialPage />} />

          {/* Propuesta y Desglose */}
          <Route path="propuesta/:id" element={<PropuestaPage />} />
          <Route path="desglose/:id" element={<DesglosePage />} />

          {/* Gestión */}
          <Route path="gestion/vehiculos" element={<GestionVehiculos />} />
          <Route path="gestion/rrhh" element={<GestionRRHH />} />

          {/* Business Intelligence */}
          <Route path="bi" element={<DashboardBI />} />

          {/* Configuración */}
          <Route path="configuracion" element={<ConfiguracionGlobal />} />
        </Route>
      </Route>
    </Routes>
  );
}