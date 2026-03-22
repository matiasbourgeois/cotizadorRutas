import { useState, useEffect, useMemo } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import { NumberInput, Textarea, TextInput, Slider, Menu } from "@mantine/core";
import {
  ArrowLeft, Send, ChevronDown, FileDown, Eye, Building,
  DollarSign, Percent, TrendingUp, Landmark, Receipt, User
} from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";
import '../../styles/Step5.css';

/* ─── SVG Radial Gauge ─── */
const RadialGauge = ({ value, max = 50, colorClass = 'cyan' }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="s5-gauge">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} className="s5-gauge-bg" />
        <circle
          cx="24" cy="24" r={radius}
          className={`s5-gauge-fill s5-gauge-fill--${colorClass}`}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="s5-gauge-value">{value}%</div>
    </div>
  );
};

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

  // Computed display values
  const costoOp = resumenCostos?.totalOperativo || 0;
  const precioVenta = resumenCostos?.totalFinal || 0;
  const margenNeto = costoOp > 0 ? ((precioVenta - costoOp) / precioVenta * 100) : 0;

  return (
    <div className="s5">
      {/* ═══ LEFT COLUMN ═══ */}
      <div className="s5-main">

        {/* ─── Top: 3 Metric Dashboard Cards ─── */}
        <div className="s5-metrics">
          {/* Ganancia gauge card */}
          <div className="s5-metric s5-metric--profit">
            <RadialGauge value={form.values.porcentajeGanancia} max={50} colorClass="cyan" />
            <div>
              <div className="s5-metric-label">Margen Ganancia</div>
              <div className="s5-metric-value s5-metric-value--cyan">
                {form.values.porcentajeGanancia}%
              </div>
            </div>
          </div>

          {/* Admin gauge card */}
          <div className="s5-metric s5-metric--admin">
            <RadialGauge value={form.values.costoAdministrativo} max={30} colorClass="violet" />
            <div>
              <div className="s5-metric-label">Administrativos</div>
              <div className="s5-metric-value s5-metric-value--violet">
                {form.values.costoAdministrativo}%
              </div>
            </div>
          </div>

          {/* Profit margin card */}
          <div className="s5-metric s5-metric--total">
            <RadialGauge value={Math.round(margenNeto)} max={50} colorClass="emerald" />
            <div>
              <div className="s5-metric-label">Margen Neto</div>
              <div className="s5-metric-value s5-metric-value--emerald">
                {margenNeto.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* ─── Form grid ─── */}
        <div className="s5-form">
          {/* Ganancia slider card */}
          <div className="s5-card s5-card--cyan">
            <div className="s5-card-label">
              <div className="s5-card-label-icon s5-card-label-icon--cyan"><TrendingUp size={10} /></div>
              Margen de Ganancia
            </div>
            <div className="s5-slider-row">
              <Slider
                color="cyan" size="sm" min={0} max={50} step={1}
                marks={[{ value: 10, label: '10' }, { value: 25, label: '25' }, { value: 40, label: '40' }]}
                {...form.getInputProps('porcentajeGanancia')}
                disabled={isFormDisabled}
                styles={{ markLabel: { fontSize: '0.6rem' } }}
              />
              <span className="s5-slider-pct s5-slider-pct--cyan">{form.values.porcentajeGanancia}%</span>
            </div>
          </div>

          {/* Admin slider card */}
          <div className="s5-card s5-card--violet">
            <div className="s5-card-label">
              <div className="s5-card-label-icon s5-card-label-icon--violet"><Landmark size={10} /></div>
              Gastos Administrativos
            </div>
            <div className="s5-slider-row">
              <Slider
                color="violet" size="sm" min={0} max={25} step={1}
                marks={[{ value: 5, label: '5' }, { value: 10, label: '10' }, { value: 20, label: '20' }]}
                {...form.getInputProps('costoAdministrativo')}
                disabled={isFormDisabled}
                styles={{ markLabel: { fontSize: '0.6rem' } }}
              />
              <span className="s5-slider-pct s5-slider-pct--violet">{form.values.costoAdministrativo}%</span>
            </div>
          </div>

          {/* Cost inputs card */}
          <div className="s5-card s5-card--amber">
            <div className="s5-card-label">
              <div className="s5-card-label-icon s5-card-label-icon--amber"><DollarSign size={10} /></div>
              Costos Adicionales
            </div>
            <div className="s5-cost-row">
              <NumberInput
                label="Peajes y tasas" placeholder="0" prefix="$ " size="xs"
                {...form.getInputProps('costoPeajes')} disabled={isFormDisabled}
              />
              <NumberInput
                label="Otros costos" placeholder="0" prefix="$ " size="xs"
                {...form.getInputProps('otrosCostos')} disabled={isFormDisabled}
              />
            </div>
          </div>

          {/* Client card */}
          <div className="s5-card s5-card--slate">
            <div className="s5-card-label">
              <div className="s5-card-label-icon s5-card-label-icon--slate"><Building size={10} /></div>
              Datos del Cliente
            </div>
            <TextInput
              placeholder="Nombre o empresa del destinatario"
              size="xs"
              {...form.getInputProps('cliente')}
              disabled={isFormDisabled}
            />
          </div>

          {/* Terms card (full width) */}
          <div className="s5-card s5-card--slate s5-form-full" style={{ flex: 1, minHeight: 0 }}>
            <div className="s5-card-label">
              <div className="s5-card-label-icon s5-card-label-icon--slate"><Receipt size={10} /></div>
              Términos de la Propuesta
            </div>
            <Textarea
              placeholder="Condiciones, vigencia, forma de pago..."
              autosize minRows={1} maxRows={3} size="xs"
              {...form.getInputProps('terminos')}
              disabled={isFormDisabled}
              styles={{ input: { flex: 1 } }}
            />
          </div>
        </div>

        {/* ─── Nav ─── */}
        <div className="s5-nav">
          <button className="step-btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Volver
          </button>

          {isFormDisabled ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="step-btn-back" onClick={() => handleVerDocumento('desglose')}>
                <Eye size={14} /> Desglose
              </button>
              <button className="step-btn-next" onClick={() => handleVerDocumento('propuesta')}>
                <Eye size={14} /> Propuesta
              </button>
            </div>
          ) : (
            <div className="s5-finalize-group">
              <button
                className="s5-btn-final s5-btn-final--main"
                onClick={() => handleFinalizar('propuesta')}
                disabled={loading}
              >
                <Send size={14} /> {loading ? 'Guardando...' : 'Finalizar y Ver Propuesta'}
              </button>
              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                <Menu.Target>
                  <button className="s5-btn-final s5-btn-final--drop" disabled={loading}>
                    <ChevronDown size={16} />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<FileDown size={14} />} onClick={() => handleFinalizar('desglose')}>
                    Guardar y Descargar Desglose
                  </Menu.Item>
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