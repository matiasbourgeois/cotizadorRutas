<template>
  <div class="arch-slide">

    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Arquitectura del Sistema</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Arquitectura
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        Modelo <strong>cliente-servidor</strong> que desacopla la interfaz de la lógica de negocio para garantizar escalabilidad.
      </p>

      <!-- Collections -->
      <div class="collections" v-click v-motion :initial="{opacity:0,y:16}" :enter="{opacity:1,y:0,transition:{duration:700}}">
        <span class="coll-label">Colecciones MongoDB</span>
        <div class="coll-grid">
          <div class="coll-tag"><span class="coll-dot"></span>Usuarios</div>
          <div class="coll-tag"><span class="coll-dot"></span>Vehículos</div>
          <div class="coll-tag"><span class="coll-dot"></span>Recursos Humanos</div>
          <div class="coll-tag"><span class="coll-dot"></span>Presupuestos</div>
          <div class="coll-tag"><span class="coll-dot"></span>Rutas</div>
        </div>
      </div>

      <!-- Architecture traits -->
      <div class="traits" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <div class="trait"><span class="trait-key">Patrón</span><span class="trait-val">SPA + API RESTful</span></div>
        <div class="trait"><span class="trait-key">Protocolo</span><span class="trait-val">HTTPS cifrado</span></div>
        <div class="trait"><span class="trait-key">Auth</span><span class="trait-val">JWT + OAuth 2.0</span></div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Architecture Diagram -->
    <div class="right">
      <div class="diagram" v-motion :initial="{opacity:0,scale:0.92}" :enter="{opacity:1,scale:1,transition:{duration:1200,delay:500}}">

        <!-- ══ DIAGRAM BACKGROUND (hidden until click) ══ -->
        <div class="diagram-bg" v-click>

          <!-- SVG LAYER: connections + data dots -->
          <svg class="conn-svg" viewBox="0 0 400 400" preserveAspectRatio="none">

            <!-- Browser → React (vertical spine) -->
            <line x1="200" y1="40" x2="200" y2="105" class="conn spine"/>
            <circle r="2.5" class="fdot fdot-cyan"><animateMotion dur="2s" repeatCount="indefinite" path="M200,40 L200,105"/></circle>

            <!-- React → API (vertical spine) -->
            <line x1="200" y1="140" x2="200" y2="195" class="conn spine"/>
            <circle r="3" class="fdot fdot-indigo"><animateMotion dur="1.8s" repeatCount="indefinite" path="M200,140 L200,195"/></circle>
            <text x="230" y="170" class="clabel">HTTPS</text>

            <!-- API → MongoDB (fan-out left) -->
            <line x1="180" y1="245" x2="100" y2="320" class="conn fan"/>
            <circle r="2" class="fdot fdot-green"><animateMotion dur="2.4s" repeatCount="indefinite" path="M180,245 L100,320"/></circle>
            <text x="110" y="265" class="clabel">Mongoose</text>

            <!-- API → Google Maps (fan-out center-right) -->
            <line x1="220" y1="245" x2="300" y2="320" class="conn fan"/>
            <circle r="2" class="fdot fdot-red"><animateMotion dur="2.6s" repeatCount="indefinite" path="M220,245 L300,320"/></circle>
            <text x="260" y="265" class="clabel">API externa</text>

          </svg>

          <!-- TIER LABELS -->
          <div class="tier-label tier-client">CLIENTE</div>
          <div class="tier-label tier-server">SERVIDOR</div>
          <div class="tier-label tier-data">SERVICIOS</div>

        </div>

        <!-- ══ NODES ══ -->

        <!-- Browser -->
        <div class="node n-browser" v-click>
          <div class="n-box">
            <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="12" rx="1.5" fill="none" stroke="#94a3b8" stroke-width="1.2"/><line x1="3" y1="7" x2="21" y2="7" stroke="#94a3b8" stroke-width="0.7"/><circle cx="5.5" cy="5" r="0.6" fill="#ef4444"/><circle cx="7.5" cy="5" r="0.6" fill="#f59e0b"/><circle cx="9.5" cy="5" r="0.6" fill="#22c55e"/><line x1="12" y1="15" x2="12" y2="19" stroke="#94a3b8" stroke-width="1"/><line x1="8" y1="19" x2="16" y2="19" stroke="#94a3b8" stroke-width="1"/></svg>
          </div>
          <span class="n-name">Navegador</span>
        </div>

        <!-- React SPA -->
        <div class="node n-react" v-click>
          <div class="n-pulse react-p"></div>
          <div class="n-box react-box">
            <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.7"/><ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.7" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.7" transform="rotate(120 12 12)"/></svg>
          </div>
          <span class="n-name">React SPA</span>
          <span class="n-sub">Mantine · Vite</span>
        </div>

        <!-- API REST (CORE) -->
        <div class="node n-api" v-click>
          <div class="n-pulse api-p1"></div>
          <div class="n-pulse api-p2"></div>
          <div class="n-box api-box">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 2l8.5 4.9v9.8L12 22l-8.5-4.9V6.9L12 2z" fill="rgba(99,102,241,0.08)" stroke="#6366f1" stroke-width="0.8" stroke-linejoin="round"/>
              <path d="M8 8l-3 4 3 4" fill="none" stroke="#a5b4fc" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 8l3 4-3 4" fill="none" stroke="#a5b4fc" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="13.5" y1="7" x2="10.5" y2="17" stroke="#818cf8" stroke-width="1" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="n-name api-n">API RESTful</span>
          <span class="n-sub">Node.js · Express</span>
          <span class="n-badge">CORE</span>
        </div>

        <!-- MongoDB -->
        <div class="node n-mongo" v-click>
          <div class="n-pulse mongo-p"></div>
          <div class="n-box mongo-box">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C9 5 7 8 7 12c0 4 2.5 7 5 10 2.5-3 5-6 5-10 0-4-2-7-5-10z" fill="none" stroke="#4DB33D" stroke-width="0.9"/><path d="M12 7c-1.2 1.8-2 3-2 4.5 0 1.5 0.8 2.8 2 4 1.2-1.2 2-2.5 2-4 0-1.5-0.8-2.7-2-4.5z" fill="#4DB33D" opacity="0.2"/><line x1="12" y1="10" x2="12" y2="18" stroke="#4DB33D" stroke-width="0.5" opacity="0.4"/></svg>
          </div>
          <span class="n-name">MongoDB</span>
          <span class="n-sub">Base de Datos</span>
        </div>

        <!-- Google Maps -->
        <div class="node n-maps" v-click>
          <div class="n-box maps-box">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#EA4335" stroke-width="0.9"/><circle cx="12" cy="9" r="2.5" fill="#EA4335" opacity="0.35"/></svg>
          </div>
          <span class="n-name">Google Maps</span>
          <span class="n-sub">Geoespacial</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.arch-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 1rem 3.5rem 0.5rem 4.5rem;
  gap: 2rem;
  overflow: visible;
}

