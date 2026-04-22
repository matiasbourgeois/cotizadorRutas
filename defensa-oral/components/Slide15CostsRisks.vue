<template>
  <div class="costs-slide">

    <div class="ambient a1"></div>
    <div class="ambient a2"></div>
    <div class="ambient a3"></div>
    <!-- LEFT: COSTOS -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Gestión del Proyecto</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Costos y<br>Riesgos
      </h1>

      <!-- Total Hero -->
      <div class="total-hero" v-click v-motion :initial="{opacity:0,scale:0.95}" :enter="{opacity:1,scale:1,transition:{duration:800}}">
        <div class="total-glow"></div>
        <span class="total-label">Inversión total del proyecto</span>
        <div class="total-value">
          <span class="currency">$</span>
          <span class="amount">{{ animatedTotal }}</span>
        </div>
        <div class="total-bar-wrap">
          <div class="total-bar dev" :style="{width: barProgress + '%'}"></div>
          <div class="total-bar ops" :style="{width: Math.max(barProgress * 0.0143, 0) + '%'}"></div>
        </div>
        <div class="bar-legend">
          <span class="bar-leg dev-leg">● Desarrollo (98,6%)</span>
          <span class="bar-leg ops-leg">● Operativo (1,4%)</span>
        </div>
      </div>

      <!-- Dev breakdown -->
      <div class="dev-breakdown" v-click v-motion :initial="{opacity:0,y:12}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <span class="section-label">Costos de desarrollo</span>
        <div class="dev-role">
          <div class="role-info">
            <span class="role-name">Full-Stack Developer</span>
            <span class="role-meta">480h · $17.092/h</span>
          </div>
          <div class="role-bar-track"><div class="role-bar cyan" style="width: 60.6%"></div></div>
          <span class="role-total">$8.204.549</span>
        </div>
        <div class="dev-role">
          <div class="role-info">
            <span class="role-name">Analista Funcional</span>
            <span class="role-meta">320h · $10.679/h</span>
          </div>
          <div class="role-bar-track"><div class="role-bar emerald" style="width: 25.2%"></div></div>
          <span class="role-total">$3.417.357</span>
        </div>
        <div class="dev-role">
          <div class="role-info">
            <span class="role-name">Diseñador UX/UI</span>
            <span class="role-meta">160h · $11.954/h</span>
          </div>
          <div class="role-bar-track"><div class="role-bar violet" style="width: 14.1%"></div></div>
          <span class="role-total">$1.912.675</span>
        </div>
      </div>

      <!-- Bottom badges -->
      <div class="bottom-badges" v-click v-motion :initial="{opacity:0,y:8}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="badge-card">
          <span class="badge-value zero">$0</span>
          <span class="badge-label">Software y Licencias</span>
          <span class="badge-note">100% open source</span>
        </div>
        <div class="badge-card">
          <span class="badge-value">$194.075</span>
          <span class="badge-label">Costo Operativo Anual</span>
          <span class="badge-note">Hostinger VPS + Dominio</span>
        </div>
      </div>

    </div>

    <!-- RIGHT: RIESGOS -->
    <div class="right">

      <div class="right-header" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:400}}">
        <span class="right-badge">Análisis de Riesgos</span>
        <span class="right-note">8 riesgos · Pareto 80/20</span>
      </div>

      <!-- Pareto Chart -->
      <div class="pareto-chart" v-click v-motion :initial="{opacity:0,y:20}" :enter="{opacity:1,y:0,transition:{duration:700}}">
        <div class="pareto-label">Riesgos prioritarios <span class="pct-pill">79,6% del riesgo total</span></div>


        <div class="risk-row critical">
          <span class="risk-rank">1°</span>
          <div class="risk-middle">
            <span class="risk-name">Resistencia al cambio del personal</span>
            <div class="risk-bar-track"><div class="risk-bar" style="width: 100%"></div></div>
          </div>
          <div class="risk-meta">
            <span class="risk-type negocio">Negocio</span>
            <span class="risk-score">2,7</span>
          </div>
        </div>

        <div class="risk-row high">
          <span class="risk-rank">2°</span>
          <div class="risk-middle">
            <span class="risk-name">Expansión no controlada del alcance</span>
            <div class="risk-bar-track"><div class="risk-bar" style="width: 74%"></div></div>
          </div>
          <div class="risk-meta">
            <span class="risk-type proyecto">Proyecto</span>
            <span class="risk-score">2,0</span>
          </div>
        </div>

        <div class="risk-row high">
          <span class="risk-rank">3°</span>
          <div class="risk-middle">
            <span class="risk-name">Error en estimación de tiempo</span>
            <div class="risk-bar-track"><div class="risk-bar" style="width: 74%"></div></div>
          </div>
          <div class="risk-meta">
            <span class="risk-type proyecto">Proyecto</span>
            <span class="risk-score">2,0</span>
          </div>
        </div>

        <div class="risk-row high">
          <span class="risk-rank">4°</span>
          <div class="risk-middle">
            <span class="risk-name">Error lógico en motor de cálculo</span>
            <div class="risk-bar-track"><div class="risk-bar" style="width: 74%"></div></div>
          </div>
          <div class="risk-meta">
            <span class="risk-type tecnico">Técnico</span>
            <span class="risk-score">2,0</span>
          </div>
        </div>

        <div class="risk-row medium">
          <span class="risk-rank">5°</span>
          <div class="risk-middle">
            <span class="risk-name">Dependencia crítica de API externa</span>
            <div class="risk-bar-track"><div class="risk-bar" style="width: 56%"></div></div>
          </div>
          <div class="risk-meta">
            <span class="risk-type tecnico">Técnico</span>
            <span class="risk-score">1,5</span>
          </div>
        </div>
      </div>

      <!-- Secondary + Contingency (same click) -->
      <div class="bottom-group" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="secondary">
          <span class="section-label secondary-label">Riesgos secundarios</span>
          <div class="secondary-row">
            <div class="sec-chip"><span class="sec-name">R6 Obsolescencia tecnológica</span><span class="sec-score">1,2</span></div>
            <div class="sec-chip"><span class="sec-name">R3 Enfermedad personal clave</span><span class="sec-score">0,9</span></div>
            <div class="sec-chip"><span class="sec-name">R8 Vulnerabilidad de seguridad</span><span class="sec-score">0,5</span></div>
          </div>
        </div>
        <div class="contingency">
          <div class="cont-accent"></div>
          <div class="cont-body">
            <span class="cont-title">Plan de contingencia</span>
            <p>Los 5 riesgos prioritarios cuentan con acciones de mitigación documentadas: involucramiento del personal, control de cambios, desglose de tareas, validación cruzada del motor y análisis de proveedores alternativos.</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const totalNum = ref(0)
