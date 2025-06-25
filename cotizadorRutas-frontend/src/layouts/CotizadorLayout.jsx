// Archivo: cotizadorRutas-frontend/src/layouts/CotizadorLayout.jsx (Versión Rediseño "Cockpit")

import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppShell, Burger, Group, Text, NavLink, Box, Container, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FileText, Clock, Truck, User, Settings, Check, LogOut, History, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CotizadorLayout = () => {
  // ¿Por qué este cambio?
  // Usamos el componente AppShell de Mantine, que está diseñado específicamente
  // para crear layouts complejos con paneles laterales (navbar) y un área de
  // contenido principal. Es la herramienta perfecta para nuestra visión.

  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { auth, cerrarSesionAuth } = useAuth();

  const steps = [
    { path: '/', label: 'Definir Ruta', icon: FileText },
    { path: '/cotizador/frecuencia', label: 'Frecuencia', icon: Clock },
    { path: '/cotizador/vehiculo', label: 'Vehículo', icon: Truck },
    { path: '/cotizador/recurso-humano', label: 'Recurso Humano', icon: User },
    { path: '/cotizador/configuracion-final', label: 'Resumen y Costos', icon: Settings },
  ];

  // Lógica para determinar el paso activo (y los completados)
  let activeIndex = steps.findIndex(step => location.pathname.startsWith(step.path) && step.path !== '/');
  if (location.pathname === '/') activeIndex = 0;
  if (location.pathname.startsWith('/cotizador/configuracion-final')) activeIndex = 4;


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* --- Encabezado Superior --- */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} c="deep-blue.7" size="xl">Cotizador Logístico</Text>
            <Button
                variant="default" 
                leftSection={<LogOut size={16} />}
                onClick={cerrarSesionAuth}
            >
                Cerrar Sesión
            </Button>
        </Group>
      </AppShell.Header>

      {/* --- Columna Izquierda: El "Panel de Misión" --- */}
      <AppShell.Navbar p="md">
        <Text c="dimmed" size="sm" mb="sm">Bienvenido, {auth?.nombre || 'Usuario'}</Text>
        
        <NavLink
            href="/historial"
            label="Historial de Cotizaciones"
            leftSection={<History size={16} />}
            rightSection={<ChevronRight size={12} />}
            variant="subtle"
            active
            component={Link}
            to="/historial"
            mb="xl"
        />

        <Text tt="uppercase" size="xs" c="dimmed" fw={700} mb="sm">Pasos de la cotización</Text>

        {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
                <NavLink
                    key={step.label}
                    href={isCompleted ? step.path : undefined}
                    label={step.label}
                    leftSection={<step.icon size={16} />}
                    rightSection={isCompleted ? <Check size={16} color="green" /> : null}
                    active={isActive}
                    disabled={!isCompleted && !isActive}
                    component={isCompleted ? Link : 'div'}
                    to={isCompleted ? step.path : undefined}
                    variant="subtle"
                    mb={5}
                />
            );
        })}
        {/* Aquí irá el "Live Summary Ticker" en el futuro */}
      </AppShell.Navbar>

      {/* --- Columna Derecha: El "Área de Trabajo" --- */}
      <AppShell.Main>
        <Container fluid>
            {/* El Outlet renderizará el contenido del paso actual aquí */}
            <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default CotizadorLayout;