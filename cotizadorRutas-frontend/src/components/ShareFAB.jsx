import { useState, useEffect } from 'react';
import { Share2, Link2, MessageCircle, Mail, Check, X } from 'lucide-react';
import './ShareFAB.css';

/**
 * ShareFAB — Floating Action Button for sharing proposals
 * Props:
 *   shareUrl  – the public URL to share (e.g. /p/:id)
 *   cliente   – client name for the message
 *   empresa   – company name for the message
 */
const ShareFAB = ({ shareUrl, cliente, empresa }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const fullUrl = `${window.location.origin}${shareUrl}`;
  const msg = `Hola${cliente ? ` ${cliente}` : ''}, te comparto la propuesta de servicio logístico${empresa ? ` de ${empresa}` : ''}: ${fullUrl}`;
  const subject = `Propuesta de Servicio Logístico${empresa ? ` — ${empresa}` : ''}`;

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!e.target.closest('.share-fab-wrap')) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setToast(true);
      setOpen(false);
      setTimeout(() => setToast(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = fullUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setToast(true);
      setOpen(false);
      setTimeout(() => setToast(false), 2500);
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    setOpen(false);
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`, '_self');
    setOpen(false);
  };

  return (
    <>
      <div className="share-fab-wrap">
        {/* Menu */}
        <div className={`share-fab-menu ${open ? 'share-fab-menu--open' : ''}`}>
          <button className="share-fab-item" onClick={copyLink}>
            <div className="share-fab-item-icon share-fab-item-icon--link"><Link2 size={15} /></div>
            <div>
              <div className="share-fab-item-text">Copiar Link</div>
              <div className="share-fab-item-sub">Al portapapeles</div>
            </div>
          </button>
          <button className="share-fab-item" onClick={shareWhatsApp}>
            <div className="share-fab-item-icon share-fab-item-icon--wa"><MessageCircle size={15} /></div>
            <div>
              <div className="share-fab-item-text">WhatsApp</div>
              <div className="share-fab-item-sub">Enviar con mensaje</div>
            </div>
          </button>
          <button className="share-fab-item" onClick={shareEmail}>
            <div className="share-fab-item-icon share-fab-item-icon--email"><Mail size={15} /></div>
            <div>
              <div className="share-fab-item-text">Email</div>
              <div className="share-fab-item-sub">Abrir correo</div>
            </div>
          </button>
        </div>

        {/* FAB */}
        <button
          className={`share-fab-btn ${open ? 'share-fab-btn--open' : ''}`}
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        >
          {open ? <X size={18} /> : <Share2 size={18} />}
          {open ? 'Cerrar' : 'Compartir'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="share-toast">
          <Check size={16} /> Link copiado al portapapeles
        </div>
      )}
    </>
  );
};

export default ShareFAB;
