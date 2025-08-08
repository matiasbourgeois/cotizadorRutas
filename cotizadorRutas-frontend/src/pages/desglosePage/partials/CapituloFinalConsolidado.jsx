// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloFinalConsolidado.jsx

import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, ThemeIcon, Center } from '@mantine/core';
import { Target, TrendingUp, ShieldCheck, Truck, User, Plus, Info } from 'lucide-react';

// --- Subcomponentes para un diseño limpio ---

const CostoBlock = ({ icon, label, value, color = 'gray' }) => (
    <Paper withBorder p="md" radius="md">
        <Group>
            <ThemeIcon variant="light" color={color} size={36} radius="md">{icon}</ThemeIcon>
            <div>
                <Text fz="sm" c="dimmed">{label}</Text>
                <Text fz="xl" fw={600}>${(value || 0).toLocaleString('es-AR')}</Text>
            </div>
        </Group>
    </Paper>
);

const KpiCard = ({ label, value, color, unit = '' }) => (
    <Paper withBorder p="lg" radius="md">
        <Text fz="xs" c="dimmed" tt="uppercase">{label}</Text>
        <Text fz={32} fw={700} c={color} lh={1.2}>
            {value}
            <Text component="span" fz="md" c="dimmed" ml={5}>{unit}</Text>
        </Text>
    </Paper>
);

const ComposicionBarras = ({ costo, ganancia, total }) => {
    const costoPct = total > 0 ? (costo / total) * 100 : 0;
    const gananciaPct = total > 0 ? (ganancia / total) * 100 : 0;

    return (
        <Stack gap="xs">
            <div>
                <Group justify="space-between"><Text size="sm">Costo Operativo</Text><Text size="sm" fw={500}>${costo.toLocaleString('es-AR')}</Text></Group>
                <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${costoPct}%`, backgroundColor: '#495057', height: '100%' }}></div>
                </div>
            </div>
            <div>
                <Group justify="space-between"><Text size="sm" c="teal.8">Margen de Ganancia</Text><Text size="sm" c="teal.8" fw={500}>${ganancia.toLocaleString('es-AR')}</Text></Group>
                <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${gananciaPct}%`, backgroundColor: '#20c997', height: '100%' }}></div>
                </div>
            </div>
        </Stack>
    );
};


const CapituloFinalConsolidado = ({ presupuesto }) => {
    if (!presupuesto?.resumenCostos) { return null; }

const { resumenCostos, frecuencia } = presupuesto;

    // Se obtienen los kilómetros mensuales totales del cálculo del vehículo, que es la fuente correcta.
    const kmsMensualesTotales = presupuesto.vehiculo?.calculo?.kmsMensuales || 0;

    // Se calcula el costo por viaje.
    const costoTotalPorViaje = resumenCostos.totalFinal / (((frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.12) || 1);

    //  Ahora se usa la variable correcta 'kmsMensualesTotales' para el cálculo.
    const costoOpPorKm = kmsMensualesTotales > 0 ? (resumenCostos.totalOperativo / kmsMensualesTotales) : 0;

    // El cálculo de otros costos no cambia.
    const totalCostosAdminOtros = (resumenCostos.totalAdministrativo || 0) + (resumenCostos.otrosCostos || 0) + (resumenCostos.totalPeajes || 0);

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 6: Propuesta Económica y Rentabilidad</Title>
                <Text c="dimmed" mb="xl">
                    Resumen consolidado de todos los costos operativos y definición de la propuesta económica final para la prestación del servicio.
                </Text>

                {/* ✅ CLASES DE IMPRESIÓN AÑADIDAS AQUÍ 👇 */}
                <Grid gutter="xl" className="print-grid">
                    <Grid.Col span={{ base: 12, md: 7 }} className="print-col-7">
                        <Title order={4} className="section-subtitle">Construcción del Precio Final</Title>
                        <Stack gap="sm" mt="md">
                            <CostoBlock icon={<Truck size={20} />} label="Costo Total del Vehículo" value={resumenCostos.totalVehiculo} color="cyan" />
                            <Center><ThemeIcon variant="light" radius="xl"><Plus size={12} /></ThemeIcon></Center>
                            <CostoBlock icon={<User size={20} />} label="Costo Total del Recurso Humano" value={resumenCostos.totalRecurso} color="blue" />
                            <Center><ThemeIcon variant="light" radius="xl"><Plus size={12} /></ThemeIcon></Center>
                            <CostoBlock icon={<ShieldCheck size={20} />} label="Costos Admin. y Otros" value={totalCostosAdminOtros} color="indigo" />
                            <Divider label={<Text fw={500}>Subtotal Operativo</Text>} labelPosition="center" />
                            <Paper withBorder p="lg" radius="md" bg="red.0">
                                <Group>
                                    <ThemeIcon variant="light" size="lg" color="red"><TrendingUp size={22} style={{ transform: 'rotate(180deg)' }} /></ThemeIcon>
                                    <div>
                                        <Text fz="md" fw={600} c="red.8">Costo Operativo Total</Text>
                                        <Text fz={22} fw={700} c="red.9" lh={1.1}>${(resumenCostos.totalOperativo || 0).toLocaleString('es-AR')}</Text>
                                    </div>
                                </Group>
                            </Paper>
                            <Center><ThemeIcon variant="light" color="teal" radius="xl"><Plus size={12} /></ThemeIcon></Center>
                            <CostoBlock icon={<TrendingUp size={20} />} label={`Margen de Ganancia (${presupuesto.configuracion.porcentajeGanancia}%)`} value={resumenCostos.ganancia} color="teal" />
                            <Divider />
                            <Paper p="sm" radius="md" bg="teal.1">
                                 <Group>
                                    <ThemeIcon variant="light" size="sm" color="teal"><Target size={24}/></ThemeIcon>
                                    <div>
                                        <Title order={3} c="teal.5">Precio Final de Venta (s/IVA)</Title>
                                        <Title order={1} className="final-price-value" style={{ fontSize: 24, color: 'var(--mantine-color-teal-9)' }}>
                                            ${(resumenCostos.totalFinal || 0).toLocaleString('es-AR')}
                                        </Title>
                                    </div>
                                </Group>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }} className="print-col-5">
                        <Stack>
                            <Title order={4} className="section-subtitle">Análisis Estratégico</Title>
                            <KpiCard label="Costo Operativo / KM" value={`$${costoOpPorKm.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="red.8" />
                            <KpiCard label="Precio de Venta / Viaje" value={`$${costoTotalPorViaje.toLocaleString('es-AR', {maximumFractionDigits: 0})}`} color="cyan.8" />
                            <KpiCard label="Margen de Beneficio" value={presupuesto.configuracion.porcentajeGanancia} unit="%" color="teal.8" />
                            <Paper withBorder p="sm" radius="md" mt="sm">
                                <Title order={5} ta="center" mb="sm">Composición del Precio Final</Title>
                                <ComposicionBarras costo={resumenCostos.totalOperativo} ganancia={resumenCostos.ganancia} total={resumenCostos.totalFinal} />
                            </Paper>
                            <Alert color="teal" title="Veredicto de Rentabilidad" icon={<Info />} radius="md" mt="sm">
                                <Text size="sm">
                                    Este servicio está proyectado para generar un margen bruto de <strong>${(resumenCostos.ganancia || 0).toLocaleString('es-AR')}</strong>, cubriendo la totalidad de los costos operativos directos e indirectos y alineándose con los objetivos de rentabilidad de la compañía.
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