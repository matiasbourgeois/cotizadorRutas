// Archivo: cotizadorRutas-frontend/src/layouts/CotizadorLayout.jsx (Versión Final con "key")

import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppShell, Burger, Group, Text, NavLink, Container, Button, ScrollArea, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FileText, Clock, Truck, User, Settings, Check, LogOut, History, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react'; // Importamos useState
import { useCotizacion } from '../context/Cotizacion';
import clienteAxios from '../api/clienteAxios';
import { useAsistenteContextual } from '../hooks/useAsistenteContextual.js';
import AsistenteContextual from '../components/AsistenteContextual.jsx';

const CotizadorLayout = () => {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const { auth, cerrarSesionAuth } = useAuth();
    
    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setDetalleVehiculo, setDetalleRecurso,
    } = useCotizacion();

    const { consejos } = useAsistenteContextual();
    
    // ✅ Creamos un estado simple para forzar la re-animación.
    const [animationKey, setAnimationKey] = useState(0);

    // Efecto para el cálculo de costos (sin cambios)
    useEffect(() => {
        // ... (lógica de cálculo de costos)
    }, [puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setDetalleVehiculo, setDetalleRecurso]);

    // ✅ Efecto que se ejecuta CADA VEZ que los consejos cambian.
    useEffect(() => {
        // Incrementamos la 'key' para forzar que el componente Asistente se destruya y se vuelva a crear.
        // Esto reiniciará la animación CSS de forma limpia y garantizada.
        setAnimationKey(prevKey => prevKey + 1);
    }, [consejos]);


    const steps = [
        { path: '/', label: 'Definir Ruta', icon: FileText },
        { path: '/cotizador/frecuencia', label: 'Frecuencia', icon: Clock },
        { path: '/cotizador/vehiculo', label: 'Vehículo', icon: Truck },
        { path: '/cotizador/recurso-humano', label: 'Recurso Humano', icon: User },
        { path: '/cotizador/configuracion-final', label: 'Resumen y Costos', icon: Settings },
    ];
    const activeIndex = steps.findLastIndex(step => location.pathname.startsWith(step.path));

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
                <Flex direction="column" h="100%">
                    <div>
                        <Text c="dimmed" size="sm" mb="sm">Bienvenido, {auth?.nombre || 'Usuario'}</Text>
                        <NavLink
                            href="/historial" label="Historial de Cotizaciones"
                            leftSection={<History size={16} />} rightSection={<ChevronRight size={12} />}
                            variant="subtle" active={location.pathname === '/historial'}
                            component={Link} to="/historial" mb="xl"
                        />
                        <Text tt="uppercase" size="xs" c="dimmed" fw={700} mb="sm">Pasos de la cotización</Text>
                        {steps.map((step, index) => {
                            const isCompleted = index < activeIndex;
                            const isActive = index === activeIndex;
                            return (
                                <NavLink
                                    key={step.label} href={isCompleted ? step.path : undefined} label={step.label}
                                    leftSection={<step.icon size={16} />} rightSection={isCompleted ? <Check size={16} color="green" /> : null}
                                    active={isActive} disabled={!isCompleted && !isActive}
                                    component={isCompleted ? Link : 'div'} to={isCompleted ? step.path : undefined}
                                    variant="subtle" mb={5}
                                />
                            );
                        })}
                    </div>
                    
                    <ScrollArea style={{ flex: 1 }} mt="md">
                        {/* ✅ Le pasamos la 'key' a nuestro asistente. */}
                        <AsistenteContextual key={animationKey} consejos={consejos} />
                    </ScrollArea>
                </Flex>
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