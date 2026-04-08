
import { Container, ScrollArea } from '@mantine/core';

const css = `
/* ═══════════════════════════════════════════════════ */
/* DOCUMENTACIÓN TÉCNICA — ESTILOS INLINE            */
/* ═══════════════════════════════════════════════════ */
.doc-tech {
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--mantine-color-text);
  line-height: 1.7;
}
.doc-tech * { box-sizing: border-box; }

/* HEADER */
.dt-cover {
  text-align: center;
  padding: 48px 0 36px;
  border-bottom: 2px solid rgba(148,163,184,.12);
  margin-bottom: 40px;
}
.dt-cover img { width: 60px; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(34,211,238,.3)); }
.dt-cover h1 {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -.5px;
  margin: 0;
}
.dt-cover .dt-sub {
  font-size: .95rem;
  opacity: .6;
  margin-top: 4px;
}
.dt-cover .dt-badge {
  display: inline-block;
  margin-top: 16px;
  padding: 4px 16px;
  border-radius: 100px;
  background: rgba(34,211,238,.1);
  color: #22d3ee;
  font-size: .75rem;
  font-weight: 700;
}

/* SECTIONS */
.dt-section { margin-bottom: 56px; }
.dt-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(148,163,184,.12);
}
.dt-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.dt-icon--cyan { background: rgba(34,211,238,.12); }
.dt-icon--violet { background: rgba(139,92,246,.12); }
.dt-icon--amber { background: rgba(245,158,11,.12); }
.dt-icon--emerald { background: rgba(16,185,129,.12); }
.dt-icon--rose { background: rgba(244,63,94,.12); }
.dt-num {
  font-size: .6rem;
  opacity: .5;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}
.dt-section h2 {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -.3px;
  margin: 0;
}
.dt-section h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 24px 0 10px;
  color: #22d3ee;
}
.dt-section p, .dt-section li {
  opacity: .8;
  font-size: .9rem;
}
.dt-section ul, .dt-section ol {
  padding-left: 20px;
  margin: 8px 0;
}
.dt-section li { margin-bottom: 5px; }

/* CARDS */
.dt-card {
  border-radius: 12px;
  padding: 18px 22px;
  margin: 14px 0;
  border: 1px solid rgba(148,163,184,.1);
  background: rgba(148,163,184,.04);
}
.dt-card-title {
  font-weight: 700;
  font-size: .9rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dt-card p { opacity: .75; font-size: .85rem; }

/* FORMULA BOX */
.dt-formula {
  border-radius: 10px;
  padding: 16px 20px;
  margin: 12px 0;
  font-family: 'Courier New', Consolas, monospace;
  font-size: .82rem;
  line-height: 1.8;
  border-left: 3px solid #22d3ee;
  background: rgba(34,211,238,.05);
  overflow-x: auto;
}
.dt-formula .comment { opacity: .45; font-style: italic; }

/* TABLES */
.dt-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: .82rem;
}
.dt-table th, .dt-table td {
  padding: 9px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(148,163,184,.1);
}
.dt-table th {
  opacity: .5;
  font-weight: 600;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.dt-table td { opacity: .8; }
.dt-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: .7rem;
  font-weight: 700;
}
.dt-badge--cyan { background: rgba(34,211,238,.12); color: #22d3ee; }
.dt-badge--violet { background: rgba(139,92,246,.12); color: #8b5cf6; }
.dt-badge--amber { background: rgba(245,158,11,.12); color: #f59e0b; }
.dt-badge--emerald { background: rgba(16,185,129,.12); color: #10b981; }
.dt-badge--rose { background: rgba(244,63,94,.12); color: #f43f5e; }

/* TIP BOXES */
.dt-tip {
  border-radius: 10px;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: .85rem;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.dt-tip--cyan { background: rgba(34,211,238,.06); border-left: 3px solid #22d3ee; }
.dt-tip--amber { background: rgba(245,158,11,.06); border-left: 3px solid #f59e0b; }
.dt-tip--violet { background: rgba(139,92,246,.06); border-left: 3px solid #8b5cf6; }
.dt-tip-icon { font-size: 1rem; flex-shrink: 0; }

/* TOC */
.dt-toc {
  border-radius: 12px;
  padding: 28px 32px;
  margin-bottom: 48px;
  border: 1px solid rgba(148,163,184,.1);
  background: rgba(148,163,184,.04);
}
.dt-toc h2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; color: #22d3ee; }
.dt-toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 32px;
}
.dt-toc a {
  color: inherit;
  text-decoration: none;
  font-size: .84rem;
  padding: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(148,163,184,.08);
  transition: color .2s;
}
.dt-toc a:hover { color: #22d3ee; }
.dt-toc-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: 7px;
  background: rgba(34,211,238,.1);
  color: #22d3ee;
  font-size: .65rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* FLOW DIAGRAM */
.dt-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0;
  align-items: center;
}
.dt-flow-step {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: .78rem;
  font-weight: 600;
  border: 1px solid rgba(148,163,184,.1);
  background: rgba(148,163,184,.04);
}
.dt-flow-arrow { opacity: .4; font-size: .75rem; }

/* FOOTER */
.dt-footer {
  text-align: center;
  padding: 32px 0;
  border-top: 1px solid rgba(148,163,184,.1);
  opacity: .4;
  font-size: .75rem;
}
`;