const barProgress = ref(0)
const TARGET = 13728655

const animatedTotal = computed(() =>
  totalNum.value.toLocaleString('es-AR', { maximumFractionDigits: 0 })
)

onMounted(() => {
  // Animate total counter
  const duration = 2200
  const start = performance.now()
  const tick = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    totalNum.value = Math.round(TARGET * eased)
    barProgress.value = eased * 98.6
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<style scoped>
.costs-slide { position: absolute; inset: 0; display: flex; align-items: stretch; padding: 1.3rem 3.5rem 1.3rem 4.5rem; gap: 2.5rem; overflow: hidden; }

.ambient { position: absolute; filter: blur(70px); pointer-events: none; z-index: 0; border-radius: 50%; }
.a1 { top: 15%; left: 15%; width: 300px; height: 260px; background: radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 65%); }
.a2 { bottom: 15%; right: 20%; width: 280px; height: 240px; background: radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 65%); }
.a3 { top: 40%; right: 40%; width: 250px; height: 220px; background: radial-gradient(ellipse, rgba(99,102,241,0.03) 0%, transparent 65%); }

/* ═══ LEFT ═══ */
.left { width: 38%; display: flex; flex-direction: column; justify-content: space-evenly; position: relative; z-index: 1; flex-shrink: 0; }
.tag-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; }
.tag-bar { width: 3rem; height: 2px; background: linear-gradient(90deg, #fbbf24, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.38em; color: #fbbf24; }
h1 { font-size: 2.2rem; font-weight: 900; line-height: 1.12; margin: 0 0 0.5rem 0; padding-bottom: 0.15rem; background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* Total Hero */
.total-hero { position: relative; padding: 0.5rem 0.7rem 0.45rem; background: rgba(15,23,42,0.75); border: 1px solid rgba(245,158,11,0.3); border-radius: 0.6rem; backdrop-filter: blur(14px); margin-bottom: 0.45rem; overflow: hidden; }
.total-glow { position: absolute; top: -25px; right: -15px; width: 130px; height: 90px; border-radius: 50%; background: rgba(245,158,11,0.08); filter: blur(28px); pointer-events: none; }
.total-label { font-size: 0.44rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-bottom: 0.08rem; }
.total-value { display: flex; align-items: baseline; gap: 0.08rem; margin-bottom: 0.2rem; }
.currency { font-size: 1.1rem; font-weight: 300; color: #64748b; }
.amount { font-size: 1.6rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.02em; }

/* Stacked bar */
.total-bar-wrap { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: rgba(71,85,105,0.15); }
.total-bar { transition: width 2s cubic-bezier(0.16, 1, 0.3, 1); }
.total-bar.dev { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.total-bar.ops { background: linear-gradient(90deg, #6366f1, #818cf8); }
.bar-legend { display: flex; gap: 0.6rem; margin-top: 0.15rem; }
.bar-leg { font-size: 0.38rem; font-weight: 600; }
.dev-leg { color: #f59e0b; }
.ops-leg { color: #818cf8; }

/* Dev breakdown */
.dev-breakdown { display: flex; flex-direction: column; gap: 0.15rem; margin-bottom: 0.4rem; }
.section-label { font-size: 0.46rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #475569; display: block; margin-bottom: 0.08rem; }
.dev-role { display: flex; align-items: center; gap: 0.3rem; }
.role-info { width: 140px; flex-shrink: 0; display: flex; flex-direction: column; }
.role-name { font-size: 0.52rem; font-weight: 700; color: #cbd5e1; line-height: 1.1; }
.role-meta { font-size: 0.40rem; color: #475569; font-weight: 400; }
.role-bar-track { flex: 1; height: 8px; border-radius: 4px; background: rgba(71,85,105,0.12); overflow: hidden; }
.role-bar { height: 100%; border-radius: 4px; transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
.role-bar.cyan { background: linear-gradient(90deg, rgba(34,211,238,0.6), rgba(34,211,238,0.25)); }
.role-bar.emerald { background: linear-gradient(90deg, rgba(52,211,153,0.6), rgba(52,211,153,0.25)); }
.role-bar.violet { background: linear-gradient(90deg, rgba(139,92,246,0.6), rgba(139,92,246,0.25)); }
.role-total { font-size: 0.48rem; font-weight: 700; color: #94a3b8; min-width: 72px; text-align: right; }

/* Bottom badges */
.bottom-badges { display: flex; gap: 0.4rem; }
.badge-card { flex: 1; display: flex; flex-direction: column; padding: 0.3rem 0.45rem; background: rgba(15,23,42,0.5); border: 1px solid rgba(71,85,105,0.2); border-radius: 0.45rem; transition: border-color 0.3s; }
.badge-card:first-child { border-color: rgba(52,211,153,0.3); }
.badge-card:first-child:hover { border-color: rgba(52,211,153,0.5); }
.badge-card:last-child:hover { border-color: rgba(99,102,241,0.4); }
.badge-value { font-size: 0.75rem; font-weight: 900; color: #94a3b8; line-height: 1; }
.badge-value.zero { color: #34d399; }
.badge-label { font-size: 0.42rem; font-weight: 600; color: #64748b; }
.badge-note { font-size: 0.38rem; color: #475569; font-weight: 400; }

/* ═══ RIGHT ═══ */
.right { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; gap: 0.35rem; position: relative; z-index: 1; }

.right-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.15rem; }
.right-badge { font-size: 0.50rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #ef4444; padding: 0.18rem 0.5rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 50px; }
.right-note { font-size: 0.42rem; color: #475569; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 500; }

/* Pareto chart */
.pareto-chart { position: relative; display: flex; flex-direction: column; gap: 0.12rem; }
.pareto-label { font-size: 0.46rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.06rem; }
.pct-pill { font-size: 0.38rem; color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.1); padding: 0.06rem 0.25rem; border-radius: 50px; margin-left: 0.25rem; letter-spacing: 0; text-transform: none; }


/* Risk rows */
.risk-row { display: flex; align-items: center; gap: 0.3rem; padding: 0.22rem 0.35rem; border-radius: 0.35rem; background: rgba(15,23,42,0.4); border: 1px solid rgba(71,85,105,0.12); transition: transform 0.2s, background 0.2s; }
.risk-row:hover { transform: translateX(3px); background: rgba(15,23,42,0.6); }

.risk-rank { font-size: 0.42rem; font-weight: 900; color: #475569; width: 20px; text-align: center; flex-shrink: 0; }
.risk-middle { flex: 1; display: flex; flex-direction: column; gap: 0.06rem; min-width: 0; }
.risk-name { font-size: 0.52rem; font-weight: 600; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.risk-bar-track { height: 5px; border-radius: 3px; background: rgba(71,85,105,0.12); overflow: hidden; }
.risk-bar { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.risk-row.critical .risk-bar { background: linear-gradient(90deg, #ef4444, rgba(239,68,68,0.3)); }
.risk-row.high .risk-bar { background: linear-gradient(90deg, #f59e0b, rgba(245,158,11,0.3)); }
.risk-row.medium .risk-bar { background: linear-gradient(90deg, #3b82f6, rgba(59,130,246,0.3)); }

.risk-meta { display: flex; align-items: center; gap: 0.2rem; flex-shrink: 0; }
.risk-type { font-size: 0.34rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.08rem 0.22rem; border-radius: 0.15rem; }
.risk-type.negocio { color: #f87171; background: rgba(239,68,68,0.1); }
.risk-type.proyecto { color: #fbbf24; background: rgba(245,158,11,0.1); }
.risk-type.tecnico { color: #60a5fa; background: rgba(59,130,246,0.1); }
.risk-score { font-size: 0.52rem; font-weight: 900; color: #94a3b8; min-width: 24px; text-align: right; }

/* Bottom group */
.bottom-group { display: flex; flex-direction: column; gap: 0.5rem; }

/* Secondary */
.secondary { }
.secondary-label { margin-bottom: 0.15rem; }
.secondary-row { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.sec-chip { display: flex; align-items: center; gap: 0.25rem; padding: 0.18rem 0.45rem; background: rgba(71,85,105,0.1); border: 1px solid rgba(71,85,105,0.22); border-radius: 0.3rem; }
.sec-name { font-size: 0.48rem; color: #94a3b8; font-weight: 400; }
.sec-score { font-size: 0.48rem; font-weight: 800; color: #e2e8f0; }

/* Contingency */
.contingency { display: flex; overflow: hidden; border-radius: 0.5rem; background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.2); }
.cont-accent { width: 4px; flex-shrink: 0; background: linear-gradient(to bottom, #34d399, rgba(52,211,153,0.2)); }
.cont-body { padding: 0.4rem 0.6rem; }
.cont-title { font-size: 0.52rem; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.12rem; }
.cont-body p { font-size: 0.5rem; color: #94a3b8; font-weight: 300; line-height: 1.5; margin: 0; }
</style>
