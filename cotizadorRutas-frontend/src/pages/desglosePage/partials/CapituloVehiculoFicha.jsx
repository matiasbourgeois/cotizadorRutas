// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoFicha.jsx (CORRECCIÓN FINAL)

// ✅ LÍNEA 'import React from 'react';' ELIMINADA
import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge } from '@mantine/core';

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
  // Verificación de seguridad
  if (!presupuesto?.vehiculo?.datos) return null;
  
  const { vehiculo } = presupuesto;

  return (
    <div className="page">
      <div className="header-table-placeholder"></div>
      <div className="content">
        <Title order={2} className="chapter-title">Capítulo 1: Ficha Técnica del Vehículo</Title>
        <Text c="dimmed" mb="xl">
          Parámetros base del vehículo seleccionado para el cálculo de costos operativos.
        </Text>

        <Paper withBorder p="xl" radius="md" className="spec-sheet-container">
            <Grid gutter="xl">
                {/* --- COLUMNA IZQUIERDA --- */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack>
                        <div>
                            <Divider my="md" label={<Text fw={500} fz="sm">Identificación y Especificaciones</Text>} labelPosition="left" />
                            <Stack gap="sm" mt="sm">
                                <InfoLine label="Vehículo" value={`${vehiculo.datos.marca} ${vehiculo.datos.modelo}`} />
                                <InfoLine label="Patente" value={vehiculo.datos.patente} />
                                <InfoLine label="Año" value={vehiculo.datos.año} />
                                <Group justify="space-between" mt="sm">
                                    <Text size="sm">Tipo:</Text>
                                    <Badge color="cyan" variant="light" size="lg">{vehiculo.datos.tipoVehiculo}</Badge>
                                </Group>
                                <InfoLine label="Capacidad de Carga" value={vehiculo.datos.capacidadKg.toLocaleString()} unit="kg" />
                                <InfoLine label="Volumen de Carga" value={vehiculo.datos.volumenM3.toLocaleString()} unit="m³" />
                            </Stack>
                        </div>
                        <div>
                           <Divider my="md" label={<Text fw={500} fz="sm">Costos Fijos Mensuales</Text>} labelPosition="left" />
                            <Stack gap="sm" mt="sm">
                                <InfoLine label="Seguro" value={`$${vehiculo.datos.costoSeguroMensual.toLocaleString()}`} />
                                <InfoLine label="Patente Provincial" value={`$${vehiculo.datos.costoPatenteProvincial.toLocaleString()}`} />
                                <InfoLine label="Patente Municipal" value={`$${vehiculo.datos.costoPatenteMunicipal.toLocaleString()}`} />
                                <InfoLine label="Mant. Preventivo" value={`$${vehiculo.datos.costoMantenimientoPreventivoMensual.toLocaleString()}`} />
                            </Stack>
                        </div>
                    </Stack>
                </Grid.Col>

                {/* --- COLUMNA DERECHA --- */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack>
                        <div>
                            <Divider my="md" label={<Text fw={500} fz="sm">Combustible y Rendimiento</Text>} labelPosition="left" />
                             <Group justify="space-between" mt="sm">
                                <Text size="sm">Combustible Principal:</Text>
                                <Badge color="gray" variant="light" size="lg">{vehiculo.datos.tipoCombustible}</Badge>
                            </Group>
                            <Stack gap="sm" mt="sm">
                                <InfoLine label="Tiene GNC" value={vehiculo.datos.tieneGNC ? 'Sí' : 'No'} />
                                <InfoLine label="Rendimiento Promedio" value={vehiculo.datos.rendimientoKmLitro} unit="km/l" />
                            </Stack>
                        </div>
                        <div>
                            <Divider my="md" label={<Text fw={500} fz="sm">Parámetros de Desgaste</Text>} labelPosition="left" />
                            <Stack gap="sm" mt="sm">
                                <InfoLine label="Valor Vehículo (Nuevo)" value={`$${vehiculo.datos.precioVehiculoNuevo.toLocaleString()}`} />
                                <InfoLine label="Vida Útil Vehículo" value={vehiculo.datos.kmsVidaUtilVehiculo.toLocaleString()} unit="km"/>
                                <InfoLine label="Cantidad de Cubiertas" value={vehiculo.datos.cantidadCubiertas} unit="un." />
                                <InfoLine label="Precio por Cubierta" value={`$${vehiculo.datos.precioCubierta.toLocaleString()}`} />
                                <InfoLine label="Vida Útil Cubiertas" value={vehiculo.datos.kmsVidaUtilCubiertas.toLocaleString()} unit="km" />
                                <InfoLine label="Costo Service Aceite" value={`$${vehiculo.datos.precioCambioAceite.toLocaleString()}`} />
                                <InfoLine label="Frecuencia Service" value={vehiculo.datos.kmsCambioAceite.toLocaleString()} unit="km" />
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

export default CapituloVehiculoFicha;