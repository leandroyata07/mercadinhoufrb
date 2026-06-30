import React, { useState, useEffect } from 'react';
import './Footer.css';

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    className="whatsapp-icon"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402 0 9.794-4.394 9.797-9.799.002-2.618-1.018-5.08-2.871-6.936C16.292 2.013 13.824 1 11.997 1 6.592 1 2.2 5.394 2.2 10.796c0 1.554.432 3.074 1.252 4.417L2.41 19.86l4.237-1.111c1.32.72 2.766 1.096 4.025 1.096zM17.06 14c-.277-.139-1.643-.811-1.897-.903-.255-.093-.44-.139-.626.139-.184.278-.718.903-.88 1.088-.162.186-.324.208-.601.07-2.95-1.485-3.86-2.585-4.407-3.528-.277-.479-.046-.738.192-.976.214-.214.475-.556.713-.833.238-.278.318-.464.477-.773.16-.309.079-.579-.04-.811-.12-.232-.99-2.385-1.356-3.272-.358-.862-.723-.746-.99-.759l-.84-.012c-.278 0-.73.104-1.112.522-.383.418-1.46 1.425-1.46 3.475s1.496 4.032 1.705 4.31c.209.278 2.943 4.493 7.13 6.302 2.378 1.026 3.326 1.134 4.542.952.74-.11 2.28-.93 2.6-1.83.318-.9 0-.1.318-1.68-.03-.279-.185-.418-.462-.557z" />
  </svg>
);

const Footer = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const dayOfWeek = weekdays[dateTime.getDay()];
    const dateStr = dateTime.toLocaleDateString('pt-BR');
    const timeStr = dateTime.toLocaleTimeString('pt-BR');
    return `${dayOfWeek}, ${dateStr} - ${timeStr}`;
  };

  return (
    <footer className="global-footer no-print">
      <div className="footer-content">
        <div className="footer-left">
          <span>Criado por Leandro Yata</span>
          <a
            href="https://wa.me/5575991902534"
            target="_blank"
            rel="noopener noreferrer"
            title="Falar no WhatsApp"
            className="footer-whatsapp-link"
          >
            <WhatsAppIcon />
          </a>
        </div>
        <span className="footer-divider">|</span>
        <span className="footer-datetime">{formatDateTime()}</span>
      </div>
    </footer>
  );
};

export default Footer;
