<template>
  <div class="steps-slide">

    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <div class="ambient-glow-third"></div>
    <!-- HEADER -->
    <div class="header">
      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">El Sistema en Acción</span>
      </div>
      <h1 v-motion :initial="{opacity:0,y:30}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Los 5 Pasos
      </h1>
      <p class="subtitle" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        Del requerimiento del cliente al presupuesto final
      </p>
    </div>

    <!-- TIMELINE -->
    <div class="timeline" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:800,delay:500}}">

      <!-- Track line -->
      <div class="track">
        <div class="track-line"></div>
        <div class="track-fill" :class="{'fill-1': clicks>=1,'fill-2': clicks>=2,'fill-3': clicks>=3,'fill-4': clicks>=4,'fill-5': clicks>=5}"></div>
        <!-- Flowing dots on the track -->
        <div class="track-dot td1"></div>
        <div class="track-dot td2"></div>
        <div class="track-dot td3"></div>
      </div>

      <!-- ═══ STEP 1: RUTA ═══ -->
      <div class="step" :class="{active: clicks>=1}" v-click @click.self="null">
        <div class="step-node blue">
          <span class="step-number">1</span>
          <div class="node-ring"></div>
        </div>
        <div class="step-card" v-motion :initial="{opacity:0,y:25,scale:0.92}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
          <div class="card-glow blue"></div>
          <div class="card-accent blue"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#60a5fa" stroke-width="1.2"/>
              <circle cx="12" cy="9" r="2" fill="#60a5fa" opacity="0.5"/>
              <path d="M3 20h18" stroke="#60a5fa" stroke-width="0.6" opacity="0.3" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <span class="card-title">Ruta</span>
          <span class="card-desc">Recorrido en mapa interactivo con cálculo automático de distancia y duración</span>
        </div>
      </div>

      <!-- ═══ STEP 2: FRECUENCIA ═══ -->
      <div class="step" :class="{active: clicks>=2}" v-click>
        <div class="step-node violet">
          <span class="step-number">2</span>
          <div class="node-ring"></div>
        </div>
        <div class="step-card" v-motion :initial="{opacity:0,y:25,scale:0.92}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
          <div class="card-glow violet"></div>
          <div class="card-accent violet"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#a78bfa" stroke-width="1"/>
              <path d="M12 7v5l3.5 2" stroke="#a78bfa" stroke-width="1.2" fill="none" stroke-linecap="round"/>
              <path d="M17.5 6.5l1.5-1.5M6.5 17.5l-1.5 1.5" stroke="#a78bfa" stroke-width="0.8" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="card-title">Frecuencia</span>
          <span class="card-desc">Esporádico o mensual con cantidad de viajes configurable</span>
        </div>
      </div>

      <!-- ═══ STEP 3: VEHÍCULO ═══ -->
      <div class="step" :class="{active: clicks>=3}" v-click>
        <div class="step-node amber">
          <span class="step-number">3</span>
          <div class="node-ring"></div>
        </div>
        <div class="step-card" v-motion :initial="{opacity:0,y:25,scale:0.92}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
          <div class="card-glow amber"></div>
          <div class="card-accent amber"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="1" y="8" width="18" height="8" rx="1.5" fill="none" stroke="#fbbf24" stroke-width="1"/>
              <rect x="15" y="5" width="7" height="11" rx="1" fill="none" stroke="#fbbf24" stroke-width="1"/>
              <circle cx="6" cy="18" r="2" fill="none" stroke="#fbbf24" stroke-width="1"/>
              <circle cx="18" cy="18" r="2" fill="none" stroke="#fbbf24" stroke-width="1"/>
              <line x1="19" y1="10" x2="22" y2="10" stroke="#fbbf24" stroke-width="0.8" opacity="0.5"/>
            </svg>
          </div>
          <span class="card-title">Vehículo</span>
          <span class="card-desc">Selección de flota con desglose de 7 parámetros de costos operativos</span>
        </div>
      </div>

      <!-- ═══ STEP 4: RECURSO HUMANO ═══ -->
      <div class="step" :class="{active: clicks>=4}" v-click>
        <div class="step-node cyan">
          <span class="step-number">4</span>
          <div class="node-ring"></div>
        </div>
        <div class="step-card" v-motion :initial="{opacity:0,y:25,scale:0.92}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
          <div class="card-glow cyan"></div>
          <div class="card-accent cyan"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="7" r="4" fill="none" stroke="#22d3ee" stroke-width="1"/>
              <path d="M4 21v-2a5 5 0 015-5h6a5 5 0 015 5v2" fill="none" stroke="#22d3ee" stroke-width="1" stroke-linecap="round"/>
              <line x1="18" y1="8" x2="22" y2="8" stroke="#22d3ee" stroke-width="0.7" opacity="0.4"/>
              <line x1="18" y1="11" x2="21" y2="11" stroke="#22d3ee" stroke-width="0.7" opacity="0.4"/>
            </svg>
          </div>
          <span class="card-title">Recurso Humano</span>
          <span class="card-desc">Asignación de conductor con sueldo, SAC, cargas sociales y viáticos</span>
        </div>
      </div>

      <!-- ═══ STEP 5: RESUMEN ═══ -->
      <div class="step" :class="{active: clicks>=5}" v-click>
        <div class="step-node green">
          <span class="step-number">5</span>
          <div class="node-ring"></div>
        </div>
        <div class="step-card" v-motion :initial="{opacity:0,y:25,scale:0.92}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
          <div class="card-glow green"></div>
          <div class="card-accent green"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" fill="none" stroke="#34d399" stroke-width="1"/>
              <rect x="9" y="3" width="6" height="4" rx="1" fill="none" stroke="#34d399" stroke-width="1"/>
              <path d="M9 14l2 2 4-4" stroke="#34d399" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="card-title">Resumen Final</span>
          <span class="card-desc">Motor de cálculo agrega costos, aplica margen → Propuesta Comercial + Desglose</span>
        </div>
      </div>

    </div>

    <!-- RESULTADO -->
    <div class="resultado" v-click v-motion :initial="{opacity:0,y:20}" :enter="{opacity:1,y:0,transition:{duration:800}}">
      <div class="res-line"></div>
      <div class="res-row">
        <div class="res-label">Resultado</div>
        <div class="res-arrow">→</div>
        <div class="res-card">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="none" stroke="#a5b4fc" stroke-width="1"/><path d="M14 2v6h6" fill="none" stroke="#a5b4fc" stroke-width="0.8"/></svg>
          <span>Propuesta Comercial</span>
        </div>
        <div class="res-plus">+</div>
        <div class="res-card">
          <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#a5b4fc" stroke-width="1"/><line x1="8" y1="9" x2="16" y2="9" stroke="#a5b4fc" stroke-width="0.7" opacity="0.5"/><line x1="8" y1="13" x2="16" y2="13" stroke="#a5b4fc" stroke-width="0.7" opacity="0.5"/><line x1="8" y1="17" x2="13" y2="17" stroke="#a5b4fc" stroke-width="0.7" opacity="0.5"/></svg>
          <span>Desglose de Costos</span>
        </div>
        <div class="res-plus">+</div>
        <div class="res-card highlight">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2v2m0 16v2m-4-13a4 4 0 014-4h1a4 4 0 010 8h-2a4 4 0 000 8h1a4 4 0 004-4" fill="none" stroke="#34d399" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Precio de Venta</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// Track clicks for the progress bar fill
const { $clicks } = useSlideContext()
const clicks = computed(() => $clicks.value || 0)
</script>

<style scoped>
.steps-slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 1.8rem 4rem 2.5rem;
  overflow: hidden;
}

/* Ambient glows - multi colored */
.ambient-glow {
  position: absolute;
  top: 40%;
  left: 5%;
  width: 350px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 65%);
  filter: blur(55px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  top: 35%;
  left: 40%;
  width: 300px;
  height: 280px;
  background: radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 65%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-third {
  position: absolute;
  top: 40%;
  right: 5%;
  width: 300px;
  height: 280px;
  background: radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 65%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}


/* ═══ HEADER ═══ */
.header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 0.6rem;
}

.tag-row {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
}
.tag-bar {
  width: 3rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #6366f1;
}

h1 {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.7rem;
  color: #475569;
  font-weight: 300;
  margin-top: 0.2rem;
}

/* ═══ TIMELINE ═══ */
.timeline {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 1.8rem;
}

/* ── Track ── */
.track {
  position: absolute;
  top: 2.5rem;
  left: 2%;
  right: 2%;
  height: 3px;
  z-index: -1;
}
.track-line {
  position: absolute;
  inset: 0;
  background: rgba(71,85,105,0.15);
  border-radius: 2px;
}
.track-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 2px;
  width: 0%;
  transition: width 0.8s cubic-bezier(0.22,1,0.36,1), background 0.8s ease;
  background: linear-gradient(90deg, #3b82f6, #3b82f6);
}
.track-fill.fill-1 { width: 12%; background: linear-gradient(90deg, #3b82f6, #3b82f6); }
.track-fill.fill-2 { width: 32%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); }
.track-fill.fill-3 { width: 52%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b); }
.track-fill.fill-4 { width: 72%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b, #06b6d4); }
.track-fill.fill-5 { width: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b, #06b6d4, #22c55e); }

/* Flowing dots on track */
.track-dot {
  position: absolute;
  top: -1px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(99,102,241,0.4);
  animation: track-flow 4s linear infinite;
}
.td1 { animation-delay: 0s; }
.td2 { animation-delay: 1.3s; }
.td3 { animation-delay: 2.6s; }

@keyframes track-flow {
  0% { left: 0%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* ═══ STEPS ═══ */
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  position: relative;
  z-index: 1;
}

/* ── Step node circle ── */
.step-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  z-index: 2;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  background: #0f172a;
}
.step:hover .step-node { transform: scale(1.15); }

.step-node.blue { background: linear-gradient(135deg, rgba(59,130,246,0.35), rgba(59,130,246,0.12)), #0f172a; border: 1.5px solid rgba(59,130,246,0.5); box-shadow: 0 0 18px rgba(59,130,246,0.2); }
.step-node.violet { background: linear-gradient(135deg, rgba(139,92,246,0.35), rgba(139,92,246,0.12)), #0f172a; border: 1.5px solid rgba(139,92,246,0.5); box-shadow: 0 0 18px rgba(139,92,246,0.2); }
.step-node.amber { background: linear-gradient(135deg, rgba(245,158,11,0.35), rgba(245,158,11,0.12)), #0f172a; border: 1.5px solid rgba(245,158,11,0.5); box-shadow: 0 0 18px rgba(245,158,11,0.2); }
.step-node.cyan { background: linear-gradient(135deg, rgba(34,211,238,0.35), rgba(34,211,238,0.12)), #0f172a; border: 1.5px solid rgba(34,211,238,0.5); box-shadow: 0 0 18px rgba(34,211,238,0.2); }
.step-node.green { background: linear-gradient(135deg, rgba(52,211,153,0.35), rgba(52,211,153,0.12)), #0f172a; border: 1.5px solid rgba(52,211,153,0.5); box-shadow: 0 0 18px rgba(52,211,153,0.2); }

.step-number {
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
}
.step-node.blue .step-number { color: #60a5fa; }
.step-node.violet .step-number { color: #a78bfa; }
.step-node.amber .step-number { color: #fbbf24; }
.step-node.cyan .step-number { color: #22d3ee; }
.step-node.green .step-number { color: #34d399; }

/* Node pulse ring */
.node-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.5s;
}
.step.active .node-ring {
  opacity: 1;
  animation: node-pulse 2.5s ease-out infinite;
}
.step-node.blue .node-ring { border: 1px solid rgba(59,130,246,0.2); }
.step-node.violet .node-ring { border: 1px solid rgba(139,92,246,0.2); }
.step-node.amber .node-ring { border: 1px solid rgba(245,158,11,0.2); }
.step-node.cyan .node-ring { border: 1px solid rgba(34,211,238,0.2); }
.step-node.green .node-ring { border: 1px solid rgba(52,211,153,0.2); }

@keyframes node-pulse {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* ═══ STEP CARDS ═══ */
.step-card {
  position: relative;
  width: 100%;
  padding: 0.7rem 0.65rem;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(71,85,105,0.25);
  border-radius: 0.75rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
  overflow: hidden;
  transition: border-color 0.4s, transform 0.3s, box-shadow 0.3s;
}
.step:hover .step-card {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(0,0,0,0.45);
}

/* Card accent bar top */
.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}
.card-accent.blue { background: linear-gradient(90deg, transparent, #3b82f6, transparent); }
.card-accent.violet { background: linear-gradient(90deg, transparent, #8b5cf6, transparent); }
.card-accent.amber { background: linear-gradient(90deg, transparent, #f59e0b, transparent); }
.card-accent.cyan { background: linear-gradient(90deg, transparent, #06b6d4, transparent); }
.card-accent.green { background: linear-gradient(90deg, transparent, #22c55e, transparent); }

/* Card glow */
.card-glow {
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 80px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(25px);
}
.card-glow.blue { background: rgba(59,130,246,0.08); }
.card-glow.violet { background: rgba(139,92,246,0.08); }
.card-glow.amber { background: rgba(245,158,11,0.08); }
.card-glow.cyan { background: rgba(34,211,238,0.08); }
.card-glow.green { background: rgba(52,211,153,0.08); }

/* Hover card border color */
.step:nth-child(2):hover .step-card { border-color: rgba(59,130,246,0.35); }
.step:nth-child(3):hover .step-card { border-color: rgba(139,92,246,0.35); }
.step:nth-child(4):hover .step-card { border-color: rgba(245,158,11,0.35); }
.step:nth-child(5):hover .step-card { border-color: rgba(34,211,238,0.35); }
.step:nth-child(6):hover .step-card { border-color: rgba(52,211,153,0.35); }

.card-icon {
  margin-bottom: 0.1rem;
}

.card-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: #e2e8f0;
}

.card-desc {
  font-size: 0.5rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.45;
}

/* ═══ RESULTADO ═══ */
.resultado {
  position: relative;
  z-index: 1;
  margin-top: -1rem;
  padding-top: 0.4rem;
}
.res-line {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent);
}
.res-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}
.res-label {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #475569;
}
.res-arrow {
  font-size: 0.8rem;
  color: #6366f1;
  font-weight: 300;
}
.res-plus {
  font-size: 0.65rem;
  color: #334155;
  font-weight: 300;
}
.res-card {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s, transform 0.3s;
}
.res-card:hover {
  border-color: rgba(99,102,241,0.35);
  transform: translateY(-2px);
}
.res-card span {
  font-size: 0.52rem;
  font-weight: 600;
  color: #94a3b8;
}
.res-card.highlight {
  border-color: rgba(52,211,153,0.3);
  background: rgba(52,211,153,0.06);
}
.res-card.highlight span {
  color: #34d399;
}
.res-card.highlight:hover {
  border-color: rgba(52,211,153,0.5);
}
</style>
