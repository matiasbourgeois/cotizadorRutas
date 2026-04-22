<template>
  <div class="vehicle-slide">

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
        Costos de<br>Vehículo
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        El servicio procesa las variables de <strong>rendimiento, desgaste y costos fijos</strong> de cada unidad para calcular su costo operativo total.
      </p>

      <!-- Vehicle types -->
      <div class="types" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:600}}">
        <span class="types-label">Tipos de vehículo configurados</span>
        <div class="types-grid">
          <div class="type-chip"><div class="chip-dot"></div>Utilitario</div>
          <div class="type-chip"><div class="chip-dot"></div>Mediano</div>
          <div class="type-chip"><div class="chip-dot"></div>Grande</div>
          <div class="type-chip"><div class="chip-dot"></div>Camión</div>
        </div>
      </div>

      <!-- Proration logic -->
      <div class="logic-card" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="logic-accent"></div>
        <div class="logic-body">
          <span class="logic-title">Prorrateo por tiempo de ocupación</span>
          <p>Los costos fijos se asignan según la <strong>duración del viaje</strong>: viajes cortos reciben una fracción proporcional, viajes largos absorben el 100% del costo diario</p>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN: 3 Groups -->
    <div class="right">

      <!-- GROUP 1: RENDIMIENTO -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent amber"></div>
          <div class="group-glow amber"></div>
          <div class="group-header">
            <div class="group-icon amber">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 12h2l3-8 4 16 3-8h6" fill="none" stroke="#fbbf24" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Costos de Combustible</span>
              <span class="group-sub">Consumo por kilómetro recorrido</span>
            </div>
          </div>
          <div class="group-items">
            <div class="item">
              <div class="item-dot amber"></div>
              <div class="item-content">
                <span class="item-name">Consumo de combustible</span>
                <span class="item-detail">Precio por litro y rendimiento km/l</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot amber"></div>
              <div class="item-content">
                <span class="item-name">GNC</span>
                <span class="item-detail">Factor de rendimiento alternativo</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot amber"></div>
              <div class="item-content">
                <span class="item-name">Carga refrigerada</span>
                <span class="item-detail">Recargo sobre el costo de combustible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GROUP 2: DESGASTE -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent orange"></div>
          <div class="group-glow orange"></div>
          <div class="group-header">
            <div class="group-icon orange">
              <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" fill="none" stroke="#fb923c" stroke-width="1"/><path d="M12 6v6l4 2" fill="none" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Desgaste</span>
              <span class="group-sub">Amortización por uso del vehículo</span>
            </div>
          </div>
          <div class="group-items">
            <div class="item">
              <div class="item-dot orange"></div>
              <div class="item-content">
                <span class="item-name">Depreciación del vehículo</span>
                <span class="item-detail">Valor nuevo menos residual, dividido vida útil en km</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot orange"></div>
              <div class="item-content">
                <span class="item-name">Desgaste de cubiertas</span>
                <span class="item-detail">Precio por cantidad, amortizado por vida útil en km</span>
              </div>
            </div>
            <div class="item">
              <div class="item-dot orange"></div>
              <div class="item-content">
                <span class="item-name">Cambio de aceite</span>
                <span class="item-detail">Precio del servicio amortizado por intervalo en km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GROUP 3: COSTOS FIJOS -->
      <div class="group" v-click v-motion :initial="{opacity:0,y:20,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="group-card">
          <div class="group-accent blue"></div>
          <div class="group-glow blue"></div>
          <div class="group-header">
            <div class="group-icon blue">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#60a5fa" stroke-width="1.2"/></svg>
            </div>
            <div class="group-titles">
              <span class="group-name">Costos Fijos</span>
              <span class="group-sub">Prorrateados según duración del viaje</span>
            </div>
          </div>
          <div class="group-items horizontal">
            <div class="fixed-tag">Mantenimiento preventivo</div>
            <div class="fixed-tag">Seguro</div>
            <div class="fixed-tag">Patente municipal</div>
            <div class="fixed-tag">Rentas provincia</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.vehicle-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  padding: 1.6rem 3.5rem 1.6rem 4.5rem;
  gap: 2.5rem;
  overflow: hidden;
}

