// En: src/pages/puntosEntregaPaso/PuntosEntregaPaso.jsx

import { useState, useEffect, useCallback } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
// ✅ --- INICIO: NUEVAS IMPORTACIONES ---
import { Grid, Stack, Group, Button, Title, Text, Center, Paper, Select } from "@mantine/core";
import { Navigation, Route, Sparkles, Box } from "lucide-react";
import { API_URL } from '../../apiConfig';
// ✅ --- FIN: NUEVAS IMPORTACIONES ---

export default function PuntosEntregaPaso() {
    const [puntos, setPuntos] = useState([]);
    const [optimizar, setOptimizar] = useState(false);
    const [recalculo, setRecalculo] = useState(0);
    const [datosRuta, setDatosRuta] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    
    // ✅ Obtenemos los detalles y el setter de la carga desde el contexto.
    const { setPuntosEntrega, detallesCarga, setDetallesCarga } = useCotizacion();

    useEffect(() => {
        setDatosRuta(null);
    }, [puntos]);

    const agregarPunto = (punto) => {
        if (!punto) return;
        setPuntos((prev) => [...prev, punto]);
        setOptimizar(false);
    };

    const handleOptimizarOrden = useCallback((nuevoOrden) => {
        setPuntos(nuevoOrden);
        setOptimizar(false);
    }, []); 

    // ✅ Función para manejar el cambio en el selector de tipo de carga.
    const handleCargaChange = (value) => {
        setDetallesCarga(prev => ({ ...prev, tipo: value }));
    };

    const handleSiguiente = async () => {
        if (!datosRuta) {
            alert("Por favor, calcula la ruta antes de continuar.");
            return;
        }
        setIsSaving(true);
        try {
            const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
            
            const payload = {
                puntos: ordenados,
                distanciaKm: datosRuta.distanciaKm,
                duracionMin: datosRuta.duracionMin,
            };

            const res = await clienteAxios.post('/rutas', payload);
            const nuevaRuta = res.data;
            
            setPuntosEntrega({ ...payload, rutaId: nuevaRuta._id });

            navigate(`/cotizador/frecuencia/${nuevaRuta._id}`);
        } catch (err) {
            console.error("❌ Error al guardar ruta:", err);
            alert("Error al guardar la ruta. Ver consola.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCalcular = (optimizado = false) => {
        setOptimizar(optimizado);
        setRecalculo(prev => prev + 1);
    };

    return (
        <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack>
                    <Title order={2} c="deep-blue.7">Define los Puntos de la Ruta</Title>
                    <BuscadorDireccion onAgregar={agregarPunto} />
                    <TablaPuntos puntos={puntos} setPuntos={setPuntos} setOptimizar={setOptimizar} />
                    
                    {/* ✅ --- INICIO: SECCIÓN NUEVA "DETALLES DE LA CARGA" --- ✅ */}
                    <Paper withBorder p="md" mt="lg" radius="md">
                        <Stack>
                            <Title order={4} c="dimmed">Detalles de la Carga</Title>
                            <Select
                                label="Tipo de Carga"
                                value={detallesCarga.tipo}
                                onChange={handleCargaChange}
                                data={[
                                    { value: 'general', label: 'Carga General' },
                                    { value: 'refrigerada', label: 'Carga Refrigerada' },
                                    { value: 'peligrosa', label: 'Carga Peligrosa' }
                                ]}
                                leftSection={<Box size={16} />}
                            />
                        </Stack>
                    </Paper>
                    {/* ✅ --- FIN: SECCIÓN NUEVA --- ✅ */}

                    {puntos.length >= 2 && (
                        <Group grow mt="md">
                            <Button 
                                variant="default" 
                                onClick={() => handleCalcular(false)}
                                leftSection={<Route size={16} />}
                            >
                                Calcular Ruta
                            </Button>
                            <Button 
                                onClick={() => handleCalcular(true)}
                                leftSection={<Sparkles size={16} />}
                            >
                                Optimizar y Calcular
                            </Button>
                        </Group>
                    )}
                </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
                <Stack>
                    <Title order={2} c="deep-blue.7">Visualización de Ruta</Title>
                    {puntos.length > 0 ? (
                        <MapaRuta
                            puntos={puntos}
                            optimizar={optimizar}
                            onOptimizarOrden={handleOptimizarOrden}
                            onDatosRuta={setDatosRuta}
                            recalculo={recalculo}
                        />
                    ) : (
                        <Center h={400} bg="gray.1" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                            <Text c="dimmed">Agrega al menos dos puntos para visualizar el mapa.</Text>
                        </Center>
                    )}
                   
                    {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}
                </Stack>
            </Grid.Col>

            {puntos.length >= 2 && (
                <Grid.Col span={12}>
                    <Group justify="flex-end" mt="xl">
                        <Button
                            size="md"
                            color="cyan"
                            onClick={handleSiguiente}
                            disabled={!datosRuta || isSaving}
                            loading={isSaving}
                            leftSection={<Navigation size={18} />}
                        >
                            Siguiente Paso
                        </Button>
                    </Group>
                </Grid.Col>
            )}
        </Grid>
    );
}