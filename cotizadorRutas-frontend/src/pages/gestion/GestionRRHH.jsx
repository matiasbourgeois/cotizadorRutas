import { Container, Title, Text, Paper, Group, Button, Table, ActionIcon, TextInput, Badge, Stack, Loader, Center, Modal, Select, NumberInput, Menu } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Users, MoreVertical } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
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
  // Empleado (CCT 40/89)
  sueldoBasico: 917462,
  adicionalActividadPorc: 15,
  adicionalCargaDescargaCadaXkm: 38228,
  kmPorUnidadDeCarga: 1000,
  adicionalKmRemunerativo: 73.40,
  viaticoPorKmNoRemunerativo: 73.40,
  adicionalNoRemunerativoFijo: 53000,
  porcentajeCargasSociales: 35,
  // Contratado (factor)
  factorSobreEmpleado: 75,
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
  const [configDefaults, setConfigDefaults] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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

  // Fetch configuracion-defaults on mount
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const { data } = await clienteAxios.get('/configuracion-defaults');
        setConfigDefaults(data);
      } catch (e) { /* silent */ }
    };
    fetchDefaults();
  }, []);

  const handleNew = () => {
    setEditingId(null);
    setFieldErrors({});
    const tipo = 'empleado';
    const defs = configDefaults?.recursosHumanos?.[tipo];
    if (defs) {
      setForm({ ...emptyForm, ...defs, tipoContratacion: tipo, nombre: '', dni: '', cuil: '', telefono: '', email: '', observaciones: '' });
    } else {
      setForm(emptyForm);
    }
    openModal();
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFieldErrors({});
    setForm({
      tipoContratacion: r.tipoContratacion || 'empleado',
      nombre: r.nombre || '',
      dni: r.dni || '',
      cuil: r.cuil || '',
      telefono: r.telefono || '',
      email: r.email || '',
      sueldoBasico: r.sueldoBasico ?? 917462,
      adicionalActividadPorc: r.adicionalActividadPorc ?? 15,
      adicionalCargaDescargaCadaXkm: r.adicionalCargaDescargaCadaXkm ?? 38228,
      kmPorUnidadDeCarga: r.kmPorUnidadDeCarga ?? 1000,
      adicionalKmRemunerativo: r.adicionalKmRemunerativo ?? 73.40,
      viaticoPorKmNoRemunerativo: r.viaticoPorKmNoRemunerativo ?? 73.40,
      adicionalNoRemunerativoFijo: r.adicionalNoRemunerativoFijo ?? 53000,
      porcentajeCargasSociales: r.porcentajeCargasSociales ?? 35,
      factorSobreEmpleado: r.factorSobreEmpleado ?? 75,
      observaciones: r.observaciones || '',
    });
    openModal();
  };

  const handleDelete = (id) => {
    modals.openConfirmModal({
      title: 'Confirmar eliminación',
      centered: true,
      children: <Text size="sm">¿Estás seguro de que querés eliminar este recurso humano? Esta acción es irreversible.</Text>,
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await clienteAxios.delete(`/recursos-humanos/${id}`);
          notifications.show({ title: 'Eliminado', message: 'Recurso eliminado correctamente', color: 'teal' });
          fetchRecursos();
        } catch (err) {
          notifications.show({ title: 'Error', message: 'No se pudo eliminar', color: 'red' });
        }
      },
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nombre || form.nombre.trim().length < 3) errors.nombre = 'El nombre es obligatorio (mín. 3 caracteres)';
    if (!form.tipoContratacion) errors.tipoContratacion = 'Seleccioná un tipo de contratación';
    if (form.tipoContratacion === 'empleado') {
      if (!form.sueldoBasico || form.sueldoBasico <= 0) errors.sueldoBasico = 'El sueldo básico debe ser mayor a 0';
    } else {
      if (!form.factorSobreEmpleado || form.factorSobreEmpleado <= 0 || form.factorSobreEmpleado > 100) errors.factorSobreEmpleado = 'El factor debe estar entre 1 y 100';
    }
    if (form.email && !/^\S+@\S+$/.test(form.email)) errors.email = 'El formato del email no es válido';
    if (form.dni && !/^\d{7,8}$/.test(form.dni)) errors.dni = 'El DNI debe tener 7 u 8 números, sin puntos';
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      notifications.show({ title: 'Campos con errores', message: 'Corregí los campos marcados en rojo', color: 'orange' });
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

  const updateField = (field, value) => {
    // Clear error for this field on change
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }));

    if (field === 'tipoContratacion' && !editingId && configDefaults?.recursosHumanos?.[value]) {
      // Auto-fill defaults when changing type on NEW resource
      const defs = configDefaults.recursosHumanos[value];
      setForm(prev => ({
        ...prev,
        ...defs,
        tipoContratacion: value,
        // Preserve personal fields
        nombre: prev.nombre,
        dni: prev.dni,
        cuil: prev.cuil,
        telefono: prev.telefono,
        email: prev.email,
        observaciones: prev.observaciones,
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const fmt = (n) => n != null ? `$${Number(n).toLocaleString('es-AR')}` : '—';

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} c="var(--app-brand-primary)">Gestión de Recursos Humanos</Title>
          <Text c="dimmed" size="sm">Administra tu equipo de conductores y operarios</Text>
        </div>
        <Button leftSection={<Plus size={16} />} color="cyan" onClick={handleNew}>
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
          <Center py="xl"><Loader color="cyan" /></Center>
        ) : filtered.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <Users size={32} color="var(--app-text-muted)" />
              <Text c="dimmed">No se encontraron recursos humanos</Text>
            </Stack>
          </Center>
        ) : (
          <Table.ScrollContainer minWidth={700}>
            <Table highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Personal</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Base Económica</Table.Th>
                  <Table.Th>Detalle</Table.Th>
                  <Table.Th ta="right">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map(r => (
                  <Table.Tr key={r._id}>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text fz="sm" fw={500}>{r.nombre || '—'}</Text>
                        <Text fz="xs" c="dimmed">{r.dni ? `DNI ${r.dni}` : 'Sin DNI'}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={r.tipoContratacion === 'empleado' ? 'blue' : 'orange'} size="sm">
                        {r.tipoContratacion}
                      </Badge>
                    </Table.Td>
                    <Table.Td><Text fw={500}>{r.tipoContratacion === 'contratado' ? `${r.factorSobreEmpleado || 75}% del empleado` : fmt(r.sueldoBasico)}</Text></Table.Td>
                    <Table.Td>{r.tipoContratacion === 'contratado' ? `Factor ${r.factorSobreEmpleado || 75}%` : `${r.adicionalActividadPorc}%`}</Table.Td>
                    <Table.Td>
                      <Group justify="flex-end">
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray"><MoreVertical size={16} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Label>Acciones</Menu.Label>
                            <Menu.Item leftSection={<Pencil size={14} />} onClick={() => handleEdit(r)}>Editar</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleDelete(r._id)}>Eliminar</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
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
            <Select label="Tipo Contratación" data={tiposContratacion} value={form.tipoContratacion} onChange={v => updateField('tipoContratacion', v)} error={fieldErrors.tipoContratacion} required />
            <TextInput label="Nombre Completo" placeholder="Juan Pérez" value={form.nombre} onChange={e => updateField('nombre', e.target.value)} error={fieldErrors.nombre} required />
          </Group>
          <Group grow>
            <TextInput label="DNI" placeholder="12345678" value={form.dni} onChange={e => updateField('dni', e.target.value)} error={fieldErrors.dni} />
            <TextInput label="CUIL" placeholder="20-12345678-9" value={form.cuil} onChange={e => updateField('cuil', e.target.value)} />
          </Group>
          <Group grow>
            <TextInput label="Teléfono" value={form.telefono} onChange={e => updateField('telefono', e.target.value)} />
            <TextInput label="Email" value={form.email} onChange={e => updateField('email', e.target.value)} error={fieldErrors.email} />
          </Group>

          <Text fw={600} size="sm" mt="sm" c="var(--app-brand-primary)">
            {form.tipoContratacion === 'contratado' ? 'Costo del Servicio' : 'Remuneración (CCT 40/89)'}
          </Text>

          {form.tipoContratacion === 'contratado' ? (
            /* ═══ Campo CONTRATADO — Factor sobre empleado ═══ */
            <>
              <NumberInput
                label="Factor sobre empleado (%)"
                value={form.factorSobreEmpleado}
                onChange={v => updateField('factorSobreEmpleado', v)}
                suffix="%"
                min={1}
                max={100}
                error={fieldErrors.factorSobreEmpleado}
                description="Porcentaje del costo de un empleado CCT equivalente."
              />
            </>
          ) : (
            /* ═══ Campos EMPLEADO (CCT) ═══ */
            <>
              <Group grow>
                <NumberInput label="Sueldo Básico ($)" value={form.sueldoBasico} onChange={v => updateField('sueldoBasico', v)} prefix="$" error={fieldErrors.sueldoBasico} />
                <NumberInput label="Adic. Actividad (%)" value={form.adicionalActividadPorc} onChange={v => updateField('adicionalActividadPorc', v)} suffix="%" />
              </Group>
              <Group grow>
                <NumberInput label="Adic. km remunerativo ($/km)" value={form.adicionalKmRemunerativo} onChange={v => updateField('adicionalKmRemunerativo', v)} prefix="$" decimalScale={2} />
                <NumberInput label="Viático por km ($)" value={form.viaticoPorKmNoRemunerativo} onChange={v => updateField('viaticoPorKmNoRemunerativo', v)} prefix="$" decimalScale={2} />
              </Group>
              <Group grow>
                <NumberInput label="Adic. fijo no remun. ($)" value={form.adicionalNoRemunerativoFijo} onChange={v => updateField('adicionalNoRemunerativoFijo', v)} prefix="$" />
                <NumberInput label="Cargas Sociales (%)" value={form.porcentajeCargasSociales} onChange={v => updateField('porcentajeCargasSociales', v)} suffix="%" />
              </Group>
            </>
          )}

          <Button fullWidth color="teal" mt="md" onClick={handleSave} loading={saving}>
            {editingId ? 'Guardar Cambios' : 'Crear Recurso'}
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default GestionRRHH;
