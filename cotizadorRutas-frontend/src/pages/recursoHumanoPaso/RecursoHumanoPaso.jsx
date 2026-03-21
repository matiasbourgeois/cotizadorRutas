
import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearRecursoHumano from './ModalCrearRecursoHumano';
import ModalConfiguracionEmpleado from './ModalConfiguracionEmpleado';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Button, ActionIcon, Pagination, Menu, Text, Group } from '@mantine/core';
import {
  Settings, ArrowRight, ArrowLeft, Search, Plus, Users,
  AlertCircle, Trash2, MoreVertical
} from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import ResumenPaso from '../../components/ResumenPaso';
import '../../styles/CotizadorSteps.css';

const RecursoHumanoPaso = () => {
  const [recursos, setRecursos] = useState([]);
  const [modalCrearAbierto, { open: abrirModalCrear, close: cerrarModalCrear }] = useDisclosure(false);
  const [modalConfigAbierto, { open: abrirModalConfig, close: cerrarModalConfig }] = useDisclosure(false);
  const [recursoParaConfig, setRecursoParaConfig] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleEliminar = (r) => {
    modals.openConfirmModal({
      title: 'Confirmar Eliminación', centered: true,
      children: <Text size="sm">¿Eliminar a <strong>{r.nombre}</strong>? Esta acción es permanente.</Text>,
      labels: { confirm: 'Sí, eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await clienteAxios.delete(`/recursos-humanos/${r._id}`);
          setRecursos(cur => cur.filter(x => x._id !== r._id));
          if (recursoHumano?._id === r._id) setRecursoHumano(null);
          notifications.show({ title: 'Eliminado', message: 'Colaborador eliminado.', color: 'green' });
        } catch { notifications.show({ title: 'Error', message: 'No se pudo eliminar.', color: 'red' }); }
      },
    });
  };

  const handleAbrirConfig = (r) => { setRecursoParaConfig(r); abrirModalConfig(); };
  const handleRecursoCreado = (nr) => { setRecursos(p => [nr, ...p]); setRecursoHumano(nr); cerrarModalCrear(); };
  const handleGuardarConfiguracion = (d) => {
    setRecursos(p => p.map(r => r._id === d._id ? d : r));
    if (recursoHumano?._id === d._id) setRecursoHumano(d);
    cerrarModalConfig();
  };

  const handleSiguiente = () => {
    if (recursoHumano) navigate("/cotizador/configuracion-final");
    else notifications.show({ title: 'Acción requerida', message: 'Selecciona un recurso humano.', color: 'yellow' });
  };

  const setSorting = (field) => {
    setReverseSortDirection(field === sortBy ? !reverseSortDirection : false);
    setSortBy(field);
  };

  const filtered = [...recursos]
    .filter(item => {
      const q = filtro.toLowerCase();
      return item.nombre.toLowerCase().includes(q) ||
        (item.dni && item.dni.toLowerCase().includes(q)) ||
        item.tipoContratacion.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const va = a[sortBy] ?? '', vb = b[sortBy] ?? '';
      const result = va.toString().localeCompare(vb.toString());
      return reverseSortDirection ? result * -1 : result;
    });

  const paginated = filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="step-grid step-grid--main-side">
      {/* ─── Main ─── */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--emerald">
              <Users size={20} />
            </div>
            <div>
              <h2 className="step-header-title">Gestión de Equipo</h2>
              <p className="step-header-subtitle">Asigna el personal para la operación</p>
            </div>
          </div>
          <Button size="xs" onClick={abrirModalCrear} leftSection={<Plus size={14} />}>
            Añadir
          </Button>
        </div>

        <div className="step-content">
          <div className="step-search">
            <Search size={16} className="step-search-icon" />
            <input
              placeholder="Buscar por nombre, DNI o modalidad..."
              value={filtro}
              onChange={(e) => { setFiltro(e.target.value); setPage(1); }}
            />
          </div>

          <div className="step-table-wrap" style={{ overflow: 'auto' }}>
            <table className="step-table">
              <thead>
                <tr>
                  <th onClick={() => setSorting('nombre')} style={{ cursor: 'pointer' }}>Colaborador</th>
                  <th onClick={() => setSorting('tipoContratacion')} style={{ cursor: 'pointer' }}>Modalidad</th>
                  <th onClick={() => setSorting('sueldoBasico')} style={{ cursor: 'pointer' }}>Costo Base</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map(item => (
                  <tr key={item._id} className={item._id === recursoHumano?._id ? 'selected' : ''}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--app-text-muted)' }}>DNI: {item.dni || 'N/A'}</div>
                    </td>
                    <td>
                      <span className={`step-badge step-badge--${item.tipoContratacion}`}>{item.tipoContratacion}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${(item.sueldoBasico || 0).toLocaleString('es-AR')}</td>
                    <td>
                      <Group gap="xs" justify="flex-end">
                        <button
                          className={`step-btn-use ${item._id === recursoHumano?._id ? 'active' : ''}`}
                          onClick={() => setRecursoHumano(item)}
                        >
                          {item._id === recursoHumano?._id ? '✓ Activo' : 'Asignar'}
                        </button>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm"><MoreVertical size={14} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<Settings size={14} />} onClick={() => handleAbrirConfig(item)}>Configurar</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleEliminar(item)}>Eliminar</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="step-empty">
                        <div className="step-empty-icon"><AlertCircle size={24} /></div>
                        <h4>Sin resultados</h4>
                        <p>No se encontraron colaboradores.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Group justify="space-between" style={{ flexShrink: 0 }}>
              <Text c="dimmed" size="xs"><b>{paginated.length}</b> de <b>{filtered.length}</b></Text>
              <Pagination total={totalPages} value={activePage} onChange={setPage} color="cyan" radius="xl" size="sm" />
            </Group>
          )}
        </div>

        <div className="step-nav">
          <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>Volver</Button>
          <Button onClick={handleSiguiente} disabled={!recursoHumano} rightSection={<ArrowRight size={16} />} size="md">
            Siguiente: Resumen y Costos
          </Button>
        </div>
      </div>

      {/* ─── Sidebar ─── */}
      <div><ResumenPaso /></div>

      <ModalCrearRecursoHumano show={modalCrearAbierto} onHide={cerrarModalCrear} onCrear={handleRecursoCreado} />
      {recursoParaConfig && (
        <ModalConfiguracionEmpleado show={modalConfigAbierto} onClose={cerrarModalConfig} recursoHumano={recursoParaConfig} onGuardarCambios={handleGuardarConfiguracion} />
      )}
    </div>
  );
};

export default RecursoHumanoPaso;