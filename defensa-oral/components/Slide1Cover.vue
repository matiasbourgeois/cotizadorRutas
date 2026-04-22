<template>
  <div class="cover">


    <!-- COLUMNA IZQUIERDA -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{ opacity:0, x:-30 }" :enter="{ opacity:1, x:0, transition:{ duration:800 } }">
        <div class="tag-line cyan"></div>
        <span class="tag-text cyan">Defensa Oral · TFG · Ingeniería de Software</span>
      </div>

      <div class="hero-title" v-motion :initial="{ opacity:0, y:40 }" :enter="{ opacity:1, y:0, transition:{ duration:1000, delay:200 } }">
        <span class="grad-white">Sistema de</span>
        <span class="grad-white">Cotización</span>
        <span class="neon-cyan">Inteligente</span>
      </div>

      <p class="desc" v-motion :initial="{ opacity:0 }" :enter="{ opacity:1, transition:{ duration:1000, delay:600 } }">
        Sistema de gestión para la cotización de transporte<br>terrestre de carga dedicada.
      </p>

      <div class="footer" v-motion :initial="{ opacity:0, y:10 }" :enter="{ opacity:1, y:0, transition:{ duration:900, delay:1000 } }">
        <div class="footer-item">
          <span class="footer-label cyan">Alumno</span>
          <span class="footer-value">Matias F. Bourgeois</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-item">
          <span class="footer-label slate">Tutor de TFG</span>
          <span class="footer-value">Jorge H. Cassi</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-item">
          <span class="footer-label slate">Institución</span>
          <span class="footer-value">Universidad Siglo 21</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-item">
          <span class="footer-label slate">Fecha</span>
          <span class="footer-value">Abril 2026</span>
        </div>
      </div>

    </div>

    <!-- COLUMNA DERECHA: Logo SVG -->
    <div class="right">
      <div class="aura"></div>
      <div class="aura aura-2"></div>
      <img
        src="/quotargo.svg"
        alt="Logo"
        class="pin"
        v-motion
        :initial="{ opacity:0, scale:0.05, y:-60 }"
        :enter="{ opacity:1, scale:1, y:0, transition:{ duration:1300, type:'spring', bounce:0.38, delay:300 } }"
      />
      <div class="floor-glow" v-motion :initial="{ opacity:0 }" :enter="{ opacity:1, transition:{ duration:800, delay:1000 } }"></div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.cover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5rem;
  overflow: hidden;
  background:
    radial-gradient(ellipse 55% 70% at 68% 42%, rgba(34,211,238,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 10% 80%, rgba(2,132,199,0.05) 0%, transparent 60%);
}

.left {
  width: 57%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.right {
  width: 38%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* TAG */
.tag-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.6rem;
  opacity: 0.9;
}
.tag-line {
  width: 4rem;
  height: 2px;
}
.tag-line.cyan { background: linear-gradient(90deg, #22d3ee, transparent); }
.tag-text {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.42em;
  font-weight: 700;
}
.tag-text.cyan { color: #22d3ee; }

/* HERO TITLE */
.hero-title {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.6rem;
}
.grad-white {
  font-size: 3.6rem;
  font-weight: 900;
  line-height: 1.0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.neon-cyan {
  font-size: 4.4rem;
  font-weight: 900;
  line-height: 1.15;
  padding-top: 0.1em;
  background: linear-gradient(90deg, #22d3ee 0%, #0ea5e9 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 32px rgba(34,211,238,0.45));
  white-space: nowrap;
}

/* DESC */
.desc {
  font-size: 0.96rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.65;
  letter-spacing: 0.025em;
  padding-left: 1.4rem;
  border-left: 2px solid rgba(34,211,238,0.25);
  max-width: 36rem;
  margin-bottom: 3.2rem;
}

/* FOOTER */
.footer {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.footer-item {
  display: flex;
  flex-direction: column;
}
.footer-label {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  margin-bottom: 0.2rem;
}
.footer-label.cyan  { color: #22d3ee; }
.footer-label.slate { color: #64748b; }
.footer-value {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  letter-spacing: 0.02em;
}
.footer-divider {
  width: 1px;
  height: 1.75rem;
  background: rgba(71,85,105,0.45);
}

/* LOGO */
.aura {
  position: absolute;
  width: 380px;
  height: 380px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 68%);
  filter: blur(35px);
  z-index: -1;
  pointer-events: none;
  animation: breathe 5s ease-in-out infinite;
}
.aura-2 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%);
  animation-delay: 2.5s;
}
@keyframes breathe {
  0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
  50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.15); }
}

.pin {
  width: 240px;
  height: auto;
  animation: hover-pin 6s cubic-bezier(0.4,0,0.2,1) infinite;
  transform-origin: center bottom;
  position: relative;
  z-index: 1;
}
@keyframes hover-pin {
  0%, 100% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 16px 28px rgba(34,211,238,0.30));
  }
  50% {
    transform: translateY(-18px) scale(1.02);
    filter: drop-shadow(0 28px 60px rgba(34,211,238,0.60));
  }
}
.floor-glow {
  width: 130px;
  height: 16px;
  margin-top: 2.8rem;
  background: radial-gradient(ellipse at center, rgba(34,211,238,0.9) 0%, transparent 68%);
  border-radius: 50%;
  animation: pulse 6s cubic-bezier(0.4,0,0.2,1) infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1);   opacity: 0.4; }
  50%       { transform: scale(0.6); opacity: 0.1; }
}
</style>
