import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Truck, Calculator, FileText, Users, BarChart3,
  Target, Zap, Shield, ArrowRight, Route, Settings,
  CheckCircle, Menu, X,
} from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: MapPin,
    title: 'Rutas inteligentes',
    text: 'Definí origen, destino y múltiples puntos de entrega con cálculo automático de distancia y duración vía Google Maps.',
  },
  {
    icon: Truck,
    title: 'Gestión de flota',
    text: 'Administrá tus vehículos con costos detallados: combustible, mantenimiento, depreciación, seguros, patente y más.',
  },
  {
    icon: Calculator,
    title: 'Cálculos en tiempo real',
    text: 'Motor de cálculo que ajusta costos por frecuencia, feriados nacionales, tipo de carga y jornadas laborales.',
  },
  {
    icon: Users,
    title: 'Gestión de personal',
    text: 'Registrá choferes y acompañantes con costos salariales, cargas sociales, viáticos y horas extra incluidos.',
  },
  {
    icon: FileText,
    title: 'Documentos profesionales',
    text: 'Generá propuestas comerciales para clientes y desgloses internos de costos con un solo clic.',
  },
  {
    icon: BarChart3,
    title: 'Inteligencia de negocios',
    text: 'Dashboard con métricas clave: comparativas de costos, rentabilidad por ruta y análisis histórico.',
  },
];

const steps = [
  {
    number: '01',
    icon: Route,
    title: 'Definí tu ruta',
    text: 'Ingresá origen, destino y puntos de entrega. El sistema calcula distancias y tiempos automáticamente.',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Configurá los costos',
    text: 'Asigná vehículo, personal y frecuencia. El motor calcula todos los costos operativos al instante.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Generá tu propuesta',
    text: 'Obtenés un presupuesto profesional listo para presentar a tu cliente con el desglose completo.',
  },
];

const stats = [
  { icon: Target, value: '100%', label: 'Costos reales calculados' },
  { icon: Zap, value: 'Automático', label: 'Feriados y jornadas' },
  { icon: Shield, value: 'Al instante', label: 'Propuestas profesionales' },
];

const benefits = [
  'Costos calculados con datos reales, no estimaciones',
  'Feriados nacionales incorporados automáticamente',
  'Propuestas comerciales listas para tu cliente',
  'Desglose interno para control de costos',
  'Historial completo de cotizaciones',
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp">

      {/* ══════ NAVBAR ══════ */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <Link to="/landing" className="lp-nav-brand">
            <img src="/favicon.png" alt="" className="lp-nav-favicon" />
            <span className="lp-nav-brand-text">
              Cotizador <span className="lp-nav-brand-accent">Logístico</span>
            </span>
          </Link>

          <div className={`lp-nav-links ${menuOpen ? 'lp-nav-links--open' : ''}`}>
            <a href="#features" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Funcionalidades</a>
            <a href="#how" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
            <Link to="/login" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
            <Link to="/registro" className="lp-btn-nav" onClick={() => setMenuOpen(false)}>
              Comenzar gratis
            </Link>
          </div>

          <button className="lp-nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="lp-hero">
        {/* Decorative elements */}
        <div className="lp-hero-glow lp-hero-glow--1" />
        <div className="lp-hero-glow lp-hero-glow--2" />
        <div className="lp-hero-glow lp-hero-glow--3" />
        <div className="lp-hero-grid" />

        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot" />
            Plataforma de cotización logística
          </div>

          <div className="lp-hero-logo">
            <img src="/favicon.png" alt="Cotizador Logístico" />
          </div>

          <h1 className="lp-hero-title">
            Cotizador{' '}
            <span className="lp-hero-title-accent">Logístico</span>
          </h1>

          <p className="lp-hero-sub">
            Calculá el costo real de tus operaciones logísticas con precisión profesional.
            Optimizá precios, gestioná tu flota y generá presupuestos listos para presentar.
          </p>

          <div className="lp-hero-actions">
            <Link to="/registro" className="lp-btn-primary">
              Comenzar ahora
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="lp-btn-outline">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        <div className="lp-hero-wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C320,100 640,0 960,50 C1120,75 1300,70 1440,50 L1440,100 L0,100 Z" fill="#f8f9fa" />
          </svg>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="lp-features" id="features">
        <div className="lp-section-header">
          <span className="lp-label">Funcionalidades</span>
          <h2 className="lp-heading">Todo lo que necesitás para cotizar</h2>
          <p className="lp-desc">
            Un sistema integral que cubre cada aspecto del cálculo de costos logísticos.
          </p>
        </div>

        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div className="lp-feature" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="lp-feature-icon">
                <f.icon size={28} />
              </div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CÓMO FUNCIONA ══════ */}
      <section className="lp-how" id="how">
        <div className="lp-section-header">
          <span className="lp-label lp-label--light">Cómo funciona</span>
          <h2 className="lp-heading lp-heading--light">Tres pasos para tu cotización</h2>
          <p className="lp-desc lp-desc--light">
            Ponete en marcha en minutos. Sin configuraciones complicadas.
          </p>
        </div>

        <div className="lp-steps">
          <div className="lp-steps-line" />
          {steps.map((s, i) => (
            <div className="lp-step" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="lp-step-num">{s.number}</div>
              <div className="lp-step-icon">
                <s.icon size={26} />
              </div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="lp-stats">
        <div className="lp-stats-grid">
          {stats.map((s, i) => (
            <div className="lp-stat" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="lp-stat-icon">
                <s.icon size={22} />
              </div>
              <p className="lp-stat-value">{s.value}</p>
              <p className="lp-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ BENEFICIOS ══════ */}
      <section className="lp-benefits">
        <div className="lp-section-header">
          <span className="lp-label">¿Por qué elegirnos?</span>
          <h2 className="lp-heading">Diseñado para profesionales de la logística</h2>
        </div>
        <ul className="lp-benefits-list">
          {benefits.map((b, i) => (
            <li key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <CheckCircle size={20} className="lp-check" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="lp-cta">
        <div className="lp-cta-card">
          <h2 className="lp-cta-title">¿Listo para profesionalizar tus cotizaciones?</h2>
          <p className="lp-cta-text">
            Creá tu cuenta y empezá a cotizar rutas con la precisión que tu negocio necesita.
          </p>
          <Link to="/registro" className="lp-btn-primary lp-btn-primary--lg">
            Crear cuenta gratis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <img src="/favicon.png" alt="" className="lp-footer-favicon" />
            <span>Cotizador Logístico © {new Date().getFullYear()}</span>
          </div>
          <div className="lp-footer-links">
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
