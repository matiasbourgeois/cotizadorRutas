// Archivo: cotizadorRutas-frontend/src/layouts/CotizadorLayout.jsx (Versión Definitiva Corregida)

import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppShell, Burger, Group, Text, NavLink, Container, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FileText, Clock, Truck, User, Settings, Check, LogOut, History, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import clienteAxios from '../api/clienteAxios';

const CotizadorLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { auth, cerrarSesionAuth } = useAuth();
  
  // ✅ LA CORRECCIÓN PRINCIPAL ESTÁ AQUÍ
  // Desestructuramos directamente las propiedades que necesitamos del contexto.
  // Ya no intentamos obtener un objeto "cotizacion" que no existe.
  const { 
    puntosEntrega, 
    frecuencia, 
    vehiculo, 
    recursoHumano, 
    detallesCarga,
    setDetalleVehiculo, 
    setDetalleRecurso,
  } = useCotizacion();

  // El "cerebro" para el cálculo en tiempo real
  useEffect(() => {
    // Ahora podemos usar las variables directamente
    if (puntosEntrega && frecuencia) {
        
        const debounceCalc = setTimeout(async () => {
            try {
                const payload = { 
                    puntosEntrega, 
                    frecuencia, 
                    vehiculo, 
                    recursoHumano, 
                    configuracion: {},
                    detallesCarga: detallesCarga || { tipo: 'general' } 
                };
                
                const { data } = await clienteAxios.post('/presupuestos/calcular', payload);
                
                setDetalleVehiculo(data.detalleVehiculo);
                setDetalleRecurso(data.detalleRecurso);

            } catch (error) {
                console.error("Error en el cálculo del informe:", error);
                setDetalleVehiculo(null);
                setDetalleRecurso(null);
            }
        }, 500);

        return () => clearTimeout(debounceCalc);
    }
  // ✅ El array de dependencias ahora usa las variables directas.
  }, [frecuencia, vehiculo, recursoHumano]);


  const steps = [
    { path: '/', label: 'Definir Ruta', icon: FileText },
    { path: '/cotizador/frecuencia', label: 'Frecuencia', icon: Clock },
    { path: '/cotizador/vehiculo', label: 'Vehículo', icon: Truck },
    { path: '/cotizador/recurso-humano', label: 'Recurso Humano', icon: User },
    { path: '/cotizador/configuracion-final', label: 'Resumen y Costos', icon: Settings },
  ];

  let activeIndex = steps.findIndex(step => location.pathname.startsWith(step.path) && step.path !== '/');
  if (location.pathname === '/') activeIndex = 0;
  if (location.pathname.startsWith('/cotizador/configuracion-final')) activeIndex = 4;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} c="deep-blue.7" size="xl">Cotizador Logístico</Text>
            <Button variant="default" leftSection={<LogOut size={16} />} onClick={cerrarSesionAuth}>
                Cerrar Sesión
            </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text c="dimmed" size="sm" mb="sm">Bienvenido, {auth?.nombre || 'Usuario'}</Text>
        
        <NavLink
            href="/historial"
            label="Historial de Cotizaciones"
            leftSection={<History size={16} />}
            rightSection={<ChevronRight size={12} />}
            variant="subtle"
            active={location.pathname === '/historial'}
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
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
            <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default CotizadorLayout;