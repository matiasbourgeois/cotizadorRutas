// Archivo: src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx (Versión Correcta y Funcional)

import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { 
    Stack, Title, Grid, Paper, NumberInput, Textarea, Button, Group, Text, Menu, TextInput, rem, Slider 
} from "@mantine/core";
import { ArrowLeft, Send, ChevronDown, FileDown } from "lucide-react"; // Se recuperan todos los íconos
import ResumenPaso from "../../components/ResumenPaso"; // Se mantiene el componente de resumen

const ConfiguracionPresupuestoPaso = () => {
    const navigate = useNavigate();
    
    const { 
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setResumenCostos, resumenCostos, detalleVehiculo, detalleRecurso
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

    // El useEffect para el cálculo en tiempo real no se modifica
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


    // --- 👇👇 LÓGICA DE GUARDADO Y PRESENTACIÓN CORREGIDA 👇👇 ---
    const handleFinalizar = async (tipoAccion = 'propuesta') => {
        if (!resumenCostos) {
            notifications.show({ title: 'Error', message: 'No hay un presupuesto calculado para guardar.', color: 'red' });
            return;
        }
        setLoading(true);
        try {
            // 1. Guardamos la cotización en la base de datos
            const payload = {
                puntosEntrega: puntosEntrega.puntos,
                totalKilometros: puntosEntrega.distanciaKm,
                duracionMin: puntosEntrega.duracionMin,
                frecuencia,
                vehiculo: { datos: vehiculo, calculo: detalleVehiculo },
                recursoHumano: { datos: recursoHumano, calculo: detalleRecurso },
                configuracion: config,
                detallesCarga,
                resumenCostos: resumenCostos,
                cliente: config.cliente,
                terminos: config.terminos
            };
            const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);
            
            notifications.show({ title: '¡Éxito!', message: 'Cotización guardada.', color: 'green' });

            // 2. Decidimos qué hacer después de guardar
            if (tipoAccion === 'propuesta') {
                // Abre la nueva página de propuesta web
                window.open(`/propuesta/${presupuestoGuardado._id}`, '_blank');
            } else { // 'desglose'
                // La lógica para descargar el PDF de desglose se mantiene
                const urlDescarga = `/presupuestos/${presupuestoGuardado._id}/pdf`;
                const res = await clienteAxios.get(urlDescarga, { responseType: 'blob' });
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
        // La estructura de 2 columnas se mantiene intacta
        <Grid gutter="xl">
            {/* COLUMNA IZQUIERDA: PANEL DE CONTROL (SIN CAMBIOS) */}
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder p="xl" radius="md" shadow="sm">
                    <Stack gap="xl">
                        <Title order={2} c="deep-blue.7">Ajustes Finales del Presupuesto</Title>
                        
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

                        {/* EL BOTÓN CON MENÚ DESPLEGABLE SE MANTIENE */}
                        <Group justify="space-between" mt="xl">
                            <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                                Volver
                            </Button>
                            
                            <Group gap={0}>
                                <Button
                                    size="md"
                                    onClick={() => handleFinalizar('propuesta')}
                                    loading={loading}
                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                    leftSection={<Send size={16}/>}
                                >
                                    Finalizar y Ver Propuesta
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
                                            onClick={() => handleFinalizar('desglose')}
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
            
            {/* COLUMNA DERECHA: SE MANTIENE EL INFORME DE MISIÓN */}
            <Grid.Col span={{ base: 12, md: 4 }}>
                <ResumenPaso />
            </Grid.Col>
        </Grid>
    );
};

export default ConfiguracionPresupuestoPaso;