<template>
  <div class="conclusion-slide">
    <div class="radial-glow"></div>

    <!-- PHASE 1: Hero -->
    <div class="hero-phase">
      <div class="hero-tag" v-motion :initial="{opacity:0,y:-20}" :enter="{opacity:1,y:0,transition:{duration:1200}}">
        <div class="tag-line-left"></div>
        <span>Cierre</span>
        <div class="tag-line-right"></div>
      </div>

      <h1 class="hero-title" v-motion :initial="{opacity:0,scale:0.85}" :enter="{opacity:1,scale:1,transition:{duration:1500,delay:200}}">
        Conclusiones
      </h1>

      <p class="hero-sub" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:900,delay:700}}">
        Los tres objetivos específicos fueron implementados con éxito<br>en un sistema funcional desplegado en producción
      </p>
    </div>

    <!-- PHASE 2: 3 Objectives Completed -->
    <div class="objectives-row" v-click>

      <!-- OE1 -->
      <div class="obj-card" v-motion :initial="{opacity:0,y:40,scale:0.9}" :enter="{opacity:1,y:0,scale:1,transition:{duration:800}}">
        <div class="obj-glow cyan"></div>
        <div class="check-ring cyan">
          <svg class="check-svg" viewBox="0 0 36 36">
            <circle class="check-circle" cx="18" cy="18" r="16" />
            <polyline class="check-mark" points="11,18 16,23 25,13" />
          </svg>
        </div>
        <span class="obj-title">Motor de Cálculo</span>
        <p class="obj-desc">Procesa en tiempo real TODAS las variables de costos: vehículo, RRHH y agregación final</p>
        <div class="obj-proof">
          <span class="proof-dot cyan"></span>
          <span class="proof-text">quotargo.ar en producción</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="obj-divider" v-motion :initial="{opacity:0,scaleY:0}" :enter="{opacity:1,scaleY:1,transition:{duration:500,delay:300}}"></div>

      <!-- OE2 -->
      <div class="obj-card" v-motion :initial="{opacity:0,y:40,scale:0.9}" :enter="{opacity:1,y:0,scale:1,transition:{duration:800,delay:200}}">
        <div class="obj-glow emerald"></div>
        <div class="check-ring emerald">
          <svg class="check-svg" viewBox="0 0 36 36">
            <circle class="check-circle" cx="18" cy="18" r="16" />
            <polyline class="check-mark" points="11,18 16,23 25,13" />
          </svg>
        </div>
        <span class="obj-title">Documentos Profesionales</span>
        <p class="obj-desc">Genera propuestas comerciales y desgloses de costos en formato digital estandarizado</p>
        <div class="obj-proof">
          <span class="proof-dot emerald"></span>
          <span class="proof-text">PDF con QR automático</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="obj-divider" v-motion :initial="{opacity:0,scaleY:0}" :enter="{opacity:1,scaleY:1,transition:{duration:500,delay:500}}"></div>

      <!-- OE3 -->
      <div class="obj-card" v-motion :initial="{opacity:0,y:40,scale:0.9}" :enter="{opacity:1,y:0,scale:1,transition:{duration:800,delay:400}}">
        <div class="obj-glow violet"></div>
        <div class="check-ring violet">
          <svg class="check-svg" viewBox="0 0 36 36">
            <circle class="check-circle" cx="18" cy="18" r="16" />
            <polyline class="check-mark" points="11,18 16,23 25,13" />
          </svg>
        </div>
        <span class="obj-title">Inteligencia de Negocio</span>
        <p class="obj-desc">Dashboard BI con datos históricos para optimizar la rentabilidad y decisiones estratégicas</p>
        <div class="obj-proof">
          <span class="proof-dot violet"></span>
          <span class="proof-text">Métricas en tiempo real</span>
        </div>
      </div>

    </div>

    <!-- PHASE 3: Quote + Close -->
    <div class="close-phase" v-click>
      <div class="quote-block" v-motion :initial="{opacity:0,y:12}" :enter="{opacity:1,y:0,transition:{duration:800}}">
        <div class="quote-accent"></div>
        <p class="quote-text"><em>"La experiencia de aplicar los fundamentos de la ingeniería de software en un desafío real ha sido profundamente satisfactoria."</em></p>
      </div>

      <div class="close-row" v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:400}}">
        <div class="close-left">
          <img src="/quotargo.svg" alt="Quotargo" class="close-logo" />
          <span class="close-url">quotargo.ar</span>
        </div>
        <div class="close-center">
          <span class="gracias">Gracias</span>
        </div>
        <div class="close-right">
          <span class="author-name">Matías Bourgeois</span>
          <span class="author-role">TFG · Ingeniería de Software</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.conclusion-slide {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 1.2rem 5rem;
  overflow: hidden; text-align: center;
}


.radial-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 650px; height: 420px;
  background: radial-gradient(ellipse at center, rgba(34,211,238,0.035) 0%, rgba(52,211,153,0.025) 30%, rgba(139,92,246,0.015) 55%, transparent 75%);
  filter: blur(45px); pointer-events: none; z-index: 0;
}

/* ═══ HERO ═══ */
.hero-phase { position: relative; z-index: 1; margin-bottom: 1.6rem; }

