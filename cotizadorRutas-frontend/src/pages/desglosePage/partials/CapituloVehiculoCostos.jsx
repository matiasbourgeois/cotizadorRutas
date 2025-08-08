// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoCostos.jsx

import { Paper, Title, Text, Group, Divider, Alert, Stack, Grid, RingProgress, Center, ThemeIcon, Badge } from '@mantine/core';
import { Info, Fuel, TrendingDown, Clock, Route, Hourglass } from 'lucide-react';

// Componente para una línea de costo en la cascada
const CostoLine = ({ label, value, isSubtotal = false }) => (
    <Group justify="space-between" wrap="nowrap" mt={isSubtotal ? 'sm' : 'xs'}>
        <Text size="sm" fw={isSubtotal ? 700 : 400}>{label}:</Text>
        <Text size="sm" fw={isSubtotal ? 700 : 500}>
            ${(value || 0).toLocaleString('es-AR')}
        </Text>
    </Group>
);

// Componente para una métrica clave en la columna derecha
const KpiMetrica = ({ icon, value, label, unit }) => (
    <Group>
        <ThemeIcon variant="light" size={36} radius="md">{icon}</ThemeIcon>
        <div>
            <Text fw={700} fz="lg">{value} <Text span fz="sm" c="dimmed">{unit}</Text></Text>
            <Text fz="xs" c="dimmed">{label}</Text>
        </div>
    </Group>
)

