// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloRecursoHumanoCostos.jsx

import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, RingProgress, Center, ThemeIcon, Badge } from '@mantine/core';
import { Info, UserCheck, TrendingUp, Clock, Route } from 'lucide-react';

// Componente para una línea de costo
const CostoLine = ({ label, value, isSubtotal = false }) => (
    <Group justify="space-between" wrap="nowrap" mt={isSubtotal ? 'sm' : 'xs'}>
        <Text size="sm" fw={isSubtotal ? 700 : 400}>{label}:</Text>
        <Text size="sm" fw={isSubtotal ? 700 : 500}>
            ${(value || 0).toLocaleString('es-AR')}
        </Text>
    </Group>
);

// Componente para una métrica clave
const KpiMetrica = ({ icon, value, label, unit }) => (
    <Group>
        <ThemeIcon variant="light" size={36} radius="md">{icon}</ThemeIcon>
        <div>
            <Text fw={700} fz="lg">{value} <Text span fz="sm" c="dimmed">{unit}</Text></Text>
            <Text fz="xs" c="dimmed">{label}</Text>
        </div>
    </Group>
);


const CapituloRecursoHumanoCostos = ({ presupuesto }) => {
    if (!presupuesto?.recursoHumano?.calculo?.detalle) { return null; }

    const { calculo } = presupuesto.recursoHumano;
    const { detalle, totalFinal } = calculo;

    // --- Cálculos para el Gráfico y KPIs ---
    const totalRemunerativo = (detalle.costoBaseRemunerativo || 0) + (detalle.adicionalKm || 0) + (detalle.adicionalPorCargaDescarga || 0);
    const totalNoRemunerativo = (detalle.viaticoKm || 0) + (detalle.adicionalFijoNoRemunerativo || 0);
    const totalIndirecto = detalle.costoIndirecto || 0;

    const costoPorKm = detalle.kmRealesTotales > 0 ? (totalFinal / detalle.kmRealesTotales) : 0;
    
    const duracionTotalMisionMin = (presupuesto.duracionMin || 0) + 30;
    const viajesProyectados = presupuesto.frecuencia.tipo === 'mensual'
      ? ((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.33)
      : (presupuesto.frecuencia.vueltasTotales || 1);
  
    const horasTotalesMensuales = (duracionTotalMisionMin * viajesProyectados) / 60;
    const costoPorHora = horasTotalesMensuales > 0 ? (totalFinal / horasTotalesMensuales) : 0;

    const seccionesGrafico = [
        { value: totalFinal > 0 ? (totalRemunerativo / totalFinal) * 100 : 0, color: 'blue', tooltip: `Remunerativo: $${totalRemunerativo.toLocaleString('es-AR')}` },
        { value: totalFinal > 0 ? (totalNoRemunerativo / totalFinal) * 100 : 0, color: 'teal', tooltip: `No Remunerativo: $${totalNoRemunerativo.toLocaleString('es-AR')}` },
        { value: totalFinal > 0 ? (totalIndirecto / totalFinal) * 100 : 0, color: 'grape', tooltip: `Indirectos: $${totalIndirecto.toLocaleString('es-AR')}` },
    ].filter(sec => sec.value > 0);

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 5: Impacto Económico del Colaborador</Title>
                <Text c="dimmed" mb="xl">
                    Análisis detallado de los costos generados por el colaborador para esta operación específica, basado en la metodología de cálculo seleccionada.
                </Text>

                {/* ✅ CLASES DE IMPRESIÓN AÑADIDAS AQUÍ 👇 */}
                <Grid gutter="xl" className="print-grid">
                    <Grid.Col span={{ base: 12, md: 7 }} className="print-col-7">
                        <Paper withBorder p="xl" radius="md">
                            <Stack>
                                <Alert color="blue" title="Metodología de Cálculo Aplicada" icon={<Info />} radius="md">
                                    <Text size="sm">
                                        El sistema aplicó el modo <strong>{detalle.tipoDeCalculo}</strong>, justificado por la duración y frecuencia del servicio.
                                    </Text>
                                </Alert>
                                <Title order={4} className="section-subtitle" mt="md">Desglose de Conceptos</Title>
                                <Text fw={600} fz="sm" c="dimmed">COSTOS POR TIEMPO Y PERFORMANCE</Text>
                                <CostoLine label="Costo Base (Sueldo/Jornal)" value={detalle.costoBaseRemunerativo} />
                                <CostoLine label="Adicional por KM (Remun.)" value={detalle.adicionalKm} />
                                <CostoLine label="Viáticos por KM (No Remun.)" value={detalle.viaticoKm} />
                                <CostoLine label="Adicional Carga/Descarga" value={detalle.adicionalPorCargaDescarga} />
                                <CostoLine label="Adicional Fijo (No Remun.)" value={detalle.adicionalFijoNoRemunerativo} />
                                <Divider/>
                                <Title order={6} c="dimmed">COSTOS INDIRECTOS</Title>
                                <Alert variant="light" color="grape" title={detalle.costoIndirectoLabel} icon={<UserCheck />} radius="md" p="sm">
                                    <Text fz="xl" fw={700} ta="center">${(detalle.costoIndirecto || 0).toLocaleString('es-AR')}</Text>
                                </Alert>
                                <Divider my="sm" variant="dashed" />
                                <Paper p="sm" radius="md" withBorder bg="gray.0">
                                    <Group justify="space-between">
                                        <Title order={3}>Total Costo RRHH</Title>
                                        <Title order={3} c="blue.8">${totalFinal.toLocaleString('es-AR')}</Title>
                                    </Group>
                                </Paper>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }} className="print-col-5">
                        <Stack>
                            <Title order={4} className="section-subtitle">Análisis Visual</Title>
                            <Paper withBorder p="lg" radius="md" ta="center">
                                <Title order={6} c="dimmed">Composición del Costo Total</Title>
                                <RingProgress
                                    size={180}
                                    thickness={18}
                                    mx="auto"
                                    mt="xl"
                                    label={<Center><ThemeIcon variant="light" color="blue" size={80} radius={80}><TrendingUp size={40}/></ThemeIcon></Center>}
                                    sections={seccionesGrafico}
                                />
                                <Stack mt="xl" gap={4}>
                                   <Text span size="xs"><Badge color="blue" circle /> Remunerativo ({(totalRemunerativo/totalFinal*100).toFixed(1)}%)</Text>
                                   <Text span size="xs"><Badge color="teal" circle /> No Remunerativo ({(totalNoRemunerativo/totalFinal*100).toFixed(1)}%)</Text>
                                   <Text span size="xs"><Badge color="grape" circle /> Indirectos ({(totalIndirecto/totalFinal*100).toFixed(1)}%)</Text>
                                </Stack>
                            </Paper>
                            <Title order={4} className="section-subtitle" mt="md">Métricas de Rendimiento</Title>
                            <Paper withBorder p="lg" radius="md">
                                <Stack>
                                    <KpiMetrica icon={<Route size={22} />} value={`$${costoPorKm.toFixed(2)}`} label="Costo por Kilómetro Real" />
                                    <Divider />
                                    <KpiMetrica icon={<Clock size={22} />} value={`$${costoPorHora.toFixed(2)}`} label="Costo por Hora de Misión" />
                                    <Divider />
                                    <KpiMetrica icon={<Info size={22} />} value={detalle.kmParaPagar?.toLocaleString('es-AR')} label="KM Pagados (con mínimos)" unit="km" />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloRecursoHumanoCostos;