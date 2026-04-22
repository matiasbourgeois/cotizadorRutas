<template>
  <div class="rrhh-slide">

    <div class="ambient-glow a1"></div>
    <div class="ambient-glow a2"></div>
    <div class="ambient-glow a3"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Motor de Cálculo</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Recurso<br>Humano
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        El servicio aplica una <strong>lógica diferencial</strong> basada en la duración del viaje y la modalidad de contratación, integrando la escala salarial del CCT 40/89.
      </p>

      <!-- Modalities -->
      <div class="modes" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <span class="modes-label">Modalidades de contratación</span>
        <div class="mode-card">
          <div class="mode-dot cyan"></div>
          <div class="mode-info">
            <span class="mode-name">Empleado</span>
            <span class="mode-desc">CCT 40/89 · Escala salarial vigente</span>
          </div>
        </div>
        <div class="mode-card">
          <div class="mode-dot violet"></div>
          <div class="mode-info">
            <span class="mode-name">Contratado</span>
            <span class="mode-desc">Factor configurable sobre empleado CCT</span>
          </div>
        </div>
      </div>

      <!-- 3 levels -->
      <div class="levels-card" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="levels-accent"></div>
        <div class="levels-body">
          <span class="levels-title">Lógica diferencial por duración</span>
          <div class="level-items">
            <div class="level-row">
              <span class="level-badge">1</span>
              <span class="level-text"><strong>Mínimo / Proporcional</strong> — viajes cortos</span>
            </div>
            <div class="level-row">
              <span class="level-badge">2</span>
              <span class="level-text"><strong>Jornada Completa</strong> — desde 3 horas</span>
            </div>
            <div class="level-row">
              <span class="level-badge">3</span>
              <span class="level-text"><strong>Sueldo Mensual</strong> — 4+ días/semana</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN: 3 Groups + Contratado -->
    <div class="right">

      <!-- GROUP 1: SALARIO BASE -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent cyan"></div>
          <div class="group-glow cyan"></div>
          <div class="group-header">
            <div class="group-icon cyan">
              <svg viewBox="0 0 24 24" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#22d3ee" stroke-width="1.2"/><path d="M2 10h20" stroke="#22d3ee" stroke-width="0.7"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Salario Base</span>
              <span class="group-sub">Costo base remunerativo según CCT 40/89</span>
            </div>
          </div>
          <div class="group-items">
            <div class="item">
              <div class="item-dot cyan"></div>
              <div class="item-content">
                <span class="item-name">Sueldo básico + adicional por actividad</span>
                <span class="item-detail">Escala salarial vigente del convenio colectivo</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot cyan"></div>
              <div class="item-content">
                <span class="item-name">Costeo por hora, jornal o sueldo mensual</span>
                <span class="item-detail">Según los 3 niveles de la lógica diferencial</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot cyan"></div>
              <div class="item-content">
                <span class="item-name">Horas extra</span>
                <span class="item-detail">Factor ×1.5 sobre costo por minuto del jornal CCT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GROUP 2: COSTOS VARIABLES -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent teal"></div>
          <div class="group-glow teal"></div>
          <div class="group-header">
            <div class="group-icon teal">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="#2dd4bf" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Costos Variables</span>
              <span class="group-sub">Adicionales por kilómetro y operación</span>
            </div>
          </div>
          <div class="group-items">
            <div class="item">
              <div class="item-dot teal"></div>
              <div class="item-content">
                <span class="item-name">Adicional por km remunerativo</span>
                <span class="item-detail">Con km mínimos facturables según CCT (150 / 350 km)</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot teal"></div>
              <div class="item-content">
                <span class="item-name">Viáticos por km</span>
                <span class="item-detail">Concepto no remunerativo por km recorrido</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot teal"></div>
              <div class="item-content">
                <span class="item-name">Adicional de carga y descarga</span>
                <span class="item-detail">Por tramos de kilómetros recorridos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GROUP 3: COSTOS INDIRECTOS -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent violet"></div>
          <div class="group-glow violet"></div>
          <div class="group-header">
            <div class="group-icon violet">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" fill="none" stroke="#a78bfa" stroke-width="1.1"/><path d="M9 12h6m-6 4h4" stroke="#a78bfa" stroke-width="0.8" stroke-linecap="round"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Costos Indirectos</span>
              <span class="group-sub">Cargas sobre la base remunerativa</span>
            </div>
          </div>
          <div class="group-items horizontal">
            <div class="indirect-tag">Cargas sociales <span class="tag-pct">% configurable</span></div>
            <div class="indirect-tag">Suma no remunerativa fija</div>
            <div class="indirect-tag contratado">Contratado: factor % sobre costo CCT equivalente</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.rrhh-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 1.6rem 3.5rem 1.6rem 4.5rem;
  gap: 2.5rem;
  overflow: hidden;
}

.ambient-glow { position: absolute; filter: blur(60px); pointer-events: none; z-index: 0; border-radius: 50%; }
.a1 { top: 10%; right: 20%; width: 300px; height: 250px; background: radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%); }
.a2 { bottom: 20%; right: 30%; width: 250px; height: 200px; background: radial-gradient(ellipse, rgba(45,212,191,0.04) 0%, transparent 70%); }
.a3 { top: 40%; left: 20%; width: 250px; height: 200px; background: radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%); }


/* ═══ LEFT ═══ */
.left {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.tag-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
.tag-bar { width: 3rem; height: 2px; background: linear-gradient(90deg, #22d3ee, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.38em; color: #22d3ee; }

h1 {
  font-size: 2.2rem; font-weight: 900; line-height: 1.12; margin: 0 0 0.6rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.desc { font-size: 0.6rem; color: #64748b; font-weight: 300; line-height: 1.55; margin-bottom: 0.8rem; padding-left: 0.8rem; border-left: 2px solid rgba(34,211,238,0.35); }
.desc strong { color: #22d3ee; font-weight: 600; }

/* Modalities */
.modes { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 0.6rem; }
.modes-label { font-size: 0.48rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #475569; display: block; margin-bottom: 0.2rem; }
.mode-card {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.25rem 0.45rem; border-radius: 0.35rem;
  background: rgba(15,23,42,0.5);
  border: 1px solid rgba(71,85,105,0.2);
  transition: border-color 0.3s, transform 0.2s;
}
.mode-card:hover { transform: translateX(3px); }
.mode-card:first-of-type:hover { border-color: rgba(34,211,238,0.4); }
.mode-card:last-of-type:hover { border-color: rgba(139,92,246,0.4); }

.mode-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.mode-dot.cyan { background: #22d3ee; box-shadow: 0 0 6px rgba(34,211,238,0.4); }
.mode-dot.violet { background: #a78bfa; box-shadow: 0 0 6px rgba(139,92,246,0.4); }

.mode-info { display: flex; flex-direction: column; }
.mode-name { font-size: 0.58rem; font-weight: 700; color: #e2e8f0; }
.mode-desc { font-size: 0.46rem; color: #64748b; font-weight: 300; }

/* Levels card */
.levels-card { display: flex; overflow: hidden; border-radius: 0.5rem; background: rgba(34,211,238,0.03); border: 1px solid rgba(34,211,238,0.18); }
.levels-accent { width: 3px; flex-shrink: 0; background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.15)); }
.levels-body { padding: 0.35rem 0.55rem; }
.levels-title { font-size: 0.50rem; font-weight: 700; color: #22d3ee; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.2rem; }
.level-items { display: flex; flex-direction: column; gap: 0.1rem; }
.level-row { display: flex; align-items: center; gap: 0.3rem; }
.level-badge {
  width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.38rem; font-weight: 900; color: #0f172a;
  background: rgba(34,211,238,0.8);
}
.level-text { font-size: 0.50rem; color: #64748b; font-weight: 300; }
.level-text strong { color: #94a3b8; font-weight: 600; }

/* ═══ RIGHT ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.45rem;
  position: relative;
  z-index: 1;
}

/* Group card */
.group-card {
  position: relative;
  padding: 0.5rem 0.7rem;
  background: rgba(15,23,42,0.65);
  border: 1px solid rgba(71,85,105,0.2);
  border-radius: 0.65rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}
.group-card:hover { transform: translateY(-2px); }

/* Accent bar */
.group-accent { position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }
.group-accent.cyan { background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.2)); }
.group-accent.teal { background: linear-gradient(to bottom, #2dd4bf, rgba(45,212,191,0.2)); }
.group-accent.violet { background: linear-gradient(to bottom, #a78bfa, rgba(139,92,246,0.2)); }

/* Glow */
.group-glow { position: absolute; top: -20px; right: -10px; width: 120px; height: 80px; border-radius: 50%; filter: blur(28px); pointer-events: none; }
.group-glow.cyan { background: rgba(34,211,238,0.06); }
.group-glow.teal { background: rgba(45,212,191,0.06); }
.group-glow.violet { background: rgba(139,92,246,0.06); }

/* Header */
.group-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.group-icon {
  width: 28px; height: 28px; border-radius: 0.4rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.group-icon.cyan { background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.25); }
.group-icon.teal { background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.25); }
.group-icon.violet { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); }

.group-titles { display: flex; flex-direction: column; }
.group-name { font-size: 0.72rem; font-weight: 800; color: #e2e8f0; line-height: 1.1; }
.group-sub { font-size: 0.46rem; color: #64748b; font-weight: 400; }

/* Items */
.group-items { display: flex; flex-direction: column; gap: 0.12rem; padding-left: 0.3rem; }
.item {
  display: flex; align-items: flex-start; gap: 0.35rem;
  padding: 0.18rem 0.35rem; border-radius: 0.3rem;
  transition: background 0.2s;
}
.item:hover { background: rgba(255,255,255,0.02); }

.item-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem; }
.item-dot.cyan { background: rgba(34,211,238,0.5); }
.item-dot.teal { background: rgba(45,212,191,0.5); }

.item-content { display: flex; flex-direction: column; }
.item-name { font-size: 0.58rem; font-weight: 700; color: #cbd5e1; }
.item-detail { font-size: 0.48rem; color: #64748b; font-weight: 300; }

/* Indirect horizontal */
.group-items.horizontal {
  flex-direction: row; flex-wrap: wrap; gap: 0.2rem; padding-left: 0;
}
.indirect-tag {
  font-size: 0.50rem; color: #c4b5fd; font-weight: 500;
  padding: 0.15rem 0.45rem;
  background: rgba(139,92,246,0.06);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 0.3rem;
  transition: border-color 0.3s, transform 0.2s;
}
.indirect-tag:hover { border-color: rgba(139,92,246,0.4); transform: translateY(-1px); }
.indirect-tag .tag-pct { color: #a78bfa; font-weight: 700; }
.indirect-tag.contratado {
  color: #a78bfa;
  border-color: rgba(139,92,246,0.3);
  background: rgba(139,92,246,0.08);
}
</style>
