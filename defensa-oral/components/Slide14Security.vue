<template>
  <div class="security-slide">

    <div class="ambient a1"></div>
    <div class="ambient a2"></div>
    <div class="ambient a3"></div>
    <!-- LEFT COLUMN -->
    <div class="left">

      <div class="tag-row" v-motion :initial="{opacity:0,x:-30}" :enter="{opacity:1,x:0,transition:{duration:700}}">
        <div class="tag-bar"></div>
        <span class="tag-text">Análisis de Seguridad</span>
      </div>

      <h1 v-motion :initial="{opacity:0,y:36}" :enter="{opacity:1,y:0,transition:{duration:1000,delay:150}}">
        Seguridad
      </h1>

      <p class="desc" v-motion :initial="{opacity:0}" :enter="{opacity:1,transition:{duration:700,delay:300}}">
        Arquitectura de seguridad en <strong>tres capas de protección</strong> que garantiza la integridad, confidencialidad y disponibilidad de la información.
      </p>

      <!-- Security Flow Diagram -->
      <div class="flow-diagram" v-click v-motion :initial="{opacity:0,y:14}" :enter="{opacity:1,y:0,transition:{duration:800}}">
        <span class="flow-label">Flujo de autenticación</span>
        <div class="flow-chain">
          <div class="flow-node">
            <div class="fnode-icon">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" fill="none" stroke="#22d3ee" stroke-width="1.3"/><circle cx="8.5" cy="7" r="4" fill="none" stroke="#22d3ee" stroke-width="1.3"/><path d="M20 8v6M23 11h-6" fill="none" stroke="#22d3ee" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
            <span>Registro</span>
          </div>
          <div class="flow-connector"><div class="fc-line"></div><div class="fc-dot"></div></div>
          <div class="flow-node">
            <div class="fnode-icon">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="#34d399" stroke-width="1.3"/><polyline points="22,6 12,13 2,6" fill="none" stroke="#34d399" stroke-width="1.3"/></svg>
            </div>
            <span>Email</span>
          </div>
          <div class="flow-connector"><div class="fc-line"></div><div class="fc-dot"></div></div>
          <div class="flow-node">
            <div class="fnode-icon">
              <svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="#fbbf24" stroke-width="1.3"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="#fbbf24" stroke-width="1.3"/></svg>
            </div>
            <span>Login</span>
          </div>
          <div class="flow-connector"><div class="fc-line"></div><div class="fc-dot"></div></div>
          <div class="flow-node">
            <div class="fnode-icon">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zM15.5 8.5L19 5" fill="none" stroke="#f97316" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
            <span>JWT</span>
          </div>
          <div class="flow-connector"><div class="fc-line"></div><div class="fc-dot"></div></div>
          <div class="flow-node final">
            <div class="fnode-icon final-icon">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#a78bfa" stroke-width="1.3"/><path d="M9 12l2 2 4-4" fill="none" stroke="#a78bfa" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span>API Protegida</span>
          </div>
        </div>
      </div>

      <!-- OAuth alt -->
      <div class="oauth-card" v-click v-motion :initial="{opacity:0,y:10}" :enter="{opacity:1,y:0,transition:{duration:500}}">
        <div class="oauth-accent"></div>
        <div class="oauth-body">
          <span class="oauth-title">Ruta alternativa</span>
          <p>OAuth 2.0 con <strong>Google</strong> como método de autenticación social — el usuario omite registro y verificación</p>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN -->
    <div class="right">

      <!-- Layer 1: Autenticación -->
      <div class="layer-card" v-click v-motion :initial="{opacity:0,y:24,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="layer-glow cyan"></div>
        <div class="layer-accent cyan"></div>
        <div class="layer-header">
          <div class="layer-icon cyan">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#22d3ee" stroke-width="1.2"/></svg>
          </div>
          <div class="layer-titles">
            <span class="layer-name">Autenticación</span>
            <span class="layer-sub">Capa exterior · Control de acceso</span>
          </div>
        </div>
        <div class="layer-items">
          <div class="item"><div class="item-dot cyan"></div><div class="item-content"><span class="item-name">Bcrypt.js</span><span class="item-detail">Hashing irreversible con salt de 10 rondas</span></div></div>
          <div class="item"><div class="item-dot cyan"></div><div class="item-content"><span class="item-name">Complejidad de contraseña</span><span class="item-detail">8+ caracteres, mayúsculas, números obligatorios</span></div></div>
          <div class="item"><div class="item-dot cyan"></div><div class="item-content"><span class="item-name">Bloqueo automático</span><span class="item-detail">Cuenta bloqueada tras intentos fallidos consecutivos</span></div></div>
          <div class="item"><div class="item-dot cyan"></div><div class="item-content"><span class="item-name">Mensajes genéricos</span><span class="item-detail">No revela si el email existe o no en el sistema</span></div></div>
        </div>
      </div>

      <!-- Layer 2: Verificación y Sesión -->
      <div class="layer-card" v-click v-motion :initial="{opacity:0,y:24,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="layer-glow emerald"></div>
        <div class="layer-accent emerald"></div>
        <div class="layer-header">
          <div class="layer-icon emerald">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" fill="none" stroke="#34d399" stroke-width="1.2"/><path d="M22 4L12 14.01l-3-3" fill="none" stroke="#34d399" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="layer-titles">
            <span class="layer-name">Verificación y Sesión</span>
            <span class="layer-sub">Capa media · Identidad y persistencia</span>
          </div>
        </div>
        <div class="layer-items">
          <div class="item"><div class="item-dot emerald"></div><div class="item-content"><span class="item-name">Verificación de email</span><span class="item-detail">Token criptográfico de 32 bytes con expiración de 24h</span></div></div>
          <div class="item"><div class="item-dot emerald"></div><div class="item-content"><span class="item-name">JSON Web Tokens</span><span class="item-detail">Sesiones stateless con firma digital y expiración</span></div></div>
          <div class="item"><div class="item-dot emerald"></div><div class="item-content"><span class="item-name">Recuperación de contraseña</span><span class="item-detail">Flujo seguro con token de uso único, expira en 1 hora</span></div></div>
        </div>
      </div>

      <!-- Layer 3: Respaldo de Datos -->
      <div class="layer-card" v-click v-motion :initial="{opacity:0,y:24,scale:0.97}" :enter="{opacity:1,y:0,scale:1,transition:{duration:700}}">
        <div class="layer-glow violet"></div>
        <div class="layer-accent violet"></div>
        <div class="layer-header">
          <div class="layer-icon violet">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="#a78bfa" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="layer-titles">
            <span class="layer-name">Respaldo de Datos</span>
            <span class="layer-sub">Capa interna · Estrategia de triple capa</span>
          </div>
        </div>
        <div class="layer-items backup">
          <div class="backup-tag"><span class="btag-num">1</span><span class="btag-text">Respaldo lógico diario</span><span class="btag-detail">mongodump · 2:00 AM</span></div>
          <div class="backup-tag"><span class="btag-num">2</span><span class="btag-text">Copia externa en la nube</span><span class="btag-detail">Google Drive</span></div>
          <div class="backup-tag"><span class="btag-num">3</span><span class="btag-text">Snapshot semanal completo</span><span class="btag-detail">Hostinger VPS</span></div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.security-slide {
  position: absolute; inset: 0;
  display: flex; align-items: stretch;
  padding: 1.6rem 3.5rem 1.6rem 4.5rem;
  gap: 2.5rem; overflow: hidden;
}

