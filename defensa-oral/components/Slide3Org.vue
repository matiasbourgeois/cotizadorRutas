<template>
  <div class="org-slide">


    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Relevamiento Funcional</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        La Organización
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:350}}">
        Estructura de gestión familiar con tres unidades que intervienen en cada cotización.
      </p>

      <!-- Stats row -->
      <div class="stats-row" v-motion :initial="{opacity:0,y:16}" :enter="{opacity:1,y:0,transition:{duration:700,delay:500}}">
        <div class="stat">
          <span class="stat-num">3</span>
          <span class="stat-label">Roles clave</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num warn">Manual</span>
          <span class="stat-label">Proceso actual</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num warn">Excel</span>
          <span class="stat-label">Herramienta base</span>
        </div>
      </div>

      <!-- Pain point callout -->
      <div class="callout" v-motion :initial="{opacity:0,y:12}" :enter="{opacity:1,y:0,transition:{duration:600,delay:700}}">
        <div class="callout-accent"></div>
        <p>El proceso depende de <strong>reuniones informales</strong>, <strong>planillas compartidas</strong> y la <strong>memoria del personal</strong> — sin trazabilidad ni estandarización.</p>
      </div>

    </div>

    <!-- RIGHT COLUMN: Process Flow -->
    <div class="right">

      <!-- Step 1: Logística -->
      <div class="flow-card" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="flow-num">
          <span class="num-circle blue">1</span>
        </div>
        <div class="flow-content">
          <div class="flow-header">
            <span class="flow-area blue">Área de Logística</span>
            <span class="flow-role">Jefe de Logística</span>
          </div>
          <ul class="flow-list">
            <li>Analiza viabilidad de la ruta solicitada</li>
            <li>Estima kilómetros y tiempos de viaje</li>
            <li>Define vehículo y personal necesario</li>
          </ul>
          <div class="flow-output">
            <span class="output-label">Produce →</span>
            <span class="output-value">Datos operativos base</span>
          </div>
        </div>
      </div>

      <!-- Connector 1→2 -->
      <div class="connector" v-click>
        <div class="connector-line"></div>
        <div class="connector-chevron">‹</div>
      </div>

      <!-- Step 2: Administración -->
      <div class="flow-card" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="flow-num">
          <span class="num-circle cyan">2</span>
        </div>
        <div class="flow-content">
          <div class="flow-header">
            <span class="flow-area cyan">Área de Administración</span>
            <span class="flow-role">Jefe de Administración</span>
          </div>
          <ul class="flow-list">
            <li>Calcula costos operativos detallados</li>
            <li>Estructura presupuesto y margen de ganancia</li>
            <li>Genera la propuesta comercial</li>
          </ul>
          <div class="flow-output">
            <span class="output-label">Produce →</span>
            <span class="output-value">Cotización preliminar</span>
          </div>
        </div>
      </div>

      <!-- Connector 2→3 -->
      <div class="connector" v-click>
        <div class="connector-line"></div>
        <div class="connector-chevron">‹</div>
      </div>

      <!-- Step 3: Dirección -->
      <div class="flow-card final" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="flow-num">
          <span class="num-circle amber">3</span>
        </div>
        <div class="flow-content">
          <div class="flow-header">
            <span class="flow-area amber">Dirección General</span>
            <span class="flow-role">Nivel Estratégico</span>
          </div>
          <ul class="flow-list">
            <li>Supervisa rentabilidad de la propuesta</li>
            <li>Aprobación final en operaciones de alto valor</li>
          </ul>
          <div class="flow-output final-output">
            <span class="output-label">Resultado →</span>
            <span class="output-value amber-text">Propuesta al cliente</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.org-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 2rem 4.5rem;
  gap: 3rem;
  overflow: hidden;
  background:
    radial-gradient(ellipse 50% 60% at 25% 50%, rgba(59,130,246,0.03) 0%, transparent 60%),
    radial-gradient(ellipse 40% 50% at 80% 40%, rgba(245,158,11,0.03) 0%, transparent 60%);
}


