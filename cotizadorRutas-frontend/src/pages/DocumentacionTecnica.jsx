
import { ScrollArea } from '@mantine/core';

const css = `
/* ═══════════════════════════════════════════════════════ */
/* DOCUMENTACIÓN TÉCNICA — ESTILOS GOD LEVEL              */
/* ═══════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Variables */
.doc-tech {
  --dt-cyan: #22d3ee;
  --dt-violet: #8b5cf6;
  --dt-amber: #f59e0b;
  --dt-emerald: #10b981;
  --dt-rose: #f43f5e;
  --dt-cyan-dim: rgba(34,211,238,.12);
  --dt-cyan-glow: rgba(34,211,238,.35);
  --dt-border: rgba(148,163,184,.1);
  --dt-card-bg: rgba(148,163,184,.04);

  max-width: 940px;
  margin: 0 auto;
  padding: 0 20px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--mantine-color-text);
  line-height: 1.7;
}
.doc-tech * { box-sizing: border-box; }

/* ─── ANIMACIONES ─── */
@keyframes dt-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes dt-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── PORTADA HERO ─── */
.dt-hero {
  text-align: center;
  padding: 64px 24px 52px;
  margin-bottom: 48px;
  border-bottom: 2px solid var(--dt-border);
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 25% 30%, rgba(34,211,238,.08) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 70%, rgba(139,92,246,.06) 0%, transparent 55%);
  animation: dt-fade-up .5s ease both;
}
.dt-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322d3ee' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.dt-hero-logo {
  width: 72px;
  filter: drop-shadow(0 0 24px var(--dt-cyan-glow)) drop-shadow(0 0 48px rgba(34,211,238,.12));
  animation: dt-float 4s ease-in-out infinite;
  margin-bottom: 20px;
}
.dt-hero h1 {
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: -.5px;
  margin: 0 0 6px;
  background: linear-gradient(135deg, var(--mantine-color-text) 40%, var(--dt-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dt-hero-sub {
  font-size: .95rem;
  opacity: .6;
  margin: 0;
}
.dt-hero-badge {
  display: inline-block;
  margin-top: 18px;
  padding: 5px 18px;
  border-radius: 100px;
  border: 1px solid rgba(34,211,238,.25);
  background: rgba(34,211,238,.08);
  color: var(--dt-cyan);
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .8px;
}

/* ─── TOC ─── */
.dt-toc {
  border-radius: 14px;
  padding: 28px 32px;
  margin-bottom: 52px;
  border: 1px solid var(--dt-border);
  background: var(--dt-card-bg);
}
.dt-toc h2 { font-size: 1.05rem; font-weight: 800; margin: 0 0 18px; color: var(--dt-cyan); }
.dt-toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 32px;
}
.dt-toc a {
  color: inherit;
  text-decoration: none;
  font-size: .83rem;
  padding: 7px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(148,163,184,.07);
  transition: color .2s, gap .2s;
}
.dt-toc a:hover { color: var(--dt-cyan); gap: 14px; }
.dt-toc-num {
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border-radius: 7px;
  background: var(--dt-cyan-dim);
  color: var(--dt-cyan);
  font-size: .64rem; font-weight: 800;
  flex-shrink: 0;
}

/* ─── SECCIONES ─── */
.dt-section { margin-bottom: 60px; }
.dt-section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--dt-border);
}
.dt-icon {
  width: 42px; height: 42px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.dt-icon--cyan    { background: linear-gradient(135deg, rgba(34,211,238,.18), rgba(34,211,238,.06)); }
.dt-icon--violet  { background: linear-gradient(135deg, rgba(139,92,246,.18), rgba(139,92,246,.06)); }
.dt-icon--amber   { background: linear-gradient(135deg, rgba(245,158,11,.18), rgba(245,158,11,.06)); }
.dt-icon--emerald { background: linear-gradient(135deg, rgba(16,185,129,.18), rgba(16,185,129,.06)); }
.dt-icon--rose    { background: linear-gradient(135deg, rgba(244,63,94,.18), rgba(244,63,94,.06)); }
.dt-icon--teal    { background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06)); }

.dt-num {
  font-size: .6rem;
  opacity: .45;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}
.dt-section h2 { font-size: 1.3rem; font-weight: 800; letter-spacing: -.3px; margin: 0; }
.dt-section h3 {
  font-size: 1rem; font-weight: 700;
  margin: 26px 0 10px;
  color: var(--dt-cyan);
}
.dt-section p, .dt-section li { opacity: .82; font-size: .9rem; }
.dt-section ul, .dt-section ol { padding-left: 20px; margin: 8px 0; }
.dt-section li { margin-bottom: 5px; }

/* ─── CARDS ─── */
.dt-card {
  border-radius: 12px;
  padding: 18px 22px;
  margin: 14px 0;
  border: 1px solid var(--dt-border);
  background: var(--dt-card-bg);
  transition: border-color .2s, background .2s;
}
.dt-card:hover { border-color: rgba(34,211,238,.18); background: rgba(34,211,238,.03); }
.dt-card-title {
  font-weight: 700; font-size: .9rem;
  margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.dt-card p { opacity: .75; font-size: .85rem; margin: 0; }

/* ─── FÓRMULAS ─── */
.dt-formula {
  border-radius: 10px;
  padding: 16px 20px;
  margin: 12px 0;
  font-family: 'Courier New', Consolas, monospace;
  font-size: .83rem;
  line-height: 1.9;
  border-left: 4px solid var(--dt-cyan);
  background: rgba(34,211,238,.05);
  box-shadow: 0 0 24px rgba(34,211,238,.04);
  overflow-x: auto;
}
.dt-formula .comment { opacity: .4; font-style: italic; }
.dt-formula .key { color: var(--dt-cyan); font-weight: 700; }
.dt-formula .result { color: var(--dt-emerald); font-weight: 700; }

/* ─── TABLAS ─── */
.dt-table {
  width: 100%; border-collapse: collapse;
  margin: 12px 0; font-size: .83rem;
}
.dt-table th, .dt-table td {
  padding: 9px 12px; text-align: left;
  border-bottom: 1px solid var(--dt-border);
}
.dt-table tr:last-child td { border-bottom: none; }
.dt-table th {
  opacity: .45; font-weight: 700;
  font-size: .7rem; text-transform: uppercase; letter-spacing: .5px;
}
.dt-table td { opacity: .82; }

/* ─── BADGES ─── */
.dt-badge {
  display: inline-block; padding: 2px 10px;
  border-radius: 6px; font-size: .7rem; font-weight: 700;
}
.dt-badge--cyan    { background: var(--dt-cyan-dim); color: var(--dt-cyan); }
.dt-badge--violet  { background: rgba(139,92,246,.12); color: var(--dt-violet); }
.dt-badge--amber   { background: rgba(245,158,11,.12); color: var(--dt-amber); }
.dt-badge--emerald { background: rgba(16,185,129,.12); color: var(--dt-emerald); }
.dt-badge--rose    { background: rgba(244,63,94,.12); color: var(--dt-rose); }
.dt-badge--teal    { background: rgba(20,184,166,.12); color: #14b8a6; }

/* ─── TIPS ─── */
.dt-tip {
  border-radius: 10px; padding: 13px 16px; margin: 12px 0;
  font-size: .86rem; display: flex; gap: 10px; align-items: flex-start;
}
.dt-tip--cyan    { background: rgba(34,211,238,.06);  border-left: 3px solid var(--dt-cyan); }
.dt-tip--amber   { background: rgba(245,158,11,.06);  border-left: 3px solid var(--dt-amber); }
.dt-tip--violet  { background: rgba(139,92,246,.06);  border-left: 3px solid var(--dt-violet); }
.dt-tip--emerald { background: rgba(16,185,129,.06);  border-left: 3px solid var(--dt-emerald); }
.dt-tip--rose    { background: rgba(244,63,94,.06);   border-left: 3px solid var(--dt-rose); }
.dt-tip-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

/* ─── FLOW ─── */
.dt-flow {
  display: flex; flex-wrap: wrap;
  gap: 6px; margin: 16px 0; align-items: center;
}
.dt-flow-step {
  padding: 9px 15px; border-radius: 8px;
  font-size: .78rem; font-weight: 600;
  border: 1px solid var(--dt-border);
  background: var(--dt-card-bg);
  transition: border-color .2s;
}
.dt-flow-step:hover { border-color: rgba(34,211,238,.25); }
.dt-flow-arrow { opacity: .35; font-size: .75rem; }

/* ─── EJES DUALES ─── */
.dt-axes {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  margin: 20px 0;
  align-items: stretch;
}
.dt-axis {
  border-radius: 12px;
  padding: 22px 20px;
  border: 1px solid var(--dt-border);
}
.dt-axis--time   { border-color: rgba(139,92,246,.25); background: rgba(139,92,246,.04); }
.dt-axis--km     { border-color: rgba(34,211,238,.25); background: rgba(34,211,238,.04); }
.dt-axis-vs {
  display: flex; align-items: center; justify-content: center;
  padding: 0 16px; font-size: .7rem; font-weight: 800;
  opacity: .35; text-transform: uppercase; letter-spacing: 2px;
}
.dt-axis h4 {
  font-size: .95rem; font-weight: 800; margin: 0 0 8px;
  display: flex; align-items: center; gap: 8px;
}
.dt-axis p { font-size: .83rem; opacity: .75; margin: 0 0 12px; }
.dt-axis ul { padding-left: 18px; margin: 0; }
.dt-axis li { font-size: .82rem; opacity: .75; margin-bottom: 4px; }

/* ─── NIVELES RRHH ─── */
.dt-levels {
  display: flex; flex-direction: column; gap: 12px;
  margin: 16px 0;
}
.dt-level {
  border-radius: 12px; padding: 18px 20px;
  border: 1px solid var(--dt-border);
  position: relative; overflow: hidden;
}
.dt-level::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px;
}
.dt-level--2::before { background: var(--dt-emerald); }
.dt-level--1a::before { background: var(--dt-cyan); }
.dt-level--1b::before { background: var(--dt-violet); }
.dt-level-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
}
.dt-level-num {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 800; flex-shrink: 0;
}
.dt-level--2  .dt-level-num { background: rgba(16,185,129,.15); color: var(--dt-emerald); }
.dt-level--1a .dt-level-num { background: var(--dt-cyan-dim); color: var(--dt-cyan); }
.dt-level--1b .dt-level-num { background: rgba(139,92,246,.12); color: var(--dt-violet); }
.dt-level h4 { font-size: .92rem; font-weight: 700; margin: 0; }
.dt-level p  { font-size: .84rem; opacity: .75; margin: 0 0 8px; }

/* ─── STACK TECH ─── */
.dt-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px; margin: 16px 0;
}
.dt-stack-card {
  border-radius: 12px; padding: 16px 18px;
  border: 1px solid var(--dt-border);
  background: var(--dt-card-bg);
  transition: border-color .2s, transform .15s;
}
.dt-stack-card:hover { border-color: rgba(34,211,238,.2); transform: translateY(-2px); }
.dt-stack-card-icon { font-size: 1.4rem; margin-bottom: 8px; }
.dt-stack-card h5 { font-size: .85rem; font-weight: 700; margin: 0 0 4px; }
.dt-stack-card p  { font-size: .75rem; opacity: .6; margin: 0; }

/* ─── DIAGRAMA SVG ─── */
.dt-svg-wrapper { overflow-x: auto; margin: 20px 0; }
.dt-svg-wrapper svg { min-width: 560px; }

/* ─── FOOTER ─── */
.dt-footer {
  text-align: center; padding: 36px 0;
  border-top: 1px solid var(--dt-border);
  opacity: .4; font-size: .75rem;
}
.dt-footer img { width: 28px; margin-bottom: 8px; display: block; margin: 0 auto 8px; filter: drop-shadow(0 0 8px var(--dt-cyan-glow)); }
`;

