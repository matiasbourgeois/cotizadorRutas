<template>
  <div class="engine-slide">

    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Lógica de Negocio</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Motor de<br>Cálculo
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        Tres servicios independientes procesan en <strong>tiempo real</strong> la estructura de costos del vehículo, del recurso humano y los ajustes finales para consolidar el precio de venta.
      </p>

      <!-- Key stats -->
      <div class="stats" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <div class="stat">
          <span class="stat-val">3</span>
          <span class="stat-label">servicios de cálculo</span>
        </div>
        <div class="stat">
          <span class="stat-val">4</span>
          <span class="stat-label">tipos de vehículo</span>
        </div>
        <div class="stat">
          <span class="stat-val">2</span>
          <span class="stat-label">modalidades RRHH</span>
        </div>
      </div>

      <!-- Config note -->
      <div class="config-note" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="config-accent"></div>
        <div class="config-body">
          <svg viewBox="0 0 24 24" width="14" height="14" class="config-icon">
            <circle cx="12" cy="12" r="3" fill="none" stroke="#a78bfa" stroke-width="1"/>
            <path d="M12 1v4m0 14v4m-9.5-9.5h4m14 0h4m-3.3-6.7l-2.8 2.8m-9.8 9.8l-2.8 2.8m0-15.4l2.8 2.8m9.8 9.8l2.8 2.8" stroke="#a78bfa" stroke-width="0.7" stroke-linecap="round"/>
          </svg>
          <p>Todas las variables son <strong>configurables</strong> por el administrador desde el panel de configuración global</p>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Waterfall Cascade -->
    <div class="right">
      <div class="waterfall">

        <!-- Block 1: Costo Vehículo -->
        <div class="wf-block" v-click v-motion :initial="{opacity:0,y:-20}" :enter="{opacity:1,y:0,transition:{duration:600}}">
          <div class="wf-card amber">
            <div class="wf-glow amber"></div>
            <div class="wf-row">
              <svg viewBox="0 0 24 24" width="16" height="16"><rect x="1" y="8" width="18" height="8" rx="1.5" fill="none" stroke="#fbbf24" stroke-width="1"/><rect x="15" y="5" width="7" height="11" rx="1" fill="none" stroke="#fbbf24" stroke-width="1"/><circle cx="6" cy="18" r="2" fill="none" stroke="#fbbf24" stroke-width="1"/><circle cx="18" cy="18" r="2" fill="none" stroke="#fbbf24" stroke-width="1"/></svg>
              <span class="wf-title">Costo Vehículo</span>
              <span class="wf-hint">→ slide siguiente</span>
            </div>
            <div class="wf-tags">
              <span class="wf-tag">Depreciación</span>
              <span class="wf-tag">Cubiertas</span>
              <span class="wf-tag">Aceite</span>
              <span class="wf-tag">Combustible</span>
              <span class="wf-tag">Costos fijos prorrateados</span>
            </div>
          </div>
          <div class="wf-conn">
            <div class="wf-line"></div>
            <span class="wf-op">+</span>
          </div>
        </div>

        <!-- Block 2: Costo RRHH -->
        <div class="wf-block" v-click v-motion :initial="{opacity:0,y:-20}" :enter="{opacity:1,y:0,transition:{duration:600}}">
          <div class="wf-card cyan">
            <div class="wf-glow cyan"></div>
            <div class="wf-row">
              <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="7" r="4" fill="none" stroke="#22d3ee" stroke-width="1"/><path d="M4 21v-2a5 5 0 015-5h6a5 5 0 015 5v2" fill="none" stroke="#22d3ee" stroke-width="1" stroke-linecap="round"/></svg>
              <span class="wf-title">Costo Recurso Humano</span>
              <span class="wf-hint">→ slide siguiente</span>
            </div>
            <div class="wf-tags">
              <span class="wf-tag">Empleado CCT 40/89</span>
              <span class="wf-tag">Contratado (factor)</span>
              <span class="wf-tag">3 niveles de cálculo</span>
            </div>
          </div>
          <div class="wf-conn">
            <div class="wf-line"></div>
            <span class="wf-op">+</span>
          </div>
        </div>

        <!-- Block 3: Ajustes -->
        <div class="wf-block" v-click v-motion :initial="{opacity:0,y:-20}" :enter="{opacity:1,y:0,transition:{duration:600}}">
          <div class="wf-card violet">
            <div class="wf-glow violet"></div>
            <div class="wf-row">
              <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="3" fill="none" stroke="#a78bfa" stroke-width="1"/><path d="M12 1v4m0 14v4m-9.5-9.5h4m14 0h4" stroke="#a78bfa" stroke-width="0.7" stroke-linecap="round"/></svg>
              <span class="wf-title">Ajustes Operativos</span>
            </div>
            <div class="wf-tags">
              <span class="wf-tag">Peajes</span>
              <span class="wf-tag">Otros costos</span>
              <span class="wf-tag">% Gastos administrativos</span>
            </div>
          </div>
          <div class="wf-conn eq">
            <div class="wf-line eq"></div>
            <span class="wf-op eq">=</span>
          </div>
        </div>

        <!-- Block 4: Total Operativo + Ganancia -->
        <div class="wf-block" v-click v-motion :initial="{opacity:0,y:-20}" :enter="{opacity:1,y:0,transition:{duration:600}}">
          <div class="wf-card indigo">
            <div class="wf-glow indigo"></div>
            <div class="wf-row">
              <span class="wf-title">Total Operativo</span>
              <span class="wf-add">+ % Rentabilidad</span>
            </div>
          </div>
          <div class="wf-conn eq">
            <div class="wf-line eq"></div>
            <span class="wf-op final">=</span>
          </div>
        </div>

        <!-- Block 5: RESULTADO FINAL -->
        <div class="wf-block" v-click v-motion :initial="{opacity:0,scale:0.9}" :enter="{opacity:1,scale:1,transition:{duration:800}}">
          <div class="wf-result">
            <div class="result-glow"></div>
            <div class="result-pulse r1"></div>
            <div class="result-pulse r2"></div>
            <div class="result-inner">
              <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="none" stroke="#34d399" stroke-width="1.2"/><path d="M8 12.5l3 3 5-6" fill="none" stroke="#34d399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div class="result-text">
                <span class="result-title">Precio de Venta Final</span>
                <span class="result-sub">IVA incluido</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.engine-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 1.6rem 3.5rem 1.6rem 4.5rem;
  gap: 2.5rem;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 400px;
  height: 350px;
  background: radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 65%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  bottom: 15%;
  right: 20%;
  width: 350px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(52,211,153,0.04) 0%, transparent 65%);
  filter: blur(55px);
  pointer-events: none;
  z-index: 0;
}


