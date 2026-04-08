
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

.dt-cover {
  text-align: center;
  padding: 56px 0 40px;
  border-bottom: 1px solid rgba(148,163,184,.15);
  margin-bottom: 48px;
}
.dt-cover h1 {
  font-size: 2.1rem; font-weight: 900; letter-spacing: -.5px; margin: 0 0 6px;
}
.dt-cover .dt-sub { font-size: .95rem; opacity: .55; margin: 0; }
.dt-cover .dt-badge {
  display: inline-block; margin-top: 18px; padding: 4px 18px;
  border-radius: 100px; background: rgba(34,211,238,.1); color: #22d3ee;
  font-size: .72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
}

.dt-toc {
  border-radius: 14px; padding: 28px 32px; margin-bottom: 56px;
  border: 1px solid rgba(148,163,184,.12); background: rgba(148,163,184,.03);
}
.dt-toc-label {
  font-size: .7rem; font-weight: 700; opacity: .4; text-transform: uppercase;
  letter-spacing: 1px; margin-bottom: 16px;
}
.dt-toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 40px; }
.dt-toc a {
  color: inherit; text-decoration: none; font-size: .85rem; padding: 7px 0;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(148,163,184,.08); transition: color .15s; opacity: .75;
}
.dt-toc a:hover { color: #22d3ee; opacity: 1; }
.dt-toc-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  background: rgba(34,211,238,.1); color: #22d3ee;
  font-size: .62rem; font-weight: 800; flex-shrink: 0;
}

.dt-section { margin-bottom: 64px; }
.dt-section-header {
  display: flex; align-items: flex-start; gap: 14px;
  margin-bottom: 24px; padding-bottom: 14px;
  border-bottom: 2px solid rgba(148,163,184,.12);
}
.dt-section-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0; margin-top: 2px;
}
.ic--cyan    { background: rgba(34,211,238,.1); }
.ic--violet  { background: rgba(139,92,246,.1); }
.ic--amber   { background: rgba(245,158,11,.1); }
.ic--emerald { background: rgba(16,185,129,.1); }
.ic--rose    { background: rgba(244,63,94,.1);  }
.ic--blue    { background: rgba(59,130,246,.1); }

.dt-num-label {
  font-size: .62rem; opacity: .4; text-transform: uppercase;
  letter-spacing: 1.5px; font-weight: 700; margin-bottom: 2px;
}
.dt-section h2 { font-size: 1.4rem; font-weight: 800; letter-spacing: -.3px; margin: 0; }
.dt-section h3 {
  font-size: .95rem; font-weight: 700; margin: 26px 0 10px;
  color: #22d3ee; letter-spacing: -.1px;
}
.dt-section h4 { font-size: .88rem; font-weight: 700; margin: 18px 0 6px; opacity: .85; }
.dt-section p { font-size: .88rem; opacity: .8; margin: 0 0 10px; }
.dt-section ul, .dt-section ol { padding-left: 22px; margin: 8px 0 14px; }
.dt-section li { font-size: .88rem; opacity: .8; margin-bottom: 6px; }
.dt-section code {
  background: rgba(148,163,184,.1); border-radius: 4px;
  padding: 1px 6px; font-size: .82rem; font-family: Consolas, monospace;
}

.dt-card {
  border-radius: 12px; padding: 18px 22px; margin: 14px 0;
  border: 1px solid rgba(148,163,184,.1); background: rgba(148,163,184,.03);
}
.dt-card-title { font-weight: 700; font-size: .9rem; margin-bottom: 10px; opacity: .9; }
.dt-card p, .dt-card li { opacity: .78; font-size: .85rem; }

