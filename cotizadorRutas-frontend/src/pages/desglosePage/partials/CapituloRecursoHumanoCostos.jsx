const $ = v => (v || 0).toLocaleString('es-AR');

const CapituloRecursoHumanoCostos = ({ data, Head, Foot }) => {
  if (!data?.recursoHumano?.calculo?.detalle) return null;

  const { calculo } = data.recursoHumano;
  const { detalle, totalFinal } = calculo;

  const totalRem = (detalle.costoBaseRemunerativo || 0) + (detalle.adicionalKm || 0) + (detalle.adicionalPorCargaDescarga || 0);
  const totalNoRem = (detalle.viaticoKm || 0) + (detalle.adicionalFijoNoRemunerativo || 0);
  const totalInd = detalle.costoIndirecto || 0;

  const costoPorKm = detalle.kmRealesTotales > 0 ? (totalFinal / detalle.kmRealesTotales) : 0;
  const duracion = (data.duracionMin || 0) + 30;
  const viajes = data.frecuencia.tipo === 'mensual'
    ? ((data.frecuencia.diasSeleccionados?.length || 0) * (data.frecuencia.viajesPorDia || 1) * 4.33)
    : (data.frecuencia.vueltasTotales || 1);
  const hsMens = (duracion * viajes) / 60;
  const costoPorHr = hsMens > 0 ? (totalFinal / hsMens) : 0;

  const pctRem = totalFinal > 0 ? (totalRem / totalFinal * 100) : 0;
  const pctNoRem = totalFinal > 0 ? (totalNoRem / totalFinal * 100) : 0;
  const pctInd = totalFinal > 0 ? (totalInd / totalFinal * 100) : 0;

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 5: Costos del Recurso Humano</h1>
        <p className="dg-chapter-sub">Cálculo detallado de los costos generados por el colaborador para este servicio, según la metodología aplicada por el sistema.</p>

        {/* Info: Methodology */}
        <div className="dg-info">
          <div className="dg-info-title">Metodología de Cálculo Aplicada</div>
          <div className="dg-info-text">
            El sistema aplicó el modo <strong>{detalle.tipoDeCalculo}</strong>, determinado automáticamente
            en función de la duración del servicio y la frecuencia programada. Este método define cómo se imputa
            el costo base del colaborador (proporcional al tiempo, tarifa por jornada, etc.).
          </div>
        </div>

        {/* Cost cascade */}
        <h3 className="dg-st">Desglose de Conceptos</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Monto Mensual</th></tr></thead>
          <tbody>
            <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
            <tr><td>Costo Base (Sueldo / Jornal)</td><td className="dg-tbl-val">${$(detalle.costoBaseRemunerativo)}</td></tr>
            <tr><td>Adicional por KM (Remunerativo)</td><td className="dg-tbl-val">${$(detalle.adicionalKm)}</td></tr>
            <tr><td>Viáticos por KM (No Remunerativo)</td><td className="dg-tbl-val">${$(detalle.viaticoKm)}</td></tr>
            <tr><td>Adicional por Carga/Descarga</td><td className="dg-tbl-val">${$(detalle.adicionalPorCargaDescarga)}</td></tr>
            <tr><td>Adicional Fijo (No Remunerativo)</td><td className="dg-tbl-val">${$(detalle.adicionalFijoNoRemunerativo)}</td></tr>
            <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
            <tr><td>{detalle.costoIndirectoLabel || 'Cargas Sociales / Overhead'}</td><td className="dg-tbl-val">${$(detalle.costoIndirecto)}</td></tr>
          </tbody>
        </table>

        {/* HERO TOTAL */}
        <div className="dg-hero" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <div className="dg-hero-label">Costo Total del Recurso Humano</div>
          <div className="dg-hero-val">${$(totalFinal)}</div>
          <div className="dg-hero-stats">
            <div><div className="dg-hero-stat-val">${costoPorKm.toFixed(2)}</div><div className="dg-hero-stat-label">Por km</div></div>
            <div><div className="dg-hero-stat-val">${costoPorHr.toFixed(0)}</div><div className="dg-hero-stat-label">Por hora</div></div>
            <div><div className="dg-hero-stat-val">{$(detalle.kmParaPagar)}</div><div className="dg-hero-stat-label">KMs pagados</div></div>
          </div>
        </div>

        {/* Composition */}
        <h3 className="dg-st">Composición del Costo</h3>
        <div className="dg-comp-bar">
          {pctRem > 0 && <div className="dg-comp-seg" style={{ width: `${pctRem}%`, background: '#3b82f6' }}><span>{pctRem > 8 ? `${pctRem.toFixed(0)}%` : ''}</span></div>}
          {pctNoRem > 0 && <div className="dg-comp-seg" style={{ width: `${pctNoRem}%`, background: '#14b8a6' }}><span>{pctNoRem > 8 ? `${pctNoRem.toFixed(0)}%` : ''}</span></div>}
          {pctInd > 0 && <div className="dg-comp-seg" style={{ width: `${pctInd}%`, background: '#7c8db5' }}><span>{pctInd > 8 ? `${pctInd.toFixed(0)}%` : ''}</span></div>}
        </div>
        <div className="dg-comp-legend">
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#3b82f6' }} /> Remunerativo ${$(totalRem)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#14b8a6' }} /> No Remunerativo ${$(totalNoRem)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#7c8db5' }} /> Indirectos ${$(totalInd)}</span>
        </div>

        {/* Additional info */}
        <div className="dg-info" style={{ marginTop: 'auto' }}>
          <div className="dg-info-title">Detalle del Cálculo</div>
          <div className="dg-info-text">
            Kilómetros reales del recorrido: <strong>{$(detalle.kmRealesTotales || 0)} km</strong>.
            Kilómetros pagados (aplicando mínimos): <strong>{$(detalle.kmParaPagar || 0)} km</strong>.
            {detalle.kmRealesTotales < (data.recursoHumano?.datos?.minKmRemunerativo || 350)
              ? ' Los kilómetros reales están por debajo del mínimo establecido, por lo que se aplica el mínimo para el cálculo de adicionales.'
              : ' Los kilómetros reales superan los mínimos, por lo que los adicionales se calculan sobre la distancia real.'
            }
          </div>
        </div>
      </div>
      <Foot p={6} />
    </div>
  );
};

export default CapituloRecursoHumanoCostos;