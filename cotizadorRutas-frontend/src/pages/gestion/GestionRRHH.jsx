import { Container, Title, Text, Paper, Group, Button, Table, ActionIcon, TextInput, Badge, Stack, Loader, Center, Modal, Select, NumberInput, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../../api/clienteAxios';

const tiposContratacion = [
  { value: 'empleado', label: 'Empleado' },
  { value: 'contratado', label: 'Contratado' },
];

const emptyForm = {
  tipoContratacion: 'empleado',
  nombre: '',
  dni: '',
  cuil: '',
  telefono: '',
  email: '',
  sueldoBasico: 723858,
  adicionalActividadPorc: 15,
  adicionalCargaDescargaCadaXkm: 30160.77,
  kmPorUnidadDeCarga: 1000,
  adicionalKmRemunerativo: 57.90,
  minKmRemunerativo: 350,
  viaticoPorKmNoRemunerativo: 57.90,
  minKmNoRemunerativo: 350,
  adicionalNoRemunerativoFijo: 50000,
  horasLaboralesMensuales: 192,
  minimoMinutosFacturables: 120,
  porcentajeCargasSociales: 30,
  porcentajeOverheadContratado: 10,
  observaciones: '',
};

const GestionRRHH = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRecursos = async () => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.get('/recursos-humanos');
      setRecursos(data);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'No se pudieron cargar los recursos', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecursos(); }, []);

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    openModal();
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm({
      tipoContratacion: r.tipoContratacion || 'empleado',
      nombre: r.nombre || '',
      dni: r.dni || '',
      cuil: r.cuil || '',
      telefono: r.telefono || '',
      email: r.email || '',
      sueldoBasico: r.sueldoBasico ?? 723858,
      adicionalActividadPorc: r.adicionalActividadPorc ?? 15,
      adicionalCargaDescargaCadaXkm: r.adicionalCargaDescargaCadaXkm ?? 30160.77,
      kmPorUnidadDeCarga: r.kmPorUnidadDeCarga ?? 1000,
      adicionalKmRemunerativo: r.adicionalKmRemunerativo ?? 57.90,
      minKmRemunerativo: r.minKmRemunerativo ?? 350,
      viaticoPorKmNoRemunerativo: r.viaticoPorKmNoRemunerativo ?? 57.90,
      minKmNoRemunerativo: r.minKmNoRemunerativo ?? 350,
      adicionalNoRemunerativoFijo: r.adicionalNoRemunerativoFijo ?? 50000,
      horasLaboralesMensuales: r.horasLaboralesMensuales ?? 192,
      minimoMinutosFacturables: r.minimoMinutosFacturables ?? 120,
      porcentajeCargasSociales: r.porcentajeCargasSociales ?? 30,
      porcentajeOverheadContratado: r.porcentajeOverheadContratado ?? 10,
      observaciones: r.observaciones || '',
    });
    openModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este recurso?')) return;
    try {
      await clienteAxios.delete(`/recursos-humanos/${id}`);
      notifications.show({ title: 'Eliminado', message: 'Recurso eliminado correctamente', color: 'teal' });
      fetchRecursos();
    } catch (err) {
      notifications.show({ title: 'Error', message: 'No se pudo eliminar', color: 'red' });
    }
  };

  const handleSave = async () => {
    if (!form.nombre || !form.tipoContratacion) {
      notifications.show({ title: 'Campos requeridos', message: 'Nombre y tipo de contratación son obligatorios', color: 'orange' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') payload[k] = null;
      });

      if (editingId) {
        await clienteAxios.put(`/recursos-humanos/${editingId}`, payload);
        notifications.show({ title: 'Actualizado', message: 'Recurso actualizado', color: 'teal' });
      } else {
        await clienteAxios.post('/recursos-humanos', payload);
        notifications.show({ title: 'Creado', message: 'Recurso creado exitosamente', color: 'teal' });
      }
      closeModal();
      fetchRecursos();
    } catch (err) {
      notifications.show({ title: 'Error', message: err.response?.data?.msg || 'Error al guardar', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = recursos.filter(r =>
    `${r.nombre} ${r.dni} ${r.tipoContratacion}`.toLowerCase().includes(search.toLowerCase())
  );

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const fmt = (n) => n != null ? `$${Number(n).toLocaleString('es-AR')}` : '—';

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} c="var(--app-brand-primary)">Gestión de Recursos Humanos</Title>
          <Text c="dimmed" size="sm">Administra tu equipo de conductores y operarios</Text>
        </div>
        <Button leftSection={<Plus size={16} />} color="teal" onClick={handleNew}>
          Nuevo Recurso
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <TextInput
          placeholder="Buscar por nombre, DNI o tipo..."
          leftSection={<Search size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mb="md"
        />

        {loading ? (
          <Center py="xl"><Loader color="teal" /></Center>
        ) : filtered.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <Users size={32} color="var(--app-text-muted)" />
              <Text c="dimmed">No se encontraron recursos humanos</Text>
            </Stack>
          </Center>
        ) : (
          <Table.ScrollContainer minWidth={700}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>DNI</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Sueldo Básico</Table.Th>
                  <Table.Th>Adic. Actividad</Table.Th>
                  <Table.Th ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map(r => (
                  <Table.Tr key={r._id}>
                    <Table.Td fw={600}>{r.nombre || '—'}</Table.Td>
                    <Table.Td>{r.dni || '—'}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={r.tipoContratacion === 'empleado' ? 'blue' : 'orange'} size="sm">
                        {r.tipoContratacion}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{fmt(r.sueldoBasico)}</Table.Td>
                    <Table.Td>{r.adicionalActividadPorc}%</Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <Tooltip label="Editar">
                          <ActionIcon variant="light" color="teal" onClick={() => handleEdit(r)}>
                            <Pencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Eliminar">
                          <ActionIcon variant="light" color="red" onClick={() => handleDelete(r._id)}>
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      {/* ─── Modal Crear / Editar ─── */}
      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar Recurso Humano' : 'Nuevo Recurso Humano'}
        size="lg"
        centered
      >
        <Stack gap="sm">
          <Group grow>
            <Select label="Tipo Contratación" data={tiposContratacion} value={form.tipoContratacion} onChange={v => updateField('tipoContratacion', v)} required />
            <TextInput label="Nombre Completo" placeholder="Juan Pérez" value={form.nombre} onChange={e => updateField('nombre', e.target.value)} required />
          </Group>
          <Group grow>
            <TextInput label="DNI" placeholder="12345678" value={form.dni} onChange={e => updateField('dni', e.target.value)} />
            <TextInput label="CUIL" placeholder="20-12345678-9" value={form.cuil} onChange={e => updateField('cuil', e.target.value)} />
          </Group>
          <Group grow>
            <TextInput label="Teléfono" value={form.telefono} onChange={e => updateField('telefono', e.target.value)} />
            <TextInput label="Email" value={form.email} onChange={e => updateField('email', e.target.value)} />
          </Group>

          <Text fw={600} size="sm" mt="sm" c="var(--app-brand-primary)">Remuneración</Text>

          <Group grow>
            <NumberInput label="Sueldo Básico ($)" value={form.sueldoBasico} onChange={v => updateField('sueldoBasico', v)} prefix="$" />
            <NumberInput label="Adic. Actividad (%)" value={form.adicionalActividadPorc} onChange={v => updateField('adicionalActividadPorc', v)} suffix="%" />
          </Group>
          <Group grow>
            <NumberInput label="Adic. km remunerativo ($/km)" value={form.adicionalKmRemunerativo} onChange={v => updateField('adicionalKmRemunerativo', v)} prefix="$" decimalScale={2} />
            <NumberInput label="Mín. km remunerativo" value={form.minKmRemunerativo} onChange={v => updateField('minKmRemunerativo', v)} />
          </Group>
          <Group grow>
            <NumberInput label="Viático por km ($)" value={form.viaticoPorKmNoRemunerativo} onChange={v => updateField('viaticoPorKmNoRemunerativo', v)} prefix="$" decimalScale={2} />
            <NumberInput label="Mín. km viático" value={form.minKmNoRemunerativo} onChange={v => updateField('minKmNoRemunerativo', v)} />
          </Group>
          <Group grow>
            <NumberInput label="Adic. fijo no remun. ($)" value={form.adicionalNoRemunerativoFijo} onChange={v => updateField('adicionalNoRemunerativoFijo', v)} prefix="$" />
            <NumberInput label="Cargas Sociales (%)" value={form.porcentajeCargasSociales} onChange={v => updateField('porcentajeCargasSociales', v)} suffix="%" />
          </Group>

          <Button fullWidth color="teal" mt="md" onClick={handleSave} loading={saving}>
            {editingId ? 'Guardar Cambios' : 'Crear Recurso'}
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default GestionRRHH;
