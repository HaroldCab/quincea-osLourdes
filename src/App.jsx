import { useEffect, useState } from 'react';

const eventDate = new Date('2026-10-17T18:00:00-06:00');
const eventDateLabel = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(eventDate);

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'pin') {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }

  if (name === 'sparkle') {
    return (
      <svg {...common}>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
      </svg>
    );
  }

  return null;
}

function Countdown() {
  const [remaining, setRemaining] = useState(() => getTimeRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getTimeRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown" aria-label="Cuenta regresiva para la celebración">
      {[
        ['days', 'días'],
        ['hours', 'horas'],
        ['minutes', 'minutos'],
        ['seconds', 'segundos'],
      ].map(([unit, label]) => (
        <div className="countdown__unit" key={unit}>
          <span className="countdown__number">
            {String(remaining[unit]).padStart(2, '0')}
          </span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function getTimeRemaining() {
  const difference = Math.max(0, eventDate.getTime() - Date.now());
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Inicio">
          <span className="brand__monogram">L</span>
          <span className="brand__text">Mis XV años</span>
        </a>
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#celebracion">La celebración</a>
          <a href="#detalles">Detalles</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero__photo" />
          <div className="hero__wash" />
          <div className="hero__frame" />
          <div className="hero__content">
            <span className="eyebrow hero__eyebrow">
              <span className="eyebrow__line" />
              Una noche para recordar
              <span className="eyebrow__line" />
            </span>
            <p className="hero__invite">Con mucha ilusión te invito a celebrar</p>
            <h1>
              Mis quince
              <span className="hero__name">Lourdes</span>
            </h1>
            <span className="hero__ornament" aria-hidden="true">
              ✧
            </span>
            <p className="hero__date">{eventDateLabel}</p>
            <a className="button button--light" href="#detalles">
              Descubre los detalles <span aria-hidden="true">↓</span>
            </a>
          </div>
          <a className="hero__scroll" href="#celebracion" aria-label="Desliza para continuar">
            <span />
          </a>
        </section>

        <section className="intro section-pad" id="celebracion">
          <div className="intro__flower intro__flower--left" aria-hidden="true">
            ✳
          </div>
          <div className="intro__flower intro__flower--right" aria-hidden="true">
            ✳
          </div>
          <span className="eyebrow eyebrow--rose">Un sueño hecho realidad</span>
          <h2>
            Quince años, mil sueños
            <br />
            <em>y una noche contigo.</em>
          </h2>
          <p className="intro__copy">
            Hay momentos que brillan para siempre. Me encantaría compartir este
            capítulo tan especial de mi vida con las personas que más quiero.
          </p>
          <div className="divider" aria-hidden="true">
            <span />
            <Icon name="sparkle" size={18} />
            <span />
          </div>
          <p className="intro__signature">Lourdes</p>
        </section>

        <section className="countdown-section">
          <div className="countdown-section__image" />
          <div className="countdown-section__content">
            <span className="eyebrow eyebrow--light">La cuenta regresiva comienza</span>
            <h2>Falta muy poco</h2>
            <Countdown />
            <p>para celebrar juntos una noche mágica</p>
          </div>
        </section>

        <section className="details section-pad" id="detalles">
          <div className="details__heading">
            <span className="eyebrow eyebrow--rose">Nos vemos pronto</span>
            <h2>Detalles de la celebración</h2>
            <p>Guarda la fecha y prepárate para brindar, bailar y celebrar.</p>
          </div>
          <div className="details__grid">
            <article className="detail-card">
              <span className="detail-card__icon">
                <Icon name="calendar" size={23} />
              </span>
              <span className="detail-card__label">¿Cuándo?</span>
              <h3>{eventDateLabel}</h3>
              <p>Recepción a partir de las 6:00 p. m.</p>
            </article>
            <article className="detail-card">
              <span className="detail-card__icon">
                <Icon name="pin" size={23} />
              </span>
              <span className="detail-card__label">¿Dónde?</span>
              <h3>Domicilio de la quinceañera</h3>
            </article>
            <article className="detail-card">
              <span className="detail-card__icon">
                <Icon name="clock" size={23} />
              </span>
              <span className="detail-card__label">Itinerario</span>
              <h3>Una noche especial</h3>
              <p>Recepción · 6:00 p. m.</p>
              <p>Vals y cena · 7:00 p. m.</p>
              <p>¡Que comience la fiesta! · 9:00 p. m.</p>
            </article>
          </div>
        </section>

        <section className="dress-code">
          <div className="dress-code__content">
            <span className="eyebrow eyebrow--rose">El toque perfecto</span>
            <h2>Una noche de gala</h2>
            <p>
              Viste elegante y ven listo para celebrar. El color rosa queda
              reservado para la quinceañera.
            </p>
            <div className="dress-code__swatches" aria-label="Paleta sugerida">
              <span className="swatch swatch--champagne" />
              <span className="swatch swatch--sage" />
              <span className="swatch swatch--plum" />
              <span className="dress-code__hint">Elegante · Formal</span>
            </div>
          </div>
          <div
            className="dress-code__photo"
            role="img"
            aria-label="Decoración elegante con flores para una celebración"
          />
        </section>

        <section className="closing">
          <div className="closing__sparkle closing__sparkle--one" aria-hidden="true">
            ✧
          </div>
          <div className="closing__sparkle closing__sparkle--two" aria-hidden="true">
            ✧
          </div>
          <span className="eyebrow eyebrow--light">Una noche para celebrar</span>
          <h2>¡Te espero!</h2>
          <p>
            Será una noche llena de alegría, música y momentos inolvidables.
            <br />
            Me encantará celebrar mis quince contigo.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="footer__monogram" href="#inicio" aria-label="Volver al inicio">
          L
        </a>
        <p>Con cariño, Lourdes</p>
        <span>Mis XV años · 2026</span>
      </footer>
    </>
  );
}

export default App;
