// Archivo: cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoCostos.jsx (VERSIÓN ROBUSTA)

import { Paper, Title, Text, Group, Divider, Alert, Stack } from '@mantine/core';
import { Info } from 'lucide-react';

// Componente de ayuda para mostrar cada línea de costo.
const CostoLine = ({ label, value, isTotal = false }) => (
    <Group justify="space-between" wrap="nowrap" mt={isTotal ? 'md' : 'xs'}>
        <Text size="sm" fw={isTotal ? 700 : 400}>{label}:</Text>
        <Text size="sm" fw={700}>${value.toLocaleString()}</Text>
    </Group>
);

const CapituloVehiculoCostos = ({ presupuesto }) => {
  // Verificación de seguridad para evitar cualquier error al cargar.
  if (!presupuesto?.vehiculo?.calculo?.detalle) {
    return null;
  }

  const { calculo } = presupuesto.vehiculo;
  const { detalle, totalFinal } = calculo;

  const totalVariables = (detalle.combustible || 0) + (detalle.cubiertas || 0) + (detalle.aceite || 0) + (detalle.depreciacion || 0);

  return (
    <div className="page">
      <div className="header-table-placeholder"></div>
      <div className="content">
        <Title order={2} className="chapter-title">Capítulo 2: Desglose de Costos del Vehículo</Title>
        <Text c="dimmed" mb="xl">
          Análisis detallado de los costos generados por el vehículo para esta operación específica.
        </Text>

        <Paper withBorder p="xl" radius="md" className="spec-sheet-container">
            {/* Sección de Costos Variables */}
            <Title order={4} className="section-subtitle">Costos Variables (por Uso)</Title>
            <Text size="xs" c="dimmed" mb="md">Costos directos generados por cada kilómetro recorrido en el servicio.</Text>
            <Stack gap="xs">
                <CostoLine label="Combustible / GNC" value={detalle.combustible} />
                <CostoLine label="Desgaste de Cubiertas" value={detalle.cubiertas} />
                <CostoLine label="Cambio de Aceite y Filtros" value={detalle.aceite} />
                <CostoLine label="Depreciación del Vehículo" value={detalle.depreciacion} />
                <Divider my="sm" />
                <CostoLine label="Subtotal Variables" value={totalVariables} isTotal />
            </Stack>

            <Divider my="xl" />

            {/* Sección de Costos Fijos */}
            <Title order={4} className="section-subtitle">Costos Fijos (Asignados)</Title>
            <Text size="xs" c="dimmed" mb="md">Parte proporcional de los gastos mensuales del vehículo asignada a esta operación.</Text>
            <Alert 
                variant="light" 
                color="indigo" 
                title={`Se asigna un ${ (calculo.proporcionUso * 100).toFixed(1) }% del costo fijo total`}
                icon={<Info />} 
                radius="md"
            >
                <CostoLine label="Total Fijos Asignados" value={detalle.costosFijosProrrateados} />
            </Alert>
            
            <Divider my="xl" />

            {/* Total General */}
            <Paper p="lg" radius="md" withBorder bg="gray.0">
                <Group justify="space-between">
                    <Title order={3}>Total Costo Vehículo</Title>
                    <Title order={3} c="cyan.8">${totalFinal.toLocaleString()}</Title>
                </Group>
            </Paper>
        </Paper>
      </div>
      <div className="footer-placeholder"></div>
    </div>
  );
};

export default CapituloVehiculoCostos;