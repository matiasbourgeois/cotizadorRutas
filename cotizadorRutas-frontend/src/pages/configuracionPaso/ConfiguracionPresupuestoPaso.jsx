// Archivo: src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx (Versión Final con Formulario Deshabilitado)

import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import {
    Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Text, Menu, TextInput, rem, Slider
} from "@mantine/core";
import { ArrowLeft, Send, ChevronDown, FileDown, Eye } from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();

    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setResumenCostos, resumenCostos, detalleVehiculo, detalleRecurso,
        setDetalleVehiculo, setDetalleRecurso
    } = useCotizacion();

    const form = useForm({
        initialValues: {
            costoPeajes: 0,
            costoAdministrativo: 10,
            otrosCostos: 0,
            porcentajeGanancia: 15,
            cliente: "",
            terminos: "Para aprobar esta propuesta, por favor, responda a este correo electrónico. La cotización tiene una validez de 15 días."
        },
    });

    const [loading, setLoading] = useState(false);
    const [presupuestoGuardadoId, setPresupuestoGuardadoId] = useState(null);
    
    // ✅ 1. Creamos una variable booleana para saber si el formulario debe estar deshabilitado.
    const isFormDisabled = !!presupuestoGuardadoId;

    useEffect(() => {
        if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) {
            return;
        }
        const debounceCalc = setTimeout(() => {
            const payload = {
                puntosEntrega, frecuencia, vehiculo, recursoHumano,
                configuracion: form.values,
                detallesCarga
            };
            clienteAxios.post('/presupuestos/calcular', payload)
                .then(response => {
                    setResumenCostos(response.data.resumenCostos);
                    setDetalleVehiculo(response.data.detalleVehiculo);
                    setDetalleRecurso(response.data.detalleRecurso);
                })
                .catch(error => {
                    console.error("Error en el cálculo en tiempo real:", error);
                });
        }, 300);
        return () => clearTimeout(debounceCalc);
    }, [form.values, puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setResumenCostos, setDetalleVehiculo, setDetalleRecurso]);


    const handleFinalizar = async (tipoAccion = 'propuesta') => {
        if (!resumenCostos) {
            notifications.show({ title: 'Error', message: 'No hay un presupuesto calculado para guardar.', color: 'red' });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                puntosEntrega: puntosEntrega.puntos,
                totalKilometros: puntosEntrega.distanciaKm,
                duracionMin: puntosEntrega.duracionMin,
                frecuencia,
                vehiculo: { datos: vehiculo, calculo: detalleVehiculo },
                recursoHumano: { datos: recursoHumano, calculo: detalleRecurso },
                configuracion: form.values,
                detallesCarga,
                resumenCostos: resumenCostos,
                cliente: form.values.cliente,
                terminos: form.values.terminos
            };
            const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);

            notifications.show({ title: '¡Éxito!', message: 'Cotización guardada.', color: 'green' });
            
            setPresupuestoGuardadoId(presupuestoGuardado._id);

            if (tipoAccion === 'propuesta') {
                window.open(`/propuesta/${presupuestoGuardado._id}`, '_blank');
            } else {
                window.open(`/desglose/${presupuestoGuardado._id}`, '_blank');
            }

        } catch (error) {
            console.error("Error al finalizar:", error);
            notifications.show({ title: 'Error', message: 'No se pudo guardar o generar el documento.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerDocumento = (tipo) => {
        if (presupuestoGuardadoId) {
            window.open(`/${tipo}/${presupuestoGuardadoId}`, '_blank');
        }
    };

    return (
        <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder p="xl" radius="md" shadow="sm">
                    <Stack gap="xl">
                        <Title order={2} c="deep-blue.7">Ajustes Finales del Presupuesto</Title>

                        <Stack gap="lg" mt="md">
                            <Text fw={500}>Porcentaje de Ganancia: {form.values.porcentajeGanancia}%</Text>
                            {/* ✅ 2. Añadimos la propiedad 'disabled' a todos los campos */}
                            <Slider
                                color="cyan"
                                marks={[{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }]}
                                {...form.getInputProps('porcentajeGanancia')}
                                disabled={isFormDisabled}
                            />

                            <Text fw={500} mt="md">Costos Administrativos: {form.values.costoAdministrativo}%</Text>
                            <Slider
                                color="gray"
                                marks={[{ value: 5 }, { value: 10 }, { value: 15 }]}
                                {...form.getInputProps('costoAdministrativo')}
                                disabled={isFormDisabled}
                            />
                        </Stack>

                        <Grid mt="lg">
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Costos Adicionales de Ruta"
                                    description="Peajes, tasas, etc. (valor total por viaje)"
                                    prefix="$ "
                                    {...form.getInputProps('costoPeajes')}
                                    disabled={isFormDisabled}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Otros Costos Fijos"
                                    description="Cualquier otro gasto mensual no contemplado"
                                    prefix="$ "
                                    {...form.getInputProps('otrosCostos')}
                                    disabled={isFormDisabled}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Cliente / Empresa"
                                    placeholder="Nombre del destinatario de la propuesta"
                                    {...form.getInputProps('cliente')}
                                    disabled={isFormDisabled}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="Términos y Próximos Pasos"
                            autosize
                            minRows={4}
                            {...form.getInputProps('terminos')}
                            disabled={isFormDisabled}
                        />
                        
                        <Group justify="space-between" mt="xl">
                            <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                                Volver
                            </Button>

                            {isFormDisabled ? (
                                <Group>
                                    <Button variant="light" color="blue" onClick={() => handleVerDocumento('desglose')} leftSection={<Eye size={16} />}>
                                        Ver Desglose Interno
                                    </Button>
                                    <Button onClick={() => handleVerDocumento('propuesta')} leftSection={<Eye size={16} />}>
                                        Ver Propuesta Cliente
                                    </Button>
                                </Group>
                            ) : (
                                <Group gap={0}>
                                    <Button size="md" onClick={() => handleFinalizar('propuesta')} loading={loading} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} leftSection={<Send size={16} />}>Finalizar y Ver Propuesta</Button>
                                    <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                                        <Menu.Target>
                                            <Button size="md" loading={loading} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: rem(8), paddingRight: rem(8) }}><ChevronDown size={18} /></Button>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<FileDown size={16} />} onClick={() => handleFinalizar('desglose')}>Guardar y Descargar Desglose</Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            )}
                        </Group>
                    </Stack>
                </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
                <ResumenPaso />
            </Grid.Col>
        </Grid>
    );
};

export default ConfiguracionPresupuestoPaso;