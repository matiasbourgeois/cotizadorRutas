// ruta: src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx

import React, { useState } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Table, Text, Alert, Center } from "@mantine/core";
import { ArrowLeft, Calculator, FileDown, AlertCircle } from "lucide-react";

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();
    // ✅ CORRECCIÓN 1: Se obtiene 'detallesCarga' desde el contexto.
    const { puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga } = useCotizacion();

    const [config, setConfig] = useState({
        costoPeajes: 0,
        costoAdministrativo: 0,
        otrosCostos: 0,
        porcentajeGanancia: 20,
        observaciones: "",
    });
    
    const [resumen, setResumen] = useState(null);
    const [estadoBoton, setEstadoBoton] = useState('listo'); // listo, calculando, guardando, generando

    const handleChange = (name, value) => {
        const valorFinal = typeof value === 'string' ? value : parseFloat(value) || 0;
        setConfig((prev) => ({ ...prev, [name]: valorFinal }));
    };

    const handleCalcularPresupuesto = async () => {
        if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) {
            notifications.show({
                title: 'Faltan datos',
                message: 'Debes completar todos los pasos anteriores para poder calcular un presupuesto.',
                color: 'red',
                icon: <AlertCircle />,
            });
            return;
        }

        setEstadoBoton('calculando');
        setResumen(null);
        try {
            // ✅ CORRECCIÓN 2: Se añade 'detallesCarga' al payload que se envía a la API.
            const payload = { puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: config, detallesCarga };
            const response = await axios.post(`https://cotizador-rutas-api.duckdns.org/api/presupuestos/calcular`, payload);
            setResumen(response.data);
            notifications.show({
                title: 'Cálculo exitoso',
                message: 'El resumen del presupuesto ha sido generado.',
                color: 'green',
            });
        } catch (error) {
            console.error("Error al calcular el presupuesto:", error);
            notifications.show({
                title: 'Error en el cálculo',
                message: 'No se pudo generar el resumen. Revisa la consola.',
                color: 'red',
            });
        } finally {
            setEstadoBoton('listo');
        }
    };

    const handleFinalizarYPdf = async () => {
        if (!resumen) {
            notifications.show({
                title: 'Acción requerida',
                message: 'Por favor, primero calcula el resumen del presupuesto.',
                color: 'yellow',
            });
            return;
        }

        setEstadoBoton('guardando');
        try {
            // ✅ CORRECCIÓN 3: Se añade 'detallesCarga' también al payload final para guardar.
            const payload = {
                puntosEntrega: puntosEntrega.puntos,
                totalKilometros: puntosEntrega.distanciaKm,
                duracionMin: puntosEntrega.duracionMin,
                frecuencia,
                vehiculo: { datos: vehiculo, calculo: resumen.detalleVehiculo },
                recursoHumano: { datos: recursoHumano, calculo: resumen.detalleRecurso },
                configuracion: config,
                detallesCarga, // <-- Añadido aquí
                resumenCostos: resumen.resumenCostos,
            };

            const response = await axios.post(`https://cotizador-rutas-api.duckdns.org/api/presupuestos`, payload);
            const presupuestoGuardado = response.data;
            
            setEstadoBoton('generando');
            const pdfResponse = await axios.get(`https://cotizador-rutas-api.duckdns.org/api/presupuestos/${presupuestoGuardado._id}/pdf`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `presupuesto-${presupuestoGuardado._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            notifications.show({
                title: '¡Proceso Completo!',
                message: 'Presupuesto guardado y PDF descargado exitosamente.',
                color: 'green',
            });
            navigate("/");

        } catch (error) {
            console.error("Error en el proceso final:", error);
            notifications.show({
                title: 'Error en el proceso final',
                message: 'No se pudo guardar el presupuesto o generar el PDF.',
                color: 'red',
            });
        } finally {
            setEstadoBoton('listo');
        }
    };

    const rows = resumen?.resumenCostos ? Object.entries(resumen.resumenCostos).map(([key, value]) => {
        const isTotal = key === 'totalFinal';
        // Ocultamos el desglose de carga peligrosa si es cero
        if (key === 'costoAdicionalPeligrosa' && !value) {
            return null;
        }
        return (
            <Table.Tr key={key} bg={isTotal ? 'cyan.0' : undefined}>
                <Table.Td>
                    <Text fw={isTotal ? 700 : 400} c={isTotal ? 'cyan.9' : undefined}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text fw={isTotal ? 700 : 500} ta="right" c={isTotal ? 'cyan.9' : undefined}>
                        ${(value || 0).toLocaleString('es-AR')}
                    </Text>
                </Table.Td>
            </Table.Tr>
        );
    }) : [];

    return (
        <Stack gap="xl">
            <Title order={2} c="deep-blue.7">Configuración y Presupuesto Final</Title>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper withBorder shadow="sm" p="md" radius="md">
                        <Stack>
                            <Title order={4} c="dimmed">Parámetros Finales</Title>
                            <NumberInput label="Costo Peajes (total por viaje)" value={config.costoPeajes} onChange={(v) => handleChange('costoPeajes', v)} prefix="$ " thousandSeparator="," decimalScale={2} />
                            <NumberInput label="Costo Administrativo (mensual)" value={config.costoAdministrativo} onChange={(v) => handleChange('costoAdministrativo', v)} prefix="$ " thousandSeparator="," decimalScale={2} />
                            <NumberInput label="Otros Costos (mensual)" value={config.otrosCostos} onChange={(v) => handleChange('otrosCostos', v)} prefix="$ " thousandSeparator="," decimalScale={2} />
                            <NumberInput label="Porcentaje de Ganancia" value={config.porcentajeGanancia} onChange={(v) => handleChange('porcentajeGanancia', v)} suffix=" %" min={0} />
                            <Textarea label="Observaciones Finales" placeholder="Aclaraciones para el PDF..." value={config.observaciones} onChange={(e) => handleChange('observaciones', e.currentTarget.value)} autosize minRows={3} />
                            <Button 
                                mt="md" 
                                onClick={handleCalcularPresupuesto} 
                                loading={estadoBoton === 'calculando'}
                                leftSection={<Calculator size={18}/>}
                                fullWidth
                            >
                                Calcular Resumen
                            </Button>
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                     <Paper withBorder shadow="sm" p="md" radius="md" style={{ height: '100%' }}>
                         <Stack h="100%">
                            <Title order={4} c="dimmed">📊 Resumen del Presupuesto</Title>
                            {resumen ? (
                                <Table striped withColumnBorders>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Concepto</Table.Th>
                                            <Table.Th style={{ textAlign: 'right' }}>Monto</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{rows}</Table.Tbody>
                                </Table>
                            ) : (
                                <Center style={{ flex: 1 }}>
                                    <Alert icon={<AlertCircle size={16} />} color="blue" title="Resumen pendiente">
                                        Ajusta los parámetros y haz clic en "Calcular Resumen" para ver el resultado.
                                    </Alert>
                                </Center>
                            )}
                         </Stack>
                     </Paper>
                </Grid.Col>
            </Grid>

            <Group justify="space-between" mt="md">
                <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                    Volver
                </Button>
                <Button
                    color="green"
                    size="md"
                    onClick={handleFinalizarYPdf}
                    disabled={!resumen || estadoBoton !== 'listo'}
                    loading={estadoBoton === 'guardando' || estadoBoton === 'generando'}
                    leftSection={<FileDown size={18} />}
                >
                    {estadoBoton === 'guardando' ? 'Guardando...' : estadoBoton === 'generando' ? 'Generando PDF...' : 'Finalizar y Generar PDF'}
                </Button>
            </Group>
        </Stack>
    );
}

export default ConfiguracionPresupuestoPaso;