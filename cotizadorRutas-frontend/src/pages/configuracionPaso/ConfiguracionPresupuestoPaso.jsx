import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import { NumberInput, Textarea, TextInput, Slider, Menu } from "@mantine/core";
import {
  ArrowLeft, Send, ChevronDown, FileDown, Eye, Building,
  DollarSign, TrendingUp, Landmark, Receipt, Target
} from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";
import '../../styles/Step5.css';

const fmt = (n) => (n || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });

const ConfiguracionPresupuestoPaso = () => {
  const navigate = useNavigate();

  const {
    puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
    setResumenCostos, resumenCostos, detalleVehiculo, detalleRecurso,
    setDetalleVehiculo, setDetalleRecurso
  } = useCotizacion();

  const form = useForm({
    initialValues: {
      costoPeajes: 0, costoAdministrativo: 10, otrosCostos: 0,
      porcentajeGanancia: 15, cliente: "",
      terminos: "Para aprobar esta propuesta, responda a este correo. Validez: 15 días."
    },
  });

  const [loading, setLoading] = useState(false);
  const [presupuestoGuardadoId, setPresupuestoGuardadoId] = useState(null);
  const isFormDisabled = !!presupuestoGuardadoId;

  useEffect(() => {
    if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) return;
    const debounce = setTimeout(() => {
      const payload = { puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: form.values, detallesCarga };
      clienteAxios.post('/presupuestos/calcular', payload)
        .then(response => {
          setResumenCostos(response.data.resumenCostos);
          setDetalleVehiculo(response.data.detalleVehiculo);
          setDetalleRecurso(response.data.detalleRecurso);
        })
        .catch(error => console.error("Error en cálculo:", error));
    }, 300);
    return () => clearTimeout(debounce);
  }, [form.values, puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga]);

  const handleFinalizar = async (tipoAccion = 'propuesta') => {
    if (!resumenCostos) {
      notifications.show({ title: 'Error', message: 'No hay presupuesto calculado.', color: 'red' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        puntosEntrega: puntosEntrega.puntos, totalKilometros: puntosEntrega.distanciaKm,
        duracionMin: puntosEntrega.duracionMin, frecuencia,
        vehiculo: { datos: vehiculo, calculo: detalleVehiculo },
        recursoHumano: { datos: recursoHumano, calculo: detalleRecurso },
        configuracion: form.values, detallesCarga, resumenCostos,
        cliente: form.values.cliente, terminos: form.values.terminos
      };
      const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);
      notifications.show({ title: '¡Éxito!', message: 'Cotización guardada.', color: 'green' });
      setPresupuestoGuardadoId(presupuestoGuardado._id);
      window.open(`/${tipoAccion === 'propuesta' ? 'propuesta' : 'desglose'}/${presupuestoGuardado._id}`, '_blank');
    } catch (error) {
      notifications.show({ title: 'Error', message: 'No se pudo guardar.', color: 'red' });
    } finally { setLoading(false); }
  };

  const handleVerDocumento = (tipo) => {
    if (presupuestoGuardadoId) window.open(`/${tipo}/${presupuestoGuardadoId}`, '_blank');
  };

  // Computed values
  const costoOp = resumenCostos?.totalOperativo || 0;
  const precioVenta = resumenCostos?.totalFinal || 0;
  const gananciaAbs = precioVenta - costoOp;
  const margenNeto = precioVenta > 0 ? ((gananciaAbs) / precioVenta * 100) : 0;
  const gananciaSliderAbs = costoOp * form.values.porcentajeGanancia / 100;
  const adminSliderAbs = costoOp * form.values.costoAdministrativo / 100;
  const extras = (form.values.costoPeajes || 0) + (form.values.otrosCostos || 0);

  // Waterfall segments
  const total = precioVenta || 1;
  const pctBase = (costoOp / total) * 100;
  const pctGain = (gananciaSliderAbs / total) * 100;
  const pctAdmin = (adminSliderAbs / total) * 100;
  const pctExtra = (extras / total) * 100;

  return (
    <div className="s5">
      {/* ═══ LEFT COLUMN ═══ */}
      <div className="s5-main">

        {/* ─── HERO ─── */}
        <div className="s5-hero">
          <div className="s5-hero-left">
            <div className="s5-hero-icon"><Target size={20} /></div>
            <div>
              <div className="s5-hero-label">Margen Neto</div>
              <div className="s5-hero-pct">{margenNeto.toFixed(1)}%</div>
            </div>
          </div>
          <div className="s5-hero-right">
            <div className="s5-hero-money-label">Ganancia por viaje</div>
            <div className="s5-hero-money">${fmt(gananciaAbs)}</div>
            <div className="s5-hero-money-sub">sobre ${fmt(precioVenta)} de venta</div>
          </div>
        </div>

        {/* ─── PRICING CONSOLE ─── */}
        <div className="s5-console">
          <div className="s5-console-body">
            {/* Ganancia slider */}
            <div className="s5-slider-section">
              <div className="s5-slider-header">
                <div className="s5-slider-label-row">
                  <div className="s5-slider-icon s5-slider-icon--cyan"><TrendingUp size={15} /></div>
                  <div>
                    <div className="s5-slider-title">Margen de Ganancia</div>
                    <div className="s5-slider-sub">Rentabilidad sobre costo operativo</div>
                  </div>
                </div>
                <div className="s5-slider-big-pct s5-slider-big-pct--cyan">{form.values.porcentajeGanancia}%</div>
              </div>
              <Slider
                color="cyan" size="md" min={0} max={50} step={1}
                marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }, { value: 25, label: '25' }, { value: 40, label: '40' }, { value: 50, label: '50' }]}
                {...form.getInputProps('porcentajeGanancia')}
                disabled={isFormDisabled}
                styles={{ markLabel: { fontSize: '0.65rem' } }}
              />
              <div className="s5-slider-amount">= <span>${fmt(gananciaSliderAbs)}</span> por viaje</div>
            </div>

            <div className="s5-divider" />

            {/* Admin slider */}
            <div className="s5-slider-section">
              <div className="s5-slider-header">
                <div className="s5-slider-label-row">
                  <div className="s5-slider-icon s5-slider-icon--violet"><Landmark size={15} /></div>
                  <div>
                    <div className="s5-slider-title">Gastos Administrativos</div>
                    <div className="s5-slider-sub">Overhead operativo y de gestión</div>
                  </div>
                </div>
                <div className="s5-slider-big-pct s5-slider-big-pct--violet">{form.values.costoAdministrativo}%</div>
              </div>
              <Slider
                color="violet" size="md" min={0} max={25} step={1}
                marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }, { value: 10, label: '10' }, { value: 20, label: '20' }, { value: 25, label: '25' }]}
                {...form.getInputProps('costoAdministrativo')}
                disabled={isFormDisabled}
                styles={{ markLabel: { fontSize: '0.65rem' } }}
              />
              <div className="s5-slider-amount">= <span>${fmt(adminSliderAbs)}</span> por viaje</div>
            </div>
          </div>

          {/* Waterfall pricing bar */}
          <div className="s5-waterfall">
            <div className="s5-waterfall-title">Composición del Precio</div>
            <div className="s5-waterfall-bar">
              {pctBase > 0 && <div className="s5-waterfall-seg s5-waterfall-seg--base" style={{ flex: pctBase }}>{pctBase > 12 ? 'Base' : ''}</div>}
              {pctGain > 0 && <div className="s5-waterfall-seg s5-waterfall-seg--gain" style={{ flex: pctGain }}>{pctGain > 8 ? `+${form.values.porcentajeGanancia}%` : ''}</div>}
              {pctAdmin > 0 && <div className="s5-waterfall-seg s5-waterfall-seg--admin" style={{ flex: pctAdmin }}>{pctAdmin > 8 ? `+${form.values.costoAdministrativo}%` : ''}</div>}
              {pctExtra > 0 && <div className="s5-waterfall-seg s5-waterfall-seg--extra" style={{ flex: pctExtra }}>{pctExtra > 5 ? 'Extras' : ''}</div>}
            </div>
            <div className="s5-waterfall-legend">
              <div className="s5-waterfall-legend-item">
                <div className="s5-waterfall-dot" style={{ background: '#334155' }} />
                Costo Base <span className="s5-waterfall-legend-val">${fmt(costoOp)}</span>
              </div>
              <div className="s5-waterfall-legend-item">
                <div className="s5-waterfall-dot" style={{ background: '#22d3ee' }} />
                Ganancia <span className="s5-waterfall-legend-val">${fmt(gananciaSliderAbs)}</span>
              </div>
              <div className="s5-waterfall-legend-item">
                <div className="s5-waterfall-dot" style={{ background: '#8b5cf6' }} />
                Admin <span className="s5-waterfall-legend-val">${fmt(adminSliderAbs)}</span>
              </div>
              {extras > 0 && (
                <div className="s5-waterfall-legend-item">
                  <div className="s5-waterfall-dot" style={{ background: '#f59e0b' }} />
                  Extras <span className="s5-waterfall-legend-val">${fmt(extras)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── SECONDARY ROW ─── */}
        <div className="s5-secondary">
          <div className="s5-sec-card s5-sec-card--amber">
            <div className="s5-sec-label"><div className="s5-sec-icon s5-sec-icon--amber"><DollarSign size={9} /></div> Costos Adicionales</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
              <NumberInput label="Peajes" placeholder="0" prefix="$ " size="xs" {...form.getInputProps('costoPeajes')} disabled={isFormDisabled} />
              <NumberInput label="Otros" placeholder="0" prefix="$ " size="xs" {...form.getInputProps('otrosCostos')} disabled={isFormDisabled} />
            </div>
          </div>
          <div className="s5-sec-card s5-sec-card--slate">
            <div className="s5-sec-label"><div className="s5-sec-icon s5-sec-icon--slate"><Building size={9} /></div> Datos del Cliente</div>
            <TextInput placeholder="Nombre o empresa" size="xs" {...form.getInputProps('cliente')} disabled={isFormDisabled} />
          </div>
          <div className="s5-sec-card s5-sec-card--slate">
            <div className="s5-sec-label"><div className="s5-sec-icon s5-sec-icon--slate"><Receipt size={9} /></div> Términos</div>
            <Textarea placeholder="Condiciones, vigencia..." autosize minRows={1} maxRows={2} size="xs" {...form.getInputProps('terminos')} disabled={isFormDisabled} />
          </div>
        </div>

        {/* ─── Nav ─── */}
        <div className="s5-nav">
          <button className="step-btn-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Volver</button>
          {isFormDisabled ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="step-btn-back" onClick={() => handleVerDocumento('desglose')}><Eye size={14} /> Desglose</button>
              <button className="step-btn-next" onClick={() => handleVerDocumento('propuesta')}><Eye size={14} /> Propuesta</button>
            </div>
          ) : (
            <div className="s5-finalize-group">
              <button className="s5-btn-final s5-btn-final--main" onClick={() => handleFinalizar('propuesta')} disabled={loading}>
                <Send size={14} /> {loading ? 'Guardando...' : 'Finalizar y Ver Propuesta'}
              </button>
              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                <Menu.Target>
                  <button className="s5-btn-final s5-btn-final--drop" disabled={loading}><ChevronDown size={16} /></button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<FileDown size={14} />} onClick={() => handleFinalizar('desglose')}>Guardar y Descargar Desglose</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT SIDEBAR ═══ */}
      <div><ResumenPaso /></div>
    </div>
  );
};

export default ConfiguracionPresupuestoPaso;