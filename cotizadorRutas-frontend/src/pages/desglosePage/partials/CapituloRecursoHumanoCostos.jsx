// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloRecursoHumanoCostos.jsx (Versión Rediseñada)

import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, RingProgress, Center, Badge } from '@mantine/core';
import { Info, UserCheck } from 'lucide-react';

const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" className="info-line-group">
        <Text size="sm" className="info-line-label">{label}:</Text>
        <Text size="sm" fw={600} ta="right" className="info-line-value">
            {value} <Text span c="dimmed" fz="xs">{unit}</Text>
        </Text>
    </Group>
);

const CapituloRecursoHumanoCostos = ({ presupuesto }) => {
    if (!presupuesto?.recursoHumano?.calculo?.detalle) {
        return null;
    }

    const { calculo } = presupuesto.recursoHumano;
    const { detalle, totalFinal } = calculo;

    // --- Cálculos para el Gráfico ---
    const totalRemunerativo = (detalle.costoBaseRemunerativo || 0) + (detalle.adicionalKm || 0) + (detalle.adicionalPorCargaDescarga || 0);
    const totalNoRemunerativo = (detalle.viaticoKm || 0) + (detalle.adicionalFijoNoRemunerativo || 0);
    const totalIndirecto = detalle.costoIndirecto || 0;

    const seccionesGrafico = [
        { value: totalFinal > 0 ? (totalRemunerativo / totalFinal) * 100 : 0, color: 'blue', tooltip: `Remunerativo: $${totalRemunerativo.toLocaleString()}` },
        { value: totalFinal > 0 ? (totalNoRemunerativo / totalFinal) * 100 : 0, color: 'teal', tooltip: `No Remunerativo: $${totalNoRemunerativo.toLocaleString()}` },
        { value: totalFinal > 0 ? (totalIndirecto / totalFinal) * 100 : 0, color: 'grape', tooltip: `Costos Indirectos: $${totalIndirecto.toLocaleString()}` },
    ].filter(sec => sec.value > 0);

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 4: Impacto Económico del Colaborador</Title>
                <Text c="dimmed" mb="xl">
                    Análisis detallado de los costos generados por el colaborador para esta operación específica.
                </Text>

                <Grid gutter="xl">
                    {/* --- COLUMNA IZQUIERDA: GRÁFICO PRINCIPAL Y TOTAL --- */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack>
                            <Paper withBorder p="lg" radius="md" className="data-section">
                                <Title order={4} className="section-subtitle">Composición del Costo Total</Title>
                                <Text size="xs" c="dimmed" mb="xl">Estructura de costos del colaborador.</Text>
                                <RingProgress
                                    size={220}
                                    thickness={22}
                                    rootColor="gray.1"
                                    mx="auto"
                                    label={
                                        <Stack align="center" gap={0}>
                                            <Text c="blue.8" fw={700} fz="2.5rem">${totalFinal.toLocaleString()}</Text>
                                            <Text c="dimmed" fz="xs">Costo Total RRHH</Text>
                                        </Stack>
                                    }
                                    sections={seccionesGrafico}
                                />
                                <Stack mt="xl" gap="sm">
                                    <Group><Paper bg="blue" w={15} h={15} radius="xl" /> <Text size="sm">Conceptos Remunerativos</Text></Group>
                                    <Group><Paper bg="teal" w={15} h={15} radius="xl" /> <Text size="sm">Conceptos No Remunerativos</Text></Group>
                                    <Group><Paper bg="grape" w={15} h={15} radius="xl" /> <Text size="sm">Costos Indirectos</Text></Group>
                                </Stack>
                            </Paper>
                             <Alert color="blue" title="Tipo de Cálculo Aplicado" icon={<Info />} radius="md">
                                <Text size="sm">
                                    Los costos se calcularon bajo la modalidad de <strong>{detalle.tipoDeCalculo}</strong>, basado en la duración y frecuencia del servicio.
                                </Text>
                            </Alert>
                        </Stack>
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: DESGLOSE DETALLADO --- */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper withBorder p="lg" radius="md" className="data-section">
                            <Title order={4} className="section-subtitle">Detalle de Conceptos</Title>
                             <Text size="xs" c="dimmed" mb="md">Descomposición de todos los costos asociados a la operación.</Text>

                            <Divider my="md" label="Conceptos Remunerativos" labelPosition="left" />
                            <Stack gap="xs">
                                <InfoLine label="Costo Base (Sueldo/Jornal)" value={`$${(detalle.costoBaseRemunerativo || 0).toLocaleString()}`} />
                                <InfoLine label="Adicional por KM" value={`$${(detalle.adicionalKm || 0).toLocaleString()}`} />
                                <InfoLine label="Adicional Carga/Descarga" value={`$${(detalle.adicionalPorCargaDescarga || 0).toLocaleString()}`} />
                            </Stack>

                            <Divider my="md" label="Conceptos No Remunerativos" labelPosition="left" />
                            <Stack gap="xs">
                                <InfoLine label="Viáticos por KM" value={`$${(detalle.viaticoKm || 0).toLocaleString()}`} />
                                <InfoLine label="Adicional Fijo" value={`$${(detalle.adicionalFijoNoRemunerativo || 0).toLocaleString()}`} />
                            </Stack>

                            <Divider my="md" label="Costos Indirectos" labelPosition="left" />
                            <Alert variant="light" color="grape" title={detalle.costoIndirectoLabel || 'Costo Indirecto'} icon={<UserCheck />} radius="md" mt="sm">
                                <Text fz="xl" fw={700} ta="center">${(detalle.costoIndirecto || 0).toLocaleString()}</Text>
                            </Alert>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloRecursoHumanoCostos;