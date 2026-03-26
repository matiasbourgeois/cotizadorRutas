import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text } from '@mantine/core';
import {
  Printer, MapPin, Truck, Clock, CalendarDays, Route, Package,
  Repeat, Satellite, ShieldCheck, Headset, FileText, Navigation, AlertTriangle
} from 'lucide-react';
import MapaRuta from '../../components/MapaRuta';
import QRCode from 'qrcode';
import ShareFAB from '../../components/ShareFAB';
import './PropuestaPage.css';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
const $ = (n) => Math.round(n || 0).toLocaleString('es-AR');

const dur = (min) => {
  if (!min) return 'N/A';
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
};

const DIAS = { lunes:'Lun', martes:'Mar', miercoles:'Mié', jueves:'Jue', viernes:'Vie', sabado:'Sáb', domingo:'Dom' };

const freq = (f) => {
  if (!f) return 'No especificada';
  if (f.tipo === 'mensual') {
    const d = (f.diasSeleccionados||[]).map(x => DIAS[x]||x).join(' · ');
    const v = f.viajesPorDia > 1 ? ` (×${f.viajesPorDia}/día)` : '';
    return `Mensual${v}`;
  }
  const n = f.vueltasTotales || 1;
  return `Esporádico — ${n} ${n===1?'viaje':'viajes'}`;
};

const freqDias = (f) => {
  if (!f || f.tipo !== 'mensual') return '';
  return (f.diasSeleccionados||[]).map(x => DIAS[x]||x).join(' · ');
};

const carga = (d) => {
  if (!d) return 'General';
  const t = {general:'General', refrigerada:'Refrigerada', peligrosa:'Peligrosa'}[d.tipo] || 'General';
  const p = d.pesoKg ? ` · ${$(d.pesoKg)} kg` : '';
  return t + p;
};

const propId = (id, f) => `PROP-${new Date(f).getFullYear()}-${(id||'').slice(-4).toUpperCase()}`;

const plusDays = (f, n=15) => { const d = new Date(f); d.setDate(d.getDate()+n); return d.toLocaleDateString('es-AR'); };

const isRT = (pts) => {
  if (!pts || pts.length < 2) return false;
  const a = pts[0], b = pts.at(-1);
  if (!a?.lat || !b?.lat) return false;
  return Math.hypot(a.lat-b.lat, a.lng-b.lng) < 0.01;
};

const ruta = (pts) => {
  if (!pts || pts.length < 2) return 'Ruta no definida';
  const n = (p) => (p?.nombre||'').split('–')[0].trim() || '—';
  return `${n(pts[0])}  →  ${n(pts.at(-1))}`;
};

