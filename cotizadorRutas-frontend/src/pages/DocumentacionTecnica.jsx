
import { Container, ScrollArea } from '@mantine/core';

const css = `
.doc-tech {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--mantine-color-text);
  line-height: 1.75;
}
.doc-tech * { box-sizing: border-box; }

/* PORTADA */
.dt-cover {
  text-align: center;
  padding: 56px 0 40px;
  border-bottom: 1px solid rgba(148,163,184,.15);
  margin-bottom: 48px;
}
.dt-cover h1 {
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: -.5px;
  margin: 0 0 6px;
}
.dt-cover .dt-sub {
  font-size: .95rem;
  opacity: .55;
  margin: 0;
}
.dt-cover .dt-badge {
  display: inline-block;
  margin-top: 18px;
  padding: 4px 18px;
  border-radius: 100px;
  background: rgba(34,211,238,.1);
  color: #22d3ee;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ÍNDICE */
.dt-toc {
  border-radius: 14px;
  padding: 28px 32px;
  margin-bottom: 56px;
  border: 1px solid rgba(148,163,184,.12);
  background: rgba(148,163,184,.03);
}
.dt-toc h2 {
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 18px;
  opacity: .5;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: .72rem;
}
.dt-toc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 40px;
}
.dt-toc a {
  color: inherit;
  text-decoration: none;
  font-size: .85rem;
  padding: 7px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(148,163,184,.08);
  transition: color .15s;
  opacity: .75;
}
.dt-toc a:hover { color: #22d3ee; opacity: 1; }
.dt-toc-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border-radius: 6px;
  background: rgba(34,211,238,.1);
  color: #22d3ee;
  font-size: .62rem;
  font-weight: 800;
  flex-shrink: 0;
}

/* SECCIONES */
.dt-section { margin-bottom: 64px; }
.dt-section-header {
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 2px solid rgba(148,163,184,.12);
}
.dt-num-label {
  font-size: .62rem;
  opacity: .4;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-bottom: 2px;
}
.dt-section h2 {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -.3px;
  margin: 0;
}
.dt-section h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 28px 0 10px;
  color: #22d3ee;
  letter-spacing: -.1px;
}
.dt-section h4 {
  font-size: .88rem;
  font-weight: 700;
  margin: 18px 0 8px;
  opacity: .85;
}
.dt-section p { font-size: .88rem; opacity: .8; margin: 0 0 10px; }
.dt-section ul, .dt-section ol { padding-left: 22px; margin: 8px 0 14px; }
.dt-section li { font-size: .88rem; opacity: .8; margin-bottom: 6px; }

/* FÓRMULAS */
.dt-formula {
  border-radius: 10px;
  padding: 16px 20px;
  margin: 12px 0;
  font-family: 'Courier New', Consolas, monospace;
  font-size: .8rem;
  line-height: 2;
  border-left: 3px solid #22d3ee;
  background: rgba(34,211,238,.04);
  overflow-x: auto;
}
.dt-formula .comment { opacity: .4; font-style: italic; }
.dt-formula strong { color: #22d3ee; }

/* CARDS */
.dt-card {
  border-radius: 12px;
  padding: 18px 22px;
  margin: 14px 0;
  border: 1px solid rgba(148,163,184,.1);
  background: rgba(148,163,184,.03);
}
.dt-card-title {
  font-weight: 700;
  font-size: .88rem;
  margin-bottom: 10px;
  opacity: .9;
}
.dt-card p, .dt-card li { opacity: .75; font-size: .84rem; }

/* ALERTAS */
.dt-alert {
  border-radius: 10px;
  padding: 13px 16px;
  margin: 14px 0;
  font-size: .84rem;
  border-left: 3px solid;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  line-height: 1.6;
  opacity: .9;
}
.dt-alert--warning { background: rgba(245,158,11,.05); border-color: #f59e0b; }
.dt-alert--info    { background: rgba(34,211,238,.05);  border-color: #22d3ee; }
.dt-alert--note    { background: rgba(139,92,246,.05);  border-color: #8b5cf6; }
.dt-alert-label {
  font-weight: 700;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .8px;
  flex-shrink: 0;
  padding-top: 1px;
}
.dt-alert--warning .dt-alert-label { color: #f59e0b; }
.dt-alert--info    .dt-alert-label { color: #22d3ee; }
.dt-alert--note    .dt-alert-label { color: #8b5cf6; }

/* TABLAS */
.dt-table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: .82rem;
}
.dt-table th, .dt-table td {
  padding: 9px 13px;
  text-align: left;
  border-bottom: 1px solid rgba(148,163,184,.1);
}
.dt-table th {
  opacity: .45;
  font-weight: 700;
  font-size: .7rem;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.dt-table td { opacity: .8; }
.dt-table tbody tr:last-child td { border-bottom: none; }

/* BADGES */
.dt-badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 5px;
  font-size: .68rem;
  font-weight: 700;
}
.dt-badge--cyan    { background: rgba(34,211,238,.12);  color: #22d3ee; }
.dt-badge--amber   { background: rgba(245,158,11,.12);  color: #f59e0b; }
.dt-badge--emerald { background: rgba(16,185,129,.12);  color: #10b981; }
.dt-badge--rose    { background: rgba(244,63,94,.12);   color: #f43f5e; }
.dt-badge--violet  { background: rgba(139,92,246,.12);  color: #8b5cf6; }

/* FLUJO */
.dt-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0;
  align-items: center;
}
.dt-flow-step {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: .78rem;
  font-weight: 600;
  border: 1px solid rgba(148,163,184,.12);
  background: rgba(148,163,184,.04);
}
.dt-flow-arrow { opacity: .35; font-size: .8rem; }

/* SEPARADOR */
.dt-divider {
  border: none;
  border-top: 1px solid rgba(148,163,184,.1);
  margin: 32px 0;
}

/* FOOTER */
.dt-footer {
  text-align: center;
  padding: 32px 0 8px;
  border-top: 1px solid rgba(148,163,184,.1);
  opacity: .35;
  font-size: .75rem;
}
`;

