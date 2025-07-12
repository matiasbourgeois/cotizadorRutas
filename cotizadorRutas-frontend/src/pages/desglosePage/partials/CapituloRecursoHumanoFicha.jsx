// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloRecursoHumanoFicha.jsx (Versión Rediseñada)

import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { User, Wallet, Percent, Truck, HandCoins } from 'lucide-react';

const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" className="info-line-group">
        <Text size="sm" className="info-line-label">{label}:</Text>
        <Text size="sm" fw={600} ta="right" className="info-line-value">
            {value} <Text span c="dimmed" fz="xs">{unit}</Text>
        </Text>
    </Group>
);

const CapituloRecursoHumanoFicha = ({ presupuesto }) => {
    if (!presupuesto?.recursoHumano?.datos) return null;

    const { datos } = presupuesto.recursoHumano;

    const base = datos.sueldoBasico || 0;
    const actividad = base * ((datos.adicionalActividadPorc || 0) / 100);
    const fijoNoRem = datos.adicionalNoRemunerativoFijo || 0;
    const totalBase = base + actividad + fijoNoRem;

    const seccionesGrafico = [
        { value: (base / totalBase) * 100, color: 'blue', tooltip: `Sueldo Básico: $${base.toLocaleString()}` },
        { value: (actividad / totalBase) * 100, color: 'cyan', tooltip: `Ad. Actividad: $${actividad.toLocaleString()}` },
        { value: (fijoNoRem / totalBase) * 100, color: 'grape', tooltip: `Fijo No Rem.: $${fijoNoRem.toLocaleString()}` },
    ].filter(sec => sec.value > 0);

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 3: Perfil de Talento y Costos</Title>
                <Text c="dimmed" mb="xl">
                    Parámetros base del colaborador asignado y estructura de su compensación.
                </Text>

                <Grid gutter="xl">
                    {/* --- COLUMNA IZQUIERDA: DATOS Y ESTRUCTURA SALARIAL --- */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Stack>
                            <Paper withBorder p="lg" radius="md">
                                <Group>
                                    <ThemeIcon size="lg" variant="light"><User size={24} /></ThemeIcon>
                                    <Title order={3}>{datos.nombre}</Title>
                                    <Badge size="lg" variant="light" color={datos.tipoContratacion === 'empleado' ? 'teal' : 'orange'}>
                                        {datos.tipoContratacion}
                                    </Badge>
                                </Group>
                            </Paper>
                            
                            <Title order={4} className="section-subtitle" mt="md">Estructura Salarial Base</Title>
                            <Paper withBorder p="lg" radius="md">
                                <InfoLine label="Sueldo Básico (Convenio)" value={`$${(datos.sueldoBasico || 0).toLocaleString()}`} />
                                <InfoLine label="Adicional por Actividad" value={`${(datos.adicionalActividadPorc || 0)}%`} />
                                <InfoLine label="Adicional Fijo (No Remunerativo)" value={`$${(datos.adicionalNoRemunerativoFijo || 0).toLocaleString()}`} />
                            </Paper>

                            <Title order={4} className="section-subtitle" mt="md">Incentivos por Performance</Title>
                             <Paper withBorder p="lg" radius="md">
                                <InfoLine label="Adicional por KM (Remunerativo)" value={`$${(datos.adicionalKmRemunerativo || 0)}`} unit="/ km" />
                                <InfoLine label="Viático por KM (No Remun.)" value={`$${(datos.viaticoPorKmNoRemunerativo || 0)}`} unit="/ km" />
                                <InfoLine label="Adicional Carga/Descarga" value={`$${(datos.adicionalCargaDescargaCadaXkm || 0).toLocaleString()}`} unit={`cada ${datos.kmPorUnidadDeCarga} km`} />
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: GRÁFICO Y COSTOS INDIRECTOS --- */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack>
                            <Paper withBorder p="lg" radius="md" style={{height: '100%'}}>
                                <Title order={5} ta="center">Composición del Salario Base Total</Title>
                                <RingProgress
                                    size={200}
                                    thickness={20}
                                    mx="auto"
                                    mt="xl"
                                    roundCaps
                                    label={<Center><Wallet size={32} /></Center>}
                                    sections={seccionesGrafico}
                                />
                                <Stack gap={4} mt="lg" align="center">
                                   <Text size="xs"><Badge color="blue" circle /> Sueldo Básico</Text>
                                   <Text size="xs"><Badge color="cyan" circle /> Adic. Actividad</Text>
                                   <Text size="xs"><Badge color="grape" circle /> Adic. Fijo No Rem.</Text>
                                </Stack>
                            </Paper>

                            <Title order={4} className="section-subtitle" mt="md">Costos Indirectos</Title>
                            <Paper withBorder p="lg" radius="md">
                                {datos.tipoContratacion === 'empleado' ? (
                                    <InfoLine label="Cargas Sociales sobre Remunerativo" value={`${datos.porcentajeCargasSociales}%`} />
                                ) : (
                                    <InfoLine label="Overhead sobre Bruto" value={`${datos.porcentajeOverheadContratado}%`} />
                                )}
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloRecursoHumanoFicha;