import { Container, Title, Text, Paper, Group, Button, Table, ActionIcon, TextInput, Badge, Stack, Loader, Center, Modal, Select, NumberInput, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Truck } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../../api/clienteAxios';

const tiposVehiculo = [
  { value: 'utilitario', label: 'Utilitario' },
  { value: 'mediano', label: 'Mediano' },
  { value: 'grande', label: 'Grande' },
  { value: 'camion', label: 'Camión' },
];

const tiposCombustible = [
  { value: 'nafta', label: 'Nafta' },
  { value: 'gasoil', label: 'Gasoil' },
];

const emptyForm = {
  tipoVehiculo: 'utilitario',
  patente: '',
  marca: '',
  modelo: '',
  año: new Date().getFullYear(),
  tipoCombustible: 'gasoil',
  rendimientoKmLitro: 10,
  capacidadKg: '',
  precioLitroCombustible: '',
  precioVehiculoNuevo: '',
  kmsVidaUtilVehiculo: '',
  valorResidualPorcentaje: 30,
  cantidadCubiertas: '',
  precioCubierta: '',
  kmsVidaUtilCubiertas: '',
  precioCambioAceite: '',
  kmsCambioAceite: '',
  costoSeguroMensual: '',
  costoMantenimientoPreventivoMensual: '',
  costoPatenteMunicipal: '',
  costoPatenteProvincial: '',
  observaciones: '',
};

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const { data } = await clienteAxios.get('/vehiculos');
      setVehiculos(data);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'No se pudieron cargar los vehículos', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    openModal();
  };

  const handleEdit = (v) => {
    setEditingId(v._id);
    setForm({
      tipoVehiculo: v.tipoVehiculo || 'utilitario',
      patente: v.patente || '',
      marca: v.marca || '',
      modelo: v.modelo || '',
      año: v.año || new Date().getFullYear(),
      tipoCombustible: v.tipoCombustible || 'gasoil',
      rendimientoKmLitro: v.rendimientoKmLitro ?? 10,
      capacidadKg: v.capacidadKg ?? '',
      precioLitroCombustible: v.precioLitroCombustible ?? '',
      precioVehiculoNuevo: v.precioVehiculoNuevo ?? '',
      kmsVidaUtilVehiculo: v.kmsVidaUtilVehiculo ?? '',
      valorResidualPorcentaje: v.valorResidualPorcentaje ?? 30,
      cantidadCubiertas: v.cantidadCubiertas ?? '',
      precioCubierta: v.precioCubierta ?? '',
      kmsVidaUtilCubiertas: v.kmsVidaUtilCubiertas ?? '',
      precioCambioAceite: v.precioCambioAceite ?? '',
      kmsCambioAceite: v.kmsCambioAceite ?? '',
      costoSeguroMensual: v.costoSeguroMensual ?? '',
      costoMantenimientoPreventivoMensual: v.costoMantenimientoPreventivoMensual ?? '',
      costoPatenteMunicipal: v.costoPatenteMunicipal ?? '',
      costoPatenteProvincial: v.costoPatenteProvincial ?? '',
      observaciones: v.observaciones || '',
    });
    openModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;
    try {
      await clienteAxios.delete(`/vehiculos/${id}`);
      notifications.show({ title: 'Eliminado', message: 'Vehículo eliminado correctamente', color: 'teal' });
      fetchVehiculos();
    } catch (err) {
      notifications.show({ title: 'Error', message: 'No se pudo eliminar', color: 'red' });
    }
  };

  const handleSave = async () => {
    if (!form.patente || !form.marca || !form.modelo) {
      notifications.show({ title: 'Campos requeridos', message: 'Patente, marca y modelo son obligatorios', color: 'orange' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      // Convert empty strings to null for optional number fields
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') payload[k] = null;
      });

      if (editingId) {
        await clienteAxios.put(`/vehiculos/${editingId}`, payload);
        notifications.show({ title: 'Actualizado', message: 'Vehículo actualizado', color: 'teal' });
      } else {
        await clienteAxios.post('/vehiculos', payload);
        notifications.show({ title: 'Creado', message: 'Vehículo creado exitosamente', color: 'teal' });
      }
      closeModal();
      fetchVehiculos();
    } catch (err) {
      notifications.show({ title: 'Error', message: err.response?.data?.msg || 'Error al guardar', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = vehiculos.filter(v =>
    `${v.marca} ${v.modelo} ${v.patente}`.toLowerCase().includes(search.toLowerCase())
  );

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2} c="var(--app-brand-primary)">Gestión de Vehículos</Title>
          <Text c="dimmed" size="sm">Administra tu flota de vehículos</Text>
        </div>
        <Button leftSection={<Plus size={16} />} color="cyan" onClick={handleNew}>
          Nuevo Vehículo
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <TextInput
          placeholder="Buscar por marca, modelo o patente..."
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
              <Truck size={32} color="var(--app-text-muted)" />
              <Text c="dimmed">No se encontraron vehículos</Text>
            </Stack>
          </Center>
        ) : (
          <Table.ScrollContainer minWidth={700}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Patente</Table.Th>
                  <Table.Th>Marca / Modelo</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Año</Table.Th>
                  <Table.Th>Combustible</Table.Th>
                  <Table.Th>Rendimiento</Table.Th>
                  <Table.Th ta="center">Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map(v => (
                  <Table.Tr key={v._id}>
                    <Table.Td fw={600}>{v.patente}</Table.Td>
                    <Table.Td>{v.marca} {v.modelo}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="cyan" size="sm">{v.tipoVehiculo}</Badge>
                    </Table.Td>
                    <Table.Td>{v.año}</Table.Td>
                    <Table.Td>{v.tipoCombustible}</Table.Td>
                    <Table.Td>{v.rendimientoKmLitro} km/l</Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <Tooltip label="Editar">
                          <ActionIcon variant="light" color="cyan" onClick={() => handleEdit(v)}>
                            <Pencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Eliminar">
                          <ActionIcon variant="light" color="red" onClick={() => handleDelete(v._id)}>
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
        title={editingId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        size="lg"
        centered
      >
        <Stack gap="sm">
          <Group grow>
            <Select label="Tipo" data={tiposVehiculo} value={form.tipoVehiculo} onChange={v => updateField('tipoVehiculo', v)} />
            <TextInput label="Patente" placeholder="ABC-123" value={form.patente} onChange={e => updateField('patente', e.target.value)} required />
          </Group>
          <Group grow>
            <TextInput label="Marca" placeholder="Iveco" value={form.marca} onChange={e => updateField('marca', e.target.value)} required />
            <TextInput label="Modelo" placeholder="Daily 35S14" value={form.modelo} onChange={e => updateField('modelo', e.target.value)} required />
          </Group>
          <Group grow>
            <NumberInput label="Año" value={form.año} onChange={v => updateField('año', v)} min={1990} max={2030} />
            <Select label="Combustible" data={tiposCombustible} value={form.tipoCombustible} onChange={v => updateField('tipoCombustible', v)} />
          </Group>

          <Text fw={600} size="sm" mt="sm" c="var(--app-brand-primary)">Configuración Económica</Text>

          <Group grow>
            <NumberInput label="Rendimiento (km/l)" value={form.rendimientoKmLitro} onChange={v => updateField('rendimientoKmLitro', v)} min={1} decimalScale={1} />
            <NumberInput label="Precio combustible ($/l)" value={form.precioLitroCombustible} onChange={v => updateField('precioLitroCombustible', v)} min={0} prefix="$" />
          </Group>
          <Group grow>
            <NumberInput label="Capacidad (kg)" value={form.capacidadKg} onChange={v => updateField('capacidadKg', v)} min={0} />
            <NumberInput label="Precio vehículo nuevo ($)" value={form.precioVehiculoNuevo} onChange={v => updateField('precioVehiculoNuevo', v)} min={0} prefix="$" />
          </Group>
          <Group grow>
            <NumberInput label="Vida útil (km)" value={form.kmsVidaUtilVehiculo} onChange={v => updateField('kmsVidaUtilVehiculo', v)} min={0} />
            <NumberInput label="Valor residual (%)" value={form.valorResidualPorcentaje} onChange={v => updateField('valorResidualPorcentaje', v)} min={0} max={100} suffix="%" />
          </Group>

          <Text fw={600} size="sm" mt="sm" c="var(--app-brand-primary)">Cubiertas y Aceite</Text>

          <Group grow>
            <NumberInput label="Cant. cubiertas" value={form.cantidadCubiertas} onChange={v => updateField('cantidadCubiertas', v)} min={0} />
            <NumberInput label="Precio cubierta ($)" value={form.precioCubierta} onChange={v => updateField('precioCubierta', v)} min={0} prefix="$" />
            <NumberInput label="Vida útil cubiertas (km)" value={form.kmsVidaUtilCubiertas} onChange={v => updateField('kmsVidaUtilCubiertas', v)} min={0} />
          </Group>
          <Group grow>
            <NumberInput label="Precio cambio aceite ($)" value={form.precioCambioAceite} onChange={v => updateField('precioCambioAceite', v)} min={0} prefix="$" />
            <NumberInput label="Kms cambio aceite" value={form.kmsCambioAceite} onChange={v => updateField('kmsCambioAceite', v)} min={0} />
          </Group>

          <Text fw={600} size="sm" mt="sm" c="var(--app-brand-primary)">Costos Fijos Mensuales</Text>

          <Group grow>
            <NumberInput label="Seguro ($)" value={form.costoSeguroMensual} onChange={v => updateField('costoSeguroMensual', v)} min={0} prefix="$" />
            <NumberInput label="Mantenimiento ($)" value={form.costoMantenimientoPreventivoMensual} onChange={v => updateField('costoMantenimientoPreventivoMensual', v)} min={0} prefix="$" />
          </Group>
          <Group grow>
            <NumberInput label="Patente municipal ($)" value={form.costoPatenteMunicipal} onChange={v => updateField('costoPatenteMunicipal', v)} min={0} prefix="$" />
            <NumberInput label="Patente provincial ($)" value={form.costoPatenteProvincial} onChange={v => updateField('costoPatenteProvincial', v)} min={0} prefix="$" />
          </Group>

          <Button fullWidth color="cyan" mt="md" onClick={handleSave} loading={saving}>
            {editingId ? 'Guardar Cambios' : 'Crear Vehículo'}
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default GestionVehiculos;
