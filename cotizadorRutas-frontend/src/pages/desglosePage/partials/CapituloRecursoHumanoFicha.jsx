// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloRecursoHumanoFicha.jsx

import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { User, Wallet, PiggyBank } from 'lucide-react';

// Componente reutilizable para las líneas de información
const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" mt="xs" align="center">
        <Text size="sm" c="dimmed">{label}:</Text>
        <Text size="sm" fw={600} ta="right">
            {value}
            <Text component="span" c="dimmed" fz="xs" ml={4}>{unit}</Text>
        </Text>
    </Group>
);

const CapituloRecursoHumanoFicha = ({ presupuesto }) => {
    if (!presupuesto?.recursoHumano?.datos) return null;

    const { datos } = presupuesto.recursoHumano;

    // Cálculos para el gráfico del salario base
    const base = datos.sueldoBasico || 0;
    const actividad = base * ((datos.adicionalActividadPorc || 0) / 100);
    const fijoNoRem = datos.adicionalNoRemunerativoFijo || 0;
    const totalBaseGrafico = base + actividad + fijoNoRem;

    const seccionesGrafico = [
        { value: totalBaseGrafico > 0 ? (base / totalBaseGrafico) * 100 : 0, color: 'blue', tooltip: `Básico: $${base.toLocaleString('es-AR')}` },
        { value: totalBaseGrafico > 0 ? (actividad / totalBaseGrafico) * 100 : 0, color: 'cyan', tooltip: `Actividad: $${actividad.toLocaleString('es-AR')}` },
        { value: totalBaseGrafico > 0 ? (fijoNoRem / totalBaseGrafico) * 100 : 0, color: 'grape', tooltip: `Fijo No Rem.: $${fijoNoRem.toLocaleString('es-AR')}` },
    ].filter(sec => sec.value > 0);

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 4: Perfil de Talento y Parámetros de Costo</Title>
                <Text c="dimmed" mb="xl">
                    Parámetros base del colaborador asignado y estructura de su compensación, utilizados para el cálculo de costos.
                </Text>

                {/* ✅ CLASES DE IMPRESIÓN AÑADIDAS AQUÍ 👇 */}
                <Grid gutter="xl" className="print-grid">
                    {/* --- COLUMNA IZQUIERDA: IDENTIFICACIÓN Y COMPENSACIÓN DIRECTA --- */}
                    <Grid.Col span={{ base: 12, md: 7 }} className="print-col-7">
                        <Stack>
                            {/* IDENTIFICACIÓN */}
                            <Group>
                                <ThemeIcon size="xl" variant="light" color="blue" radius="md"><User size={28} /></ThemeIcon>
                                <Title order={3}>{datos.nombre}</Title>
                                <Badge size="xl" variant="light" color={datos.tipoContratacion === 'empleado' ? 'teal' : 'orange'}>
                                    {datos.tipoContratacion}
                                </Badge>
                            </Group>

                            {/* COMPENSACIÓN BASE */}
                            <Title order={4} className="section-subtitle">Compensación Base Mensual</Title>
                            <Paper withBorder p="lg" radius="md">
                                <Stack>
                                    <InfoLine label="Sueldo Básico (Convenio)" value={`$${(datos.sueldoBasico || 0).toLocaleString('es-AR')}`} />
                                    <InfoLine label="Adicional por Actividad" value={`${(datos.adicionalActividadPorc || 0)}%`} />
                                    <InfoLine label="Adicional Fijo (No Remunerativo)" value={`$${(datos.adicionalNoRemunerativoFijo || 0).toLocaleString('es-AR')}`} />
                                    <Divider my="sm"/>
                                    <InfoLine label="Horas Laborales de Referencia" value={`${datos.horasLaboralesMensuales || 192}`} unit="hs/mes" />
                                </Stack>
                            </Paper>
                            
                            {/* INCENTIVOS VARIABLES */}
                            <Title order={4} className="section-subtitle">Incentivos por Performance</Title>
                             <Paper withBorder p="lg" radius="md">
                                <Stack>
                                    <InfoLine label="Adicional por KM (Remunerativo)" value={`$${(datos.adicionalKmRemunerativo || 0)}`} unit="/ km" />
                                    <InfoLine label="Viático por KM (No Remun.)" value={`$${(datos.viaticoPorKmNoRemunerativo || 0)}`} unit="/ km" />
                                    <InfoLine label="Adicional Carga/Descarga" value={`$${(datos.adicionalCargaDescargaCadaXkm || 0).toLocaleString('es-AR')}`} unit={`cada ${datos.kmPorUnidadDeCarga} km`} />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    {/* --- COLUMNA DERECHA: REGLAS Y VISUALIZACIÓN --- */}
                    <Grid.Col span={{ base: 12, md: 5 }} className="print-col-5">
                        <Stack>
                             {/* REGLAS DE CÁLCULO */}
                             <Title order={4} className="section-subtitle">Reglas de Cálculo</Title>
                             <Paper withBorder p="lg" radius="md">
                                <Stack>
                                    <InfoLine label="Min. de Minutos Facturables" value={datos.minimoMinutosFacturables || 120} unit="min" />
                                    <InfoLine label="Min. KM para Adicional Rem." value={datos.minKmRemunerativo || 350} unit="km" />
                                    <InfoLine label="Min. KM para Viático" value={datos.minKmNoRemunerativo || 350} unit="km" />
                                </Stack>
                             </Paper>

                             {/* COSTOS INDIRECTOS */}
                             <Title order={4} className="section-subtitle">Costos Indirectos</Title>
                            <Paper withBorder p="lg" radius="md">
                                <Stack>
                                    {datos.tipoContratacion === 'empleado' ? (
                                        <InfoLine label="Cargas Sociales sobre Rem." value={`${datos.porcentajeCargasSociales}%`} />
                                    ) : (
                                        <InfoLine label="Overhead sobre Bruto" value={`${datos.porcentajeOverheadContratado}%`} />
                                    )}
                                </Stack>
                            </Paper>

                            {/* GRÁFICO */}
                             <Title order={4} className="section-subtitle">Composición Salario Base</Title>
                            <Paper withBorder p="lg" radius="md" ta="center">
                                <RingProgress
                                    size={160}
                                    thickness={16}
                                    mx="auto"
                                    roundCaps
                                    label={<Center><ThemeIcon variant="light" color="blue" size={70} radius={70}><PiggyBank size={36} /></ThemeIcon></Center>}
                                    sections={seccionesGrafico}
                                />
                                <Stack gap={4} mt="lg" align="center">
                                   <Text span size="xs"><Badge color="blue" circle /> Sueldo Básico</Text>
                                   <Text span size="xs"><Badge color="cyan" circle /> Adic. Actividad</Text>
                                   <Text span size="xs"><Badge color="grape" circle /> Adic. Fijo No Rem.</Text>
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

export default CapituloRecursoHumanoFicha;