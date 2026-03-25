import { useState } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import { MapPin, Calendar, Truck, User, AlertCircle, Clock, Route, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../styles/ResumenPaso.css';

const fmt = (n) => '$' + (Number(n) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });

const Kpi = ({ icon: Icon, label, value }) => (
  <div className="rp-kpi">
    <div className="rp-kpi-icon"><Icon size={12} /></div>
    <div className="rp-kpi-text">
      <div className="rp-kpi-label">{label}</div>
      <div className="rp-kpi-value">{value}</div>
    </div>
  </div>
);

const RowItem = ({ label, valor }) => (
  <div className="rp-cost-row">
    <span className="rp-cost-row-label">{label}</span>
    <span className="rp-cost-row-val">{fmt(valor)}</span>
  </div>
);

const ResumenPaso = () => {
  const { puntosEntrega, frecuencia, vehiculo, recursoHumano, detalleVehiculo, detalleRecurso, resumenCostos } = useCotizacion();
  const location = useLocation();
  const esPasoFinal = /configuracion/i.test(location.pathname);
  const [openCard, setOpenCard] = useState(null);

  if (!puntosEntrega) {
    return (
      <div className="rp rp--empty">
        <div className="step-empty-icon"><AlertCircle size={20} /></div>
        <h4 className="rp-empty-title">Sin datos</h4>
        <p className="rp-empty-sub">Define una ruta para activar el panel</p>
      </div>
    );
  }

  const distanciaPorViaje = Number(puntosEntrega.distanciaKm) || 0;
  const duracionPorViaje = Number(puntosEntrega.duracionMin) || 0;

  let frecuenciaTexto = 'Pendiente';
  let kmsTotales = distanciaPorViaje;
  if (frecuencia) {
    if (frecuencia.tipo === 'esporadico') {
      const vueltas = Number(frecuencia.vueltasTotales) || 1;
      frecuenciaTexto = `${vueltas} viaje(s)`;
      kmsTotales *= vueltas;
    } else {
      const vm = (frecuencia.diasSeleccionados?.length || 0) * (Number(frecuencia.viajesPorDia) || 1) * 4.33;
      frecuenciaTexto = `~${vm.toFixed(0)}/mes`;
      kmsTotales *= vm;
    }
  }

  const { totalVehiculo = 0, totalRecurso = 0, totalOperativo = 0, totalFinal = 0 } = resumenCostos || {};
  const pctV = totalOperativo > 0 ? (totalVehiculo / totalOperativo) * 100 : 0;
  const pctR = totalOperativo > 0 ? (totalRecurso / totalOperativo) * 100 : 0;

  const toggleCard = (key) => setOpenCard(openCard === key ? null : key);

  return (
    <div className="rp">
      {/* ─── Header ─── */}
      <div className="rp-header">
        <h3 className="rp-title">Resumen Operativo</h3>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="rp-kpi-strip">
        <Kpi icon={MapPin} label="Distancia" value={`${distanciaPorViaje.toFixed(1)} km`} />
        <Kpi icon={Clock} label="Duración" value={`${duracionPorViaje} min`} />
        <Kpi icon={Calendar} label="Frecuencia" value={frecuenciaTexto} />
        <Kpi icon={Route} label="KM Total" value={`${kmsTotales.toFixed(0)} km`} />
      </div>

      <div className="rp-divider" />

      {/* ─── Cost Cards ─── */}
      <div className="rp-costs">
        {/* Vehículo */}
        {frecuencia && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="rp-cost" onClick={() => vehiculo && toggleCard('vehiculo')}>
              {/* Row 1: icon + price */}
              <div className="rp-cost-header">
                <div className="rp-cost-left-icon"><Truck size={13} /></div>
                <div className="rp-cost-right">
                  <span className="rp-cost-amount">{fmt(detalleVehiculo?.totalFinal)}</span>
                  {vehiculo && <ChevronDown size={14} className={`rp-cost-chevron ${openCard === 'vehiculo' ? 'rp-cost-chevron--open' : ''}`} />}
                </div>
              </div>
              {/* Row 2-3: name + meta */}
              {vehiculo && (
                <div className="rp-cost-info">
                  <div className="rp-cost-name">{vehiculo.marca} {vehiculo.modelo}</div>
                  <div className="rp-cost-meta">
                    <span className="rp-cost-tag">{vehiculo.tipoVehiculo}</span>
                    <span>·</span>
                    <span>{vehiculo.patente}</span>
                  </div>
                </div>
              )}
              {/* Dropdown detail */}
              <AnimatePresence>
                {openCard === 'vehiculo' && (
                  <motion.div key="veh-det" className="rp-cost-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                    <div className="rp-divider" style={{ margin: '6px 0 4px' }} />
                    <RowItem label="Combustible" valor={detalleVehiculo?.detalle?.combustible} />
                    <RowItem label="Cubiertas" valor={detalleVehiculo?.detalle?.cubiertas} />
                    <RowItem label="Aceite" valor={detalleVehiculo?.detalle?.aceite} />
                    <RowItem label="Depreciación" valor={detalleVehiculo?.detalle?.depreciacion} />
                    <RowItem label="Costos Fijos" valor={detalleVehiculo?.detalle?.costosFijosProrrateados} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RRHH */}
        {vehiculo && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
            <div className="rp-cost" onClick={() => recursoHumano && toggleCard('recurso')}>
              {/* Row 1: icon + price */}
              <div className="rp-cost-header">
                <div className="rp-cost-left-icon"><User size={13} /></div>
                <div className="rp-cost-right">
                  <span className="rp-cost-amount">{fmt(detalleRecurso?.totalFinal)}</span>
                  {recursoHumano && <ChevronDown size={14} className={`rp-cost-chevron ${openCard === 'recurso' ? 'rp-cost-chevron--open' : ''}`} />}
                </div>
              </div>
              {/* Row 2-3: name + meta */}
              {recursoHumano && (
                <div className="rp-cost-info">
                  <div className="rp-cost-name">{recursoHumano.nombre}</div>
                  <div className="rp-cost-meta">
                    <span className="rp-cost-tag">{recursoHumano.tipoContratacion}</span>
                    <span>·</span>
                    <span>DNI {recursoHumano.dni || '—'}</span>
                  </div>
                </div>
              )}
              {/* Dropdown detail */}
              <AnimatePresence>
                {openCard === 'recurso' && (
                  <motion.div key="rrhh-det" className="rp-cost-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                    <div className="rp-divider" style={{ margin: '6px 0 4px' }} />
                    <RowItem label="Sueldo Base" valor={detalleRecurso?.detalle?.costoBaseRemunerativo} />
                    <RowItem label="Adicional por Km" valor={detalleRecurso?.detalle?.adicionalKm} />
                    <RowItem label="Carga / Descarga" valor={detalleRecurso?.detalle?.adicionalPorCargaDescarga} />
                    <RowItem label="Viáticos por Km" valor={detalleRecurso?.detalle?.viaticoKm} />
                    <RowItem label="Adicional Fijo NR" valor={detalleRecurso?.detalle?.adicionalFijoNoRemunerativo} />
                    <RowItem label={detalleRecurso?.detalle?.costoIndirectoLabel || 'Costos Indirectos'} valor={detalleRecurso?.detalle?.costoIndirecto} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── Spacer ─── */}
      <div className="rp-spacer" />

      {/* ─── Bottom summary — Step 5 only ─── */}
      {esPasoFinal && resumenCostos && (
        <div className="rp-summary">
          <div className="rp-progress">
            <div className="rp-progress-seg rp-progress-seg--vehicle" style={{ width: `${pctV}%` }} />
            <div className="rp-progress-seg rp-progress-seg--rrhh" style={{ width: `${pctR}%` }} />
            <div className="rp-progress-seg rp-progress-seg--other" style={{ width: `${100 - pctV - pctR}%` }} />
          </div>
          <div className="rp-progress-legend">
            <span className="rp-progress-label rp-progress-label--vehicle">Vehículo {pctV.toFixed(0)}%</span>
            <span className="rp-progress-label rp-progress-label--rrhh">RRHH {pctR.toFixed(0)}%</span>
            <span className="rp-progress-label rp-progress-label--other">Otros {(100 - pctV - pctR).toFixed(0)}%</span>
          </div>
          <div className="rp-op-cost">
            <span className="rp-op-cost-label">Costo Operativo</span>
            <span className="rp-op-cost-value">{fmt(totalOperativo)}</span>
          </div>
          <div className="rp-price">
            <div>
              <div className="rp-price-label">Precio Venta</div>
              <div className="rp-price-sub">sin IVA</div>
            </div>
            <div className="rp-price-value">{fmt(totalFinal)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenPaso;