.ambient-glow {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  bottom: 15%;
  right: 15%;
  width: 250px;
  height: 220px;
  background: radial-gradient(ellipse, rgba(34,211,238,0.03) 0%, transparent 65%);
  filter: blur(45px);
  pointer-events: none;
  z-index: 0;
}


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

.tag-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}
.tag-bar {
  width: 3rem;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.38em;
  color: #6366f1;
}

h1 {
  font-size: 2.3rem;
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 0.6rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.55;
  margin-bottom: 1.2rem;
  padding-left: 0.9rem;
  border-left: 2px solid rgba(99,102,241,0.35);
}
.desc strong { color: #a5b4fc; font-weight: 600; }

/* Collections */
.collections { margin-bottom: 0.8rem; }
.coll-label {
  font-size: 0.45rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #4DB33D;
  display: block;
  margin-bottom: 0.3rem;
}
.coll-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2rem;
}
.coll-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.48rem;
  color: #94a3b8;
  font-weight: 400;
  padding: 0.18rem 0.35rem;
  background: rgba(77,179,61,0.06);
  border: 1px solid rgba(77,179,61,0.15);
  border-radius: 0.3rem;
}
.coll-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #4DB33D;
  box-shadow: 0 0 5px rgba(77,179,61,0.4);
  flex-shrink: 0;
}

