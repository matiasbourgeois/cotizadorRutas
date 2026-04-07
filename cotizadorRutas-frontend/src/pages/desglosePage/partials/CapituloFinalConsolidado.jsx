const $ = v => (v || 0).toLocaleString('es-AR');

const CapituloFinalConsolidado = ({ data, Head, Foot, isPublic = false }) => {
  if (!data?.resumenCostos) return null;

  const rc = data.resumenCostos;
  const freq = data.frecuencia;
  const kmsMens = data.vehiculo?.calculo?.kmsMensuales || 0;

  const totalAdmin = rc.totalAdministrativo || 0;
  const totalOtros = rc.otrosCostos || 0;
  const totalPeajes = rc.totalPeajes || 0;
  const totalOp = rc.totalOperativo || 0;
  const ganancia = rc.ganancia || 0;
  const totalFinal = rc.totalFinal || 0;
  const montoIVA = rc.montoIVA || Math.round(totalFinal * 0.21);
  const totalConIVA = rc.totalConIVA || (totalFinal + montoIVA);
  const pctIVA = rc.porcentajeIVA || 21;

  const costoOpPorKm = kmsMens > 0 ? (totalOp / kmsMens) : 0;
  const precioPorKm = kmsMens > 0 ? (totalFinal / kmsMens) : 0;
  const viajesProyectados = freq.tipo === 'mensual'
    ? ((freq.diasSeleccionados?.length || 0) * (freq.viajesPorDia || 1) * 4.33)
    : (freq.vueltasTotales || 1);
  const costoPorViaje = viajesProyectados > 0 ? (totalFinal / viajesProyectados) : 0;
  const margenPct = data.configuracion?.porcentajeGanancia || 0;

  const pctCosto = totalFinal > 0 ? (totalOp / totalFinal * 100) : 0;
  const pctGanancia = totalFinal > 0 ? (ganancia / totalFinal * 100) : 0;

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 6: Consolidado Económico y Rentabilidad</h1>
        <p className="dg-chapter-sub">Resumen de todos los costos operativos, definición del precio de venta y análisis de la rentabilidad proyectada del servicio.</p>

        {/* Construction table */}
        <h3 className="dg-st">Construcción del Precio de Venta</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Monto Mensual</th></tr></thead>
          <tbody>
            <tr>
              <td><span style={{ marginRight: 6 }}>🚛</span> Costo Total del Vehículo</td>
              <td className="dg-tbl-val">${$(rc.totalVehiculo)}</td>
            </tr>
            <tr>
              <td><span style={{ marginRight: 6 }}>👤</span> Costo Total del Recurso Humano</td>
              <td className="dg-tbl-val">${$(rc.totalRecurso)}</td>
            </tr>
            {totalAdmin > 0 && <tr>
              <td><span style={{ marginRight: 6 }}>📋</span> Costos Administrativos</td>
              <td className="dg-tbl-val">${$(totalAdmin)}</td>
            </tr>}
            {totalOtros > 0 && <tr>
              <td><span style={{ marginRight: 6 }}>🛡️</span> Otros Costos Operativos</td>
              <td className="dg-tbl-val">${$(totalOtros)}</td>
            </tr>}
            {totalPeajes > 0 && <tr>
              <td><span style={{ marginRight: 6 }}>🚧</span> Peajes y Tasas Viales</td>
              <td className="dg-tbl-val">${$(totalPeajes)}</td>
            </tr>}
            {(rc.costoAdicionalPeligrosa || 0) > 0 && <tr>
              <td><span style={{ marginRight: 6 }}>⚠️</span> Recargo Carga Peligrosa</td>
              <td className="dg-tbl-val">${$(rc.costoAdicionalPeligrosa)}</td>
            </tr>}
            <tr className="dg-tbl-sub">
              <td>Costo Operativo Total</td>
              <td className="dg-tbl-val">${$(totalOp)}</td>
            </tr>
            {!isPublic && <tr>
              <td><span style={{ marginRight: 6 }}>📈</span> Margen de Ganancia ({margenPct}%)</td>
              <td className="dg-tbl-val" style={{ color: '#4b7a62' }}>+ ${$(ganancia)}</td>
            </tr>}
            <tr className="dg-tbl-total">
              <td>Precio Final de Venta (sin IVA)</td>
              <td className="dg-tbl-val">${$(totalFinal)}</td>
            </tr>
            <tr>
              <td><span style={{ marginRight: 6 }}>📌</span> IVA ({pctIVA}%)</td>
              <td className="dg-tbl-val" style={{ color: '#94a3b8' }}>+ ${$(montoIVA)}</td>
            </tr>
            <tr className="dg-tbl-total">
              <td><strong>Total con IVA</strong></td>
              <td className="dg-tbl-val"><strong>${$(totalConIVA)}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* HERO TOTAL */}
        <div className="dg-hero">
          <div className="dg-hero-label">{freq.tipo === 'mensual' ? 'Cotización Final Mensual' : 'Cotización Final del Servicio'} (sin IVA)</div>
          <div className="dg-hero-val">${$(totalFinal)}</div>
          <div className="dg-hero-label" style={{ fontSize: 9, marginTop: 4, opacity: .7 }}>Con IVA ({pctIVA}%): ${$(totalConIVA)}</div>
          <div className="dg-hero-stats">
            <div><div className="dg-hero-stat-val">${precioPorKm.toFixed(0)}</div><div className="dg-hero-stat-label">Precio / Km</div></div>
            <div><div className="dg-hero-stat-val">${costoPorViaje.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div><div className="dg-hero-stat-label">Precio / Viaje</div></div>
            <div><div className="dg-hero-stat-val">{margenPct}%</div><div className="dg-hero-stat-label">Margen Bruto</div></div>
          </div>
        </div>

        {/* KPI cards */}
        <h3 className="dg-st">Indicadores Estratégicos</h3>
        <div className="dg-kpi-row">
          <div className="dg-kpi">
            <div className="dg-kpi-label">Precio de Venta / KM</div>
            <div className="dg-kpi-val" style={{ fontSize: 20 }}>${precioPorKm.toFixed(0)}</div>
            <div className="dg-kpi-note">Precio sin IVA por kilómetro</div>
          </div>
          <div className="dg-kpi">
            <div className="dg-kpi-label">Precio de Venta / Viaje</div>
            <div className="dg-kpi-val" style={{ color: 'var(--c2)', fontSize: 20 }}>${costoPorViaje.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
            <div className="dg-kpi-note">Precio de venta por viaje sin IVA</div>
          </div>
          {!isPublic && <div className="dg-kpi dg-kpi--accent">
            <div className="dg-kpi-label">Margen de Beneficio</div>
            <div className="dg-kpi-val" style={{ fontSize: 20 }}>{margenPct}%</div>
            <div className="dg-kpi-note">Ganancia: ${$(ganancia)}</div>
          </div>}
        </div>

        {!isPublic && <>
        <h3 className="dg-st">Distribución del Precio Final</h3>
        <div className="dg-comp-bar">
          <div className="dg-comp-seg" style={{ width: `${pctCosto}%`, background: '#475569' }}>
            <span>{pctCosto.toFixed(0)}%</span>
          </div>
          <div className="dg-comp-seg" style={{ width: `${pctGanancia}%`, background: '#6b9080' }}>
            <span>{pctGanancia.toFixed(0)}%</span>
          </div>
        </div>
        <div className="dg-comp-legend">
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#475569' }} /> Costo Operativo ${$(totalOp)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#6b9080' }} /> Margen de Ganancia ${$(ganancia)}</span>
        </div>
        </>}

        {/* Veredicto */}
        <div className="dg-verdict" style={{ marginTop: 'auto' }}>
          <div className="dg-verdict-title">✅ Análisis de Viabilidad</div>
          <div className="dg-verdict-text">
            El servicio genera un margen bruto de <strong>${$(ganancia)}</strong> ({margenPct}% sobre el costo operativo),
            cubriendo la totalidad de los costos directos (vehículo + recurso humano) e indirectos (administrativos, peajes, otros).
            El precio de venta de <strong>${$(totalFinal)}</strong> {freq.tipo === 'mensual' ? 'mensuales' : 'por el servicio'} se encuentra alineado con los objetivos de
            rentabilidad de la empresa. Este análisis contempla {$(kmsMens)} km {freq.tipo === 'mensual' ? 'mensuales' : 'totales'} de operación y ~{viajesProyectados.toFixed(0)} viajes proyectados.
          </div>
        </div>
      </div>
      <Foot p={7} />
    </div>
  );
};

export default CapituloFinalConsolidado;