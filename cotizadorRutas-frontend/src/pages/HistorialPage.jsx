
import { useState, useEffect } from 'react';
import { Container, Title, Table, ScrollArea, Group, Button, Text, Center, Loader, Paper, ActionIcon, Badge, Stack, Menu, Pagination, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Trash2, FileX, Plus, Route, MoreVertical, ExternalLink, Search, Truck, User, Share2, MessageCircle } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../api/clienteAxios';

const HistorialPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const obtenerPresupuestos = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.get(`/presupuestos?page=${page}&limit=7`);
      setPresupuestos(data.presupuestos);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setPage(data.currentPage);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      notifications.show({ title: 'Error', message: 'No se pudo cargar el historial de cotizaciones.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { obtenerPresupuestos(activePage); }, [activePage]);

  const handleEliminar = (id) => {
    modals.openConfirmModal({
      title: 'Confirmar eliminación',
      centered: true,
      children: <Text size="sm">¿Estás seguro de que querés eliminar esta cotización? Esta acción es irreversible.</Text>,
      labels: { confirm: 'Eliminar Cotización', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await clienteAxios.delete(`/presupuestos/${id}`);
          obtenerPresupuestos(activePage);
          notifications.show({ title: 'Cotización Eliminada', message: 'El registro se ha eliminado correctamente.', color: 'green' });
        } catch (error) {
          notifications.show({ title: 'Error', message: 'No se pudo eliminar la cotización.', color: 'red' });
        }
      },
    });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatMoney = (n) => `$${(n ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  const filteredPresupuestos = presupuestos.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const origen = p.puntosEntrega?.[0]?.nombre || '';
    const destino = p.puntosEntrega?.length > 1 ? p.puntosEntrega[p.puntosEntrega.length - 1]?.nombre || '' : '';
    const vehiculo = `${p.vehiculo?.datos?.marca || ''} ${p.vehiculo?.datos?.modelo || ''}`;
    const recurso = p.recursoHumano?.datos?.nombre || '';
    const cliente = p.cliente || '';
    return origen.toLowerCase().includes(q) || destino.toLowerCase().includes(q) || vehiculo.toLowerCase().includes(q) || recurso.toLowerCase().includes(q) || cliente.toLowerCase().includes(q);
  });

  const rows = filteredPresupuestos.map((presupuesto) => {
    const origen = presupuesto.puntosEntrega?.[0]?.nombre?.split('–')[0]?.trim() || 'Ruta no definida';
    const destino = presupuesto.puntosEntrega?.length > 1
      ? presupuesto.puntosEntrega[presupuesto.puntosEntrega.length - 1]?.nombre?.split('–')[0]?.trim() || 'Sin destino'
      : 'Vuelta en el lugar';
    const trayecto = `${origen} → ${destino}`;
    const tipoServicio = presupuesto.frecuencia?.tipo === 'mensual' ? 'Mensual' : 'Esporádico';
    const vehiculoNombre = `${presupuesto.vehiculo?.datos?.marca || ''} ${presupuesto.vehiculo?.datos?.modelo || ''}`.trim();
    const recursoNombre = presupuesto.recursoHumano?.datos?.nombre || 'Sin asignar';
    const km = presupuesto.totalKilometros;

    return (
      <Table.Tr key={presupuesto._id}>
        <Table.Td>
          <Stack gap={0}>
            <Text fz="sm" fw={500}>{formatDate(presupuesto.fechaCreacion)}</Text>
            <Text fz="xs" c="dimmed">{presupuesto.cliente || 'Sin cliente'}</Text>
          </Stack>
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Route size={20} color="var(--app-brand-cyan)" />
            <Stack gap={0}>
              <Text fz="sm" fw={500}>{trayecto}</Text>
              <Text fz="xs" c="dimmed">{km ? `${Math.round(km)} km` : 'Distancia N/A'}</Text>
            </Stack>
          </Group>
        </Table.Td>
        <Table.Td>
          <Stack gap={0}>
            <Text fz="sm" fw={500}>{vehiculoNombre || 'Sin vehículo'}</Text>
            <Text fz="xs" c="dimmed">{recursoNombre}</Text>
          </Stack>
        </Table.Td>
        <Table.Td>
          <Badge color={tipoServicio === 'Mensual' ? 'blue' : 'gray'} variant="light" size="sm">{tipoServicio}</Badge>
        </Table.Td>
        <Table.Td>
          <Text fw={600} ta="right" fz="sm">{formatMoney(presupuesto.resumenCostos?.totalFinal)}</Text>
        </Table.Td>
        <Table.Td>
          <Group justify="flex-end">
            <Menu shadow="md" width={220}>
              <Menu.Target><ActionIcon variant="subtle" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Acciones</Menu.Label>
                <Menu.Item leftSection={<ExternalLink size={14} />} onClick={() => window.open(`/propuesta/${presupuesto._id}`, '_blank')}>Ver Propuesta (Cliente)</Menu.Item>
                <Menu.Item leftSection={<ExternalLink size={14} />} onClick={() => window.open(`/desglose/${presupuesto._id}`, '_blank')}>Ver Desglose (Interno)</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Compartir Propuesta</Menu.Label>
                <Menu.Item leftSection={<Share2 size={14} />} onClick={() => {
                  const url = `${window.location.origin}/p/${presupuesto._id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    notifications.show({ title: 'Link copiado', message: 'El link de la propuesta fue copiado al portapapeles', color: 'teal' });
                  });
                }}>Copiar Link Propuesta</Menu.Item>
                <Menu.Item leftSection={<MessageCircle size={14} />} onClick={() => {
                  const url = `${window.location.origin}/p/${presupuesto._id}`;
                  const msg = `Hola, te comparto la propuesta de servicio logístico: ${url}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}>WhatsApp Propuesta</Menu.Item>
                <Menu.Label>Compartir Desglose</Menu.Label>
                <Menu.Item leftSection={<Share2 size={14} />} onClick={() => {
                  const url = `${window.location.origin}/d/${presupuesto._id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    notifications.show({ title: 'Link copiado', message: 'El link del desglose fue copiado al portapapeles', color: 'teal' });
                  });
                }}>Copiar Link Desglose</Menu.Item>
                <Menu.Item leftSection={<MessageCircle size={14} />} onClick={() => {
                  const url = `${window.location.origin}/d/${presupuesto._id}`;
                  const msg = `Hola, te comparto el desglose de costos: ${url}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}>WhatsApp Desglose</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleEliminar(presupuesto._id)}>Eliminar Cotización</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} c="var(--app-brand-primary)">Historial de Cotizaciones</Title>
          <Text c="dimmed" size="sm">Revisá y gestioná todas tus cotizaciones generadas</Text>
        </div>
        <Button leftSection={<Plus size={16} />} color="cyan" onClick={() => navigate('/')}>
          Nueva Cotización
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <TextInput
          placeholder="Buscar por ruta, vehículo, cliente o recurso..."
          leftSection={<Search size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb="md"
        />

        {loading ? (
          <Center py="xl"><Loader color="cyan" /></Center>
        ) : filteredPresupuestos.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <FileX size={48} color="var(--app-text-muted)" />
              <Title order={4} c="dimmed" fw={500}>
                {searchQuery ? 'Sin resultados' : 'Sin Cotizaciones'}
              </Title>
              <Text c="dimmed" size="sm">
                {searchQuery ? 'No se encontraron cotizaciones con esa búsqueda' : 'Aún no has generado ninguna cotización. ¡Crea la primera!'}
              </Text>
              {!searchQuery && (
                <Button onClick={() => navigate('/')} variant="light" color="cyan" mt="sm">
                  Ir al Cotizador
                </Button>
              )}
            </Stack>
          </Center>
        ) : (
          <ScrollArea>
            <Table miw={900} verticalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cotización</Table.Th>
                  <Table.Th>Ruta</Table.Th>
                  <Table.Th>Vehículo / RRHH</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th ta="right">Monto Final</Table.Th>
                  <Table.Th ta="right">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}

        {totalPages > 1 && (
          <Group justify="space-between" align="center" mt="xl">
            <Text c="dimmed" size="sm">Mostrando <b>{presupuestos.length}</b> de <b>{totalItems}</b> cotizaciones</Text>
            <Pagination total={totalPages} value={activePage} onChange={setPage} color="cyan" radius="xl" withEdges />
          </Group>
        )}
      </Paper>
    </Container>
  );
};

export default HistorialPage;