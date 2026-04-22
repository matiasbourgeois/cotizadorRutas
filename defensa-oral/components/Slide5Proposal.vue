<template>
  <div class="proposal-slide">

    <!-- Ambient glow -->
    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Diagnóstico y Propuesta</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        La Solución
      </h1>

      <!-- Proposal text -->
      <div class="proposal-card" v-motion :initial="{opacity:0,y:20}" :enter="{opacity:1,y:0,transition:{duration:900,delay:350}}">
        <div class="proposal-glow"></div>
        <div class="proposal-header">
          <span class="badge emerald">Propuesta</span>
        </div>
        <p class="proposal-text">
          Aplicación web para <strong>automatizar y centralizar</strong> el proceso de cotización,
          integrando un <strong>motor de cálculo en tiempo real</strong> e <strong>información geoespacial</strong>
          para distancias y duraciones de ruta.
        </p>
      </div>

      <!-- Limits card -->
      <div class="limits-card" v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:700,delay:600}}">
        <div class="limits-accent"></div>
        <div class="limits-body">
          <span class="limits-label">Límite del Prototipo</span>
          <p>Desde <strong>inicio de sesión</strong> → hasta <strong>documento comercial final</strong> (Propuesta Comercial o Desglose de Costos)</p>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Alcances -->
    <div class="right">

      <div class="alcances-header" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:400}}">
        <span class="alcances-badge">Alcances del Prototipo</span>
        <span class="alcances-count">8 funcionalidades</span>
      </div>

      <div class="alcances-list">

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">1</span></div>
          <div class="alcance-body"><span class="alcance-title">Gestión de flota</span><span class="alcance-text">ABM y parámetros de costos</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">2</span></div>
          <div class="alcance-body"><span class="alcance-title">Gestión de RRHH</span><span class="alcance-text">Contratación y costos salariales</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">3</span></div>
          <div class="alcance-body"><span class="alcance-title">Rutas interactivas</span><span class="alcance-text">Mapa con cálculo automático</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">4</span></div>
          <div class="alcance-body"><span class="alcance-title">Frecuencia</span><span class="alcance-text">Esporádica o mensual</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">5</span></div>
          <div class="alcance-body"><span class="alcance-title">Motor de cálculo</span><span class="alcance-text">Costos de vehículo + RRHH + extras</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">6</span></div>
          <div class="alcance-body"><span class="alcance-title">Rentabilidad</span><span class="alcance-text">Costos administrativos y margen</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">7</span></div>
          <div class="alcance-body"><span class="alcance-title">Documentos digitales</span><span class="alcance-text">Propuesta Comercial + Desglose interno</span></div>
        </div>

        <div class="alcance-item" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
          <div class="alcance-num-wrap"><span class="alcance-num">8</span></div>
          <div class="alcance-body"><span class="alcance-title">Panel BI</span><span class="alcance-text">Análisis de rentabilidad histórica</span></div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.proposal-slide {
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
  top: 15%;
  left: 10%;
  width: 450px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 65%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  bottom: 10%;
  right: 20%;
  width: 350px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(34,197,94,0.04) 0%, transparent 65%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
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
  margin-bottom: 1.5rem;
}
.tag-bar {
  width: 3.5rem;
  height: 2px;
  background: linear-gradient(90deg, #34d399, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #34d399;
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

/* Proposal card */
.proposal-card {
  position: relative;
  background: rgba(52,211,153,0.06);
  border: 1px solid rgba(52,211,153,0.25);
  border-radius: 1rem;
  padding: 1rem 1.3rem;
  margin-bottom: 1rem;
  overflow: hidden;
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  transition: border-color 0.4s, box-shadow 0.4s;
}
.proposal-card:hover {
  border-color: rgba(52,211,153,0.45);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.proposal-glow {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(52,211,153,0.1);
  filter: blur(45px);
  pointer-events: none;
}
.proposal-header {
  margin-bottom: 0.45rem;
}
.badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  padding: 0.2rem 0.65rem;
  border-radius: 50px;
}
.badge.emerald {
  color: #34d399;
  background: rgba(52,211,153,0.12);
  border: 1px solid rgba(52,211,153,0.3);
}
.proposal-text {
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
}
.proposal-text strong {
  color: #e2e8f0;
  font-weight: 600;
}

/* Limits card */
.limits-card {
  display: flex;
  overflow: hidden;
  border-radius: 0.7rem;
  background: rgba(34,211,238,0.05);
  border: 1px solid rgba(34,211,238,0.2);
  backdrop-filter: blur(10px);
  transition: border-color 0.3s;
}
.limits-card:hover {
  border-color: rgba(34,211,238,0.35);
}
.limits-accent {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.15));
}
.limits-body {
  padding: 0.6rem 0.9rem;
}
.limits-label {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #22d3ee;
  display: block;
  margin-bottom: 0.25rem;
}
.limits-body p {
  font-size: 0.66rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.5;
  margin: 0;
}
.limits-body strong {
  color: #94a3b8;
  font-weight: 600;
}

/* ═══ RIGHT ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.alcances-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
}
.alcances-badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #34d399;
  padding: 0.2rem 0.6rem;
  background: rgba(52,211,153,0.1);
  border: 1px solid rgba(52,211,153,0.25);
  border-radius: 50px;
}
.alcances-count {
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #475569;
}

/* Alcances list */
.alcances-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.alcance-item {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.4rem 0.6rem;
  border-radius: 0.55rem;
  background: rgba(15,23,42,0.5);
  border: 1px solid rgba(71,85,105,0.2);
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
}
.alcance-item:hover {
  background: rgba(52,211,153,0.04);
  border-color: rgba(52,211,153,0.2);
  transform: translateX(3px);
}

.alcance-num-wrap {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.06));
  border: 1px solid rgba(52,211,153,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.05rem;
  box-shadow: 0 0 10px rgba(52,211,153,0.15);
}
.alcance-num {
  font-size: 0.5rem;
  font-weight: 800;
  color: #34d399;
  line-height: 1;
}

.alcance-body {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}
.alcance-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1.2;
}
.alcance-text {
  font-size: 0.55rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.3;
}
.alcance-text strong {
  color: #94a3b8;
  font-weight: 600;
}
</style>