.hero-tag { display: flex; align-items: center; justify-content: center; gap: 0.8rem; margin-bottom: 0.5rem; }
.hero-tag span { font-size: 0.56rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45em; color: #64748b; }
.tag-line-left, .tag-line-right { width: 3rem; height: 1px; }
.tag-line-left { background: linear-gradient(90deg, transparent, rgba(100,116,139,0.35)); }
.tag-line-right { background: linear-gradient(90deg, rgba(100,116,139,0.35), transparent); }

.hero-title {
  font-size: 3.5rem; font-weight: 900; line-height: 1;
  margin: 0 0 0.45rem; padding-bottom: 0.15rem;
  background: linear-gradient(145deg, #ffffff 0%, #cbd5e1 40%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.hero-sub {
  font-size: 0.62rem; color: #64748b; font-weight: 300;
  max-width: 540px; margin: 0 auto; line-height: 1.55;
}

/* ═══ OBJECTIVES ROW ═══ */
.objectives-row {
  position: relative; z-index: 1;
  display: flex; align-items: flex-start; justify-content: center;
  gap: 1rem; margin-bottom: 1.4rem;
}

.obj-card {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  width: 200px; padding: 0.55rem 0.5rem 0.45rem;
  text-align: center;
  background: rgba(15,23,42,0.35);
  border: 1px solid rgba(71,85,105,0.12);
  border-radius: 0.7rem;
  backdrop-filter: blur(8px);
  transition: transform 0.3s, border-color 0.3s;
}
.obj-card:hover { transform: translateY(-3px); }
.obj-card:nth-child(1):hover { border-color: rgba(34,211,238,0.3); }
.obj-card:nth-child(3):hover { border-color: rgba(52,211,153,0.3); }
.obj-card:nth-child(5):hover { border-color: rgba(139,92,246,0.3); }

.obj-glow {
  position: absolute; top: -10px; width: 70px; height: 45px;
  border-radius: 50%; filter: blur(22px); pointer-events: none;
}
.obj-glow.cyan { background: rgba(34,211,238,0.1); }
.obj-glow.emerald { background: rgba(52,211,153,0.1); }
.obj-glow.violet { background: rgba(139,92,246,0.1); }

/* ═══ ANIMATED CHECK RING ═══ */
.check-ring { width: 48px; height: 48px; margin-bottom: 0.35rem; }
.check-svg { width: 100%; height: 100%; }

.check-circle {
  fill: none; stroke-width: 1.5;
  stroke-dasharray: 100; stroke-dashoffset: 100;
  animation: drawCircle 1s ease-out forwards;
}
.check-ring.cyan .check-circle { stroke: rgba(34,211,238,0.35); }
.check-ring.emerald .check-circle { stroke: rgba(52,211,153,0.35); }
.check-ring.violet .check-circle { stroke: rgba(139,92,246,0.35); }

.check-mark {
  fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 30; stroke-dashoffset: 30;
  animation: drawCheck 0.5s ease-out 0.8s forwards;
}
.check-ring.cyan .check-mark { stroke: #22d3ee; }
.check-ring.emerald .check-mark { stroke: #34d399; }
.check-ring.violet .check-mark { stroke: #a78bfa; }

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

.obj-title { font-size: 0.68rem; font-weight: 800; color: #e2e8f0; margin-bottom: 0.12rem; }
.obj-desc { font-size: 0.44rem; color: #64748b; font-weight: 300; line-height: 1.4; margin: 0 0 0.3rem; }

.obj-proof {
  display: flex; align-items: center; gap: 0.25rem;
  padding: 0.15rem 0.4rem; border-radius: 50px;
  background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.15);
}
.proof-dot {
  width: 5px; height: 5px; border-radius: 50%;
  animation: pulseDot 2s ease-in-out infinite;
}
.proof-dot.cyan { background: #22d3ee; box-shadow: 0 0 6px rgba(34,211,238,0.4); }
.proof-dot.emerald { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.4); }
.proof-dot.violet { background: #a78bfa; box-shadow: 0 0 6px rgba(139,92,246,0.4); }
.proof-text { font-size: 0.38rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.03em; }

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}

.obj-divider {
  width: 1px; height: 80px; margin-top: 1.5rem;
  background: linear-gradient(to bottom, transparent, rgba(100,116,139,0.2), transparent);
  transform-origin: center; flex-shrink: 0;
}

/* ═══ CLOSE PHASE ═══ */
.close-phase { position: relative; z-index: 1; width: 100%; max-width: 680px; }

.quote-block {
  display: flex; gap: 0.6rem; align-items: flex-start;
  margin-bottom: 0.8rem; text-align: left;
}
.quote-accent {
  width: 2px; min-height: 100%; flex-shrink: 0;
  background: linear-gradient(to bottom, rgba(34,211,238,0.4), rgba(139,92,246,0.3));
  border-radius: 1px;
}
.quote-text {
  font-size: 0.50rem; color: #94a3b8; font-weight: 300;
  line-height: 1.55; margin: 0;
}

/* Close row */
.close-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.45rem 1.2rem;
  background: rgba(15,23,42,0.45);
  border: 1px solid rgba(71,85,105,0.12);
  border-radius: 0.6rem;
  backdrop-filter: blur(14px);
}

.close-left { display: flex; align-items: center; gap: 0.4rem; }
.close-logo { height: 22px; width: auto; opacity: 0.75; }
.close-url { font-size: 0.42rem; color: #64748b; font-weight: 400; letter-spacing: 0.04em; }

.close-center { text-align: center; }
.gracias {
  font-size: 1.4rem; font-weight: 900;
  background: linear-gradient(135deg, #22d3ee, #34d399, #a78bfa);
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
  letter-spacing: 0.08em;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.close-right { text-align: right; display: flex; flex-direction: column; }
.author-name { font-size: 0.54rem; font-weight: 700; color: #cbd5e1; }
.author-role { font-size: 0.40rem; color: #64748b; font-weight: 400; }
</style>
