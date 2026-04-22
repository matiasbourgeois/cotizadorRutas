<template>
  <div class="methodology-slide">

    <div class="ambient-glow"></div>
    <div class="ambient-glow-secondary"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Diseño Metodológico</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Metodología
      </h1>

      <!-- Scrum Card -->
      <div class="scrum-card" v-motion :initial="{opacity:0,y:20}" :enter="{opacity:1,y:0,transition:{duration:900,delay:350}}">
        <div class="scrum-glow"></div>
        <div class="scrum-header">
          <span class="badge blue">Marco de Trabajo</span>
        </div>
        <p class="scrum-title">Scrum</p>
        <p class="scrum-desc">
          Marco ágil adoptado por la <strong>alta complejidad</strong> de las reglas de negocio y la necesidad de <strong>validación continua</strong> durante la construcción del prototipo.
        </p>
      </div>

      <!-- Sprint Metrics -->
      <div class="metrics-row" v-click v-motion :initial="{opacity:0,y:16}" :enter="{opacity:1,y:0,transition:{duration:700}}">
        <div class="metric-card">
          <span class="metric-value">23</span>
          <span class="metric-label">HUs</span>
          <span class="metric-sub">Product Backlog</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">112</span>
          <span class="metric-label">horas</span>
          <span class="metric-sub">estimadas</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">14</span>
          <span class="metric-label">días</span>
          <span class="metric-sub">por sprint</span>
        </div>
      </div>

      <!-- Data collection -->
      <div class="data-card" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <div class="data-accent"></div>
        <div class="data-body">
          <span class="data-title">Recolección de Datos</span>
          <p>Documentación interna · Consulta a stakeholders · Convenio Colectivo 40/89</p>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN: Tech Stack -->
    <div class="right">

      <div class="stack-header" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:600,delay:400}}">
        <span class="stack-badge">Herramientas de Desarrollo</span>
        <span class="stack-note">Stack JavaScript Full</span>
      </div>

      <!-- Frontend Layer -->
      <div class="layer-label" v-click>Frontend</div>
      <div class="tech-grid" v-click>
        <div class="tech-card">
          <div class="tech-icon react">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
              <ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.8"/>
              <ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.8" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="3.8" fill="none" stroke="#61DAFB" stroke-width="0.8" transform="rotate(120 12 12)"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">React</span>
            <span class="tech-role">Interfaz SPA</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon mantine">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="none" stroke="#339AF0" stroke-width="1" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="#339AF0" opacity="0.6"/>
              <path d="M12 6v12M6 9l6 3 6-3M6 15l6-3 6 3" stroke="#339AF0" stroke-width="0.5" opacity="0.4"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">Mantine</span>
            <span class="tech-role">Componentes UI</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon vite">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M20.5 3L12 22 8 11.5 20.5 3z" fill="#BD34FE" opacity="0.8"/>
              <path d="M3.5 6L12 22 8 11.5 3.5 6z" fill="#41D1FF" opacity="0.8"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">Vite</span>
            <span class="tech-role">Build & Dev Server</span>
          </div>
        </div>
      </div>

      <!-- Backend Layer -->
      <div class="layer-label" v-click>Backend & Datos</div>
      <div class="tech-grid" v-click>
        <div class="tech-card">
          <div class="tech-icon node">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2l8.5 4.9v9.8L12 22l-8.5-4.9V6.9L12 2z" fill="none" stroke="#68A063" stroke-width="1" stroke-linejoin="round"/>
              <text x="12" y="14.5" text-anchor="middle" fill="#68A063" font-size="7" font-weight="800">N</text>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">Node.js</span>
            <span class="tech-role">Runtime del servidor</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon express">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#94a3b8" stroke-width="0.8"/>
              <text x="12" y="14.5" text-anchor="middle" fill="#94a3b8" font-size="6" font-weight="800">EX</text>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">Express</span>
            <span class="tech-role">API RESTful</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon mongo">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2C9 5 7 8 7 12c0 4 2.5 7 5 10 2.5-3 5-6 5-10 0-4-2-7-5-10z" fill="none" stroke="#4DB33D" stroke-width="0.9"/>
              <path d="M12 7c-1.5 2-2.5 3.5-2.5 5.5 0 2 1 3.5 2.5 5 1.5-1.5 2.5-3 2.5-5 0-2-1-3.5-2.5-5.5z" fill="#4DB33D" opacity="0.35"/>
              <line x1="12" y1="9" x2="12" y2="19" stroke="#4DB33D" stroke-width="0.7" opacity="0.6"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">MongoDB</span>
            <span class="tech-role">Base de datos NoSQL</span>
          </div>
        </div>
      </div>

      <!-- Services Layer -->
      <div class="layer-label" v-click>Servicios & Seguridad</div>
      <div class="tech-grid" v-click>
        <div class="tech-card">
          <div class="tech-icon maps">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#EA4335" stroke-width="0.9"/>
              <circle cx="12" cy="9" r="2.5" fill="#EA4335" opacity="0.5"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">Google Maps</span>
            <span class="tech-role">Geolocalización</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon jwt">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 3l-8 4v6c0 5.25 3.4 10.1 8 11 4.6-.9 8-5.75 8-11V7l-8-4z" fill="none" stroke="#F5A623" stroke-width="0.9"/>
              <path d="M10.5 12.5l1.5 1.5 3-3" stroke="#F5A623" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">JWT + Bcrypt</span>
            <span class="tech-role">Autenticación segura</span>
          </div>
        </div>
        <div class="tech-card">
          <div class="tech-icon oauth">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#4285F4" stroke-width="0.8"/>
              <path d="M12 7v5l3 3" stroke="#4285F4" stroke-width="1" fill="none" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="1" fill="#4285F4"/>
            </svg>
          </div>
          <div class="tech-info">
            <span class="tech-name">OAuth 2.0</span>
            <span class="tech-role">Login con Google</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.methodology-slide {
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
  top: 18%;
  left: 8%;
  width: 420px;
  height: 380px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.ambient-glow-secondary {
  position: absolute;
  bottom: 12%;
  right: 18%;
  width: 300px;
  height: 260px;
  background: radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 65%);
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
  margin-bottom: 1.3rem;
}
.tag-bar {
  width: 3.5rem;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, transparent);
  flex-shrink: 0;
}
.tag-text {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  color: #6366f1;
}

