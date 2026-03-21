import { Link } from 'react-router-dom';
import {
  MapPin, Truck, Calculator, FileText,
  Target, Zap, Shield, ArrowRight,
} from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: MapPin,
    title: 'Rutas inteligentes',
    text: 'Definí origen, destino y puntos de entrega con cálculo automático de distancia y duración vía Google Maps.',
  },
  {
    icon: Truck,
    title: 'Gestión de flota',
    text: 'Administrá tu flota con costos detallados: combustible, mantenimiento, depreciación, seguros y más.',
  },
  {
    icon: Calculator,
    title: 'Cálculos en tiempo real',
    text: 'Motor de cálculo que ajusta costos por frecuencia, feriados nacionales y tipo de carga automáticamente.',
  },
  {
    icon: FileText,
    title: 'Documentos digitales',
    text: 'Generá propuestas comerciales y desgloses internos profesionales con un solo clic.',
  },
];

const stats = [
  { icon: Target, value: '100%', label: 'Precisión en costos' },
  { icon: Zap, value: 'Auto', label: 'Feriados calculados' },
  { icon: Shield, value: 'Al instante', label: 'Documentos digitales' },
];

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* ====== HERO ====== */}
      <section className="hero-section">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid-overlay" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Plataforma de cotización logística
          </div>

          <h1 className="hero-title">
            Cotizador{' '}
            <span className="hero-title-accent">Logístico</span>
          </h1>

          <p className="hero-subtitle">
            Calculá el costo real de tus rutas logísticas con precisión profesional.
            Optimizá precios, controlá tu flota y generá presupuestos en minutos.
          </p>

          <div className="hero-buttons">
            <Link to="/registro" className="btn-hero-primary">
              Comenzar ahora
              <ArrowRight size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
              fill="#f8f9fa"
            />
          </svg>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="features-section">
        <p className="section-label">Funcionalidades</p>
        <h2 className="section-title">Todo lo que necesitás para cotizar</h2>
        <p className="section-subtitle">
          Un sistema integral que cubre cada aspecto del cálculo de costos logísticos,
          desde la planificación de rutas hasta la generación de documentos.
        </p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrapper">
                <f.icon size={32} />
              </div>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-icon-wrapper">
                <s.icon size={24} />
              </div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">
            ¿Listo para optimizar tus costos logísticos?
          </h2>
          <p className="cta-text">
            Creá tu cuenta y empezá a cotizar rutas con precisión profesional.
            Sin compromisos, sin costos ocultos.
          </p>
          <Link to="/registro" className="btn-cta">
            Crear cuenta gratis
            <ArrowRight size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-brand">
            Cotizador Logístico © 2025 — Proyecto de Tesis
          </p>
          <div className="footer-links">
            <Link to="/login" className="footer-link">Iniciar Sesión</Link>
            <Link to="/registro" className="footer-link">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
