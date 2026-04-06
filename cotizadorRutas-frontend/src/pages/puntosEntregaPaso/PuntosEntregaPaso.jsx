import { useMemo, useState } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../api/clienteAxios";
import { useCotizacion } from "../../context/Cotizacion";
import { Select, Checkbox } from "@mantine/core";
import { MapPinOff, MapPin, Package, Eye, Clock, ArrowRight } from "lucide-react";
import { notifications } from '@mantine/notifications';
import '../../styles/CotizadorSteps.css';

export default function PuntosEntregaPaso() {
  const navigate = useNavigate();

  const {
    puntosEntrega, directionsResult, detallesCarga, opcionesRuta,
    setPuntosEntrega, setDetallesCarga, setDirectionsResult, setOpcionesRuta
  } = useCotizacion();

  const puntos = puntosEntrega?.puntos || [];

  const [datosRuta, setDatosRuta] = useState(
    puntosEntrega?.distanciaKm
      ? { distanciaKm: puntosEntrega.distanciaKm, duracionMin: puntosEntrega.duracionMin }
      : null
  );

  const [isSaving, setIsSaving] = useState(false);
  const idaVuelta = opcionesRuta?.idaVuelta || false;
  const optimizar = opcionesRuta?.optimizar || false;

  const puntosConRegreso = useMemo(() => {
    if (idaVuelta && puntos.length >= 2) {
      const regreso = { ...puntos[0], isReturn: true };
      return [...puntos, regreso];
    }
    return puntos;
  }, [idaVuelta, puntos]);

  const limpiarRutaGuardada = () => { setDatosRuta(null); setDirectionsResult(null); };
  const agregarPunto = (punto) => {
    if (!punto) return;
    setPuntosEntrega({ ...puntosEntrega, puntos: [...puntos, punto] });
    limpiarRutaGuardada();
  };
  const handleEliminarPunto = (index) => {
    const base = puntos;
    const usandoRegreso = idaVuelta && base.length >= 2;
    if (usandoRegreso && index === base.length) return;
    setPuntosEntrega({ ...puntosEntrega, puntos: base.filter((_, i) => i !== index) });
    limpiarRutaGuardada();
  };
  const handleReordenarPuntos = (nuevosPuntos) => {
    setPuntosEntrega({ ...puntosEntrega, puntos: nuevosPuntos });
    limpiarRutaGuardada();
  };
  const handleRutaCalculada = (datos) => {
    setDatosRuta(datos.resumen);
    setDirectionsResult(datos.directions);

    let puntosFinales = puntos;
    if (datos.waypointOrder && datos.waypointOrder.length > 0 && optimizar) {
      const origen = puntos[0];
      const todosLosOtros = puntos.slice(1);
      const reordenados = datos.waypointOrder.map(i => todosLosOtros[i]);
      puntosFinales = [origen, ...reordenados];
    }
    setPuntosEntrega({ ...puntosEntrega, puntos: puntosFinales, ...datos.resumen });
  };
  const handleCargaChange = (value) => { setDetallesCarga({ ...detallesCarga, tipo: value }); };
  const handleSiguiente = async () => {
    if (puntos.length < 2) {
      notifications.show({ title: 'Ruta incompleta', message: 'Necesitas al menos 2 puntos.', color: 'orange' });
      return;
    }
    if (!datosRuta) {
      notifications.show({ title: 'Acción Requerida', message: 'La ruta aún no ha sido calculada.', color: 'yellow' });
      return;
    }
    setIsSaving(true);
    try {
      const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
      const payload = { puntos: ordenados, distanciaKm: datosRuta.distanciaKm, duracionMin: datosRuta.duracionMin };
      const res = await clienteAxios.post('/rutas', payload);
      setPuntosEntrega({ ...puntosEntrega, ...payload, rutaId: res.data._id });
      navigate(`/cotizador/frecuencia/${res.data._id}`);
    } catch (err) {
      console.error("Error al guardar ruta:", err);
      notifications.show({ title: 'Error', message: 'No se pudo guardar la ruta.', color: 'red' });
    } finally { setIsSaving(false); }
  };

  return (
    <div className="step-grid step-grid--two-col">
      {/* LEFT PANEL */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--blue"><MapPin size={18} /></div>
            <div>
              <h2 className="step-header-title">Panel de Ruta</h2>
              <p className="step-header-subtitle">Define los puntos de tu operación</p>
            </div>
          </div>
        </div>

        <div className="step-content">
          <BuscadorDireccion onAgregar={agregarPunto} />

          {puntos.length >= 2 && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Checkbox
                size="xs"
                label="Ida y vuelta (regreso al origen)"
                checked={idaVuelta}
                onChange={(e) => { setOpcionesRuta({ idaVuelta: e.currentTarget.checked }); limpiarRutaGuardada(); }}
                color="cyan"
              />
              {puntos.length >= 3 && (
                <Checkbox
                  size="xs"
                  label="Optimizar recorrido"
                  checked={optimizar}
                  onChange={(e) => { setOpcionesRuta({ optimizar: e.currentTarget.checked }); limpiarRutaGuardada(); }}
                  color="teal"
                />
              )}
            </div>
          )}

          <div className="step-section-label"><span>Hoja de Ruta</span></div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderRadius: 10, border: '1px solid var(--app-border)' }}>
            <TablaPuntos puntos={puntosConRegreso} onReordenar={handleReordenarPuntos} onEliminar={handleEliminarPunto} />
          </div>

          <div className="step-section-label"><Package size={10} /><span>Tipo de Carga</span></div>

          <Select
            size="xs"
            value={detallesCarga.tipo}
            onChange={handleCargaChange}
            data={[
              { value: 'general', label: 'Carga General' },
              { value: 'refrigerada', label: 'Carga Refrigerada' },
              { value: 'peligrosa', label: 'Carga Peligrosa' }
            ]}
          />
        </div>

        <div className="step-nav">
          <div />
          <button
            className="step-btn-next"
            onClick={handleSiguiente}
            disabled={!datosRuta || isSaving || puntos.length < 2}
          >
            {isSaving ? '...' : 'Siguiente: Frecuencia'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="step-panel">
        <div className="step-header">
          <div className="step-header-left">
            <div className="step-header-icon step-header-icon--cyan"><Eye size={18} /></div>
            <div>
              <h2 className="step-header-title">Visualizador de Ruta</h2>
              <p className="step-header-subtitle">Vista previa del recorrido</p>
            </div>
          </div>
        </div>

        <div className="step-content">
          <div style={{ flex: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--app-border)', minHeight: 0 }}>
            {puntosConRegreso.length > 0 ? (
              <MapaRuta
                puntos={puntosConRegreso}
                initialDirections={directionsResult}
                onRutaCalculada={handleRutaCalculada}
                optimizar={optimizar}
                idaVuelta={idaVuelta}
              />
            ) : (
              <div className="step-empty" style={{ height: '100%', background: 'var(--app-surface-hover)' }}>
                <div className="step-empty-icon"><MapPinOff size={24} /></div>
                <h4>Sin puntos definidos</h4>
                <p>Agrega puntos para visualizar el mapa</p>
              </div>
            )}
          </div>

          {/* Route KPI inline strip */}
          {datosRuta && (
            <div className="step-route-kpi">
              <div className="step-route-kpi-item">
                <div className="step-route-kpi-icon"><MapPin size={16} /></div>
                <div>
                  <div className="step-route-kpi-label">Distancia</div>
                  <div className="step-route-kpi-value">{datosRuta.distanciaKm} km</div>
                </div>
              </div>
              <div className="step-route-kpi-item">
                <div className="step-route-kpi-icon"><Clock size={16} /></div>
                <div>
                  <div className="step-route-kpi-label">Duración</div>
                  <div className="step-route-kpi-value">{datosRuta.duracionMin} min</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
