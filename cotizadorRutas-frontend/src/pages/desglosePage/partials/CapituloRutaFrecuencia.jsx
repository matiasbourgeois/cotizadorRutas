import { useEffect, useState } from 'react';
import MapaRuta from '../../../components/MapaRuta';
import QRCode from 'qrcode';
import { MapPin, Calendar, Repeat, Clock, Navigation, Package } from 'lucide-react';

const splitName = pt => {
  if (!pt?.nombre) return { name: '', addr: '' };
  const parts = pt.nombre.split('–');
  return { name: parts[0]?.trim(), addr: parts[1]?.trim() || '' };
};

const CapituloRutaFrecuencia = ({ data, Head, Foot }) => {
  const [qr, setQr] = useState('');
  const stops = data.puntosEntrega?.length || 0;

  useEffect(() => {
    if (stops >= 2) {
      const pts = data.puntosEntrega;
      const o = `${pts[0].lat},${pts[0].lng}`;
      const d = `${pts[pts.length - 1].lat},${pts[pts.length - 1].lng}`;
      const w = pts.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
      const url = `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}${w ? `&waypoints=${w}` : ''}`;
      QRCode.toDataURL(url, { width: 150, margin: 2 }).then(setQr).catch(() => {});
    }
  }, [data.puntosEntrega]);

  const freq = data.frecuencia;
  const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const viajesProyectados = freq.tipo === 'mensual'
    ? ((freq.diasSeleccionados?.length || 0) * (freq.viajesPorDia || 1) * 4.33).toFixed(1)
    : freq.vueltasTotales || 1;

  const dur = min => {
    if (!min) return '—';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 1: Recorrido y Frecuencia del Servicio</h1>
        <p className="dg-chapter-sub">Detalle del recorrido operativo, puntos de entrega y frecuencia programada para la prestación del servicio logístico.</p>

        {/* Map — taller to fill page */}
        <div className="dg-map" style={{ height: 360 }}>
          <MapaRuta puntos={data.puntosEntrega} onRutaCalculada={() => {}} />
        </div>

        {/* Route list */}
        <h3 className="dg-st">Itinerario de Paradas</h3>
        <div className="dg-route-list">
          {data.puntosEntrega.map((pt, i) => {
            const { name, addr } = splitName(pt);
            const first = i === 0;
            const last = i === stops - 1;
            const cls = first ? ' dg-route-item--origin' : last ? ' dg-route-item--dest' : '';
            return (
              <div className={`dg-route-item${cls}`} key={i}>
                <div className="dg-route-num">{i + 1}</div>
                <div className="dg-route-info">
                  <div className="dg-route-name">{name || '—'}</div>
                  {addr && <div className="dg-route-addr">{addr}</div>}
                </div>
                {first && <div className="dg-route-tag">Origen</div>}
                {last && <div className="dg-route-tag">Destino</div>}
              </div>
            );
          })}
        </div>

        {/* Stats + Frequency 2-col */}
        <div className="dg-cols">
          <div className="dg-col">
            <h3 className="dg-st" style={{ marginTop: 0 }}>Datos del Recorrido</h3>
            <div className="dg-strip-card" style={{ marginBottom: 10 }}>
              {qr && <img src={qr} alt="QR" />}
              <div>
                <div className="dg-strip-title">Ver Ruta en Google Maps</div>
                <div className="dg-strip-sub">Escaneá el código QR con tu dispositivo móvil</div>
              </div>
            </div>
            <div className="dg-kpi-mini-row" style={{ flexDirection: 'column', gap: 8 }}>
              <div className="dg-kpi-mini">
                <div className="dg-kpi-mini-icon"><Navigation size={14} /></div>
                <div>
                  <div className="dg-kpi-mini-val">{(data.totalKilometros || 0).toFixed(1)} km</div>
                  <div className="dg-kpi-mini-label">Distancia Total del Recorrido</div>
                </div>
              </div>
              <div className="dg-kpi-mini">
                <div className="dg-kpi-mini-icon" style={{ background: '#475569' }}><Clock size={14} /></div>
                <div>
                  <div className="dg-kpi-mini-val">{dur(data.duracionMin)}</div>
                  <div className="dg-kpi-mini-label">Duración Estimada en Ruta</div>
                </div>
              </div>
              <div className="dg-kpi-mini">
                <div className="dg-kpi-mini-icon" style={{ background: '#6366f1' }}><Package size={14} /></div>
                <div>
                  <div className="dg-kpi-mini-val">{stops} paradas</div>
                  <div className="dg-kpi-mini-label">Puntos de Entrega</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dg-col">
            <h3 className="dg-st" style={{ marginTop: 0 }}>Frecuencia del Servicio</h3>
            {freq.tipo === 'mensual' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <span className="dg-id-badge" style={{ color: 'var(--c2)', borderColor: 'var(--c2)' }}>
                    <Calendar size={12} style={{ marginRight: 4, verticalAlign: -2 }} />
                    Servicio Mensual Recurrente
                  </span>
                </div>
                <div className="dg-weekdays" style={{ marginBottom: 14 }}>
                  {weekDays.map(d => (
                    <div key={d} className={`dg-wd${freq.diasSeleccionados?.includes(d) ? ' dg-wd--on' : ''}`}>
                      {d.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <table className="dg-tbl">
                  <tbody>
                    <tr><td>Días operativos por semana</td><td className="dg-tbl-val">{freq.diasSeleccionados?.length || 0}</td></tr>
                    <tr><td>Viajes por día</td><td className="dg-tbl-val">{freq.viajesPorDia}</td></tr>
                    <tr><td>Total proyectado mensual</td><td className="dg-tbl-val">~{viajesProyectados} viajes</td></tr>
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div className="dg-id-badge" style={{ color: '#6366f1', borderColor: '#c7d2fe', background: '#eef2ff', display: 'inline-block', marginBottom: 16 }}>
                  <Repeat size={12} style={{ marginRight: 4, verticalAlign: -2 }} />
                  Servicio Esporádico
                </div>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#334155', lineHeight: 1 }}>{freq.vueltasTotales}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>Viajes Totales Programados</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Foot p={2} />
    </div>
  );
};

export default CapituloRutaFrecuencia;