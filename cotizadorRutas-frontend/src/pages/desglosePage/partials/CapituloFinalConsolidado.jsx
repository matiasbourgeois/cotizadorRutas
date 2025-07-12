import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, ThemeIcon, Center, Badge } from '@mantine/core';
import { Target, TrendingUp, ShieldCheck, Truck, User, Plus, Equal, Info } from 'lucide-react';

const CapituloFinalConsolidado = ({ presupuesto }) => {
    // Verificación de seguridad
    if (!presupuesto?.resumenCostos) {
        return null;
    }

    const { resumenCostos, totalKilometros } = presupuesto;
    const costoPorKm = totalKilometros > 0 ? (resumenCostos.totalOperativo / totalKilometros).toFixed(2) : 0;

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 5: Consolidado y Análisis de Rentabilidad</Title>
                <Text c="dimmed" mb="xl">
                    Resumen final que integra todos los costos operativos y define la estructura de precio y el margen de ganancia proyectado para el servicio.
                </Text>

                <Grid gutter="xl">
                    {/* --- COLUMNA IZQUIERDA: DESGLOSE FINAL --- */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper withBorder p="xl" radius="md" className="data-section">
                            <Title order={4} className="section-subtitle">Estructura de Precio</Title>
                            <Divider my="sm" />
                            <Stack gap="lg" mt="lg">
                                {/* Bloque de Costos Operativos */}
                                <div className="cost-block">
                                    <Group><ThemeIcon variant="light" size="lg" color="gray"><Truck size={20}/><User size={20}/></ThemeIcon><Text fw={600}>Costo Operativo Total</Text></Group>
                                    <Text fz="xl" fw={700} c="gray.7">${resumenCostos.totalOperativo.toLocaleString()}</Text>
                                </div>
                                
                                <Center><Plus size={24} color="gray" /></Center>
                                
                                {/* Bloque de Margen */}
                                <div className="cost-block">
                                    <Group><ThemeIcon variant="light" size="lg" color="green"><TrendingUp size={20}/></ThemeIcon><Text fw={600}>Margen de Ganancia ({presupuesto.configuracion.porcentajeGanancia}%)</Text></Group>
                                    <Text fz="xl" fw={700} c="green.7">${resumenCostos.ganancia.toLocaleString()}</Text>
                                </div>

                                <Divider my="sm" />
                                
                                 {/* Bloque de Precio Final */}
                                <div className="cost-block final-price">
                                    <Group><ThemeIcon variant="light" size="xl" color="cyan"><Target size={24}/></ThemeIcon><Title order={3}>Precio Final de Venta (sin IVA)</Title></Group>
                                    <Title order={1} c="cyan.7">${resumenCostos.totalFinal.toLocaleString()}</Title>
                                </div>
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: KPIs Y ANÁLISIS --- */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack>
                            <Paper withBorder p="lg" radius="md" className="data-section">
                                <Title order={4} className="section-subtitle">KPIs Estratégicos</Title>
                                <Divider my="sm" />
                                <Stack gap="md" mt="sm">
                                    <Group justify="space-between">
                                        <Text size="sm">Costo Operativo por KM</Text>
                                        <Badge size="xl" variant="light" color="blue">${costoPorKm}</Badge>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm">Margen Operativo</Text>
                                        <Badge size="xl" variant="light" color="green">{presupuesto.configuracion.porcentajeGanancia}%</Badge>
                                    </Group>
                                </Stack>
                            </Paper>
                            <Alert color="teal" title="Análisis de Contribución" icon={<Info />} radius="md">
                                <Text size="sm">
                                    Este servicio contribuye con un <strong>margen bruto de ${resumenCostos.ganancia.toLocaleString()}</strong>, cubriendo los costos administrativos y operativos, y alineado con los objetivos de rentabilidad de la empresa.
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