h1 {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 0.8rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Scrum card */
.scrum-card {
  position: relative;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  margin-bottom: 0.8rem;
  overflow: hidden;
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  transition: border-color 0.4s, box-shadow 0.4s;
}
.scrum-card:hover {
  border-color: rgba(99,102,241,0.45);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.scrum-glow {
  position: absolute;
  top: -50%;
  right: -15%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(99,102,241,0.1);
  filter: blur(40px);
  pointer-events: none;
}
.scrum-header {
  margin-bottom: 0.3rem;
}
.badge {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  padding: 0.18rem 0.55rem;
  border-radius: 50px;
}
.badge.blue {
  color: #6366f1;
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.3);
}
.scrum-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e2e8f0;
  margin: 0 0 0.2rem 0;
}
.scrum-desc {
  font-size: 0.66rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.55;
  margin: 0;
}
.scrum-desc strong {
  color: #c7d2fe;
  font-weight: 600;
}

/* Metrics row */
.metrics-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}
.metric-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.55rem 0.3rem;
  background: rgba(15,23,42,0.65);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 0.65rem;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s, transform 0.3s;
}
.metric-card:hover {
  border-color: rgba(99,102,241,0.4);
  transform: translateY(-2px);
}
.metric-value {
  font-size: 1.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #c7d2fe, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.metric-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.metric-sub {
  font-size: 0.42rem;
  color: #475569;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Data card */
.data-card {
  display: flex;
  overflow: hidden;
  border-radius: 0.65rem;
  background: rgba(34,211,238,0.04);
  border: 1px solid rgba(34,211,238,0.2);
  backdrop-filter: blur(10px);
  transition: border-color 0.3s;
}
.data-card:hover { border-color: rgba(34,211,238,0.35); }
.data-accent {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.15));
}
.data-body {
  padding: 0.5rem 0.8rem;
}
.data-title {
  font-size: 0.58rem;
  font-weight: 700;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 0.15rem;
}
.data-body p {
  font-size: 0.58rem;
  color: #64748b;
  font-weight: 300;
  line-height: 1.4;
  margin: 0;
}

/* ═══ RIGHT ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  gap: 0.15rem;
}

.stack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}
.stack-badge {
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #6366f1;
  padding: 0.2rem 0.6rem;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 50px;
}
.stack-note {
  font-size: 0.42rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 500;
}

/* Layer labels */
.layer-label {
  font-size: 0.48rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #475569;
  margin-top: 0.4rem;
  margin-bottom: 0.15rem;
  padding-left: 0.2rem;
}

/* Tech grid */
.tech-grid {
  display: flex;
  gap: 0.4rem;
}

.tech-card {
  flex: 1;
  display: flex;
  gap: 0.45rem;
  align-items: center;
  padding: 0.45rem 0.55rem;
  background: rgba(15,23,42,0.55);
  border: 1px solid rgba(71,85,105,0.25);
  border-radius: 0.6rem;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.tech-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}

/* Individual hover colors */
.tech-card:has(.react):hover { border-color: rgba(97,218,251,0.4); }
.tech-card:has(.mantine):hover { border-color: rgba(51,154,240,0.4); }
.tech-card:has(.vite):hover { border-color: rgba(189,52,254,0.4); }
.tech-card:has(.node):hover { border-color: rgba(104,160,99,0.4); }
.tech-card:has(.express):hover { border-color: rgba(148,163,184,0.4); }
.tech-card:has(.mongo):hover { border-color: rgba(77,179,61,0.4); }
.tech-card:has(.maps):hover { border-color: rgba(234,67,53,0.4); }
.tech-card:has(.jwt):hover { border-color: rgba(245,166,35,0.4); }
.tech-card:has(.oauth):hover { border-color: rgba(66,133,244,0.4); }

.tech-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.45rem;
  background: rgba(255,255,255,0.03);
}
.tech-icon.react { box-shadow: 0 0 12px rgba(97,218,251,0.12); }
.tech-icon.mantine { box-shadow: 0 0 12px rgba(51,154,240,0.12); }
.tech-icon.vite { box-shadow: 0 0 12px rgba(189,52,254,0.12); }
.tech-icon.node { box-shadow: 0 0 12px rgba(104,160,99,0.12); }
.tech-icon.express { box-shadow: 0 0 12px rgba(148,163,184,0.08); }
.tech-icon.mongo { box-shadow: 0 0 12px rgba(77,179,61,0.12); }
.tech-icon.maps { box-shadow: 0 0 12px rgba(234,67,53,0.12); }
.tech-icon.jwt { box-shadow: 0 0 12px rgba(245,166,35,0.12); }
.tech-icon.oauth { box-shadow: 0 0 12px rgba(66,133,244,0.12); }

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.tech-name {
  font-size: 0.68rem;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1.2;
}
.tech-role {
  font-size: 0.48rem;
  color: #64748b;
  font-weight: 300;
}
</style>