/* ═══ LEFT ═══ */
.left {
  width: 32%;
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
  gap: 0.8rem;
  margin-bottom: 1rem;
}
.tag-bar {
  width: 3rem;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.38em;
  color: #6366f1;
}

h1 {
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1.12;
  margin: 0 0 0.6rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 0.62rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.55;
  margin-bottom: 1rem;
  padding-left: 0.8rem;
  border-left: 2px solid rgba(99,102,241,0.3);
}
.desc strong { color: #a5b4fc; font-weight: 600; }

/* Stats */
.stats {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.7rem;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.2rem;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 0.5rem;
  transition: border-color 0.3s;
}
.stat:hover { border-color: rgba(99,102,241,0.4); }
.stat-val {
  font-size: 1.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #c7d2fe, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.stat-label {
  font-size: 0.38rem;
  color: #64748b;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  margin-top: 0.1rem;
}

/* Config note */
.config-note {
  display: flex;
  overflow: hidden;
  border-radius: 0.5rem;
  background: rgba(139,92,246,0.04);
  border: 1px solid rgba(139,92,246,0.18);
}
.config-accent {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #8b5cf6, rgba(139,92,246,0.15));
}
.config-body {
  padding: 0.35rem 0.55rem;
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
}
.config-icon { flex-shrink: 0; margin-top: 0.05rem; }
.config-body p {
  font-size: 0.46rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.4;
  margin: 0;
}
.config-body strong { color: #a78bfa; font-weight: 600; }

/* ═══ RIGHT: WATERFALL ═══ */
.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.waterfall {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Waterfall Block ── */
.wf-block {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card */
.wf-card {
  position: relative;
  width: 100%;
  padding: 0.45rem 0.7rem;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(71,85,105,0.25);
  border-radius: 0.6rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}
.wf-card:hover { transform: translateY(-2px); }

.wf-card.amber { border-color: rgba(245,158,11,0.3); }
.wf-card.amber:hover { border-color: rgba(245,158,11,0.5); }
.wf-card.cyan { border-color: rgba(34,211,238,0.3); }
.wf-card.cyan:hover { border-color: rgba(34,211,238,0.5); }
.wf-card.violet { border-color: rgba(139,92,246,0.3); }
.wf-card.violet:hover { border-color: rgba(139,92,246,0.5); }
.wf-card.indigo { border-color: rgba(99,102,241,0.3); }
.wf-card.indigo:hover { border-color: rgba(99,102,241,0.5); }

/* Card glow */
.wf-glow {
  position: absolute;
  top: -20px;
  right: -10px;
  width: 100px;
  height: 70px;
  border-radius: 50%;
  filter: blur(25px);
  pointer-events: none;
}
.wf-glow.amber { background: rgba(245,158,11,0.07); }
.wf-glow.cyan { background: rgba(34,211,238,0.07); }
.wf-glow.violet { background: rgba(139,92,246,0.07); }
.wf-glow.indigo { background: rgba(99,102,241,0.07); }

/* Card row */
.wf-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
}
.wf-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: #e2e8f0;
}
.wf-hint {
  font-size: 0.35rem;
  color: #475569;
  font-weight: 400;
  font-style: italic;
  margin-left: auto;
}
.wf-add {
  font-size: 0.5rem;
  color: #818cf8;
  font-weight: 600;
  margin-left: auto;
}

/* Tags */
.wf-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.18rem;
}
.wf-tag {
  font-size: 0.38rem;
  color: #94a3b8;
  font-weight: 400;
  padding: 0.1rem 0.35rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(71,85,105,0.18);
  border-radius: 0.2rem;
}

/* ── Connectors ── */
.wf-conn {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 20px;
  position: relative;
}
.wf-line {
  width: 1.5px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(99,102,241,0.2), rgba(99,102,241,0.08));
}
.wf-line.eq {
  background: linear-gradient(to bottom, rgba(99,102,241,0.3), rgba(99,102,241,0.12));
  width: 2px;
}
.wf-op {
  font-size: 0.65rem;
  font-weight: 300;
  color: #475569;
  line-height: 1;
}
.wf-op.eq {
  font-weight: 700;
  color: #6366f1;
}
.wf-op.final {
  font-weight: 900;
  color: #34d399;
  font-size: 0.8rem;
}