/* Traits */
.traits {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}
.trait {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.trait-key {
  font-size: 0.42rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
  min-width: 50px;
}
.trait-val {
  font-size: 0.48rem;
  color: #94a3b8;
  font-weight: 400;
}

/* ═══ RIGHT: DIAGRAM ═══ */
.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.diagram {
  position: relative;
  width: 100%;
  height: 90%;
  overflow: visible;
}

/* ── SVG connections ── */
.diagram-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.conn-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.conn {
  stroke-dasharray: 6 4;
  animation: dash-anim 1.5s linear infinite;
}
.conn.spine {
  stroke: rgba(99,102,241,0.22);
  stroke-width: 1.8;
}
.conn.fan {
  stroke: rgba(99,102,241,0.14);
  stroke-width: 1.2;
}

@keyframes dash-anim {
  to { stroke-dashoffset: -20; }
}

.clabel {
  font-size: 6.5px;
  fill: #475569;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Data flow dots */
.fdot { filter: blur(0.3px); }
.fdot-cyan { fill: rgba(34,211,238,0.7); }
.fdot-indigo { fill: rgba(99,102,241,0.8); }
.fdot-green { fill: rgba(77,179,61,0.7); }
.fdot-red { fill: rgba(234,67,53,0.6); }

/* ── Tier labels ── */
.tier-label {
  position: absolute;
  right: -0.3rem;
  font-size: 0.42rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  writing-mode: vertical-rl;
  z-index: 0;
}
.tier-client { top: 4%; color: rgba(148,163,184,0.5); }
.tier-server { top: 40%; color: rgba(129,140,248,0.5); }
.tier-data { top: 76%; color: rgba(148,163,184,0.5); }

/* ═══ NODES ═══ */
.node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.n-box {
  width: 38px;
  height: 38px;
  border-radius: 0.55rem;
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(71,85,105,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.node:hover .n-box {
  transform: scale(1.12);
}

.n-name {
  font-size: 0.58rem;
  font-weight: 700;
  color: #e2e8f0;
  text-align: center;
  white-space: nowrap;
}
.n-sub {
  font-size: 0.38rem;
  color: #475569;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
}

/* ── Exact positions (matching SVG viewBox 400x400) ── */
/* Browser */
.n-browser { left: 50%; top: 8%; }

/* React */
.n-react { left: 50%; top: 30%; }

/* API */
.n-api { left: 50%; top: 52%; }

/* MongoDB */
.n-mongo { left: 23%; top: 85%; }

/* Maps */
.n-maps { left: 77%; top: 85%; }

/* ── Node styles ── */
.react-box {
  border-color: rgba(97,218,251,0.3);
  box-shadow: 0 0 18px rgba(97,218,251,0.08);
}
.node:hover .react-box { border-color: rgba(97,218,251,0.5); box-shadow: 0 0 24px rgba(97,218,251,0.15); }

.api-box {
  width: 54px;
  height: 54px;
  border-radius: 0.75rem;
  border-color: rgba(99,102,241,0.4);
  box-shadow: 0 0 35px rgba(99,102,241,0.12), 0 0 70px rgba(99,102,241,0.04);
}
.api-n { font-size: 0.7rem; }
.n-badge {
  font-size: 0.32rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #6366f1;
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.3);
  padding: 0.06rem 0.35rem;
  border-radius: 50px;
  margin-top: 0.05rem;
}

.mongo-box {
  border-color: rgba(77,179,61,0.3);
  box-shadow: 0 0 14px rgba(77,179,61,0.08);
}
.node:hover .mongo-box { border-color: rgba(77,179,61,0.5); }

.maps-box {
  border-color: rgba(234,67,53,0.25);
  box-shadow: 0 0 12px rgba(234,67,53,0.06);
}
.node:hover .maps-box { border-color: rgba(234,67,53,0.45); }

/* ── Pulse rings ── */
.n-pulse {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  left: 50%;
}

.api-p1 {
  width: 72px;
  height: 72px;
  top: -9px;
  transform: translateX(-50%);
  border: 1px solid rgba(99,102,241,0.12);
  animation: pulse 3s ease-out infinite;
}
.api-p2 {
  width: 100px;
  height: 100px;
  top: -23px;
  transform: translateX(-50%);
  border: 1px solid rgba(99,102,241,0.06);
  animation: pulse 3s ease-out infinite 1.2s;
}
.react-p {
  width: 52px;
  height: 52px;
  top: -7px;
  transform: translateX(-50%);
  border: 1px solid rgba(97,218,251,0.08);
  animation: pulse 4s ease-out infinite 0.5s;
}
.mongo-p {
  width: 52px;
  height: 52px;
  top: -7px;
  transform: translateX(-50%);
  border: 1px solid rgba(77,179,61,0.08);
  animation: pulse 4s ease-out infinite 2s;
}

@keyframes pulse {
  0% { transform: translateX(-50%) scale(1); opacity: 1; }
  70% { transform: translateX(-50%) scale(1.7); opacity: 0; }
  100% { transform: translateX(-50%) scale(1.7); opacity: 0; }
}
</style>
