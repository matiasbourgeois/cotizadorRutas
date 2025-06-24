// ruta: src/pages/vehiculoPaso/VehiculoPaso.jsx

import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearVehiculo from './ModalCrearVehiculo';
import ModalConfiguracionVehiculo from './ModalConfiguracionVehiculo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Stack, Title, Select, Group, Button, Paper, Text, ActionIcon, SimpleGrid, Badge } from '@mantine/core';
import { Settings, ArrowRight, ArrowLeft, Truck, Wind, Box } from 'lucide-react';
import { API_URL } from '../../apiConfig';

const InfoVehiculo = ({ icon, label, value }) => (
    <Group gap="xs">
        {icon}
        <div>
            <Text fz="xs" c="dimmed">{label}</Text>
            <Text fw={500}>{value || 'No definido'}</Text>
        </div>
    </Group>
);

const VehiculoPaso = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalCrearAbierto, { open: abrirModalCrear, close: cerrarModalCrear }] = useDisclosure(false);
  const [modalConfigAbierto, { open: abrirModalConfig, close: cerrarModalConfig }] = useDisclosure(false);

  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { vehiculo: vehiculoSeleccionado, setVehiculo } = useCotizacion();

  // Esta función carga la lista de vehículos
  const fetchVehiculos = async () => {
    try {
      const res = await clienteAxios.get('/vehiculos');
      setVehiculos(res.data.map(v => ({
        value: v._id,
        label: `${v.marca} ${v.modelo} (${v.patente})`
      })));
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  };

  // Se ejecuta una sola vez cuando el componente carga
  useEffect(() => {
    fetchVehiculos();
  }, []);

  // Maneja la selección de un vehículo de la lista
  const handleSeleccion = (id) => {
    if (!id) {
        setVehiculo(null);
        return;
    }
    clienteAxios.get(`/vehiculos/${id}`)
      .then(res => setVehiculo(res.data))
      .catch(err => console.error("Error al buscar detalles del vehículo", err));
  };

  // Se ejecuta cuando el modal de creación confirma un nuevo vehículo
  const handleVehiculoCreado = (nuevoVehiculo) => {
    // Añadimos el nuevo vehículo a la lista existente y lo seleccionamos
    setVehiculos(prev => [...prev, {
      value: nuevoVehiculo._id,
      label: `${nuevoVehiculo.marca} ${nuevoVehiculo.modelo} (${nuevoVehiculo.patente})`
    }]);
    setVehiculo(nuevoVehiculo);
    cerrarModalCrear();
  };

  // Se ejecuta cuando el modal de configuración guarda cambios
  const handleGuardarConfiguracion = (datosActualizados) => {
    setVehiculo(datosActualizados);
    setVehiculos(prev => prev.map(v => 
        v.value === datosActualizados._id 
        ? { value: datosActualizados._id, label: `${datosActualizados.marca} ${datosActualizados.modelo} (${datosActualizados.patente})` }
        : v
    ));
    cerrarModalConfig();
  };

  const handleSiguiente = () => {
    if (vehiculoSeleccionado) {
      navigate(`/cotizador/recurso-humano/${idRuta}`);
    } else {
        alert('Por favor, seleccione o cree un vehículo antes de continuar.');
    }
  };

  return (
    <Stack gap="xl">
        <Title order={2} c="deep-blue.7">Selección del Vehículo</Title>

        <Group grow align="flex-end">
            <Select
                label="Vehículo registrado"
                placeholder="Seleccione un vehículo de la lista"
                data={vehiculos}
                value={vehiculoSeleccionado?._id || null}
                onChange={handleSeleccion}
                searchable
                clearable
            />
            <Button onClick={abrirModalCrear}>Nuevo Vehículo</Button>
        </Group>

        {vehiculoSeleccionado && (
            <Paper withBorder p="md" radius="md">
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Title order={4}>{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}</Title>
                        <Text c="dimmed">Patente: {vehiculoSeleccionado.patente} | Año: {vehiculoSeleccionado.año}</Text>
                        <Group mt="xs">
                            <Badge variant="light" color="cyan" size="lg">{vehiculoSeleccionado.tipoVehiculo}</Badge>
                            <Badge variant="light" color={vehiculoSeleccionado.tieneGNC ? 'green' : 'blue'} size="lg">
                                {vehiculoSeleccionado.tipoCombustible} {vehiculoSeleccionado.tieneGNC && '+ GNC'}
                            </Badge>
                        </Group>
                    </Stack>
                    <ActionIcon variant="light" size="lg" onClick={abrirModalConfig} title="Configuración Avanzada">
                        <Settings size={20} />
                    </ActionIcon>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md" spacing="lg">
                    <InfoVehiculo icon={<Truck size={20}/>} label="Capacidad" value={`${vehiculoSeleccionado.capacidadKg} kg`} />
                    <InfoVehiculo icon={<Box size={20}/>} label="Volumen" value={`${vehiculoSeleccionado.volumenM3} m³`} />
                    <InfoVehiculo icon={<Wind size={20}/>} label="Rendimiento" value={`${vehiculoSeleccionado.rendimientoKmLitro} km/l`} />
                </SimpleGrid>
            </Paper>
        )}

        <Group justify="space-between" mt="md">
            <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                Volver
            </Button>
            <Button onClick={handleSiguiente} disabled={!vehiculoSeleccionado} rightSection={<ArrowRight size={16} />}>
                Siguiente
            </Button>
        </Group>

        <ModalCrearVehiculo
            show={modalCrearAbierto}
            onClose={cerrarModalCrear}
            onVehiculoCreado={handleVehiculoCreado}
        />

        {vehiculoSeleccionado && (
            <ModalConfiguracionVehiculo
                show={modalConfigAbierto}
                onClose={cerrarModalConfig}
                vehiculo={vehiculoSeleccionado}
                onGuardarCambios={handleGuardarConfiguracion}
            />
        )}
    </Stack>
  );
};

export default VehiculoPaso;