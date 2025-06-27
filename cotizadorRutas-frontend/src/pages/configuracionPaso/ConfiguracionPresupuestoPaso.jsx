// Archivo: src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx (Versión Final Definitiva Corregida)

import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
// ✅ LÍNEA CORREGIDA: Se añade 'TextInput' a la lista de importaciones
import { 
    Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Text, Alert,
    Center, Loader, Slider, useMantineTheme, Menu, TextInput, rem
} from "@mantine/core";
import { ArrowLeft, Calculator, FileDown, AlertCircle, ChevronDown } from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    
    const { 
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setResumenCostos, resumenCostos 
    } = useCotizacion();

    const [config, setConfig] = useState({
        costoPeajes: 0,
        costoAdministrativo: 10,
        otrosCostos: 0,
        porcentajeGanancia: 15,
        cliente: "",
        terminos: "Para aprobar esta propuesta, por favor, responda a este correo electrónico. La cotización tiene una validez de 15 días."
    });
    const [loading, setLoading] = useState(false);
    const [presupuestoGuardado, setPresupuestoGuardado] = useState(null);

    useEffect(() => {
        if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) {
            return;
        }

        const debounceCalc = setTimeout(() => {
            const payload = { 
                puntosEntrega, frecuencia, vehiculo, recursoHumano, 
                configuracion: config,
                detallesCarga 
            };
            clienteAxios.post('/presupuestos/calcular', payload)
                .then(response => {
                    setResumenCostos(response.data.resumenCostos);
                })
                .catch(error => {
                    console.error("Error en el cálculo en tiempo real:", error);
                });
        }, 300);

        return () => clearTimeout(debounceCalc);

    }, [config, puntosEntrega, frecuencia, vehiculo, recursoHumano, setResumenCostos, detallesCarga]);


    const handleGuardarYGenerar = async (tipoPdf = 'propuesta') => {
        if (!resumenCostos) {
            notifications.show({ title: 'Error', message: 'No hay un presupuesto calculado para guardar.', color: 'red' });
            return;
        }
        setLoading(true);
        try {
            // 1. Guardar la cotización en la BD
            const payload = {
                puntosEntrega: puntosEntrega.puntos,
                totalKilometros: puntosEntrega.distanciaKm,
                duracionMin: puntosEntrega.duracionMin,
                frecuencia,
                vehiculo: { datos: vehiculo, calculo: (await clienteAxios.post('/presupuestos/calcular', {puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: config, detallesCarga})).data.detalleVehiculo },
                recursoHumano: { datos: recursoHumano, calculo: (await clienteAxios.post('/presupuestos/calcular', {puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: config, detallesCarga})).data.detalleRecurso },
                configuracion: config,
                detallesCarga,
                resumenCostos: resumenCostos,
            };
            const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);
            setPresupuestoGuardado(presupuestoGuardado);
            
            notifications.show({ title: '¡Éxito!', message: 'Cotización guardada. Generando PDF...', color: 'green' });

            // 2. Descargar el PDF solicitado
            const urlDescarga = tipoPdf === 'propuesta' ? `/presupuestos/${presupuestoGuardado._id}/propuesta` : `/presupuestos/${presupuestoGuardado._id}/pdf`;
            const nombreArchivo = `${tipoPdf}-${presupuestoGuardado._id}.pdf`;
            
            const res = await clienteAxios.get(urlDescarga, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Error al finalizar:", error);
            notifications.show({ title: 'Error', message: 'No se pudo guardar o generar el PDF.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder p="xl" radius="md" shadow="sm">
                    <Stack gap="xl">
                        <Title order={2} c="deep-blue.7">Deal Desk: Ajustes Finales</Title>
                        
                        <Stack gap="lg" mt="md">
                            <Text fw={500}>Porcentaje de Ganancia: {config.porcentajeGanancia}%</Text>
                            <Slider
                                color="cyan"
                                value={config.porcentajeGanancia}
                                onChange={value => setConfig(prev => ({ ...prev, porcentajeGanancia: value }))}
                                marks={[{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }]}
                            />

                            <Text fw={500} mt="md">Costos Administrativos: {config.costoAdministrativo}%</Text>
                            <Slider
                                color="gray"
                                value={config.costoAdministrativo}
                                onChange={value => setConfig(prev => ({ ...prev, costoAdministrativo: value }))}
                                marks={[{ value: 5 }, { value: 10 }, { value: 15 }]}
                            />
                        </Stack>

                        <Grid mt="lg">
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Costos Adicionales de Ruta"
                                    description="Peajes, tasas, etc. (valor total por viaje)"
                                    value={config.costoPeajes}
                                    onChange={value => setConfig(prev => ({ ...prev, costoPeajes: Number(value) || 0 }))}
                                    prefix="$ "
                                />
                            </Grid.Col>
                             <Grid.Col span={{ base: 12, sm: 6 }}>
                                <NumberInput
                                    label="Otros Costos Fijos"
                                    description="Cualquier otro gasto mensual no contemplado"
                                    value={config.otrosCostos}
                                    onChange={value => setConfig(prev => ({ ...prev, otrosCostos: Number(value) || 0 }))}
                                    prefix="$ "
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Cliente / Empresa"
                                    placeholder="Nombre del destinatario de la propuesta"
                                    value={config.cliente}
                                    onChange={event => setConfig(prev => ({ ...prev, cliente: event.currentTarget.value }))}
                                />
                            </Grid.Col>
                        </Grid>
                        
                        <Textarea
                            label="Términos y Próximos Pasos"
                            value={config.terminos}
                            onChange={event => setConfig(prev => ({ ...prev, terminos: event.currentTarget.value }))}
                            autosize
                            minRows={4}
                        />

                        <Group justify="space-between" mt="xl">
                            <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                                Volver
                            </Button>
                            
                            <Group gap={0}>
                                <Button
                                    size="md"
                                    onClick={() => handleGuardarYGenerar('propuesta')}
                                    loading={loading}
                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                >
                                    Finalizar y Generar Propuesta
                                </Button>
                                <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                                    <Menu.Target>
                                        <Button
                                            size="md"
                                            loading={loading}
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: rem(8), paddingRight: rem(8) }}
                                        >
                                            <ChevronDown size={18} />
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<FileDown size={16} />}
                                            onClick={() => handleGuardarYGenerar('desglose')}
                                        >
                                            Descargar Desglose Interno
                                        </Menu.Item>
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