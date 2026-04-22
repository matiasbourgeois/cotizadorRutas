<template>
  <div class="company-slide" :style="{fontSize: '15px'}">
    <!-- LEFT COLUMN -->
    <div class="left">
      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Caso de Estudio · La Empresa</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Sol del<br>Amanecer
        <span class="srl">S.R.L.</span>
      </h1>

      <p class="location" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:350}}">
        Estados Unidos 2657 · Córdoba, Argentina
      </p>

      <!-- Click 1: KPI Row -->
      <div v-click="1" class="kpi-row">
        <div class="kpi">
          <span class="kpi-value amber">FTL</span>
          <span class="kpi-label">Full Truckload</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi">
          <span class="kpi-value white">B2B</span>
          <span class="kpi-label">Carga Dedicada</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi">
          <span class="kpi-value cyan">ANMAT</span>
          <span class="kpi-label">Disp. 2069/2018</span>
        </div>
      </div>

      <!-- Click 2: Service cards -->
      <div v-click="2" class="services">
        <div class="svc-card">
          <div class="svc-accent amber"></div>
          <div class="svc-body">
            <span class="svc-title">Logística Empresarial</span>
            <span class="svc-desc">Transporte exclusivo punto a punto y multi-punto con seguimiento satelital continuo</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-accent cyan"></div>
          <div class="svc-body">
            <span class="svc-title">Logística Farmacéutica</span>
            <span class="svc-desc">Cadena de frío certificada · Buenas Prácticas de Distribución de Medicamentos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN (Click 3) -->
    <div v-click="3" class="right">
      <div class="map-glow"></div>
      <div class="map-card">
        <div class="map-header">
          <span class="map-badge">Red Operativa</span>
          <span class="map-region">Provincia de Córdoba</span>
        </div>

        <div class="network">
          <!-- SVG layer: lines, rings, dots only (no text) -->
          <svg class="net-svg" viewBox="0 0 400 300" style="font-size:0">
            <defs>
              <filter id="g2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gs2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <!-- Range rings -->
            <circle cx="200" cy="150" r="40" fill="none" stroke="rgba(245,158,11,0.1)" stroke-width="0.5"/>
            <circle cx="200" cy="150" r="80" fill="none" stroke="rgba(245,158,11,0.06)" stroke-width="0.5" stroke-dasharray="3,4"/>
            <circle cx="200" cy="150" r="125" fill="none" stroke="rgba(245,158,11,0.04)" stroke-width="0.5" stroke-dasharray="2,5"/>

            <!-- Connection lines + animated dots -->
            <g v-for="(d, i) in svgCoords" :key="'c'+i">
              <line :x1="200" :y1="150" :x2="d.x" :y2="d.y"
                stroke="rgba(245,158,11,0.3)" stroke-width="1" stroke-dasharray="6,4" opacity="0.8">
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite"/>
              </line>
              <circle r="2" fill="#f59e0b" filter="url(#g2)" opacity="0">
                <animateMotion :dur="(2.8+i*0.5)+'s'" repeatCount="indefinite" :path="'M200,150 L'+d.x+','+d.y"/>
                <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.8;1" :dur="(2.8+i*0.5)+'s'" repeatCount="indefinite"/>
              </circle>
              <circle r="1.5" fill="#22d3ee" opacity="0">
                <animateMotion :dur="(3.2+i*0.4)+'s'" repeatCount="indefinite" :path="'M'+d.x+','+d.y+' L200,150'" :begin="(1+i*0.3)+'s'"/>
                <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.15;0.75;1" :dur="(3.2+i*0.4)+'s'" repeatCount="indefinite" :begin="(1+i*0.3)+'s'"/>
              </circle>
            </g>

            <!-- Hub pulse rings -->
            <circle cx="200" cy="150" r="8" fill="none" stroke="#f59e0b" stroke-width="1">
              <animate attributeName="r" values="8;40" dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="150" r="8" fill="none" stroke="#f59e0b" stroke-width="0.7">
              <animate attributeName="r" values="8;55" dur="2.5s" begin="1.25s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0" dur="2.5s" begin="1.25s" repeatCount="indefinite"/>
            </circle>

            <!-- Hub dot -->
            <circle cx="200" cy="150" r="8" fill="rgba(245,158,11,0.2)" filter="url(#gs2)"/>
            <circle cx="200" cy="150" r="5" fill="#f59e0b" filter="url(#g2)"/>
            <circle cx="200" cy="150" r="2.5" fill="#fef3c7"/>

            <!-- Depot dots -->
            <g v-for="(d, i) in svgCoords" :key="'dd'+i">
              <circle :cx="d.x" :cy="d.y" r="5" fill="rgba(100,116,139,0.15)"/>
              <circle :cx="d.x" :cy="d.y" r="3.5" fill="#475569" filter="url(#g2)"/>
              <circle :cx="d.x" :cy="d.y" r="2" fill="#94a3b8"/>
            </g>
          </svg>

          <!-- HTML labels: Hub -->
          <div class="hub-labels">
            <span class="hub-name">Córdoba Capital</span>
            <span class="hub-tag">SEDE CENTRAL</span>
          </div>

          <!-- HTML labels: Depots -->
          <div v-for="(d, i) in depots" :key="'dl'+i" class="depot-labels" :style="d.css">
            <span class="depot-name">{{ d.name }}</span>
            <span class="depot-type">DEPÓSITO</span>
          </div>
        </div>

        <p class="map-desc">
          Empresa de transporte y logística especializada en carga dedicada, con cobertura en toda la provincia de Córdoba.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// SVG coordinates matching CSS percentage positions
