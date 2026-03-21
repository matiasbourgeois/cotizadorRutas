import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';
import clienteAxios from '../../api/clienteAxios';
import ModalCrearVehiculo from './ModalCrearVehiculo';
import ModalConfiguracionVehiculo from './ModalConfiguracionVehiculo';
import { useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Pagination, Menu, Text, Group } from '@mantine/core';
import { Settings, ArrowRight, ArrowLeft, Search, Plus, Truck, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import ResumenPaso from '../../components/ResumenPaso';
import '../../styles/CotizadorSteps.css';

const BADGE_MAP = { utilitario: 'utilitario', mediano: 'mediano', grande: 'grande', camion: 'camion', camión: 'camion' };

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

  useEffect(() => { clienteAxios.get('/vehiculos').then(r => setVehiculos(r.data)).catch(console.error); }, []);

  const handleEliminar = (v) => {
    modals.openConfirmModal({
      title: 'Confirmar Eliminación', centered: true,
      children: <Text size="sm">¿Eliminar <strong>{v.marca} {v.modelo}</strong> ({v.patente})?</Text>,
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' }, confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await clienteAxios.delete(`/vehiculos/${v._id}`);
          setVehiculos(c => c.filter(x => x._id !== v._id));
          if (vehiculo?._id === v._id) setVehiculo(null);
          notifications.show({ title: 'Eliminado', message: 'Vehículo eliminado.', color: 'green' });
        } catch { notifications.show({ title: 'Error', message: 'No se pudo eliminar.', color: 'red' }); }
      },
    });
  };

  const handleAbrirConfig = (v) => { setVehiculoParaConfig(v); abrirModalConfig(); };
  const handleVehiculoCreado = (nv) => { setVehiculos(p => [nv, ...p]); setVehiculo(nv); cerrarModalCrear(); };
  const handleGuardarConfiguracion = (d) => {
    setVehiculos(p => p.map(v => v._id === d._id ? d : v));
    if (vehiculo?._id === d._id) setVehiculo(d);
    cerrarModalConfig();
  };

  const handleSiguiente = () => {
    if (vehiculo) navigate(`/cotizador/recurso-humano/${idRuta}`);
    else notifications.show({ title: 'Acción requerida', message: 'Selecciona un vehículo.', color: 'yellow' });
  };

  const setSorting = (field) => {
    setReverseSortDirection(field === sortBy ? !reverseSortDirection : false);
    setSortBy(field);
  };

  const filtered = [...vehiculos]
    .filter(item => { const q = filtro.toLowerCase(); return item.marca.toLowerCase().includes(q) || item.modelo.toLowerCase().includes(q) || item.patente.toLowerCase().includes(q) || item.tipoVehiculo.toLowerCase().includes(q); })
    .sort((a, b) => { if (!sortBy) return 0; const va = a[sortBy] ?? '', vb = b[sortBy] ?? ''; if (typeof va === 'number') return reverseSortDirection ? vb - va : va - vb; return reverseSortDirection ? vb.toString().localeCompare(va.toString()) : va.toString().localeCompare(vb.toString()); });

  const paginated = filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="step-grid step-grid--main-side">
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--cyan"><Truck size={18} /></div>
            <div>
              <h2 className="step-header-title">Panel de Flota</h2>
              <p className="step-header-subtitle">Selecciona el vehículo para la operación</p>
            </div>
          </div>
          <button className="step-btn-next" onClick={abrirModalCrear} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            <Plus size={14} /> Añadir
          </button>
        </div>

        <div className="step-content">
          <div className="step-search">
            <Search size={14} className="step-search-icon" />
            <input placeholder="Buscar por marca, modelo, patente..." value={filtro} onChange={(e) => { setFiltro(e.target.value); setPage(1); }} />
          </div>

          <div className="step-table-wrap">
            <table className="step-table">
              <thead>
                <tr>
                  <th onClick={() => setSorting('marca')} style={{ cursor: 'pointer' }}>Vehículo</th>
                  <th onClick={() => setSorting('tipoVehiculo')} style={{ cursor: 'pointer' }}>Tipo</th>
                  <th onClick={() => setSorting('capacidadKg')} style={{ cursor: 'pointer' }}>Capacidad</th>
                  <th onClick={() => setSorting('rendimientoKmLitro')} style={{ cursor: 'pointer' }}>Rend.</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map(item => (
                  <tr key={item._id} className={item._id === vehiculo?._id ? 'selected' : ''}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.marca} {item.modelo}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--app-text-muted)' }}>{item.patente}</div>
                    </td>
                    <td><span className={`step-badge step-badge--${BADGE_MAP[item.tipoVehiculo] || 'mediano'}`}>{item.tipoVehiculo}</span></td>
                    <td>{item.capacidadKg} kg</td>
                    <td>{item.rendimientoKmLitro} km/l</td>
                    <td>
                      <Group gap={4} justify="flex-end">
                        <button className={`step-btn-use ${item._id === vehiculo?._id ? 'active' : ''}`} onClick={() => setVehiculo(item)}>
                          {item._id === vehiculo?._id ? '✓ Activo' : 'Usar'}
                        </button>
                        <Menu shadow="md" width={160}>
                          <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><MoreVertical size={14} /></ActionIcon></Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<Settings size={12} />} onClick={() => handleAbrirConfig(item)}>Configurar</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<Trash2 size={12} />} onClick={() => handleEliminar(item)}>Eliminar</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5}>
                    <div className="step-empty">
                      <div className="step-empty-icon"><AlertCircle size={20} /></div>
                      <h4>Sin resultados</h4>
                      <p>No se encontraron vehículos</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Group justify="space-between" style={{ flexShrink: 0 }}>
              <Text c="dimmed" size="xs"><b>{paginated.length}</b> de <b>{filtered.length}</b></Text>
              <Pagination total={totalPages} value={activePage} onChange={setPage} color="cyan" radius="xl" size="xs" />
            </Group>
          )}
        </div>

        <div className="step-nav">
          <button className="step-btn-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Volver</button>
          <button className="step-btn-next" onClick={handleSiguiente} disabled={!vehiculo}>
            Siguiente: RRHH <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div><ResumenPaso /></div>
      <ModalCrearVehiculo show={modalCrearAbierto} onClose={cerrarModalCrear} onVehiculoCreado={handleVehiculoCreado} />
      {vehiculoParaConfig && <ModalConfiguracionVehiculo show={modalConfigAbierto} onClose={cerrarModalConfig} vehiculo={vehiculoParaConfig} onGuardarCambios={handleGuardarConfiguracion} />}
    </div>
  );
};

export default VehiculoPaso;