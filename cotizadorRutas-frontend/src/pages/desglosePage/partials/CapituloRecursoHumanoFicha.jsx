import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge } from '@mantine/core';

// Componente de ayuda para mantener la consistencia en el diseño
const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" gap="xl">
        <Text size="sm">{label}:</Text>
        <Text size="sm" fw={600} ta="right">
            {value} <Text span c="dimmed" fz="xs">{unit}</Text>
        </Text>
    </Group>
);

const CapituloRecursoHumanoFicha = ({ presupuesto }) => {
    // Verificación de seguridad para evitar errores si los datos no han cargado
    if (!presupuesto?.recursoHumano?.datos) {
        return null;
    }

    const { recursoHumano } = presupuesto;
    const { datos } = recursoHumano;

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 3: Ficha del Recurso Humano</Title>
                <Text c="dimmed" mb="xl">
                    Parámetros base del colaborador asignado, utilizados para el cálculo de su costo en la operación.
                </Text>

                <Paper withBorder p="xl" radius="md" className="spec-sheet-container">
                    <Grid gutter="xl">
                        {/* --- COLUMNA IZQUIERDA: DATOS PRINCIPALES --- */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack>
                                <div>
                                    <Divider my="md" label={<Text fw={500} fz="sm">Identificación y Modalidad</Text>} labelPosition="left" />
                                    <Stack gap="sm" mt="sm">
                                        <InfoLine label="Nombre" value={datos.nombre} />
                                        <Group justify="space-between" mt="sm">
                                            <Text size="sm">Modalidad:</Text>
                                            <Badge color={datos.tipoContratacion === 'empleado' ? 'teal' : 'orange'} variant="light" size="lg">
                                                {datos.tipoContratacion}
                                            </Badge>
                                        </Group>
                                    </Stack>
                                </div>
                                <div>
                                    <Divider my="md" label={<Text fw={500} fz="sm">Parámetros Salariales</Text>} labelPosition="left" />
                                    <Stack gap="sm" mt="sm">
                                        <InfoLine label="Sueldo Básico (Referencia)" value={`$${datos.sueldoBasico.toLocaleString()}`} />
                                        <InfoLine label="Adicional Actividad" value={datos.adicionalActividadPorc} unit="%" />
                                        <InfoLine label="Adicional Fijo (No Remun.)" value={`$${datos.adicionalNoRemunerativoFijo.toLocaleString()}`} />
                                    </Stack>
                                </div>
                            </Stack>
                        </Grid.Col>

                        {/* --- COLUMNA DERECHA: COSTOS VARIABLES E INDIRECTOS --- */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                             <Stack>
                                <div>
                                    <Divider my="md" label={<Text fw={500} fz="sm">Parámetros de Costos Variables</Text>} labelPosition="left" />
                                    <Stack gap="sm" mt="sm">
                                        <InfoLine label="Adicional por KM (Remun.)" value={`$${datos.adicionalKmRemunerativo}`} unit="/ km" />
                                        <InfoLine label="Viático por KM (No Remun.)" value={`$${datos.viaticoPorKmNoRemunerativo}`} unit="/ km" />
                                        <InfoLine label="Adicional Carga/Descarga" value={`$${datos.adicionalCargaDescargaCadaXkm.toLocaleString()} cada ${datos.kmPorUnidadDeCarga} km`} />
                                    </Stack>
                                </div>
                                <div>
                                    <Divider my="md" label={<Text fw={500} fz="sm">Parámetros de Costos Indirectos</Text>} labelPosition="left" />
                                    <Stack gap="sm" mt="sm">
                                        <InfoLine label="Cargas Sociales (si empleado)" value={datos.porcentajeCargasSociales} unit="%" />
                                        <InfoLine label="Overhead (si contratado)" value={datos.porcentajeOverheadContratado} unit="%" />
                                    </Stack>
                                </div>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloRecursoHumanoFicha;