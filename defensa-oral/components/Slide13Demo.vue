<template>
  <div class="demo-slide">

    <!-- AMBIENT -->
    <div class="ambient a1"></div>
    <div class="ambient a2"></div>
    <div class="ambient a3"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Demostración</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Sistema en<br>Producción
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        A continuación se presenta el sistema funcionando en su <strong>entorno productivo real</strong>, accesible desde cualquier navegador.
      </p>

      <!-- URL Bar -->
      <div class="url-card" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <div class="url-glow"></div>
        <div class="url-field">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#34d399" stroke-width="1.5"/></svg>
          <span class="url-text">quotargo.ar</span>
        </div>
      </div>

      <!-- Tech deploy -->
      <div class="deploy-card" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="deploy-accent"></div>
        <div class="deploy-body">
          <span class="deploy-title">Infraestructura de Despliegue</span>
          <div class="deploy-tags">
            <span class="dtag">VPS Hostinger (Back + DB)</span>
            <span class="dtag">Hostinger (Front)</span>
            <span class="dtag">HTTPS · dominio .ar</span>
          </div>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Demo Roadmap -->
    <div class="right">

      <div class="right-header" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:400}}">
        <span class="right-badge">Recorrido de la demostración</span>
      </div>

      <!-- Section 1: Acceso -->
      <div class="demo-step" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
        <div class="step-card">
          <div class="step-accent emerald"></div>
          <div class="step-num-wrap emerald">
            <span class="step-num">1</span>
          </div>
          <div class="step-body">
            <span class="step-name">Acceso al Sistema</span>
            <span class="step-desc">Registro de cuenta, inicio de sesión con credenciales y autenticación social OAuth 2.0 con Google</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Config Global -->
      <div class="demo-step" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
        <div class="step-card">
          <div class="step-accent teal"></div>
          <div class="step-num-wrap teal">
            <span class="step-num">2</span>
          </div>
          <div class="step-body">
            <span class="step-name">Configuración Global</span>
            <span class="step-desc">Plantillas de costos predeterminados para vehículos y recurso humano desde el panel de administración</span>
          </div>
        </div>
      </div>

      <!-- Section 3: Cotización -->
      <div class="demo-step" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
        <div class="step-card">
          <div class="step-accent cyan"></div>
          <div class="step-num-wrap cyan">
            <span class="step-num">3</span>
          </div>
          <div class="step-body">
            <span class="step-name">Flujo de Cotización Completo</span>
            <span class="step-desc">Los 5 pasos: ruta y tipo de carga → frecuencia → vehículo → recurso humano → resumen y ajustes finales</span>
          </div>
        </div>
      </div>

      <!-- Section 4: Documentos -->
      <div class="demo-step" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
        <div class="step-card">
          <div class="step-accent indigo"></div>
          <div class="step-num-wrap indigo">
            <span class="step-num">4</span>
          </div>
          <div class="step-body">
            <span class="step-name">Documentos Generados</span>
            <span class="step-desc">Propuesta comercial para el cliente y desglose de costos detallado para uso interno de la empresa</span>
          </div>
        </div>
      </div>

      <!-- Section 5: BI -->
      <div class="demo-step" v-click v-motion :initial="{opacity:0,x:30}" :enter="{opacity:1,x:0,transition:{duration:600}}">
        <div class="step-card highlight">
          <div class="step-accent violet"></div>
          <div class="step-num-wrap violet">
            <span class="step-num">5</span>
          </div>
          <div class="step-body">
            <span class="step-name">Panel de Inteligencia de Negocio</span>
            <span class="step-desc">Dashboard con datos históricos, métricas de rentabilidad y soporte para decisiones estratégicas</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.demo-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 2rem 3.5rem 2rem 4.5rem;
  gap: 2.5rem;
  overflow: hidden;
}

/* ═══ Ambient ═══ */
.ambient {
  position: absolute;
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
}
.a1 { top: 20%; left: 10%; width: 350px; height: 300px; background: radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 65%); }
.a2 { bottom: 20%; right: 20%; width: 300px; height: 260px; background: radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%); }
.a3 { top: 40%; right: 40%; width: 280px; height: 240px; background: radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 65%); }


/* ═══ LEFT ═══ */
.left {
  width: 34%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.tag-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.2rem; }
.tag-bar { width: 3rem; height: 2px; background: linear-gradient(90deg, #34d399, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.38em; color: #34d399; }

h1 {
  font-size: 2.6rem; font-weight: 900; line-height: 1.12; margin: 0 0 0.7rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.desc { font-size: 0.65rem; color: #64748b; font-weight: 300; line-height: 1.55; margin-bottom: 1rem; padding-left: 0.8rem; border-left: 2px solid rgba(52,211,153,0.35); }
.desc strong { color: #34d399; font-weight: 600; }

/* URL Card */
.url-card {
  position: relative;
  padding: 0.6rem 0.9rem;
  background: rgba(15,23,42,0.75);
  border: 1px solid rgba(52,211,153,0.25);
  border-radius: 0.6rem;
  margin-bottom: 0.7rem;
  backdrop-filter: blur(14px);
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.url-card:hover {
  border-color: rgba(52,211,153,0.45);
  box-shadow: 0 8px 32px rgba(52,211,153,0.08);
}
.url-glow {
  position: absolute;
  top: -30px; right: -20px;
  width: 120px; height: 80px;
  border-radius: 50%;
  background: rgba(52,211,153,0.08);
  filter: blur(30px);
  pointer-events: none;
}

.url-field {
  display: flex; align-items: center; gap: 0.4rem;
}
.url-text {
  font-size: 0.95rem; font-weight: 700; color: #34d399;
  letter-spacing: 0.02em;
}

/* Deploy card */
.deploy-card {
  display: flex; overflow: hidden; border-radius: 0.5rem;
  background: rgba(99,102,241,0.04); border: 1px solid rgba(99,102,241,0.18);
}
.deploy-accent { width: 3px; flex-shrink: 0; background: linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.15)); }
.deploy-body { padding: 0.4rem 0.6rem; }
.deploy-title { font-size: 0.48rem; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.2rem; }
.deploy-tags { display: flex; flex-wrap: wrap; gap: 0.2rem; }
.dtag {
  font-size: 0.42rem; color: #94a3b8; font-weight: 400;
  padding: 0.1rem 0.3rem;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 0.25rem;
}

/* ═══ RIGHT ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  position: relative;
  z-index: 1;
}

.right-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.15rem;
}
.right-badge {
  font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #34d399;
  padding: 0.2rem 0.6rem;
  background: rgba(52,211,153,0.08);
  border: 1px solid rgba(52,211,153,0.25);
  border-radius: 50px;
}

/* Step cards */
.step-card {
  position: relative;
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.4rem 0.65rem;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(71,85,105,0.2);
  border-radius: 0.6rem;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  flex-wrap: wrap;
}
.step-card:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.step-card.highlight {
  background: rgba(139,92,246,0.06);
  border-color: rgba(139,92,246,0.3);
}
.step-card.highlight:hover {
  border-color: rgba(139,92,246,0.5);
  box-shadow: 0 8px 28px rgba(139,92,246,0.1);
}

/* Accent bar */
.step-accent { position: absolute; top: 0; left: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }
.step-accent.emerald { background: linear-gradient(to bottom, #34d399, rgba(52,211,153,0.2)); }
.step-accent.teal { background: linear-gradient(to bottom, #2dd4bf, rgba(45,212,191,0.2)); }
.step-accent.cyan { background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.2)); }
.step-accent.indigo { background: linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.2)); }
.step-accent.violet { background: linear-gradient(to bottom, #a78bfa, rgba(139,92,246,0.2)); }

/* Number */
.step-num-wrap {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.step-num-wrap.emerald { background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.3); }
.step-num-wrap.teal { background: rgba(45,212,191,0.12); border: 1px solid rgba(45,212,191,0.3); }
.step-num-wrap.cyan { background: rgba(34,211,238,0.12); border: 1px solid rgba(34,211,238,0.3); }
.step-num-wrap.indigo { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); }
.step-num-wrap.violet { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.35); }

.step-num {
  font-size: 0.7rem; font-weight: 900; line-height: 1;
  background: linear-gradient(135deg, #e2e8f0, #94a3b8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* Body */
.step-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.step-name { font-size: 0.62rem; font-weight: 700; color: #e2e8f0; line-height: 1.2; }
.step-desc { font-size: 0.48rem; color: #64748b; font-weight: 300; line-height: 1.3; }

/* ═══ Hover color accents ═══ */
.step-card:has(.emerald):hover { border-color: rgba(52,211,153,0.35); }
.step-card:has(.teal):hover { border-color: rgba(45,212,191,0.35); }
.step-card:has(.indigo):hover { border-color: rgba(99,102,241,0.35); }
</style>
