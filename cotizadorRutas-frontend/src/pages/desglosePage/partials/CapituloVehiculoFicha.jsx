// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloVehiculoFicha.jsx

import { Paper, Title, Grid, Stack, Divider, Text, Group, Badge, SimpleGrid, ThemeIcon } from '@mantine/core';
import { Car, Gauge, Wrench, Wallet, Fuel, Tag, Calendar, Weight, Box, ShieldCheck, Repeat, Copy } from 'lucide-react';

// Componente reutilizable para mostrar un dato clave con unidad.
const InfoLine = ({ label, value, unit = '' }) => (
    <Group justify="space-between" wrap="nowrap" mt="xs">
        <Text size="sm">{label}:</Text>
        <Text size="sm" fw={600}>
            {value} <Text span c="dimmed" fz="xs">{unit}</Text>
        </Text>
    </Group>
);

// Componente para una tarjeta de KPI visual
const KpiCard = ({ icon, label, value, color }) => (
    <Paper withBorder p="md" radius="md">
        <Group>
            <ThemeIcon color={color} variant="light" size={42} radius="md">
                {icon}
            </ThemeIcon>
            <div>
                <Text size="xl" fw={700} lh={1}>{value}</Text>
                <Text size="xs" c="dimmed">{label}</Text>
            </div>
        </Group>
    </Paper>
)

const CapituloVehiculoFicha = ({ presupuesto }) => {
    if (!presupuesto?.vehiculo?.datos) return null;

    const { datos } = presupuesto.vehiculo;

    const costoTotalFijoMensual = (datos.costoSeguroMensual || 0) + (datos.costoPatenteProvincial || 0) + (datos.costoPatenteMunicipal || 0) + (datos.costoMantenimientoPreventivoMensual || 0);
    const valorADepreciar = (datos.precioVehiculoNuevo || 0) * (1 - ((datos.valorResidualPorcentaje || 0) / 100));

    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 2: Ficha Técnica del Activo</Title>
                <Text c="dimmed" mb="xl">
                    Parámetros económicos y técnicos del vehículo asignado, utilizados como base para todos los cálculos de costos.
                </Text>

                {/* IDENTIFICACIÓN PRINCIPAL */}
                <Group>
                    <ThemeIcon size="xl" variant="light" color="cyan" radius="md"><Car size={28} /></ThemeIcon>
                    <Title order={3}>{datos.marca} {datos.modelo}</Title>
                    <Badge size="xl" variant="outline">{datos.patente}</Badge>
                    <Badge size="lg" variant="light" color="gray" leftSection={<Calendar size={14} />}>{datos.año}</Badge>
                </Group>

                {/* KPIs VISUALES */}
                <SimpleGrid cols={{ base: 2, sm: 4 }} mt="xl">
                    <KpiCard icon={<Gauge size={24} />} value={`${datos.rendimientoKmLitro} km/l`} label="Rendimiento" color="orange" />
                    <KpiCard icon={<Wallet size={24} />} value={`$${valorADepreciar.toLocaleString('es-AR')}`} label="Valor a Depreciar" color="grape" />
                    <KpiCard icon={<ShieldCheck size={24} />} value={`$${costoTotalFijoMensual.toLocaleString('es-AR')}`} label="Costo Fijo Mensual" color="blue" />
                    <KpiCard icon={<Weight size={24} />} value={`${datos.capacidadKg} kg`} label="Capacidad de Carga" color="green" />
                </SimpleGrid>

                {/* ✅ INICIA EL BLOQUE PARA REEMPLAZAR */}
                <Grid gutter="xl" mt="lg" className="print-grid">
                    {/* COLUMNA IZQUIERDA: PARÁMETROS ECONÓMICOS */}
                    <Grid.Col span={{ base: 12, md: 6 }} className="print-col-6">
                        <Title order={4} className="section-subtitle">Parámetros Económicos</Title>
                        <Paper withBorder p="lg" radius="md">
                            <Stack>
                                <Text fw={600} fz="sm" c="dimmed">VALORIZACIÓN Y DESGASTE</Text>
                                <InfoLine label="Precio Vehículo (Nuevo)" value={`$${(datos.precioVehiculoNuevo || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Valor Residual Estimado" value={`${datos.valorResidualPorcentaje || 0}%`} />
                                <InfoLine label="Vida Útil del Vehículo" value={`${(datos.kmsVidaUtilVehiculo || 0).toLocaleString('es-AR')}`} unit="km" />
                                <Divider my="sm" />
                                <Text fw={600} fz="sm" c="dimmed">COSTO DE INSUMOS Y REPUESTOS</Text>
                                <InfoLine label="Cantidad de Cubiertas" value={datos.cantidadCubiertas || 0} unit="u." />
                                <InfoLine label="Precio por Cubierta" value={`$${(datos.precioCubierta || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Precio Cambio de Aceite" value={`$${(datos.precioCambioAceite || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Precio Combustible" value={`$${(datos.precioLitroCombustible || 0).toLocaleString('es-AR')}`} unit={datos.tipoCombustible} />
                                {datos.tieneGNC && <InfoLine label="Precio GNC" value={`$${(datos.precioGNC || 0).toLocaleString('es-AR')}`} unit="por m³" />}
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    {/* COLUMNA DERECHA: PARÁMETROS TÉCNICOS Y FIJOS */}
                    <Grid.Col span={{ base: 12, md: 6 }} className="print-col-6">
                        <Title order={4} className="section-subtitle">Parámetros Técnicos y Fijos</Title>
                        <Paper withBorder p="lg" radius="md">
                            <Stack>
                                <Text fw={600} fz="sm" c="dimmed">INTERVALOS DE MANTENIMIENTO</Text>
                                <InfoLine label="Vida Útil por Cubierta" value={`${(datos.kmsVidaUtilCubiertas || 0).toLocaleString('es-AR')}`} unit="km" />
                                <InfoLine label="Frecuencia Cambio Aceite" value={`${(datos.kmsCambioAceite || 0).toLocaleString('es-AR')}`} unit="km" />
                                <Divider my="sm" />
                                <Text fw={600} fz="sm" c="dimmed">DESGLOSE DE GASTOS FIJOS MENSUALES</Text>
                                <InfoLine label="Seguro del Vehículo" value={`$${(datos.costoSeguroMensual || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Patente Provincial" value={`$${(datos.costoPatenteProvincial || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Patente Municipal" value={`$${(datos.costoPatenteMunicipal || 0).toLocaleString('es-AR')}`} />
                                <InfoLine label="Mantenimiento Preventivo" value={`$${(datos.costoMantenimientoPreventivoMensual || 0).toLocaleString('es-AR')}`} />
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>

            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloVehiculoFicha;