// Archivo: src/pages/vehiculoPaso/VehiculoPaso.jsx (Versión Definitiva con Paginación, Eliminar y Estilo CORREGIDO)

import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearVehiculo from './ModalCrearVehiculo';
import ModalConfiguracionVehiculo from './ModalConfiguracionVehiculo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import {
    Stack, Title, Group, Button, Paper, Text, ActionIcon, Grid,
    Table, Badge, Center, TextInput, UnstyledButton, rem, Alert,
    Pagination,
    Menu
} from '@mantine/core';
import {
    Settings, ArrowRight, ArrowLeft, Search, ArrowUpDown, Plus,
    AlertCircle, Trash2, MoreVertical
} from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import ResumenPaso from '../../components/ResumenPaso';

// ✅ LA CORRECCIÓN ESTÁ AQUÍ
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? ArrowUpDown : ArrowUpDown;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Text fw={500} fz="sm">{children}</Text>
          <Center>
            {/* El error estaba en la línea siguiente. Se corrigió size={rem(14)} por solo size={14} */}
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

    const [activePage, setPage] = useState(1);
    const itemsPerPage = 5;

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

    const handleEliminar = (vehiculoAEliminar) => {
        modals.openConfirmModal({
            title: 'Confirmar Eliminación',
            centered: true,
            children: (
                <Text size="sm">
                    ¿Estás seguro de que quieres eliminar el vehículo <strong>{vehiculoAEliminar.marca} {vehiculoAEliminar.modelo}</strong> (Patente: {vehiculoAEliminar.patente})? Esta acción no se puede deshacer.
                </Text>
            ),
            labels: { confirm: 'Sí, eliminar vehículo', cancel: "No, cancelar" },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await clienteAxios.delete(`/vehiculos/${vehiculoAEliminar._id}`);
                    setVehiculos(currentVehiculos => currentVehiculos.filter(v => v._id !== vehiculoAEliminar._id));
                    if (vehiculo?._id === vehiculoAEliminar._id) {
                        setVehiculo(null);
                    }
                    notifications.show({
                        title: 'Eliminado',
                        message: 'El vehículo ha sido eliminado de la flota.',
                        color: 'green',
                    });
                } catch (error) {
                    notifications.show({
                        title: 'Error',
                        message: 'No se pudo eliminar el vehículo.',
                        color: 'red',
                    });
                    console.error('Error al eliminar:', error);
                }
            },
        });
    };

    const handleSeleccion = (vehiculoSeleccionado) => { setVehiculo(vehiculoSeleccionado); };

    const handleAbrirConfig = (vehiculoAConfigurar) => {
        setVehiculoParaConfig(vehiculoAConfigurar);
        abrirModalConfig();
    }

    const handleVehiculoCreado = (nuevoVehiculo) => {
        setVehiculos(prev => [nuevoVehiculo, ...prev]);
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
            notifications.show({
                title: 'Acción requerida',
                message: 'Por favor, selecciona un vehículo antes de continuar.',
                color: 'yellow',
            });
        }
    };

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    };

    const datosFiltradosYOrdenados = [...vehiculos]
        .filter((item) => {
            const query = filtro.toLowerCase();
            return (
                item.marca.toLowerCase().includes(query) ||
                item.modelo.toLowerCase().includes(query) ||
                item.patente.toLowerCase().includes(query) ||
                item.tipoVehiculo.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            if (!sortBy) return 0;
            const valA = a[sortBy] ?? '';
            const valB = b[sortBy] ?? '';
            if (typeof valA === 'number' && typeof valB === 'number') {
                return reverseSortDirection ? valB - valA : valA - valB;
            }
            return reverseSortDirection ? valB.toString().localeCompare(valA.toString()) : valA.toString().localeCompare(valB.toString());
        });

    const paginatedData = datosFiltradosYOrdenados.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const rows = paginatedData.map((item) => (
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
                    <Menu shadow="md" width={180}>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray"><MoreVertical size={16} /></ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Acciones</Menu.Label>
                            <Menu.Item leftSection={<Settings size={14} />} onClick={() => handleAbrirConfig(item)}>
                                Configurar
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleEliminar(item)}>
                                Eliminar
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder p="xl" radius="md" shadow="sm" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Stack gap="xl" style={{ flexGrow: 1 }}>
                        <Group justify="space-between">
                            <Title order={2} c="deep-blue.7">Panel de Control de Flota</Title>
                            <Button onClick={abrirModalCrear} leftSection={<Plus size={16} />}>
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
                                                    <Alert icon={<AlertCircle size={16} />} color="gray" title="Sin resultados">
                                                        No se encontraron vehículos que coincidan con la búsqueda.
                                                    </Alert>
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>

                        {Math.ceil(datosFiltradosYOrdenados.length / itemsPerPage) > 1 && (
                            <Group justify="space-between" align="center" mt="md">
                                <Text c="dimmed" size="sm">
                                    Mostrando <b>{paginatedData.length}</b> de <b>{datosFiltradosYOrdenados.length}</b> vehículos
                                </Text>
                                <Pagination
                                    total={Math.ceil(datosFiltradosYOrdenados.length / itemsPerPage)}
                                    value={activePage}
                                    onChange={setPage}
                                    color="cyan"
                                    radius="xl"
                                />
                            </Group>
                        )}
                        
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

            <Grid.Col span={{ base: 12, md: 4 }}>
                <ResumenPaso />
            </Grid.Col>

            <ModalCrearVehiculo show={modalCrearAbierto} onClose={cerrarModalCrear} onVehiculoCreado={handleVehiculoCreado} />
            {vehiculoParaConfig && (
                <ModalConfiguracionVehiculo show={modalConfigAbierto} onClose={cerrarModalConfig} vehiculo={vehiculoParaConfig} onGuardarCambios={handleGuardarConfiguracion} />
            )}
        </Grid>
    );
};

export default VehiculoPaso;