// Archivo: src/components/ResumenPaso.jsx (Versión Final con Leyenda de Gráfico)

import { useState } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import { Paper, Title, Text, Stack, Group, ThemeIcon, Divider, Center, Loader, Progress, Grid, Badge } from '@mantine/core';
import { MapPin, Calendar, Truck, User, Target, AlertCircle, Clock, Route, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from 'react-router-dom';

// -- Sub-componente para Métricas Clave (Parte Superior) --
const MetricItem = ({ icon: Icon, label, value }) => (
    <Grid.Col span={6}>
        <Group gap="sm" wrap="nowrap">
            <ThemeIcon color="gray" variant="light" size={36} radius="md">
                <Icon size={18} />
            </ThemeIcon>
            <div>
                <Text fz="xs" c="dimmed" lh={1.2}>{label}</Text>
                <Text fz="sm" fw={600} c="deep-blue.8">{value}</Text>
            </div>
        </Group>
    </Grid.Col>
);

// -- Sub-componente para el desglose dentro de la tarjeta interactiva --
const CostoDesglosadoItem = ({ label, valor }) => (
    <Group justify="space-between" gap="xs" mt={4}>
        <Text fz="xs" c="dimmed">{label}</Text>
        <Text fz="xs" fw={500}>
            ${(valor || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
        </Text>
    </Group>
);

// -- Sub-componente para las TARJETAS INTERACTIVAS --
const CostCard = ({ icon: Icon, title, selection, cost, children, isLoading, color }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Paper 
                withBorder 
                p="md" 
                radius="md" 
                onClick={() => selection && setIsExpanded(!isExpanded)} 
                style={{ cursor: selection ? 'pointer' : 'default' }}
            >
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Group gap="sm">
                            <ThemeIcon color={color} variant="light" size="lg" radius="md">
                                <Icon size={20} />
                            </ThemeIcon>
                            <Text fz="sm" fw={600}>{title}</Text>
                        </Group>
                         {selection && (
                             <ChevronDown size={20} color="var(--mantine-color-gray-5)" style={{ transform: `rotate(${isExpanded ? 180 : 0}deg)`, transition: 'transform 0.2s ease' }}/>
                         )}
                    </Group>
                    
                    {selection ? (
                        <Stack gap={4} pl={42}>
                            <Text fz="sm" fw={500} truncate>{selection}</Text>
                            {isLoading ? (
                                <Center><Loader size="xs" color="gray" /></Center>
                            ) : (
                                <Text fz="xl" fw={700} c="deep-blue.7">
                                    ${(cost || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                </Text>
                            )}
                        </Stack>
                    ) : (
                        <Text fz="sm" c="dimmed" pl={42}>Pendiente...</Text>
                    )}

                    <AnimatePresence>
                        {isExpanded && !isLoading && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Divider mt="xs" mb="sm"/>
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Stack>
            </Paper>
        </motion.div>
    );
};


const ResumenPaso = () => {
    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano,
        detalleVehiculo, detalleRecurso, resumenCostos
    } = useCotizacion();
    
    const location = useLocation();
    const esPasoFinal = location.pathname.includes('/configuracion-final');

    if (!puntosEntrega) {
        return (
            <Paper withBorder p="lg" radius="md" shadow="sm">
                <Center h={200}>
                     <Stack align="center" gap="xs">
                        <AlertCircle size={32} color="var(--mantine-color-gray-4)" />
                        <Text c="dimmed" size="sm" ta="center">Define una ruta para activar el panel de misión.</Text>
                    </Stack>
                </Center>
            </Paper>
        );
    }

    let frecuenciaTexto = 'No definida';
    let kmsTotales = puntosEntrega.distanciaKm || 0;
    if (frecuencia) {
        if (frecuencia.tipo === 'esporadico') {
            frecuenciaTexto = `${frecuencia.vueltasTotales || 1} viaje(s)`;
            kmsTotales *= (frecuencia.vueltasTotales || 1);
        } else {
            const viajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
            frecuenciaTexto = `~${viajesMensuales.toFixed(1)} viajes/mes`;
            kmsTotales *= viajesMensuales;
        }
    }

    const { 
        totalVehiculo = 0, totalRecurso = 0, totalOperativo = 0, 
        totalFinal = 0 
    } = resumenCostos || {};
    
    const totalCostosAdicionales = totalOperativo - totalVehiculo - totalRecurso;

    // --- Cálculos de porcentajes para la leyenda ---
    const pctVehiculo = totalOperativo > 0 ? (totalVehiculo / totalOperativo) * 100 : 0;
    const pctRecurso = totalOperativo > 0 ? (totalRecurso / totalOperativo) * 100 : 0;
    const pctOtros = totalOperativo > 0 ? (totalCostosAdicionales / totalOperativo) * 100 : 0;


    return (
        <Paper withBorder p="lg" radius="md" shadow="sm">
            <Stack gap="md"> 
                <Title order={4} c="deep-blue.7">Panel de Misión</Title>
                <Grid>
                    <MetricItem icon={MapPin} label="Distancia / viaje" value={`${puntosEntrega.distanciaKm?.toFixed(1) || '0'} km`} />
                    <MetricItem icon={Clock} label="Tiempo / viaje" value={`${puntosEntrega.duracionMin || '0'} min`} />
                    <MetricItem icon={Calendar} label="Frecuencia" value={frecuenciaTexto} />
                    <MetricItem icon={Route} label="Distancia Total" value={`${kmsTotales.toFixed(0)} km`} />
                </Grid>
                
                <Divider mt={4} />

                <AnimatePresence>
                    {frecuencia && (
                        <CostCard
                            icon={Truck}
                            title="Vehículo"
                            selection={vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : null}
                            cost={detalleVehiculo?.totalFinal}
                            isLoading={vehiculo && !detalleVehiculo}
                            color="cyan"
                        >
                            <CostoDesglosadoItem label="Combustible y Desgaste" valor={detalleVehiculo?.detalle.combustible + detalleVehiculo?.detalle.cubiertas + detalleVehiculo?.detalle.aceite} />
                            <CostoDesglosadoItem label="Depreciación" valor={detalleVehiculo?.detalle.depreciacion} />
                            <CostoDesglosadoItem label="Costos Fijos Asignados" valor={detalleVehiculo?.detalle.costosFijosProrrateados} />
                        </CostCard>
                    )}
                    {vehiculo && (
                        <CostCard
                            icon={User}
                            title="Recurso Humano"
                            selection={recursoHumano?.nombre}
                            cost={detalleRecurso?.totalFinal}
                            isLoading={recursoHumano && !detalleRecurso}
                            color="blue"
                        >
                            <CostoDesglosadoItem label="Costo Base y Adicionales" valor={detalleRecurso?.detalle.costoBaseRemunerativo + detalleRecurso?.detalle.adicionalKm + detalleRecurso?.detalle.adicionalPorCargaDescarga} />
                            <CostoDesglosadoItem label="Viáticos y No Remunerativos" valor={detalleRecurso?.detalle.viaticoKm + detalleRecurso?.detalle.adicionalFijoNoRemunerativo} />
                            <CostoDesglosadoItem label={detalleRecurso?.detalle.costoIndirectoLabel || 'Costos Indirectos'} valor={detalleRecurso?.detalle.costoIndirecto} />
                        </CostCard>
                    )}
                </AnimatePresence>

                {esPasoFinal && resumenCostos && (
                     <Stack gap="sm">
                        <Divider label="Resumen Final" labelPosition="center" />
                        
                        {/* ✅ GRÁFICO SIN LABELS INTERNOS */}
                        <Progress.Root size={20} radius="sm">
                            <Progress.Section value={pctVehiculo} color="cyan" tooltip={`Vehículo: $${totalVehiculo.toLocaleString()}`} />
                            <Progress.Section value={pctRecurso} color="blue" tooltip={`RRHH: $${totalRecurso.toLocaleString()}`} />
                            <Progress.Section value={pctOtros} color="indigo" tooltip={`Otros: $${totalCostosAdicionales.toLocaleString()}`} />
                        </Progress.Root>
                        
                        {/* ✅ LEYENDA EXTERNA CON PORCENTAJES */}
                        <Group justify="center" gap="sm" mt={4}>
                            <Text fz="xs"> Vehículo ({pctVehiculo.toFixed(1)}%)</Text>
                            <Text fz="xs"> RRHH ({pctRecurso.toFixed(1)}%)</Text>
                            <Text fz="xs"> Otros ({pctOtros.toFixed(1)}%)</Text>
                        </Group>
                        
                         <Paper withBorder p="md" radius="md" mt="sm" bg="gray.0">
                            <Group justify="space-between">
                                <Text fz="sm" c="dimmed" fw={500}>Costo Operativo</Text>
                                <Text fz="lg" fw={600}>${totalOperativo.toLocaleString('es-AR')}</Text>
                            </Group>
                        </Paper>

                        <Paper p="lg" radius="md" mt={4} bg="teal.0">
                            <Group justify="space-between" align="flex-start">
                                <Stack gap={0}>
                                    <Text fz="lg" fw={700} c="teal.9">Precio Venta</Text>
                                    <Text fz="xs" c="teal.8" >(sin IVA)</Text>
                                </Stack>
                                <Text fz={28} fw={700} c="teal.9" lh={1}>
                                    ${(totalFinal || 0).toLocaleString('es-AR')}
                                </Text>
                            </Group>
                        </Paper>
                     </Stack>
                )}
            </Stack>
        </Paper>
    );
};

export default ResumenPaso;