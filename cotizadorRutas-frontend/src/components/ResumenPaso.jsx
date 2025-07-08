// Archivo: src/components/ResumenPaso.jsx (Versión Final Definitiva con Vista Expandida)

import { useCotizacion } from '../context/Cotizacion';
import { Paper, Title, Text, Stack, Group, ThemeIcon, Divider, Center, Loader, Accordion } from '@mantine/core';
import { MapPin, Clock, Calendar, Truck, User, TrendingUp, Target } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Componente interno para un ítem de información principal
const InfoItem = ({ icon, label, children }) => (
    <div>
        <Group gap="xs" mb={5}>
            <ThemeIcon color="gray" variant="light" size="sm" radius="xl">
                {icon}
            </ThemeIcon>
            <Text size="sm" fw={500} c="dimmed">{label}</Text>
        </Group>
        <Text pl={34} size="sm" c="deep-blue.8" fw={500}>{children}</Text>
    </div>
);

// Componente interno para un desglose de costos
const CostoDesglosadoItem = ({ label, valor }) => (
    <Group justify="space-between" gap="xs">
        <Text fz="xs" c="dimmed">{label}</Text>
        <Text fz="xs" fw={500}>
            ${(valor || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
        </Text>
    </Group>
);

const ResumenPaso = () => {
    const { 
        puntosEntrega, frecuencia, vehiculo, recursoHumano,
        detalleVehiculo, detalleRecurso, resumenCostos 
    } = useCotizacion();
    
    const location = useLocation();
    const esPasoFinal = location.pathname.includes('/configuracion-final');

    if (!puntosEntrega) return null;

    let frecuenciaTexto = 'No definida';
    if (frecuencia) {
        frecuenciaTexto = frecuencia.tipo === 'esporadico'
            ? `${frecuencia.vueltasTotales} viaje(s) esporádico(s)`
            : `Mensual, ${frecuencia.diasSeleccionados.length} día(s) por semana`;
    }

    const SeccionVehiculo = () => (
        <Stack gap="xs">
            {vehiculo ? (
                <Stack pl={34} gap="xs">
                    <Text size="sm" fw={500}>{vehiculo.marca} {vehiculo.modelo}</Text>
                    {detalleVehiculo ? (
                        <>
                            <CostoDesglosadoItem label="Combustible y Desgaste" valor={detalleVehiculo.detalle.combustible + detalleVehiculo.detalle.cubiertas + detalleVehiculo.detalle.aceite} />
                            <CostoDesglosadoItem label="Depreciación" valor={detalleVehiculo.detalle.depreciacion} />
                            <CostoDesglosadoItem label="Costos Fijos (Seguro, etc.)" valor={detalleVehiculo.detalle.costosFijosProrrateados} />
                            <Divider style={{ width: '50%', alignSelf: 'flex-end' }} />
                            <Group justify="flex-end"><Text fz="sm" fw={700}>Subtotal Vehículo:</Text><Text fz="sm" fw={700}>${(detalleVehiculo.totalFinal || 0).toLocaleString('es-AR')}</Text></Group>
                        </>
                    ) : <Center><Loader size="xs" type="dots" /></Center>}
                </Stack>
            ) : <Text size="sm" c="dimmed" pl={34}>Pendiente de selección...</Text>}
        </Stack>
    );
    
    // =======================================================
    // == SECCIÓN MODIFICADA PARA USAR LA NUEVA LÓGICA
    // =======================================================
    const SeccionRRHH = () => (
         <Stack gap="xs">
            {recursoHumano ? (
                <Stack pl={34} gap="xs">
                    <Text size="sm" fw={500}>{recursoHumano.nombre}</Text>
                    {detalleRecurso ? (
                        <>
                            <CostoDesglosadoItem 
                                label="Costo Base y Adicionales Remunerativos" 
                                valor={detalleRecurso.detalle.costoBaseRemunerativo + detalleRecurso.detalle.adicionalKm + detalleRecurso.detalle.adicionalPorCargaDescarga} 
                            />
                            <CostoDesglosadoItem 
                                label="Viáticos y Adicionales No Remunerativos" 
                                valor={detalleRecurso.detalle.viaticoKm + detalleRecurso.detalle.adicionalFijoNoRemunerativo} 
                            />
                             <CostoDesglosadoItem 
                                label={detalleRecurso.detalle.costoIndirectoLabel || 'Costos Indirectos'}
                                valor={detalleRecurso.detalle.costoIndirecto}
                            />
                            <Divider style={{ width: '50%', alignSelf: 'flex-end' }} />
                            <Group justify="flex-end">
                                <Text fz="sm" fw={700}>Subtotal RRHH:</Text>
                                <Text fz="sm" fw={700}>${(detalleRecurso.totalFinal || 0).toLocaleString('es-AR')}</Text>
                            </Group>
                        </>
                    ) : <Center><Loader size="xs" type="dots" /></Center>}
                </Stack>
            ) : <Text size="sm" c="dimmed" pl={34}>Pendiente de selección...</Text>}
        </Stack>
    );

    return (
        <Paper withBorder p="lg" radius="md" shadow="sm">
            <Stack gap="lg">
                <Title order={4} c="deep-blue.7">Informe de Misión</Title>
                
                {esPasoFinal ? (
                    <Accordion variant="separated">
                        <Accordion.Item value="ruta-frecuencia">
                            <Accordion.Control>Datos Generales</Accordion.Control>
                            <Accordion.Panel>
                                <InfoItem icon={<MapPin size={16} />} label="Distancia por viaje">{puntosEntrega.distanciaKm?.toFixed(2) || 'N/A'} km</InfoItem>
                                <InfoItem icon={<Calendar size={16} />} label="Frecuencia">{frecuenciaTexto}</InfoItem>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="vehiculo">
                             <Accordion.Control icon={<Truck size={16} />}>Desglose Vehículo</Accordion.Control>
                             <Accordion.Panel><SeccionVehiculo /></Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="rrhh">
                            <Accordion.Control icon={<User size={16} />}>Desglose RRHH</Accordion.Control>
                            <Accordion.Panel><SeccionRRHH /></Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                ) : (
                    <>
                        <InfoItem icon={<MapPin size={16} />} label="Distancia por viaje">{puntosEntrega.distanciaKm?.toFixed(2) || 'N/A'} km</InfoItem>
                        <InfoItem icon={<Calendar size={16} />} label="Frecuencia">{frecuenciaTexto}</InfoItem>
                        <Divider />
                        <SeccionVehiculo />
                        <SeccionRRHH />
                    </>
                )}
                
                {esPasoFinal && resumenCostos && (
                     <Stack gap="md" mt="md">
                        <Title order={5} c="dimmed">Propuesta Económica</Title>
                        <InfoItem icon={<Target size={16} />} label="Costo Operativo Total">
                            ${(resumenCostos.totalOperativo || 0).toLocaleString('es-AR')}
                        </InfoItem>
                        <InfoItem icon={<TrendingUp size={16} />} label="Margen de Ganancia">
                            ${(resumenCostos.ganancia || 0).toLocaleString('es-AR')}
                        </InfoItem>
                        <Paper p="md" bg="cyan.0" radius="md" mt="xs">
                            <Group justify="space-between">
                                <Text fz="lg" fw={700} c="cyan.9">Total Final</Text>
                                <Text fz="lg" fw={700} c="cyan.9">
                                    ${(resumenCostos.totalFinal || 0).toLocaleString('es-AR')}
                                </Text>
                            </Group>
                            <Text fz="xs" c="cyan.8" ta="right" mt={5}>(sin IVA)</Text>
                        </Paper>
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};

export default ResumenPaso;