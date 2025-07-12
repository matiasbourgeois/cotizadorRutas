// Archivo: cotizadorRutas-frontend/src/pages/historial/HistorialPage.jsx (Versión Final con Paginación)

import { useState, useEffect } from 'react';
import { Title, Table, ScrollArea, Group, Button, Text, Center, Loader, Paper, ActionIcon, Badge, Stack, Menu, Pagination } from '@mantine/core'; // ✅ 1. Importamos Pagination
import { useNavigate } from 'react-router-dom';
import { Trash2, FileX, Plus, Route, MoreVertical, ExternalLink } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../api/clienteAxios';

const HistorialPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 2. Añadimos estados para la paginación
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 7; // Puedes ajustar cuántos items quieres por página

  const obtenerPresupuestos = async () => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.get('/presupuestos');
      setPresupuestos(data);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo cargar el historial de cotizaciones.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPresupuestos();
  }, []);

  const handleEliminar = (id) => {
    modals.openConfirmModal({
      title: 'Confirmar eliminación',
      centered: true,
      children: (
        <Text size="sm">
          ¿Estás seguro de que quieres eliminar esta cotización? Esta acción es irreversible.
        </Text>
      ),
      labels: { confirm: 'Eliminar Cotización', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await clienteAxios.delete(`/presupuestos/${id}`);
          setPresupuestos(prev => prev.filter(p => p._id !== id));
          notifications.show({
            title: 'Cotización Eliminada',
            message: 'El registro se ha eliminado correctamente.',
            color: 'green',
          });
        } catch (error) {
          console.error("Error al eliminar:", error);
          notifications.show({
            title: 'Error',
            message: 'No se pudo eliminar la cotización.',
            color: 'red',
          });
        }
      },
    });
  };
  
  // ✅ 3. Lógica para paginar los datos
  const totalItems = presupuestos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = presupuestos.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const rows = paginatedData.map((presupuesto) => {
    const origen = presupuesto.puntosEntrega?.[0]?.nombre.split('–')[0].trim() || 'Ruta no definida';
    const destino = presupuesto.puntosEntrega?.length > 1
      ? presupuesto.puntosEntrega[presupuesto.puntosEntrega.length - 1].nombre.split('–')[0].trim()
      : 'Vuelta en el lugar';
    const trayecto = `${origen} → ${destino}`;
    const tipoServicio = presupuesto.frecuencia?.tipo === 'mensual' ? 'Mensual' : 'Esporádico';
    const vehiculo = `${presupuesto.vehiculo?.datos?.marca || ''} ${presupuesto.vehiculo?.datos?.modelo || ''}`;

    return (
      <Table.Tr key={presupuesto._id}>
        <Table.Td>
          <Text fz="sm" fw={500}>{new Date(presupuesto.fechaCreacion).toLocaleDateString()}</Text>
          <Text fz="xs" c="dimmed">{presupuesto._id}</Text>
        </Table.Td>
        <Table.Td>
          <Group>
            <Route size={24} color="#4682B4" />
            <Stack gap={0}>
              <Text fz="sm" fw={500}>{trayecto}</Text>
              <Text fz="xs" c="dimmed">{vehiculo}</Text>
            </Stack>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge color={tipoServicio === 'Mensual' ? 'blue' : 'gray'} variant="light" size="sm">
            {tipoServicio}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text fw={500} ta="right">${presupuesto.resumenCostos.totalFinal.toLocaleString('es-AR')}</Text>
        </Table.Td>
        <Table.Td>
          <Group justify="flex-end">
            <Menu shadow="md" width={220}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <MoreVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Acciones</Menu.Label>
                <Menu.Item
                  leftSection={<ExternalLink size={14} />}
                  onClick={() => window.open(`/propuesta/${presupuesto._id}`, '_blank')}
                >
                  Ver Propuesta (Cliente)
                </Menu.Item>
                <Menu.Item
                  leftSection={<ExternalLink size={14} />}
                  onClick={() => window.open(`/desglose/${presupuesto._id}`, '_blank')}
                >
                  Ver Desglose (Interno)
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => handleEliminar(presupuesto._id)}
                >
                  Eliminar Cotización
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  if (loading) {
    return <Center style={{ height: '50vh' }}><Loader color="cyan" /></Center>;
  }

  return (
    <Paper withBorder p="xl" radius="md" shadow="sm">
      <Group justify="space-between" mb="xl">
        <Title order={2} c="deep-blue.7">Historial de Cotizaciones</Title>
        <Button onClick={() => navigate('/')} leftSection={<Plus size={16} />}>
          Crear Nueva Cotización
        </Button>
      </Group>

      <ScrollArea>
        <Table miw={800} verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha y ID</Table.Th>
              <Table.Th>Detalle de la Cotización</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th ta="right">Monto Final</Table.Th>
              <Table.Th ta="right">Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center my="xl" p="lg" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                    <Stack align="center" gap="sm">
                      <FileX size={48} color="lightgray" />
                      <Title order={4} c="dimmed" fw={500}>Sin Cotizaciones</Title>
                      <Text c="dimmed">Aún no has generado ninguna cotización. ¡Crea la primera!</Text>
                      <Button onClick={() => navigate('/')} variant="light" mt="sm">
                        Ir al Cotizador
                      </Button>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      
      {/* ✅ 4. AÑADIMOS EL COMPONENTE DE PAGINACIÓN */}
      {totalPages > 1 && (
        <Group justify="space-between" align="center" mt="xl">
          <Text c="dimmed" size="sm">
            Mostrando <b>{paginatedData.length}</b> de <b>{totalItems}</b> cotizaciones
          </Text>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setPage}
            color="cyan"
            radius="xl"
            withEdges
          />
        </Group>
      )}
    </Paper>
  );
};

export default HistorialPage;