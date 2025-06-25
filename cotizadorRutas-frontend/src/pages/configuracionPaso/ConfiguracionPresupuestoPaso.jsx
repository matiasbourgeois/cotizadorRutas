// Archivo: cotizadorRutas-frontend/src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx (Versión Final con Flujo Lógico)

import React, { useState } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { 
    Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Table, Text, Alert, Center, Menu, ActionIcon, ButtonGroup, TextInput
} from "@mantine/core";
import { ArrowLeft, Calculator, FileDown, AlertCircle, Check as CheckIcon } from "lucide-react";

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();
    const { puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga } = useCotizacion();

    const [config, setConfig] = useState({
        costoPeajes: 0,
        costoAdministrativo: 10,
        otrosCostos: 0,
        porcentajeGanancia: 15,
        observaciones: "",
        cliente: "", // <-- Nuevo campo
        terminos: "Para aprobar esta propuesta, por favor, responda a este correo electrónico. La cotización tiene una validez de 15 días." // <-- Nuevo campo con valor por defecto
    });

    const [resumen, setResumen] = useState(null);
    const [presupuestoGuardado, setPresupuestoGuardado] = useState(null);
    const [loading, setLoading] = useState({ calcular: false, guardar: false });

    // --- (Las funciones de handleChange, handleCalcularPresupuesto y handleDescargarPdf no cambian) ---
    const handleChange = (name, value) => {
        const valorFinal = typeof value === 'string' ? value : parseFloat(value) || 0;
        setConfig((prev) => ({ ...prev, [name]: valorFinal }));
        setPresupuestoGuardado(null);
    };

    const handleCalcularPresupuesto = async () => {
        if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) {
            notifications.show({ title: 'Faltan datos', message: 'Debes completar todos los pasos anteriores.', color: 'red' });
            return;
        }
        setLoading(prev => ({ ...prev, calcular: true }));
        setResumen(null);
        setPresupuestoGuardado(null);
        try {
            const payload = { puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: config, detallesCarga };
            const response = await clienteAxios.post('/presupuestos/calcular', payload);
            setResumen(response.data);
            notifications.show({ title: 'Cálculo exitoso', message: 'El resumen del presupuesto ha sido generado.', color: 'green' });
        } catch (error) {
            console.error("Error al calcular:", error);
            notifications.show({ title: 'Error en el cálculo', message: 'No se pudo generar el resumen.', color: 'red' });
        } finally {
            setLoading(prev => ({ ...prev, calcular: false }));
        }
    };

    const handleGuardar = async () => {
        if (!resumen) return;
        setLoading(prev => ({ ...prev, guardar: true }));
        try {
            const payload = {
                puntosEntrega: puntosEntrega.puntos,
                totalKilometros: puntosEntrega.distanciaKm,
                duracionMin: puntosEntrega.duracionMin,
                frecuencia,
                vehiculo: { datos: vehiculo, calculo: resumen.detalleVehiculo },
                recursoHumano: { datos: recursoHumano, calculo: resumen.detalleRecurso },
                configuracion: config,
                detallesCarga,
                resumenCostos: resumen.resumenCostos,
            };
            const response = await clienteAxios.post('/presupuestos', payload);
            setPresupuestoGuardado(response.data);
            notifications.show({
                title: '¡Cotización Guardada!',
                message: 'Ya puedes descargar los PDFs.',
                color: 'green',
                icon: <CheckIcon size={18} />,
            });
        } catch (error) {
            console.error("Error al guardar:", error);
            notifications.show({ title: 'Error al guardar', message: 'No se pudo guardar la cotización.', color: 'red' });
        } finally {
            setLoading(prev => ({ ...prev, guardar: false }));
        }
    };

    const handleDescargarPdf = async (tipo) => {
        const id = presupuestoGuardado?._id;
        if (!id) return;

        const notificationId = `descarga-${id}-${tipo}`;
        notifications.show({
            id: notificationId,
            title: 'Generando PDF...',
            message: `Tu ${tipo === 'propuesta' ? 'propuesta' : 'desglose'} se está preparando.`,
            loading: true,
            autoClose: false,
        });

        const urlDescarga = tipo === 'propuesta' ? `/presupuestos/${id}/propuesta` : `/presupuestos/${id}/pdf`;
        const nombreArchivo = `${tipo}-${id}.pdf`;

        try {
            const res = await clienteAxios.get(urlDescarga, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            link.remove();
            notifications.update({
                id: notificationId,
                title: '¡Descarga Completa!',
                message: 'Tu PDF se ha descargado exitosamente.',
                color: 'green',
                icon: <FileDown size={18} />,
                autoClose: 5000,
            });
        } catch (error) {
            notifications.update({
                id: notificationId,
                title: 'Error de descarga',
                message: 'No se pudo generar o descargar el PDF.',
                color: 'red',
            });
        }
    };

    // --- (La lógica de 'rows' y el return principal no cambian) ---
    const rows = resumen?.resumenCostos ? Object.entries(resumen.resumenCostos).map(([key, value]) => {
        const isTotal = key === 'totalFinal';
        if (key === 'costoAdicionalPeligrosa' && !value) return null;
        return (
            <Table.Tr key={key} bg={isTotal ? 'cyan.0' : undefined}>
                <Table.Td><Text fw={isTotal ? 700 : 400} c={isTotal ? 'cyan.9' : undefined}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text></Table.Td>
                <Table.Td><Text fw={isTotal ? 700 : 500} ta="right" c={isTotal ? 'cyan.9' : undefined}>${(value || 0).toLocaleString('es-AR')}</Text></Table.Td>
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
                            <NumberInput label="Costo Administrativo" value={config.costoAdministrativo} onChange={(v) => handleChange('costoAdministrativo', v)} suffix=" %" min={0} />
                            <NumberInput label="Otros Costos (mensual)" value={config.otrosCostos} onChange={(v) => handleChange('otrosCostos', v)} prefix="$ " thousandSeparator="," decimalScale={2} />
                            <NumberInput label="Porcentaje de Ganancia" value={config.porcentajeGanancia} onChange={(v) => handleChange('porcentajeGanancia', v)} suffix=" %" min={0} />
                            <TextInput
                                label="Cliente / Empresa"
                                placeholder="Nombre del destinatario de la propuesta"
                                value={config.cliente}
                                onChange={(event) => handleChange('cliente', event.currentTarget.value)}
                            />
                            <Textarea
                                label="Términos y Próximos Pasos"
                                value={config.terminos}
                                onChange={(event) => handleChange('terminos', event.currentTarget.value)}
                                autosize
                                minRows={3}
                            />
                            <Textarea label="Observaciones Finales" placeholder="Aclaraciones para el PDF..." value={config.observaciones} onChange={(e) => handleChange('observaciones', e.currentTarget.value)} autosize minRows={3} />
                            <Button mt="md" onClick={handleCalcularPresupuesto} loading={loading.calcular} leftSection={<Calculator size={18} />} fullWidth>Calcular Resumen</Button>
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper withBorder shadow="sm" p="md" radius="md" style={{ height: '100%' }}>
                        <Stack h="100%">
                            <Title order={4} c="dimmed">📊 Resumen del Presupuesto</Title>
                            {resumen ? (
                                <Table striped withColumnBorders>
                                    <Table.Thead><Table.Tr><Table.Th>Concepto</Table.Th><Table.Th style={{ textAlign: 'right' }}>Monto</Table.Th></Table.Tr></Table.Thead>
                                    <Table.Tbody>{rows}</Table.Tbody>
                                </Table>
                            ) : (
                                <Center style={{ flex: 1 }}>
                                    <Alert icon={<AlertCircle size={16} />} color="blue" title="Resumen pendiente">Ajusta los parámetros y haz clic en "Calcular Resumen" para ver el resultado.</Alert>
                                </Center>
                            )}
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
            <Group justify="space-between" mt="md">
                <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>Volver</Button>

                {/* --- ✅ INICIO: NUEVA LÓGICA DE BOTONES MEJORADA --- */}
                {/* ¿Por qué este cambio?
                    Ahora mostramos un solo botón para Guardar. Una vez guardado,
                    este desaparece y se reemplaza por los dos botones de descarga,
                    que es el siguiente paso lógico para el usuario.
                */}
                {presupuestoGuardado ? (
                    <Group>
                        <Button
                            variant="outline"
                            onClick={() => handleDescargarPdf('desglose')}
                            leftSection={<FileDown size={16} />}
                        >
                            Descargar Desglose
                        </Button>
                        <Button
                            color="green"
                            onClick={() => handleDescargarPdf('propuesta')}
                            leftSection={<FileDown size={16} />}
                        >
                            Descargar Propuesta para Cliente
                        </Button>
                    </Group>
                ) : (
                    <Button
                        onClick={handleGuardar}
                        loading={loading.guardar}
                        color="green"
                        size="md"
                        disabled={!resumen || loading.guardar}
                    >
                        Finalizar y Guardar Cotización
                    </Button>
                )}
                {/* --- ✅ FIN: NUEVA LÓGICA DE BOTONES MEJORADA --- */}
            </Group>
        </Stack>
    );
}

export default ConfiguracionPresupuestoPaso;