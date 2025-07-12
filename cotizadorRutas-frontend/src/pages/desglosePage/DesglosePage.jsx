// Archivo: src/pages/desglosePage/DesglosePage.jsx (Versión Final - Print-Ready)

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text, Paper, Title, Button, Grid, Group, SimpleGrid, ThemeIcon, Divider, Stack, RingProgress, Badge, List } from '@mantine/core';
import { Printer, Calendar, MapPin, Truck, Clock, Target, TrendingUp, Route as RouteIcon, Hash, Building, User as UserIcon } from 'lucide-react';
import './DesglosePage.css';
import MapaRuta from '../../components/MapaRuta';

// --- Partials ---
import CapituloVehiculoFicha from './partials/CapituloVehiculoFicha';
import CapituloVehiculoCostos from './partials/CapituloVehiculoCostos';
import CapituloRecursoHumanoFicha from './partials/CapituloRecursoHumanoFicha';
import CapituloRecursoHumanoCostos from './partials/CapituloRecursoHumanoCostos';
import CapituloFinalConsolidado from './partials/CapituloFinalConsolidado';

const DesglosePage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const { data } = await clienteAxios.get(`/presupuestos/${id}`);
                setPresupuesto(data);
            } catch (error) {
                console.error("Error al obtener el presupuesto para el desglose:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerPresupuesto();
    }, [id]);

    const formatDuration = (totalMinutes) => {
        if (!totalMinutes) return 'N/A';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        let result = '';
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0 || hours === 0) result += `${minutes}m`;
        return result.trim();
    };
    
    const Header = () => (
        <div className="header-simple">
            <Title order={4} className="header-title-main">Sol del Amanecer SRL</Title>
            <Text c="dimmed" size="sm" className="header-subtitle">Transporte y Logística de Confianza</Text>
        </div>
    );

    const Footer = ({ pageNumber }) => (
        <div className="footer"><Text size="xs" c="dimmed">Documento de Análisis Interno | Página {pageNumber}</Text></div>
    );
    
    if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
    if (!presupuesto) return <Center h="100vh"><Text>Desglose de presupuesto no encontrado.</Text></Center>;

    const { resumenCostos, frecuencia, totalKilometros, duracionMin } = presupuesto;
    const totalOperativo = resumenCostos.totalOperativo || 0;
    const totalVehiculo = resumenCostos.totalVehiculo || 0;
    const totalRecurso = resumenCostos.totalRecurso || 0;
    const otrosCostos = (resumenCostos.totalAdministrativo || 0) + (resumenCostos.totalPeajes || 0) + (resumenCostos.otrosCostos || 0);
    const viajesMensuales = ((frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33);

    return (
        <div className="propuesta-background">
            <div className="print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">Imprimir o Guardar PDF</Button>
            </div>

            <div className="page-container">
                {/* Página 1 */}
                <div className="page">
                    <Header />
                    <div className="content">
                        <Group justify="space-between" align="flex-start">
                            <div>
                                <Title order={1} className="main-title-cover">Dashboard de Misión</Title>
                                <Text c="dimmed">Cliente: {presupuesto.cliente || 'No Especificado'} | ID: {presupuesto._id}</Text>
                            </div>
                            <Badge size="xl" variant="light" color="cyan">{frecuencia.tipo}</Badge>
                        </Group>

                        <Grid gutter="xl" mt="xl">
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper withBorder p="lg" radius="md" className="kpi-card-vertical">
                                    <Text c="dimmed" fz="sm">Precio Final (sin IVA)</Text>
                                    <Text className="kpi-main-value">${(resumenCostos.totalFinal || 0).toLocaleString('es-AR')}</Text>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper withBorder p="lg" radius="md" className="kpi-card-vertical">
                                    <Text c="dimmed" fz="sm">Costo Operativo Total</Text>
                                    <Text className="kpi-secondary-value">${totalOperativo.toLocaleString('es-AR')}</Text>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper withBorder p="lg" radius="md" className="kpi-card-vertical kpi-profit">
                                    <Text fz="sm">Margen Bruto</Text>
                                    <Text className="kpi-secondary-value">${(resumenCostos.ganancia || 0).toLocaleString('es-AR')}</Text>
                                </Paper>
                            </Grid.Col>
                        </Grid>

                        <Grid gutter="xl" mt="lg">
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Title order={4} className="section-title-light">Activos Asignados</Title>
                                <SimpleGrid cols={2}>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><Truck size={20}/></ThemeIcon><Stack gap={0}><Text size="sm" fw={500}>{presupuesto.vehiculo.datos.marca}</Text><Text size="xs" c="dimmed">{presupuesto.vehiculo.datos.modelo}</Text></Stack></Group></Paper>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><UserIcon size={20}/></ThemeIcon><Stack gap={0}><Text size="sm" fw={500}>{presupuesto.recursoHumano.datos.nombre}</Text><Text size="xs" c="dimmed">{presupuesto.recursoHumano.datos.tipoContratacion}</Text></Stack></Group></Paper>
                                </SimpleGrid>
                                
                                <Title order={4} className="section-title-light" mt="xl">Composición del Costo</Title>
                                <Paper withBorder p="lg" radius="md">
                                    <RingProgress size={200} thickness={20} mx="auto" roundCaps sections={[{ value: (totalVehiculo / totalOperativo) * 100, color: '#15aabf', tooltip: `Vehículo: $${totalVehiculo.toLocaleString()}`}, { value: (totalRecurso / totalOperativo) * 100, color: '#4c6ef5', tooltip: `RRHH: $${totalRecurso.toLocaleString()}`}, { value: (otrosCostos / totalOperativo) * 100, color: '#845ef7', tooltip: `Admin/Otros: $${otrosCostos.toLocaleString()}`}]} />
                                    <Group justify="center" mt="lg"><Text size="sm"><Badge color="#15aabf" /> Vehículo ({(totalVehiculo / totalOperativo * 100).toFixed(1)}%)</Text><Text size="sm"><Badge color="#4c6ef5" /> Recurso Humano ({(totalRecurso / totalOperativo * 100).toFixed(1)}%)</Text><Text size="sm"><Badge color="#845ef7" /> Otros ({(otrosCostos / totalOperativo * 100).toFixed(1)}%)</Text></Group>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Title order={4} className="section-title-light">Métricas Clave</Title>
                                <Stack>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><MapPin size={20}/></ThemeIcon><Stack gap={0}><Text size="xl" fw={500}>{totalKilometros.toFixed(1)} km</Text><Text size="xs" c="dimmed">Distancia / Viaje</Text></Stack></Group></Paper>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><Clock size={20}/></ThemeIcon><Stack gap={0}><Text size="xl" fw={500}>{formatDuration(duracionMin)}</Text><Text size="xs" c="dimmed">Duración / Viaje</Text></Stack></Group></Paper>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><Calendar size={20}/></ThemeIcon><Stack gap={0}><Text size="xl" fw={500}>~{viajesMensuales.toFixed(1)}</Text><Text size="xs" c="dimmed">Viajes / Mes</Text></Stack></Group></Paper>
                                    <Paper withBorder p="md"><Group><ThemeIcon variant="light"><RouteIcon size={20}/></ThemeIcon><Stack gap={0}><Text size="xl" fw={500}>~{(totalKilometros * viajesMensuales).toLocaleString()} km</Text><Text size="xs" c="dimmed">Distancia / Mes</Text></Stack></Group></Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={1} />
                </div>
                
                {/* El resto de las páginas se renderizan con sus componentes */}
                <CapituloVehiculoFicha presupuesto={presupuesto} />
                <CapituloVehiculoCostos presupuesto={presupuesto} />
                <CapituloRecursoHumanoFicha presupuesto={presupuesto} />
                <CapituloRecursoHumanoCostos presupuesto={presupuesto} />
                <CapituloFinalConsolidado presupuesto={presupuesto} />
            </div>
        </div>
    );
};

export default DesglosePage;