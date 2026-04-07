import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text } from '@mantine/core';
import {
  Printer, Gauge, Clock, Route as RouteIcon,
  Package
} from 'lucide-react';
import './DesglosePage.css';
import ShareFAB from '../../components/ShareFAB';

import CapituloRutaFrecuencia from './partials/CapituloRutaFrecuencia';
import CapituloVehiculoFicha from './partials/CapituloVehiculoFicha';
import CapituloVehiculoCostos from './partials/CapituloVehiculoCostos';
import CapituloRecursoHumanoFicha from './partials/CapituloRecursoHumanoFicha';
import CapituloRecursoHumanoCostos from './partials/CapituloRecursoHumanoCostos';
import CapituloFinalConsolidado from './partials/CapituloFinalConsolidado';

const $ = v => (v || 0).toLocaleString('es-AR');

const DesglosePage = ({ isPublic = false }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (isPublic) {
          const BE = import.meta.env.VITE_API_URL || 'http://localhost:5010';
          const res = await fetch(`${BE}/api/presupuestos/public-desglose/${id}`);
          if (!res.ok) throw new Error('No encontrado');
          setData(await res.json());
        } else {
          const { data: d } = await clienteAxios.get(`/presupuestos/${id}`);
          setData(d);
        }
      } catch(e) { console.error('Error:', e); }
      finally { setLoading(false); }
    })();
  }, [id, isPublic]);

  if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
  if (!data) return <Center h="100vh"><Text>Desglose no encontrado.</Text></Center>;

  const e = data.empresa || {};
  const c1 = e.colorPrimario || '#1e3a5f';
  const c2 = e.colorAcento   || '#0891b2';
  const BE = import.meta.env.VITE_API_URL || 'http://localhost:5010';
  const logo = e.logoUrl ? `${BE}${e.logoUrl}` : '';
  const totalPages = 7;

  const rc = data.resumenCostos;
  const totalOp = rc.totalOperativo || 0;
  const ganancia = rc.ganancia || 0;
  const totalFinal = rc.totalFinal || 0;
  const montoIVA = rc.montoIVA || Math.round(totalFinal * 0.21);
  const totalConIVA = rc.totalConIVA || (totalFinal + montoIVA);
  const pctIVA = rc.porcentajeIVA || 21;
  const rentPct = totalOp > 0 ? ((ganancia / totalOp) * 100).toFixed(1) : '0.0';

  const kmsMens = data.vehiculo?.calculo?.kmsMensuales || 0;
  const totalAdminOtros = (rc.totalAdministrativo || 0) + (rc.otrosCostos || 0) + (rc.totalPeajes || 0);

  // Fixed vs Variable
  const costosFijos = (data.vehiculo?.calculo?.detalle?.costosFijosProrrateados || 0) +
    (data.recursoHumano?.calculo?.detalle?.costoBaseRemunerativo || 0) +
    (data.recursoHumano?.calculo?.detalle?.adicionalFijoNoRemunerativo || 0) +
    totalAdminOtros +
    (data.recursoHumano?.calculo?.detalle?.costoIndirecto || 0);

  const costosVars = (data.vehiculo?.calculo?.detalle?.combustible || 0) +
    (data.vehiculo?.calculo?.detalle?.cubiertas || 0) +
    (data.vehiculo?.calculo?.detalle?.aceite || 0) +
    (data.vehiculo?.calculo?.detalle?.depreciacion || 0) +
    (data.recursoHumano?.calculo?.detalle?.adicionalKm || 0) +
    (data.recursoHumano?.calculo?.detalle?.viaticoKm || 0) +
    (data.recursoHumano?.calculo?.detalle?.adicionalPorCargaDescarga || 0) +
    (rc.costoAdicionalPeligrosa || 0);

  const pctVars = totalOp > 0 ? (costosVars / totalOp * 100) : 0;
  const pctFijos = totalOp > 0 ? (costosFijos / totalOp * 100) : 0;

  // KPIs
  const durMision = (data.duracionMin || 0) + 30;
  const viajes = data.frecuencia.tipo === 'mensual'
    ? ((data.frecuencia.diasSeleccionados?.length || 0) * (data.frecuencia.viajesPorDia || 1) * 4.33)
    : (data.frecuencia.vueltasTotales || 1);
  const hsMens = (durMision * viajes) / 60;
  const costoPorKm = kmsMens > 0 ? (totalOp / kmsMens) : 0;
  const costoPorHr = hsMens > 0 ? (totalOp / hsMens) : 0;

  // Structure %
  const pctVeh = totalOp > 0 ? (rc.totalVehiculo / totalOp * 100) : 0;
  const pctRH  = totalOp > 0 ? (rc.totalRecurso / totalOp * 100) : 0;
  const pctAdm = totalOp > 0 ? (totalAdminOtros / totalOp * 100) : 0;

  const fecha = data.fechaCreacion ? new Date(data.fechaCreacion).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR');

  // ── Shared sub-components ──────────────────
  const Head = () => (
    <div className="dg-head">
      <div className="dg-head-brand">
        {logo && <img src={logo} alt="" className="dg-head-logo" onError={e => e.target.style.display = 'none'} />}
        <div>
          <div className="dg-head-name">{e.nombre || 'Mi Empresa'}</div>
          <div className="dg-head-sub">{e.slogan || 'Transporte y Logística'}</div>
        </div>
      </div>
      <div className="dg-head-badge">DESGLOSE-{data._id?.slice(-4).toUpperCase()}</div>
    </div>
  );

  const Foot = ({ p }) => (
    <div className="dg-foot">
      <div>{e.nombre || 'Mi Empresa'}{e.telefono ? ` · Tel: ${e.telefono}` : ''}{e.email ? ` · ${e.email}` : ''}</div>
      <div>Página {p} de {totalPages}</div>
    </div>
  );

  return (
    <div className="dg-root" style={{ '--c1': c1, '--c2': c2 }}>
      <div className="dg-btn-area">
        <button className="dg-print-btn" onClick={() => window.print()}>
          <Printer size={18} />
          Imprimir / Guardar PDF
        </button>
      </div>

      <ShareFAB shareUrl={`/d/${id}`} cliente={data.cliente} empresa={e.nombre} />

      {/* ━━━ PAGE 1: RESUMEN EJECUTIVO ━━━ */}
      <div className="dg-pg">
        <Head />
        <div className="dg-inner">
          <h1 className="dg-chapter">Informe de Desglose de Costos</h1>
          <p className="dg-chapter-sub">
            Cliente: <strong>{data.cliente || 'No Especificado'}</strong> · Referencia: {data._id?.slice(-6).toUpperCase()} · Fecha: {fecha}
          </p>

          {/* 3 KPI cards */}
          <div className="dg-kpi-row">
            <div className="dg-kpi">
              <div className="dg-kpi-label">Costo Operativo Total</div>
              <div className="dg-kpi-val">${$(totalOp)}</div>
              <div className="dg-kpi-note">Costos mensuales proyectados</div>
            </div>
            {!isPublic && <div className="dg-kpi dg-kpi--accent">
              <div className="dg-kpi-label">Rentabilidad</div>
              <div className="dg-kpi-val">{rentPct}%</div>
              <div className="dg-kpi-note">Margen Bruto: ${$(ganancia)}</div>
            </div>}
            <div className="dg-kpi dg-kpi--dark">
              <div className="dg-kpi-label">Precio de Venta (s/IVA)</div>
              <div className="dg-kpi-val">${$(totalFinal)}</div>
              <div className="dg-kpi-note">Propuesta Final al Cliente</div>
            </div>
            <div className="dg-kpi">
              <div className="dg-kpi-label">Precio con IVA ({pctIVA}%)</div>
              <div className="dg-kpi-val">${$(totalConIVA)}</div>
              <div className="dg-kpi-note">IVA: ${$(montoIVA)}</div>
            </div>
          </div>

          {/* Cost preview table */}
          <h3 className="dg-st">Resumen de Costos por Capítulo</h3>
          <table className="dg-tbl">
            <thead><tr><th>Componente</th><th style={{ textAlign: 'right' }}>Monto</th><th style={{ textAlign: 'right' }}>% del Total</th></tr></thead>
            <tbody>
              <tr><td>🚛 Vehículo ({data.vehiculo?.datos?.marca} {data.vehiculo?.datos?.modelo})</td><td className="dg-tbl-val">${$(rc.totalVehiculo)}</td><td className="dg-tbl-val">{pctVeh.toFixed(1)}%</td></tr>
              <tr><td>👤 Recurso Humano ({data.recursoHumano?.datos?.nombre})</td><td className="dg-tbl-val">${$(rc.totalRecurso)}</td><td className="dg-tbl-val">{pctRH.toFixed(1)}%</td></tr>
              {(rc.totalAdministrativo || 0) > 0 && <tr><td>📋 Costos Administrativos</td><td className="dg-tbl-val">${$(rc.totalAdministrativo)}</td><td className="dg-tbl-val">{(totalOp > 0 ? (rc.totalAdministrativo / totalOp * 100) : 0).toFixed(1)}%</td></tr>}
              {(rc.otrosCostos || 0) > 0 && <tr><td>🛡️ Otros Costos</td><td className="dg-tbl-val">${$(rc.otrosCostos)}</td><td className="dg-tbl-val">{(totalOp > 0 ? (rc.otrosCostos / totalOp * 100) : 0).toFixed(1)}%</td></tr>}
              {(rc.totalPeajes || 0) > 0 && <tr><td>🚧 Peajes y Tasas</td><td className="dg-tbl-val">${$(rc.totalPeajes)}</td><td className="dg-tbl-val">{(totalOp > 0 ? (rc.totalPeajes / totalOp * 100) : 0).toFixed(1)}%</td></tr>}
              <tr className="dg-tbl-sub"><td>Costo Operativo</td><td className="dg-tbl-val">${$(totalOp)}</td><td className="dg-tbl-val">100%</td></tr>
              {!isPublic && <tr><td>📈 Margen de Ganancia ({data.configuracion?.porcentajeGanancia || 0}%)</td><td className="dg-tbl-val" style={{ color: '#4b7a62' }}>+ ${$(ganancia)}</td><td className="dg-tbl-val"></td></tr>}
              <tr className="dg-tbl-total"><td>Precio Final de Venta (s/IVA)</td><td className="dg-tbl-val">${$(totalFinal)}</td><td className="dg-tbl-val"></td></tr>
              <tr><td>📌 IVA ({pctIVA}%)</td><td className="dg-tbl-val" style={{ color: '#94a3b8' }}>+ ${$(montoIVA)}</td><td className="dg-tbl-val"></td></tr>
              <tr className="dg-tbl-total"><td><strong>Total con IVA</strong></td><td className="dg-tbl-val"><strong>${$(totalConIVA)}</strong></td><td className="dg-tbl-val"></td></tr>
            </tbody>
          </table>

          {/* Risk: Fixed vs Variable */}
          <h3 className="dg-st">Análisis de Riesgo: Fijos vs. Variables</h3>
          <div className="dg-bar-wrap">
            <div className="dg-bar-header">
              <span className="dg-bar-label">Costos Variables</span>
              <span className="dg-bar-value">${$(costosVars)}</span>
            </div>
            <div className="dg-bar-track">
              <div className="dg-bar-fill" style={{ width: `${pctVars}%`, background: '#c29352' }}>
                <span className="dg-bar-pct">{pctVars.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="dg-bar-wrap">
            <div className="dg-bar-header">
              <span className="dg-bar-label">Costos Fijos</span>
              <span className="dg-bar-value">${$(costosFijos)}</span>
            </div>
            <div className="dg-bar-track">
              <div className="dg-bar-fill" style={{ width: `${pctFijos}%`, background: '#475569' }}>
                <span className="dg-bar-pct">{pctFijos.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Structure composition */}
          <h3 className="dg-st">Distribución del Costo Operativo</h3>
          <div className="dg-comp-bar">
            <div className="dg-comp-seg" style={{ width: `${pctVeh}%`, background: '#0891b2' }}>
              <span>{pctVeh.toFixed(0)}%</span>
            </div>
            <div className="dg-comp-seg" style={{ width: `${pctRH}%`, background: '#3b82f6' }}>
              <span>{pctRH.toFixed(0)}%</span>
            </div>
            <div className="dg-comp-seg" style={{ width: `${pctAdm}%`, background: '#6366f1' }}>
              <span>{pctAdm > 5 ? `${pctAdm.toFixed(0)}%` : ''}</span>
            </div>
          </div>
          <div className="dg-comp-legend">
            <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#0891b2' }} /> Vehículo ${$(rc.totalVehiculo)}</span>
            <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#3b82f6' }} /> Recurso Humano ${$(rc.totalRecurso)}</span>
            <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#6366f1' }} /> Admin/Otros ${$(totalAdminOtros)}</span>
          </div>

          {/* KPIs de Eficiencia */}
          <h3 className="dg-st">Indicadores de Eficiencia</h3>
          <div className="dg-kpi-mini-row">
            <div className="dg-kpi-mini">
              <div className="dg-kpi-mini-icon"><Gauge size={16} /></div>
              <div>
                <div className="dg-kpi-mini-val">${costoPorKm.toFixed(2)}</div>
                <div className="dg-kpi-mini-label">Costo / Km</div>
              </div>
            </div>
            <div className="dg-kpi-mini">
              <div className="dg-kpi-mini-icon"><Clock size={16} /></div>
              <div>
                <div className="dg-kpi-mini-val">${costoPorHr.toFixed(0)}</div>
                <div className="dg-kpi-mini-label">Costo / Hora</div>
              </div>
            </div>
            <div className="dg-kpi-mini">
              <div className="dg-kpi-mini-icon"><RouteIcon size={16} /></div>
              <div>
                <div className="dg-kpi-mini-val">~{viajes.toFixed(1)}</div>
                <div className="dg-kpi-mini-label">Viajes / Mes</div>
              </div>
            </div>
            <div className="dg-kpi-mini">
              <div className="dg-kpi-mini-icon" style={{ background: '#475569' }}><Package size={16} /></div>
              <div>
                <div className="dg-kpi-mini-val">{data.vehiculo?.datos?.marca} {data.vehiculo?.datos?.modelo}</div>
                <div className="dg-kpi-mini-label">{data.recursoHumano?.datos?.nombre || 'Colaborador'}</div>
              </div>
            </div>
          </div>

          {/* Resumen del servicio — at bottom */}
          <div className="dg-info" style={{ marginTop: 'auto' }}>
            <div className="dg-info-title">Resumen del Servicio</div>
            <div className="dg-info-text">
              Servicio de transporte de carga <strong>{data.detallesCarga?.tipo || 'general'}</strong> con
              recorrido de <strong>{(data.totalKilometros || 0).toFixed(0)} km</strong> ({data.puntosEntrega?.length || 0} puntos de entrega),
              operado por <strong>{data.recursoHumano?.datos?.nombre || 'colaborador asignado'}</strong> con
              vehículo <strong>{data.vehiculo?.datos?.marca} {data.vehiculo?.datos?.modelo}</strong> ({data.vehiculo?.datos?.patente}).
              {data.frecuencia?.tipo === 'mensual'
                ? ` Frecuencia mensual: ${data.frecuencia.diasSeleccionados?.length || 0} días por semana, ${data.frecuencia.viajesPorDia || 1} viaje(s) por día.`
                : ` Servicio esporádico: ${data.frecuencia?.vueltasTotales || 1} viaje(s) programado(s).`
              }
              {` El presente informe detalla los 6 capítulos de costos que componen la cotización.`}
            </div>
          </div>
        </div>
        <Foot p={1} />
      </div>

      {/* ━━━ CHAPTERS 2-7 ━━━ */}
      <CapituloRutaFrecuencia data={data} empresa={e} Head={Head} Foot={Foot} />
      <CapituloVehiculoFicha data={data} empresa={e} Head={Head} Foot={Foot} />
      <CapituloVehiculoCostos data={data} empresa={e} Head={Head} Foot={Foot} />
      <CapituloRecursoHumanoFicha data={data} empresa={e} Head={Head} Foot={Foot} />
      <CapituloRecursoHumanoCostos data={data} empresa={e} Head={Head} Foot={Foot} />
      <CapituloFinalConsolidado data={data} empresa={e} Head={Head} Foot={Foot} isPublic={isPublic} />
    </div>
  );
};

export default DesglosePage;