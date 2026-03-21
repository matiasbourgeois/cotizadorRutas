import { useMemo, useState } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
import { Button, Select, Checkbox } from "@mantine/core";
import { Navigation, MapPinOff, MapPin, Package, Eye } from "lucide-react";
import { notifications } from '@mantine/notifications';
import '../../styles/CotizadorSteps.css';

export default function PuntosEntregaPaso() {
  const navigate = useNavigate();

  const {
    puntosEntrega,
    directionsResult,
    detallesCarga,
    setPuntosEntrega,
    setDetallesCarga,
    setDirectionsResult
  } = useCotizacion();

  const puntos = puntosEntrega?.puntos || [];

  const [datosRuta, setDatosRuta] = useState(
    puntosEntrega?.distanciaKm
      ? { distanciaKm: puntosEntrega.distanciaKm, duracionMin: puntosEntrega.duracionMin }
      : null
  );

  const [isSaving, setIsSaving] = useState(false);
  const [idaVuelta, setIdaVuelta] = useState(false);

  const puntosConRegreso = useMemo(() => {
    if (idaVuelta && puntos.length >= 2) {
      const regreso = { ...puntos[0], isReturn: true };
      return [...puntos, regreso];
    }
    return puntos;
  }, [idaVuelta, puntos]);

  const mapaKey = useMemo(() => {
    return (puntosConRegreso || [])
      .map((p, i) => String(p.id ?? p._id ?? p.nombre ?? (p.isReturn ? "return" : i)))
      .join("|");
  }, [puntosConRegreso]);

  const limpiarRutaGuardada = () => {
    setDatosRuta(null);
    setDirectionsResult(null);
  };
  const agregarPunto = (punto) => {
    if (!punto) return;
    const nuevosPuntos = [...puntos, punto];
    setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
    limpiarRutaGuardada();
  };
  const handleEliminarPunto = (index) => {
    const base = puntos;
    const usandoRegreso = idaVuelta && base.length >= 2;
    if (usandoRegreso && index === base.length) return;
    const nuevosPuntos = base.filter((_, i) => i !== index);
    setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
    limpiarRutaGuardada();
  };
  const handleReordenarPuntos = (nuevosPuntos) => {
    setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
    limpiarRutaGuardada();
  };
  const handleRutaCalculada = (datos) => {
    setDatosRuta(datos.resumen);
    setDirectionsResult(datos.directions);
    setPuntosEntrega({ puntos: puntos, ...datos.resumen });
  };
  const handleCargaChange = (value) => {
    setDetallesCarga({ ...detallesCarga, tipo: value });
  };
  const handleSiguiente = async () => {
    const base = puntos;
    if (base.length < 2) {
      notifications.show({ title: 'Ruta incompleta', message: 'Necesitas al menos 2 puntos para definir una ruta.', color: 'orange' });
      return;
    }
    if (!datosRuta) {
      notifications.show({ title: 'Acción Requerida', message: 'La ruta aún no ha sido calculada en el mapa.', color: 'yellow' });
      return;
    }
    setIsSaving(true);
    try {
      const ordenados = base.map((p, index) => ({ ...p, orden: index }));
      const payload = { puntos: ordenados, distanciaKm: datosRuta.distanciaKm, duracionMin: datosRuta.duracionMin };
      const res = await clienteAxios.post('/rutas', payload);
      setPuntosEntrega({ ...puntosEntrega, ...payload, rutaId: res.data._id });
      setDirectionsResult(directionsResult);
      navigate(`/cotizador/frecuencia/${res.data._id}`);
    } catch (err) {
      console.error("Error al guardar ruta:", err);
      notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la ruta.', color: 'red' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="step-grid step-grid--two-col">
      {/* ─── Left Panel ─── */}
      <div className="step-panel">
        {/* Header */}
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--blue">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="step-header-title">Panel de Ruta</h2>
              <p className="step-header-subtitle">Define los puntos de tu operación</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="step-content">
          <BuscadorDireccion onAgregar={agregarPunto} />

          {puntos.length >= 2 && (
            <Checkbox
              size="sm"
              label="Ida y vuelta (agregar regreso al origen)"
              checked={idaVuelta}
              onChange={(e) => { setIdaVuelta(e.currentTarget.checked); limpiarRutaGuardada(); }}
              color="cyan"
              style={{ alignSelf: 'flex-start' }}
            />
          )}

          <div className="step-section-label">
            <span>Hoja de Ruta</span>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 12, border: '1px solid var(--app-border)' }}>
            <TablaPuntos
              puntos={puntosConRegreso}
              onReordenar={handleReordenarPuntos}
              onEliminar={handleEliminarPunto}
            />
          </div>

          <div className="step-section-label">
            <Package size={12} />
            <span>Inteligencia de Carga</span>
          </div>

          <Select
            size="sm"
            label="Tipo de Carga"
            description="Afecta los cálculos de costos."
            value={detallesCarga.tipo}
            onChange={handleCargaChange}
            data={[
              { value: 'general', label: 'Carga General' },
              { value: 'refrigerada', label: 'Carga Refrigerada' },
              { value: 'peligrosa', label: 'Carga Peligrosa' }
            ]}
          />
        </div>

        {/* Nav */}
        <div className="step-nav">
          <div />
          <Button
            size="md"
            onClick={handleSiguiente}
            disabled={!datosRuta || isSaving || puntos.length < 2}
            loading={isSaving}
            rightSection={<Navigation size={18} />}
          >
            Siguiente: Frecuencia
          </Button>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--cyan">
              <Eye size={20} />
            </div>
            <div>
              <h2 className="step-header-title">Visualizador de Misión</h2>
              <p className="step-header-subtitle">Vista previa del recorrido</p>
            </div>
          </div>
        </div>

        <div className="step-content">
          <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--app-border)', minHeight: 0 }}>
            {puntosConRegreso.length > 0 ? (
              <MapaRuta
                key={mapaKey}
                puntos={puntosConRegreso}
                initialDirections={directionsResult}
                onRutaCalculada={handleRutaCalculada}
              />
            ) : (
              <div className="step-empty" style={{ height: '100%', background: 'var(--app-surface-hover)' }}>
                <div className="step-empty-icon">
                  <MapPinOff size={28} />
                </div>
                <h4>Sin puntos definidos</h4>
                <p>Agrega puntos en el Panel de Ruta para visualizar el mapa.</p>
              </div>
            )}
          </div>
          {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}
        </div>
      </div>
    </div>
  );
}
