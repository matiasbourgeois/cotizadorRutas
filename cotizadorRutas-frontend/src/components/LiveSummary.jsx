// Archivo: src/components/LiveSummary.jsx (Versión "Cockpit")

import { Paper, Text, Stack, Title, Divider, Loader, Center, Group, Accordion, ThemeIcon } from '@mantine/core';
import { useCotizacion } from '../context/Cotizacion';
import { Fuel, Wrench, ShieldCheck, User, Route, Box, Banknote, Truck } from 'lucide-react';

const CostoItem = ({ label, valor, fz = "sm", fw = 500 }) => (
    <Group justify="space-between">
        <Text fz={fz} c="dimmed">{label}</Text>
        <Text fz={fz} fw={fw}>
            ${(valor || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
        </Text>
    </Group>
);

export const LiveSummary = ({ loading }) => {
    // ✅ Obtenemos también el desglose detallado del contexto
    const { resumenCostos, detalleVehiculo, detalleRecurso } = useCotizacion();

    if (loading) {
        return (
            <Paper withBorder p="md" radius="md" mt="xl">
                <Center><Loader size="sm" /><Text ml="sm" fz="sm" c="dimmed">Calculando...</Text></Center>
            </Paper>
        );
    }
    
    if (!resumenCostos) {
        return null; 
    }

    // Desglosamos los costos del vehículo y del recurso si existen
    const costosVariablesVehiculo = (detalleVehiculo?.detalle.combustible || 0) + (detalleVehiculo?.detalle.cubiertas || 0) + (detalleVehiculo?.detalle.aceite || 0);
    const costosFijosVehiculo = detalleVehiculo?.detalle.costosFijosProrrateados || 0;
    
    const costosSalariales = (detalleRecurso?.detalle.sueldoProporcional || 0) + (detalleRecurso?.detalle.adicionalActividad || 0) + (detalleRecurso?.detalle.cargasSociales || 0);
    const costosViaticos = (detalleRecurso?.detalle.adicionalKm || 0) + (detalleRecurso?.detalle.viaticoKm || 0) + (detalleRecurso?.detalle.adicionalFijo || 0);

    return (
        <Paper withBorder p="md" radius="md" mt="xl" bg="gray.0">
            <Stack>
                <Title order={5} c="deep-blue.7">Resumen de Misión</Title>
                <Divider />

                {/* ✅ Usamos un Accordion para el desglose */}
                <Accordion variant="transparent">
                    <Accordion.Item value="vehiculo">
                        <Accordion.Control icon={<ThemeIcon color="blue" variant="light" size="lg"><Truck size={18} /></ThemeIcon>}>
                            <CostoItem label="Costo Vehículo" valor={resumenCostos.totalVehiculo} />
                        </Accordion.Control>
                        <Accordion.Panel>
                            <CostoItem label="Combustible y Desgaste" valor={costosVariablesVehiculo} fz="xs" />
                            <CostoItem label="Fijos (Seguro, Patente)" valor={costosFijosVehiculo} fz="xs" />
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="rrhh">
                        <Accordion.Control icon={<ThemeIcon color="teal" variant="light" size="lg"><User size={18} /></ThemeIcon>}>
                           <CostoItem label="Costo RRHH" valor={resumenCostos.totalRecurso} />
                        </Accordion.Control>
                        <Accordion.Panel>
                           <CostoItem label="Salario y Cargas" valor={costosSalariales} fz="xs" />
                           <CostoItem label="Viáticos y Adicionales" valor={costosViaticos} fz="xs" />
                        </Accordion.Panel>
                    </Accordion.Item>
                    
                    <Accordion.Item value="operacion">
                        <Accordion.Control icon={<ThemeIcon color="gray" variant="light" size="lg"><Banknote size={18} /></ThemeIcon>}>
                           <CostoItem label="Costos Operativos" valor={resumenCostos.totalPeajes + resumenCostos.otrosCostos + resumenCostos.totalAdministrativo} />
                        </Accordion.Control>
                        <Accordion.Panel>
                           <CostoItem label="Peajes" valor={resumenCostos.totalPeajes} fz="xs" />
                           <CostoItem label="Administrativos" valor={resumenCostos.totalAdministrativo} fz="xs" />
                           <CostoItem label="Otros" valor={resumenCostos.otrosCostos} fz="xs" />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                
                <Divider mt="md" />

                <CostoItem label="Total Operativo" valor={resumenCostos.totalOperativo} fw={700} />
                <CostoItem label={`Ganancia (${resumenCostos.ganancia > 0 ? ((resumenCostos.ganancia / resumenCostos.totalOperativo) * 100).toFixed(0) : 0}%)`} valor={resumenCostos.ganancia} fw={700} />

                <Paper p="sm" withBorder radius="md" bg="cyan.0">
                    <Group justify="space-between">
                        <Text fz="lg" fw={700} c="cyan.9">Total Final</Text>
                        <Text fz="lg" fw={700} c="cyan.9">
                            ${(resumenCostos.totalFinal || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </Text>
                    </Group>
                </Paper>
            </Stack>
        </Paper>
    );
};