// Archivo: src/components/ResumenPaso.jsx (Versión Final de Clase Mundial)

import { useCotizacion } from '../context/Cotizacion';
import { Paper, Title, Text, Stack, Group, ThemeIcon, Divider, Center, Loader } from '@mantine/core';
import { MapPin, Calendar, Truck, User, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// --- Componente Placeholder para secciones pendientes ---
const Placeholder = ({ icon, label }) => (
    <Group p="xs" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
        <ThemeIcon variant="light" color="gray" size="xl" radius="md">
            {icon}
        </ThemeIcon>
        <div>
            <Text fw={500} c="dimmed">{label}</Text>
            <Text size="xs" c="dimmed">Pendiente de selección...</Text>
        </div>
    </Group>
);

// --- Componente para los ítems de costo ---
const CostoItem = ({ label, valor }) => (
    <Group justify="space-between" gap="xs">
        <Text fz="xs" c="dimmed">{label}</Text>
        <Text fz="sm" fw={500}>
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

    if (!puntosEntrega) {
        return (
            <Paper withBorder p="lg" radius="md" shadow="sm">
                <Center h={200}>
                    <Stack align="center">
                        <AlertCircle size={32} color="lightgray" />
                        <Text c="dimmed">Inicia definiendo una ruta.</Text>
                    </Stack>
                </Center>
            </Paper>
        );
    }
    
    // --- Lógica de cálculo de KM Totales ---
    let kmTotalesTexto = null;
    if (frecuencia) {
        const kmPorViaje = puntosEntrega.distanciaKm || 0;
        if (frecuencia.tipo === 'esporadico') {
            const kmTotales = kmPorViaje * (frecuencia.vueltasTotales || 1);
            kmTotalesTexto = `${kmTotales.toFixed(0)} km totales del servicio`;
        } else if (frecuencia.tipo === 'mensual') {
            const kmMensuales = kmPorViaje * (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
            kmTotalesTexto = `~${kmMensuales.toFixed(0)} km totales por mes`;
        }
    }
    
    // --- Sub-componentes para cada sección ---
    const SeccionRuta = () => (
        <Group>
            <ThemeIcon variant="light" color="cyan" size="xl" radius="md"><MapPin size={22} /></ThemeIcon>
            <div>
                <Text size="xs" c="dimmed">Distancia por Viaje</Text>
                <Text fw={700} size="lg">{puntosEntrega.distanciaKm?.toFixed(2) || '0.00'} km</Text>
            </div>
        </Group>
    );

    const SeccionFrecuencia = () => {
        if (!frecuencia) return <Placeholder icon={<Calendar size={24} />} label="Frecuencia" />;
        const tipoServicio = frecuencia.tipo === 'esporadico' ? 'Servicio Esporádico' : 'Servicio Mensual';
        const detalleServicio = frecuencia.tipo === 'esporadico' 
            ? `${frecuencia.vueltasTotales || 1} viaje(s) en total`
            : `${frecuencia.diasSeleccionados?.length || 0} día(s) por semana`;

        return (
            <Group>
                <ThemeIcon variant="light" color="cyan" size="xl" radius="md"><Calendar size={22} /></ThemeIcon>
                <div>
                    <Text fw={500}>{tipoServicio}</Text>
                    <Text size="xs" c="dimmed">{detalleServicio}</Text>
                    {kmTotalesTexto && <Text size="xs" fw={500} c="blue.8">{kmTotalesTexto}</Text>}
                </div>
            </Group>
        );
    };

    const SeccionVehiculo = () => {
        if (!vehiculo) return <Placeholder icon={<Truck size={24} />} label="Vehículo Asignado" />;
        return (
            <Stack gap="sm">
                <Group>
                    <ThemeIcon variant="light" color="cyan" size="xl" radius="md"><Truck size={22} /></ThemeIcon>
                    <div>
                        <Text fw={500}>{vehiculo.marca} {vehiculo.modelo}</Text>
                        <Text size="xs" c="dimmed">Patente: {vehiculo.patente}</Text>
                    </div>
                </Group>
                {detalleVehiculo ? (
                    <Stack gap={4} pl={54}>
                        <CostoItem label="Combustible y Desgaste" valor={detalleVehiculo.detalle.combustible + detalleVehiculo.detalle.cubiertas + detalleVehiculo.detalle.aceite} />
                        <CostoItem label="Depreciación" valor={detalleVehiculo.detalle.depreciacion} />
                        <CostoItem label="Costos Fijos (Prorrateo)" valor={detalleVehiculo.detalle.costosFijosProrrateados} />
                        <Divider mt="xs" />
                        <Group justify="space-between"><Text fz="sm" fw={700}>Subtotal Vehículo:</Text><Text fz="sm" fw={700}>${(detalleVehiculo.totalFinal || 0).toLocaleString('es-AR')}</Text></Group>
                    </Stack>
                ) : <Center><Loader size="xs" /></Center>}
            </Stack>
        );
    };
    
    const SeccionRRHH = () => {
        if (!recursoHumano) return <Placeholder icon={<User size={24} />} label="Personal Asignado" />;
        return (
            <Stack gap="sm">
                <Group>
                    <ThemeIcon variant="light" color="cyan" size="xl" radius="md"><User size={22} /></ThemeIcon>
                    <div>
                        <Text fw={500}>{recursoHumano.nombre}</Text>
                        <Text size="xs" c="dimmed">{recursoHumano.tipoContratacion === 'empleado' ? 'Empleado' : 'Contratado'}</Text>
                    </div>
                </Group>
                {detalleRecurso ? (
                    <Stack gap={4} pl={54}>
                        <CostoItem label="Salario y Cargas Sociales" valor={detalleRecurso.detalle.sueldoProporcional + detalleRecurso.detalle.adicionalActividad + detalleRecurso.detalle.cargasSociales} />
                        <CostoItem label="Viáticos y Adicionales" valor={detalleRecurso.detalle.adicionalKm + detalleRecurso.detalle.viaticoKm + detalleRecurso.detalle.adicionalFijo} />
                        <Divider mt="xs" />
                        <Group justify="space-between"><Text fz="sm" fw={700}>Subtotal RRHH:</Text><Text fz="sm" fw={700}>${(detalleRecurso.totalFinal || 0).toLocaleString('es-AR')}</Text></Group>
                    </Stack>
                ) : <Center><Loader size="xs" /></Center>}
            </Stack>
        );
    };

    const SeccionPropuestaFinal = () => {
        if (!resumenCostos) return <Center h={100}><Loader /></Center>;
        return (
            <Stack gap="md" mt="md">
                <Title order={5} c="dimmed">Propuesta Económica</Title>
                <CostoItem label="Costo Operativo Total" valor={resumenCostos.totalOperativo} />
                <CostoItem label="Margen de Ganancia" valor={resumenCostos.ganancia} />
                <Paper p="md" bg="cyan.0" radius="md" mt="xs">
                    <Group justify="space-between">
                        <Text fz="lg" fw={700} c="cyan.9">Total Final (s/IVA)</Text>
                        <Text fz="lg" fw={700} c="cyan.9">
                            ${(resumenCostos.totalFinal || 0).toLocaleString('es-AR')}
                        </Text>
                    </Group>
                </Paper>
            </Stack>
        );
    };

    return (
        <Paper withBorder p="lg" radius="md" shadow="sm" style={{height: '100%'}}>
            <Stack gap="lg">
                <Title order={4} c="deep-blue.7">Informe de Misión</Title>
                
                <SeccionRuta />
                <Divider />
                <SeccionFrecuencia />
                <Divider />
                <SeccionVehiculo />
                <Divider />
                <SeccionRRHH />

                {esPasoFinal && (
                    <>
                        <Divider label="Propuesta Final" labelPosition="center" my="xs" />
                        <SeccionPropuestaFinal />
                    </>
                )}
            </Stack>
        </Paper>
    );
};

export default ResumenPaso;