const DocumentacionTecnica = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{css}</style>
      <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
        <div className="doc-tech">

          {/* ═══ PORTADA HERO ═══ */}
          <div className="dt-hero">
            <img src="/favicon.png" alt="" className="dt-hero-logo" />
            <h1>Documentación Técnica de Cálculos</h1>
            <p className="dt-hero-sub">Cotizador Logístico — Motor Interno, Fórmulas y Variables</p>
            <span className="dt-hero-badge">CCT 40/89 · DOCUMENTO CONFIDENCIAL · {year}</span>
          </div>

          {/* ═══ TOC ═══ */}
          <div className="dt-toc">
            <h2>📑 Índice</h2>
            <div className="dt-toc-grid">
              <a href="#pipeline"><span className="dt-toc-num">01</span>Pipeline General</a>
              <a href="#viajes"><span className="dt-toc-num">02</span>Cálculo de Viajes</a>
              <a href="#ejes"><span className="dt-toc-num">03</span>Los Dos Ejes del Motor</a>
              <a href="#vehiculo"><span className="dt-toc-num">04</span>Motor: Vehículo</a>
              <a href="#rrhh"><span className="dt-toc-num">05</span>Motor: RRHH — CCT 40/89</a>
              <a href="#consolidacion"><span className="dt-toc-num">06</span>Consolidación Final</a>
              <a href="#constantes"><span className="dt-toc-num">07</span>Constantes del Sistema</a>
              <a href="#flujo"><span className="dt-toc-num">08</span>Diagrama de Flujo</a>
              <a href="#stack"><span className="dt-toc-num">09</span>Stack Técnico</a>
              <a href="#reglas"><span className="dt-toc-num">10</span>Reglas de Negocio</a>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 01 — PIPELINE GENERAL                                      */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="pipeline">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--cyan">⚡</div>
              <div>
                <div className="dt-num">Sección 01</div>
                <h2>Pipeline General de Cálculo</h2>
              </div>
            </div>

            <p>Cada vez que el usuario modifica datos en el cotizador, el sistema ejecuta un pipeline de 5 etapas que genera el precio final. El flujo es completamente funcional (sin efectos laterales): los mismos inputs siempre producen el mismo output.</p>

            <div className="dt-flow">
              <div className="dt-flow-step">📊 Calcular Viajes Mensuales</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">🚛 Motor Vehículo</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">👤 Motor RRHH</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">📋 Consolidación</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">💰 Precio Final</div>
            </div>

            <h3>Entradas del Sistema</h3>
            <table className="dt-table">
              <thead><tr><th>Variable</th><th>Origen</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>kmsPorViaje</strong></td><td>Paso 1 (Ruta)</td><td>Distancia total del recorrido calculada por Google Maps</td></tr>
                <tr><td><strong>duracionMin</strong></td><td>Paso 1 (Ruta)</td><td>Duración estimada del viaje en minutos</td></tr>
                <tr><td><strong>detallesCarga</strong></td><td>Paso 1 (Ruta)</td><td>Tipo de carga: general, refrigerada o peligrosa</td></tr>
                <tr><td><strong>frecuencia</strong></td><td>Paso 2</td><td>Tipo (esporádico/mensual), días seleccionados, viajes por día</td></tr>
                <tr><td><strong>vehiculoDatos</strong></td><td>Paso 3</td><td>Objeto completo con todos los datos técnicos y económicos del vehículo</td></tr>
                <tr><td><strong>recursoDatos</strong></td><td>Paso 4</td><td>Objeto completo con datos del colaborador (sueldo, adicionales, tipo)</td></tr>
                <tr><td><strong>configuracion</strong></td><td>Paso 5</td><td>Margen %, admin %, peajes, otros costos, datos del cliente</td></tr>
                <tr><td><strong>constantesCalculo</strong></td><td>Config Global</td><td>Umbrales de tiempo, km mínimos, factores, IVA — leídos desde la DB del usuario</td></tr>
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 02 — CÁLCULO DE VIAJES                                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="viajes">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--violet">🔄</div>
              <div>
                <div className="dt-num">Sección 02</div>
                <h2>Cálculo de Viajes Mensuales</h2>
              </div>
            </div>

            <p>El primer paso determina cuántos viajes se realizarán en el mes, según el tipo de frecuencia:</p>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--cyan">Esporádico</span></div>
              <div className="dt-formula">
                <span className="result">viajes_mensuales</span> = vueltasTotales<br/>
                <span className="comment">// El usuario define directamente cuántos viajes se harán</span>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--amber">Mensual</span></div>
              <div className="dt-formula">
                dias_base = cantidad_dias_seleccionados × 4.33<br/>
                dias_efectivos = máximo(dias_base − feriados_por_mes, 0)<br/>
                <span className="result">viajes_mensuales</span> = dias_efectivos × viajes_por_dia
              </div>
              <p>Donde <strong>4.33</strong> es el promedio de semanas por mes (52 ÷ 12). Configurable desde Configuración Global.</p>
            </div>

            <h3>Ajuste por Feriados Nacionales</h3>
            <p>Cuando la frecuencia es mensual y se seleccionan <strong>4 o más días por semana</strong>, el sistema consulta automáticamente la API de feriados nacionales argentinos (<code>date.nager.at</code>) y calcula cuántos caen en días operativos durante el año:</p>

            <div className="dt-formula">
              feriados_en_dias_operativos = contar feriados del año cuyo día de semana esté en los días seleccionados<br/>
              <span className="result">feriados_por_mes</span> = feriados_en_dias_operativos ÷ 12
            </div>

            <div className="dt-tip dt-tip--cyan">
              <span className="dt-tip-icon">💡</span>
              <div>Los feriados se <strong>cachean en memoria</strong> por año para evitar llamadas repetidas a la API. El umbral de activación es <strong>4 días o más</strong> por semana (no 5): el código verifica <code>diasSeleccionados.length {'>='} 4</code>.</div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 03 — LOS DOS EJES DEL MOTOR                                */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="ejes">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--emerald">⚖️</div>
              <div>
                <div className="dt-num">Sección 03</div>
                <h2>Los Dos Ejes del Motor — Concepto Clave</h2>
              </div>
            </div>

            <p>Esta es la parte más importante para entender cómo funciona el motor. Existe una <strong>confusión frecuente</strong> entre dos variables que parecen similares pero controlan cosas completamente distintas. Son <strong>ejes independientes</strong>:</p>

            <div className="dt-axes">
              <div className="dt-axis dt-axis--time">
                <h4>🕐 Eje 1 — Tiempo <span className="dt-badge dt-badge--violet">180 min</span></h4>
                <p>Controla <strong>cuánto se cobra por el tiempo</strong> del chofer y del vehículo. Es un umbral de facturación por ocupación.</p>
                <ul>
                  <li>Vehículo: ¿prorrateo proporcional o 100% del costo diario?</li>
                  <li>RRHH: ¿mínimo facturable, proporcional, o jornal completo?</li>
                  <li>Se calcula sobre: <code>duracionMin + tiempoCargaDescarga</code></li>
                </ul>
              </div>
              <div className="dt-axis-vs">vs</div>
              <div className="dt-axis dt-axis--km">
                <h4>📏 Eje 2 — Kilómetros <span className="dt-badge dt-badge--cyan">200 km</span></h4>
                <p>Controla <strong>el mínimo km facturable</strong> en los adicionales por km del colaborador. Es una política comercial.</p>
                <ul>
                  <li>Ruta &lt; umbral → mínimo corto (ej: 150 km)</li>
                  <li>Ruta ≥ umbral → mínimo largo (ej: 350 km = CCT)</li>
                  <li>Se calcula sobre: <code>kmsPorViaje</code> (distancia del viaje, no tiempo)</li>
                </ul>
              </div>
            </div>

            <div className="dt-tip dt-tip--amber">
              <span className="dt-tip-icon">⚠️</span>
              <div><strong>Error conceptual frecuente:</strong> el tiempo del viaje (lento vs rápido) NO determina el km mínimo. Un vuelo de autopista de 300 km en 2 horas usa el mínimo largo (300 ≥ 200 km). Un reparto urbano de 50 km en 4 horas usa el mínimo corto (50 &lt; 200 km). El tiempo no es el criterio — los kilómetros sí.</div>
            </div>

            <h3>¿Por qué existe el mínimo corto ({'<'} CCT)?</h3>
            <p>El <strong>CCT 40/89 obliga a pagar 350 km mínimo al chofer siempre</strong>. Sin embargo, cobrarle 350 km a un cliente por una entrega de 50 km en CABA hace el precio inviable comercialmente. La solución: para rutas cortas, la empresa traslada un mínimo mayor (ej: 150 km) y absorbe la diferencia con el CCT — asumiendo que esas rutas cortas conviven con otras entregas que cubren el gap, o que el driver tiene tiempo disponible para más trabajo en el mismo día.</p>

            <div className="dt-tip dt-tip--emerald">
              <span className="dt-tip-icon">🎛️</span>
              <div><strong>Todos los umbrales son ahora configurables</strong> desde Configuración Global → Constantes de Cálculo: <code>umbralKmRutaLarga</code>, <code>kmMinimoRutaCorta</code> y <code>kmMinimoRutaLarga</code>. No es necesario tocar el código para ajustar la política de km mínimos.</div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 04 — MOTOR VEHÍCULO                                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="vehiculo">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--cyan">🚛</div>
              <div>
                <div className="dt-num">Sección 04</div>
                <h2>Motor de Costos: Vehículo</h2>
              </div>
            </div>

            <p>Recibe los datos del vehículo, kilómetros por viaje, viajes mensuales, duración y tipo de carga. Calcula en 4 etapas:</p>

            <h3>Etapa 1: Preparación</h3>
            <div className="dt-formula">
              tiempo_total_mision = duracion_min + tiempoCargaDescargaMin <span className="comment">// ej: + 30 min</span><br/>
              <span className="result">kms_mensuales</span> = kms_por_viaje × viajes_mensuales
            </div>

            <h3>Etapa 2: Costos Variables por Kilómetro</h3>

            <div className="dt-card">
              <div className="dt-card-title">📉 Depreciación</div>
              <div className="dt-formula">
                antiguedad = año_actual − año_fabricacion<br/>
                <span className="comment">// Solo aplica para vehículos con ≤10 años de antigüedad</span><br/><br/>
                valor_residual = precio_vehiculo_nuevo × (valorResidualPorcentaje ÷ 100)<br/>
                valor_a_depreciar = precio_vehiculo_nuevo − valor_residual<br/>
                meses_vida_util = kms_vida_util ÷ kms_mensuales<br/>
                <span className="result">depreciacion_mensual</span> = valor_a_depreciar ÷ meses_vida_util
              </div>
              <p>Ejemplo: vehículo de $30M, residual 30% → deprecia $21M en 500.000 km. A 5.000 km/mes → 100 meses → $210.000/mes.</p>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">🛞 Cubiertas</div>
              <div className="dt-formula">
                costo_juego = precio_cubierta × cantidad_cubiertas<br/>
                <span className="result">cubiertas_mensual</span> = costo_juego ÷ (kmsVidaUtilCubiertas ÷ kms_mensuales)
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">🛢️ Aceite</div>
              <div className="dt-formula">
                <span className="result">aceite_mensual</span> = precio_cambio_aceite ÷ (kmsCambioAceite ÷ kms_mensuales)
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">⛽ Combustible</div>
              <div className="dt-formula">
                <span className="comment">// Para Nafta / Gasoil:</span><br/>
                precio_efectivo = precioLitroCombustible<br/>
                &nbsp;&nbsp;× factorCargaRefrigerada <span className="comment">  // ×1.25 si es REFRIGERADA</span><br/>
                combustible_por_km = precio_efectivo ÷ rendimientoKmLitro<br/><br/>
                <span className="comment">// Para GNC:</span><br/>
                rendimiento_gnc = rendimientoKmLitro × factorRendimientoGNC <span className="comment">// ×1.15</span><br/>
                combustible_por_km = precioGNC ÷ rendimiento_gnc<br/><br/>
                <span className="result">combustible_mensual</span> = combustible_por_km × kms_mensuales
              </div>
              <p><strong>Factor refrigerada (×1.25):</strong> el equipo de frío consume ~25% más combustible. Solo aplica a combustible líquido, no a GNC (el equipo de frío no cambia el rendimiento del gas).</p>
            </div>

            <h3>Etapa 3: Costos Fijos Prorrateados por Tiempo (EJE 1)</h3>
            <p>Aquí entra el <strong>Eje 1 de tiempo</strong>. Los costos fijos (mantenimiento, seguro, patentes) se asignan según cuánto tiempo ocupa el vehículo ese día:</p>

            <div className="dt-formula">
              costos_fijos_mensuales = mantenimiento + seguro + patente_municipal + patente_provincial<br/>
              costo_fijo_diario = costos_fijos_mensuales ÷ diasLaboralesMes <span className="comment">// ej: ÷ 22</span><br/><br/>
              <span className="comment">// Decisión clave según el umbral de tiempo (umbralJornadaCompletaMin, ej: 180 min):</span><br/><br/>
              <span className="key">SI</span> tiempo_total_mision &lt; umbralJornadaCompletaMin:<br/>
              &nbsp;&nbsp;proporcion = tiempo_total_mision ÷ jornadaCompletaMinutos <span className="comment">// fracción de la jornada de 8h</span><br/><br/>
              <span className="key">SI</span> tiempo_total_mision ≥ umbralJornadaCompletaMin:<br/>
              &nbsp;&nbsp;proporcion = 1.0 <span className="comment">// el vehículo quedó comprometido todo el día</span><br/><br/>
              <span className="result">costos_fijos_prorrateados</span> = (costo_fijo_diario × proporcion) × viajes_mensuales
            </div>

            <h3>Etapa 4: Total Vehículo</h3>
            <div className="dt-formula">
              <span className="result">total_vehiculo</span> = depreciacion + cubiertas + aceite + combustible + costos_fijos_prorrateados
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 05 — MOTOR RECURSO HUMANO                                  */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="rrhh">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--emerald">👤</div>
              <div>
                <div className="dt-num">Sección 05</div>
                <h2>Motor de Costos: Recurso Humano — CCT 40/89</h2>
              </div>
            </div>

            <p>El motor más complejo del sistema. Los valores del CCT (sueldo, adicionales, viáticos) <strong>no están hardcodeados</strong> — se leen desde la Configuración Global de cada usuario y deben actualizarse con cada nueva escala del convenio.</p>

            <h3>Preparación común a todos los niveles</h3>
            <div className="dt-formula">
              sueldo_ajustado = sueldoBasico × (1 + adicionalActividadPorc ÷ 100)<br/>
              jornal_cct = sueldo_ajustado ÷ divisorJornalCCT <span className="comment">// sueldo ÷ 24 según CCT</span><br/>
              costo_por_minuto = jornal_cct ÷ jornadaCompletaMinutos <span className="comment">// ÷ 480 min = 8h</span><br/><br/>
              tiempo_total_mision = duracion_min + tiempoCargaDescargaMin<br/>
              es_servicio_mensual = frecuencia.tipo === 'mensual'<br/>
              dias_por_semana = frecuencia.diasSeleccionados.length<br/>
              <span className="key">es_sueldo_completo</span> = es_servicio_mensual <span className="key">AND</span> dias_por_semana ≥ 4
            </div>

            <h3>Los 3 Niveles de Facturación</h3>
            <p>El motor tiene tres niveles de cálculo, no dos. El primero es el más importante y determina los otros:</p>

            <div className="dt-levels">
              <div className="dt-level dt-level--2">
                <div className="dt-level-header">
                  <div className="dt-level-num">N2</div>
                  <h4>Sueldo Mensual Completo <span className="dt-badge dt-badge--emerald">Mensual ≥ 4 días/semana</span></h4>
                </div>
                <p>El chofer está dedicado full-time. Se paga directamente el sueldo mensual ajustado.</p>
                <div className="dt-formula" style={{margin: '8px 0 0'}}>
                  <span className="result">costo_base</span> = sueldo_ajustado <span className="comment">// el mensual completo, directo</span><br/>
                  adicional_fijo = adicionalNoRemunerativoFijo <span className="comment">// 100%, no prorrateado</span><br/><br/>
                  <span className="comment">// Horas extra: solo si un viaje individual supera 8h (raro)</span><br/>
                  minutos_extra = máximo(0, tiempo_total_mision − 480)<br/>
                  <span className="result">costo_base</span> += minutos_extra × costo_por_minuto × 1.5 × viajes_mensuales
                </div>
              </div>

              <div className="dt-level dt-level--1a">
                <div className="dt-level-header">
                  <div className="dt-level-num">N1A</div>
                  <h4>Jornada Completa por Viaje <span className="dt-badge dt-badge--cyan">tiempo_mision ≥ 180 min</span></h4>
                </div>
                <p>Aplica cuando la misión no activa el Nivel 2 (esporádico, o mensual con menos de 4 días). Si el viaje dura ≥ 3 horas, se cobra un jornal completo por viaje.</p>
                <div className="dt-formula" style={{margin: '8px 0 0'}}>
                  tiempo_a_facturar = máximo(tiempo_total_mision, minimoMinutosFacturables)<br/><br/>
                  <span className="comment">// Si supera las 8h → horas extra con recargo CCT ×1.5:</span><br/>
                  <span className="key">SI</span> tiempo_a_facturar &gt; 480 min:<br/>
                  &nbsp;&nbsp;extra_min = tiempo_a_facturar − 480<br/>
                  &nbsp;&nbsp;costo_viaje = jornal_cct + (extra_min × costo_por_minuto × 1.5)<br/><br/>
                  <span className="comment">// Si entre 3h y 8h → jornal completo:</span><br/>
                  <span className="key">SI</span> tiempo_a_facturar ≥ umbralJornadaCompletaMin (180):<br/>
                  &nbsp;&nbsp;costo_viaje = jornal_cct<br/><br/>
                  <span className="result">costo_base</span> = costo_viaje × viajes_mensuales
                </div>
              </div>

              <div className="dt-level dt-level--1b">
                <div className="dt-level-header">
                  <div className="dt-level-num">N1B</div>
                  <h4>Proporcional / Mínimo Facturable <span className="dt-badge dt-badge--violet">tiempo_mision {'<'} 180 min</span></h4>
                </div>
                <p>Viajes cortos dentro del Nivel 1. Se cobra proporcionalmente al tiempo, con un mínimo configurable (ej: 120 min = 2 horas).</p>
                <div className="dt-formula" style={{margin: '8px 0 0'}}>
                  tiempo_a_facturar = máximo(tiempo_total_mision, minimoMinutosFacturables)<br/><br/>
                  <span className="comment">// Si exactamente dura el mínimo:</span><br/>
                  costo_viaje = minimoMinutosFacturables × costo_por_minuto<br/><br/>
                  <span className="comment">// Si entre mínimo y 3h → proporcional:</span><br/>
                  costo_viaje = tiempo_a_facturar × costo_por_minuto<br/><br/>
                  <span className="result">costo_base</span> = costo_viaje × viajes_mensuales
                </div>
              </div>
            </div>

            <div className="dt-tip dt-tip--violet">
              <span className="dt-tip-icon">⚖️</span>
              <div><strong>Horas extra CCT 40/89:</strong> cuando la jornada supera 8 horas (480 min), los minutos adicionales se abonan con un recargo del <strong>50% (factor ×1.5)</strong> sobre el valor del minuto normal. Esto aplica tanto en N2 (sueldo completo) como en N1A.</div>
            </div>

            <h3>Costos por Kilómetro (EJE 2) — igual para los 3 niveles</h3>
            <p>Independientemente del nivel de facturación por tiempo, los adicionales por km se calculan siempre de la misma manera, usando el <strong>Eje 2 de kilómetros</strong>:</p>

            <div className="dt-formula">
              km_reales_totales = kms_por_viaje × viajes_mensuales<br/><br/>
              <span className="comment">// EJE 2: el mínimo depende de los km del VIAJE (no del tiempo)</span><br/>
              <span className="key">SI</span> kms_por_viaje &lt; umbralKmRutaLarga (ej: 200 km):<br/>
              &nbsp;&nbsp;km_minimo = kmMinimoRutaCorta (ej: 150 km)<br/>
              <span className="key">SI</span> kms_por_viaje ≥ umbralKmRutaLarga:<br/>
              &nbsp;&nbsp;km_minimo = kmMinimoRutaLarga (ej: 350 km = CCT)<br/><br/>
              <span className="comment">// Para mensual: mínimo aplica al total del mes (1 vez)</span><br/>
              <span className="comment">// Para esporádico: mínimo aplica por viaje (×cantidad de viajes)</span><br/>
              km_minimo_total = km_minimo × (es_mensual ? 1 : cantidad_viajes)<br/>
              <span className="result">km_a_pagar</span> = máximo(km_reales_totales, km_minimo_total)<br/><br/>
              adicional_km = adicionalKmRemunerativo × km_a_pagar <span className="comment">// $/km</span><br/>
              viatico_km = viaticoPorKmNoRemunerativo × km_a_pagar <span className="comment">// $/km</span><br/><br/>
              <span className="comment">// Adicional carga/descarga (por tramos de ruta):</span><br/>
              tramos = km_reales ÷ kmPorUnidadDeCarga<br/>
              <span className="result">adicional_carga_descarga</span> = tramos × adicionalCargaDescargaCadaXkm
            </div>

            <div className="dt-tip dt-tip--cyan">
              <span className="dt-tip-icon">📌</span>
              <div><strong>Km mínimos — esporádico vs mensual:</strong> para servicios esporádicos, el mínimo se multiplica por la cantidad de viajes porque cada viaje es un evento independiente con su propio CCT mínimo. Para servicios mensuales, el mínimo aplica una sola vez sobre el total del mes (que generalmente lo supera con creces).</div>
            </div>

            <h3>Consolidación del RRHH</h3>
            <div className="dt-formula">
              base_remunerativa = costo_base + adicional_km + adicional_carga_descarga<br/>
              <span className="comment">// Nota: las horas extra ya están DENTRO de costo_base, no se suman de nuevo</span><br/><br/>
              <span className="key">SI Empleado (CCT 40/89):</span><br/>
              &nbsp;&nbsp;cargas_sociales = base_remunerativa × (porcentajeCargasSociales ÷ 100)<br/><br/>
              <span className="key">SI Contratado (Factor sobre empleado):</span><br/>
              &nbsp;&nbsp;costo_equivalente_cct = calcular_como_empleado_cct()<br/>
              &nbsp;&nbsp;cargas_sociales = 0 <span className="comment">// absorbidas en el factor</span><br/>
              &nbsp;&nbsp;costo_base = costo_equivalente_cct × (factorSobreEmpleado ÷ 100)<br/><br/>
              <span className="result">total_rrhh</span> = base_remunerativa + adicional_fijo + viatico_km + cargas_sociales
            </div>

            <div className="dt-tip dt-tip--emerald">
              <span className="dt-tip-icon">💡</span>
              <div><strong>Empleado vs Contratado:</strong> para contratados, el sistema calcula el costo del empleado CCT equivalente y aplica el factor configurado (default 75%). Este factor refleja el ahorro real en cargas patronales, SAC, vacaciones y ART que no aplican en una relación comercial. El factor es ajustable desde Configuración Global.</div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 06 — CONSOLIDACIÓN FINAL                                   */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="consolidacion">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--amber">💰</div>
              <div>
                <div className="dt-num">Sección 06</div>
                <h2>Consolidación Final del Precio</h2>
              </div>
            </div>

            <p>Una vez que ambos motores generan sus totales, el sistema los consolida en 6 capas:</p>

            <div className="dt-formula">
              <span className="comment">// ═══ CAPA 1: Subtotal Operativo base ═══</span><br/>
              subtotal_parcial = total_vehiculo + total_rrhh<br/><br/>
              <span className="comment">// ═══ CAPA 2: Gastos Administrativos (% sobre subtotal) ═══</span><br/>
              total_administrativo = subtotal_parcial × (costoAdministrativo ÷ 100)<br/><br/>
              <span className="comment">// ═══ CAPA 3: Peajes y Otros Costos ═══</span><br/>
              total_peajes = costo_peaje_por_viaje × viajes_mensuales<br/>
              otros_costos = monto_fijo_ingresado<br/><br/>
              <span className="comment">// ═══ CAPA 4: Recargo Carga Peligrosa ═══</span><br/>
              <span className="key">SI</span> carga = peligrosa:<br/>
              &nbsp;&nbsp;adicional_peligrosa = kms_mensuales × costoAdicionalKmPeligrosa <span className="comment">// $/km configurable</span><br/><br/>
              <span className="comment">// ═══ CAPA 5: Total Operativo ═══</span><br/>
              <span className="result">total_operativo</span> = vehículo + rrhh + admin + peajes + otros + peligrosa<br/><br/>
              <span className="comment">// ═══ CAPA 6: Ganancia ═══</span><br/>
              ganancia = total_operativo × (porcentajeGanancia ÷ 100)<br/><br/>
              <span className="comment">// ═══ PRECIO FINAL ═══</span><br/>
              <span className="result">total_final</span> = total_operativo + ganancia<br/>
              monto_iva = total_final × (porcentajeIVA ÷ 100) <span className="comment">// default 21%</span><br/>
              <span className="result">total_con_iva</span> = total_final + monto_iva
            </div>

            <div className="dt-tip dt-tip--amber">
              <span className="dt-tip-icon">⚠️</span>
              <div><strong>Orden importante:</strong> los gastos administrativos se calculan sobre el subtotal vehículo+RRHH (no sobre el total final). La ganancia se aplica DESPUÉS del administrativo, peajes y peligrosa — sobre el total operativo completo. Cambiar el orden produce precios distintos.</div>
            </div>

            <h3>Salida del Sistema</h3>
            <table className="dt-table">
              <thead><tr><th>Campo</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>totalVehiculo</strong></td><td>Costos variables + costos fijos prorrateados del vehículo</td></tr>
                <tr><td><strong>totalRecurso</strong></td><td>Costo total del recurso humano (sueldo + km + cargas)</td></tr>
                <tr><td><strong>totalAdministrativo</strong></td><td>% admin sobre subtotal vehículo+RRHH</td></tr>
                <tr><td><strong>totalPeajes</strong></td><td>Peajes por viaje × viajes mensuales</td></tr>
                <tr><td><strong>otrosCostos</strong></td><td>Monto fijo extra ingresado en la configuración</td></tr>
                <tr><td><strong>costoAdicionalPeligrosa</strong></td><td>Recargo por km para carga peligrosa</td></tr>
                <tr><td><strong>totalOperativo</strong></td><td>Suma de todos los costos anteriores</td></tr>
                <tr><td><strong>ganancia</strong></td><td>Margen % aplicado sobre el total operativo</td></tr>
                <tr><td><strong>totalFinal</strong></td><td>Precio de venta al cliente, sin IVA</td></tr>
                <tr><td><strong>totalConIVA</strong></td><td>Total final × (1 + porcentajeIVA/100)</td></tr>
                <tr><td><strong>cantidadViajesMensuales</strong></td><td>Viajes calculados, para referencia en el desglose</td></tr>
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 07 — CONSTANTES DEL SISTEMA                                */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="constantes">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--rose">🔧</div>
              <div>
                <div className="dt-num">Sección 07</div>
                <h2>Constantes del Sistema</h2>
              </div>
            </div>

            <p>Las constantes se dividen en dos grupos: las que se pueden modificar desde <strong>Configuración Global</strong> y las pocas que están fijas en el código por ser definiciones legales o matemáticas inmutables.</p>

            <h3>Configurables desde Configuración Global</h3>
            <table className="dt-table">
              <thead><tr><th>Constante</th><th>Default</th><th>Unidad</th><th>Función</th></tr></thead>
              <tbody>
                <tr><td><strong>tiempoCargaDescargaMin</strong></td><td>30</td><td>min</td><td>Se suma a la duración del viaje para calcular ocupación real</td></tr>
                <tr><td><strong>umbralJornadaCompletaMin</strong></td><td>180</td><td>min</td><td>Umbral Eje 1 de tiempo: por encima → jornada completa y 100% costo fijo</td></tr>
                <tr><td><strong>jornadaCompletaMinutos</strong></td><td>480</td><td>min</td><td>Duración de la jornada laboral completa (8 horas)</td></tr>
                <tr><td><strong>divisorJornalCCT</strong></td><td>24</td><td>divisor</td><td>Sueldo mensual ÷ 24 = jornal diario (según CCT 40/89)</td></tr>
                <tr><td><strong>semanasPorMes</strong></td><td>4.33</td><td>semanas</td><td>Multiplicador para frecuencia mensual (52 semanas ÷ 12)</td></tr>
                <tr><td><strong>diasLaboralesMes</strong></td><td>22</td><td>días</td><td>Divisor para costo fijo diario del vehículo</td></tr>
                <tr><td><strong>factorRendimientoGNC</strong></td><td>1.15</td><td>×</td><td>GNC rinde 15% más que nafta por m³ equivalente</td></tr>
                <tr><td><strong>factorCargaRefrigerada</strong></td><td>1.25</td><td>×</td><td>+25% consumo de combustible por equipo de frío</td></tr>
                <tr><td><strong>costoAdicionalKmPeligrosa</strong></td><td>350</td><td>$/km</td><td>Recargo por km para carga peligrosa (seguro y protocolo)</td></tr>
                <tr><td><strong>porcentajeIVA</strong></td><td>21</td><td>%</td><td>IVA sobre precio de venta</td></tr>
                <tr><td><strong>umbralKmRutaLarga</strong></td><td>200</td><td>km</td><td>Eje 2: km del viaje que activa el mínimo largo en additionals RRHH</td></tr>
                <tr><td><strong>kmMinimoRutaCorta</strong></td><td>150</td><td>km</td><td>Mínimo km facturable al cliente en rutas cortas</td></tr>
                <tr><td><strong>kmMinimoRutaLarga</strong></td><td>350</td><td>km</td><td>Mínimo km facturable al cliente en rutas largas (= CCT)</td></tr>
              </tbody>
            </table>

            <h3>Fijas en el código (no configurables)</h3>
            <table className="dt-table">
              <thead><tr><th>Constante</th><th>Valor</th><th>Justificación</th></tr></thead>
              <tbody>
                <tr><td><strong>FACTOR_HORAS_EXTRA</strong></td><td>1.5×</td><td>Recargo legal CCT 40/89 — no se puede modificar por convenio</td></tr>
                <tr><td><strong>ANTIGÜEDAD_MAX_DEPRECIACIÓN</strong></td><td>10 años</td><td>Vehículos más viejos se consideran sin valor depreciable residual activo</td></tr>
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 08 — DIAGRAMA DE FLUJO                                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="flujo">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--violet">🔀</div>
              <div>
                <div className="dt-num">Sección 08</div>
                <h2>Diagrama de Decisiones del Motor</h2>
              </div>
            </div>

            <p>El motor ejecuta 5 decisiones clave en secuencia. Cada decisión tiene ramas que determinan qué fórmula aplica:</p>

            <div className="dt-svg-wrapper">
              <svg viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',fontFamily:'Inter,sans-serif'}}>
                {/* Colores */}
                <defs>
                  <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="rgba(148,163,184,.5)"/>
                  </marker>
                </defs>

                {/* Nodo 1 — Frecuencia */}
                <rect x="240" y="10" width="220" height="44" rx="8" fill="rgba(34,211,238,.1)" stroke="rgba(34,211,238,.4)" strokeWidth="1.5"/>
                <text x="350" y="28" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="700">❓ ¿Qué tipo de frecuencia?</text>
                <text x="350" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Esporádico vs Mensual</text>

                {/* Flechas desde frecuencia */}
                <line x1="240" y1="32" x2="130" y2="80" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <line x1="460" y1="32" x2="570" y2="80" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <text x="160" y="68" textAnchor="middle" fill="#94a3b8" fontSize="9">Esporádico</text>
                <text x="540" y="68" textAnchor="middle" fill="#94a3b8" fontSize="9">Mensual</text>

                {/* Resultado esporádico */}
                <rect x="50" y="82" width="160" height="34" rx="7" fill="rgba(139,92,246,.08)" stroke="rgba(139,92,246,.3)" strokeWidth="1.3"/>
                <text x="130" y="104" textAnchor="middle" fill="#8b5cf6" fontSize="10">viajes = vueltasTotales</text>

                {/* Resultado mensual */}
                <rect x="490" y="82" width="160" height="34" rx="7" fill="rgba(245,158,11,.08)" stroke="rgba(245,158,11,.3)" strokeWidth="1.3"/>
                <text x="570" y="97" textAnchor="middle" fill="#f59e0b" fontSize="10">viajes = días × 4.33</text>
                <text x="570" y="109" textAnchor="middle" fill="#f59e0b" fontSize="9">− feriados (si ≥ 4 días)</text>

                {/* Nodo 2 — EJE 1 Tiempo */}
                <line x1="350" y1="54" x2="350" y2="148" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <rect x="220" y="150" width="260" height="44" rx="8" fill="rgba(139,92,246,.1)" stroke="rgba(139,92,246,.4)" strokeWidth="1.5"/>
                <text x="350" y="168" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="700">⏱ EJE 1: ¿Cuánto dura la misión?</text>
                <text x="350" y="184" textAnchor="middle" fill="#94a3b8" fontSize="9.5">duracion + carga/descarga vs umbral (180 min)</text>

                {/* Flechas desde tiempo */}
                <line x1="220" y1="172" x2="100" y2="230" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <line x1="480" y1="172" x2="600" y2="230" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <text x="135" y="218" textAnchor="middle" fill="#94a3b8" fontSize="9">{'< 180 min (corto)'}</text>
                <text x="564" y="218" textAnchor="middle" fill="#94a3b8" fontSize="9">{'≥ 180 min (largo)'}</text>

                {/* Resultados EJE 1 */}
                <rect x="20" y="232" width="160" height="44" rx="7" fill="rgba(139,92,246,.07)" stroke="rgba(139,92,246,.25)" strokeWidth="1.2"/>
                <text x="100" y="250" textAnchor="middle" fill="#8b5cf6" fontSize="9.5">Vehíc.: proporción tiempo/8h</text>
                <text x="100" y="264" textAnchor="middle" fill="#8b5cf6" fontSize="9.5">RRHH: mín/prop/jornal (N1)</text>

                <rect x="520" y="232" width="160" height="44" rx="7" fill="rgba(16,185,129,.07)" stroke="rgba(16,185,129,.25)" strokeWidth="1.2"/>
                <text x="600" y="250" textAnchor="middle" fill="#10b981" fontSize="9.5">Vehíc.: 100% costo fijo diario</text>
                <text x="600" y="264" textAnchor="middle" fill="#10b981" fontSize="9.5">RRHH: jornal + extras (N1A)</text>

                {/* Nodo especial N2 */}
                <line x1="350" y1="194" x2="350" y2="240" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <rect x="240" y="242" width="220" height="36" rx="8" fill="rgba(16,185,129,.12)" stroke="rgba(16,185,129,.4)" strokeWidth="1.5"/>
                <text x="350" y="257" textAnchor="middle" fill="#10b981" fontSize="10.5" fontWeight="700">✦ N2: ≥ 4 días/semana mensual</text>
                <text x="350" y="271" textAnchor="middle" fill="#10b981" fontSize="9">→ Sueldo mensual completo</text>

                {/* Nodo 3 — EJE 2 KM */}
                <line x1="350" y1="278" x2="350" y2="320" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <rect x="210" y="322" width="280" height="44" rx="8" fill="rgba(34,211,238,.1)" stroke="rgba(34,211,238,.4)" strokeWidth="1.5"/>
                <text x="350" y="340" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="700">📏 EJE 2: ¿Cuántos km tiene el viaje?</text>
                <text x="350" y="356" textAnchor="middle" fill="#94a3b8" fontSize="9.5">kmsPorViaje vs umbralKmRutaLarga (ej: 200 km)</text>

                {/* Flechas EJE 2 */}
                <line x1="210" y1="344" x2="110" y2="400" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <line x1="490" y1="344" x2="590" y2="400" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <text x="140" y="390" textAnchor="middle" fill="#94a3b8" fontSize="9">{'< umbral (ej < 200 km)'}</text>
                <text x="560" y="390" textAnchor="middle" fill="#94a3b8" fontSize="9">{'≥ umbral (ej ≥ 200 km)'}</text>

                <rect x="30" y="402" width="160" height="34" rx="7" fill="rgba(34,211,238,.07)" stroke="rgba(34,211,238,.25)" strokeWidth="1.2"/>
                <text x="110" y="420" textAnchor="middle" fill="#22d3ee" fontSize="10">km_min = kmMinimoCorto</text>
                <text x="110" y="430" textAnchor="middle" fill="#94a3b8" fontSize="8.5">(ej: 150 km — comercial)</text>

                <rect x="510" y="402" width="160" height="34" rx="7" fill="rgba(34,211,238,.07)" stroke="rgba(34,211,238,.25)" strokeWidth="1.2"/>
                <text x="590" y="420" textAnchor="middle" fill="#22d3ee" fontSize="10">km_min = kmMinimoLargo</text>
                <text x="590" y="430" textAnchor="middle" fill="#94a3b8" fontSize="8.5">(ej: 350 km — CCT)</text>

                {/* Consolidación */}
                <line x1="350" y1="366" x2="350" y2="454" stroke="rgba(148,163,184,.4)" strokeWidth="1.3" markerEnd="url(#arr)"/>
                <rect x="200" y="456" width="300" height="52" rx="9" fill="rgba(245,158,11,.1)" stroke="rgba(245,158,11,.4)" strokeWidth="1.5"/>
                <text x="350" y="476" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">💰 Consolidación Final</text>
                <text x="350" y="492" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Vehículo + RRHH + Admin + Peajes + Peligrosa</text>
                <text x="350" y="504" textAnchor="middle" fill="#f59e0b" fontSize="9.5" fontWeight="600">→ Total Operativo × (1 + margen%) → Precio Final + IVA</text>
              </svg>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 09 — STACK TÉCNICO                                         */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="stack">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--teal">🖥️</div>
              <div>
                <div className="dt-num">Sección 09</div>
                <h2>Stack Técnico del Sistema</h2>
              </div>
            </div>

            <p>Arquitectura full-stack separada en frontend (SPA) y backend (API REST), comunicados via HTTP/JSON con autenticación JWT.</p>

            <div className="dt-stack-grid">
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">⚛️</div>
                <h5>Frontend</h5>
                <p>React 18 + Vite<br/>Mantine UI v7<br/>Lucide Icons</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">🟩</div>
                <h5>Backend</h5>
                <p>Node.js + Express<br/>Nodemon (dev)<br/>Puerto 5010</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">🍃</div>
                <h5>Base de Datos</h5>
                <p>MongoDB (local)<br/>Mongoose ODM<br/>Multi-tenant por usuario</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">🗺️</div>
                <h5>Google Maps API</h5>
                <p>Routes API<br/>Geocoding API<br/>Distancia + duración</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">📅</div>
                <h5>Feriados API</h5>
                <p>date.nager.at<br/>Feriados AR por año<br/>Cache en memoria</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">📧</div>
                <h5>Email</h5>
                <p>Nodemailer<br/>Verificación de cuenta<br/>Reset de contraseña</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">🔐</div>
                <h5>Autenticación</h5>
                <p>JWT (Bearer token)<br/>Google OAuth 2.0<br/>Bcrypt passwords</p>
              </div>
              <div className="dt-stack-card">
                <div className="dt-stack-card-icon">📄</div>
                <h5>PDF / Documentos</h5>
                <p>Print CSS + window.print<br/>QR Code (qrcode.js)<br/>Chart.js (desglose)</p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* 10 — REGLAS DE NEGOCIO                                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="dt-section" id="reglas">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--rose">📋</div>
              <div>
                <div className="dt-num">Sección 10</div>
                <h2>Reglas de Negocio y Arquitectura Multi-Tenant</h2>
              </div>
            </div>

            <h3>Unicidad de Patente por Usuario</h3>
            <p>El modelo de Vehículo usa un índice compuesto <code>{'{ patente: 1, usuario: 1 }'}</code> en MongoDB en lugar de un índice único global. Dos usuarios distintos pueden registrar el mismo vehículo; dentro de una misma cuenta, la patente es única.</p>
            <div className="dt-formula">
              Index: {'{ patente: 1, usuario: 1 }'}, unique: true<br/>
              <span className="comment">// Error 409 con mensaje claro si se intenta duplicar dentro de la misma cuenta</span>
            </div>

            <h3>Vista Pública del Desglose — Filtrado en Backend</h3>
            <p>Existen dos endpoints y dos rutas para el desglose de cada cotización. El filtrado es activo en el backend — no es solo ocultamiento en el frontend:</p>
            <table className="dt-table">
              <thead><tr><th>Ruta</th><th>Endpoint</th><th>Datos sensibles</th></tr></thead>
              <tbody>
                <tr><td><code>/desglose/:id</code></td><td>GET /api/presupuestos/:id</td><td>Incluidos (uso interno)</td></tr>
                <tr><td><code>/d/:id</code></td><td>GET /api/presupuestos/publico/:id</td><td>Filtrados — sin ganancia, sin margen, sin % admin</td></tr>
              </tbody>
            </table>

            <h3>Escala CCT 40/89 — Sin Valores Fijos en el Código</h3>
            <p>Los valores del convenio (sueldo básico, adicionales por km, viáticos, cargas sociales) <strong>no están hardcodeados en el motor de cálculo</strong>. Se leen desde la Configuración Global de cada usuario en el momento de cada cotización. Actualizar la configuración cuando entre en vigencia una nueva escala es suficiente para que todos los presupuestos futuros reflejen los valores correctos, sin tocar el código.</p>

            <h3>Pipeline Funcional Puro</h3>
            <p>La función <code>calcularResumenCostos()</code> es una función pura: no tiene efectos laterales, no escribe en base de datos, no llama APIs externas. Se usa tanto para el preview en tiempo real durante la cotización como para el cálculo final al guardar el presupuesto — garantizando que el preview y el guardado siempre producen el mismo número.</p>
          </div>

          {/* ═══ FOOTER ═══ */}
          <div className="dt-footer">
            <img src="/favicon.png" alt="" />
            <p>Cotizador Logístico — Documentación Técnica de Cálculos</p>
            <p>© {year} — Documento interno confidencial</p>
          </div>

        </div>
      </ScrollArea>
    </>
  );
};

export default DocumentacionTecnica;
