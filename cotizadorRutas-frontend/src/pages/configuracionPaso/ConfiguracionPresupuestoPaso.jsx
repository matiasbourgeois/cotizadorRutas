import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import { NumberInput, Textarea, TextInput, Slider, Menu, rem } from "@mantine/core";
import { ArrowLeft, Send, ChevronDown, FileDown, Eye, Building, DollarSign, Percent, Receipt } from "lucide-react";
import ResumenPaso from "../../components/ResumenPaso";
import '../../styles/CotizadorSteps.css';

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
  }, [form.values, puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setResumenCostos, setDetalleVehiculo, setDetalleRecurso]);

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

  return (
    <div className="step-grid step-grid--main-side">
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--amber"><Receipt size={18} /></div>
            <div>
              <h2 className="step-header-title">Ajustes Finales</h2>
              <p className="step-header-subtitle">Define rentabilidad y datos del cliente</p>
            </div>
          </div>
        </div>

        <div className="step-content" style={{ overflowY: 'auto' }}>
          {/* Margins */}
          <div className="step-section-label"><Percent size={10} /><span>Márgenes</span></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--app-border)', background: 'var(--app-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--app-text)' }}>Ganancia</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#22d3ee' }}>{form.values.porcentajeGanancia}%</span>
              </div>
              <Slider color="cyan" size="sm" marks={[{ value: 10 }, { value: 20 }, { value: 30 }]} {...form.getInputProps('porcentajeGanancia')} disabled={isFormDisabled} />
            </div>

            <div style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--app-border)', background: 'var(--app-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--app-text)' }}>Administrativos</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--app-text-muted)' }}>{form.values.costoAdministrativo}%</span>
              </div>
              <Slider color="gray" size="sm" marks={[{ value: 5 }, { value: 10 }, { value: 15 }]} {...form.getInputProps('costoAdministrativo')} disabled={isFormDisabled} />
            </div>
          </div>

          {/* Costs */}
          <div className="step-section-label"><DollarSign size={10} /><span>Costos Adicionales</span></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <NumberInput label="Peajes" prefix="$ " size="xs" {...form.getInputProps('costoPeajes')} disabled={isFormDisabled} />
            <NumberInput label="Otros costos" prefix="$ " size="xs" {...form.getInputProps('otrosCostos')} disabled={isFormDisabled} />
          </div>

          {/* Client */}
          <div className="step-section-label"><Building size={10} /><span>Cliente</span></div>

          <TextInput placeholder="Nombre del destinatario" size="xs" {...form.getInputProps('cliente')} disabled={isFormDisabled} />

          <Textarea placeholder="Términos y próximos pasos..." autosize minRows={2} maxRows={2} size="xs" {...form.getInputProps('terminos')} disabled={isFormDisabled} />
        </div>

        <div className="step-nav">
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
            <div style={{ display: 'flex', gap: 0 }}>
              <button
                className="step-btn-finalize"
                onClick={() => handleFinalizar('propuesta')}
                disabled={loading}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                <Send size={14} /> {loading ? '...' : 'Finalizar y Ver Propuesta'}
              </button>
              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                <Menu.Target>
                  <button
                    className="step-btn-finalize"
                    disabled={loading}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: rem(8), paddingRight: rem(8), borderLeft: '1px solid rgba(255,255,255,0.2)' }}
                  >
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

      <div><ResumenPaso /></div>
    </div>
  );
};

export default ConfiguracionPresupuestoPaso;