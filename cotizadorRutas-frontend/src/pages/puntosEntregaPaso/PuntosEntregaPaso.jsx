// Archivo: cotizadorRutas-frontend/src/pages/puntosEntregaPaso/PuntosEntregaPaso.jsx (Versión con Sincronización Total)

import { useState, useEffect, useCallback } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
import { Grid, Stack, Group, Button, Text, Center, Paper, Select, Title } from "@mantine/core";
import { Navigation, Route, Sparkles, Box, MapPinOff } from "lucide-react";
import { notifications } from '@mantine/notifications';

export default function PuntosEntregaPaso() {
    const navigate = useNavigate();
    const { cotizacion, setPuntosEntrega, setDetallesCarga } = useCotizacion();

    const puntos = cotizacion.puntosEntrega?.puntos || [];

    const [optimizar, setOptimizar] = useState(false);
    const [recalculo, setRecalculo] = useState(0);
    // --- ✅ INICIO: CAMBIO CLAVE EN EL ESTADO INICIAL ---
    // ¿Por qué este cambio?
    // Ahora, el estado local 'datosRuta' se inicializa directamente con los
    // valores del contexto. Si estamos volviendo a la página, el resumen
    // de distancia y duración aparecerá inmediatamente.
    const [datosRuta, setDatosRuta] = useState(
      cotizacion.puntosEntrega?.distanciaKm 
      ? { distanciaKm: cotizacion.puntosEntrega.distanciaKm, duracionMin: cotizacion.puntosEntrega.duracionMin } 
      : null
    );
    // --- ✅ FIN: CAMBIO CLAVE ---

    const [isSaving, setIsSaving] = useState(false);
    
    // Este useEffect ahora solo se encarga de redibujar el mapa si es necesario
    useEffect(() => {
        if (puntos.length >= 2 && cotizacion.puntosEntrega?.distanciaKm) {
            handleCalcular(false);
        }
    }, []);

    const agregarPunto = (punto) => {
        if (!punto) return;
        const nuevosPuntos = [...puntos, punto];
        setPuntosEntrega({ ...cotizacion.puntosEntrega, puntos: nuevosPuntos });
        setOptimizar(false);
        setDatosRuta(null); // Reseteamos el resumen para forzar un nuevo cálculo
    };

    const handleEliminarPunto = (index) => {
        const nuevosPuntos = puntos.filter((_, i) => i !== index);
        setPuntosEntrega({ ...cotizacion.puntosEntrega, puntos: nuevosPuntos });
        setDatosRuta(null);
    };
    
    const handleReordenarPuntos = (nuevosPuntos) => {
        setPuntosEntrega({ ...cotizacion.puntosEntrega, puntos: nuevosPuntos });
        setDatosRuta(null);
    };

    const handleOptimizarOrden = useCallback((nuevosPuntos) => {
        setPuntosEntrega({ ...cotizacion.puntosEntrega, puntos: nuevosPuntos });
        setOptimizar(false);
    }, [cotizacion.puntosEntrega, setPuntosEntrega]); 

    const handleCargaChange = (value) => {
        setDetallesCarga(prev => ({ ...prev, tipo: value }));
    };

    const handleSiguiente = async () => {
        if (!datosRuta) {
            notifications.show({ title: 'Acción Requerida', message: 'Por favor, calcula la ruta.', color: 'yellow' });
            return;
        }
        setIsSaving(true);
        try {
            const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
            const payload = { puntos: ordenados, distanciaKm: datosRuta.distanciaKm, duracionMin: datosRuta.duracionMin };
            const res = await clienteAxios.post('/rutas', payload);
            
            setPuntosEntrega({ ...payload, rutaId: res.data._id });
            navigate(`/cotizador/frecuencia/${res.data._id}`);
        } catch (err) {
            console.error("❌ Error al guardar ruta:", err);
            notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la ruta.', color: 'red'});
        } finally {
            setIsSaving(false);
        }
    };

    const handleCalcular = (optimizado = false) => {
        setOptimizar(optimizado);
        setRecalculo(prev => prev + 1);
    };

    return (
        <Paper withBorder p="xl" radius="md" shadow="sm">
            <Stack>
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, lg: 5 }}>
                        <Stack>
                            <Title order={3} c="deep-blue.8">1. Ingresa los Puntos</Title>
                            <BuscadorDireccion onAgregar={agregarPunto} />
                            <TablaPuntos 
                                puntos={puntos} 
                                onReordenar={handleReordenarPuntos}
                                onEliminar={handleEliminarPunto}
                                setOptimizar={setOptimizar} 
                            />
                            <Paper withBorder p="md" mt="lg" radius="md" bg="gray.0">
                                <Stack>
                                    <Text fw={500} c="dimmed">Detalles de la Carga</Text>
                                    <Select
                                        label="Tipo de Carga"
                                        value={cotizacion.detallesCarga.tipo}
                                        onChange={handleCargaChange}
                                        data={[
                                            { value: 'general', label: 'Carga General' },
                                            { value: 'refrigerada', label: 'Carga Refrigerada' },
                                            { value: 'peligrosa', label: 'Carga Peligrosa' }
                                        ]}
                                    />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, lg: 7 }}>
                        <Stack>
                            <Title order={3} c="deep-blue.8">2. Visualiza el Trayecto</Title>
                            {puntos.length > 0 ? (
                                <MapaRuta
                                    puntos={puntos}
                                    optimizar={optimizar}
                                    onOptimizarOrden={handleOptimizarOrden}
                                    onDatosRuta={setDatosRuta}
                                    recalculo={recalculo}
                                />
                            ) : (
                                <Center h={400} bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                                    <Stack align="center" gap="xs">
                                        <MapPinOff size={48} color="lightgray" strokeWidth={1.5} />
                                        <Text c="dimmed">Agrega al menos dos puntos</Text>
                                        <Text c="dimmed" size="xs">para visualizar el mapa de la ruta.</Text>
                                    </Stack>
                                </Center>
                            )}
                            {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}
                        </Stack>
                    </Grid.Col>
                </Grid>
                
                {puntos.length >= 2 && !datosRuta && (
                    <Group grow mt="md">
                        <Button variant="default" onClick={() => handleCalcular(false)} leftSection={<Route size={16} />}>
                            Calcular Ruta
                        </Button>
                        <Button onClick={() => handleCalcular(true)} leftSection={<Sparkles size={16} />}>
                            Optimizar y Calcular
                        </Button>
                    </Group>
                )}

                <Group justify="flex-end" mt="xl">
                    <Button
                        size="md"
                        onClick={handleSiguiente}
                        disabled={!datosRuta || isSaving}
                        loading={isSaving}
                        rightSection={<Navigation size={18} />}
                    >
                        Siguiente: Frecuencia
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}