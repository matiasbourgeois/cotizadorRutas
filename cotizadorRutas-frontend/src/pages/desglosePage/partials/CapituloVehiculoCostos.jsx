const $ = v => (v || 0).toLocaleString('es-AR');

const CapituloVehiculoCostos = ({ data, Head, Foot }) => {
  if (!data?.vehiculo?.calculo?.detalle) return null;

  const { calculo } = data.vehiculo;
  const { detalle, totalFinal, kmsMensuales, proporcionUso } = calculo;

  const totalVars = (detalle.combustible || 0) + (detalle.cubiertas || 0) + (detalle.aceite || 0) + (detalle.depreciacion || 0);
  const totalFijos = detalle.costosFijosProrrateados || 0;
  const pctVars = totalFinal > 0 ? (totalVars / totalFinal * 100) : 0;
  const pctFijos = totalFinal > 0 ? (totalFijos / totalFinal * 100) : 0;

  const costoPorKm = kmsMensuales > 0 ? (totalFinal / kmsMensuales) : 0;
  const duracion = (data.duracionMin || 0) + 30;
  const viajes = data.frecuencia.tipo === 'mensual'
    ? ((data.frecuencia.diasSeleccionados?.length || 0) * (data.frecuencia.viajesPorDia || 1) * 4.33)
    : (data.frecuencia.vueltasTotales || 1);
  const hsMens = (duracion * viajes) / 60;
  const costoPorHr = hsMens > 0 ? (totalFinal / hsMens) : 0;

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 3: Costos Operativos del Vehículo</h1>
        <p className="dg-chapter-sub">Desglose de costos variables (por uso) y fijos (por tiempo) generados por el activo para este servicio.</p>

        {/* Variables */}
        <h3 className="dg-st">Costos Variables (Por Uso)</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Monto Mensual</th></tr></thead>
          <tbody>
            <tr><td>Combustible / GNC</td><td className="dg-tbl-val">${$(detalle.combustible)}</td></tr>
            <tr><td>Desgaste de Cubiertas</td><td className="dg-tbl-val">${$(detalle.cubiertas)}</td></tr>
            <tr><td>Cambio de Aceite y Filtros</td><td className="dg-tbl-val">${$(detalle.aceite)}</td></tr>
            <tr><td>Depreciación del Vehículo</td><td className="dg-tbl-val">${$(detalle.depreciacion)}</td></tr>
            <tr className="dg-tbl-sub"><td>Subtotal Variables</td><td className="dg-tbl-val">${$(totalVars)}</td></tr>
          </tbody>
        </table>

        {/* Info: Methodology */}
        <div className="dg-info">
          <div className="dg-info-title">Metodología de Asignación de Costos Fijos</div>
          <div className="dg-info-text">
            Los gastos fijos mensuales del vehículo se asignan proporcionalmente según el <strong>tiempo de ocupación</strong> del servicio.
            El sistema calculó una proporción de uso del <strong>{(proporcionUso * 100).toFixed(1)}%</strong> sobre la jornada completa,
            lo que determina el monto de costos fijos imputables a esta operación.
          </div>
        </div>

        {/* Fijos */}
        <h3 className="dg-st">Costos Fijos (Asignados por Proporción)</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Monto Mensual</th></tr></thead>
          <tbody>
            <tr><td>Seguros, Patentes, Mantenimiento (prorrateo al {(proporcionUso * 100).toFixed(1)}%)</td><td className="dg-tbl-val">${$(totalFijos)}</td></tr>
            <tr className="dg-tbl-sub"><td>Subtotal Fijos</td><td className="dg-tbl-val">${$(totalFijos)}</td></tr>
          </tbody>
        </table>

        {/* HERO TOTAL */}
        <div className="dg-hero">
          <div className="dg-hero-label">Costo Total del Vehículo</div>
          <div className="dg-hero-val">${$(totalFinal)}</div>
          <div className="dg-hero-stats">
            <div><div className="dg-hero-stat-val">${costoPorKm.toFixed(2)}</div><div className="dg-hero-stat-label">Por km</div></div>
            <div><div className="dg-hero-stat-val">${costoPorHr.toFixed(0)}</div><div className="dg-hero-stat-label">Por hora</div></div>
            <div><div className="dg-hero-stat-val">{$(kmsMensuales)}</div><div className="dg-hero-stat-label">KMs / Mes</div></div>
            <div><div className="dg-hero-stat-val">{hsMens.toFixed(1)}</div><div className="dg-hero-stat-label">Hs / Mes</div></div>
          </div>
        </div>

        {/* Composition */}
        <h3 className="dg-st">Composición Variables vs. Fijos</h3>
        <div className="dg-comp-bar">
          <div className="dg-comp-seg" style={{ width: `${pctVars}%`, background: '#c29352' }}>
            <span>{pctVars.toFixed(0)}%</span>
          </div>
          <div className="dg-comp-seg" style={{ width: `${pctFijos}%`, background: '#7c8db5' }}>
            <span>{pctFijos.toFixed(0)}%</span>
          </div>
        </div>
        <div className="dg-comp-legend">
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#c29352' }} /> Variables ${$(totalVars)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#7c8db5' }} /> Fijos ${$(totalFijos)}</span>
        </div>

        {/* Interpretation at bottom */}
        <div className="dg-info" style={{ marginTop: 'auto' }}>
          <div className="dg-info-title">Interpretación del Análisis</div>
          <div className="dg-info-text">
            El costo del vehículo se compone de <strong>{pctVars.toFixed(0)}% de costos variables</strong> y <strong>{pctFijos.toFixed(0)}% de costos fijos</strong>.
            El combustible se calcula sobre {$(kmsMensuales)} km recorridos al mes a un rendimiento de {data.vehiculo?.datos?.rendimientoKmLitro} km/litro
            y precio de ${$(data.vehiculo?.datos?.precioLitroCombustible)}/litro.
            La depreciación se calcula en base al valor a depreciar de ${$(((data.vehiculo?.datos?.precioVehiculoNuevo || 0) * (1 - (data.vehiculo?.datos?.valorResidualPorcentaje || 0) / 100)))} distribuido
            linealmente sobre la vida útil de {$(data.vehiculo?.datos?.kmsVidaUtilVehiculo)} km.
            Las cubiertas ({data.vehiculo?.datos?.cantidadCubiertas} unidades) se distribuyen sobre {$(data.vehiculo?.datos?.kmsVidaUtilCubiertas)} km de vida útil cada una.
          </div>
        </div>
      </div>
      <Foot p={4} />
    </div>
  );
};

export default CapituloVehiculoCostos;