.dt-alert {
  border-radius: 10px; padding: 13px 16px; margin: 14px 0;
  font-size: .85rem; border-left: 3px solid;
  line-height: 1.65; opacity: .92;
}
.dt-alert strong { font-weight: 700; }
.dt-alert--warning { background: rgba(245,158,11,.06); border-color: #f59e0b; }
.dt-alert--info    { background: rgba(34,211,238,.06);  border-color: #22d3ee; }
.dt-alert--note    { background: rgba(139,92,246,.06);  border-color: #8b5cf6; }

.dt-table {
  width: 100%; border-collapse: collapse; margin: 14px 0; font-size: .83rem;
}
.dt-table th, .dt-table td {
  padding: 9px 13px; text-align: left;
  border-bottom: 1px solid rgba(148,163,184,.1);
}
.dt-table th {
  opacity: .45; font-weight: 700; font-size: .7rem;
  text-transform: uppercase; letter-spacing: .5px;
}
.dt-table td { opacity: .82; }
.dt-table tbody tr:last-child td { border-bottom: none; }

.dt-badge {
  display: inline-block; padding: 2px 9px; border-radius: 5px;
  font-size: .68rem; font-weight: 700;
}
.dt-badge--cyan    { background: rgba(34,211,238,.12);  color: #22d3ee; }
.dt-badge--amber   { background: rgba(245,158,11,.12);  color: #f59e0b; }
.dt-badge--emerald { background: rgba(16,185,129,.12);  color: #10b981; }
.dt-badge--rose    { background: rgba(244,63,94,.12);   color: #f43f5e; }
.dt-badge--violet  { background: rgba(139,92,246,.12);  color: #8b5cf6; }

.dt-flow {
  display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0; align-items: center;
}
.dt-flow-step {
  padding: 7px 14px; border-radius: 8px; font-size: .78rem; font-weight: 600;
  border: 1px solid rgba(148,163,184,.12); background: rgba(148,163,184,.04);
}
.dt-flow-arrow { opacity: .35; font-size: .8rem; }

.dt-footer {
  text-align: center; padding: 32px 0 8px;
  border-top: 1px solid rgba(148,163,184,.1);
  opacity: .35; font-size: .75rem;
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
            <h1>Manual de Usuario</h1>
            <p className="dt-sub">Cotizador Logístico — Guía Oficial de Uso del Sistema</p>
            <span className="dt-badge">Documento Interno · {new Date().getFullYear()}</span>
          </div>

          {/* ÍNDICE */}
          <div className="dt-toc">
            <div className="dt-toc-label">Tabla de Contenidos</div>
            <div className="dt-toc-grid">
              <a href="#primeros-pasos"><span className="dt-toc-num">01</span>Primeros Pasos</a>
              <a href="#panel"><span className="dt-toc-num">02</span>Panel Principal</a>
              <a href="#ruta"><span className="dt-toc-num">03</span>Paso 1 — Definir Ruta</a>
              <a href="#frecuencia"><span className="dt-toc-num">04</span>Paso 2 — Frecuencia</a>
              <a href="#vehiculo"><span className="dt-toc-num">05</span>Paso 3 — Vehículo</a>
              <a href="#rrhh"><span className="dt-toc-num">06</span>Paso 4 — Recurso Humano</a>
              <a href="#config-final"><span className="dt-toc-num">07</span>Paso 5 — Configuración Final</a>
              <a href="#documentos"><span className="dt-toc-num">08</span>Documentos Generados</a>
              <a href="#historial"><span className="dt-toc-num">09</span>Historial</a>
              <a href="#flota"><span className="dt-toc-num">10</span>Gestión de Flota</a>
              <a href="#gestion-rrhh"><span className="dt-toc-num">11</span>Gestión de RRHH</a>
              <a href="#configuracion"><span className="dt-toc-num">12</span>Configuración Global</a>
              <a href="#bi"><span className="dt-toc-num">13</span>Panel de Inteligencia</a>
            </div>
          </div>

          {/* ─── 01 PRIMEROS PASOS ─── */}
          <div className="dt-section" id="primeros-pasos">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--cyan">🔐</div>
              <div>
                <div className="dt-num-label">Sección 01</div>
                <h2>Primeros Pasos</h2>
              </div>
            </div>

            <h3>Registro de Cuenta</h3>
            <p>Para acceder al sistema necesitás crear una cuenta. Desde la pantalla de Registro completá los siguientes campos:</p>
            <ul>
              <li><strong>Nombre completo</strong> — Tu nombre y apellido.</li>
              <li><strong>Correo electrónico</strong> — Se usa como identificador único y para la verificación de cuenta.</li>
              <li><strong>Contraseña</strong> — Mínimo 8 caracteres, una mayúscula y un número. El indicador de fuerza te guía en tiempo real.</li>
            </ul>
            <p>Al registrarte, el sistema envía un email de verificación. Hacé clic en el link del correo para activar tu cuenta.</p>

            <h3>Iniciar Sesión</h3>
            <p>Desde la pantalla de Inicio de Sesión, ingresá tu correo electrónico y contraseña. Si la cuenta no está verificada, aparece un botón para reenviar el correo de verificación.</p>

            <h3>Ingreso con Google</h3>
            <p>Tanto en Inicio de Sesión como en Registro podés usar el botón "Continuar con Google". El sistema crea automáticamente tu cuenta la primera vez. Si ya tenés una cuenta con correo y contraseña e intentás ingresar con Google usando el mismo correo, el sistema te avisará del conflicto.</p>

            <h3>Recuperar Contraseña</h3>
            <p>Desde Inicio de Sesión → "¿Olvidaste tu contraseña?", ingresá tu correo electrónico. Recibirás un enlace para crear una nueva contraseña con las mismas validaciones de seguridad.</p>

            <div className="dt-alert dt-alert--info">
              <strong>Tip:</strong> Tocando el logo "Cotizador Logístico" desde cualquier pantalla de autenticación, volvés a la Página de Inicio.
            </div>
          </div>

          {/* ─── 02 PANEL PRINCIPAL ─── */}
          <div className="dt-section" id="panel">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--blue">🏠</div>
              <div>
                <div className="dt-num-label">Sección 02</div>
                <h2>Panel Principal</h2>
              </div>
            </div>

            <p>Una vez que iniciaste sesión, accedés al panel principal. El sistema está organizado con:</p>
            <ul>
              <li><strong>Barra Superior</strong> — Logo (al tocarlo volvés al cotizador), tu nombre de usuario, botón para cambiar entre modo claro y oscuro, y botón de cerrar sesión.</li>
              <li><strong>Menú Lateral</strong> — Navegación con 4 secciones: Cotizador (Nueva Cotización + Historial), Gestión (Vehículos + Recursos Humanos), Panel de Inteligencia y Configuración.</li>
              <li><strong>Asistente Inteligente</strong> — Panel contextual en el menú lateral que muestra consejos relevantes según la sección donde estés, con efecto de escritura animado.</li>
            </ul>

            <div className="dt-flow">
              <div className="dt-flow-step">1 · Ruta</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">2 · Frecuencia</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">3 · Vehículo</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">4 · RRHH</div>
              <span className="dt-flow-arrow">→</span>
              <div className="dt-flow-step">5 · Presupuesto</div>
            </div>

            <p>El cotizador sigue un flujo de 5 pasos secuenciales. Una barra de progreso horizontal en la parte superior indica en qué paso estás. Cada paso se detalla a continuación.</p>
          </div>

          {/* ─── 03 RUTA ─── */}
          <div className="dt-section" id="ruta">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--cyan">📍</div>
              <div>
                <div className="dt-num-label">Sección 03 — Cotizador</div>
                <h2>Paso 1: Definir Ruta</h2>
              </div>
            </div>

            <p>Este paso define el recorrido de la operación. La pantalla se divide en dos paneles:</p>

            <h3>Panel Izquierdo — Hoja de Ruta</h3>
            <ul>
              <li><strong>Buscador de direcciones</strong> — Escribí una dirección y seleccioná el resultado. Se agrega como punto a la Hoja de Ruta.</li>
              <li><strong>Hoja de Ruta (tabla)</strong> — Lista que podés reordenar arrastrando las filas. El último punto siempre es el destino final.</li>
              <li><strong>Ida y Vuelta</strong> — Checkbox que aparece al tener ≥2 puntos. Duplica kilómetros y costos variables.</li>
              <li><strong>Tipo de Carga</strong> — Selector con 3 opciones que impactan directamente en los costos:</li>
            </ul>

            <table className="dt-table">
              <thead><tr><th>Tipo de Carga</th><th>Impacto en el Costo</th></tr></thead>
              <tbody>
                <tr><td><strong>General</strong></td><td>Sin recargos adicionales</td></tr>
                <tr><td><strong>Refrigerada</strong></td><td>+25% sobre el costo de combustible (equipo de frío)</td></tr>
                <tr><td><strong>Peligrosa</strong></td><td>Recargo adicional por km configurable (seguro y protocolo especial)</td></tr>
              </tbody>
            </table>

            <h3>Panel Derecho — Visualizador de Ruta</h3>
            <p>Mapa interactivo de Google Maps que muestra el recorrido en tiempo real. Al calcular la ruta, aparecen los indicadores de Distancia (km) y Duración (min) en la parte inferior.</p>

            <div className="dt-alert dt-alert--warning">
              <strong>Requisito:</strong> Necesitás al menos 2 puntos y que la ruta esté calculada en el mapa para poder avanzar al Paso 2.
            </div>
          </div>

          {/* ─── 04 FRECUENCIA ─── */}
          <div className="dt-section" id="frecuencia">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--violet">🔄</div>
              <div>
                <div className="dt-num-label">Sección 04 — Cotizador</div>
                <h2>Paso 2: Frecuencia del Servicio</h2>
              </div>
            </div>

            <p>Definí si la operación es un viaje puntual o un servicio recurrente.</p>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--cyan">Esporádico</span></div>
              <p>Viaje(s) puntual(es). Definís la cantidad total de viajes que se van a realizar. Los costos fijos del vehículo se asignan completamente a esos viajes.</p>
            </div>

            <div className="dt-card">
              <div className="dt-card-title"><span className="dt-badge dt-badge--amber">Mensual</span></div>
              <p>Operativa recurrente. Seleccionás los días de la semana (L-M-X-J-V-S-D) y las vueltas por día. El sistema multiplica por 4.33 semanas/mes para estimar el total mensual. Al seleccionar 5 o más días, el sistema descuenta automáticamente los feriados nacionales que coincidan con días operativos. A mayor frecuencia, los costos fijos se prorratean entre más viajes, reduciendo el costo unitario.</p>
            </div>

            <p>También podés agregar <strong>Observaciones</strong> (horarios preferidos, restricciones, etc.).</p>
            <p>A la derecha aparece el <strong>Informe de Misión</strong>, panel que acompaña los pasos 2 al 5 mostrando el resumen de costos actualizado en tiempo real.</p>
          </div>

          {/* ─── 05 VEHÍCULO ─── */}
          <div className="dt-section" id="vehiculo">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--amber">🚛</div>
              <div>
                <div className="dt-num-label">Sección 05 — Cotizador</div>
                <h2>Paso 3: Asignar Vehículo</h2>
              </div>
            </div>

            <p>Elegí el vehículo que realizará la misión. La tabla muestra tu flota con paginación de 5 por página y buscador por marca, modelo o patente.</p>

            <h3>Acciones por vehículo (menú ⋮)</h3>
            <ul>
              <li><strong>Seleccionar</strong> — Activa el vehículo para la cotización actual. Queda resaltado visualmente.</li>
              <li><strong>Configurar</strong> — Abre un panel para ajustar los parámetros de costo específicos del vehículo para esta cotización: combustible, cubiertas, aceite, costos fijos, depreciación, etc.</li>
              <li><strong>Eliminar</strong> — Con confirmación. Si estaba seleccionado, se deselecciona.</li>
            </ul>

            <p>Si no tenés vehículos cargados, usá el botón "+ Añadir Vehículo" para crear uno nuevo con los datos predeterminados del sistema.</p>

            <table className="dt-table">
              <thead><tr><th>Tipo</th><th>Ejemplos típicos</th></tr></thead>
              <tbody>
                <tr><td>Utilitario</td><td>Kangoo, Partner, Berlingo</td></tr>
                <tr><td>Mediano</td><td>Sprinter, Master, Daily</td></tr>
                <tr><td>Grande</td><td>Accelo, Worker</td></tr>
                <tr><td>Camión</td><td>Atego, VM, Volvo FH</td></tr>
              </tbody>
            </table>
          </div>

          {/* ─── 06 RRHH ─── */}
          <div className="dt-section" id="rrhh">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--emerald">👤</div>
              <div>
                <div className="dt-num-label">Sección 06 — Cotizador</div>
                <h2>Paso 4: Asignar Recurso Humano</h2>
              </div>
            </div>

            <p>Asigná el colaborador que realizará la misión. La tabla funciona igual que la de vehículos: buscador, paginación y menú de acciones.</p>

            <h3>Modalidades de contratación</h3>

            <div className="dt-card">
              <div className="dt-card-title">Empleado — CCT 40/89</div>
              <p>Relación de dependencia encuadrada en el Convenio Colectivo de Trabajo 40/89. El sistema calcula el costo real completo: sueldo prorrateado por jornada o por hora según la duración del servicio, horas extra con recargo del 50%, cargas sociales y aportes patronales sobre el sueldo bruto, adicionales por km remunerativos, viáticos no remunerativos, adicional fijo mensual y costos de carga/descarga por tramo de ruta.</p>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Contratado</div>
              <p>Autónomo o tercerizado. El sistema calcula el equivalente CCT completo y lo multiplica por el factor de ajuste configurado (por defecto 75%). Este factor representa el ahorro en contribuciones patronales, SAC, vacaciones y ART que no aplican a la relación contractual. Los adicionales por km y viáticos se calculan de la misma manera que para un empleado.</p>
            </div>

            <div className="dt-alert dt-alert--info">
              <strong>Tip:</strong> Desde el menú (⋮) → "Configurar" podés personalizar sueldo, viáticos, adicionales por km y costos indirectos del colaborador seleccionado para esta cotización específica, sin alterar el registro base.
            </div>
          </div>

          {/* ─── 07 CONFIG FINAL ─── */}
          <div className="dt-section" id="config-final">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--cyan">🎯</div>
              <div>
                <div className="dt-num-label">Sección 07 — Cotizador</div>
                <h2>Paso 5: Configuración Final y Presupuesto</h2>
              </div>
            </div>

            <p>Último paso del cotizador. Acá definís tu rentabilidad y generás el presupuesto final.</p>

            <h3>Indicador Principal de Margen</h3>
            <p>En la parte superior se muestra en grande el Margen Neto (%) y la Ganancia por viaje ($) sobre el precio de venta. Se actualiza en tiempo real.</p>

            <h3>Controles Deslizantes</h3>
            <ul>
              <li><strong>Margen de Ganancia (0–50%)</strong> — Porcentaje de rentabilidad sobre el costo operativo. Muestra el equivalente en pesos debajo.</li>
              <li><strong>Gastos Administrativos (0–25%)</strong> — Porcentaje de gastos de gestión y estructura, calculado sobre el subtotal operativo.</li>
            </ul>

            <h3>Barra de Composición del Precio</h3>
            <p>Gráfico horizontal que muestra visualmente cómo se compone el precio final con segmentos de color: Costo Base (gris), Ganancia (celeste), Administrativo (violeta) y Extras (ámbar). Cada segmento muestra su porcentaje.</p>

            <h3>Campos Adicionales</h3>
            <ul>
              <li><strong>Peajes y Otros costos</strong> — Montos fijos extra que se suman al total operativo.</li>
              <li><strong>Datos del Cliente</strong> — Nombre o empresa que aparecerá en la propuesta comercial.</li>
              <li><strong>Términos</strong> — Condiciones de la oferta, vigencia, observaciones.</li>
            </ul>

            <h3>Acciones Finales</h3>
            <ul>
              <li><strong>"Finalizar y Ver Propuesta"</strong> — Guarda la cotización y abre la Propuesta Comercial en nueva pestaña.</li>
              <li><strong>Menú ▼ → "Guardar y Descargar Desglose"</strong> — Guarda y abre el Desglose Interno.</li>
            </ul>

            <div className="dt-alert dt-alert--note">
              <strong>Una vez guardada</strong>, los campos se bloquean pero aparecen botones para ver Propuesta y ver Desglose las veces que quieras.
            </div>
          </div>

          {/* ─── 08 DOCUMENTOS ─── */}
          <div className="dt-section" id="documentos">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--violet">📄</div>
              <div>
                <div className="dt-num-label">Sección 08</div>
                <h2>Documentos Generados</h2>
              </div>
            </div>

            <p>Al finalizar una cotización, el sistema genera dos documentos digitales listos para imprimir o descargar como PDF usando la función de impresión del navegador.</p>

            <div className="dt-card">
              <div className="dt-card-title">Propuesta Comercial — 3 páginas</div>
              <p>Documento orientado al cliente:</p>
              <ul>
                <li><strong>Página 1 — Portada:</strong> Imagen de fondo logístico, logo de la empresa, nombre del cliente, número de propuesta y fecha.</li>
                <li><strong>Página 2 — Resumen Ejecutivo:</strong> Indicadores clave (distancia, duración, vehículo, frecuencia), precio de venta destacado, y tarjetas de "Garantía de Servicio".</li>
                <li><strong>Página 3 — Mapa e Itinerario:</strong> Mapa de la ruta, lista de paradas, código QR para abrir la ruta en Google Maps, términos y área de firmas.</li>
              </ul>
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Desglose Interno — 7 capítulos</div>
              <p>Informe técnico de uso interno con todos los costos detallados:</p>
              <ul>
                <li><strong>Panel Ejecutivo</strong> — Indicadores principales, análisis Costos Fijos vs Variables, gráfico circular de estructura de costos e indicadores de eficiencia (precio por km, por hora, viajes mensuales).</li>
                <li><strong>Ruta y Frecuencia</strong> — Detalle de puntos, kilómetros, duración y tipo de servicio.</li>
                <li><strong>Ficha del Vehículo</strong> — Datos completos del vehículo asignado.</li>
                <li><strong>Costos del Vehículo</strong> — Desglose línea por línea: combustible, cubiertas, aceite, depreciación, costos fijos prorrateados.</li>
                <li><strong>Ficha del Recurso Humano</strong> — Datos del colaborador.</li>
                <li><strong>Costos del Recurso Humano</strong> — Sueldo prorrateado, adicionales, viáticos, cargas sociales o factor contratado.</li>
                <li><strong>Consolidado Final</strong> — Tabla resumen del costo operativo, administrativo, ganancia y precio de venta sin y con IVA.</li>
              </ul>
            </div>

            <h3>Compartir con el Cliente — Modo Público</h3>
            <p>Desde el Desglose, el botón <strong>Compartir</strong> genera un enlace público único que podés enviar al cliente directamente. La vista pública muestra el desglose de costos y el precio final, pero <strong>oculta automáticamente</strong> los datos internos de rentabilidad:</p>
            <table className="dt-table">
              <thead><tr><th>Contenido</th><th>Vista Interna</th><th>Vista Pública (cliente)</th></tr></thead>
              <tbody>
                <tr><td>Desglose de costos (vehículo + RRHH)</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Precio de venta con y sin IVA</td><td>Visible</td><td>Visible</td></tr>
                <tr><td>Margen de ganancia (% y monto)</td><td>Visible</td><td>Oculto</td></tr>
                <tr><td>Gráfico de distribución del precio</td><td>Visible</td><td>Oculto</td></tr>
                <tr><td>KPIs internos de rentabilidad</td><td>Visible</td><td>Oculto</td></tr>
              </tbody>
            </table>
            <div className="dt-alert dt-alert--warning">
              <strong>Seguridad comercial:</strong> El cliente que accede al link público nunca puede ver tu margen de ganancia. El enlace es único por cotización y no requiere que el cliente tenga cuenta en el sistema.
            </div>
          </div>

          {/* ─── 09 HISTORIAL ─── */}
          <div className="dt-section" id="historial">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--blue">📚</div>
              <div>
                <div className="dt-num-label">Sección 09</div>
                <h2>Historial de Cotizaciones</h2>
              </div>
            </div>

            <p>Desde el menú lateral → Cotizador → Historial accedés a la tabla de todas las cotizaciones guardadas.</p>

            <table className="dt-table">
              <thead><tr><th>Columna</th><th>Descripción</th></tr></thead>
              <tbody>
                <tr><td><strong>Fecha</strong></td><td>Fecha de creación de la cotización</td></tr>
                <tr><td><strong>Cliente</strong></td><td>Nombre del cliente cotizado</td></tr>
                <tr><td><strong>Vehículo</strong></td><td>Marca, modelo y patente</td></tr>
                <tr><td><strong>Colaborador</strong></td><td>Nombre del recurso humano asignado</td></tr>
                <tr><td><strong>Total</strong></td><td>Precio de venta final (sin IVA)</td></tr>
              </tbody>
            </table>

            <h3>Acciones por cotización (menú ⋮)</h3>
            <ul>
              <li><strong>Ver Propuesta</strong> — Abre la propuesta comercial en nueva pestaña.</li>
              <li><strong>Ver Desglose</strong> — Abre el desglose interno en nueva pestaña.</li>
              <li><strong>Eliminar</strong> — Con modal de confirmación. Acción irreversible.</li>
            </ul>

            <p>La tabla está paginada (7 registros por página) y tiene un buscador para filtrar por cliente.</p>
          </div>

          {/* ─── 10 FLOTA ─── */}
          <div className="dt-section" id="flota">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--amber">🚚</div>
              <div>
                <div className="dt-num-label">Sección 10</div>
                <h2>Gestión de Flota</h2>
              </div>
            </div>

            <p>Desde <strong>Gestión → Vehículos</strong> administrás toda tu flota. Esta sección es independiente del cotizador y permite crear, editar y eliminar vehículos libremente.</p>

            <h3>Crear Vehículo</h3>
            <p>El botón "+ Nuevo Vehículo" abre un formulario con todos los campos. Al seleccionar el tipo (Utilitario / Mediano / Grande / Camión) se pre-cargan los valores predeterminados desde la Configuración Global, ahorrándote cargar todo manualmente.</p>

            <h3>Campos principales</h3>
            <ul>
              <li><strong>Datos generales</strong> — Tipo, patente, marca, modelo, año, tipo de combustible, rendimiento km/L.</li>
              <li><strong>Capacidad</strong> — Peso máximo (kg), volumen (m³), cantidad de cubiertas.</li>
              <li><strong>Costos variables</strong> — Precio combustible/L, precio cubierta, precio cambio aceite, vida útil en km para vehículo, cubiertas y aceite.</li>
              <li><strong>Costos fijos mensuales</strong> — Mantenimiento preventivo, seguro, patente municipal, patente provincial.</li>
              <li><strong>Depreciación</strong> — Precio vehículo nuevo, valor residual (%). Solo aplica para vehículos de ≤10 años de antigüedad.</li>
              <li><strong>GNC</strong> — Si el vehículo tiene equipo de GNC, activar el toggle e ingresar el precio del m³ de gas. El sistema usa automáticamente el rendimiento GNC para calcular el costo de combustible.</li>
            </ul>

            <div className="dt-alert dt-alert--info">
              <strong>Patente única por cuenta:</strong> La patente de cada vehículo debe ser única dentro de tu cuenta. Si intentás registrar una patente que ya existe en tu flota, el sistema te avisa con un mensaje claro. Dos cuentas distintas sí pueden tener el mismo vehículo registrado.
            </div>

            <div className="dt-alert dt-alert--note">
              Los vehículos creados aquí aparecen automáticamente en el Paso 3 del cotizador para poder seleccionarlos.
            </div>
          </div>

          {/* ─── 11 GESTIÓN RRHH ─── */}
          <div className="dt-section" id="gestion-rrhh">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--emerald">👥</div>
              <div>
                <div className="dt-num-label">Sección 11</div>
                <h2>Gestión de Recursos Humanos</h2>
              </div>
            </div>

            <p>Desde <strong>Gestión → Recursos Humanos</strong> administrás tu equipo de colaboradores con la misma mecánica que la flota.</p>

            <h3>Campos principales</h3>
            <ul>
              <li><strong>Datos personales</strong> — Nombre completo, DNI, CUIL, teléfono, email y modalidad de contratación (Empleado / Contratado).</li>
              <li><strong>Sueldo (Empleado CCT 40/89)</strong> — Sueldo básico según escala vigente, adicional por actividad (%), adicional no remunerativo fijo mensual. Mantener actualizado con cada nueva escala del convenio.</li>
              <li><strong>Adicionales por km</strong> — Monto remunerativo ($/km con mínimo CCT), viático No Remunerativo ($/km con mínimo CCT).</li>
              <li><strong>Carga/descarga</strong> — Monto del adicional y cada cuántos km aplica (por tramo de ruta).</li>
              <li><strong>Jornada</strong> — Horas laborales mensuales (divisor para valor hora) y mínimo de minutos facturables por servicio.</li>
              <li><strong>Cargas sociales (Empleado)</strong> — Porcentaje de contribuciones patronales sobre la base remunerativa.</li>
              <li><strong>Factor sobre Empleado (Contratado)</strong> — Porcentaje del equivalente CCT que se cobra al contratado. Por defecto 75%, reflejando el ahorro en cargas que no aplican.</li>
            </ul>

            <div className="dt-alert dt-alert--warning">
              <strong>Escalas CCT 40/89:</strong> Los valores de sueldo, adicionales por km y viáticos cambian con cada actualización del convenio. Actualizar estos campos en cuanto entre en vigencia una nueva escala para que los presupuestos reflejen costos reales. Los presupuestos ya guardados conservan los valores con los que fueron calculados.
            </div>
          </div>

          {/* ─── 12 CONFIGURACIÓN GLOBAL ─── */}
          <div className="dt-section" id="configuracion">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--rose">⚙️</div>
              <div>
                <div className="dt-num-label">Sección 12</div>
                <h2>Configuración Global</h2>
              </div>
            </div>

            <p>Los valores predeterminados del sistema. Al crear un vehículo o colaborador nuevo, se cargan automáticamente con estos datos. Los registros existentes no se modifican al guardar cambios aquí.</p>

            <h3>Pestaña: Vehículos — 4 sub-pestañas</h3>
            <p>Un formulario por tipo de vehículo (Utilitario, Mediano, Grande, Camión) con: combustible, capacidad, precios de referencia, costos fijos mensuales, desgaste y vida útil. Estos valores se usan como punto de partida al dar de alta nuevas unidades.</p>

            <h3>Pestaña: Recursos Humanos — 2 sub-pestañas</h3>
            <p>Un formulario por modalidad (Empleado CCT 40/89, Contratado) con: sueldo base, adicionales por km remunerativos, viáticos no remunerativos, adicional fijo, carga/descarga, jornada laboral, cargas sociales y factor sobre empleado. <strong>Actualizar estos valores con cada nueva escala del CCT 40/89.</strong></p>

            <h3>Pestaña: Constantes de Cálculo</h3>
            <p>Parámetros que afectan a todos los cálculos del sistema:</p>

            <table className="dt-table">
              <thead><tr><th>Constante</th><th>Valor por Defecto</th><th>Función</th></tr></thead>
              <tbody>
                <tr><td><strong>Tiempo Carga/Descarga</strong></td><td>30 min</td><td>Se suma a la duración del viaje para calcular la ocupación real del vehículo y del colaborador</td></tr>
                <tr><td><strong>Umbral Jornada Completa</strong></td><td>180 min</td><td>Si la misión supera este valor, se asigna el 100% del costo fijo diario del vehículo y se cobra jornada completa al colaborador</td></tr>
                <tr><td><strong>Duración Jornada Completa</strong></td><td>480 min (8h)</td><td>Denominador para prorratear costos fijos por proporción de uso en servicios cortos</td></tr>
                <tr><td><strong>Factor GNC</strong></td><td>1.15×</td><td>El GNC rinde un 15% más que nafta por metro cúbico equivalente</td></tr>
                <tr><td><strong>Factor Carga Refrigerada</strong></td><td>1.25×</td><td>Incremento del 25% sobre el consumo de combustible por el equipo de frío</td></tr>
                <tr><td><strong>Costo Adicional km Peligrosa</strong></td><td>$350/km</td><td>Recargo extra por km para cubrir seguro especial y protocolo de carga peligrosa</td></tr>
                <tr><td><strong>Porcentaje IVA</strong></td><td>21%</td><td>IVA aplicado sobre el precio de venta para mostrar el total con impuesto incluido</td></tr>
                <tr><td><strong>Semanas por Mes</strong></td><td>4.33</td><td>Multiplicador para convertir días/semana en días/mes en frecuencia mensual</td></tr>
                <tr><td><strong>Días Laborales por Mes</strong></td><td>22</td><td>Denominador para calcular el costo fijo diario y el jornal del colaborador</td></tr>
                <tr><td><strong>Horas Laborales Mensuales</strong></td><td>192 h</td><td>Denominador para calcular el valor hora del colaborador</td></tr>
                <tr><td><strong>Divisor Jornal CCT</strong></td><td>24</td><td>El jornal diario CCT se obtiene dividiendo el sueldo mensual por 24 (según CCT 40/89)</td></tr>
              </tbody>
            </table>

            <div className="dt-alert dt-alert--warning">
              <strong>Atención:</strong> Modificar las constantes de cálculo afecta a todas las cotizaciones futuras. Los presupuestos ya guardados no se ven alterados. Realizá cambios con precaución.
            </div>
          </div>

          {/* ─── 13 BI ─── */}
          <div className="dt-section" id="bi">
            <div className="dt-section-header">
              <div className="dt-section-icon ic--cyan">📈</div>
              <div>
                <div className="dt-num-label">Sección 13</div>
                <h2>Panel de Inteligencia de Negocio</h2>
              </div>
            </div>

            <p>Panel analítico que muestra indicadores calculados automáticamente a partir de todas tus cotizaciones guardadas.</p>

            <h3>Tarjetas de Indicadores — 8 métricas</h3>
            <table className="dt-table">
              <thead><tr><th>Indicador</th><th>Qué mide</th></tr></thead>
              <tbody>
                <tr><td><strong>Cotizaciones</strong></td><td>Total de presupuestos generados en el sistema</td></tr>
                <tr><td><strong>Facturación Total</strong></td><td>Suma de todos los precios de venta (facturación acumulada)</td></tr>
                <tr><td><strong>Margen Promedio</strong></td><td>Porcentaje de ganancia promedio sobre el precio de venta</td></tr>
                <tr><td><strong>Costo/Km</strong></td><td>Costo operativo promedio por kilómetro cotizado</td></tr>
                <tr><td><strong>Distancia Total</strong></td><td>Kilómetros totales cotizados</td></tr>
                <tr><td><strong>Flota Activa</strong></td><td>Cantidad de vehículos registrados en el sistema</td></tr>
                <tr><td><strong>Personal</strong></td><td>Cantidad de colaboradores registrados</td></tr>
                <tr><td><strong>Frecuencia</strong></td><td>Porcentaje de cotizaciones mensuales vs. esporádicas</td></tr>
              </tbody>
            </table>

            <h3>Gráficos</h3>
            <ul>
              <li><strong>Facturación Mensual</strong> — Evolución de los últimos 6 meses con dos líneas: Facturación (ingreso total) y Ganancia (ganancia neta). Permite ver la tendencia y la brecha entre ingreso y beneficio.</li>
              <li><strong>Distribución de Costos</strong> — Gráfico circular que muestra el peso relativo promedio de cada componente: Vehículo, Recursos Humanos, Administrativo, Peajes y Otros.</li>
              <li><strong>Cotizaciones por Tipo de Vehículo</strong> — Gráfico de barras horizontal que muestra qué tipo de vehículo cotizás más frecuentemente.</li>
            </ul>

            <h3>Top Clientes y Actividad Reciente</h3>
            <ul>
              <li><strong>Mejores Clientes</strong> — Ranking de clientes por facturación generada, con medallas dorada, plateada y bronce.</li>
              <li><strong>Actividad Reciente</strong> — Últimas cotizaciones con cliente, vehículo, kilómetros y monto.</li>
            </ul>
          </div>

          {/* FOOTER */}
          <div className="dt-footer">
            <p>Cotizador Logístico — Manual de Usuario · Guía Oficial del Sistema</p>
            <p>© {new Date().getFullYear()} — Documento interno confidencial</p>
          </div>

        </div>
      </ScrollArea>
    </>
  );
};

export default DocumentacionTecnica;
