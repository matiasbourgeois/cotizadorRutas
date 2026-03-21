import { useState, useEffect } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  BarChart3, FileText, DollarSign, TrendingUp, MapPin,
  Truck, Users, Calendar, Zap
} from 'lucide-react';
import clienteAxios from '../../api/clienteAxios';
import './DashboardBI.css';

// ═══════════════════════════════════════════════
// Subcomponents
// ═══════════════════════════════════════════════

const KpiCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className={`kpi-card kpi-card--${color}`}>
    <div className="kpi-top">
      <span className="kpi-label">{label}</span>
      <div className={`kpi-icon kpi-icon--${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="kpi-value">{value}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bi-tooltip">
      <div className="bi-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="bi-tooltip-value" style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

const PIE_COLORS = ['#22d3ee', '#f59e0b', '#8b5cf6', '#10b981', '#6b7280'];
const BAR_COLORS = { Utilitario: '#22d3ee', Mediano: '#f59e0b', Grande: '#8b5cf6', Camión: '#10b981' };

// ═══════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════

const DashboardBI = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data: stats } = await clienteAxios.get('/bi/stats');
        setData(stats);
      } catch (err) {
        console.error('Error fetching BI stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;
  const fmtK = (n) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return fmt(n);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bi-loading">
        <div className="bi-spinner" />
      </div>
    );
  }

  // Empty state
  if (!data || data.kpis.totalCotizaciones === 0) {
    return (
      <div className="bi-dashboard">
        <div className="bi-header">
          <div className="bi-header-icon"><BarChart3 size={24} /></div>
          <div>
            <h1>Business Intelligence</h1>
            <p>Indicadores clave de tu operación logística</p>
          </div>
        </div>
        <div className="bi-empty">
          <div className="bi-empty-icon"><TrendingUp size={32} /></div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--app-text)' }}>Sin datos todavía</h3>
          <p>Generá tu primera cotización para ver los indicadores aquí.</p>
        </div>
      </div>
    );
  }

  const { kpis, tendenciaMensual, distribucionCostos, distribucionVehiculos, topClientes, ultimasCotizaciones } = data;

  return (
    <div className="bi-dashboard">
      {/* ─── Header ─── */}
      <div className="bi-header">
        <div className="bi-header-icon"><BarChart3 size={24} /></div>
        <div>
          <h1>Business Intelligence</h1>
          <p>Indicadores clave de tu operación logística</p>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="kpi-grid">
        <KpiCard
          icon={FileText}
          label="Cotizaciones"
          value={kpis.totalCotizaciones}
          sub="Total generadas"
          color="cyan"
        />
        <KpiCard
          icon={DollarSign}
          label="Revenue Total"
          value={fmtK(kpis.revenueTotal)}
          sub="Facturación acumulada"
          color="teal"
        />
        <KpiCard
          icon={TrendingUp}
          label="Margen Promedio"
          value={`${kpis.margenPromedio}%`}
          sub="Ganancia sobre total"
          color="violet"
        />
        <KpiCard
          icon={Zap}
          label="Costo / Km"
          value={fmt(kpis.costoPromedioPorKm)}
          sub="Operativo promedio"
          color="amber"
        />
        <KpiCard
          icon={MapPin}
          label="Distancia Total"
          value={`${kpis.distanciaTotal.toLocaleString('es-AR')} km`}
          sub="Kilómetros cotizados"
          color="blue"
        />
        <KpiCard
          icon={Truck}
          label="Flota Activa"
          value={kpis.totalVehiculos}
          sub="Vehículos registrados"
          color="emerald"
        />
        <KpiCard
          icon={Users}
          label="Personal"
          value={kpis.totalRRHH}
          sub="Recursos humanos"
          color="rose"
        />
        <KpiCard
          icon={Calendar}
          label="Frecuencia"
          value={`${kpis.pctMensual}% mensual`}
          sub="Tipo de servicio"
          color="indigo"
        />
      </div>

      {/* ─── Charts Row 1 ─── */}
      <div className="chart-grid">
        {/* Revenue Trend */}
        <div className="chart-card">
          <div className="chart-title">📈 Revenue Mensual</div>
          <div className="chart-subtitle">Evolución de los últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={tendenciaMensual}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradGanancia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
              <XAxis dataKey="mes" tick={{ fill: 'var(--app-text-muted)', fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmtK(v)} tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip formatter={fmt} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#22d3ee"
                strokeWidth={2.5}
                fill="url(#gradRevenue)"
                dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: 'white', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="ganancia"
                name="Ganancia"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradGanancia)"
                dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Distribution Pie */}
        <div className="chart-card">
          <div className="chart-title">🍩 Distribución de Costos</div>
          <div className="chart-subtitle">Promedio por cotización</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={distribucionCostos}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                animationBegin={200}
                animationDuration={1200}
              >
                {distribucionCostos.map((entry, i) => (
                  <Cell key={i} fill={entry.color || PIE_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={fmt} />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => <span style={{ color: 'var(--app-text-secondary)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Charts Row 2 ─── */}
      <div className="chart-grid">
        {/* Vehicle Distribution Bar */}
        <div className="chart-card">
          <div className="chart-title">🚛 Cotizaciones por Tipo Vehículo</div>
          <div className="chart-subtitle">Distribución de la flota utilizada</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={distribucionVehiculos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--app-text-muted)', fontSize: 11 }} />
              <YAxis
                dataKey="tipo"
                type="category"
                tick={{ fill: 'var(--app-text-secondary)', fontSize: 13, fontWeight: 600 }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="cantidad"
                name="Cotizaciones"
                radius={[0, 8, 8, 0]}
                animationDuration={1000}
              >
                {distribucionVehiculos.map((entry, i) => (
                  <Cell key={i} fill={BAR_COLORS[entry.tipo] || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients */}
        <div className="chart-card">
          <div className="chart-title">🏆 Top Clientes</div>
          <div className="chart-subtitle">Ranking por revenue generado</div>
          {topClientes.length === 0 ? (
            <p style={{ color: 'var(--app-text-muted)', textAlign: 'center', padding: 40 }}>
              Sin datos de clientes
            </p>
          ) : (
            <table className="top-clients-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th style={{ textAlign: 'center' }}>Cotiz.</th>
                  <th style={{ textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topClientes.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`client-rank client-rank--${i + 1}`}>{i + 1}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                    <td style={{ textAlign: 'center' }}>{c.cantidad}</td>
                    <td className="client-revenue" style={{ textAlign: 'right' }}>{fmtK(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="chart-card">
        <div className="chart-title">⚡ Actividad Reciente</div>
        <div className="chart-subtitle">Últimas cotizaciones generadas</div>
        {ultimasCotizaciones.map((item, i) => (
          <div key={i} className="activity-item">
            <div className={`activity-dot activity-dot--${item.tipoVehiculo}`} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--app-text)' }}>
                {item.cliente}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)' }}>
                {item.vehiculo} — {item.km} km
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: 'var(--app-brand-primary)', fontSize: '0.9rem' }}>
                {fmt(item.totalFinal)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--app-text-muted)' }}>
                {new Date(item.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBI;
