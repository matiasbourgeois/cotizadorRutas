<template>
  <div class="fixed top-0 left-0 w-screen h-screen pointer-events-none" style="z-index: -999; background-color: #06101a;">
    <!-- Particle network canvas -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    <!-- Ambient glow -->
    <div class="absolute inset-0" style="background: radial-gradient(circle at 35% 50%, rgba(34,211,238,0.06) 0%, transparent 65%);"></div>
    <!-- Tech grid -->
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0); background-size: 44px 44px;"></div>
  </div>

  <!-- Slide counter -->
  <div v-if="page > 1 && page < total" class="slide-counter">
    <div class="counter-accent"></div>
    <span class="counter-current">{{ page }}</span>
    <span class="counter-sep">/</span>
    <span class="counter-total">{{ total }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total: navTotal } = useNav()
const page = computed(() => currentPage.value)
const total = computed(() => navTotal.value)

const canvasRef = ref(null)
let animId = null
let onResize = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  let W = canvas.width  = window.innerWidth
  let H = canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')

  // Match Slide 1 particle quality
  const N = 70
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.14,
    alpha: Math.random() * 0.5 + 0.1,
    cyan: Math.random() > 0.78
  }))

  const MAX_DIST = 120

  const draw = () => {
    ctx.clearRect(0, 0, W, H)

    // Draw connections
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12
          ctx.beginPath()
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.cyan
        ? `rgba(34,211,238,${p.alpha})`
        : `rgba(148,163,184,${p.alpha * 0.6})`
      ctx.fill()

      p.x += p.vx
      p.y += p.vy
      if (p.x < -10) p.x = W + 10
      if (p.x > W + 10) p.x = -10
      if (p.y < -10) p.y = H + 10
      if (p.y > H + 10) p.y = -10
    })

    animId = requestAnimationFrame(draw)
  }

  // Handle resize
  onResize = () => {
    W = canvas.width  = window.innerWidth
    H = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  draw()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<style>
.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* ═══ SLIDE COUNTER ═══ */
.slide-counter {
  position: fixed;
  bottom: 0.6rem;
  right: 1.5rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.25rem 0.65rem 0.25rem 0.55rem;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(71, 85, 105, 0.15);
  border-radius: 50px;
  backdrop-filter: blur(12px);
  pointer-events: none;
  font-family: 'Inter', sans-serif;
}

.counter-accent {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #22d3ee, rgba(99, 102, 241, 0.6));
  margin-right: 0.3rem;
  flex-shrink: 0;
}

.counter-current {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1;
  letter-spacing: 0.02em;
}

.counter-sep {
  font-size: 0.6rem;
  font-weight: 300;
  color: #475569;
  line-height: 1;
  margin: 0 0.05rem;
}

.counter-total {
  font-size: 0.6rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1;
  letter-spacing: 0.02em;
}
</style>