const CapituloVehiculoCostos = ({ presupuesto }) => {
  if (!presupuesto?.vehiculo?.calculo?.detalle) return null;

  const { calculo } = presupuesto.vehiculo;
  const { detalle, totalFinal, kmsMensuales, proporcionUso } = calculo;
  
  const totalVariables = (detalle.combustible || 0) + (detalle.cubiertas || 0) + (detalle.aceite || 0) + (detalle.depreciacion || 0);
  const totalFijos = detalle.costosFijosProrrateados || 0;

  const costoPorKm = kmsMensuales > 0 ? (totalFinal / kmsMensuales) : 0;
  
  const duracionTotalMisionMin = (presupuesto.duracionMin || 0) + 30; // 30 min de carga/descarga
  const viajesProyectados = presupuesto.frecuencia.tipo === 'mensual'
    ? ((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.12)
    : (presupuesto.frecuencia.vueltasTotales || 1);

  const horasTotalesMensuales = (duracionTotalMisionMin * viajesProyectados) / 60;
  const costoPorHora = horasTotalesMensuales > 0 ? (totalFinal / horasTotalesMensuales) : 0;


  const seccionesGrafico = [
    { value: totalFinal > 0 ? (totalVariables / totalFinal) * 100 : 0, color: 'orange', tooltip: `Variables: $${totalVariables.toLocaleString()}` },
    { value: totalFinal > 0 ? (totalFijos / totalFinal) * 100 : 0, color: 'grape', tooltip: `Fijos: $${totalFijos.toLocaleString()}` },
  ].filter(sec => sec.value > 0);


  return (
    <div className="page">
      <div className="header-table-placeholder"></div>
      <div className="content">
        <Title order={2} className="chapter-title">Capítulo 3: Análisis de Costos del Vehículo</Title>
        <Text c="dimmed" mb="xl">
          Desglose de los costos operativos, fijos y variables, generados por el activo en el contexto de esta misión específica.
        </Text>

        {/* ✅ CLASES DE IMPRESIÓN AÑADIDAS AQUÍ 👇 */}
        <Grid gutter="xl" className="print-grid">
            {/* --- COLUMNA IZQUIERDA: DESGLOSE DE COSTOS --- */}
            <Grid.Col span={{ base: 12, md: 7 }} className="print-col-7">
                <Paper withBorder p="xl" radius="md">
                    <Stack>
                        {/* SECCIÓN VARIABLES */}
                        <Title order={4} className="section-subtitle">Costos Variables (Por Uso)</Title>
                        <Text size="xs" c="dimmed" mt={-10} mb="xs">Generados por cada kilómetro recorrido en la misión.</Text>
                        <CostoLine label="Combustible / GNC" value={detalle.combustible} />
                        <CostoLine label="Desgaste de Cubiertas" value={detalle.cubiertas} />
                        <CostoLine label="Cambio de Aceite y Filtros" value={detalle.aceite} />
                        <CostoLine label="Depreciación del Vehículo" value={detalle.depreciacion} />
                        <Divider/>
                        <CostoLine label="Subtotal Variables" value={totalVariables} isSubtotal />

                        <Divider/>

                        {/* SECCIÓN FIJOS */}
                        <Title order={4} className="section-subtitle">Costos Fijos (Asignados)</Title>
                        <Alert color="blue" title="Metodología de Asignación" icon={<Info />} radius="md" mt="sm" p="sm">
                            <Text size="xs">
                                Se asigna una porción de los gastos fijos mensuales del vehículo en función del **tiempo de ocupación** de la misión.
                                El sistema determinó una proporción de uso diario del <strong>{(proporcionUso * 100).toFixed(1)}%</strong>.
                            </Text>
                        </Alert>
                        <CostoLine label="Costos Fijos Asignados" value={totalFijos} />
                        <Divider/>
                        <CostoLine label="Subtotal Fijos" value={totalFijos} isSubtotal />

                         <Divider variant="dashed" />

                        {/* TOTAL FINAL */}
                        <Paper p="lg" radius="md" withBorder bg="gray.0">
                            <Group justify="space-between">
                                <Title order={3}>Total Costo Vehículo</Title>
                                <Title order={3} c="cyan.8">${totalFinal.toLocaleString('es-AR')}</Title>
                            </Group>
                        </Paper>
                    </Stack>
                </Paper>
            </Grid.Col>
            
            {/* --- COLUMNA DERECHA: ANÁLISIS VISUAL Y KPIs --- */}
            <Grid.Col span={{ base: 12, md: 5 }} className="print-col-5">
                <Stack>
                    <Title order={4} className="section-subtitle">Análisis Visual</Title>
                    <Paper withBorder p="lg" radius="md">
                        <Title order={6} ta="center" c="dimmed">Composición del Costo Total</Title>
                         <RingProgress
                            size={180}
                            thickness={18}
                            mx="auto"
                            mt="xl"
                            label={<Center><ThemeIcon variant="light" size={80} radius={80}><TrendingDown size={40}/></ThemeIcon></Center>}
                            sections={seccionesGrafico}
                        />
                         <Group justify="center" mt="xl">
                           <Text span size="sm"><Badge color="orange" /> Variables ({(totalVariables / totalFinal * 100).toFixed(1)}%)</Text>
                           <Text span size="sm"><Badge color="grape" /> Fijos ({(totalFijos / totalFinal * 100).toFixed(1)}%)</Text>
                        </Group>
                    </Paper>

                    <Title order={4} className="section-subtitle" mt="md">Métricas de Rendimiento</Title>
                     <Paper withBorder p="lg" radius="md">
                        <Stack>
                            <KpiMetrica icon={<Route size={22} />} value={`$${costoPorKm.toFixed(2)}`} label="Costo por Kilómetro" />
                            <Divider />
                            <KpiMetrica icon={<Hourglass size={22} />} value={`$${costoPorHora.toFixed(2)}`} label="Costo por Hora de Operación" />
                            <Divider />
                            <KpiMetrica icon={<Fuel size={22} />} value={kmsMensuales.toLocaleString('es-AR')} label="Kilómetros Totales" unit="km/mes"/>
                            <Divider />
                             <KpiMetrica icon={<Clock size={22} />} value={horasTotalesMensuales.toFixed(1)} label="Horas de Misión Totales" unit="hs/mes"/>
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

export default CapituloVehiculoCostos;