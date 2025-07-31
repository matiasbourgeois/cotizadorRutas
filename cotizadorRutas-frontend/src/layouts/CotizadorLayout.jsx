// Archivo: cotizadorRutas-frontend/src/layouts/CotizadorLayout.jsx (Versión con navegación corregida)

import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { AppShell, Burger, Group, Text, Container, Button, ScrollArea, Flex, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FileText, Clock, Truck, User, Settings, Check, LogOut, History, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import clienteAxios from '../api/clienteAxios';
import { useAsistenteContextual } from '../hooks/useAsistenteContextual.js';
import AsistenteContextual from '../components/AsistenteContextual.jsx';

// Importamos el CSS para la barra de pasos
import '../styles/Stepper.css';

const CotizadorLayout = () => {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const { auth, cerrarSesionAuth } = useAuth();
    const navigate = useNavigate();
    
    // ✅ 1. OBTENEMOS LA COTIZACIÓN COMPLETA DEL CONTEXTO
    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setDetalleVehiculo, setDetalleRecurso, resetCotizacion, setResumenCostos
    } = useCotizacion();

    const { consejos } = useAsistenteContextual();
    const [animationKey, setAnimationKey] = useState(0);

    // ... (El resto de tu lógica de useEffect y funciones permanece igual)
    useEffect(() => {
        if (location.pathname.includes('/configuracion-final')) {
            return;
        }
        if (!puntosEntrega || !frecuencia) {
            return;
        }
        const debounceCalc = setTimeout(() => {
            const payload = {
                puntosEntrega, frecuencia, vehiculo, recursoHumano,
                detallesCarga, configuracion: {},
            };
            clienteAxios.post('/presupuestos/calcular', payload)
                .then(response => {
                    setDetalleVehiculo(response.data.detalleVehiculo);
                    setDetalleRecurso(response.data.detalleRecurso);
                    setResumenCostos(response.data.resumenCostos);
                })
                .catch(error => {
                    console.error("Error en el cálculo en tiempo real:", error);
                    setDetalleVehiculo(null);
                    setDetalleRecurso(null);
                });
        }, 300);
        return () => clearTimeout(debounceCalc);
    }, [puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setDetalleVehiculo, setDetalleRecurso, setResumenCostos, location]);


    useEffect(() => {
        setAnimationKey(prevKey => prevKey + 1);
    }, [consejos]);

    const handleReset = () => {
        resetCotizacion();
        navigate('/');
    };
    
    // ✅ 2. EXTRAEMOS EL ID DE LA RUTA DEL CONTEXTO
    // Este ID se guarda en el primer paso (PuntosEntregaPaso)
    const idRuta = puntosEntrega?.rutaId;

    // ✅ 3. CONSTRUIMOS LAS RUTAS DE LOS PASOS DINÁMICAMENTE
    const steps = [
        { path: '/', label: 'Definir Ruta', icon: FileText, id: 'ruta' },
        { path: `/cotizador/frecuencia/${idRuta}`, label: 'Frecuencia', icon: Clock, id: 'frecuencia' },
        { path: `/cotizador/vehiculo/${idRuta}`, label: 'Vehículo', icon: Truck, id: 'vehiculo' },
        { path: `/cotizador/recurso-humano/${idRuta}`, label: 'Recurso Humano', icon: User, id: 'recurso' },
        { path: '/cotizador/configuracion-final', label: 'Resumen y Costos', icon: Settings, id: 'final' },
    ];
    
    // ✅ 4. MEJORAMOS LA LÓGICA PARA DETECTAR EL PASO ACTIVO
    const activeIndex = steps.findLastIndex(step => {
        const baseStepPath = step.path.split('/:')[0];
        return location.pathname.startsWith(baseStepPath) && (baseStepPath !== '/' || location.pathname === '/');
    });

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
                    <Group>
                        <Button variant="light" color="orange" leftSection={<RotateCcw size={16} />} onClick={handleReset}>
                            Reiniciar Cotización
                        </Button>
                        <Button variant="default" leftSection={<LogOut size={16} />} onClick={cerrarSesionAuth}>
                            Cerrar Sesión
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Flex direction="column" h="100%">
                    <div>
                        <Text c="dimmed" size="sm" mb="sm">Bienvenido, {auth?.nombre || 'Usuario'}</Text>

                         <Button
                            component={Link}
                            to="/historial"
                            variant="light"
                            color="cyan"
                            fullWidth
                            leftSection={<History size={16} />} 
                            mb="xl"
                            radius="md"
                            fz="sm" 
                            fw={500} 
                         >
                            Historial de Cotizaciones
                        </Button>

                        <Text tt="uppercase" size="xs" c="dimmed" fw={700} mb="sm">Pasos de la cotización</Text>
                        
                        <Stack gap="xs" mt="md"> 
                            {steps.map((step, index) => {
                                const isCompleted = index < activeIndex;
                                const isActive = index === activeIndex;

                                // ✅ 5. LÓGICA DE SEGURIDAD: SI NO HAY ID, EL LINK NO FUNCIONA
                                const isLinkDisabled = !idRuta && index > 0 && index < 4;
                                const path = isLinkDisabled ? '#' : step.path;
                                const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'future';
                                const StepIcon = step.icon;
                                
                                const content = (
                                    <Group className={`step ${statusClass}`} gap="sm" wrap="nowrap" style={{pointerEvents: isLinkDisabled ? 'none' : 'auto'}}>
                                        <div className="step-icon-container">
                                            {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                                        </div>
                                        <Text fz="sm" className="step-label">{step.label}</Text>
                                    </Group>
                                );
                                
                                return isCompleted ? (
                                    <Link to={path} key={step.id} className="step-link">
                                        {content}
                                    </Link>
                                ) : (
                                    <div key={step.id}>
                                        {content}
                                    </div>
                                );
                            })}
                        </Stack>
                    </div>
                    
                    <ScrollArea style={{ flex: 1 }} mt="md">
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