
import { useState, useEffect } from "react";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate, useParams } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import { NumberInput, Button, Textarea } from "@mantine/core";
import { Calendar, Repeat, MessageSquare, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { notifications } from '@mantine/notifications';
import { motion, AnimatePresence } from "framer-motion";
import ResumenPaso from "../../components/ResumenPaso";
import '../../styles/CotizadorSteps.css';

// ─── Selection Card ───
const SelectionCard = ({ icon: Icon, label, description, selected, ...props }) => (
  <button className={`step-selection-card ${selected ? 'active' : ''}`} type="button" {...props}>
    <div className="step-selection-card-icon">
      <Icon size={22} />
    </div>
    <span className="step-selection-card-label">{label}</span>
    <span className="step-selection-card-desc">{description}</span>
  </button>
);

// ─── Weekday Picker ───
const WeekdayPicker = ({ value, onChange }) => {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const fullDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  return (
    <div className="step-weekday-group">
      {days.map((day, index) => {
        const fullDay = fullDays[index];
        const isSelected = value.includes(fullDay);
        return (
          <button
            key={fullDay}
            type="button"
            className={`step-weekday-pill ${isSelected ? 'active' : ''}`}
            onClick={() => onChange(
              isSelected ? value.filter(d => d !== fullDay) : [...value, fullDay]
            )}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

const FrecuenciaPaso = () => {
  const [tipo, setTipo] = useState("esporadico");
  const [vueltasTotales, setVueltasTotales] = useState(1);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [viajesPorDia, setViajesPorDia] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { frecuencia, setFrecuencia } = useCotizacion();

  useEffect(() => {
    if (frecuencia) {
      setTipo(frecuencia.tipo || 'esporadico');
      setVueltasTotales(frecuencia.vueltasTotales || 1);
      setDiasSeleccionados(frecuencia.diasSeleccionados || []);
      setViajesPorDia(frecuencia.viajesPorDia || 1);
      setObservaciones(frecuencia.observaciones || "");
    }
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    const data = {
      tipo,
      viajesPorDia,
      observaciones,
      vueltasTotales: tipo === 'esporadico' ? vueltasTotales : null,
      diasSeleccionados: tipo === 'mensual' ? diasSeleccionados : [],
      rutaId: idRuta
    };
    try {
      setFrecuencia(data);
      navigate(`/cotizador/vehiculo/${idRuta}`);
    } catch (error) {
      console.error("Error al guardar frecuencia:", error);
      notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la frecuencia.', color: 'red' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="step-grid step-grid--main-side">
      {/* ─── Main Panel ─── */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--violet">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="step-header-title">Frecuencia del Servicio</h2>
              <p className="step-header-subtitle">¿Cuántas veces se repite esta operación?</p>
            </div>
          </div>
        </div>

        <div className="step-content">
          <div className="step-section-label"><span>Tipo de Operación</span></div>

          <div style={{ display: 'flex', gap: 12 }}>
            <SelectionCard
              icon={Repeat} label="Esporádico"
              description="Uno o varios viajes puntuales"
              selected={tipo === 'esporadico'}
              onClick={() => setTipo('esporadico')}
            />
            <SelectionCard
              icon={Calendar} label="Mensual"
              description="Operativa recurrente y fija"
              selected={tipo === 'mensual'}
              onClick={() => setTipo('mensual')}
            />
          </div>

          <AnimatePresence mode="wait">
            {tipo === 'esporadico' && (
              <motion.div
                key="esporadico"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--app-border)', marginTop: 8 }}>
                  <NumberInput
                    label="Cantidad total de viajes a cotizar"
                    value={vueltasTotales}
                    onChange={setVueltasTotales}
                    min={1}
                    allowDecimal={false}
                    allowLeadingZeros={false}
                    size="sm"
                  />
                </div>
              </motion.div>
            )}
            {tipo === 'mensual' && (
              <motion.div
                key="mensual"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--app-border)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="step-section-label"><span>Días de la semana</span></div>
                  <WeekdayPicker value={diasSeleccionados} onChange={setDiasSeleccionados} />
                  <NumberInput
                    label="Vueltas por día seleccionado"
                    value={viajesPorDia}
                    onChange={(val) => setViajesPorDia(val === '' ? '' : Number(val))}
                    min={1}
                    allowDecimal={false}
                    size="sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="step-section-label">
            <MessageSquare size={12} />
            <span>Observaciones</span>
          </div>

          <Textarea
            placeholder="Comentarios sobre la frecuencia, horarios preferidos, etc."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            autosize
            minRows={2}
            maxRows={3}
            size="sm"
          />
        </div>

        <div className="step-nav">
          <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
            Volver
          </Button>
          <Button onClick={handleSubmit} loading={isSaving} rightSection={<ArrowRight size={16} />} size="md">
            Siguiente: Vehículo
          </Button>
        </div>
      </div>

      {/* ─── Sidebar ─── */}
      <div>
        <ResumenPaso />
      </div>
    </div>
  );
};

export default FrecuenciaPaso;