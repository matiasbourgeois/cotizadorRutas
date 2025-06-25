// Archivo: cotizadorRutas-frontend/src/pages/historial/HistorialPage.jsx (Versión Final)

import { useState, useEffect } from 'react';
import { Title, Table, ScrollArea, Group, Button, Text, Center, Loader, Paper, ActionIcon, Tooltip, Badge, Stack, Menu } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Trash2, FileX, Plus, Route, MoreVertical } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../api/clienteAxios';

const HistorialPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- LÓGICA PARA OBTENER, DESCARGAR Y ELIMINAR DATOS ---
  // (Esta lógica interna no cambia)

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

  const handleDescargarPdf = async (id, tipo = 'propuesta', e) => {
    const targetButton = e.currentTarget;
    targetButton.disabled = true;
    notifications.show({
      id: `descargando-${id}`,
      title: 'Generando PDF',
      message: 'Por favor, espera mientras se genera tu documento...',
      loading: true,
      autoClose: false,
    });
    try {
      const urlDescarga = tipo === 'propuesta' ? `/presupuestos/${id}/propuesta` : `/presupuestos/${id}/pdf`;
      const res = await clienteAxios.get(urlDescarga, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `presupuesto-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      notifications.update({
        id: `descargando-${id}`,
        title: '¡Éxito!',
        message: 'Tu PDF se ha descargado correctamente.',
        color: 'green',
        loading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      notifications.update({
        id: `descargando-${id}`,
        title: 'Error de descarga',
        message: 'No se pudo generar o descargar el PDF.',
        color: 'red',
        loading: false,
        autoClose: 5000,
      });
    } finally {
      targetButton.disabled = false;
    }
  };

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

  // --- ✅ INICIO: NUEVO DISEÑO PARA LAS FILAS DE LA TABLA ---
  const rows = presupuestos.map((presupuesto) => {
    const origen = presupuesto.puntosEntrega?.[0]?.nombre.split('–')[0].trim() || 'Ruta no definida';
    const destino = presupuesto.puntosEntrega?.length > 1
      ? presupuesto.puntosEntrega[presupuesto.puntosEntrega.length - 1].nombre.split('–')[0].trim()
      : 'Vuelta en el lugar';
    const trayecto = `${origen} → ${destino}`;
    const tipoServicio = presupuesto.frecuencia?.tipo === 'mensual' ? 'Mensual' : 'Esporádico';
    const vehiculo = `${presupuesto.vehiculo?.datos?.marca || ''} ${presupuesto.vehiculo?.datos?.modelo || ''}`;

    return (
      <Table.Tr key={presupuesto._id}>
        {/* Columna 1: Fecha y ID */}
        <Table.Td>
          <Text fz="sm" fw={500}>{new Date(presupuesto.fechaCreacion).toLocaleDateString()}</Text>
          <Text fz="xs" c="dimmed">{presupuesto._id}</Text>
        </Table.Td>

        {/* Columna 2: Descripción de la cotización (más informativa) */}
        <Table.Td>
          <Group>
            <Route size={24} color="#4682B4" />
            <Stack gap={0}>
              <Text fz="sm" fw={500}>{trayecto}</Text>
              <Text fz="xs" c="dimmed">{vehiculo}</Text>
            </Stack>
          </Group>
        </Table.Td>

        {/* Columna 3: Tipo de Servicio */}
        <Table.Td>
          <Badge color={tipoServicio === 'Mensual' ? 'blue' : 'gray'} variant="light" size="sm">
            {tipoServicio}
          </Badge>
        </Table.Td>

        {/* Columna 4: Monto */}
        <Table.Td>
          <Text fw={500} ta="right">${presupuesto.resumenCostos.totalFinal.toLocaleString('es-AR')}</Text>
        </Table.Td>

        {/* Columna 5: Acciones */}
        {/* ¿Por qué este cambio?
    Usamos el componente Menu de Mantine para agrupar las acciones.
    Menu.Target es el botón visible (un ícono en este caso).
    Menu.Dropdown contiene las opciones que aparecen al hacer clic.
    Cada Menu.Item llama a su función correspondiente.
*/}
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
                  leftSection={<Download size={14} />}
                  onClick={(e) => handleDescargarPdf(presupuesto._id, 'propuesta', e)}
                >
                  Descargar Propuesta (Cliente)
                </Menu.Item>
                <Menu.Item
                  leftSection={<Download size={14} />}
                  onClick={(e) => handleDescargarPdf(presupuesto._id, 'desglose', e)}
                >
                  Descargar Desglose (Interno)
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
  // --- ✅ FIN: NUEVO DISEÑO DE FILAS ---

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
          {/* --- ✅ INICIO: ENCABEZADOS DE TABLA CORREGIDOS --- */}
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha y ID</Table.Th>
              <Table.Th>Detalle de la Cotización</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th ta="right">Monto Final</Table.Th>
              <Table.Th ta="right">Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {/* --- ✅ FIN: ENCABEZADOS CORREGIDOS --- */}
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
    </Paper>
  );
};

export default HistorialPage;