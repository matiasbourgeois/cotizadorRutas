
import { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { useForm } from "@mantine/form";
import {
  NumberInput, Textarea, Button, Group, Text, Menu, TextInput, rem, Slider
} from "@mantine/core";
import { ArrowLeft, Send, ChevronDown, FileDown, Eye, Settings, Building, DollarSign } from "lucide-react";
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
      costoPeajes: 0,
      costoAdministrativo: 10,
      otrosCostos: 0,
      porcentajeGanancia: 15,
      cliente: "",
      terminos: "Para aprobar esta propuesta, por favor, responda a este correo electrónico. La cotización tiene una validez de 15 días."
    },
  });

  const [loading, setLoading] = useState(false);
  const [presupuestoGuardadoId, setPresupuestoGuardadoId] = useState(null);
  const isFormDisabled = !!presupuestoGuardadoId;

  useEffect(() => {
    if (!puntosEntrega || !frecuencia || !vehiculo || !recursoHumano) return;
    const debounceCalc = setTimeout(() => {
      const payload = { puntosEntrega, frecuencia, vehiculo, recursoHumano, configuracion: form.values, detallesCarga };
      clienteAxios.post('/presupuestos/calcular', payload)
        .then(response => {
          setResumenCostos(response.data.resumenCostos);
          setDetalleVehiculo(response.data.detalleVehiculo);
          setDetalleRecurso(response.data.detalleRecurso);
        })
        .catch(error => console.error("Error en el cálculo:", error));
    }, 300);
    return () => clearTimeout(debounceCalc);
  }, [form.values, puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setResumenCostos, setDetalleVehiculo, setDetalleRecurso]);

  const handleFinalizar = async (tipoAccion = 'propuesta') => {
    if (!resumenCostos) {
      notifications.show({ title: 'Error', message: 'No hay presupuesto calculado.', color: 'red' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        puntosEntrega: puntosEntrega.puntos,
        totalKilometros: puntosEntrega.distanciaKm,
        duracionMin: puntosEntrega.duracionMin,
        frecuencia,
        vehiculo: { datos: vehiculo, calculo: detalleVehiculo },
        recursoHumano: { datos: recursoHumano, calculo: detalleRecurso },
        configuracion: form.values, detallesCarga,
        resumenCostos, cliente: form.values.cliente, terminos: form.values.terminos
      };
      const { data: presupuestoGuardado } = await clienteAxios.post('/presupuestos', payload);
      notifications.show({ title: '¡Éxito!', message: 'Cotización guardada.', color: 'green' });
      setPresupuestoGuardadoId(presupuestoGuardado._id);
      window.open(`/${tipoAccion === 'propuesta' ? 'propuesta' : 'desglose'}/${presupuestoGuardado._id}`, '_blank');
    } catch (error) {
      console.error("Error al finalizar:", error);
      notifications.show({ title: 'Error', message: 'No se pudo guardar.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerDocumento = (tipo) => {
    if (presupuestoGuardadoId) window.open(`/${tipo}/${presupuestoGuardadoId}`, '_blank');
  };

  return (
    <div className="step-grid step-grid--main-side">
      {/* ─── Main ─── */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--amber">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="step-header-title">Ajustes Finales</h2>
              <p className="step-header-subtitle">Define rentabilidad y datos del cliente</p>
            </div>
          </div>
        </div>

        <div className="step-content">
          {/* Sliders */}
          <div className="step-section-label">
            <DollarSign size={12} />
            <span>Márgenes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <Text size="sm" fw={600} mb={4}>Ganancia: {form.values.porcentajeGanancia}%</Text>
              <Slider
                color="cyan"
                marks={[{ value: 10 }, { value: 15 }, { value: 20 }, { value: 25 }, { value: 30 }]}
                {...form.getInputProps('porcentajeGanancia')}
                disabled={isFormDisabled}
              />
            </div>

            <div>
              <Text size="sm" fw={600} mb={4}>Administrativos: {form.values.costoAdministrativo}%</Text>
              <Slider
                color="gray"
                marks={[{ value: 5 }, { value: 10 }, { value: 15 }]}
                {...form.getInputProps('costoAdministrativo')}
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="step-section-label"><span>Costos Adicionales</span></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <NumberInput
              label="Peajes y tasas"
              description="Por viaje"
              prefix="$ "
              size="sm"
              {...form.getInputProps('costoPeajes')}
              disabled={isFormDisabled}
            />
            <NumberInput
              label="Otros costos"
              description="Gastos no contemplados"
              prefix="$ "
              size="sm"
              {...form.getInputProps('otrosCostos')}
              disabled={isFormDisabled}
            />
          </div>

          <div className="step-section-label">
            <Building size={12} />
            <span>Cliente</span>
          </div>

          <TextInput
            placeholder="Nombre del destinatario de la propuesta"
            size="sm"
            {...form.getInputProps('cliente')}
            disabled={isFormDisabled}
          />

          <Textarea
            label="Términos y Próximos Pasos"
            autosize
            minRows={2}
            maxRows={3}
            size="sm"
            {...form.getInputProps('terminos')}
            disabled={isFormDisabled}
          />
        </div>

        <div className="step-nav">
          <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
            Volver
          </Button>

          {isFormDisabled ? (
            <Group>
              <Button variant="light" color="blue" onClick={() => handleVerDocumento('desglose')} leftSection={<Eye size={16} />} size="sm">
                Desglose
              </Button>
              <Button onClick={() => handleVerDocumento('propuesta')} leftSection={<Eye size={16} />} size="sm">
                Propuesta
              </Button>
            </Group>
          ) : (
            <Group gap={0}>
              <Button
                size="md"
                onClick={() => handleFinalizar('propuesta')}
                loading={loading}
                leftSection={<Send size={16} />}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                Finalizar y Ver Propuesta
              </Button>
              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                <Menu.Target>
                  <Button
                    size="md"
                    loading={loading}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: rem(8), paddingRight: rem(8) }}
                  >
                    <ChevronDown size={18} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<FileDown size={16} />} onClick={() => handleFinalizar('desglose')}>
                    Guardar y Descargar Desglose
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </div>
      </div>

      {/* ─── Sidebar ─── */}
      <div><ResumenPaso /></div>
    </div>
  );
};

export default ConfiguracionPresupuestoPaso;