.ambient-glow { position: absolute; filter: blur(60px); pointer-events: none; z-index: 0; border-radius: 50%; }
.a1 { top: 10%; right: 15%; width: 300px; height: 250px; background: radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%); }
.a2 { bottom: 15%; right: 35%; width: 250px; height: 200px; background: radial-gradient(ellipse, rgba(251,146,60,0.04) 0%, transparent 70%); }
.a3 { bottom: 25%; left: 25%; width: 250px; height: 200px; background: radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%); }


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
.tag-bar { width: 3rem; height: 2px; background: linear-gradient(90deg, #fbbf24, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.38em; color: #fbbf24; }

h1 {
  font-size: 2.2rem; font-weight: 900; line-height: 1.12; margin: 0 0 0.6rem 0;
  background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.desc { font-size: 0.6rem; color: #64748b; font-weight: 300; line-height: 1.55; margin-bottom: 1rem; padding-left: 0.8rem; border-left: 2px solid rgba(245,158,11,0.35); }
.desc strong { color: #fbbf24; font-weight: 600; }

/* Vehicle types */
.types { margin-bottom: 0.7rem; }
.types-label { font-size: 0.48rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #475569; display: block; margin-bottom: 0.25rem; }
.types-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem; }
.type-chip {
  font-size: 0.50rem; color: #94a3b8; font-weight: 500; padding: 0.18rem 0.4rem;
  background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.18);
  border-radius: 0.3rem; display: flex; align-items: center; gap: 0.3rem;
  transition: border-color 0.3s, transform 0.2s;
}
.type-chip:hover { border-color: rgba(245,158,11,0.4); transform: translateX(3px); }
.chip-dot { width: 4px; height: 4px; border-radius: 50%; background: #fbbf24; flex-shrink: 0; }

/* Logic card */
.logic-card { display: flex; overflow: hidden; border-radius: 0.5rem; background: rgba(59,130,246,0.04); border: 1px solid rgba(59,130,246,0.18); }
.logic-accent { width: 3px; flex-shrink: 0; background: linear-gradient(to bottom, #3b82f6, rgba(59,130,246,0.15)); }
.logic-body { padding: 0.35rem 0.55rem; }
.logic-title { font-size: 0.50rem; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.1rem; }
.logic-body p { font-size: 0.50rem; color: #64748b; font-weight: 300; line-height: 1.4; margin: 0; }
.logic-body strong { color: #60a5fa; font-weight: 600; }

/* ═══ RIGHT ═══ */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

/* Group */
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
.group-accent.amber { background: linear-gradient(to bottom, #fbbf24, rgba(245,158,11,0.2)); }
.group-accent.orange { background: linear-gradient(to bottom, #fb923c, rgba(251,146,60,0.2)); }
.group-accent.blue { background: linear-gradient(to bottom, #60a5fa, rgba(59,130,246,0.2)); }

/* Glow */
.group-glow { position: absolute; top: -20px; right: -10px; width: 120px; height: 80px; border-radius: 50%; filter: blur(28px); pointer-events: none; }
.group-glow.amber { background: rgba(245,158,11,0.06); }
.group-glow.orange { background: rgba(251,146,60,0.06); }
.group-glow.blue { background: rgba(59,130,246,0.06); }

/* Header */
.group-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem; }
.group-icon {
  width: 28px; height: 28px; border-radius: 0.4rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.group-icon.amber { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); }
.group-icon.orange { background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.25); }
.group-icon.blue { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); }

.group-titles { display: flex; flex-direction: column; }
.group-name { font-size: 0.72rem; font-weight: 800; color: #e2e8f0; line-height: 1.1; }
.group-sub { font-size: 0.46rem; color: #64748b; font-weight: 400; }

/* Items */
.group-items { display: flex; flex-direction: column; gap: 0.15rem; padding-left: 0.3rem; }
.item {
  display: flex; align-items: flex-start; gap: 0.35rem;
  padding: 0.2rem 0.35rem; border-radius: 0.3rem;
  transition: background 0.2s;
}
.item:hover { background: rgba(255,255,255,0.02); }

.item-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem; }
.item-dot.amber { background: rgba(245,158,11,0.5); }
.item-dot.orange { background: rgba(251,146,60,0.5); }

.item-content { display: flex; flex-direction: column; }
.item-name { font-size: 0.58rem; font-weight: 700; color: #cbd5e1; }
.item-detail { font-size: 0.48rem; color: #64748b; font-weight: 300; }

/* Fixed costs horizontal tags */
.group-items.horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding-left: 0;
}
.fixed-tag {
  font-size: 0.50rem; color: #94a3b8; font-weight: 500;
  padding: 0.15rem 0.45rem;
  background: rgba(59,130,246,0.06);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 0.3rem;
  transition: border-color 0.3s, transform 0.2s;
}
.fixed-tag:hover { border-color: rgba(59,130,246,0.4); transform: translateY(-1px); }
</style>
