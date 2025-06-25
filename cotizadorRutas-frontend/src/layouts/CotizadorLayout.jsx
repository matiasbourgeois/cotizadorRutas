// Archivo: cotizadorRutas-frontend/src/layouts/CotizadorLayout.jsx

import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Stepper, Container, Paper, Title, rem, Group, Text, Button, Box } from '@mantine/core';
import { FileText, Clock, Truck, User, Settings, Check, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CotizadorLayout = () => {
  const location = useLocation();
  const { auth, cerrarSesionAuth } = useAuth();

  const stepPaths = [
    '/',
    '/cotizador/frecuencia',
    '/cotizador/vehiculo',
    '/cotizador/recurso-humano',
    '/cotizador/configuracion-final'
  ];

  let active = stepPaths.findIndex(path => location.pathname.startsWith(path) && path !== '/');
  if (location.pathname === '/') active = 0;
  if (location.pathname.startsWith('/cotizador/configuracion-final')) active = 4;

  return (
    <Container size="xl" my="xl">
      {/* --- INICIO: ENCABEZADO AÑADIDO --- */}
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={1} c="deep-blue.7">Cotizador Logistico</Title>
          <Text c="dimmed">Bienvenido, {auth?.nombre || 'Usuario'}</Text>
        </Box>
            <Group>
                <Button
                    component={Link}
                    to="/historial"
                    variant="outline"
                    leftSection={<History size={16} />}
                >
                    Mis Cotizaciones
                </Button>
                <Button 
                    variant="default" 
                    leftSection={<LogOut size={16} />}
                    onClick={cerrarSesionAuth}
                >
                    Cerrar Sesión
                </Button>
            </Group>
      </Group>

      <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
        <Stepper active={active} color="cyan" iconSize={32}>
          <Stepper.Step
            icon={<FileText style={{ width: rem(18), height: rem(18) }} />}
            label="Paso 1"
            description="Definir Ruta"
          />
          <Stepper.Step
            icon={<Clock style={{ width: rem(18), height: rem(18) }} />}
            label="Paso 2"
            description="Frecuencia"
          />
          <Stepper.Step
            icon={<Truck style={{ width: rem(18), height: rem(18) }} />}
            label="Paso 3"
            description="Vehículo"
          />
          <Stepper.Step
            icon={<User style={{ width: rem(18), height: rem(18) }} />}
            label="Paso 4"
            description="Recurso Humano"
          />
          <Stepper.Step
            icon={<Settings style={{ width: rem(18), height: rem(18) }} />}
            label="Paso 5"
            description="Resumen Final"
          />
          <Stepper.Completed>
            <Check style={{ width: rem(18), height: rem(18) }} />
          </Stepper.Completed>
        </Stepper>
      </Paper>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Outlet />
      </Paper>
    </Container>
  );
};

export default CotizadorLayout;