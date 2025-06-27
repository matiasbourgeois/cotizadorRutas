// Archivo: cotizadorRutas-frontend/src/pages/puntosEntregaPaso/PuntosEntregaPaso.jsx (Versión Definitiva Corregida)

import { useState, useCallback } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
import { Grid, Stack, Group, Button, Text, Center, Paper, Select, Title } from "@mantine/core";
import { Navigation, Route, Sparkles, MapPinOff } from "lucide-react";
import { notifications } from '@mantine/notifications';

export default function PuntosEntregaPaso() {
    const navigate = useNavigate();
    
    // ✅ CORRECCIÓN PRINCIPAL: Desestructuramos directamente las propiedades que necesitamos del contexto.
    // Ya no usamos un objeto "cotizacion" intermedio.
    const { 
        puntosEntrega, 
        directionsResult,
        detallesCarga,
        setPuntosEntrega, 
        setDetallesCarga, 
        setDirectionsResult 
    } = useCotizacion();

    // Ahora esta línea funciona porque 'puntosEntrega' se recibe directamente.
    const puntos = puntosEntrega?.puntos || [];

    const [datosRuta, setDatosRuta] = useState(
      puntosEntrega?.distanciaKm 
      ? { distanciaKm: puntosEntrega.distanciaKm, duracionMin: puntosEntrega.duracionMin } 
      : null
    );

    const [isSaving, setIsSaving] = useState(false);

    const limpiarRutaGuardada = () => {
        setDatosRuta(null);
        setDirectionsResult(null);
    };
    
    const agregarPunto = (punto) => {
        if (!punto) return;
        const nuevosPuntos = [...puntos, punto];
        // Pasamos el objeto 'puntosEntrega' completo para mantener su estructura
        setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
        limpiarRutaGuardada();
    };

    const handleEliminarPunto = (index) => {
        const nuevosPuntos = puntos.filter((_, i) => i !== index);
        setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
        limpiarRutaGuardada();
    };
    
    const handleReordenarPuntos = (nuevosPuntos) => {
        setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
        limpiarRutaGuardada();
    };

    // Esta función recibe los datos calculados desde el componente hijo (MapaRuta)
    const handleRutaCalculada = (datos) => {
        setDatosRuta(datos.resumen);
        setDirectionsResult(datos.directions);
        // Guardamos todo en el contexto para persistir la información
        setPuntosEntrega({ puntos: puntos, ...datos.resumen });
    };

    const handleCargaChange = (value) => {
        setDetallesCarga({ ...detallesCarga, tipo: value });
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
            
            setPuntosEntrega({ ...puntosEntrega, ...payload, rutaId: res.data._id });
            // Guardamos el resultado del mapa también al avanzar
            setDirectionsResult(directionsResult);
            navigate(`/cotizador/frecuencia/${res.data._id}`);
        } catch (err) {
            console.error("❌ Error al guardar ruta:", err);
            notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la ruta.', color: 'red'});
        } finally {
            setIsSaving(false);
        }
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
                            />
                            <Paper withBorder p="md" mt="lg" radius="md" bg="gray.0">
                                <Stack>
                                    <Text fw={500} c="dimmed">Detalles de la Carga</Text>
                                    <Select
                                        label="Tipo de Carga"
                                        value={detallesCarga.tipo}
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
                                    initialDirections={directionsResult}
                                    onRutaCalculada={handleRutaCalculada}
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