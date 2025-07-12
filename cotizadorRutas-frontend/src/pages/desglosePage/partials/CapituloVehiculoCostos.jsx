// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoCostos.jsx (Versión Rediseñada)

import { Paper, Title, Text, Group, Divider, Alert, Stack, Grid, Badge, RingProgress, Center } from '@mantine/core';
import { Info, Droplets, Fuel, ToyBrick, TrendingDown } from 'lucide-react';

// Componente de ayuda para mostrar cada línea de costo.
const CostoLine = ({ label, value, isTotal = false }) => (
    <Group justify="space-between" wrap="nowrap" mt={isTotal ? 'md' : 'xs'}>
        <Text size="sm" fw={isTotal ? 700 : 400}>{label}:</Text>
        <Text size="sm" fw={700}>${value.toLocaleString()}</Text>
    </Group>
);

const CapituloVehiculoCostos = ({ presupuesto }) => {
  if (!presupuesto?.vehiculo?.calculo?.detalle) return null;

  const { calculo, datos } = presupuesto.vehiculo;
  const { detalle, totalFinal } = calculo;
  
  const totalVariables = (detalle.combustible || 0) + (detalle.cubiertas || 0) + (detalle.aceite || 0) + (detalle.depreciacion || 0);
  const costoPorHora = presupuesto.duracionMin > 0 ? (totalFinal / (presupuesto.duracionMin / 60)) : 0;

  const seccionesGrafico = [
    { value: (detalle.combustible / totalVariables) * 100, color: 'orange', tooltip: `Combustible: $${detalle.combustible.toLocaleString()}` },
    { value: (detalle.depreciacion / totalVariables) * 100, color: 'grape', tooltip: `Depreciación: $${detalle.depreciacion.toLocaleString()}` },
    { value: (detalle.cubiertas / totalVariables) * 100, color: 'blue', tooltip: `Cubiertas: $${detalle.cubiertas.toLocaleString()}` },
    { value: (detalle.aceite / totalVariables) * 100, color: 'yellow', tooltip: `Aceite: $${detalle.aceite.toLocaleString()}` },
  ].filter(sec => sec.value > 0);


  return (
    <div className="page">
      <div className="header-table-placeholder"></div>
      <div className="content">
        <Title order={2} className="chapter-title">Capítulo 2: Impacto Económico del Vehículo</Title>
        <Text c="dimmed" mb="xl">
          Distribución de los costos operativos del vehículo para esta misión específica.
        </Text>

        <Grid gutter="xl">
            {/* --- COLUMNA IZQUIERDA: GRÁFICO Y ANÁLISIS --- */}
            <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack>
                    <Paper withBorder p="lg" radius="md" className="data-section">
                        <Title order={4} className="section-subtitle">Drivers del Costo Variable</Title>
                         <RingProgress
                            size={200}
                            thickness={20}
                            mx="auto"
                            mt="xl"
                            label={
                                <Center>
                                    <TrendingDown size={32} />
                                </Center>
                            }
                            sections={seccionesGrafico}
                        />
                         <Stack gap={4} mt="xl">
                           <Text size="xs"><Badge color="orange" circle /> Combustible</Text>
                           <Text size="xs"><Badge color="grape" circle /> Depreciación</Text>
                           <Text size="xs"><Badge color="blue" circle /> Cubiertas</Text>
                           <Text size="xs"><Badge color="yellow" circle /> Aceite y Filtros</Text>
                        </Stack>
                    </Paper>
                    <Alert color="indigo" title="Análisis de Sensibilidad" icon={<Info />} radius="md">
                        <Text size="sm">
                            Un aumento del 10% en el precio del combustible impactaría el costo total del vehículo en aprox. <strong>${(detalle.combustible * 0.1).toLocaleString()}</strong>.
                        </Text>
                    </Alert>
                </Stack>
            </Grid.Col>
            {/* --- COLUMNA DERECHA: DESGLOSE --- */}
            <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper withBorder p="xl" radius="md" className="data-section">
                    {/* Sección de Costos Variables */}
                    <Title order={4} className="section-subtitle">Costos Variables (por Uso)</Title>
                    <Text size="xs" c="dimmed" mb="md">Costos generados por cada kilómetro recorrido.</Text>
                    <Stack gap="xs">
                        <CostoLine label="Combustible / GNC" value={detalle.combustible} />
                        <CostoLine label="Depreciación del Vehículo" value={detalle.depreciacion} />
                        <CostoLine label="Desgaste de Cubiertas" value={detalle.cubiertas} />
                        <CostoLine label="Cambio de Aceite y Filtros" value={detalle.aceite} />
                        <Divider my="sm" />
                        <CostoLine label="Subtotal Variables" value={totalVariables} isTotal />
                    </Stack>

                    <Divider my="xl" />

                    {/* Sección de Costos Fijos */}
                    <Title order={4} className="section-subtitle">Costos Fijos (Asignados)</Title>
                    <Text size="xs" c="dimmed" mb="md">Parte proporcional de gastos mensuales asignada a la operación.</Text>
                    <CostoLine label={`Fijos Asignados (${(calculo.proporcionUso * 100).toFixed(1)}%)`} value={detalle.costosFijosProrrateados} />
                    
                    <Divider my="xl" />

                    {/* Total General */}
                    <Paper p="lg" radius="md" withBorder bg="gray.0">
                        <Group justify="space-between">
                            <Title order={3}>Total Costo Vehículo</Title>
                            <Title order={3} c="cyan.8">${totalFinal.toLocaleString()}</Title>
                        </Group>
                         <Text ta="right" c="dimmed" fz="sm">Equivale a un costo de ${costoPorHora.toFixed(2)} por hora de operación.</Text>
                    </Paper>
                </Paper>
            </Grid.Col>
        </Grid>
      </div>
      <div className="footer-placeholder"></div>
    </div>
  );
};

export default CapituloVehiculoCostos;