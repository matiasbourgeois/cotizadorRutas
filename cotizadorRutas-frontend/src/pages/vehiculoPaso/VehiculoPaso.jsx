// Archivo: src/pages/vehiculoPaso/VehiculoPaso.jsx (Versión Definitiva con Panel de Control y Resumen)

import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearVehiculo from './ModalCrearVehiculo';
import ModalConfiguracionVehiculo from './ModalConfiguracionVehiculo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
// ✅ Importamos los componentes necesarios para el layout
import { 
    Stack, Title, Group, Button, Paper, Text, ActionIcon, Grid, 
    Table, Badge, Center, TextInput, UnstyledButton, rem, Alert 
} from '@mantine/core';
import { Settings, ArrowRight, ArrowLeft, Search, ArrowUpDown, Plus, AlertCircle } from 'lucide-react';
import ResumenPaso from '../../components/ResumenPaso'; // El resumen que ya funciona

// Componente para el encabezado de la tabla (sin cambios)
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? ArrowUpDown : ArrowUpDown;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between" gap="xs">
          <Text fw={500} fz="sm">{children}</Text>
          <Center>
            <Icon size={14} strokeWidth={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

const VehiculoPaso = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalCrearAbierto, { open: abrirModalCrear, close: cerrarModalCrear }] = useDisclosure(false);
  const [modalConfigAbierto, { open: abrirModalConfig, close: cerrarModalConfig }] = useDisclosure(false);
  const [vehiculoParaConfig, setVehiculoParaConfig] = useState(null);
  
  const [filtro, setFiltro] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { vehiculo, setVehiculo } = useCotizacion();

  const fetchVehiculos = async () => {
    try {
      const { data } = await clienteAxios.get('/vehiculos');
      setVehiculos(data);
    } catch (error) { console.error('Error al obtener vehículos:', error); }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const handleSeleccion = (vehiculoSeleccionado) => { setVehiculo(vehiculoSeleccionado); };
  
  const handleAbrirConfig = (vehiculoAConfigurar) => {
    setVehiculoParaConfig(vehiculoAConfigurar);
    abrirModalConfig();
  }

  const handleVehiculoCreado = (nuevoVehiculo) => {
    setVehiculos(prev => [...prev, nuevoVehiculo]);
    setVehiculo(nuevoVehiculo);
    cerrarModalCrear();
  };

  const handleGuardarConfiguracion = (datosActualizados) => {
    setVehiculos(prev => prev.map(v => v._id === datosActualizados._id ? datosActualizados : v));
    if (vehiculo?._id === datosActualizados._id) {
        setVehiculo(datosActualizados);
    }
    cerrarModalConfig();
  };

  const handleSiguiente = () => {
    if (vehiculo) {
      navigate(`/cotizador/recurso-humano/${idRuta}`);
    } else {
        alert('Por favor, seleccione un vehículo antes de continuar.');
    }
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const datosFiltrados = vehiculos.filter((item) => {
    const query = filtro.toLowerCase();
    return (
      item.marca.toLowerCase().includes(query) ||
      item.modelo.toLowerCase().includes(query) ||
      item.patente.toLowerCase().includes(query) ||
      item.tipoVehiculo.toLowerCase().includes(query)
    );
  });
  
  const datosOrdenados = [...datosFiltrados].sort((a, b) => {
    if (!sortBy) return 0;
    const valA = a[sortBy] ?? '';
    const valB = b[sortBy] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
        return reverseSortDirection ? valB - valA : valA - valB;
    }
    return reverseSortDirection ? valB.toString().localeCompare(valA.toString()) : valA.toString().localeCompare(valB.toString());
  });

  const rows = datosOrdenados.map((item) => (
    <Table.Tr key={item._id} bg={item._id === vehiculo?._id ? 'cyan.0' : undefined}>
      <Table.Td>
        <Text fw={500}>{item.marca} {item.modelo}</Text>
        <Text fz="xs" c="dimmed">{item.patente}</Text>
      </Table.Td>
      <Table.Td><Badge color="blue" variant="light">{item.tipoVehiculo}</Badge></Table.Td>
      <Table.Td>{item.capacidadKg} kg</Table.Td>
      <Table.Td>{item.rendimientoKmLitro} km/l</Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Button size="xs" variant={item._id === vehiculo?._id ? 'light' : 'outline'} onClick={() => handleSeleccion(item)}>
            {item._id === vehiculo?._id ? 'Activo' : 'Usar'}
          </Button>
          <ActionIcon variant="default" onClick={() => handleAbrirConfig(item)}><Settings size={16} /></ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    // ✅ EL CÓDIGO AHORA ESTÁ ENVUELTO EN EL GRID CORRECTO
    <Grid gutter="xl">
        {/* Columna Izquierda: El Panel de Control */}
        <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="xl" radius="md" shadow="sm" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Stack gap="xl" style={{ flexGrow: 1 }}>
                    <Group justify="space-between">
                        <Title order={2} c="deep-blue.7">Panel de Control de Flota</Title>
                        <Button onClick={abrirModalCrear} leftSection={<Plus size={16}/>}>
                            Añadir Vehículo
                        </Button>
                    </Group>
                    
                    <TextInput
                        placeholder="Buscar por marca, modelo, patente o tipo..."
                        leftSection={<Search size={16} />}
                        value={filtro}
                        onChange={(event) => setFiltro(event.currentTarget.value)}
                    />

                    <Table.ScrollContainer minWidth={600} style={{ flexGrow: 1 }}>
                        <Table highlightOnHover verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Th sorted={sortBy === 'marca'} reversed={reverseSortDirection} onSort={() => setSorting('marca')}>Vehículo</Th>
                                    <Th sorted={sortBy === 'tipoVehiculo'} reversed={reverseSortDirection} onSort={() => setSorting('tipoVehiculo')}>Tipo</Th>
                                    <Th sorted={sortBy === 'capacidadKg'} reversed={reverseSortDirection} onSort={() => setSorting('capacidadKg')}>Capacidad</Th>
                                    <Th sorted={sortBy === 'rendimientoKmLitro'} reversed={reverseSortDirection} onSort={() => setSorting('rendimientoKmLitro')}>Rendimiento</Th>
                                    <Table.Th ta="right">Acciones</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows.length > 0 ? rows : (
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>
                                            <Center p="lg">
                                                <Alert icon={<AlertCircle size={16}/>} color="gray" title="Sin resultados">
                                                    No se encontraron vehículos que coincidan con la búsqueda.
                                                </Alert>
                                            </Center>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>

                    <Group justify="space-between" mt="auto">
                        <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                            Volver
                        </Button>
                        <Button onClick={handleSiguiente} disabled={!vehiculo} rightSection={<ArrowRight size={16} />}>
                            Siguiente: Recurso Humano
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Grid.Col>
        
        {/* Columna Derecha: El Informe de Misión */}
        <Grid.Col span={{ base: 12, md: 4 }}>
            <ResumenPaso />
        </Grid.Col>

        {/* Los modales quedan fuera del Grid para un manejo de z-index adecuado */}
        <ModalCrearVehiculo show={modalCrearAbierto} onClose={cerrarModalCrear} onVehiculoCreado={handleVehiculoCreado} />
        {vehiculoParaConfig && (
            <ModalConfiguracionVehiculo show={modalConfigAbierto} onClose={cerrarModalConfig} vehiculo={vehiculoParaConfig} onGuardarCambios={handleGuardarConfiguracion} />
        )}
    </Grid>
  );
};

export default VehiculoPaso;