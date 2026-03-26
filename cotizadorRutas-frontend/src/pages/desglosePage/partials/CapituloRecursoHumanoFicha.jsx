import { User, Briefcase } from 'lucide-react';

const $ = v => (v || 0).toLocaleString('es-AR');

const CapituloRecursoHumanoFicha = ({ data, Head, Foot }) => {
  if (!data?.recursoHumano?.datos) return null;
  const d = data.recursoHumano.datos;

  const base = d.sueldoBasico || 0;
  const actividad = base * ((d.adicionalActividadPorc || 0) / 100);
  const fijoNoRem = d.adicionalNoRemunerativoFijo || 0;
  const total = base + actividad + fijoNoRem;
  const pctBase = total > 0 ? (base / total * 100) : 0;
  const pctAct = total > 0 ? (actividad / total * 100) : 0;
  const pctFijo = total > 0 ? (fijoNoRem / total * 100) : 0;

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 4: Perfil del Colaborador y Parámetros</h1>
        <p className="dg-chapter-sub">Datos del recurso humano asignado al servicio, estructura de compensación, incentivos y reglas de cálculo aplicadas.</p>

        {/* ID */}
        <div className="dg-id-row">
          <div className="dg-id-icon" style={{ background: '#3b82f6' }}><User size={18} /></div>
          <div className="dg-id-name">{d.nombre}</div>
          <span className="dg-id-badge" style={{
            color: d.tipoContratacion === 'empleado' ? '#059669' : '#d97706',
            borderColor: d.tipoContratacion === 'empleado' ? '#a7f3d0' : '#fde68a',
            background: d.tipoContratacion === 'empleado' ? '#f0fdf4' : '#fffbeb',
          }}>
            <Briefcase size={10} style={{ marginRight: 3, verticalAlign: -1 }} />
            {d.tipoContratacion === 'empleado' ? 'Empleado en Relación de Dependencia' : 'Contratado Independiente'}
          </span>
        </div>

        {/* Compensación Base */}
        <h3 className="dg-st">Compensación Base Mensual</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
          <tbody>
            <tr><td>Sueldo Básico (según Convenio Colectivo)</td><td className="dg-tbl-val">${$(d.sueldoBasico)}</td></tr>
            <tr><td>Adicional por Actividad</td><td className="dg-tbl-val">{d.adicionalActividadPorc || 0}%</td></tr>
            <tr><td>Adicional Fijo No Remunerativo</td><td className="dg-tbl-val">${$(d.adicionalNoRemunerativoFijo)}</td></tr>
            <tr><td>Horas Laborales de Referencia</td><td className="dg-tbl-val">{d.horasLaboralesMensuales || 192} hs/mes</td></tr>
          </tbody>
        </table>

        {/* 2 cols */}
        <div className="dg-cols">
          <div className="dg-col">
            <h3 className="dg-st">Incentivos por Rendimiento</h3>
            <table className="dg-tbl">
              <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
              <tbody>
                <tr><td>Adicional por KM (Remunerativo)</td><td className="dg-tbl-val">${d.adicionalKmRemunerativo || 0}/km</td></tr>
                <tr><td>Viático por KM (No Remun.)</td><td className="dg-tbl-val">${d.viaticoPorKmNoRemunerativo || 0}/km</td></tr>
                <tr><td>Adicional Carga/Descarga</td><td className="dg-tbl-val">${$(d.adicionalCargaDescargaCadaXkm)} c/{d.kmPorUnidadDeCarga}km</td></tr>
              </tbody>
            </table>
          </div>
          <div className="dg-col">
            <h3 className="dg-st">Reglas de Cálculo</h3>
            <table className="dg-tbl">
              <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
              <tbody>
                <tr><td>Mínimo de Minutos Facturables</td><td className="dg-tbl-val">{d.minimoMinutosFacturables || 120} min</td></tr>
                <tr><td>Mínimo KM para Adicional Rem.</td><td className="dg-tbl-val">{d.minKmRemunerativo || 350} km</td></tr>
                <tr><td>Mínimo KM para Viáticos</td><td className="dg-tbl-val">{d.minKmNoRemunerativo || 350} km</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Costos Indirectos */}
        <h3 className="dg-st">Costos Indirectos del Empleador</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
          <tbody>
            {d.tipoContratacion === 'empleado'
              ? <tr><td>Cargas Sociales sobre Conceptos Remunerativos (Aportes Patronales, ART, etc.)</td><td className="dg-tbl-val">{d.porcentajeCargasSociales}%</td></tr>
              : <tr><td>Overhead sobre Honorarios Brutos (Facturación, Coordinación)</td><td className="dg-tbl-val">{d.porcentajeOverheadContratado}%</td></tr>
            }
          </tbody>
        </table>

        {/* Composición Salario */}
        <h3 className="dg-st">Composición del Salario Base</h3>
        <div className="dg-comp-bar">
          {pctBase > 0 && <div className="dg-comp-seg" style={{ width: `${pctBase}%`, background: '#3b82f6' }}><span>{pctBase > 10 ? `${pctBase.toFixed(0)}%` : ''}</span></div>}
          {pctAct > 0 && <div className="dg-comp-seg" style={{ width: `${pctAct}%`, background: '#0891b2' }}><span>{pctAct > 10 ? `${pctAct.toFixed(0)}%` : ''}</span></div>}
          {pctFijo > 0 && <div className="dg-comp-seg" style={{ width: `${pctFijo}%`, background: '#7c8db5' }}><span>{pctFijo > 10 ? `${pctFijo.toFixed(0)}%` : ''}</span></div>}
        </div>
        <div className="dg-comp-legend">
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#3b82f6' }} /> Básico ${$(base)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#0891b2' }} /> Actividad ${$(actividad)}</span>
          <span className="dg-comp-text"><span className="dg-comp-dot" style={{ background: '#7c8db5' }} /> Fijo No Rem. ${$(fijoNoRem)}</span>
        </div>

        {/* Info card to fill space */}
        <div className="dg-info" style={{ marginTop: 'auto' }}>
          <div className="dg-info-title">Notas sobre la Compensación</div>
          <div className="dg-info-text">
            Los adicionales por kilómetro (remunerativos y viáticos) se aplican únicamente cuando el recorrido supera los mínimos
            establecidos ({d.minKmRemunerativo || 350} km y {d.minKmNoRemunerativo || 350} km respectivamente).
            El adicional por carga/descarga se calcula cada {d.kmPorUnidadDeCarga} km recorridos.
            {d.tipoContratacion === 'empleado'
              ? ` Las cargas sociales del ${d.porcentajeCargasSociales}% se aplican sobre el total de conceptos remunerativos.`
              : ` El overhead del ${d.porcentajeOverheadContratado}% se aplica sobre el total de honorarios brutos.`
            }
          </div>
        </div>
      </div>
      <Foot p={5} />
    </div>
  );
};

export default CapituloRecursoHumanoFicha;