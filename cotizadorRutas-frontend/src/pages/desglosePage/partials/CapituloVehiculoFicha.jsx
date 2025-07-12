// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoFicha.jsx (Versión Rediseñada)

import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge, SimpleGrid, RingProgress, Center, ThemeIcon } from '@mantine/core';
import { Car, Gauge, Wallet, Wrench } from 'lucide-react';

// Componente reutilizable para cada línea de información.
const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" gap="xl">
        <Text size="sm">{label}:</Text>
        <Text size="sm" fw={600} ta="right">
            {value} <Text span c="dimmed" fz="xs">{unit}</Text>
        </Text>
    </Group>
);

const CapituloVehiculoFicha = ({ presupuesto }) => {
  if (!presupuesto?.vehiculo?.datos) return null;
  
  const { datos } = presupuesto.vehiculo;

  // Cálculos para KPIs y el gráfico
  const costoCombustiblePorKm = datos.rendimientoKmLitro > 0 ? (datos.precioLitroCombustible / datos.rendimientoKmLitro) : 0;
  const costoTotalFijoMensual = (datos.costoSeguroMensual || 0) + (datos.costoPatenteProvincial || 0) + (datos.costoPatenteMunicipal || 0) + (datos.costoMantenimientoPreventivoMensual || 0);

  const seccionesGrafico = [
    { value: (datos.costoSeguroMensual / costoTotalFijoMensual) * 100, color: 'cyan', tooltip: `Seguro: $${datos.costoSeguroMensual.toLocaleString()}` },
    { value: (datos.costoPatenteProvincial / costoTotalFijoMensual) * 100, color: 'blue', tooltip: `Patente Prov: $${datos.costoPatenteProvincial.toLocaleString()}` },
    { value: (datos.costoPatenteMunicipal / costoTotalFijoMensual) * 100, color: 'indigo', tooltip: `Patente Mun: $${datos.costoPatenteMunicipal.toLocaleString()}` },
    { value: (datos.costoMantenimientoPreventivoMensual / costoTotalFijoMensual) * 100, color: 'grape', tooltip: `Mantenimiento: $${datos.costoMantenimientoPreventivoMensual.toLocaleString()}` },
  ].filter(sec => sec.value > 0);

  return (
    <div className="page">
      <div className="header-table-placeholder"></div>
      <div className="content">
        <Title order={2} className="chapter-title">Capítulo 1: Diagnóstico de Activo</Title>
        <Text c="dimmed" mb="xl">
          Análisis técnico-económico del vehículo asignado a la operación.
        </Text>

        <Paper withBorder p="xl" radius="md" className="spec-sheet-container">
            <Grid gutter="xl">
                {/* --- COLUMNA IZQUIERDA: DATOS Y KPIs --- */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Stack>
                        <Group>
                            <ThemeIcon size="lg" variant="light" color="cyan"><Car size={24} /></ThemeIcon>
                            <Title order={3}>{datos.marca} {datos.modelo} ({datos.año})</Title>
                            <Badge size="lg" variant="outline">{datos.patente}</Badge>
                        </Group>
                        
                        <SimpleGrid cols={2} mt="md">
                            <Paper withBorder p="md" radius="sm">
                                <Text size="xs" c="dimmed">COSTO COMBUSTIBLE</Text>
                                <Text size="xl" fw={700}>${costoCombustiblePorKm.toFixed(2)}</Text>
                                <Text size="xs" c="dimmed">por km</Text>
                            </Paper>
                             <Paper withBorder p="md" radius="sm">
                                <Text size="xs" c="dimmed">COSTOS FIJOS</Text>
                                <Text size="xl" fw={700}>${costoTotalFijoMensual.toLocaleString()}</Text>
                                <Text size="xs" c="dimmed">por mes</Text>
                            </Paper>
                        </SimpleGrid>

                        <Divider my="sm" label={<Text fz="xs">Parámetros de Desgaste (Variables por KM)</Text>} />
                        <InfoLine label="Valor a depreciar" value={`$${(datos.precioVehiculoNuevo * (1 - (datos.valorResidualPorcentaje / 100))).toLocaleString()}`} unit={`en ${datos.kmsVidaUtilVehiculo.toLocaleString()} km`} />
                        <InfoLine label="Costo de Cubiertas" value={`$${(datos.precioCubierta * datos.cantidadCubiertas).toLocaleString()}`} unit={`cada ${datos.kmsVidaUtilCubiertas.toLocaleString()} km`} />
                        <InfoLine label="Costo de Service de Aceite" value={`$${datos.precioCambioAceite.toLocaleString()}`} unit={`cada ${datos.kmsCambioAceite.toLocaleString()} km`} />
                    </Stack>
                </Grid.Col>

                {/* --- COLUMNA DERECHA: GRÁFICO --- */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                     <Paper withBorder p="md" radius="sm" style={{height: '100%'}}>
                        <Stack align="center" justify="center" h="100%">
                            <Text fw={500}>Composición del Costo Fijo Mensual</Text>
                             <RingProgress
                                size={180}
                                thickness={18}
                                roundCaps
                                label={
                                    <Center>
                                        <Wallet size={32} />
                                    </Center>
                                }
                                sections={seccionesGrafico}
                            />
                            <Stack gap={4} mt="md">
                               <Text size="xs"><Badge color="cyan" circle /> Seguro</Text>
                               <Text size="xs"><Badge color="blue" circle /> Patente Provincial</Text>
                               <Text size="xs"><Badge color="indigo" circle /> Patente Municipal</Text>
                               <Text size="xs"><Badge color="grape" circle /> Mantenimiento</Text>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Paper>
      </div>
      <div className="footer-placeholder"></div>
    </div>
  );
};

export default CapituloVehiculoFicha;