.ambient { position: absolute; filter: blur(70px); pointer-events: none; z-index: 0; border-radius: 50%; }
.a1 { top: 10%; left: 10%; width: 300px; height: 260px; background: radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 65%); }
.a2 { bottom: 15%; right: 20%; width: 280px; height: 240px; background: radial-gradient(ellipse, rgba(52,211,153,0.04) 0%, transparent 65%); }
.a3 { bottom: 25%; left: 35%; width: 260px; height: 220px; background: radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 65%); }

/* ═══ LEFT ═══ */
.left { width: 32%; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 1; flex-shrink: 0; }
.tag-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
.tag-bar { width: 3rem; height: 2px; background: linear-gradient(90deg, #22d3ee, transparent); flex-shrink: 0; }
.tag-text { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.38em; color: #22d3ee; }

h1 { font-size: 2.6rem; font-weight: 900; line-height: 1.12; margin: 0 0 0.6rem 0; padding-bottom: 0.15rem; background: linear-gradient(145deg, #ffffff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.desc { font-size: 0.6rem; color: #64748b; font-weight: 300; line-height: 1.55; margin-bottom: 0.8rem; padding-left: 0.8rem; border-left: 2px solid rgba(34,211,238,0.35); }
.desc strong { color: #22d3ee; font-weight: 600; }

/* ═══ FLOW DIAGRAM ═══ */
.flow-diagram { margin-bottom: 0.7rem; }
.flow-label { font-size: 0.48rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #475569; display: block; margin-bottom: 0.3rem; }

.flow-chain {
  display: flex; align-items: center; flex-wrap: wrap;
  gap: 0.08rem;
  padding: 0.4rem 0.5rem;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(71,85,105,0.2);
  border-radius: 0.5rem;
  backdrop-filter: blur(12px);
}

.flow-node {
  display: flex; flex-direction: column; align-items: center; gap: 0.08rem;
}
.fnode-icon {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(34,211,238,0.06);
  border: 1px solid rgba(34,211,238,0.15);
  transition: transform 0.2s, border-color 0.3s;
}
.fnode-icon:hover { transform: scale(1.1); }
.flow-node:nth-child(3) .fnode-icon { background: rgba(52,211,153,0.06); border-color: rgba(52,211,153,0.15); }
.flow-node:nth-child(5) .fnode-icon { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.15); }
.flow-node:nth-child(7) .fnode-icon { background: rgba(249,115,22,0.06); border-color: rgba(249,115,22,0.15); }
.flow-node.final .fnode-icon { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.25); }

.flow-node span { font-size: 0.34rem; font-weight: 600; color: #64748b; }
.flow-node.final span { color: #a78bfa; font-weight: 700; }

.flow-connector { display: flex; align-items: center; padding: 0 0.05rem; margin-bottom: 0.6rem; }
.fc-line { width: 12px; height: 1px; background: rgba(71,85,105,0.4); }
.fc-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(71,85,105,0.5); }

/* OAuth */
.oauth-card { display: flex; overflow: hidden; border-radius: 0.5rem; background: rgba(99,102,241,0.04); border: 1px solid rgba(99,102,241,0.18); }
.oauth-accent { width: 3px; flex-shrink: 0; background: linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.15)); }
.oauth-body { padding: 0.35rem 0.55rem; }
.oauth-title { font-size: 0.48rem; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.08rem; }
.oauth-body p { font-size: 0.48rem; color: #64748b; font-weight: 300; line-height: 1.4; margin: 0; }
.oauth-body strong { color: #6366f1; font-weight: 600; }

/* ═══ RIGHT ═══ */
.right { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.45rem; position: relative; z-index: 1; }

/* Layer cards */
.layer-card { position: relative; padding: 0.5rem 0.7rem; background: rgba(15,23,42,0.65); border: 1px solid rgba(71,85,105,0.2); border-radius: 0.65rem; backdrop-filter: blur(12px); box-shadow: 0 6px 24px rgba(0,0,0,0.2); overflow: hidden; transition: border-color 0.3s, transform 0.3s; }
.layer-card:hover { transform: translateY(-2px); }

.layer-accent { position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }
.layer-accent.cyan { background: linear-gradient(to bottom, #22d3ee, rgba(34,211,238,0.2)); }
.layer-accent.emerald { background: linear-gradient(to bottom, #34d399, rgba(52,211,153,0.2)); }
.layer-accent.violet { background: linear-gradient(to bottom, #a78bfa, rgba(139,92,246,0.2)); }

.layer-glow { position: absolute; top: -20px; right: -10px; width: 120px; height: 80px; border-radius: 50%; filter: blur(28px); pointer-events: none; }
.layer-glow.cyan { background: rgba(34,211,238,0.06); }
.layer-glow.emerald { background: rgba(52,211,153,0.06); }
.layer-glow.violet { background: rgba(139,92,246,0.06); }

.layer-header { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem; }
.layer-icon { width: 28px; height: 28px; border-radius: 0.4rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.layer-icon.cyan { background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.25); }
.layer-icon.emerald { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); }
.layer-icon.violet { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); }
.layer-titles { display: flex; flex-direction: column; }
.layer-name { font-size: 0.72rem; font-weight: 800; color: #e2e8f0; line-height: 1.1; }
.layer-sub { font-size: 0.46rem; color: #64748b; font-weight: 400; }

/* Items */
.layer-items { display: flex; flex-direction: column; gap: 0.1rem; padding-left: 0.3rem; }
.item { display: flex; align-items: flex-start; gap: 0.35rem; padding: 0.15rem 0.35rem; border-radius: 0.3rem; transition: background 0.2s; }
.item:hover { background: rgba(255,255,255,0.02); }
.item-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 0.22rem; }
.item-dot.cyan { background: rgba(34,211,238,0.5); }
.item-dot.emerald { background: rgba(52,211,153,0.5); }
.item-content { display: flex; flex-direction: column; }
.item-name { font-size: 0.58rem; font-weight: 700; color: #cbd5e1; }
.item-detail { font-size: 0.48rem; color: #64748b; font-weight: 300; }

/* Backup horizontal tags */
.layer-items.backup { flex-direction: column; gap: 0.12rem; padding-left: 0; }
.backup-tag {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  background: rgba(139,92,246,0.05);
  border: 1px solid rgba(139,92,246,0.18);
  border-radius: 0.3rem;
  transition: border-color 0.3s, transform 0.2s;
}
.backup-tag:hover { border-color: rgba(139,92,246,0.4); transform: translateX(3px); }
.btag-num {
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.36rem; font-weight: 900; color: #a78bfa;
  background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3);
}
.btag-text { font-size: 0.52rem; font-weight: 600; color: #c4b5fd; }
.btag-detail { font-size: 0.42rem; color: #64748b; font-weight: 300; margin-left: auto; }
</style>
