// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloFinalConsolidado.jsx (Versión Final de Cierre)

import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, ThemeIcon, Badge, Center } from '@mantine/core';
import { Target, TrendingUp, ShieldCheck, Truck, User, Plus, Equal, Info } from 'lucide-react';

const CapituloFinalConsolidado = ({ presupuesto }) => {
    if (!presupuesto?.resumenCostos) {
        return null;
    }

    const { resumenCostos, totalKilometros } = presupuesto;
    const costoPorKm = totalKilometros > 0 ? (resumenCostos.totalOperativo / totalKilometros) : 0;
    const viajesMensuales = ((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.33);
    const costoTotalPorViaje = resumenCostos.totalFinal / (viajesMensuales > 0 ? viajesMensuales : 1);


    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 5: Propuesta Económica y Rentabilidad</Title>
                <Text c="dimmed" mb="xl">
                    Resumen consolidado de todos los costos operativos y definición de la propuesta económica final para la prestación del servicio.
                </Text>

                <Grid gutter="xl">
                    {/* --- COLUMNA IZQUIERDA: CONSTRUCCIÓN DEL PRECIO --- */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Title order={4} className="section-subtitle">Construcción del Precio Final</Title>
                        <Paper withBorder p="xl" radius="md" mt="sm">
                            <Stack gap="lg" className="waterfall-container">
                                <div className="cost-block">
                                    <Group><ThemeIcon variant="light" color="cyan"><Truck size={20}/></ThemeIcon><Text>Costo Total del Vehículo</Text></Group>
                                    <Text fz="lg" fw={600}>${(resumenCostos.totalVehiculo || 0).toLocaleString()}</Text>
                                </div>
                                
                                <Center><Plus size={24} color="gray" /></Center>
                                
                                <div className="cost-block">
                                    <Group><ThemeIcon variant="light" color="blue"><User size={20}/></ThemeIcon><Text>Costo Total del Recurso Humano</Text></Group>
                                    <Text fz="lg" fw={600}>${(resumenCostos.totalRecurso || 0).toLocaleString()}</Text>
                                </div>

                                <Center><Plus size={24} color="gray" /></Center>
                                
                                 <div className="cost-block">
                                    <Group><ThemeIcon variant="light" color="indigo"><ShieldCheck size={20}/></ThemeIcon><Text>Costos Admin. y Otros</Text></Group>
                                    <Text fz="lg" fw={600}>${((resumenCostos.totalAdministrativo || 0) + (resumenCostos.otrosCostos || 0) + (resumenCostos.totalPeajes || 0)).toLocaleString()}</Text>
                                </div>

                                <Divider my="xs" label={<Text fw={500}>Subtotal Operativo</Text>} labelPosition="center" />
                                <div className="cost-block subtotal-block">
                                    <Group><ThemeIcon variant="light" size="lg" color="red"><TrendingUp size={22} style={{ transform: 'rotate(180deg)' }}/></ThemeIcon><Text fw={600}>Costo Operativo Total</Text></Group>
                                    <Text fz="xl" fw={700} c="red.8">${(resumenCostos.totalOperativo || 0).toLocaleString()}</Text>
                                </div>
                                
                                <Center><Plus size={24} color="gray" /></Center>

                                <div className="cost-block">
                                    <Group><ThemeIcon variant="light" color="teal"><TrendingUp size={20}/></ThemeIcon><Text>Margen de Ganancia ({presupuesto.configuracion.porcentajeGanancia}%)</Text></Group>
                                    <Text fz="lg" fw={600} c="teal.8">+ ${(resumenCostos.ganancia || 0).toLocaleString()}</Text>
                                </div>
                                
                                <Divider my="sm" />

                                <div className="cost-block final-price-block">
                                    <Group><ThemeIcon variant="light" size="xl" color="green"><Target size={24}/></ThemeIcon><Title order={3}>Precio Final de Venta</Title></Group>
                                    <Title order={1} className="final-price-value">${(resumenCostos.totalFinal || 0).toLocaleString()}</Title>
                                </div>
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: KPIs Y ANÁLISIS --- */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack>
                            <Title order={4} className="section-subtitle">KPIs Estratégicos</Title>
                            <Paper withBorder p="lg" radius="md">
                                <Stack gap="lg">
                                    <Group justify="space-between">
                                        <Text size="sm">Costo Operativo / KM</Text>
                                        <Badge size="xl" variant="light" color="blue">${costoPorKm > 0 ? costoPorKm.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'}</Badge>
                                    </Group>
                                     <Group justify="space-between">
                                        <Text size="sm">Precio de Venta / Viaje</Text>
                                        <Badge size="xl" variant="light" color="green">${costoTotalPorViaje > 0 ? costoTotalPorViaje.toLocaleString('es-AR', {maximumFractionDigits: 0}) : 'N/A'}</Badge>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm">Margen de Beneficio</Text>
                                        <Badge size="xl" variant="filled" color="teal">{presupuesto.configuracion.porcentajeGanancia}%</Badge>
                                    </Group>
                                </Stack>
                            </Paper>
                            <Alert color="teal" title="Análisis de Rentabilidad" icon={<Info />} radius="md" mt="lg">
                                <Text size="sm">
                                    Este servicio está proyectado para generar un margen bruto de <strong>${(resumenCostos.ganancia || 0).toLocaleString()}</strong>, cubriendo la totalidad de los costos operativos directos e indirectos y alineándose con los objetivos de rentabilidad de la compañía.
                                </Text>
                            </Alert>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloFinalConsolidado;