import { useMemo, useState } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import { MapPin, Calendar, Truck, User, AlertCircle, Clock, Route, ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../styles/CotizadorSteps.css';

/* ─── Styles (inline for sidebar-specific elements) ─── */
const styles = {
  shell: {
    display: 'flex', flexDirection: 'column', gap: 10, height: '100%',
    background: 'var(--app-surface)', border: '1px solid var(--app-border)',
    borderRadius: 14, padding: '14px 16px', overflow: 'hidden', position: 'relative',
  },
  shimmer: {
    position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
    background: 'linear-gradient(170deg, rgba(34,211,238,0.03) 0%, transparent 40%, rgba(139,92,246,0.03) 100%)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
  },
  title: {
    fontSize: '1.05rem', fontWeight: 800, color: 'var(--app-text)', margin: 0,
  },
  badge: {
    fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
    padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4,
  },
  kpiGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0,
  },
  kpi: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8,
    border: '1px solid var(--app-border)', background: 'transparent',
  },
  kpiIcon: {
    width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--app-surface-hover)', color: 'var(--app-text-muted)', flexShrink: 0,
  },
  kpiLabel: { fontSize: '0.68rem', color: 'var(--app-text-muted)', lineHeight: 1 },
  kpiValue: { fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee', lineHeight: 1.2 },
  costCard: {
    borderRadius: 10, border: '1px solid var(--app-border)', padding: '10px 12px', cursor: 'pointer',
    transition: 'border-color 0.2s', flexShrink: 0,
  },
  costRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' },
  divider: { height: 1, background: 'var(--app-border)', margin: '4px 0', flexShrink: 0 },
  priceCard: {
    borderRadius: 10, padding: '10px 14px',
    background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(6,182,212,0.06))',
    border: '1px solid rgba(34,211,238,0.25)', flexShrink: 0,
  },
  priceLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--app-text-muted)' },
  priceValue: { fontSize: '1.6rem', fontWeight: 900, color: '#22d3ee', lineHeight: 1 },
};

const Kpi = ({ icon: Icon, label, value }) => (
  <div style={styles.kpi}>
    <div style={styles.kpiIcon}><Icon size={14} /></div>
    <div>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  </div>
);

const CostCard = ({ icon: Icon, title, selection, cost, children, color, open, onToggle }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
    <div style={{ ...styles.costCard, borderColor: open ? 'rgba(34,211,238,0.3)' : 'var(--app-border)' }} onClick={() => selection && onToggle?.()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ ...styles.kpiIcon, background: `${color}20`, color }}><Icon size={14} /></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--app-text)' }}>{title}</span>
          {selection && <span style={{ fontSize: '0.68rem', color: 'var(--app-text-muted)', background: 'var(--app-surface-hover)', padding: '1px 6px', borderRadius: 8, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selection}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#22d3ee' }}>
            ${(Number(cost) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
          </span>
          {selection && <ChevronDown size={14} color="var(--app-text-muted)" style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform .15s' }} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div key="detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
            <div style={styles.divider} />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

const RowItem = ({ label, valor }) => (
  <div style={styles.costRow}>
    <span style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)' }}>{label}</span>
    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--app-text)' }}>
      ${(Number(valor) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
    </span>
  </div>
);

const ResumenPaso = () => {
  const { puntosEntrega, frecuencia, vehiculo, recursoHumano, detalleVehiculo, detalleRecurso, resumenCostos } = useCotizacion();
  const location = useLocation();
  const esPasoFinal = /configuracion/i.test(location.pathname);
  const [openCard, setOpenCard] = useState(null);

  if (!puntosEntrega) {
    return (
      <div style={{ ...styles.shell, alignItems: 'center', justifyContent: 'center' }}>
        <div style={styles.shimmer} />
        <div className="step-empty-icon"><AlertCircle size={20} /></div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '4px 0 2px' }}>Sin datos</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)', margin: 0, textAlign: 'center' }}>Define una ruta para activar el panel</p>
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
  const totalOtros = Math.max(0, totalOperativo - totalVehiculo - totalRecurso);
  const pctV = totalOperativo > 0 ? (totalVehiculo / totalOperativo) * 100 : 0;
  const pctR = totalOperativo > 0 ? (totalRecurso / totalOperativo) * 100 : 0;

  return (
    <div style={styles.shell}>
      <div style={styles.shimmer} />

      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Resumen Operativo</h3>
        <span style={{ ...styles.badge, background: frecuencia ? 'rgba(34,211,238,0.12)' : 'rgba(128,128,128,0.12)', color: frecuencia ? '#22d3ee' : 'var(--app-text-muted)' }}>
          <Zap size={10} />{frecuencia ? 'ACTIVO' : 'PENDIENTE'}
        </span>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <Kpi icon={MapPin} label="Distancia" value={`${distanciaPorViaje.toFixed(1)} km`} />
        <Kpi icon={Clock} label="Duración" value={`${duracionPorViaje} min`} />
        <Kpi icon={Calendar} label="Frecuencia" value={frecuenciaTexto} />
        <Kpi icon={Route} label="KM Total" value={`${kmsTotales.toFixed(0)} km`} />
      </div>

      <div style={styles.divider} />

      {/* Cost Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0, overflow: 'auto' }}>
        {frecuencia && (
          <CostCard icon={Truck} title="Vehículo" selection={vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : null}
            cost={detalleVehiculo?.totalFinal} color="#22d3ee"
            open={openCard === 'vehiculo'} onToggle={() => setOpenCard(openCard === 'vehiculo' ? null : 'vehiculo')}>
            <RowItem label="Combustible + Desgaste" valor={(detalleVehiculo?.detalle?.combustible || 0) + (detalleVehiculo?.detalle?.cubiertas || 0) + (detalleVehiculo?.detalle?.aceite || 0)} />
            <RowItem label="Depreciación" valor={detalleVehiculo?.detalle?.depreciacion} />
            <RowItem label="Costos Fijos" valor={detalleVehiculo?.detalle?.costosFijosProrrateados} />
          </CostCard>
        )}

        {vehiculo && (
          <CostCard icon={User} title="RRHH" selection={recursoHumano?.nombre}
            cost={detalleRecurso?.totalFinal} color="#3b82f6"
            open={openCard === 'recurso'} onToggle={() => setOpenCard(openCard === 'recurso' ? null : 'recurso')}>
            <RowItem label="Base + Adicionales" valor={(detalleRecurso?.detalle?.costoBaseRemunerativo || 0) + (detalleRecurso?.detalle?.adicionalKm || 0) + (detalleRecurso?.detalle?.adicionalPorCargaDescarga || 0)} />
            <RowItem label="Viáticos" valor={(detalleRecurso?.detalle?.viaticoKm || 0) + (detalleRecurso?.detalle?.adicionalFijoNoRemunerativo || 0)} />
            <RowItem label={detalleRecurso?.detalle?.costoIndirectoLabel || 'Costos Indirectos'} valor={detalleRecurso?.detalle?.costoIndirecto} />
          </CostCard>
        )}
      </div>

      {/* Final Summary (Step 5 only) */}
      {esPasoFinal && resumenCostos && (
        <>
          <div style={styles.divider} />

          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', background: 'var(--app-surface-hover)', flexShrink: 0 }}>
            <div style={{ width: `${pctV}%`, background: '#22d3ee', transition: 'width 0.3s' }} />
            <div style={{ width: `${pctR}%`, background: '#3b82f6', transition: 'width 0.3s' }} />
            <div style={{ width: `${100 - pctV - pctR}%`, background: '#8b5cf6', transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.68rem', color: '#22d3ee' }}>Vehículo {pctV.toFixed(0)}%</span>
            <span style={{ fontSize: '0.68rem', color: '#3b82f6' }}>RRHH {pctR.toFixed(0)}%</span>
            <span style={{ fontSize: '0.68rem', color: '#8b5cf6' }}>Otros {(100 - pctV - pctR).toFixed(0)}%</span>
          </div>

          {/* Operative Cost */}
          <div style={{ ...styles.costRow, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--app-border)', flexShrink: 0 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--app-text-muted)' }}>Costo Operativo</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--app-text)' }}>${(totalOperativo || 0).toLocaleString('es-AR')}</span>
          </div>

          {/* Sale Price */}
          <div style={styles.priceCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#22d3ee' }}>Precio Venta</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--app-text-muted)' }}>sin IVA</div>
              </div>
              <div style={styles.priceValue}>${(totalFinal || 0).toLocaleString('es-AR')}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumenPaso;