const splitName = (p) => {
  const [a,b] = String(p?.nombre??'').split('–');
  return { name: (a||'').trim(), addr: (b||'').trim() };
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PropuestaPage({ isPublic = false }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let p;
        if (isPublic) {
          const BE = import.meta.env.VITE_API_URL || 'http://localhost:5010';
          const res = await fetch(`${BE}/api/presupuestos/public/${id}`);
          if (!res.ok) throw new Error('No encontrado');
          p = await res.json();
        } else {
          const { data: d } = await clienteAxios.get(`/presupuestos/${id}`);
          p = d;
        }
        setData(p);
        if (p?.puntosEntrega?.length >= 2) {
          const pts = p.puntosEntrega;
          const o = `${pts[0].lat},${pts[0].lng}`;
          const d = `${pts.at(-1).lat},${pts.at(-1).lng}`;
          const w = pts.slice(1,-1).map(x=>`${x.lat},${x.lng}`).join('|');
          const url = `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}${w?`&waypoints=${w}`:''}`;
          QRCode.toDataURL(url, { width: 200, margin: 2, errorCorrectionLevel: 'H' })
            .then(u => setQr(u)).catch(() => {});
        }
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id, isPublic]);

  if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
  if (!data) return <Center h="100vh"><Text>Propuesta no encontrada.</Text></Center>;

  // ── Data ────────────────────────────────────────
  const e = data.empresa || {};
  const BE = import.meta.env.VITE_API_URL || 'http://localhost:5010';
  const logo = e.logoUrl ? `${BE}${e.logoUrl}` : '';
  const num = propId(data._id, data.fechaCreacion);
  const emis = new Date(data.fechaCreacion).toLocaleDateString('es-AR');
  const valid = plusDays(data.fechaCreacion);
  const validDate = new Date(data.fechaCreacion); validDate.setDate(validDate.getDate() + 15);
  const isExpired = new Date() > validDate;
  const round = isRT(data.puntosEntrega);
  const monthly = data.frecuencia?.tipo === 'mensual';
  const total = data.resumenCostos?.totalFinal || 0;
  const stops = data.puntosEntrega?.length || 0;
  const km = data.totalKilometros || 0;

  const perTrip = monthly
    ? Math.round(total / ((data.frecuencia?.diasSeleccionados?.length||1) * 4.33 * (data.frecuencia?.viajesPorDia||1)))
    : Math.round(total / (data.frecuencia?.vueltasTotales||1));
  const perKm = km > 0 ? Math.round(perTrip / km) : 0;

  // Service cards data
  const cards = [
    { ico: <Route size={16} />,        lbl: 'Recorrido',         val: ruta(data.puntosEntrega) },
    { ico: <Repeat size={16} />,       lbl: 'Modalidad',         val: round ? 'Ida y Vuelta' : 'Solo Ida' },
    { ico: <MapPin size={16} />,       lbl: 'Distancia',         val: `${km.toFixed(1)} km` },
    { ico: <Clock size={16} />,        lbl: 'Duración estimada', val: dur(data.duracionMin) },
    { ico: <Navigation size={16} />,   lbl: 'Paradas',           val: `${stops} puntos de entrega` },
    { ico: <Truck size={16} />,        lbl: 'Vehículo',          val: `${data.vehiculo?.datos?.marca||''} ${data.vehiculo?.datos?.modelo||''}`.trim() || '—' },
    { ico: <Package size={16} />,      lbl: 'Tipo de carga',     val: carga(data.detallesCarga) },
    { ico: <CalendarDays size={16} />, lbl: 'Frecuencia',        val: freq(data.frecuencia) },
  ];
  const dias = freqDias(data.frecuencia);
  if (dias) cards.push({ ico: <CalendarDays size={16} />, lbl: 'Días operativos', val: dias });

  // ── Sub-components ──────────────────────────────
  const Head = () => (
    <div className="pg-head">
      <div className="pg-head-brand">
        {logo && <img src={logo} alt="" className="pg-head-logo" onError={e => e.target.style.display = 'none'} />}
        <div>
          <div className="pg-head-name">{e.nombre || 'Mi Empresa'}</div>
          {e.slogan && <div className="pg-head-sub">{e.slogan}</div>}
        </div>
      </div>
      <div className="pg-head-badge">{num}</div>
    </div>
  );

  const Foot = ({ p, t }) => (
    <div className="pg-foot">
      <span>{e.nombre||'Mi Empresa'}{e.telefono ? ` · ${e.telefono}` : ''}{e.email ? ` · ${e.email}` : ''}</span>
      <span>Página {p} de {t}</span>
    </div>
  );

  // ═══════════════════════════════════════════════
  return (
    <div className="prop-root" style={{ '--c1': e.colorPrimario || '#1e3a5f', '--c2': e.colorAcento || '#0891b2' }}>
      <div className="prop-btn-area">
        <button className="prop-print-btn" onClick={() => window.print()}>
          <Printer size={18} />
          Imprimir / Guardar PDF
        </button>
      </div>

      <ShareFAB shareUrl={`/p/${id}`} cliente={data.cliente} empresa={e.nombre} />

      {/* ━━━━━━━━━━━ EXPIRED BANNER ━━━━━━━━━━━ */}
      {isExpired && (
        <div className="expired-banner">
          <div className="expired-banner-inner">
            <div className="expired-banner-icon"><AlertTriangle size={22} /></div>
            <div className="expired-banner-text">
              <div className="expired-banner-title">Esta propuesta ha vencido</div>
              <div className="expired-banner-sub">La cotización {num} venció el <strong>{valid}</strong>. Los precios pueden haber cambiado.{e.telefono ? ` Contacte a ${e.nombre || 'la empresa'} al ${e.telefono}` : ''}{e.email ? ` o a ${e.email}` : ''} para solicitar una cotización actualizada.</div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━ PAGE 1 · COVER ━━━━━━━━━━━ */}
      <div className="pg pg-cover">
        <div className="cover-accent-top" />
        <div className="cover-accent-left" />
        <div className="cover-main">
          {logo && <img src={logo} alt="Logo" className="cover-logo" onError={e => e.target.style.display = 'none'} />}
          <div className="cover-divider" />
          <h1 className="cover-h1">Propuesta de<br />Servicio Logístico</h1>
          <div className="cover-divider" />
          <p className="cover-prep">Preparado para</p>
          <p className="cover-client-name">{data.cliente || 'Cliente no especificado'}</p>
        </div>
        <div className="cover-footer">
          <div>
            <div><strong>{num}</strong></div>
            <div>Emisión: {emis}</div>
            <div>Válida hasta: <strong>{valid}</strong></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div><strong>{e.nombre || ''}</strong></div>
            {e.cuit && <div>CUIT {e.cuit}</div>}
            {e.direccion && <div>{e.direccion}</div>}
            {e.ciudad && <div>{e.ciudad}</div>}
            {e.telefono && <div>Tel: {e.telefono}</div>}
            {e.email && <div>{e.email}</div>}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━ PAGE 2 · DETALLE + COTIZACIÓN ━━━━━━━━━━━ */}
      <div className="pg">
        <Head />
        <div className="pg-inner">
          <h2 className="st">Detalle del Servicio</h2>

          <div className="svc-grid">
            {cards.map((c, i) => (
              <div className="svc-card" key={i}>
                <div className="svc-card-icon">{c.ico}</div>
                <div>
                  <div className="svc-card-label">{c.lbl}</div>
                  <div className="svc-card-value">{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="price-hero">
            <div className="price-hero-label">{monthly ? 'Cotización Mensual' : 'Cotización del Servicio'}</div>
            <div className="price-hero-amount">${$(total)}</div>
            <div className="price-hero-note">Pesos Argentinos · Sin IVA</div>
            <div className="price-stats">
              <div><div className="price-stat-val">${$(perTrip)}</div><div className="price-stat-label">Por viaje</div></div>
              <div><div className="price-stat-val">${$(perKm)}</div><div className="price-stat-label">Por km</div></div>
              <div><div className="price-stat-val">{stops}</div><div className="price-stat-label">Paradas</div></div>
              <div><div className="price-stat-val">{km.toFixed(0)} km</div><div className="price-stat-label">Recorrido</div></div>
            </div>
          </div>

          <div className="benefits">
            <div className="benefit"><span className="benefit-dot"><Satellite size={13} /></span>Seguimiento GPS 24/7</div>
            <div className="benefit"><span className="benefit-dot"><ShieldCheck size={13} /></span>Carga Asegurada</div>
            <div className="benefit"><span className="benefit-dot"><Headset size={13} /></span>Atención Directa</div>
          </div>

          <div className="validity">
            Esta cotización tiene validez hasta el <strong>{valid}</strong> · {num}
          </div>
        </div>
        <Foot p={2} t={3} />
      </div>

      {/* ━━━━━━━━━━━ PAGE 3 · MAPA + ITINERARIO + CONDICIONES ━━━━━━━━━━━ */}
      <div className="pg">
        <Head />
        <div className="pg-inner">
          <h2 className="st">Recorrido de la Operación</h2>
          <div className="map-wrap">
            <MapaRuta puntos={data.puntosEntrega} onRutaCalculada={() => {}} />
          </div>

          <h2 className="st">Itinerario de Entrega</h2>
          <div className="route-list">
            {data.puntosEntrega.map((pt, i) => {
              const { name, addr } = splitName(pt);
              const first = i === 0;
              const last  = i === stops - 1;
              const cls = first ? ' route-item--origin' : last ? ' route-item--dest' : '';
              return (
                <div className={`route-item${cls}`} key={i}>
                  <div className="route-item-num">{i + 1}</div>
                  <div className="route-item-info">
                    <div className="route-item-name">{name || '—'}</div>
                    {addr && <div className="route-item-addr">{addr}</div>}
                  </div>
                  {first && <div className="route-item-tag">Origen</div>}
                  {last  && <div className="route-item-tag">Destino</div>}
                </div>
              );
            })}
          </div>

          <div className="info-strip">
            {qr && (
              <div className="qr-card">
                <img src={qr} alt="QR" />
                <div>
                  <div className="qr-card-title">Ver recorrido en tu móvil</div>
                  <div className="qr-card-sub">Escaneá para abrir en Google Maps</div>
                </div>
              </div>
            )}
            <div className="stats-card">
              <div className="stat-item"><div className="stat-val">{km.toFixed(0)} km</div><div className="stat-lbl">Distancia</div></div>
              <div className="stat-div" />
              <div className="stat-item"><div className="stat-val">{dur(data.duracionMin)}</div><div className="stat-lbl">Duración</div></div>
              <div className="stat-div" />
              <div className="stat-item"><div className="stat-val">{stops}</div><div className="stat-lbl">Paradas</div></div>
            </div>
          </div>

          <div className="terms-card">
            <h4><FileText size={12} />Condiciones Generales</h4>
            <p>{data.terminos || 'Validez de la cotización: 15 días corridos desde la fecha de emisión.\nLos valores expresados no incluyen IVA.\nCondiciones de pago a convenir entre las partes.'}</p>
          </div>

          <div className="sigs-row">
            <div className="sig-block"><hr className="sig-line" /><div className="sig-label">Firma por {e.nombre || 'La Empresa'}</div></div>
            <div className="sig-block"><hr className="sig-line" /><div className="sig-label">Firma y Aclaración del Cliente</div></div>
          </div>
        </div>
        <Foot p={3} t={3} />
      </div>
    </div>
  );
}
