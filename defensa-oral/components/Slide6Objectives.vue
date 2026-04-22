<template>
  <div class="objectives-slide">

    <!-- Ambient glow -->
    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Propuesta de Solución</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Objetivos
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        Definición del alcance y las metas del sistema, alineadas con la problemática diagnosticada.
      </p>

      <!-- Objetivo General Card -->
      <div class="general-card" v-motion :initial="{opacity:0,y:20}" :enter="{opacity:1,y:0,transition:{duration:900,delay:450}}">
        <div class="general-glow"></div>
        <div class="general-header">
          <span class="badge green">Objetivo General</span>
        </div>
        <p class="general-text">
          Desarrollar un <strong>Sistema de Cotización Inteligente</strong> para la empresa Sol del Amanecer S.R.L., mediante la implementación de un
          <strong>motor de cálculo de costos</strong> y un <strong>generador de propuestas comerciales</strong>,
          para automatizar el proceso de cotización, optimizando la <strong>rentabilidad</strong> y la
          <strong>toma de decisiones estratégicas</strong> en sus servicios de transporte de carga dedicada.
        </p>
      </div>

      <!-- Arrow indicator -->
      <div class="branch-indicator" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:700}}">
        <div class="branch-line"></div>
        <span class="branch-text">Se descompone en 3 objetivos específicos</span>
        <div class="branch-arrow">›</div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Specific Objectives -->
    <div class="right">

      <div class="specs-header" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:500}}">
        <span class="specs-badge">Objetivos Específicos</span>
      </div>

      <!-- Obj Específico 1: Motor de Cálculo -->
      <div class="spec-card" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="spec-accent cyan"></div>
        <div class="spec-num-wrap cyan">
          <span class="spec-num">1</span>
        </div>
        <div class="spec-body">
          <span class="spec-title">Motor de Cálculo</span>
          <span class="spec-desc">Desarrollar el motor de cálculo del sistema, capaz de <strong>procesar y centralizar la totalidad de las variables</strong> que componen la estructura de costos del servicio, para realizar el <strong>análisis y desglose detallado</strong> de los costos operativos.</span>
          <div class="spec-hu">
            <span class="hu-tag cyan">Core del sistema</span>
          </div>
        </div>
        <div class="card-glow cyan"></div>
      </div>

      <!-- Connector -->
      <div class="connector" v-click>
        <div class="connector-line"></div>
        <div class="connector-chevron">‹</div>
      </div>

      <!-- Obj Específico 2: Automatización Documental -->
      <div class="spec-card" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="spec-accent amber"></div>
        <div class="spec-num-wrap amber">
          <span class="spec-num">2</span>
        </div>
        <div class="spec-body">
          <span class="spec-title">Automatización Documental</span>
          <span class="spec-desc">Automatizar la generación de las <strong>propuestas comerciales</strong> para el cliente y de los <strong>informes de desglose de costos</strong> para uso interno, transformando los datos del motor de cálculo en <strong>formatos estandarizados y profesionales</strong>.</span>
          <div class="spec-hu">
            <span class="hu-tag amber">Documentos digitales</span>
          </div>
        </div>
        <div class="card-glow amber"></div>
      </div>

      <!-- Connector -->
      <div class="connector" v-click>
        <div class="connector-line"></div>
        <div class="connector-chevron">‹</div>
      </div>

      <!-- Obj Específico 3: Inteligencia de Negocio -->
      <div class="spec-card" v-click v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="spec-accent emerald"></div>
        <div class="spec-num-wrap emerald">
          <span class="spec-num">3</span>
        </div>
        <div class="spec-body">
          <span class="spec-title">Panel de Inteligencia de Negocio</span>
          <span class="spec-desc">Implementar un panel de inteligencia de negocio que, a través de la visualización de <strong>datos históricos</strong>, permita optimizar la rentabilidad y soportar la <strong>toma de decisiones estratégicas</strong>.</span>
          <div class="spec-hu">
            <span class="hu-tag emerald">Dashboard BI</span>
          </div>
        </div>
        <div class="card-glow emerald"></div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.objectives-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 2rem 4.5rem;
  gap: 3rem;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  top: 20%;
  left: 8%;
  width: 450px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 65%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  bottom: 15%;
  right: 15%;
  width: 350px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 65%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}


/* ═══ LEFT ═══ */
.left {
  width: 44%;
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
  margin-bottom: 1.5rem;
}
.tag-bar {
  width: 3.5rem;
  height: 2px;
  background: linear-gradient(90deg, #22c55e, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #22c55e;
}

h1 {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 0.7rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 0.82rem;
  color: #475569;
  font-weight: 300;
  line-height: 1.6;
  padding-left: 1.25rem;
  border-left: 2px solid rgba(34,197,94,0.4);
  margin-bottom: 1.6rem;
}

/* General objective card */
.general-card {
  position: relative;
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.25);
  border-radius: 1rem;
  padding: 1.1rem 1.4rem;
  margin-bottom: 1.2rem;
  overflow: hidden;
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
}
.general-card:hover {
  border-color: rgba(34,197,94,0.45);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}
