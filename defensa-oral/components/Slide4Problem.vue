<template>
  <div class="problem-slide">

    <!-- Red ambient glow -->
    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Área Problemática</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        El Problema
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        El sector del transporte de carga, caracterizado por su dependencia de métodos manuales, enfrenta serios desafíos para calcular costos de manera precisa en un entorno económico volátil.
      </p>

      <!-- 3 Stat cards -->
      <div class="stats-grid">

        <div class="stat-card" v-motion :initial="{opacity:0,y:24}" :enter="{opacity:1,y:0,transition:{duration:700,delay:500}}">
          <div class="stat-glow red"></div>
          <div class="stat-top">
            <span class="stat-value">{{ c1 }}</span>
            <span class="stat-pct red">%</span>
          </div>
          <span class="stat-title">Rezago Tecnológico</span>
          <span class="stat-desc">Del sector adoptó software de gestión integrado</span>
          <span class="stat-source">Forbes Argentina, 2023</span>
        </div>

        <div class="stat-card" v-motion :initial="{opacity:0,y:24}" :enter="{opacity:1,y:0,transition:{duration:700,delay:700}}">
          <div class="stat-glow orange"></div>
          <div class="stat-top">
            <span class="stat-value">{{ c2 }}</span>
            <span class="stat-pct orange">%</span>
          </div>
          <span class="stat-title">Cotización a Ciegas</span>
          <span class="stat-desc">Se basa en índices de referencia (FADEEAC), sin cálculo de costos propios</span>
          <span class="stat-source">Mendonça, Forbes 2023</span>
        </div>

        <div class="stat-card" v-motion :initial="{opacity:0,y:24}" :enter="{opacity:1,y:0,transition:{duration:700,delay:900}}">
          <div class="stat-glow amber"></div>
          <div class="stat-top">
            <span class="stat-value">{{ c3 }}</span>
            <span class="stat-pct amber">%</span>
          </div>
          <span class="stat-title">Cobranza Analógica</span>
          <span class="stat-desc">Gestiona pagos sin sistemas digitales, con mayor probabilidad de errores</span>
          <span class="stat-source">Forbes Argentina, 2023</span>
        </div>

      </div>

    </div>

    <!-- RIGHT COLUMN: Company Diagnosis -->
    <div class="right" v-motion :initial="{opacity:0,x:40}" :enter="{opacity:1,x:0,transition:{duration:900,delay:400}}">

      <div class="diag-card">

        <div class="diag-header">
          <span class="diag-badge">Diagnóstico</span>
          <span class="diag-company">Sol del Amanecer S.R.L.</span>
        </div>

        <p class="diag-intro">
          La empresa depende de <strong>planillas de cálculo</strong> y métodos manuales para cotizar, en un proceso sin estandarización ni controles.
        </p>

        <!-- Pain points with v-click — mapped to TFG Tabla 2 Diagnóstico -->
        <div class="pain-list">

          <!-- TFG Problema 1: Alta propensión a errores y demoras (líneas 1172-1186) -->
          <div class="pain-item" v-click>
            <div class="pain-number-wrap">
              <span class="pain-number">1</span>
            </div>
            <div class="pain-body">
              <span class="pain-title">Cálculo manual propenso a errores</span>
              <span class="pain-desc">Herramientas estáticas en un entorno de costos dinámico, con carga manual de datos dispersos y sin motor estandarizado</span>
            </div>
          </div>

          <!-- TFG Problema 3: Pérdida de oportunidades comerciales (líneas 1204-1218) -->
          <div class="pain-item" v-click>
            <div class="pain-number-wrap">
              <span class="pain-number">2</span>
            </div>
            <div class="pain-body">
              <span class="pain-title">Lentitud y pérdida de clientes</span>
              <span class="pain-desc">La demora en recopilar datos y calcular manualmente provoca pérdida efectiva de potenciales clientes</span>
            </div>
          </div>

          <!-- TFG Problemas 2+4: Sin estandarización + Sin trazabilidad (líneas 1187-1238) -->
          <div class="pain-item" v-click>
            <div class="pain-number-wrap">
              <span class="pain-number">3</span>
            </div>
            <div class="pain-body">
              <span class="pain-title">Sin estandarización ni trazabilidad</span>
              <span class="pain-desc">Un mismo servicio presupuestado con valores diferentes; historial fragmentado en WhatsApp y email</span>
            </div>
          </div>

          <!-- TFG Problema 5: Toma de decisiones sin datos (líneas 1239-1255) -->
          <div class="pain-item" v-click>
            <div class="pain-number-wrap">
              <span class="pain-number">4</span>
            </div>
            <div class="pain-body">
              <span class="pain-title">Decisiones sin datos precisos</span>
              <span class="pain-desc">Ausencia de análisis de rentabilidad por ruta impide tomar decisiones estratégicas basadas en datos</span>
            </div>
          </div>

          <!-- TFG Problema 6: Presentación no profesional (Tabla 2 Diagnóstico) -->
          <div class="pain-item" v-click>
            <div class="pain-number-wrap">
              <span class="pain-number">5</span>
            </div>
            <div class="pain-body">
              <span class="pain-title">Propuestas no profesionales</span>
              <span class="pain-desc">Cotizaciones enviadas por WhatsApp o email sin formato estandarizado, afectando la imagen corporativa</span>
            </div>
          </div>

        </div>


      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage } = useNav()
