// Archivo: src/pages/recursoHumanoPaso/RecursoHumanoPaso.jsx (Versión Definitiva con Paginación y Eliminar)

import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearRecursoHumano from './ModalCrearRecursoHumano';
import ModalConfiguracionEmpleado from './ModalConfiguracionEmpleado';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import {
    Stack, Title, Group, Button, Paper, Text, ActionIcon, Grid,
    Table, Badge, Center, TextInput, UnstyledButton, Alert,
    Pagination, // 1. Componente para paginación
    Menu      // 2. Componente para el menú de acciones
} from '@mantine/core';
import {
    Settings, ArrowRight, ArrowLeft, Search, ArrowUpDown, Plus,
    AlertCircle, Trash2, MoreVertical // 3. Íconos para las nuevas acciones
} from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import ResumenPaso from '../../components/ResumenPaso';

// Componente para el encabezado de la tabla que permite ordenar (sin cambios)
function Th({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? ArrowUpDown : ArrowUpDown;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
                <Group justify="space-between" gap="xs" wrap="nowrap">
                    <Text fw={500} fz="sm">{children}</Text>
                    <Center><Icon size={14} strokeWidth={1.5} /></Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

const RecursoHumanoPaso = () => {
    const [recursos, setRecursos] = useState([]);
    const [modalCrearAbierto, { open: abrirModalCrear, close: cerrarModalCrear }] = useDisclosure(false);
    const [modalConfigAbierto, { open: abrirModalConfig, close: cerrarModalConfig }] = useDisclosure(false);
    const [recursoParaConfig, setRecursoParaConfig] = useState(null);

    const [filtro, setFiltro] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    // 4. Estados para manejar la paginación
    const [activePage, setPage] = useState(1);
    const itemsPerPage = 5; // Mostramos 5 por página

    const { idRuta } = useParams();
    const navigate = useNavigate();
    const { recursoHumano, setRecursoHumano } = useCotizacion();

    const fetchRecursos = async () => {
        try {
            const { data } = await clienteAxios.get('/recursos-humanos');
            setRecursos(data);
        } catch (error) { console.error('Error al obtener recursos:', error); }
    };

    useEffect(() => { fetchRecursos(); }, []);
    
    // 5. Función para manejar la eliminación de un recurso humano
    const handleEliminar = (recursoAEliminar) => {
        modals.openConfirmModal({
            title: 'Confirmar Eliminación',
            centered: true,
            children: (
                <Text size="sm">
                    ¿Estás seguro de que quieres eliminar a <strong>{recursoAEliminar.nombre}</strong>? Esta acción es permanente.
                </Text>
            ),
            labels: { confirm: 'Sí, eliminar', cancel: "No, cancelar" },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await clienteAxios.delete(`/recursos-humanos/${recursoAEliminar._id}`);
                    setRecursos(currentRecursos => currentRecursos.filter(r => r._id !== recursoAEliminar._id));
                    // Si el recurso eliminado era el seleccionado, lo quitamos de la cotización
                    if (recursoHumano?._id === recursoAEliminar._id) {
                        setRecursoHumano(null);
                    }
                    notifications.show({
                        title: 'Eliminado',
                        message: 'El colaborador ha sido eliminado del sistema.',
                        color: 'green',
                    });
                } catch (error) {
                    notifications.show({
                        title: 'Error',
                        message: 'No se pudo eliminar el recurso humano.',
                        color: 'red',
                    });
                    console.error('Error al eliminar:', error);
                }
            },
        });
    };

    const handleSeleccion = (recursoSeleccionado) => { setRecursoHumano(recursoSeleccionado); };

    const handleAbrirConfig = (recursoAConfigurar) => {
        setRecursoParaConfig(recursoAConfigurar);
        abrirModalConfig();
    }

    const handleRecursoCreado = (nuevoRecurso) => {
        setRecursos(prev => [nuevoRecurso, ...prev]);
        setRecursoHumano(nuevoRecurso);
        cerrarModalCrear();
    };

    const handleGuardarConfiguracion = (datosActualizados) => {
        setRecursos(prev => prev.map(r => r._id === datosActualizados._id ? datosActualizados : r));
        if (recursoHumano?._id === datosActualizados._id) {
            setRecursoHumano(datosActualizados);
        }
        cerrarModalConfig();
    };

    const handleSiguiente = () => {
        if (recursoHumano) {
            navigate("/cotizador/configuracion-final");
        } else {
             notifications.show({
                title: 'Acción requerida',
                message: 'Por favor, selecciona un recurso humano antes de continuar.',
                color: 'yellow',
            });
        }
    };

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    };

    // 6. Lógica para filtrar y ordenar los datos antes de paginar
    const datosFiltradosYOrdenados = [...recursos]
        .filter((item) => {
            const query = filtro.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(query) ||
                (item.dni && item.dni.toLowerCase().includes(query)) ||
                item.tipoContratacion.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            if (!sortBy) return 0;
            const valA = a[sortBy] ?? '';
            const valB = b[sortBy] ?? '';
            const result = valA.toString().localeCompare(valB.toString());
            return reverseSortDirection ? result * -1 : result;
        });

    // 7. Lógica para obtener los datos de la página actual
    const paginatedData = datosFiltradosYOrdenados.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const rows = paginatedData.map((item) => (
        <Table.Tr key={item._id} bg={item._id === recursoHumano?._id ? 'cyan.0' : undefined}>
            <Table.Td>
                <Text fw={500}>{item.nombre}</Text>
                <Text fz="xs" c="dimmed">DNI: {item.dni || 'N/A'}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={item.tipoContratacion === 'empleado' ? 'teal' : 'orange'} variant="light">
                    {item.tipoContratacion}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>${(item.sueldoBasico || 0).toLocaleString('es-AR')}</Text>
            </Table.Td>
            <Table.Td>
                {/* 8. Menú de acciones por cada fila */}
                <Group gap="xs" justify="flex-end">
                    <Button size="xs" variant={item._id === recursoHumano?._id ? 'light' : 'outline'} onClick={() => handleSeleccion(item)}>
                        {item._id === recursoHumano?._id ? 'Activo' : 'Asignar'}
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
                            <Title order={2} c="deep-blue.7">Gestión de Equipo</Title>
                            <Button onClick={abrirModalCrear} leftSection={<Plus size={16} />}>
                                Añadir Personal
                            </Button>
                        </Group>

                        <TextInput
                            placeholder="Buscar por nombre, DNI o modalidad..."
                            leftSection={<Search size={16} />}
                            value={filtro}
                            onChange={(event) => setFiltro(event.currentTarget.value)}
                        />

                        <Table.ScrollContainer minWidth={600} style={{ flexGrow: 1 }}>
                            <Table highlightOnHover verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Th sorted={sortBy === 'nombre'} reversed={reverseSortDirection} onSort={() => setSorting('nombre')}>Colaborador</Th>
                                        <Th sorted={sortBy === 'tipoContratacion'} reversed={reverseSortDirection} onSort={() => setSorting('tipoContratacion')}>Modalidad</Th>
                                        <Th sorted={sortBy === 'sueldoBasico'} reversed={reverseSortDirection} onSort={() => setSorting('sueldoBasico')}>Costo Base</Th>
                                        <Table.Th ta="right">Acciones</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {rows.length > 0 ? rows : (
                                        <Table.Tr>
                                            <Table.Td colSpan={4}>
                                                <Center p="lg">
                                                    <Alert icon={<AlertCircle size={16} />} color="gray" title="Sin resultados">
                                                        No se encontraron colaboradores que coincidan con la búsqueda.
                                                    </Alert>
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                        
                        {/* 9. Componente de Paginación */}
                        {Math.ceil(datosFiltradosYOrdenados.length / itemsPerPage) > 1 && (
                             <Group justify="space-between" align="center" mt="md">
                                <Text c="dimmed" size="sm">
                                    Mostrando <b>{paginatedData.length}</b> de <b>{datosFiltradosYOrdenados.length}</b> colaboradores
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
                            <Button onClick={handleSiguiente} disabled={!recursoHumano} rightSection={<ArrowRight size={16} />}>
                                Siguiente: Resumen y Costos
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
                <ResumenPaso />
            </Grid.Col>

            <ModalCrearRecursoHumano
                show={modalCrearAbierto}
                onHide={cerrarModalCrear}
                onCrear={handleRecursoCreado}
            />

            {recursoParaConfig && (
                <ModalConfiguracionEmpleado
                    show={modalConfigAbierto}
                    onClose={cerrarModalConfig}
                    recursoHumano={recursoParaConfig}
                    onGuardarCambios={handleGuardarConfiguracion}
                />
            )}
        </Grid>
    );
};

export default RecursoHumanoPaso;