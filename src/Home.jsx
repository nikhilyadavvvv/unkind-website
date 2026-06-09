import { motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import {
  Bot,
  ChevronDown,
  Crosshair,
  Dice6,
  Gamepad2,
  Github,
  Globe2,
  Users,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedTitle from './components/AnimatedTitle'
import logoIcon from './assets/optimized/unkind-icon.png'
import captureOpponent from './assets/optimized/capture-opponent.jpg'
import layTrapShot from './assets/optimized/lay-trap.jpg'
import switchShot from './assets/optimized/switch.jpg'
import triggerTrapShot from './assets/optimized/trigger-trap.jpg'
import globalArena from './assets/optimized/global-arena.jpg'
import privateMatch from './assets/optimized/private-match.jpg'
import soloPractice from './assets/optimized/solo-practice.jpg'
import dashCard from './assets/optimized/card-dash.jpg'
import freezeCard from './assets/optimized/card-freeze.jpg'
import minefieldCard from './assets/optimized/card-minefield.jpg'
import mirrorCard from './assets/optimized/card-mirror.jpg'
import parasiteCard from './assets/optimized/card-parasite.jpg'
import ruinCard from './assets/optimized/card-ruin-path.jpg'
import shieldCard from './assets/optimized/card-shield.jpg'
import warpCard from './assets/optimized/card-warp.jpg'
import appleStoreIcon from './assets/apple-173.svg'

const APP_STORE_URL = 'https://apps.apple.com/de/app/unkind/id6760196649?l=en-GB'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.projektlyoon.unkind'

const playModes = [
  {
    title: 'Solo Practice',
    copy: 'Learn how cruel the board can get before real people punish you back.',
    image: soloPractice,
    icon: Bot,
  },
  {
    title: 'Global Arena',
    copy: 'Queue up, take a lead, then watch strangers try to ruin it.',
    image: globalArena,
    icon: Globe2,
  },
  {
    title: 'Private Match',
    copy: 'Invite friends when the best part is hearing exactly who hates you now.',
    image: privateMatch,
    icon: Users,
  },
]

const featuredCards = [
  { title: 'Warp Jump', type: 'Chaos', image: warpCard },
  { title: 'Parasite', type: 'Control', image: parasiteCard },
  { title: 'Minefield', type: 'Control', image: minefieldCard },
  { title: 'Mirror', type: 'Counter', image: mirrorCard },
  { title: 'Ruin Path', type: 'Pressure', image: ruinCard },
  { title: 'Dash', type: 'Tempo', image: dashCard },
  { title: 'Freeze', type: 'Lockdown', image: freezeCard },
  { title: 'Shield', type: 'Defense', image: shieldCard },
]

const pillars = [
  {
    icon: Dice6,
    title: 'Looks familiar. Turns mean.',
    copy: 'Race pieces around the board, then spend fuel to interfere with everyone else.',
  },
  {
    icon: Zap,
    title: 'Leads are temporary.',
    copy: 'A safe run can become a mine, a freeze, a swap, or a stolen roll before the next turn.',
  },
  {
    icon: Crosshair,
    title: 'Unkind mode has death.',
    copy: 'When a piece runs out of lives, it is gone for the match.',
  },
]

const rules = [
  'Get around the board before they do.',
  'Earn fuel by moving.',
  'Spend it to make their turn worse.',
  'In Unkind mode, dead pieces stay dead.',
]

const titleScatterSources = [
  { image: warpCard, alt: 'Warp Jump card', kind: 'card' },
  { image: minefieldCard, alt: 'Minefield card', kind: 'card' },
  { image: parasiteCard, alt: 'Parasite card', kind: 'card' },
  { image: shieldCard, alt: 'Shield card', kind: 'card' },
  { image: mirrorCard, alt: 'Mirror card', kind: 'card' },
  { image: dashCard, alt: 'Dash card', kind: 'card' },
  { image: freezeCard, alt: 'Freeze card', kind: 'card' },
  { image: ruinCard, alt: 'Ruin Path card', kind: 'card' },
  { image: captureOpponent, alt: 'Unkind gameplay board with a selected card', kind: 'shot' },
  { image: triggerTrapShot, alt: 'Mine trigger result in an Unkind match', kind: 'shot' },
  { image: soloPractice, alt: 'Solo Practice mode screen', kind: 'shot' },
  { image: privateMatch, alt: 'Private Match mode screen', kind: 'shot' },
  { image: globalArena, alt: 'Global Arena mode screen', kind: 'shot' },
  { image: layTrapShot, alt: 'Minefield targeting on the Unkind board', kind: 'shot' },
  { image: switchShot, alt: 'Switch card being played over the Unkind board', kind: 'shot' },
]

const titleScatterSlots = [
  { x: -51, y: -42 }, { x: -31, y: -50 }, { x: -11, y: -52 }, { x: 11, y: -52 }, { x: 30, y: -50 }, { x: 43, y: -42 },
  { x: -53, y: -20 }, { x: 44, y: -20 },
  { x: -48, y: 0, fill: true }, { x: 40, y: 0, fill: true },
  { x: -52, y: 20 }, { x: 43, y: 20 },
  { x: -37, y: -31, fill: true }, { x: 36, y: -31, fill: true },
  { x: -18, y: 32, fill: true }, { x: 17, y: 32, fill: true },
  { x: -42, y: 35 }, { x: -24, y: 34 }, { x: -7, y: 34 },
  { x: 7, y: 34 }, { x: 23, y: 34 }, { x: 36, y: 35 },
]

const randomBetween = (min, max) => min + Math.random() * (max - min)
const formatScatterX = (value) => `${value.toFixed(2)}vw`
const formatScatterY = (value) => `${value.toFixed(2)}vh`
const formatDeg = (value) => `${value.toFixed(2)}deg`
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)
const getSlotSide = (slot) => {
  if (slot.x < -8) return 'left'
  if (slot.x > 8) return 'right'
  return 'center'
}
const pickNextSource = (sources, index, lastSource, usedSideSources) => {
  for (let offset = 0; offset < sources.length; offset += 1) {
    const nextIndex = index + offset
    const source = sources[nextIndex % sources.length]
    if (source.image !== lastSource?.image && !usedSideSources.has(source.image)) {
      return { source, index: nextIndex + 1 }
    }
  }

  const source = sources[index % sources.length]
  if (source.image !== lastSource?.image) return { source, index: index + 1 }

  const nextIndex = index + 1
  return {
    source: sources[nextIndex % sources.length],
    index: nextIndex + 1,
  }
}
const keepOutsideTitleBand = (target) => {
  const isInsideTitleBand = Math.abs(target.x) < 30 && Math.abs(target.y) < 28
  if (!isInsideTitleBand) return target

  return {
    x: target.x < 0 ? -30 : 30,
    y: target.y < 0 ? -28 : 28,
  }
}

function createTitleScatterLayout() {
  const slots = titleScatterSlots
  const cardSources = shuffle(titleScatterSources.filter((source) => source.kind === 'card'))
  const frameSources = shuffle([
    ...titleScatterSources,
    ...titleScatterSources.filter((source) => source.kind === 'card').slice(0, 5),
  ])
  let cardIndex = 0
  let frameIndex = 0
  let lastSource = null
  const usedSourcesBySide = {
    center: new Set(),
    left: new Set(),
    right: new Set(),
  }

  return slots.map((slot, index) => {
    const side = getSlotSide(slot)
    const picked = slot.fill
      ? pickNextSource(cardSources, cardIndex, lastSource, usedSourcesBySide[side])
      : pickNextSource(frameSources, frameIndex, lastSource, usedSourcesBySide[side])
    const source = picked.source
    if (slot.fill) {
      cardIndex = picked.index
    } else {
      frameIndex = picked.index
    }
    lastSource = source
    usedSourcesBySide[side].add(source.image)
    const target = keepOutsideTitleBand({
      x: slot.x + randomBetween(-1.3, 1.3),
      y: slot.y + randomBetween(-0.7, 0.7),
    })
    const outwardX = target.x === 0 ? randomBetween(-1, 1) : Math.sign(target.x)
    const outwardY = target.y === 0 ? randomBetween(-1, 1) : Math.sign(target.y)
    const start = {
      x: target.x + outwardX * randomBetween(5, 9),
      y: target.y + outwardY * randomBetween(4, 8),
    }

    return {
      ...source,
      id: `${source.alt}-${index}`,
      scale: Number(randomBetween(0.94, 1.22).toFixed(2)),
      style: {
        '--scatter-x': formatScatterX(target.x),
        '--scatter-y': formatScatterY(target.y),
        '--scatter-rotate': formatDeg(randomBetween(-16, 16)),
        '--scatter-start-x': formatScatterX(start.x),
        '--scatter-start-y': formatScatterY(start.y),
        '--scatter-start-rotate': formatDeg(randomBetween(-24, 24)),
        zIndex: index + 1,
      },
    }
  })
}

function StoreIcon({ platform }) {
  if (platform === 'android') {
    return (
      <svg
        className="store-button-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 3.65629C2 2.15127 3.59967 1.18549 4.93149 1.88645L20.7844 10.2301C22.2091 10.9799 22.2091 13.0199 20.7844 13.7698L4.9315 22.1134C3.59968 22.8144 2 21.8486 2 20.3436V3.65629ZM19.8529 11.9999L16.2682 10.1132L14.2243 11.9999L16.2682 13.8866L19.8529 11.9999ZM14.3903 14.875L12.75 13.3608L6.75782 18.8921L14.3903 14.875ZM12.75 10.639L14.3903 9.12488L6.75782 5.10777L12.75 10.639ZM4 5.28391L11.2757 11.9999L4 18.7159V5.28391Z"
        />
      </svg>
    )
  }

  return (
    <img
      className="store-button-icon"
      src={appleStoreIcon}
      alt=""
      aria-hidden="true"
    />
  )
}

function CardFan({ reduceMotion }) {
  return (
    <div className="card-fan" aria-label="Featured Unkind cards">
      {featuredCards.slice(0, 5).map((card, index) => (
        <Motion.figure
          key={card.title}
          className={`fan-card fan-card-${index + 1}`}
          animate={reduceMotion ? undefined : { y: [0, index % 2 ? -8 : 8, 0] }}
          transition={reduceMotion ? undefined : { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src={card.image} alt={`${card.title} card art`} />
          <figcaption>{card.title}</figcaption>
        </Motion.figure>
      ))}
    </div>
  )
}

function Home() {
  const reduceMotion = useReducedMotion()
  const titleScatterItems = useMemo(() => createTitleScatterLayout(), [])
  const [hasTitleReachedShapes, setHasTitleReachedShapes] = useState(false)
  const [hasTitleResolved, setHasTitleResolved] = useState(false)
  const handleTitleRevealComplete = useCallback(() => setHasTitleReachedShapes(true), [])
  const handleTitleResolveComplete = useCallback(() => setHasTitleResolved(true), [])

  return (
    <div className="site-shell celestial-site">
      <header className={`site-nav reveal-after-title ${hasTitleReachedShapes ? 'is-visible' : ''}`}>
        <a className="brand-lockup" href={APP_STORE_URL} target="_blank" rel="noreferrer" aria-label="Download Unkind on the App Store">
          <img src={logoIcon} alt="" />
          <span>Unkind</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#cards">Cards</a>
          <a href="#rules">Rules</a>
          <Link to="/privacy">Privacy</Link>
          <a href="https://github.com/projektlyoon/ProjektLyoonAssetShowcase" target="_blank" rel="noreferrer">
            <Github size={16} />
            Source
          </a>
        </nav>
      </header>

      <main>
        <section className="title-hero">
          <div className={`title-scatter-field ${hasTitleResolved ? 'is-scattered' : ''}`} aria-hidden="true">
            {titleScatterItems.map((item, index) => (
              <Motion.figure
                key={item.id}
                className={`title-scatter-item ${item.kind === 'card' ? 'is-card' : 'is-shot'}`}
                style={item.style}
                initial={{
                  opacity: 0,
                  x: 'var(--scatter-start-x)',
                  y: 'var(--scatter-start-y)',
                  rotate: 'var(--scatter-start-rotate)',
                  scale: 0.88,
                }}
                animate={hasTitleResolved
                  ? {
                      opacity: 1,
                      x: 'var(--scatter-x)',
                      y: 'var(--scatter-y)',
                      rotate: 'var(--scatter-rotate)',
                      scale: item.scale,
                    }
                  : undefined}
                transition={{
                  type: 'spring',
                  stiffness: 52,
                  damping: 22,
                  mass: 0.85,
                  delay: reduceMotion ? 0 : 0.06 + index * 0.035,
                }}
              >
                <img src={item.image} alt="" loading="eager" />
              </Motion.figure>
            ))}
          </div>
          <div className="title-hero-content">
            <AnimatedTitle
              maxWidth={600}
              onRevealComplete={handleTitleRevealComplete}
              onResolveComplete={handleTitleResolveComplete}
              shouldResolveToTitle
            />
            <h2 className={`title-hero-tagline reveal-after-title ${hasTitleReachedShapes ? 'is-visible' : ''}`}>
              Friendship-ending Ludo
            </h2>
            <div className={`store-row title-hero-store-row reveal-after-title ${hasTitleReachedShapes ? 'is-visible' : ''}`}>
              <a className="store-button store-primary" href={APP_STORE_URL} target="_blank" rel="noreferrer">
                <StoreIcon platform="apple" />
                App Store
              </a>
              <a className="store-button" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
                <StoreIcon platform="android" />
                Google Play
              </a>
            </div>
          </div>
          <button
            className={`title-hero-scroll reveal-after-title ${hasTitleReachedShapes ? 'is-visible' : ''}`}
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll to main content"
            tabIndex={hasTitleReachedShapes ? 0 : -1}
          >
            Scroll to play
            <ChevronDown size={20} />
          </button>
        </section>

        <section id="about" className="hero">
          <div className="hero-art">
            <div className="phone-frame">
              <img src={captureOpponent} alt="A live Unkind match with a card selected, opponent tokens threatened, and fuel at maximum." />
            </div>
            <figure className="hero-card hero-card-left">
              <img src={switchShot} alt="A Switch card being played over the Unkind board." />
            </figure>
            <figure className="hero-card hero-card-right">
              <img src={triggerTrapShot} alt="A mine trigger message showing a token was eliminated." />
            </figure>
          </div>

          <div className="hero-copy-block">
            <Motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Friendship-ending Ludo.
            </Motion.p>
            <Motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              Nobody is safe.
            </Motion.h1>
            <Motion.p
              className="hero-lede"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              Race your pieces home. Use cards to trap, swap, freeze, steal rolls, and kill
              pieces permanently in Unkind mode.
            </Motion.p>
          </div>
        </section>

        <section className="section proof-section">
          <div className="section-heading">
            <p className="eyebrow">How it plays</p>
            <h2>He needed one roll. You played one card.</h2>
          </div>
          <div className="moment-grid">
            <article className="moment-card">
              <img src={captureOpponent} alt="Unkind gameplay board with an opponent token threatened by a selected card." loading="lazy" />
              <div>
                <span>01</span>
                <h3>They are almost home.</h3>
              </div>
            </article>
            <article className="moment-card">
              <img src={switchShot} alt="Switch card being played on the board." loading="lazy" />
              <div>
                <span>02</span>
                <h3>You play one card.</h3>
              </div>
            </article>
            <article className="moment-card">
              <img src={triggerTrapShot} alt="Mine trigger message after a token is eliminated." loading="lazy" />
              <div>
                <span>03</span>
                <h3>Their piece dies.</h3>
              </div>
            </article>
          </div>
        </section>

        <section className="section modes-section">
          <div className="section-heading">
            <p className="eyebrow">Ways to play</p>
            <h2>Practice alone. Queue strangers. Betray friends.</h2>
          </div>
          <div className="mode-grid">
            {playModes.map((mode, index) => (
              <Motion.article
                key={mode.title}
                className="mode-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
              >
                <img src={mode.image} alt="" loading="lazy" />
                <div className="mode-card-shade" />
                <div className="mode-card-copy">
                  <span><mode.icon size={17} /> {mode.title}</span>
                  <p>{mode.copy}</p>
                </div>
              </Motion.article>
            ))}
          </div>
        </section>

        <section id="cards" className="section cards-section">
          <div className="section-heading">
            <p className="eyebrow">The cards</p>
            <h2>Cards are problems you hand to other people.</h2>
            <p>
              Mines. Freezes. Swaps. Stolen 6s. Broken safety. A lead can disappear before the next roll.
            </p>
          </div>
          <div className="cards-showcase">
            <figure className="card-action-shot">
              <img src={layTrapShot} alt="A Minefield card selected with valid target cells highlighted on the Unkind board." loading="lazy" />
              <figcaption>
                <span>Actual board targeting</span>
                <strong>Cards happen on the board, right where everyone can suffer.</strong>
              </figcaption>
            </figure>
            <CardFan reduceMotion={reduceMotion} />
          </div>
          <div className="card-grid">
            {featuredCards.map((card) => (
              <figure key={card.title} className="deck-card">
                <img src={card.image} alt={`${card.title} card`} loading="lazy" />
                <figcaption>
                  <span>{card.type}</span>
                  <strong>{card.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section pillars-section">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <pillar.icon size={22} />
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
            </article>
          ))}
        </section>

        <section id="rules" className="section rules-section">
          <div className="rules-copy">
            <p className="eyebrow">The pitch</p>
            <h2>Classic race. Dirty hands. Permanent death.</h2>
          </div>
          <ol className="rules-list">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>

        <section className="download-band">
          <div>
            <Gamepad2 size={26} />
            <h2>Play the friendship-ending version of Ludo.</h2>
            <p>Available on iOS and Android.</p>
          </div>
          <div className="store-row">
            <a className="store-button store-primary" href={APP_STORE_URL} target="_blank" rel="noreferrer">
              <StoreIcon platform="apple" />
              App Store
            </a>
            <a className="store-button" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
              <StoreIcon platform="android" />
              Google Play
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