const DocumentacionTecnica = () => {
  return (
    <>
      <style>{css}</style>
      <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
        <div className="doc-tech">

          {/* ═══ PORTADA ═══ */}
          <div className="dt-cover">
            <img src="/favicon.png" alt="" />
            <h1>Documentación Técnica de Cálculos</h1>
            <p className="dt-sub">Cotizador Logístico — Manual Interno de Fórmulas y Variables</p>
            <span className="dt-badge">CCT 40/89 · DOCUMENTO CONFIDENCIAL · {new Date().getFullYear()}</span>
          </div>

          {/* ═══ TABLA DE CONTENIDOS ═══ */}
          <div className="dt-toc">
            <h2>📑 Índice</h2>
            <div className="dt-toc-grid">
              <a href="#pipeline"><span className="dt-toc-num">01</span> Pipeline General</a>
              <a href="#viajes"><span className="dt-toc-num">02</span> Cálculo de Viajes</a>
              <a href="#vehiculo"><span className="dt-toc-num">03</span> Motor: Vehículo</a>
              <a href="#rrhh"><span className="dt-toc-num">04</span> Motor: Recurso Humano (CCT 40/89)</a>
              <a href="#consolidacion"><span className="dt-toc-num">05</span> Consolidación Final</a>
              <a href="#constantes"><span className="dt-toc-num">06</span> Constantes del Sistema</a>
              <a href="#flujo"><span className="dt-toc-num">07</span> Diagrama de Flujo</a>
              <a href="#reglas"><span className="dt-toc-num">08</span> Reglas de Negocio</a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 01 — PIPELINE GENERAL                              */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="pipeline">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--cyan">⚡</div>
              <div>
                <div className="dt-num">Sección 01</div>
                <h2>Pipeline General de Cálculo</h2>
              </div>
            </div>

            <p>Cada vez que el usuario modifica datos en el cotizador, el sistema ejecuta un pipeline de cálculo que genera el precio final. El proceso tiene 3 etapas principales:</p>

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
              <thead><tr><th>Dato</th><th>Origen</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>kmsPorViaje</strong></td><td>Paso 1 (Ruta)</td><td>Distancia total del recorrido calculada por Google Maps</td></tr>
                <tr><td><strong>duracionMin</strong></td><td>Paso 1 (Ruta)</td><td>Duración estimada del viaje en minutos</td></tr>
                <tr><td><strong>detallesCarga</strong></td><td>Paso 1 (Ruta)</td><td>Tipo de carga: general, refrigerada o peligrosa</td></tr>
                <tr><td><strong>frecuencia</strong></td><td>Paso 2</td><td>Tipo (esporádico/mensual), días, viajes por día</td></tr>
                <tr><td><strong>vehiculoDatos</strong></td><td>Paso 3</td><td>Objeto completo con todos los datos del vehículo</td></tr>
                <tr><td><strong>recursoDatos</strong></td><td>Paso 4</td><td>Objeto completo con datos del colaborador</td></tr>
                <tr><td><strong>configuracion</strong></td><td>Paso 5</td><td>Margen, admin %, peajes, otros costos, cliente</td></tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 02 — CÁLCULO DE VIAJES                             */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="viajes">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--violet">🔄</div>
              <div>
                <div className="dt-num">Sección 02</div>
                <h2>Cálculo de Viajes Mensuales</h2>
              </div>
            </div>

            <p>El primer paso del cálculo determina cuántos viajes se realizarán, según el tipo de frecuencia:</p>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--cyan">Esporádico</span></div>
              <div className="dt-formula">
                viajes_mensuales = vueltasTotales<br/>
                <span className="comment">// El usuario define directamente cuántos viajes se harán</span>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--amber">Mensual</span></div>
              <div className="dt-formula">
                dias_base = cantidad_dias_seleccionados × 4.33<br/>
                dias_efectivos = máximo(dias_base − feriados_por_mes, 0)<br/>
                viajes_mensuales = dias_efectivos × viajes_por_dia
              </div>
              <p>Donde <strong>4.33</strong> es el promedio de semanas por mes (52 semanas ÷ 12 meses).</p>
            </div>

            <h3>Ajuste por Feriados</h3>
            <p>Cuando la frecuencia es mensual y se seleccionan 5 o más días por semana, el sistema consulta automáticamente la API de feriados nacionales argentinos y calcula cuántos caen en días operativos:</p>

            <div className="dt-formula">
              feriados_en_dias_operativos = contar feriados del año cuyo día de la semana esté en los días seleccionados<br/>
              feriados_por_mes = feriados_en_dias_operativos ÷ 12
            </div>

            <div className="dt-tip dt-tip--cyan">
              <span className="dt-tip-icon">💡</span>
              <div>Los feriados se cachean en memoria para evitar consultas repetidas a la API. Solo se consultan para operativas que cubren 5+ días por semana.</div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 03 — MOTOR VEHÍCULO                                */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="vehiculo">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--cyan">🚛</div>
              <div>
                <div className="dt-num">Sección 03</div>
                <h2>Motor de Costos: Vehículo</h2>
              </div>
            </div>

            <p>Recibe los datos del vehículo, kilómetros por viaje, viajes mensuales, duración y tipo de carga. Calcula en 4 etapas:</p>

            <h3>Etapa 1: Preparación</h3>
            <div className="dt-formula">
              tiempo_total_mision = duracion_min + 30 <span className="comment">// 30 min carga/descarga</span><br/>
              kms_mensuales = kms_por_viaje × viajes_mensuales
            </div>

            <h3>Etapa 2: Costos Variables</h3>

            <div className="dt-card">
              <div className="dt-card-title">📉 Depreciación</div>
              <div className="dt-formula">
                antiguedad = año_actual − año_fabricacion<br/>
                <span className="comment">// Solo se calcula para vehículos de ≤10 años de antigüedad</span><br/><br/>
                valor_residual = precio_vehiculo_nuevo × (porcentaje_residual ÷ 100)<br/>
                valor_a_depreciar = precio_vehiculo_nuevo − valor_residual<br/>
                meses_vida_util = kms_vida_util ÷ kms_mensuales<br/>
                <strong>depreciacion_mensual = valor_a_depreciar ÷ meses_vida_util</strong>
              </div>
              <p>Ejemplo: Vehículo de $30.000.000, residual 30% ($9.000.000), valor a depreciar $21.000.000. Si la vida útil es 500.000 km y se recorren 5.000 km/mes → 100 meses → $210.000/mes.</p>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">🛞 Cubiertas</div>
              <div className="dt-formula">
                costo_juego = precio_cubierta × cantidad_cubiertas<br/>
                meses_vida_util = kms_vida_util_cubiertas ÷ kms_mensuales<br/>
                <strong>cubiertas_mensual = costo_juego ÷ meses_vida_util</strong>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">🛢️ Aceite</div>
              <div className="dt-formula">
                meses_entre_cambios = kms_cambio_aceite ÷ kms_mensuales<br/>
                <strong>aceite_mensual = precio_cambio_aceite ÷ meses_entre_cambios</strong>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">⛽ Combustible</div>
              <div className="dt-formula">
                <span className="comment">// Para Nafta o Gasoil:</span><br/>
                precio_efectivo = precio_por_litro<br/>
                  <span className="comment">  × 1.25 si la carga es REFRIGERADA</span><br/>
                combustible_por_km = precio_efectivo ÷ rendimiento_km_litro<br/><br/>
                <span className="comment">// Para GNC:</span><br/>
                rendimiento_gnc = rendimiento_km_litro × 1.15<br/>
                combustible_por_km = precio_gnc ÷ rendimiento_gnc<br/><br/>
                <strong>combustible_mensual = combustible_por_km × kms_mensuales</strong>
              </div>
              <p><strong>Factor refrigerada (1.25×):</strong> El equipo de frío consume aproximadamente un 25% adicional de combustible. Solo aplica a combustible líquido (nafta/gasoil), no a GNC.</p>
              <p><strong>Factor GNC (1.15×):</strong> Un metro cúbico de GNC rinde un 15% más que un litro de nafta equivalente.</p>
            </div>

            <h3>Etapa 3: Costos Fijos Prorrateados por Tiempo</h3>
            <p>Esta es la lógica más sofisticada del sistema. Los costos fijos no se dividen simplemente por cantidad de viajes, sino que se asignan <strong>según el tiempo de ocupación</strong> del vehículo:</p>

            <div className="dt-formula">
              costos_fijos_mensuales = mantenimiento + seguro + patente_municipal + patente_provincial<br/>
              costo_fijo_diario = costos_fijos_mensuales ÷ 22 <span className="comment">// 22 días laborales</span><br/><br/>
              <span className="comment">// DECISIÓN CLAVE: ¿El viaje ocupa más o menos de 3 horas?</span><br/><br/>
              <strong>SI</strong> tiempo_total_mision &lt; 180 minutos:<br/>
              &nbsp;&nbsp;proporcion = tiempo_total_mision ÷ 480 <span className="comment">// fracción de la jornada de 8h</span><br/><br/>
              <strong>SI</strong> tiempo_total_mision ≥ 180 minutos:<br/>
              &nbsp;&nbsp;proporcion = 1.0 <span className="comment">// se asigna el 100% del costo diario</span><br/><br/>
              costo_fijo_por_viaje = costo_fijo_diario × proporcion<br/>
              <strong>costos_fijos_prorrateados = costo_fijo_por_viaje × viajes_mensuales</strong>
            </div>

            <div className="dt-tip dt-tip--amber">
              <span className="dt-tip-icon">⚠️</span>
              <div><strong>Umbral de 3 horas (180 min):</strong> Si una misión toma más de 3 horas incluyendo carga/descarga, se considera que el vehículo quedó dedicado todo el día y se asigna el 100% del costo fijo diario. Si toma menos, se paga proporcionalmente.</div>
            </div>

            <h3>Etapa 4: Total Vehículo</h3>
            <div className="dt-formula">
              <strong>total_vehiculo = depreciacion + cubiertas + aceite + combustible + costos_fijos_prorrateados</strong>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 04 — MOTOR RECURSO HUMANO                          */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="rrhh">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--emerald">👤</div>
              <div>
                <div className="dt-num">Sección 04</div>
                <h2>Motor de Costos: Recurso Humano — CCT 40/89</h2>
              </div>
            </div>

            <p>El motor más complejo del sistema. Calcula cuánto cuesta el colaborador asignado a la misión, con lógica diferenciada para viajes cortos y largos. Las escalas salariales y adicionales se leen desde la Configuración Global — deben mantenerse actualizadas con la escala CCT 40/89 vigente.</p>

            <h3>Etapa 1: Preparación</h3>
            <div className="dt-formula">
              sueldo_ajustado = sueldo_basico × (1 + adicional_actividad_% ÷ 100)<br/>
              valor_hora = sueldo_ajustado ÷ horas_laborales_mensuales <span className="comment">// default: 192h</span><br/>
              <br/>
              <span className="comment">// Jornal diario CCT 40/89: sueldo mensual ÷ 24 (divisorJornalCCT)</span><br/>
              valor_jornada = sueldo_ajustado ÷ 24<br/><br/>
              tiempo_total_mision = duracion_min + 30<br/>
              tiempo_diario_total = tiempo_total_mision × viajes_por_dia
            </div>

            <h3>Etapa 2: Costo Base (Componente por Tiempo)</h3>
            <p>El sistema toma una decisión clave según la duración diaria total:</p>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--cyan">Servicio Corto</span> (menos de 180 minutos diarios)</div>
              <div className="dt-formula">
                km_minimos = 150<br/>
                tiempo_a_facturar = máximo(tiempo_mision, minimo_minutos_facturables)<br/>
                <span className="comment">// Si la misión dura 45min pero el mínimo es 120min, se cobra 120min</span><br/><br/>
                costo_por_viaje = valor_hora × (tiempo_a_facturar ÷ 60)<br/><br/>
                <span className="comment">// Adicional fijo se prorratea por fracción de jornada:</span><br/>
                adicional_diario = adicional_no_remunerativo_fijo ÷ 22<br/>
                adicional_por_viaje = adicional_diario × (tiempo_a_facturar ÷ 480)<br/><br/>
                <strong>SI mensual:</strong> costo_base = costo_por_viaje × viajes_mensuales<br/>
                <strong>SI esporádico:</strong> costo_base = costo_por_viaje
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--amber">Servicio Dedicado</span> (180 minutos o más diarios)</div>
              <div className="dt-formula">
                km_minimos = 350<br/>
                dias_de_trabajo = dias_seleccionados × 4.33 <span className="comment">// o vueltasTotales si esporádico</span><br/><br/>
                <span className="comment">// Jornada completa + horas extra con recargo CCT 40/89 (1.5×):</span><br/>
                minutos_extra_por_dia = máximo(0, tiempo_diario_total − 480)<br/>
                horas_extra_por_dia = minutos_extra_por_dia ÷ 60<br/>
                <strong>costo_horas_extra = horas_extra_por_dia × valor_hora × 1.5 × dias_trabajo</strong><br/><br/>
                <strong>costo_base = (valor_jornada × dias_trabajo) + costo_horas_extra</strong><br/><br/>
                adicional_fijo = (adicional_no_remunerativo_fijo ÷ 22) × dias_trabajo
              </div>
            </div>
            <div className="dt-tip dt-tip--violet">
              <span className="dt-tip-icon">⚖️</span>
              <div><strong>Horas extra CCT 40/89:</strong> Cuando la jornada supera 8 horas (480 min), los minutos adicionales se abonan con un recargo del 50% (factor 1.5×) sobre el valor hora normal.</div>
            </div>

            <h3>Etapa 3: Costos Variables (Componente por Distancia)</h3>
            <div className="dt-formula">
              km_reales = kms_por_viaje × viajes_mensuales<br/>
              km_a_pagar = máximo(km_reales, km_minimos) <span className="comment">// se paga al menos el mínimo</span><br/><br/>
              adicional_km = adicional_km_remunerativo × km_a_pagar <span className="comment">// $/km</span><br/>
              viatico_km = viatico_no_remunerativo × km_a_pagar <span className="comment">// $/km</span><br/><br/>
              <span className="comment">// Carga y descarga: cada X kilómetros se paga un adicional</span><br/>
              tramos = km_reales ÷ km_por_unidad_de_carga<br/>
              <strong>adicional_carga_descarga = tramos × monto_por_tramo</strong>
            </div>

            <div className="dt-tip dt-tip--violet">
              <span className="dt-tip-icon">📌</span>
              <div><strong>Kilómetros mínimos:</strong> Si los km reales son menores al mínimo (150 km para servicio corto, 350 km para dedicado), se pagan los adicionales sobre el mínimo. Esto protege al colaborador en rutas muy cortas.</div>
            </div>

            <h3>Etapa 4: Consolidación con Cargas Sociales</h3>
            <div className="dt-formula">
              base_remunerativa = costo_base + adicional_km + adicional_carga_descarga<br/><br/>
              <strong>SI Empleado (CCT 40/89):</strong><br/>
              &nbsp;&nbsp;subtotal_rem = base_remunerativa + costo_horas_extra<br/>
              &nbsp;&nbsp;cargas_sociales = subtotal_rem × (cargas_sociales_% ÷ 100) <span className="comment">// configurable</span><br/><br/>
              <strong>SI Contratado (Factor sobre CCT):</strong><br/>
              &nbsp;&nbsp;<span className="comment">// El sistema calcula el equivalente CCT y aplica el factor configurado</span><br/>
              &nbsp;&nbsp;costo_equivalente_cct = calcular_como_si_fuera_empleado()<br/>
              &nbsp;&nbsp;costo_contratado = costo_equivalente_cct × (factorSobreEmpleado ÷ 100) <span className="comment">// default 75%</span><br/><br/>
              <strong>total_rrhh = base_remunerativa + adicional_fijo + viatico_km + cargas_sociales</strong>
            </div>

            <div className="dt-tip dt-tip--cyan">
              <span className="dt-tip-icon">💡</span>
              <div><strong>Empleado vs Contratado:</strong> Para empleados, las cargas sociales (%) se aplican sobre la base remunerativa. Para contratados, el sistema calcula el costo equivalente CCT completo y lo multiplica por el factor configurado (75% por defecto), reflejando el ahorro en cargas patronales y beneficios que no aplican.</div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 05 — CONSOLIDACIÓN FINAL                           */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="consolidacion">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--amber">💰</div>
              <div>
                <div className="dt-num">Sección 05</div>
                <h2>Consolidación Final del Precio</h2>
              </div>
            </div>

            <p>Una vez que ambos motores (Vehículo + RRHH) generan sus totales, el sistema consolida el precio final:</p>

            <div className="dt-formula">
              <span className="comment">// ═══ CAPA 1: Subtotal Operativo ═══</span><br/>
              subtotal_parcial = total_vehiculo + total_rrhh<br/><br/>
              <span className="comment">// ═══ CAPA 2: Gastos Administrativos ═══</span><br/>
              total_administrativo = subtotal_parcial × (admin_% ÷ 100)<br/><br/>
              <span className="comment">// ═══ CAPA 3: Peajes y Otros ═══</span><br/>
              total_peajes = costo_peaje_por_viaje × viajes_mensuales<br/>
              otros_costos = monto_fijo_ingresado<br/><br/>
              <span className="comment">// ═══ CAPA 4: Recargo por Carga Peligrosa ═══</span><br/>
              <strong>SI</strong> carga = peligrosa:<br/>
              &nbsp;&nbsp;adicional_peligrosa = kms_mensuales_totales × costoAdicionalKmPeligrosa <span className="comment">// default: $350/km, configurable</span><br/><br/>
              <span className="comment">// ═══ CAPA 5: Total Operativo ═══</span><br/>
              <strong>total_operativo = vehiculo + rrhh + peajes + admin + otros + peligrosa</strong><br/><br/>
              <span className="comment">// ═══ CAPA 6: Ganancia ═══</span><br/>
              ganancia = total_operativo × (margen_% ÷ 100)<br/><br/>
              <span className="comment">// ═══ PRECIO FINAL ═══</span><br/>
              <strong>PRECIO_FINAL = total_operativo + ganancia</strong>
            </div>

            <div className="dt-tip dt-tip--amber">
              <span className="dt-tip-icon">⚠️</span>
              <div><strong>Orden de cálculo importante:</strong> Los gastos administrativos se calculan como porcentaje del subtotal vehículo+RRHH (no del total final). La ganancia se calcula sobre el total operativo completo (ya incluyendo admin, peajes y otros).</div>
            </div>

            <h3>Salida del Sistema</h3>
            <table className="dt-table">
              <thead><tr><th>Campo</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>totalVehiculo</strong></td><td>Costo total del vehículo (variable + fijos prorrateados)</td></tr>
                <tr><td><strong>totalRecurso</strong></td><td>Costo total del recurso humano</td></tr>
                <tr><td><strong>totalPeajes</strong></td><td>Peajes × viajes mensuales</td></tr>
                <tr><td><strong>totalAdministrativo</strong></td><td>Porcentaje administrativo sobre subtotal</td></tr>
                <tr><td><strong>otrosCostos</strong></td><td>Monto fijo extra</td></tr>
                <tr><td><strong>costoAdicionalPeligrosa</strong></td><td>Recargo por km para carga peligrosa (configurable, default $350/km)</td></tr>
                <tr><td><strong>totalOperativo</strong></td><td>Suma de todos los costos</td></tr>
                <tr><td><strong>ganancia</strong></td><td>Margen aplicado sobre el total operativo</td></tr>
                <tr><td><strong>totalFinal</strong></td><td>Precio de venta al cliente (sin IVA)</td></tr>
                <tr><td><strong>totalFinalConIVA</strong></td><td>Precio de venta con IVA incluido (totalFinal × 1.21)</td></tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 06 — CONSTANTES DEL SISTEMA                        */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="constantes">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--rose">🔧</div>
              <div>
                <div className="dt-num">Sección 06</div>
                <h2>Constantes del Sistema</h2>
              </div>
            </div>

            <p>Estas son las constantes fijas que utiliza el motor de cálculo. Algunas son configurables desde la pantalla de Configuración Global:</p>

            <table className="dt-table">
              <thead><tr><th>Constante</th><th>Valor</th><th>Unidad</th><th>Uso</th><th>Configurable</th></tr></thead>
              <tbody>
                <tr><td><strong>TIEMPO_CARGA_DESCARGA</strong></td><td>30</td><td>minutos</td><td>Se suma a la duración de cada viaje para calcular ocupación real</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>UMBRAL_JORNADA_COMPLETA</strong></td><td>180</td><td>minutos</td><td>Si la misión supera este valor → costo fijo 100% y jornada completa</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>JORNADA_COMPLETA</strong></td><td>480</td><td>minutos</td><td>Denominador para prorratear costos fijos (8 horas)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>DIAS_LABORALES_MES</strong></td><td>22</td><td>días</td><td>Divisor para calcular costo fijo diario</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>DIVISOR_JORNAL_CCT</strong></td><td>24</td><td>divisor</td><td>Sueldo mensual ÷ 24 = jornal diario (CCT 40/89)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>SEMANAS_POR_MES</strong></td><td>4.33</td><td>semanas</td><td>Multiplicador para frecuencia mensual</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>HORAS_LABORALES_DEFAULT</strong></td><td>192</td><td>horas/mes</td><td>Denominador para calcular valor hora del colaborador</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>FACTOR_HORAS_EXTRA</strong></td><td>1.5</td><td>×</td><td>Recargo del 50% sobre horas extra (CCT 40/89)</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>FACTOR_GNC</strong></td><td>1.15</td><td>×</td><td>El GNC rinde 15% más que nafta por m³ equivalente</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>FACTOR_REFRIGERADA</strong></td><td>1.25</td><td>×</td><td>Incremento combustible por equipo de frío</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>COSTO_KM_PELIGROSA</strong></td><td>350</td><td>$/km</td><td>Recargo por seguro y protocolo de carga peligrosa</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>PORCENTAJE_IVA</strong></td><td>21</td><td>%</td><td>IVA sobre precio de venta (Argentina)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>ANTIGÜEDAD_MAX_DEPRECIACIÓN</strong></td><td>10</td><td>años</td><td>Solo se deprecian vehículos de ≤10 años de antigüedad</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>KM_MINIMO_CORTO</strong></td><td>150</td><td>km</td><td>Mínimo kilómetros remunerativos en servicio corto</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>KM_MINIMO_DEDICADO</strong></td><td>350</td><td>km</td><td>Mínimo kilómetros remunerativos en servicio dedicado</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 07 — DIAGRAMA DE FLUJO                             */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="flujo">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--violet">🔀</div>
              <div>
                <div className="dt-num">Sección 07</div>
                <h2>Diagrama de Flujo del Cálculo</h2>
              </div>
            </div>

            <p>El siguiente diagrama muestra el flujo completo de decisiones del sistema:</p>

            <div className="dt-card" style={{padding: '24px'}}>
              <div className="dt-card-title" style={{marginBottom: '16px'}}>🔀 Flujo de Decisiones del Motor de Cálculo</div>

              <h3 style={{fontSize: '.9rem', marginTop: '8px'}}>1. ¿Qué tipo de frecuencia es?</h3>
              <div className="dt-formula">
                Esporádico → viajes = vueltasTotales<br/>
                Mensual → viajes = días × 4.33 × viajes_por_día − feriados
              </div>

              <h3 style={{fontSize: '.9rem'}}>2. ¿Qué tipo de combustible usa?</h3>
              <div className="dt-formula">
                GNC → rendimiento × 1.15, usa precio GNC<br/>
                Nafta/Gasoil → usa rendimiento directo<br/>
                &nbsp;&nbsp;→ ¿Es carga refrigerada? → precio × 1.25
              </div>

              <h3 style={{fontSize: '.9rem'}}>3. ¿Cuánto dura la misión?</h3>
              <div className="dt-formula">
                (duración + 30 min) &lt; 180 min → VIAJE CORTO<br/>
                &nbsp;&nbsp;→ Vehículo: prorrateo proporcional de costos fijos<br/>
                &nbsp;&nbsp;→ RRHH: cobro por hora con mínimo facturable<br/>
                &nbsp;&nbsp;→ KM mínimo: 150 km<br/><br/>
                (duración + 30 min) ≥ 180 min → VIAJE LARGO<br/>
                &nbsp;&nbsp;→ Vehículo: 100% del costo fijo diario<br/>
                &nbsp;&nbsp;→ RRHH: cobro por jornada + horas extra<br/>
                &nbsp;&nbsp;→ KM mínimo: 350 km
              </div>

              <h3 style={{fontSize: '.9rem'}}>4. ¿Qué tipo de contratación tiene el colaborador?</h3>
              <div className="dt-formula">
                Empleado → cargas sociales sobre base remunerativa<br/>
                Contratado → overhead sobre subtotal bruto completo
              </div>

              <h3 style={{fontSize: '.9rem'}}>5. ¿Qué tipo de carga es?</h3>
              <div className="dt-formula">
                General → sin recargos<br/>
                Refrigerada → combustible × 1.25<br/>
                Peligrosa → + costoAdicionalKmPeligrosa × kms_mensuales <span className="comment">// default $350/km</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 08 — REGLAS DE NEGOCIO                             */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="dt-section" id="reglas">
            <div className="dt-section-header">
              <div className="dt-icon dt-icon--rose">📋</div>
              <div>
                <div className="dt-num">Sección 08</div>
                <h2>Reglas de Negocio y Arquitectura Multi-Tenant</h2>
              </div>
            </div>

            <h3>Unicidad de Patente por Usuario</h3>
            <p>El modelo de Vehículo usa un índice compuesto <code>{'{ patente: 1, usuario: 1 }'}</code> en MongoDB en lugar de un índice único global sobre la patente. Esto permite que dos usuarios distintos registren el mismo vehículo, pero impide duplicados dentro de la misma cuenta.</p>
            <div className="dt-formula">
              Index: {'{'} patente: 1, usuario: 1 {'}'}, unique: true<br/>
              <span className="comment">// Error 409 con mensaje descriptivo si se intenta duplicar dentro de la misma cuenta</span>
            </div>

            <h3>Vista Pública del Desglose</h3>
            <p>Existen dos endpoints y dos rutas para el desglose de cada cotización:</p>
            <table className="dt-table">
              <thead><tr><th>Ruta</th><th>Endpoint</th><th>Datos sensibles</th></tr></thead>
              <tbody>
                <tr><td><code>/desglose/:id</code></td><td>GET /api/presupuestos/:id</td><td>Incluidos (uso interno)</td></tr>
                <tr><td><code>/d/:id</code></td><td>GET /api/presupuestos/publico/:id</td><td>Filtrados (margen, ganancia, KPIs)</td></tr>
              </tbody>
            </table>
            <p>El backend filtra activamente los campos sensibles antes de enviarlos al cliente público. No es solo ocultamiento en frontend.</p>

            <h3>Escala CCT 40/89 — Sin Valores Fijos en el Código</h3>
            <p>Los valores del convenio (sueldo básico, adicionales por km, viáticos, cargas sociales) <strong>no están hardcodeados</strong> en el motor de cálculo. Se leen desde la Configuración Global del usuario en cada cotización. Actualizar la configuración cuando entre en vigencia una nueva escala es suficiente para que todos los presupuestos futuros reflejen los valores correctos sin cambios en el código.</p>
          </div>

          {/* ═══ FOOTER ═══ */}
          <div className="dt-footer">
            <p>Cotizador Logístico — Documentación Técnica de Cálculos</p>
            <p>© {new Date().getFullYear()} — Documento interno confidencial</p>
          </div>

        </div>
      </ScrollArea>
    </>
  );
};

export default DocumentacionTecnica;
