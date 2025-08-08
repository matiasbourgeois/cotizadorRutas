// cotizadorRutas-frontend/src/pages/desglosePage/DesglosePage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text, Paper, Title, Button, Grid, Group, SimpleGrid, ThemeIcon, Stack, RingProgress, Badge, Alert, Divider } from '@mantine/core';
import { Printer, Truck, User as UserIcon, AlertCircle, Clock, Route as RouteIcon, Gauge } from 'lucide-react';
import './DesglosePage.css';

// --- Importamos todos los capítulos del informe ---
import CapituloRutaFrecuencia from './partials/CapituloRutaFrecuencia';
import CapituloVehiculoFicha from './partials/CapituloVehiculoFicha';
import CapituloVehiculoCostos from './partials/CapituloVehiculoCostos';
import CapituloRecursoHumanoFicha from './partials/CapituloRecursoHumanoFicha';
import CapituloRecursoHumanoCostos from './partials/CapituloRecursoHumanoCostos';
import CapituloFinalConsolidado from './partials/CapituloFinalConsolidado';


// --- Componente para el gráfico de barras personalizado ---
const CostBar = ({ label, value, percentage, color }) => (
    <div>
        <Group justify="space-between">
            <Text size="sm" fw={500}>{label}</Text>
            <Text size="sm" fw={700}>${(value || 0).toLocaleString('es-AR')}</Text>
        </Group>
        <div style={{ width: '100%', backgroundColor: '#f1f3f5', borderRadius: 4, height: 22, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ width: `${percentage}%`, backgroundColor: color, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                <Text size="xs" c="white" fw={700}>{percentage.toFixed(1)}%</Text>
            </div>
        </div>
    </div>
);

// --- ✅ NUEVO COMPONENTE MEJORADO PARA KPIs DE EFICIENCIA ---
const KpiEficienciaCard = ({ icon, value, unit, label, color = "cyan" }) => (
    <Paper withBorder p="md" radius="md">
        <Group>
            <ThemeIcon color={color} variant="light" size={42} radius="md">
                {icon}
            </ThemeIcon>
            <div>
                <Text fz={22} fw={700} lh={1.1}>
                    {value}
                    <Text component="span" fz="sm" c="dimmed" ml={5}>{unit}</Text>
                </Text>
                <Text fz="xs" c="dimmed">{label}</Text>
            </div>
        </Group>
    </Paper>
);

// --- ✅ NUEVO COMPONENTE PARA LA TARJETA DE ACTIVOS ASIGNADOS ---
const ActivosCard = ({ vehiculo, recurso }) => (
     <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
            <Group wrap="nowrap">
                <ThemeIcon color="gray" variant="light" size="lg"><Truck size={18} /></ThemeIcon>
                <div>
                    <Text fz="sm" fw={500}>{vehiculo.marca} {vehiculo.modelo}</Text>
                    <Text fz="xs" c="dimmed">{vehiculo.patente}</Text>
                </div>
            </Group>
            <Divider />
             <Group wrap="nowrap">
                <ThemeIcon color="gray" variant="light" size="lg"><UserIcon size={18} /></ThemeIcon>
                <div>
                    <Text fz="sm" fw={500}>{recurso.nombre}</Text>
                    <Text fz="xs" c="dimmed">{recurso.tipoContratacion}</Text>
                </div>
            </Group>
        </Stack>
    </Paper>
)


const DesglosePage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const { data } = await clienteAxios.get(`/presupuestos/${id}`);
                setPresupuesto(data);
            } catch (error) {
                console.error("Error al obtener el presupuesto para el desglose:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerPresupuesto();
    }, [id]);

    const Header = () => (
        <div className="header-simple">
            <Title order={4} className="header-title-main">Sol del Amanecer SRL</Title>
            <Text c="dimmed" size="sm" className="header-subtitle">Transporte y Logística de Confianza</Text>
        </div>
    );

    if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
    if (!presupuesto) return <Center h="100vh"><Text>Desglose de presupuesto no encontrado.</Text></Center>;

// --- Cálculos Centralizados para el Dashboard ---
    const { resumenCostos } = presupuesto;
    const totalOperativo = resumenCostos.totalOperativo || 0;
    const kmsMensualesTotales = presupuesto.vehiculo?.calculo?.kmsMensuales || 0;
    
    const totalCostosAdminOtros = (resumenCostos.totalAdministrativo || 0) + (resumenCostos.otrosCostos || 0) + (resumenCostos.totalPeajes || 0);

    const costosFijosTotales = (presupuesto.vehiculo.calculo.detalle.costosFijosProrrateados || 0) + 
                              (presupuesto.recursoHumano.calculo.detalle.costoBaseRemunerativo || 0) +
                              (presupuesto.recursoHumano.calculo.detalle.adicionalFijoNoRemunerativo || 0) +
                              totalCostosAdminOtros +
                              (presupuesto.recursoHumano.calculo.detalle.costoIndirecto || 0);
    
    const costosVariablesTotales = (presupuesto.vehiculo.calculo.detalle.combustible || 0) +
                                 (presupuesto.vehiculo.calculo.detalle.cubiertas || 0) +
                                 (presupuesto.vehiculo.calculo.detalle.aceite || 0) +
                                 (presupuesto.vehiculo.calculo.detalle.depreciacion || 0) +
                                 (presupuesto.recursoHumano.calculo.detalle.adicionalKm || 0) +
                                 (presupuesto.recursoHumano.calculo.detalle.viaticoKm || 0) +
                                 (presupuesto.recursoHumano.calculo.detalle.adicionalPorCargaDescarga || 0) +
                                 (resumenCostos.costoAdicionalPeligrosa || 0);

    const duracionTotalMisionMin = (presupuesto.duracionMin || 0) + 30;
    const viajesProyectados = presupuesto.frecuencia.tipo === 'mensual'
      ? ((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.12)
      : (presupuesto.frecuencia.vueltasTotales || 1);
    const horasTotalesMensuales = (duracionTotalMisionMin * viajesProyectados) / 60;
    const costoPorHora = horasTotalesMensuales > 0 ? (totalOperativo / horasTotalesMensuales) : 0;
    
    return (
        <div className="propuesta-background">
            <div className="print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">Imprimir o Guardar PDF</Button>
            </div>

            <div className="page-container">
                <div className="page">
                    <Header />
                    <div className="content">
                        <Title order={1} className="main-title-cover">Análisis de Viabilidad de Misión</Title>
                        <Text c="dimmed">Cliente: {presupuesto.cliente || 'No Especificado'} | ID: {presupuesto._id}</Text>

                        <SimpleGrid cols={3} mt="xl">
                            <Paper withBorder p="lg" radius="md"><Text c="dimmed" fz="sm">Costo Operativo Total</Text><Text className="kpi-main-value">${totalOperativo.toLocaleString('es-AR')}</Text><Text fz="xs" c="dimmed">Egresos Proyectados</Text></Paper>
                            <Paper withBorder p="lg" radius="md" bg="teal.0"><Text fz="sm" fw={500} c="teal.9">Rentabilidad de la Misión</Text><Text className="kpi-main-value" c="teal.8">{totalOperativo > 0 ? ((resumenCostos.ganancia / totalOperativo) * 100).toFixed(1) : 0}%</Text><Text fz="xs" c="dimmed">Margen Bruto: ${(resumenCostos.ganancia || 0).toLocaleString('es-AR')}</Text></Paper>
                            <Paper withBorder p="lg" radius="md"><Text c="dimmed" fz="sm">Precio de Venta (s/IVA)</Text><Text className="kpi-main-value">${(resumenCostos.totalFinal || 0).toLocaleString('es-AR')}</Text><Text fz="xs" c="dimmed">Propuesta Final al Cliente</Text></Paper>
                        </SimpleGrid>

                        <Grid gutter="xl" mt="lg">
                            <Grid.Col span={7}>
                                <Title order={4} className="section-title-light">Análisis de Riesgo: Fijos vs. Variables</Title>
                                <Paper withBorder p="lg" radius="md">
                                    <Stack>
                                        <CostBar label="Costos Variables" value={costosVariablesTotales} percentage={totalOperativo > 0 ? (costosVariablesTotales / totalOperativo) * 100 : 0} color="#fd7e14" />
                                        <CostBar label="Costos Fijos" value={costosFijosTotales} percentage={totalOperativo > 0 ? (costosFijosTotales / totalOperativo) * 100 : 0} color="#495057" />
                                        <Alert color="orange" title="Interpretación del Riesgo" icon={<AlertCircle />} mt="sm" p="sm" radius="md">
                                            <Text size="xs">El <strong>{(totalOperativo > 0 ? (costosVariablesTotales / totalOperativo) * 100 : 0).toFixed(1)}%</strong> del costo es variable, lo que indica que el riesgo operativo es moderado. La mayor parte del gasto está directamente vinculada a la prestación del servicio.</Text>
                                        </Alert>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={5}>
                                <Title order={4} className="section-title-light">Estructura del Costo</Title>
                                <Paper withBorder p="lg" radius="md" ta="center">
                                    <RingProgress
                                        size={160} thickness={16} mx="auto" roundCaps
                                        sections={[
                                            { value: (resumenCostos.totalVehiculo / totalOperativo) * 100, color: 'cyan', tooltip: `Vehículo: $${resumenCostos.totalVehiculo.toLocaleString()}`},
                                            { value: (resumenCostos.totalRecurso / totalOperativo) * 100, color: 'blue', tooltip: `RRHH: $${resumenCostos.totalRecurso.toLocaleString()}` },
                                            { value: (totalCostosAdminOtros / totalOperativo) * 100, color: 'indigo', tooltip: `Admin/Otros: $${totalCostosAdminOtros.toLocaleString()}` }
                                        ]}
                                    />
                                    <Group justify="center" mt="lg">
                                        <Text span size="xs"><Badge color="cyan" circle /> Vehículo</Text>
                                        <Text span size="xs"><Badge color="blue" circle /> RRHH</Text>
                                        <Text span size="xs"><Badge color="indigo" circle /> Otros</Text>
                                    </Group>
                                </Paper>
                            </Grid.Col>
                        </Grid>

                        {/* ✅ SECCIÓN DE KPIs DE EFICIENCIA MEJORADA */}
                        <Title order={4} className="section-title-light" mt="xl">KPIs de Eficiencia Operativa</Title>
                        <SimpleGrid cols={4}>
                            <KpiEficienciaCard icon={<Gauge size={22} />} value={`$${(totalOperativo / kmsMensualesTotales).toFixed(2)}`} label="Costo / Km" color="red"/>
                            <KpiEficienciaCard icon={<Clock size={22} />} value={`$${costoPorHora.toFixed(2)}`} label="Costo / Hora" color="orange" />
                            <KpiEficienciaCard icon={<RouteIcon size={22} />} value={`~${viajesProyectados.toFixed(1)}`} label="Viajes / Mes" color="blue" />
                            <ActivosCard vehiculo={presupuesto.vehiculo.datos} recurso={presupuesto.recursoHumano.datos} />
                        </SimpleGrid>
                    </div>
                </div>

                {/* --- El resto de los capítulos del informe --- */}
                <CapituloRutaFrecuencia presupuesto={presupuesto} />
                <CapituloVehiculoFicha presupuesto={presupuesto} />
                <CapituloVehiculoCostos presupuesto={presupuesto} />
                <CapituloRecursoHumanoFicha presupuesto={presupuesto} />
                <CapituloRecursoHumanoCostos presupuesto={presupuesto} />
                <CapituloFinalConsolidado presupuesto={presupuesto} />
            </div>
        </div>
    );
};

export default DesglosePage;