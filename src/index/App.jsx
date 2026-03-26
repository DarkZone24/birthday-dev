import { useMemo, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

import img1 from './assets/1.jpg'
import img2 from './assets/2.jpg'
import img3 from './assets/3.jpg'
import img7 from './assets/7.JPG'
import img8 from './assets/8.JPG'
import hbdSound from '../sound/hbd.mp3'
import loveSound from '../sound/Love.m4a'
const letterParagraphs = [
  "Hi! Love,",
  "Today is all about you — your light, your laughter, and the way you make every moment feel warmer just by being in it.",
  "You are thoughtful in the ways that count and bold in the ways that matter. Your kindness shows up in the smallest details, and it never goes unnoticed.",
  "Here’s to another year of adventures, soft mornings, beautiful surprises, and dreams unfolding exactly the way you deserve.",
  "Happy Birthday. You’re loved more than words can hold."
]

const wishes = [
  "A year full of joyful milestones",
  "More slow days and magical nights",
  "Big dreams that turn into real memories",
  "Laughs that leave your cheeks sore",
  "Love that finds you in every season"
]

export default function App() {
  const images = useMemo(
    () => [
      { src: img1, alt: 'Kristen portrait 1' },
      { src: img2, alt: 'Kristen portrait 2' },
      { src: img3, alt: 'Kristen portrait 3' },
      { src: img7, alt: 'Kristen portrait 4' },
      { src: img8, alt: 'Kristen portrait 5' },
    ],
    []
  )

  const [confetti, setConfetti] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBlown, setIsBlown] = useState(false)
  const confettiTimerRef = useRef(null)
  const audioRef = useRef(null)
  const loveAudioRef = useRef(null)
  const [letterOpen, setLetterOpen] = useState(false)
  const [letterReveal, setLetterReveal] = useState(false)

  const createConfettiBurst = () => {
    const seed = Date.now()
    const burst = Array.from({ length: 50 }, (_, index) => {
      const corner = index % 4
      const cornerLeft = corner === 0 || corner === 2 ? 4 : 96
      const cornerTop = corner === 0 || corner === 1 ? 6 : 88
      const driftX = (Math.random() - 0.5) * 260
      const driftY = 180 + Math.random() * 320
      return {
        id: `${seed}-${index}`,
        left: cornerLeft + (Math.random() - 0.5) * 6,
        top: cornerTop + (Math.random() - 0.5) * 6,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.2,
        rotate: Math.random() * 360,
        driftX,
        driftY,
        color: ['#ff7b7b', '#ffd166', '#9bf6ff', '#cdb4db', '#b8f2e6', '#f7b267'][
          Math.floor(Math.random() * 6)
        ]
      }
    })

    setConfetti((prev) => [...prev, ...burst])

    window.setTimeout(() => {
      setConfetti((prev) => prev.filter((piece) => !piece.id.startsWith(String(seed))))
    }, 2800)
  }

  const celebrate = () => {
    const audio = audioRef.current
    let duration = 15000
    if (audio) {
      audio.volume = 1
      audio.currentTime = 0
      audio.play().catch(() => {})
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        duration = audio.duration * 1000
      }
    }
    createConfettiBurst()
    if (confettiTimerRef.current) {
      window.clearInterval(confettiTimerRef.current)
    }
    confettiTimerRef.current = window.setInterval(() => {
      createConfettiBurst()
    }, 500)
    window.setTimeout(() => {
      if (confettiTimerRef.current) {
        window.clearInterval(confettiTimerRef.current)
        confettiTimerRef.current = null
      }
    }, duration)
    if (audio) {
      audio.onended = () => {
        if (confettiTimerRef.current) {
          window.clearInterval(confettiTimerRef.current)
          confettiTimerRef.current = null
        }
      }
    }
  }

  const handleBlow = () => {
    if (isBlown) return
    playCandleSound()
    createConfettiBurst()
    setIsBlown(true)
    window.setTimeout(() => setIsLoading(false), 1400)
  }

  const playCandleSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const now = ctx.currentTime
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.4
      }
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 900
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.2)
    } catch (err) {
      // ignore if audio is blocked
    }
  }

  return (
    <div className={`page ${isLoading ? 'is-loading' : 'is-loaded'}`}>
      {isLoading && (
        <div className={`loader ${isBlown ? 'blown' : ''}`}>
          <div className="loader-card">
            <p className="loader-title">Make a wish</p>
            <p className="loader-subtitle">Tap the candle to blow it out</p>
            <button className="loader-cake" onClick={handleBlow} aria-label="Blow out the candle">
              <span className="loader-plate" />
              <span className="loader-shadow" />
              <span className="loader-layer base" />
              <span className="loader-layer mid" />
              <span className="loader-icing top" />
              <span className="loader-drip drip-1" />
              <span className="loader-drip drip-2" />
              <span className="loader-drip drip-3" />
              <span className="loader-sprinkles" />
              <span className="loader-candle" />
              <span className="loader-flame" />
              <span className="loader-smoke" />
              <span className="loader-smoke delay" />
            </button>
            <div className="loader-progress">
              <span />
            </div>
          </div>
        </div>
      )}

      <div className="ambient" aria-hidden="true" />

      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">A day made for you</p>
          <h1>
            Happy Birthday <span>Kristen</span>
          </h1>
          <p className="lead">
            A modern little shrine to the way you glow. Five favorite moments, a few wishes, and all the love.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={celebrate}>
              Celebrate
            </button>
            <div className="chips">
              <span>Soft glam</span>
              <span>Golden hour</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        <div className="hero-collage">
          <div className="frame tall">
            <img src={images[0].src} alt={images[0].alt} />
          </div>
          <div className="frame wide">
            <img src={images[4].src} alt={images[4].alt} />
          </div>
          <div className="frame square">
            <img src={images[2].src} alt={images[2].alt} />
          </div>
        </div>
      </header>

      <section className="gallery">
        <div className="section-head">
          <h2>Five Solo Snapshots</h2>
          <p>Only her. Only the best light.</p>
        </div>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <figure className="gallery-card" key={image.src}>
              <button
                className="image-button"
                type="button"
                onClick={() => setLightbox(image)}
                aria-label={`Open ${image.alt}`}
              >
                <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
              </button>
              <figcaption>Moment {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`letter ${letterOpen ? 'is-open' : 'is-closed'}`}>
        <div className="cake-stage">
          <button
            className={`letter-cake ${letterOpen ? 'is-rotating' : ''}`}
            type="button"
            onClick={() => setLetterOpen(true)}
            aria-label="Reveal the letters"
          >
            <span className="cake-stand" />
            <span className="cake-layer base" />
            <span className="cake-layer mid" />
            <span className="cake-layer top" />
            <span className="cake-icing" />
            <span className="cake-candles">
              <span className="cake-candle left" />
              <span className="cake-candle center" />
              <span className="cake-candle right" />
            </span>
          </button>
        </div>

        <div className="letter-grid">
          <div className="letter-card letter-card-main">
            {!letterReveal && (
              <div className="letter-cover">
                <button
                  className="letter-reveal"
                  type="button"
                  onClick={() => {
                    const audio = loveAudioRef.current
                    setLetterReveal(true)
                    if (audio) {
                      audio.currentTime = 0
                      audio.play().catch(() => {})
                    }
                  }}
                >
                  Click It
                </button>
              </div>
            )}
            <div className={letterReveal ? 'letter-revealed' : ''}>
              <div className="letter-header">
                <span>With all my love</span>
                <h2>A Letter to You</h2>
              </div>
              <div className="letter-body">
                {letterParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="letter-sign">Love</div>
            </div>
          </div>

          <div className="letter-card letter-card-small">
            <h3>Birthday Wishes</h3>
            <ul>
              {wishes.map((wish) => (
                <li key={wish}>{wish}</li>
              ))}
            </ul>
          </div>

          <div className="letter-card letter-card-small">
            <h3>Favorite Detail</h3>
            <p>
              The way you bring warmth into a room without even trying — effortless, bright, unforgettable.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h2>Here’s to your next chapter</h2>
          <p>May it be soft, dazzling, and very, very yours.</p>
        </div>
        <div className="qr-card">
          <div className="qr-icing" />
          <div className="qr-inner">
            <QRCodeCanvas
              value="https://www.tiktok.com/@kpopaddict_2026/video/7549955312522923294?is_from_webapp=1&sender_device=pc"
              size={96}
              bgColor="#ffffff"
              fgColor="#2a2624"
              includeMargin={false}
              level="M"
            />
          </div>
          <p>Scan for the surprise</p>
        </div>
        <div className="footer-image">
          <img src={images[4].src} alt={images[4].alt} />
        </div>
      </footer>

      <div className="confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            className="confetti-piece"
            key={piece.id}
            style={{
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              width: `${piece.size}px`,
              height: `${piece.size * 1.6}px`,
              background: piece.color,
              transform: `rotate(${piece.rotate}deg)`,
              animationDelay: `${piece.delay}s`,
              '--drift-x': `${piece.driftX}px`,
              '--drift-y': `${piece.driftY}px`
            }}
          />
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="lightbox-close" type="button" aria-label="Close image">
            ×
          </button>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}
      <audio ref={audioRef} src={hbdSound} preload="auto" />
      <audio ref={loveAudioRef} src={loveSound} preload="auto" />
    </div>
  )
}