// CSS: top/left % → SVG viewBox 400x300
const depots = [
  { name: 'Villa María',  css: 'top: 5%; left: 20%;' },
  { name: 'Mina Clavero', css: 'top: 5%; left: 80%;' },
  { name: 'Río Cuarto',   css: 'bottom: 12%; left: 20%;' },
  { name: 'Almafuerte',   css: 'bottom: 12%; left: 80%;' },
]

// SVG coords: left% * 400, top% * 300
const svgCoords = [
  { x: 80,  y: 15 },   // 20% * 400, 5% * 300
  { x: 320, y: 15 },   // 80% * 400, 5% * 300
  { x: 80,  y: 264 },  // 20% * 400, 88% * 300
  { x: 320, y: 264 },  // 80% * 400, 88% * 300
]


</script>

<style scoped>
.company-slide {
  position: absolute; inset: 0; display: flex; align-items: stretch;
  justify-content: space-between; padding: 3rem 4.5rem; gap: 3rem; overflow: hidden;
  background:
    radial-gradient(ellipse 50% 60% at 30% 50%, rgba(245,158,11,0.04) 0%, transparent 60%),
    radial-gradient(ellipse 40% 50% at 75% 40%, rgba(34,211,238,0.03) 0%, transparent 60%);
}

/* v-click transitions */
:deep(.slidev-vclick-target) { transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
:deep(.slidev-vclick-hidden) { opacity: 0 !important; transform: translateY(18px); }

/* LEFT */
.left { width: 50%; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 1; }
.tag-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.tag-bar { width: 3.5rem; height: 2px; background: linear-gradient(90deg, #f59e0b, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.42em; color: #f59e0b; }
h1 { font-size: 3rem; font-weight: 900; line-height: 0.95; margin: 0 0 0.5rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.srl { font-size: 1.8rem; background: linear-gradient(90deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 18px rgba(245,158,11,0.4)); }
.location { font-size: 0.78rem; color: #64748b; letter-spacing: 0.08em; font-weight: 400; margin-bottom: 1.2rem; display: block; }

/* KPI */
.kpi-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; padding: 1rem 1.4rem;
  background: rgba(15,23,42,0.6); border: 1px solid rgba(71,85,105,0.3); border-radius: 0.85rem;
  backdrop-filter: blur(14px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
.kpi { display: flex; flex-direction: column; align-items: center; flex: 1; }
.kpi-value { font-size: 1.2rem; font-weight: 900; letter-spacing: 0.08em; line-height: 1; }
.kpi-value.amber { color: #f59e0b; filter: drop-shadow(0 0 8px rgba(245,158,11,0.5)); }
.kpi-value.white { color: #e2e8f0; }
.kpi-value.cyan { color: #22d3ee; filter: drop-shadow(0 0 8px rgba(34,211,238,0.5)); }
.kpi-label { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.18em; color: #475569; margin-top: 0.3rem; text-align: center; }
.kpi-divider { width: 1px; height: 2.2rem; background: rgba(71,85,105,0.4); }

/* SERVICES */
.services { display: flex; flex-direction: column; gap: 0.75rem; }
.svc-card { display: flex; overflow: hidden; border-radius: 0.7rem; background: rgba(15,23,42,0.55);
  border: 1px solid rgba(71,85,105,0.3); backdrop-filter: blur(12px);
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
.svc-card:hover { border-color: rgba(245,158,11,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.4); transform: translateX(4px); }
.svc-accent { width: 3px; flex-shrink: 0; }
.svc-accent.amber { background: linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.15)); }
.svc-accent.cyan { background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.15)); }
.svc-body { padding: 0.65rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; }
.svc-title { font-size: 0.82rem; font-weight: 700; color: #e2e8f0; }
.svc-desc { font-size: 0.68rem; color: #64748b; font-weight: 300; line-height: 1.4; }

/* RIGHT */
.right { width: 45%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.map-glow { position: absolute; width: 380px; height: 380px; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%); filter: blur(50px); pointer-events: none; z-index: -1; }
.map-card { width: 100%; height: 100%; display: flex; flex-direction: column;
  background: rgba(15,23,42,0.7); border: 1px solid rgba(245,158,11,0.18); border-radius: 1.2rem;
  padding: 1.5rem 1.8rem; backdrop-filter: blur(16px);
  box-shadow: 0 0 0 1px rgba(245,158,11,0.06), 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04); }
.map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.map-badge { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; color: #f59e0b;
  padding: 0.2rem 0.6rem; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); border-radius: 50px; }
.map-region { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.16em; color: #475569; }

/* NETWORK */
.network { position: relative; flex: 1; min-height: 180px; }
.net-svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

/* Hub labels */
.hub-labels { position: absolute; top: 50%; left: 50%; transform: translate(-50%, 12px);
  display: flex; flex-direction: column; align-items: center; z-index: 2; }
.hub-name { font-size: 0.82rem; font-weight: 700; color: #f1f5f9; white-space: nowrap; }
.hub-tag { font-size: 0.48rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em;
  color: rgba(245,158,11,0.6); white-space: nowrap; margin-top: 2px; }

/* Depot labels */
.depot-labels { position: absolute; display: flex; flex-direction: column; align-items: center;
  transform: translateX(-50%); z-index: 2; gap: 2px; }
.depot-name { font-size: 0.72rem; color: #94a3b8; font-weight: 500; white-space: nowrap; }
.depot-type { font-size: 0.48rem; text-transform: uppercase; letter-spacing: 0.16em; color: #475569; }

.map-desc { font-size: 0.7rem; color: #64748b; font-weight: 300; line-height: 1.5; text-align: center;
  padding: 0.6rem 0.5rem 0; border-top: 1px solid rgba(71,85,105,0.25); margin: 0; }
</style>
