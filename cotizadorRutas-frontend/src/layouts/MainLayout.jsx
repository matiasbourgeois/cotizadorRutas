
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppShell, Burger, Group, Text, ActionIcon, Tooltip,
  useMantineColorScheme, NavLink, Divider, ScrollArea, Box
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  Sun, Moon, LogOut, Calculator, History, Truck, Users,
  BarChart3, Settings, PlusCircle, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCotizacion } from '../context/Cotizacion';
import { useAsistenteContextual } from '../hooks/useAsistenteContextual.js';
import AsistenteContextual from '../components/AsistenteContextual.jsx';
import CotizadorStepper from '../components/CotizadorStepper.jsx';
import { useEffect, useMemo, useState } from 'react';
import './MainLayout.css';

const MainLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, cerrarSesionAuth } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { puntosEntrega, resetCotizacion } = useCotizacion();

  const { consejos } = useAsistenteContextual();
  const consejosKey = useMemo(
    () => (consejos || []).map(t => t?.texto ?? "").join("||"),
    [consejos]
  );
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [location.pathname, consejosKey]);

  // Detect which section is active
  const isCotizadorRoute = location.pathname === '/cotizador' || location.pathname.startsWith('/cotizador/');
  const isHistorial = location.pathname === '/historial';
  const isGestionVehiculos = location.pathname === '/gestion/vehiculos';
  const isGestionRRHH = location.pathname === '/gestion/rrhh';
  const isBI = location.pathname === '/bi';
  const isConfig = location.pathname === '/configuracion';

  const isCotizadorSection = isCotizadorRoute || isHistorial;
  const isGestionSection = isGestionVehiculos || isGestionRRHH || isBI || isConfig;

  // Stepper data
  const idRuta = puntosEntrega?.rutaId;
  const stepPaths = [
    '/cotizador',
    `/cotizador/frecuencia/${idRuta}`,
    `/cotizador/vehiculo/${idRuta}`,
    `/cotizador/recurso-humano/${idRuta}`,
    '/cotizador/configuracion-final',
  ];

  const activeIndex = stepPaths.findLastIndex(p => {
    const base = p.split('/:')[0];
    return location.pathname.startsWith(base) && (base !== '/cotizador' || location.pathname === '/cotizador');
  });

  const handleNav = (path) => {
    navigate(path);
    close();
  };

  const handleReset = () => {
    resetCotizacion();
    navigate('/cotizador');
  };

  // Responsive breakpoints
  const isCompactWidth = useMediaQuery('(max-width: 1400px)');
  const isCompactHeight = useMediaQuery('(max-height: 800px)');
  const sidebarWidth = isCompactWidth ? 260 : 300;
  const headerHeight = isCompactHeight ? 48 : 56;
  const shellPadding = isCompactWidth ? 'sm' : 'md';

  return (
    <AppShell
      header={{ height: headerHeight }}
      navbar={{ width: sidebarWidth, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={shellPadding}
    >
      {/* ─── HEADER ─── */}
      <AppShell.Header className="main-header">
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box className="logo-box" onClick={() => handleNav('/cotizador')} style={{ cursor: 'pointer' }}>
              <Group gap={6} align="center">
                <div className="logo-icon">
                  <img src="/favicon.png" alt="" className="logo-favicon" />
                </div>
                <div>
                  <Text className="logo-text" lh={1}>
                    <span className="logo-text-primary">Cotizador</span>
                    <span className="logo-text-accent"> Logístico</span>
                  </Text>
                </div>
              </Group>
            </Box>
          </Group>

          <Group gap={8}>
            <div className="header-user-pill">
              <div className="header-avatar">{(auth?.nombre || 'U')[0].toUpperCase()}</div>
              <Text fz="xs" fw={600} c="var(--app-text)" className="header-user-name">{auth?.nombre?.split(' ')[0] || 'Usuario'}</Text>
            </div>
            <div className="header-actions-divider" />
            <Tooltip label={colorScheme === 'dark' ? 'Modo claro' : 'Modo oscuro'} position="bottom">
              <ActionIcon className="header-action-btn" variant="subtle" size="lg" radius="xl" onClick={toggleColorScheme}>
                {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Cerrar Sesión" position="bottom">
              <ActionIcon
                className="header-action-btn header-action-btn--danger"
                variant="subtle"
                size="lg"
                radius="xl"
                onClick={() => { cerrarSesionAuth(); navigate('/login'); }}
              >
                <LogOut size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ─── SIDEBAR ─── */}
      <AppShell.Navbar p="xs" className="main-navbar">


        <AppShell.Section>
          {/* ─ COTIZADOR ─ */}
          <NavLink
            label="Cotizador"
            leftSection={<Calculator size={16} />}
            childrenOffset={0}
            defaultOpened={isCotizadorSection}
            className="nav-section"
            active={isCotizadorSection}
            variant="light"
            color="cyan"
            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
          >
            <NavLink
              label="Nueva Cotización"
              leftSection={<PlusCircle size={14} />}
              active={isCotizadorRoute}
              onClick={handleReset}
              variant="light"
              color="cyan"
              pl={28}
              fz="sm"
              style={{ borderRadius: 'var(--mantine-radius-sm)' }}
            />
            <NavLink
              label="Historial"
              leftSection={<History size={14} />}
              active={isHistorial}
              onClick={() => handleNav('/historial')}
              variant="light"
              color="cyan"
              pl={28}
              fz="sm"
              style={{ borderRadius: 'var(--mantine-radius-sm)' }}
            />
          </NavLink>

          <Divider my="xs" />

          {/* ─ GESTIÓN ─ */}
          <NavLink
            label="Gestión"
            leftSection={<Briefcase size={16} />}
            childrenOffset={0}
            defaultOpened={isGestionSection}
            className="nav-section"
            active={isGestionSection}
            variant="light"
            color="cyan"
            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
          >
            <NavLink
              label="Vehículos"
              leftSection={<Truck size={14} />}
              active={isGestionVehiculos}
              onClick={() => handleNav('/gestion/vehiculos')}
              variant="light"
              color="cyan"
              pl={28}
              fz="sm"
              style={{ borderRadius: 'var(--mantine-radius-sm)' }}
            />
            <NavLink
              label="Recursos Humanos"
              leftSection={<Users size={14} />}
              active={isGestionRRHH}
              onClick={() => handleNav('/gestion/rrhh')}
              variant="light"
              color="cyan"
              pl={28}
              fz="sm"
              style={{ borderRadius: 'var(--mantine-radius-sm)' }}
            />
          </NavLink>

          <Divider my="xs" />

          {/* ─ DASHBOARD BI ─ */}
          <NavLink
            label="Dashboard"
            leftSection={<BarChart3 size={16} />}
            active={isBI}
            onClick={() => handleNav('/bi')}
            className="nav-section"
            variant="light"
            color="cyan"
            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
          />

          {/* ─ CONFIGURACIÓN ─ */}
          <NavLink
            label="Configuración"
            leftSection={<Settings size={16} />}
            active={isConfig}
            onClick={() => handleNav('/configuracion')}
            className="nav-section"
            variant="light"
            color="cyan"
            mt={4}
            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
          />
        </AppShell.Section>

        {/* ─── Asistente IA: toma TODO el espacio restante ─── */}
        {isCotizadorRoute && (
          <AppShell.Section grow>
            <Divider my={6} />
            <AsistenteContextual key={animationKey} consejos={consejos} />
          </AppShell.Section>
        )}

        {/* Footer */}
        <AppShell.Section>
          <Divider mt={4} mb={4} />
          <Text fz={10} c="dimmed" ta="center">v2.0</Text>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* ─── MAIN CONTENT ─── */}
      <AppShell.Main>
        {/* Stepper horizontal (solo en cotizador) */}
        {isCotizadorRoute && (
          <CotizadorStepper
            activeIndex={activeIndex}
            idRuta={idRuta}
            onReset={handleReset}
          />
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
