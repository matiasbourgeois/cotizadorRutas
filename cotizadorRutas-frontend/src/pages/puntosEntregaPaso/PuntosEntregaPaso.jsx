// Archivo: cotizadorRutas-frontend/src/pages/puntosEntregaPaso/PuntosEntregaPaso.jsx
import { useMemo, useState } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
import { Grid, Stack, Group, Button, Text, Center, Paper, Select, Title } from "@mantine/core";
import { Navigation, MapPinOff } from "lucide-react";
import { notifications } from '@mantine/notifications';

export default function PuntosEntregaPaso() {
  const navigate = useNavigate();

  const {
    puntosEntrega,
    directionsResult,
    detallesCarga,
    setPuntosEntrega,
    setDetallesCarga,
    setDirectionsResult
  } = useCotizacion();

  const puntos = puntosEntrega?.puntos || [];

  const [datosRuta, setDatosRuta] = useState(
    puntosEntrega?.distanciaKm
      ? { distanciaKm: puntosEntrega.distanciaKm, duracionMin: puntosEntrega.duracionMin }
      : null
  );

  const [isSaving, setIsSaving] = useState(false);

  // fuerza remount del mapa cuando cambia el orden/contenido de puntos
  const mapaKey = useMemo(() => {
    return (puntos || [])
      .map((p, i) => String(p.id ?? p._id ?? p.nombre ?? i))
      .join("|");
  }, [puntos]);

  // --- lógica existente ---
  const limpiarRutaGuardada = () => {
    setDatosRuta(null);
    setDirectionsResult(null);
  };
  const agregarPunto = (punto) => {
    if (!punto) return;
    const nuevosPuntos = [...puntos, punto];
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
  const handleRutaCalculada = (datos) => {
    setDatosRuta(datos.resumen);
    setDirectionsResult(datos.directions);
    setPuntosEntrega({ puntos: puntos, ...datos.resumen });
  };
  const handleCargaChange = (value) => {
    setDetallesCarga({ ...detallesCarga, tipo: value });
  };
  const handleSiguiente = async () => {
    if (puntos.length < 2) {
      notifications.show({ title: 'Ruta incompleta', message: 'Necesitas al menos 2 puntos para definir una ruta.', color: 'orange' });
      return;
    }
    if (!datosRuta) {
      notifications.show({ title: 'Acción Requerida', message: 'La ruta aún no ha sido calculada en el mapa.', color: 'yellow' });
      return;
    }
    setIsSaving(true);
    try {
      const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
      const payload = { puntos: ordenados, distanciaKm: datosRuta.distanciaKm, duracionMin: datosRuta.duracionMin };
      const res = await clienteAxios.post('/rutas', payload);
      setPuntosEntrega({ ...puntosEntrega, ...payload, rutaId: res.data._id });
      setDirectionsResult(directionsResult);
      navigate(`/cotizador/frecuencia/${res.data._id}`);
    } catch (err) {
      console.error("❌ Error al guardar ruta:", err);
      notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la ruta.', color: 'red' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Paper withBorder p="xl" radius="md" shadow="sm" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* superior */}
          <div style={{ flexShrink: 0 }}>
            <Title order={2} c="deep-blue.7">Panel de Ruta</Title>
            <Stack gap="xl" mt="xl">
              <BuscadorDireccion onAgregar={agregarPunto} />
            </Stack>
          </div>

          {/* media */}
          <Stack gap="xs" mt="xl" style={{ flex: 1, minHeight: 0 }}>
            <Text fz="sm" fw={500} c="dimmed">Hoja de Ruta</Text>
            <Paper withBorder radius="md" p="sm" style={{ height: '100%' }}>
              <TablaPuntos
                puntos={puntos}
                onReordenar={handleReordenarPuntos}
                onEliminar={handleEliminarPunto}
              />
            </Paper>
          </Stack>

          {/* inferior */}
          <div style={{ flexShrink: 0 }}>
            <Paper withBorder p="md" mt="lg" radius="md" bg="gray.0">
              <Stack>
                <Text fw={500} c="dimmed">Inteligencia de Carga</Text>
                <Select
                  label="Tipo de Carga"
                  description="Afecta los cálculos de costos."
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
          </div>
        </Paper>
      </Grid.Col>

      {/* derecha */}
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Paper withBorder p="xl" radius="md" shadow="sm" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack gap="xl" style={{ flexGrow: 1 }}>
            <Title order={2} c="deep-blue.7">Visualizador de Misión</Title>
            <Stack>
              <Paper withBorder radius="md" p={4}>
                {puntos.length > 0 ? (
                  <MapaRuta
                    key={mapaKey}
                    puntos={puntos}
                    initialDirections={directionsResult}
                    onRutaCalculada={handleRutaCalculada}
                  />
                ) : (
                  <Center h={400} bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                    <Stack align="center" gap="xs">
                      <MapPinOff size={48} color="lightgray" strokeWidth={1.5} />
                      <Text c="dimmed">Agrega puntos en el Panel de Ruta</Text>
                      <Text c="dimmed" size="xs">para visualizar el mapa.</Text>
                    </Stack>
                  </Center>
                )}
              </Paper>
              {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}
            </Stack>

            <Group justify="flex-end" mt="auto">
              <Button
                size="md"
                onClick={handleSiguiente}
                disabled={!datosRuta || isSaving || puntos.length < 2}
                loading={isSaving}
                rightSection={<Navigation size={18} />}
              >
                Siguiente: Frecuencia
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