/* ═══ RESULT ═══ */
.wf-result {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}
.result-glow {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 60px;
  background: radial-gradient(ellipse, rgba(52,211,153,0.14) 0%, transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}
.result-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.75rem;
  pointer-events: none;
}
.result-pulse.r1 {
  width: calc(100% + 12px);
  height: calc(100% + 12px);
  border: 1px solid rgba(52,211,153,0.1);
  animation: res-pulse 3s ease-out infinite;
}
.result-pulse.r2 {
  width: calc(100% + 28px);
  height: calc(100% + 28px);
  border: 1px solid rgba(52,211,153,0.06);
  animation: res-pulse 3s ease-out infinite 1s;
}

@keyframes res-pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  70% { transform: translate(-50%, -50%) scale(1.1); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0; }
}

.result-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1.8rem;
  background: linear-gradient(135deg, rgba(52,211,153,0.1), rgba(52,211,153,0.03)), rgba(15,23,42,0.85);
  border: 1.5px solid rgba(52,211,153,0.4);
  border-radius: 0.75rem;
  box-shadow: 0 10px 35px rgba(0,0,0,0.35), 0 0 30px rgba(52,211,153,0.08);
  transition: border-color 0.3s, transform 0.3s;
}
.result-inner:hover {
  border-color: rgba(52,211,153,0.6);
  transform: translateY(-2px);
}
.result-text {
  display: flex;
  flex-direction: column;
}
.result-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #34d399;
}
.result-sub {
  font-size: 0.4rem;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
</style>
