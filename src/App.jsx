import { useEffect, useRef, useState } from 'react';
import quincePhoto from './DSC03916 v2.jpg';

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

function playMelodyPhrase(context) {
  const notes = [587.33, 739.99, 880, 739.99, 659.25, 783.99, 987.77, 783.99];
  const startTime = context.currentTime + 0.04;

  notes.forEach((frequency, index) => {
    const noteStart = startTime + index * 0.82;
    const noteEnd = noteStart + 1.1;
    const volume = context.createGain();
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();

    fundamental.type = 'sine';
    fundamental.frequency.value = frequency;
    overtone.type = 'sine';
    overtone.frequency.value = frequency * 2;

    volume.gain.setValueAtTime(0.0001, noteStart);
    volume.gain.exponentialRampToValueAtTime(0.035, noteStart + 0.09);
    volume.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    fundamental.connect(volume);
    overtone.connect(volume);
    volume.connect(context.destination);
    fundamental.start(noteStart);
    overtone.start(noteStart);
    fundamental.stop(noteEnd);
    overtone.stop(noteEnd);
  });
}

function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioContext = useRef(null);
  const melodyTimer = useRef(null);

  useEffect(() => () => {
    window.clearInterval(melodyTimer.current);
    audioContext.current?.close();
  }, []);

  async function toggleMusic() {
    setError('');

    if (isPlaying) {
      window.clearInterval(melodyTimer.current);
      melodyTimer.current = null;
      await audioContext.current?.close();
      audioContext.current = null;
      setIsPlaying(false);
      return;
    }

    try {
      const AudioContext = window.AudioContext;
      if (!AudioContext) {
        throw new Error('Este navegador no permite reproducir la melodía.');
      }

      const context = new AudioContext();
      audioContext.current = context;
      await context.resume();
      playMelodyPhrase(context);
      melodyTimer.current = window.setInterval(() => {
        playMelodyPhrase(context);
      }, 7000);
      setIsPlaying(true);
    } catch (playbackError) {
      window.clearInterval(melodyTimer.current);
      melodyTimer.current = null;
      await audioContext.current?.close();
      audioContext.current = null;
      console.error('No se pudo iniciar la música de la invitación.', playbackError);
      setError('No se pudo activar la música. Intenta de nuevo.');
    }
  }

  return (
    <div className="music-control">
      <p className="music-control__label">Dale play para escuchar la canción</p>
      <span className="music-control__rule" aria-hidden="true" />
      <button
        className="music-control__button"
        type="button"
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pausar música' : 'Activar música'}
        onClick={toggleMusic}
      >
        <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
      </button>
      {error && <span className="music-control__error" role="alert">{error}</span>}
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
    <main className="invitation" id="inicio">
      <section className="hero" aria-labelledby="invitation-title">
        <div className="hero__frame">
          <div className="hero__caption">
            <span className="eyebrow">MIS</span>
            <h1 id="invitation-title">
              <span>15 años</span>
            </h1>
            <div className="hero__title-divider" aria-hidden="true">
              <span />
              <span className="hero__title-heart">♥</span>
              <span />
            </div>
            <p className="hero__name">Lourdes</p>
          </div>
          <div className="hero__portrait">
            <div className="hero__photo">
              <img src={quincePhoto} alt="Lourdes con su vestido de quinceañera" />
            </div>
            <span className="hero__diamond hero__diamond--top" aria-hidden="true" />
            <span className="hero__diamond hero__diamond--bottom" aria-hidden="true" />
          </div>
          <MusicToggle />
          <p className="hero__date">{eventDateLabel}</p>
        </div>
        <a className="hero__scroll" href="#celebracion" aria-label="Desliza para continuar">
          <span />
        </a>
      </section>

      <section className="parents paper-section" id="celebracion">
        <div className="ornament ornament--top" aria-hidden="true">✧</div>
        <p className="parents__quote">
          “Hoy dejo atrás mi niñez para comenzar una nueva etapa llena de sueños,
          ilusiones y esperanza. Agradezco a Dios y a mi familia por acompañarme
          en este momento tan especial: mis 15 años.”
        </p>
        <div className="divider" aria-hidden="true"><span /><Icon name="sparkle" size={20} /><span /></div>
        <p className="parents__label">Mis padres</p>
        <p className="parents__signature">Herminia y David</p>
        <div className="ornament ornament--bottom" aria-hidden="true">✧</div>
      </section>

      <section className="event paper-section" id="detalles">
        <div className="event__frame">
          <span className="eyebrow">Tengo el agrado de invitarte</span>
          <p className="event__intro">a celebrar conmigo</p>
          <p className="event__day">{new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(eventDate)}</p>
          <p className="event__number">{new Intl.DateTimeFormat('es-MX', { day: '2-digit' }).format(eventDate)}</p>
          <p className="event__month">
            {new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(eventDate)}
          </p>
          <div className="divider" aria-hidden="true"><span /><Icon name="sparkle" size={20} /><span /></div>
          <p className="event__venue">Domicilio de la quinceañera</p>
          <p className="event__time"><Icon name="clock" size={17} /> Recepción a las 6:00 p. m.</p>
        </div>
      </section>

      <section className="countdown-section paper-section">
        <span className="eyebrow">La cuenta regresiva comienza</span>
        <h2>Falta muy poco</h2>
        <Countdown />
        <p>para celebrar juntos una noche mágica</p>
      </section>

      <section className="closing paper-section">
        <span className="eyebrow">Con mucha ilusión</span>
        <h2>¡Te espero!</h2>
        <p>Será un honor compartir contigo este momento tan especial.</p>
        <span className="closing__signature">Lourdes</span>
      </section>
    </main>
  );
}

export default App;
