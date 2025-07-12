import { Paper, Title, Grid, Stack, Divider, Text, Group, Alert, RingProgress, Badge } from '@mantine/core';
import { Info } from 'lucide-react';

const CapituloRecursoHumanoCostos = ({ presupuesto }) => {
    // Verificación de seguridad
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
    ];

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 4: Desglose de Costos de Recurso Humano</Title>
                <Text c="dimmed" mb="xl">
                    Análisis detallado de los costos generados por el colaborador para la operación.
                </Text>

                <Grid gutter="xl">
                    {/* --- COLUMNA IZQUIERDA: GRÁFICO PRINCIPAL --- */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
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
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: DESGLOSE DETALLADO --- */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper withBorder p="lg" radius="md" className="data-section">
                            <Group justify="space-between">
                                <Title order={4} className="section-subtitle">Detalle de Conceptos</Title>
                                <Badge variant="light" color="gray">{detalle.tipoDeCalculo}</Badge>
                            </Group>
                            <Text size="xs" c="dimmed" mb="md">Descomposición de todos los costos asociados.</Text>

                            <Divider my="md" label="Remunerativos" labelPosition="left" />
                            <Stack gap="xs">
                                <Group justify="space-between"><Text size="sm">Costo Base (Sueldo/Jornal):</Text><Text size="sm" fw={600}>${detalle.costoBaseRemunerativo.toLocaleString()}</Text></Group>
                                <Group justify="space-between"><Text size="sm">Adicional por KM:</Text><Text size="sm" fw={600}>${detalle.adicionalKm.toLocaleString()}</Text></Group>
                                <Group justify="space-between"><Text size="sm">Adicional Carga/Descarga:</Text><Text size="sm" fw={600}>${detalle.adicionalPorCargaDescarga.toLocaleString()}</Text></Group>
                            </Stack>

                             <Divider my="md" label="No Remunerativos" labelPosition="left" />
                            <Stack gap="xs">
                                <Group justify="space-between"><Text size="sm">Viáticos por KM:</Text><Text size="sm" fw={600}>${detalle.viaticoKm.toLocaleString()}</Text></Group>
                                <Group justify="space-between"><Text size="sm">Adicional Fijo:</Text><Text size="sm" fw={600}>${detalle.adicionalFijoNoRemunerativo.toLocaleString()}</Text></Group>
                            </Stack>

                            <Divider my="md" label="Indirectos" labelPosition="left" />
                            <Alert variant="light" color="grape" title={detalle.costoIndirectoLabel} icon={<Info />} radius="md">
                                <Text fz="lg" fw={700} ta="center">${detalle.costoIndirecto.toLocaleString()}</Text>
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