const c1 = ref(0), c2 = ref(0), c3 = ref(0)

// Eased counter animation
const animateValue = (refVal, target, duration) => {
  const start = performance.now()
  const step = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    refVal.value = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const startAnim = () => {
  c1.value = 0; c2.value = 0; c3.value = 0
  setTimeout(() => {
    animateValue(c1, 5, 800)
    animateValue(c2, 46, 1400)
    animateValue(c3, 41, 1200)
  }, 600)
}

onMounted(() => {
  if (currentPage.value === 4) startAnim()
})

watch(currentPage, (val) => {
  if (val === 4) startAnim()
  else { c1.value = 0; c2.value = 0; c3.value = 0 }
})

</script>

<style scoped>
.problem-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 2.5rem 4.5rem;
  gap: 2.5rem;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  top: 15%;
  left: 10%;
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 65%);
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
  background: radial-gradient(ellipse, rgba(251,146,60,0.04) 0%, transparent 65%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}


/* ═══ LEFT ═══ */
.left {
  width: 48%;
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
  background: linear-gradient(90deg, #ef4444, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #ef4444;
}

h1 {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1;
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
  border-left: 2px solid rgba(239,68,68,0.4);
  margin-bottom: 1.8rem;
}

/* Stats Grid */
.stats-grid {
  display: flex;
  gap: 0.8rem;
}
.stat-card {
  flex: 1;
  background: rgba(15,23,42,0.65);
  border: 1px solid rgba(71,85,105,0.35);
  border-radius: 0.85rem;
  padding: 1rem;
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
  display: flex;
  flex-direction: column;
}
.stat-card:hover {
  border-color: rgba(239,68,68,0.3);
  box-shadow: 0 16px 50px rgba(0,0,0,0.45);
  transform: translateY(-2px);
}
.stat-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  filter: blur(30px);
  pointer-events: none;
}
.stat-glow.red    { background: rgba(239,68,68,0.12); }
.stat-glow.orange { background: rgba(251,146,60,0.12); }
.stat-glow.amber  { background: rgba(245,158,11,0.12); }

.stat-top {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  margin-bottom: 0.4rem;
  font-variant-numeric: tabular-nums;
}
.stat-value {
  font-size: 2.4rem;
  font-weight: 900;
  color: #f1f5f9;
  line-height: 1;
}
.stat-pct {
  font-size: 1.3rem;
  font-weight: 900;
}
.stat-pct.red    { color: #ef4444; filter: drop-shadow(0 0 6px rgba(239,68,68,0.6)); }
.stat-pct.orange { color: #fb923c; filter: drop-shadow(0 0 6px rgba(251,146,60,0.6)); }
.stat-pct.amber  { color: #f59e0b; filter: drop-shadow(0 0 6px rgba(245,158,11,0.6)); }

.stat-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.2rem;
}
.stat-desc {
  font-size: 0.6rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.4;
}
.stat-source {
  font-size: 0.45rem;
  color: #334155;
  font-style: italic;
  margin-top: auto;
  padding-top: 0.4rem;
}

/* ═══ RIGHT: DIAGNOSIS ═══ */
.right {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.diag-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 1.2rem;
  padding: 1.3rem 1.5rem;
  backdrop-filter: blur(16px);
  box-shadow:
    0 0 0 1px rgba(239,68,68,0.05),
    0 24px 80px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

.diag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
}
.diag-badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #ef4444;
  padding: 0.2rem 0.6rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 50px;
}
.diag-company {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #475569;
}

.diag-intro {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.55;
  margin: 0 0 0.8rem 0;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(71,85,105,0.25);
}
.diag-intro strong { color: #e2e8f0; font-weight: 600; }
.diag-intro em { color: #f87171; font-style: normal; font-weight: 400; }

/* Pain points */
.pain-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}
.pain-item {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.45rem 0.55rem;
  border-radius: 0.6rem;
  background: rgba(239,68,68,0.03);
  border: 1px solid rgba(71,85,105,0.2);
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
}
.pain-item:hover {
  background: rgba(239,68,68,0.06);
  border-color: rgba(239,68,68,0.2);
  transform: translateX(3px);
}

/* Numbered indicators */
.pain-number-wrap {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08));
  border: 1px solid rgba(239,68,68,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}
.pain-number {
  font-size: 0.55rem;
  font-weight: 800;
  color: #f87171;
  line-height: 1;
}

.pain-body {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}
.pain-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
}
.pain-desc {
  font-size: 0.58rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.4;
}

</style>