const DocumentacionTecnica = () => {
  return (
    <>
      <style>{css}</style>
      <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
        <div className="doc-tech">

          {/* PORTADA */}
          <div className="dt-cover">
            <h1>Guía Oficial del Sistema</h1>
            <p className="dt-sub">Cotizador Logístico — Manual de Uso y Referencia Técnica de Cálculos</p>
            <span className="dt-badge">Documento Interno Confidencial · {new Date().getFullYear()}</span>
          </div>

          {/* ÍNDICE */}
          <div className="dt-toc">
            <h2>Contenido</h2>
            <div className="dt-toc-grid">
              <a href="#primeros-pasos"><span className="dt-toc-num">01</span>Primeros Pasos</a>
              <a href="#pipeline"><span className="dt-toc-num">02</span>Pipeline de Cálculo</a>
              <a href="#viajes"><span className="dt-toc-num">03</span>Cálculo de Viajes</a>
              <a href="#vehiculo"><span className="dt-toc-num">04</span>Motor: Vehículo</a>
              <a href="#rrhh"><span className="dt-toc-num">05</span>Motor: Recurso Humano</a>
              <a href="#consolidacion"><span className="dt-toc-num">06</span>Consolidación Final</a>
              <a href="#constantes"><span className="dt-toc-num">07</span>Constantes del Sistema</a>
              <a href="#desglose"><span className="dt-toc-num">08</span>Desglose y Propuesta</a>
              <a href="#flujo"><span className="dt-toc-num">09</span>Diagrama de Decisiones</a>
            </div>
          </div>

          {/* ─── SECCIÓN 01: PRIMEROS PASOS ─── */}
          <div className="dt-section" id="primeros-pasos">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 01</div>
                <h2>Primeros Pasos — Cómo Usar el Sistema</h2>
              </div>
            </div>

            <p>El sistema está diseñado para generar presupuestos de transporte de manera precisa, considerando todos los costos operativos reales. Para obtener resultados correctos, es imprescindible configurar los datos base antes de crear el primer presupuesto.</p>

            <h3>Paso 0 — Configurar los Valores Globales</h3>
            <p>Acceder a <strong>Configuración</strong> en el menú lateral. Esta pantalla tiene cuatro bloques:</p>
            <ul>
              <li><strong>Empresa:</strong> nombre, logo, CUIT, contacto y colores de marca. Estos datos aparecen en las propuestas que se comparten con clientes.</li>
              <li><strong>Vehículos por tipo:</strong> valores de referencia para cada categoría (utilitario, mediano, grande, camión). Incluyen rendimiento, precio de combustible, costos de mantenimiento, cubiertas, patentes y depreciación. Se usan como pre-llenado cuando se da de alta un vehículo nuevo.</li>
              <li><strong>Recurso Humano:</strong> escalas salariales del CCT 40/89 vigentes. Incluyen sueldo básico, adicionales por km, viáticos, adicional fijo no remunerativo, adicional por carga/descarga y porcentaje de cargas sociales. <em>Estos valores cambian con cada actualización del convenio.</em></li>
              <li><strong>Constantes de cálculo:</strong> parámetros como IVA, factor refrigerada, costo adicional por km de carga peligrosa y varios divisores del CCT.</li>
            </ul>

            <div className="dt-alert dt-alert--warning">
              <span className="dt-alert-label">Importante</span>
              <span>Las escalas del CCT 40/89 se actualizan periódicamente. Cada vez que entre en vigencia una nueva escala salarial, actualizar los valores en Configuración Global antes de generar nuevos presupuestos. Los presupuestos ya guardados conservan los valores con los que fueron calculados en el momento.</span>
            </div>

            <h3>Paso 1 — Cargar la Flota de Vehículos</h3>
            <p>Acceder a <strong>Gestión → Vehículos</strong> y registrar cada unidad disponible. Para cada vehículo se indica: tipo, patente, marca, modelo, año y combustible. Los campos económicos (precio del vehículo, rendimiento, costos de mantenimiento, seguro, patentes, cubiertas y aceite) se pre-llenan desde Configuración Global pero pueden ajustarse unidad por unidad.</p>

            <div className="dt-alert dt-alert--info">
              <span className="dt-alert-label">Regla</span>
              <span>La patente debe ser única dentro de la cuenta. Dos cuentas distintas pueden registrar el mismo vehículo, pero dentro de una misma cuenta una patente no puede repetirse. Si se intenta registrar una patente duplicada, el sistema muestra un mensaje descriptivo.</span>
            </div>

            <h3>Paso 2 — Cargar el Equipo de Recursos Humanos</h3>
            <p>Acceder a <strong>Gestión → RRHH</strong> y registrar cada chofer o colaborador operativo. Por cada recurso se define el tipo de contratación, que determina cómo se calculan sus costos:</p>
            <ul>
              <li><strong>Empleado (CCT 40/89):</strong> el motor calcula el costo real completo: jornada o horas según la duración del servicio, horas extra con recargo del 50%, adicionales km remunerativos, viáticos no remunerativos, adicional fijo y carga/descarga. Sobre la base remunerativa se aplica el porcentaje de cargas sociales configurado.</li>
              <li><strong>Contratado:</strong> el sistema calcula el equivalente CCT completo y lo multiplica por un factor de ajuste configurado (por defecto 75%). Este factor refleja el ahorro en cargas patronales, SAC, vacaciones y ART que no aplican a la relación contractual.</li>
            </ul>

            <h3>Paso 3 — Crear un Presupuesto</h3>
            <p>Hacer clic en <strong>Nuevo Presupuesto</strong>. El cotizador guía el proceso en cinco pasos:</p>
            <ol>
              <li><strong>Ruta:</strong> Ingresar origen y destino. Google Maps calcula los kilómetros y la duración estimada del viaje. Seleccionar el tipo de carga: general, refrigerada o peligrosa. Este dato afecta el cálculo de combustible y agrega costos adicionales.</li>
              <li><strong>Frecuencia:</strong> Elegir si el servicio es <em>esporádico</em> (cantidad fija de viajes totales) o <em>mensual recurrente</em> (días de la semana operativos y viajes por día). Para servicios mensuales de 5 o más días, el sistema consulta la API de feriados nacionales y descuenta los que caen en días operativos.</li>
              <li><strong>Vehículo:</strong> Seleccionar el vehículo de la flota. Se puede ajustar cualquier parámetro para este presupuesto específico sin modificar el registro base del vehículo.</li>
              <li><strong>Recurso Humano:</strong> Seleccionar el colaborador asignado. El tipo de contratación define la lógica de cálculo.</li>
              <li><strong>Configuración del presupuesto:</strong> Definir margen de ganancia, porcentaje de gastos administrativos sobre el subtotal operativo, costo de peajes por viaje, otros costos fijos y los datos del cliente (nombre, empresa, contacto).</li>
            </ol>

            <h3>Paso 4 — Revisar el Desglose y Compartir</h3>
            <p>Al confirmar el presupuesto, el sistema genera un desglose completo con todos los capítulos de costo, indicadores internos de rentabilidad y el precio final con y sin IVA. Para enviar al cliente, el botón <strong>Compartir</strong> genera un enlace público único: el cliente ve el desglose de costos y el precio final, pero el margen de ganancia y los KPIs internos quedan ocultos.</p>

            <div className="dt-alert dt-alert--note">
              <span className="dt-alert-label">Historial</span>
              <span>Desde la sección Historial se accede a todos los presupuestos generados. Cada uno guarda una instantánea completa de todos los valores al momento del cálculo, por lo que actualizaciones posteriores de la configuración no alteran presupuestos ya emitidos.</span>
            </div>
          </div>

          {/* ─── SECCIÓN 02: PIPELINE GENERAL ─── */}
          <div className="dt-section" id="pipeline">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 02</div>
                <h2>Pipeline General de Cálculo</h2>
              </div>
            </div>

            <p>Cada vez que se confirma un presupuesto, el backend ejecuta un pipeline de cálculo secuencial que atraviesa cuatro etapas principales:</p>

            <div className="dt-flow">
              <div className="dt-flow-step">Calcular Viajes Mensuales</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">Motor Vehículo</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">Motor RRHH</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">Consolidación Final</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">Precio de Venta</div>
            </div>

            <h3>Entradas del Sistema</h3>
            <table className="dt-table">
              <thead><tr><th>Dato</th><th>Origen</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>kmsPorViaje</strong></td><td>Paso 1 — Ruta</td><td>Distancia total del recorrido calculada por Google Maps</td></tr>
                <tr><td><strong>duracionMin</strong></td><td>Paso 1 — Ruta</td><td>Duración estimada del viaje en minutos (Google Maps)</td></tr>
                <tr><td><strong>tipoCarga</strong></td><td>Paso 1 — Ruta</td><td>General, refrigerada o peligrosa</td></tr>
                <tr><td><strong>frecuencia</strong></td><td>Paso 2 — Frecuencia</td><td>Tipo (esporádico/mensual), días de operación, viajes por día</td></tr>
                <tr><td><strong>vehiculoDatos</strong></td><td>Paso 3 — Vehículo</td><td>Objeto completo con todos los parámetros del vehículo</td></tr>
                <tr><td><strong>recursoDatos</strong></td><td>Paso 4 — RRHH</td><td>Tipo de contratación y parámetros del colaborador</td></tr>
                <tr><td><strong>configuracion</strong></td><td>Paso 5 — Config</td><td>Margen, admin %, peajes, otros costos, datos del cliente</td></tr>
              </tbody>
            </table>
          </div>

          {/* ─── SECCIÓN 03: CÁLCULO DE VIAJES ─── */}
          <div className="dt-section" id="viajes">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 03</div>
                <h2>Cálculo de Viajes Mensuales</h2>
              </div>
            </div>

            <p>El primer paso del pipeline determina cuántos viajes se realizarán en el mes. La lógica varía según el tipo de frecuencia seleccionado:</p>

            <h3>Tipo Esporádico</h3>
            <div className="dt-formula">
              viajes_mensuales = vueltasTotales<br/>
              <span className="comment">// El usuario define directamente cuántos viajes totales se realizarán.</span>
            </div>

            <h3>Tipo Mensual Recurrente</h3>
            <div className="dt-formula">
              dias_base        = cantidad_dias_seleccionados × 4.33<br/>
              dias_efectivos   = máximo(dias_base − feriados_por_mes, 0)<br/>
              <strong>viajes_mensuales = dias_efectivos × viajes_por_dia</strong>
            </div>
            <p>El factor <strong>4.33</strong> representa el promedio de semanas por mes (52 ÷ 12). Es configurable desde Configuración Global.</p>

            <h3>Ajuste por Feriados Nacionales</h3>
            <p>Cuando la frecuencia es mensual y se seleccionan 5 o más días por semana, el sistema consulta automáticamente la API de feriados nacionales argentinos del año en curso y calcula cuántos de ellos caen en los días operativos seleccionados:</p>
            <div className="dt-formula">
              feriados_operativos = contar feriados del año cuyo día de semana esté en los días seleccionados<br/>
              feriados_por_mes    = feriados_operativos ÷ 12
            </div>
            <div className="dt-alert dt-alert--info">
              <span className="dt-alert-label">Optimización</span>
              <span>Los feriados se cachean en memoria durante la sesión para evitar consultas repetidas a la API. Solo se consultan cuando la operativa cubre 5 o más días por semana.</span>
            </div>
          </div>

          {/* ─── SECCIÓN 04: MOTOR VEHÍCULO ─── */}
          <div className="dt-section" id="vehiculo">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 04</div>
                <h2>Motor de Costos: Vehículo</h2>
              </div>
            </div>

            <p>Recibe los datos del vehículo, kilómetros por viaje, viajes mensuales, duración del servicio y tipo de carga. Calcula el costo total mensual del vehículo en cuatro etapas.</p>

            <h3>Etapa 1 — Preparación</h3>
            <div className="dt-formula">
              tiempo_total_mision = duracion_min + tiempoCargaDescarga <span className="comment">// default: +30 min</span><br/>
              kms_mensuales       = kms_por_viaje × viajes_mensuales
            </div>

            <h3>Etapa 2 — Costos Variables por km</h3>

            <div className="dt-card">
              <div className="dt-card-title">Depreciación</div>
              <div className="dt-formula">
                antigüedad = año_actual − año_fabricacion<br/>
                <span className="comment">// Solo se deprecia si el vehículo tiene 10 años o menos de antigüedad</span><br/><br/>
                valor_residual    = precio_vehiculo_nuevo × (valorResidualPorcentaje ÷ 100)<br/>
                valor_a_depreciar = precio_vehiculo_nuevo − valor_residual<br/>
                meses_vida_util   = kms_vida_util ÷ kms_mensuales<br/>
                <strong>depreciacion_mensual = valor_a_depreciar ÷ meses_vida_util</strong>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Cubiertas</div>
              <div className="dt-formula">
                costo_juego    = precio_cubierta × cantidad_cubiertas<br/>
                meses_vida_util = kms_vida_util_cubiertas ÷ kms_mensuales<br/>
                <strong>cubiertas_mensual = costo_juego ÷ meses_vida_util</strong>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Aceite</div>
              <div className="dt-formula">
                meses_entre_cambios = kms_cambio_aceite ÷ kms_mensuales<br/>
                <strong>aceite_mensual = precio_cambio_aceite ÷ meses_entre_cambios</strong>
              </div>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Combustible</div>
              <div className="dt-formula">
                <span className="comment">// Nafta / Gasoil:</span><br/>
                precio_efectivo   = precio_por_litro × (1.25 si carga_refrigerada, si no 1)<br/>
                combustible_por_km = precio_efectivo ÷ rendimiento_km_litro<br/><br/>
                <span className="comment">// GNC (cuando el vehículo tiene GNC activo):</span><br/>
                rendimiento_gnc   = rendimiento_km_litro × factorGNC <span className="comment">// default ×1.15</span><br/>
                combustible_por_km = precio_gnc ÷ rendimiento_gnc<br/><br/>
                <strong>combustible_mensual = combustible_por_km × kms_mensuales</strong>
              </div>
              <p>El factor refrigerada (1.25×) aplica solo a combustible líquido. El GNC no tiene recargo por refrigerada porque el equipo de frío funciona independientemente. El factor GNC (1.15×) refleja que un m³ de gas rinde un 15% más que un litro de nafta equivalente.</p>
            </div>

            <h3>Etapa 3 — Costos Fijos Prorrateados por Tiempo de Uso</h3>
            <p>Los costos fijos (mantenimiento, seguro, patente municipal y provincial) no se dividen simplemente por viajes: se asignan según el <strong>tiempo de ocupación real</strong> del vehículo en la jornada. Esta es la lógica más sofisticada del motor de vehículo:</p>

            <div className="dt-formula">
              costos_fijos_mensuales = mantenimiento + seguro + patente_municipal + patente_provincial<br/>
              costo_fijo_diario      = costos_fijos_mensuales ÷ diasLaboralesMes <span className="comment">// default: 22 días</span><br/><br/>
              <span className="comment">// Decisión según la duración total de la misión:</span><br/><br/>
              SI tiempo_total_mision {'<'} umbralJornadaCompleta (default: 180 min):<br/>
              &nbsp;&nbsp;proporcion = tiempo_total_mision ÷ jornadaCompletaMinutos <span className="comment">// fracción de 480 min</span><br/><br/>
              SI tiempo_total_mision ≥ 180 min:<br/>
              &nbsp;&nbsp;proporcion = 1.0 <span className="comment">// jornada dedicada: 100% del costo fijo diario</span><br/><br/>
              costo_fijo_por_viaje       = costo_fijo_diario × proporcion<br/>
              <strong>costos_fijos_prorrateados = costo_fijo_por_viaje × viajes_mensuales</strong>
            </div>

            <div className="dt-alert dt-alert--warning">
              <span className="dt-alert-label">Umbral de jornada</span>
              <span>Si la misión total (viaje + carga/descarga) supera 3 horas (180 min), se asume que el vehículo quedó comprometido toda la jornada y se asigna el 100% del costo fijo diario. Si dura menos, se paga proporcionalmente. Este umbral es configurable.</span>
            </div>

            <h3>Etapa 4 — Total Vehículo</h3>
            <div className="dt-formula">
              <strong>total_vehiculo = depreciacion + cubiertas + aceite + combustible + costos_fijos_prorrateados</strong>
            </div>
          </div>

          {/* ─── SECCIÓN 05: MOTOR RRHH ─── */}
          <div className="dt-section" id="rrhh">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 05</div>
                <h2>Motor de Costos: Recurso Humano — CCT 40/89</h2>
              </div>
            </div>

            <p>El motor más complejo del sistema. Calcula el costo real del colaborador asignado a la operación, diferenciando entre servicios cortos (menos de 3 horas diarias) y servicios dedicados (jornada completa o más). Las escalas salariales y todos los adicionales deben mantenerse actualizados en Configuración Global; el motor los lee desde allí en cada cálculo.</p>

            <div className="dt-alert dt-alert--warning">
              <span className="dt-alert-label">Actualización de escalas</span>
              <span>Los valores del CCT 40/89 no están fijos en el sistema: se leen desde la Configuración Global del usuario. Cuando entre en vigencia una nueva escala salarial, actualizar los valores en Configuración antes de generar nuevos presupuestos.</span>
            </div>

            <h3>Etapa 1 — Preparación</h3>
            <div className="dt-formula">
              sueldo_ajustado   = sueldo_basico × (1 + adicionalActividad% ÷ 100)<br/>
              valor_hora        = sueldo_ajustado ÷ horasLaboralesMensuales <span className="comment">// default: 192 h</span><br/>
              valor_jornada     = sueldo_ajustado ÷ divisorJornalCCT <span className="comment">// default: 24 (según CCT 40/89)</span><br/><br/>
              tiempo_total_mision  = duracion_min + tiempoCargaDescarga<br/>
              tiempo_diario_total  = tiempo_total_mision × viajes_por_dia
            </div>

            <h3>Etapa 2 — Costo Base por Tiempo</h3>
            <p>El motor toma una decisión fundamental según la duración diaria acumulada del servicio:</p>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--cyan">Servicio Corto</span> — tiempo diario total menor a 180 minutos</div>
              <div className="dt-formula">
                tiempo_a_facturar = máximo(tiempo_mision, minimoMinutosFacturables) <span className="comment">// default: 120 min</span><br/>
                <span className="comment">// Si el viaje dura 50 min pero el mínimo facturable es 120, se cobra 120.</span><br/><br/>
                costo_por_viaje  = valor_hora × (tiempo_a_facturar ÷ 60)<br/><br/>
                adicional_diario    = adicionalNoRemunerativoFijo ÷ diasLaboralesMes<br/>
                adicional_por_viaje = adicional_diario × (tiempo_a_facturar ÷ 480)<br/><br/>
                <strong>SI mensual:</strong>  costo_base = costo_por_viaje × viajes_mensuales<br/>
                <strong>SI esporádico:</strong> costo_base = costo_por_viaje
              </div>
              <p>En servicio corto, los adicionales no remunerativos fijos se prorratean por la fracción de jornada utilizada. El kilómetro mínimo remunerativo aplicable es de 150 km.</p>
            </div>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--amber">Servicio Dedicado</span> — tiempo diario total igual o mayor a 180 minutos</div>
              <div className="dt-formula">
                dias_de_trabajo = dias_seleccionados × semanasPorMes <span className="comment">// o vueltasTotales si esporádico</span><br/><br/>
                <span className="comment">// Jornada completa. Si supera 8 horas, se calculan horas extra con recargo CCT:</span><br/>
                minutos_extra_por_dia = máximo(0, tiempo_diario_total − 480)<br/>
                horas_extra_por_dia   = minutos_extra_por_dia ÷ 60<br/>
                <strong>costo_horas_extra = horas_extra_por_dia × valor_hora × 1.5 × dias_de_trabajo</strong><br/><br/>
                <strong>costo_base = (valor_jornada × dias_de_trabajo) + costo_horas_extra</strong><br/><br/>
                adicional_fijo = (adicionalNoRemunerativoFijo ÷ diasLaboralesMes) × dias_de_trabajo
              </div>
              <p>El factor <strong>1.5</strong> sobre las horas extra es el recargo del 50% establecido por el CCT 40/89. El kilómetro mínimo remunerativo aplicable es de 350 km.</p>
            </div>

            <h3>Etapa 3 — Costos Variables por Distancia</h3>
            <div className="dt-formula">
              km_reales   = kms_por_viaje × viajes_mensuales<br/>
              km_a_pagar  = máximo(km_reales, km_minimos) <span className="comment">// se paga al menos el mínimo CCT</span><br/><br/>
              adicional_km         = adicionalKmRemunerativo × km_a_pagar<br/>
              viatico_km           = viaticoPorKmNoRemunerativo × km_a_pagar<br/><br/>
              <span className="comment">// Adicional por carga y descarga: se calcula por cada unidad de carga (tramo)</span><br/>
              tramos               = km_reales ÷ kmPorUnidadDeCarga<br/>
              <strong>adicional_carga_descarga = tramos × adicionalCargaDescargaCadaXkm</strong>
            </div>

            <div className="dt-alert dt-alert--info">
              <span className="dt-alert-label">Kilómetros mínimos</span>
              <span>Si los kilómetros reales son menores al mínimo CCT (150 km para servicio corto, 350 km para dedicado), los adicionales de km se calculan sobre el mínimo. Esto protege al colaborador en rutas muy cortas según lo exige el convenio.</span>
            </div>

            <h3>Etapa 4 — Consolidación con Cargas Sociales</h3>
            <div className="dt-formula">
              base_remunerativa = costo_base + adicional_km + adicional_carga_descarga<br/><br/>
              <strong>SI Empleado:</strong><br/>
              &nbsp;&nbsp;subtotal_rem   = base_remunerativa + costo_horas_extra<br/>
              &nbsp;&nbsp;cargas_sociales = subtotal_rem × (porcentajeCargasSociales ÷ 100) <span className="comment">// configurable</span><br/><br/>
              <strong>SI Contratado:</strong><br/>
              &nbsp;&nbsp;costo_equivalente_cct = calcular como si fuera empleado()<br/>
              &nbsp;&nbsp;costo_contratado      = costo_equivalente_cct × (factorSobreEmpleado ÷ 100) <span className="comment">// default: 75%</span><br/><br/>
              <strong>total_rrhh = base_remunerativa + adicional_fijo + viatico_km + cargas_sociales</strong>
            </div>

            <div className="dt-alert dt-alert--note">
              <span className="dt-alert-label">Empleado vs. Contratado</span>
              <span>Para empleados, las cargas sociales se calculan sobre la base remunerativa incluyendo horas extra. Para contratados, el sistema calcula el equivalente CCT completo y aplica el factor de ajuste configurado. El porcentaje de descuento refleja el ahorro en contribuciones patronales, SAC, vacaciones y ART que no aplican a la relación contractual.</span>
            </div>
          </div>

          {/* ─── SECCIÓN 06: CONSOLIDACIÓN FINAL ─── */}
          <div className="dt-section" id="consolidacion">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 06</div>
                <h2>Consolidación Final del Precio</h2>
              </div>
            </div>

            <p>Una vez que ambos motores generan sus totales, el sistema consolida el precio de venta en capas sucesivas:</p>

            <div className="dt-formula">
              <span className="comment">// Capa 1 — Subtotal operativo puro</span><br/>
              subtotal_parcial = total_vehiculo + total_rrhh<br/><br/>
              <span className="comment">// Capa 2 — Gastos administrativos (% sobre el subtotal operativo)</span><br/>
              total_administrativo = subtotal_parcial × (admin% ÷ 100)<br/><br/>
              <span className="comment">// Capa 3 — Peajes y otros</span><br/>
              total_peajes = costo_peaje_por_viaje × viajes_mensuales<br/>
              otros_costos = monto_fijo_ingresado<br/><br/>
              <span className="comment">// Capa 4 — Recargo por carga peligrosa</span><br/>
              SI tipo_carga = peligrosa:<br/>
              &nbsp;&nbsp;adicional_peligrosa = kms_mensuales × costoAdicionalKmPeligrosa<br/><br/>
              <span className="comment">// Capa 5 — Total operativo completo</span><br/>
              total_operativo = vehiculo + rrhh + admin + peajes + otros + peligrosa<br/><br/>
              <span className="comment">// Capa 6 — Ganancia</span><br/>
              ganancia = total_operativo × (margen% ÷ 100)<br/><br/>
              <span className="comment">// Precio final</span><br/>
              <strong>PRECIO_FINAL_SIN_IVA = total_operativo + ganancia</strong><br/>
              <strong>PRECIO_FINAL_CON_IVA = PRECIO_FINAL_SIN_IVA × (1 + porcentajeIVA ÷ 100)</strong>
            </div>

            <div className="dt-alert dt-alert--warning">
              <span className="dt-alert-label">Orden de cálculo</span>
              <span>Los gastos administrativos se calculan como porcentaje del subtotal vehículo+RRHH, no del precio final. La ganancia se calcula sobre el total operativo completo (ya incluyendo admin, peajes y otros). El IVA es informativo y no altera el costo base.</span>
            </div>

            <h3>Salida del Sistema</h3>
            <table className="dt-table">
              <thead><tr><th>Campo</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>totalVehiculo</strong></td><td>Costo total del vehículo (variables + fijos prorrateados)</td></tr>
                <tr><td><strong>totalRecurso</strong></td><td>Costo total del recurso humano con cargas sociales</td></tr>
                <tr><td><strong>totalAdministrativo</strong></td><td>Porcentaje administrativo sobre subtotal operativo</td></tr>
                <tr><td><strong>totalPeajes</strong></td><td>Peajes × viajes mensuales</td></tr>
                <tr><td><strong>otrosCostos</strong></td><td>Monto fijo adicional ingresado manualmente</td></tr>
                <tr><td><strong>costoAdicionalPeligrosa</strong></td><td>Recargo por km para carga peligrosa (configurable)</td></tr>
                <tr><td><strong>totalOperativo</strong></td><td>Suma de todos los costos antes de la ganancia</td></tr>
                <tr><td><strong>ganancia</strong></td><td>Margen aplicado sobre el total operativo</td></tr>
                <tr><td><strong>totalFinal</strong></td><td>Precio de venta sin IVA</td></tr>
                <tr><td><strong>totalFinalConIVA</strong></td><td>Precio de venta con IVA incluido</td></tr>
              </tbody>
            </table>
          </div>

          {/* ─── SECCIÓN 07: CONSTANTES ─── */}
          <div className="dt-section" id="constantes">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 07</div>
                <h2>Constantes del Sistema</h2>
              </div>
            </div>

            <p>Estos son los parámetros fijos que utiliza el motor de cálculo. Los marcados como configurables pueden ajustarse desde Configuración Global sin necesidad de modificar el código.</p>

            <table className="dt-table">
              <thead><tr><th>Constante</th><th>Valor por defecto</th><th>Unidad</th><th>Uso</th><th>Configurable</th></tr></thead>
              <tbody>
                <tr><td><strong>tiempoCargaDescarga</strong></td><td>30</td><td>minutos</td><td>Se suma a la duración de cada viaje</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>umbralJornadaCompleta</strong></td><td>180</td><td>minutos</td><td>Umbral para asignar costo fijo diario completo</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>jornadaCompletaMinutos</strong></td><td>480</td><td>minutos</td><td>Duración de la jornada completa (8 horas)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>diasLaboralesMes</strong></td><td>22</td><td>días</td><td>Divisor para costo fijo diario y jornada CCT</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>semanasPorMes</strong></td><td>4.33</td><td>semanas</td><td>Multiplicador para frecuencia mensual</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>horasLaboralesMensuales</strong></td><td>192</td><td>horas</td><td>Denominador para calcular valor hora del colaborador</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>divisorJornalCCT</strong></td><td>24</td><td>divisor</td><td>Sueldo mensual ÷ 24 = jornal diario (CCT 40/89)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>factorHorasExtra</strong></td><td>1.5</td><td>×</td><td>Recargo del 50% sobre valor hora por horas extra (CCT 40/89)</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>factorGNC</strong></td><td>1.15</td><td>×</td><td>Rendimiento de GNC: 15% más que nafta equivalente</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>factorCargaRefrigerada</strong></td><td>1.25</td><td>×</td><td>Incremento de consumo por equipo de frío</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>costoAdicionalKmPeligrosa</strong></td><td>350</td><td>$/km</td><td>Recargo por seguro y protocolo de carga peligrosa</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>porcentajeIVA</strong></td><td>21</td><td>%</td><td>IVA sobre el precio de venta (Argentina)</td><td><span className="dt-badge dt-badge--emerald">Sí</span></td></tr>
                <tr><td><strong>antigüedadMaxDepreciación</strong></td><td>10</td><td>años</td><td>Solo se deprecian vehículos con 10 años o menos</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>kmMinimoServicioCorto</strong></td><td>150</td><td>km</td><td>Mínimo km remunerativos en servicios cortos</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
                <tr><td><strong>kmMinimoDedicado</strong></td><td>350</td><td>km</td><td>Mínimo km remunerativos en servicios dedicados</td><td><span className="dt-badge dt-badge--rose">No</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* ─── SECCIÓN 08: DESGLOSE Y PROPUESTA ─── */}
          <div className="dt-section" id="desglose">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 08</div>
                <h2>Desglose y Propuesta al Cliente</h2>
              </div>
            </div>

            <p>Una vez generado el presupuesto, el sistema produce dos vistas. La vista interna muestra todos los datos incluyendo indicadores de rentabilidad. La vista pública, accesible mediante un enlace único, está diseñada para compartirse con el cliente de forma segura.</p>

            <h3>Modo Privado vs. Modo Público</h3>
            <table className="dt-table">
              <thead><tr><th>Contenido</th><th>Vista Interna</th><th>Vista Pública (cliente)</th></tr></thead>
              <tbody>
                <tr><td>Desglose de costos de vehículo</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Desglose de costos de RRHH</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Precio de venta por viaje (sin IVA)</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Precio de venta con IVA</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Margen de ganancia (% y monto)</td><td>Visible</td><td>Oculto</td></tr>
                <tr><td>Gráfico de distribución del precio</td><td>Visible</td><td>Oculto</td></tr>
                <tr><td>KPIs internos de rentabilidad</td><td>Visible</td><td>Oculto</td></tr>
              </tbody>
            </table>

            <div className="dt-alert dt-alert--warning">
              <span className="dt-alert-label">Seguridad comercial</span>
              <span>El cliente que accede al link público nunca puede ver el margen de ganancia interno. La detección del modo público se realiza a nivel de URL (/d/:id para público vs /desglose/:id para interno) y mediante un endpoint específico del backend que filtra los datos sensibles antes de enviarlos.</span>
            </div>

            <h3>Indicadores del Desglose</h3>
            <div className="dt-formula">
              precio_por_km    = precio_final_sin_iva ÷ kms_mensuales_totales<br/>
              precio_por_viaje = precio_final_sin_iva ÷ viajes_mensuales<br/>
              iva              = precio_final_sin_iva × (porcentajeIVA ÷ 100)<br/>
              <strong>precio_con_iva    = precio_final_sin_iva + iva</strong>
            </div>
            <p>El indicador de precio por km es el <em>precio de venta sin IVA por kilómetro</em>, no el costo operativo. Permite comparar directamente con tarifas de mercado.</p>

            <h3>Propuesta Comercial</h3>
            <p>Desde el desglose, el botón <strong>Ver Propuesta</strong> abre una vista imprimible con el branding de la empresa (logo, colores, datos de contacto) configurados en Configuración Global. Es la pieza formal que se entrega al cliente como presupuesto oficial.</p>
          </div>

          {/* ─── SECCIÓN 09: DIAGRAMA DE DECISIONES ─── */}
          <div className="dt-section" id="flujo">
            <div className="dt-section-header">
              <div>
                <div className="dt-num-label">Sección 09</div>
                <h2>Diagrama de Decisiones del Motor</h2>
              </div>
            </div>

            <p>El siguiente diagrama resume las decisiones clave que toma el sistema en cada cálculo:</p>

            <div className="dt-card" style={{padding: '24px 28px'}}>
              <div className="dt-card-title" style={{marginBottom: '20px', fontSize: '.95rem'}}>Árbol de decisiones — Pipeline completo</div>

              <h4>1. ¿Qué tipo de frecuencia tiene el servicio?</h4>
              <div className="dt-formula">
                Esporádico → viajes_mensuales = vueltasTotales<br/>
                Mensual    → viajes_mensuales = días × 4.33 × viajes_por_día − feriados
              </div>

              <h4>2. ¿Qué tipo de combustible usa el vehículo?</h4>
              <div className="dt-formula">
                GNC activo         → rendimiento × 1.15, usa precio GNC<br/>
                Nafta / Gasoil     → usa rendimiento directo<br/>
                &nbsp;&nbsp;¿Carga refrigerada? → precio_litro × 1.25
              </div>

              <h4>3. ¿Cuánto dura la misión diaria?</h4>
              <div className="dt-formula">
                tiempo_mision {'<'} 180 min → SERVICIO CORTO<br/>
                &nbsp;&nbsp;Vehículo: prorrateo proporcional de costos fijos<br/>
                &nbsp;&nbsp;RRHH: cobro por hora con mínimo facturable (120 min)<br/>
                &nbsp;&nbsp;Km mínimo remunerativo: 150 km<br/><br/>
                tiempo_mision ≥ 180 min → SERVICIO DEDICADO<br/>
                &nbsp;&nbsp;Vehículo: 100% del costo fijo diario<br/>
                &nbsp;&nbsp;RRHH: jornada completa + horas extra al 1.5×<br/>
                &nbsp;&nbsp;Km mínimo remunerativo: 350 km
              </div>

              <h4>4. ¿Qué tipo de contratación tiene el colaborador?</h4>
              <div className="dt-formula">
                Empleado    → cargas sociales sobre base remunerativa<br/>
                Contratado  → factor % sobre el equivalente CCT calculado
              </div>

              <h4>5. ¿Qué tipo de carga transporta?</h4>
              <div className="dt-formula">
                General      → sin recargos adicionales<br/>
                Refrigerada  → combustible × 1.25 (equipo de frío)<br/>
                Peligrosa    → + costoAdicionalKmPeligrosa × kms_mensuales
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="dt-footer">
            <p>Cotizador Logístico — Guía Oficial del Sistema · CCT 40/89</p>
            <p>© {new Date().getFullYear()} — Documento interno confidencial</p>
          </div>

        </div>
      </ScrollArea>
    </>
  );
};

export default DocumentacionTecnica;