.general-glow {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(34,197,94,0.1);
  filter: blur(45px);
  pointer-events: none;
}
.general-header {
  margin-bottom: 0.5rem;
}
.badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  padding: 0.2rem 0.65rem;
  border-radius: 50px;
}
.badge.green {
  color: #22c55e;
  background: rgba(34,197,94,0.12);
  border: 1px solid rgba(34,197,94,0.3);
}
.general-text {
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
}
.general-text strong {
  color: #e2e8f0;
  font-weight: 600;
}

/* Branch indicator */
.branch-indicator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.branch-line {
  width: 2.5rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(34,197,94,0.5), rgba(34,197,94,0.15));
}
.branch-text {
  font-size: 0.55rem;
  color: #475569;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.branch-arrow {
  font-size: 0.85rem;
  color: #22c55e;
  font-weight: 700;
  animation: arrow-pulse 2s ease-in-out infinite;
}
@keyframes arrow-pulse {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(4px); opacity: 1; }
}

/* ═══ RIGHT ═══ */
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

.specs-header {
  margin-bottom: 0.7rem;
}
.specs-badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #94a3b8;
  padding: 0.2rem 0.6rem;
  background: rgba(71,85,105,0.22);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 50px;
}

/* Spec cards */
.spec-card {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  padding: 0.85rem 1.1rem;
  background: rgba(15,23,42,0.65);
  border: 1px solid rgba(71,85,105,0.35);
  border-radius: 0.85rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
}
.spec-card:hover {
  box-shadow: 0 16px 50px rgba(0,0,0,0.45);
  transform: translateX(4px);
}
.spec-card:nth-child(2):hover { border-color: rgba(34,211,238,0.4); }
.spec-card:nth-child(4):hover { border-color: rgba(245,158,11,0.4); }
.spec-card:nth-child(6):hover { border-color: rgba(52,211,153,0.4); }

/* Accent bar */
.spec-accent {
  width: 3px;
  align-self: stretch;
  border-radius: 4px;
  flex-shrink: 0;
  margin: -0.85rem 0 -0.85rem -1.1rem;
}
.spec-accent.cyan { background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.15)); }
.spec-accent.amber { background: linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.15)); }
.spec-accent.emerald { background: linear-gradient(to bottom, #34d399, rgba(52,211,153,0.15)); }

/* Number circle */
.spec-num-wrap {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  margin-left: 0.5rem;
}
.spec-num-wrap.cyan {
  background: linear-gradient(135deg, rgba(34,211,238,0.25), rgba(34,211,238,0.08));
  border: 1px solid rgba(34,211,238,0.4);
  box-shadow: 0 0 14px rgba(34,211,238,0.25);
}
.spec-num-wrap.amber {
  background: linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.08));
  border: 1px solid rgba(245,158,11,0.4);
  box-shadow: 0 0 14px rgba(245,158,11,0.25);
}
.spec-num-wrap.emerald {
  background: linear-gradient(135deg, rgba(52,211,153,0.25), rgba(52,211,153,0.08));
  border: 1px solid rgba(52,211,153,0.4);
  box-shadow: 0 0 14px rgba(52,211,153,0.25);
}
.spec-num {
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1;
}
.spec-num-wrap.cyan .spec-num { color: #22d3ee; }
.spec-num-wrap.amber .spec-num { color: #f59e0b; }
.spec-num-wrap.emerald .spec-num { color: #34d399; }

/* Spec body */
.spec-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.spec-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}
.spec-desc {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.5;
}
.spec-desc strong {
  color: #94a3b8;
  font-weight: 600;
}

/* HU tags */
.spec-hu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
}
.hu-tag {
  font-size: 0.48rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.15rem 0.5rem;
  border-radius: 50px;
}
.hu-tag.cyan {
  color: #22d3ee;
  background: rgba(34,211,238,0.1);
  border: 1px solid rgba(34,211,238,0.25);
}
.hu-tag.amber {
  color: #f59e0b;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
}
.hu-tag.emerald {
  color: #34d399;
  background: rgba(52,211,153,0.1);
  border: 1px solid rgba(52,211,153,0.25);
}

/* Card glow */
.card-glow {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(30px);
  pointer-events: none;
}
.card-glow.cyan { background: rgba(34,211,238,0.1); }
.card-glow.amber { background: rgba(245,158,11,0.1); }
.card-glow.emerald { background: rgba(52,211,153,0.1); }

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
  background: rgba(34,197,94,0.3);
}
.connector-chevron {
  font-size: 0.55rem;
  color: rgba(34,197,94,0.45);
  line-height: 0;
  transform: rotate(-90deg);
  margin-top: -2px;
}
</style>
