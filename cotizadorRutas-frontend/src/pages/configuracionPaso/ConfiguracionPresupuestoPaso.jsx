// Archivo: src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx (Refactorizado con useForm)

import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
// ✅ 1. Importamos el hook useForm
import { useForm } from "@mantine/form";
import {
    Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Text, Menu, TextInput, rem, Slider
} from "@mantine/core";
import { ArrowLeft, Send, ChevronDown, FileDown } from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();

    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setResumenCostos, resumenCostos, detalleVehiculo, detalleRecurso,
        setDetalleVehiculo, setDetalleRecurso
    } = useCotizacion();

    // ✅ 2. Reemplazamos el useState por useForm para manejar la configuración
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

    useEffect(() => {
        if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) {
            return;
        }
        const debounceCalc = setTimeout(() => {
            const payload = {
                puntosEntrega, frecuencia, vehiculo, recursoHumano,
                configuracion: form.values, // Usamos los valores del formulario
                detallesCarga
            };
            clienteAxios.post('/presupuestos/calcular', payload)
                .then(response => {
                    // ANTES: solo se actualizaba el resumen
                    // setResumenCostos(response.data.resumenCostos);

                    // ✅ AHORA: Actualizamos toda la información relevante
                    setResumenCostos(response.data.resumenCostos);
                    setDetalleVehiculo(response.data.detalleVehiculo);
                    setDetalleRecurso(response.data.detalleRecurso);
                })
                .catch(error => {
                    console.error("Error en el cálculo en tiempo real:", error);
                });
        }, 300);
        return () => clearTimeout(debounceCalc);
        // ✅ 3. El useEffect ahora depende de form.values
    }, [form.values, puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setResumenCostos]);


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
                configuracion: form.values, // Usamos los valores del formulario
                detallesCarga,
                resumenCostos: resumenCostos,
                cliente: form.values.cliente,
                terminos: form.values.terminos
            };
            const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);

            notifications.show({ title: '¡Éxito!', message: 'Cotización guardada.', color: 'green' });

            if (tipoAccion === 'propuesta') {
                window.open(`/propuesta/${presupuestoGuardado._id}`, '_blank');
            } else { // ✅ Lógica corregida para 'desglose'
                window.open(`/desglose/${presupuestoGuardado._id}`, '_blank');
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `desglose-${presupuestoGuardado._id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

        } catch (error) {
            console.error("Error al finalizar:", error);
            notifications.show({ title: 'Error', message: 'No se pudo guardar o generar el documento.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder p="xl" radius="md" shadow="sm">
                    <Stack gap="xl">
                        <Title order={2} c="deep-blue.7">Ajustes Finales del Presupuesto</Title>

                        <Stack gap="lg" mt="md">
                            {/* ✅ 4. Conectamos cada campo al formulario con getInputProps */}
                            <Text fw={500}>Porcentaje de Ganancia: {form.values.porcentajeGanancia}%</Text>
                            <Slider
                                color="cyan"
                                marks={[{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }]}
                                {...form.getInputProps('porcentajeGanancia')}
                            />

                            <Text fw={500} mt="md">Costos Administrativos: {form.values.costoAdministrativo}%</Text>
                            <Slider
                                color="gray"
                                marks={[{ value: 5 }, { value: 10 }, { value: 15 }]}
                                {...form.getInputProps('costoAdministrativo')}
                            />
                        </Stack>

                        <Grid mt="lg">
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Costos Adicionales de Ruta"
                                    description="Peajes, tasas, etc. (valor total por viaje)"
                                    prefix="$ "
                                    {...form.getInputProps('costoPeajes')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Otros Costos Fijos"
                                    description="Cualquier otro gasto mensual no contemplado"
                                    prefix="$ "
                                    {...form.getInputProps('otrosCostos')}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Cliente / Empresa"
                                    placeholder="Nombre del destinatario de la propuesta"
                                    {...form.getInputProps('cliente')}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="Términos y Próximos Pasos"
                            autosize
                            minRows={4}
                            {...form.getInputProps('terminos')}
                        />

                        <Group justify="space-between" mt="xl">
                            <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                                Volver
                            </Button>
                            <Group gap={0}>
                                <Button size="md" onClick={() => handleFinalizar('propuesta')} loading={loading} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} leftSection={<Send size={16} />}>Finalizar y Ver Propuesta</Button>
                                <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                                    <Menu.Target>
                                        <Button size="md" loading={loading} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: rem(8), paddingRight: rem(8) }}><ChevronDown size={18} /></Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<FileDown size={16} />} onClick={() => handleFinalizar('desglose')}>Descargar Desglose Interno</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
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