/* ═══ LEFT ═══ */
.left {
  width: 42%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.tag-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.8rem;
}
.tag-bar {
  width: 3.5rem;
  height: 2px;
  background: linear-gradient(90deg, #60a5fa, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #60a5fa;
}

h1 {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 0.8rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 0.88rem;
  color: #475569;
  font-weight: 300;
  line-height: 1.6;
  padding-left: 1.25rem;
  border-left: 2px solid rgba(96,165,250,0.4);
  margin-bottom: 1.8rem;
}

/* Stats */
.stats-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.85rem 1.2rem;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(71,85,105,0.3);
  border-radius: 0.85rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.stat-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: #60a5fa;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(96,165,250,0.5));
}
.stat-num.warn {
  font-size: 0.9rem;
  color: #f87171;
  filter: drop-shadow(0 0 6px rgba(248,113,113,0.4));
}
.stat-label {
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #475569;
  margin-top: 0.25rem;
  text-align: center;
}
.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(71,85,105,0.4);
}

/* Callout */
.callout {
  display: flex;
  overflow: hidden;
  border-radius: 0.7rem;
  background: rgba(248,113,113,0.06);
  border: 1px solid rgba(248,113,113,0.2);
  backdrop-filter: blur(10px);
}
.callout-accent {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #f87171, rgba(248,113,113,0.15));
}
.callout p {
  padding: 0.7rem 1rem;
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.5;
  margin: 0;
}
.callout strong {
  color: #f87171;
  font-weight: 600;
}

/* ═══ RIGHT: PROCESS FLOW ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 0;
  position: relative;
  z-index: 1;
}

/* Flow cards */
.flow-card {
  display: flex;
  gap: 0.8rem;
  padding: 0.7rem 1.1rem;
  background: rgba(15,23,42,0.65);
  border: 1px solid rgba(71,85,105,0.35);
  border-radius: 0.85rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
}
.flow-card:hover {
  border-color: rgba(96,165,250,0.4);
  box-shadow: 0 16px 50px rgba(0,0,0,0.45);
  transform: translateX(4px);
}
.flow-card.final:hover {
  border-color: rgba(245,158,11,0.4);
}

/* Number circle */
.flow-num {
  display: flex;
  align-items: flex-start;
  padding-top: 0.15rem;
}
.num-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 900;
  color: #0f172a;
  flex-shrink: 0;
}
.num-circle.blue  { background: #60a5fa; box-shadow: 0 0 12px rgba(96,165,250,0.5); }
.num-circle.cyan  { background: #22d3ee; box-shadow: 0 0 12px rgba(34,211,238,0.5); }
.num-circle.amber { background: #f59e0b; box-shadow: 0 0 12px rgba(245,158,11,0.5); }

/* Flow content */
.flow-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.flow-header {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.flow-area {
  font-size: 0.48rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}
.flow-area.blue  { color: #60a5fa; }
.flow-area.cyan  { color: #22d3ee; }
.flow-area.amber { color: #f59e0b; }
.flow-role {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

/* Flow list */
.flow-list {
  list-style: none;
  padding: 0;
  margin: 0.2rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.flow-list li {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 300;
  padding-left: 0.8rem;
  position: relative;
  line-height: 1.35;
}
.flow-list li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: #475569;
  font-weight: 700;
}

/* Output badge */
.flow-output {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.2rem;
  padding: 0.2rem 0.55rem;
  background: rgba(96,165,250,0.06);
  border: 1px solid rgba(96,165,250,0.15);
  border-radius: 50px;
  width: fit-content;
}
.flow-card:nth-child(5) .flow-output {
  background: rgba(34,211,238,0.06);
  border-color: rgba(34,211,238,0.15);
}
.final-output {
  background: rgba(245,158,11,0.08) !important;
  border-color: rgba(245,158,11,0.25) !important;
}
.output-label {
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #475569;
  font-weight: 600;
}
.output-value {
  font-size: 0.6rem;
  color: #94a3b8;
  font-weight: 500;
}
.amber-text { color: #f59e0b !important; font-weight: 700 !important; }

/* Connectors */
.connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 10px;
  flex-shrink: 0;
  gap: 0;
}
.connector-line {
  width: 1.5px;
  flex: 1;
  background: rgba(245,158,11,0.3);
}
.connector-chevron {
  font-size: 0.55rem;
  color: rgba(245,158,11,0.45);
  line-height: 0;
  transform: rotate(-90deg);
  margin-top: -2px;
}
</style>
