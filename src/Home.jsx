import { motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bot,
  ChevronDown,
  Gamepad2,
  Github,
  Globe2,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedTitle from './components/AnimatedTitle'
import Seo from './components/Seo'
import logoIcon from './assets/modern/unkind-icon.avif'
import captureOpponent from './assets/modern/capture-opponent.avif'
import layTrapShot from './assets/modern/lay-trap.avif'
import targetInRangeShot from './assets/target_in_range.webp'
import switchShot from './assets/modern/switch.avif'
import triggerTrapShot from './assets/modern/trigger-trap.avif'
import trapTriggerVideo from './assets/modern/trap_trig.mp4'
import globalArena from './assets/modern/global-arena.avif'
import privateMatch from './assets/modern/private-match.avif'
import soloPractice from './assets/modern/solo-practice.avif'
import adrenalineCard from './assets/cards/modern/adrenaline.avif'
import backPedalCard from './assets/cards/modern/back_pedal.avif'
import dashCard from './assets/cards/modern/dash.avif'
import deployCard from './assets/cards/modern/deploy.avif'
import freezeCard from './assets/cards/modern/freeze.avif'
import marchCard from './assets/cards/modern/march.avif'
import minefieldCard from './assets/cards/modern/minefield.avif'
import mirrorCard from './assets/cards/modern/mirror.avif'
import nudgeBackCard from './assets/cards/modern/nudge_back.avif'
import nudgeForwardCard from './assets/cards/modern/nudge_forward.avif'
import parasiteCard from './assets/cards/modern/parasite.avif'
import retreatCard from './assets/cards/modern/retreat.avif'
import ruinCard from './assets/cards/modern/ruin_path.avif'
import sacrificeCard from './assets/cards/modern/sacrifice.avif'
import shieldCard from './assets/cards/modern/shield.avif'
import switchCard from './assets/cards/modern/switch.avif'
import uturnCard from './assets/cards/modern/uturn.avif'
import warpCard from './assets/cards/modern/warp.avif'
import appleStoreIcon from './assets/apple-173.svg'

const APP_STORE_URL = 'https://apps.apple.com/de/app/unkind/id6760196649?l=en-GB'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.projektlyoon.unkind'
const SITE_URL = 'https://www.projektlyoon.com'

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
  { title: 'Nudge Forward (+1)', shortTitle: 'Nudge Forward', type: 'Move', image: nudgeForwardCard, fuelCost: 2, description: 'Move any eligible token 1 step forward.' },
  { title: 'Nudge Back (-1)', shortTitle: 'Nudge Back', type: 'Move', image: nudgeBackCard, fuelCost: 2, description: 'Move any eligible token 1 step back.' },
  { title: 'March (+3)', shortTitle: 'March', type: 'Move', image: marchCard, fuelCost: 3, description: 'Move any eligible token 3 steps forward.' },
  { title: 'Backpedal (-3)', shortTitle: 'Backpedal', type: 'Move', image: backPedalCard, fuelCost: 3, description: 'Move any eligible token 3 steps back.' },
  { title: 'Dash (+5)', shortTitle: 'Dash', type: 'Move', image: dashCard, fuelCost: 4, description: 'Move any eligible token 5 steps forward.' },
  { title: 'Retreat (-5)', shortTitle: 'Retreat', type: 'Move', image: retreatCard, fuelCost: 4, description: 'Move any eligible token 5 steps back.' },
  { title: 'Shield', shortTitle: 'Shield', type: 'Utility', image: shieldCard, fuelCost: 3, description: "Selected token can't be captured until your next turn." },
  { title: 'Switch', shortTitle: 'Switch', type: 'Utility', image: switchCard, fuelCost: 5, description: 'Swap places of your token and an enemy token.' },
  { title: 'Deploy', shortTitle: 'Deploy', type: 'Utility', image: deployCard, fuelCost: 5, description: 'Bring 1 token out of your yard.' },
  { title: 'Minefield', shortTitle: 'Minefield', type: 'Control', image: minefieldCard, fuelCost: 4, description: 'Drop a hidden mine on a cell.' },
  { title: 'Mirror Step', shortTitle: 'Mirror', type: 'Control', image: mirrorCard, fuelCost: 5, description: 'Selected enemy token moves opposite your direction on your next roll.' },
  { title: 'U-Turn', shortTitle: 'U-Turn', type: 'Control', image: uturnCard, fuelCost: 5, description: 'Flip turn order. Play again.' },
  { title: 'Freeze', shortTitle: 'Freeze', type: 'Control', image: freezeCard, fuelCost: 6, description: 'Skip the next player. Play again.' },
  { title: 'Adrenaline', shortTitle: 'Adrenaline', type: 'Control', image: adrenalineCard, fuelCost: 6, description: 'Play now, then get one more bonus turn.' },
  { title: 'Warp Jump', shortTitle: 'Warp Jump', type: 'Chaos', image: warpCard, fuelCost: 8, description: 'Teleport close to home.' },
  { title: 'Sacrifice', shortTitle: 'Sacrifice', type: 'Chaos', image: sacrificeCard, fuelCost: 9, description: 'Remove this token, bring out 2, then play again.' },
  { title: 'Ruin Path', shortTitle: 'Ruin Path', type: 'Chaos', image: ruinCard, fuelCost: 8, description: 'Safe and spawn cells are risky for 2 rounds.' },
  { title: 'Parasite', shortTitle: 'Parasite', type: 'Chaos', image: parasiteCard, fuelCost: 6, description: 'If your token is on an enemy start cell, steal their 6 rolls.' },
]

const rules = [
  'Get around the board before they do.',
  'Earn fuel by moving.',
  'Spend it to make their turn worse.',
  'In Unkind mode, dead tokens stay dead.',
]

const titleScatterCardSources = featuredCards.map((card) => ({
  image: card.image,
  alt: `${card.title} card`,
  kind: 'card',
}))

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
const pickNextUnusedSource = (sources, index, usedSources) => {
  for (let offset = 0; offset < sources.length; offset += 1) {
    const nextIndex = index + offset
    const source = sources[nextIndex % sources.length]
    if (!usedSources.has(source.image)) {
      return { source, index: nextIndex + 1 }
    }
  }

  return {
    source: sources[index % sources.length],
    index: index + 1,
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
  const slots = titleScatterSlots.slice(0, titleScatterCardSources.length)
  const cardSources = shuffle(titleScatterCardSources)
  let cardIndex = 0
  const usedSources = new Set()

  return slots.map((slot, index) => {
    const picked = pickNextUnusedSource(cardSources, cardIndex, usedSources)
    const source = picked.source
    cardIndex = picked.index
    usedSources.add(source.image)
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
      alt="Apple logo"
    />
  )
}

const cardFanLayouts = [
  [
    { left: '5%', top: '12%', rotate: -15, zIndex: 1, drift: 7, duration: 5.2 },
    { left: '20%', top: '4%', rotate: -8, zIndex: 2, drift: -8, duration: 6.1 },
    { left: '35%', top: '0%', rotate: -2, zIndex: 3, drift: 6, duration: 5.7 },
    { right: '35%', top: '0%', rotate: 3, zIndex: 3, drift: -7, duration: 6.4 },
    { right: '20%', top: '5%', rotate: 9, zIndex: 2, drift: 8, duration: 5.9 },
    { right: '5%', top: '14%', rotate: 15, zIndex: 1, drift: -6, duration: 6.7 },
  ],
  [
    { left: '6%', top: '24%', rotate: -4, zIndex: 1, drift: -6, duration: 6.3 },
    { left: '19%', top: '12%', rotate: -11, zIndex: 2, drift: 9, duration: 5.5 },
    { left: '34%', top: '2%', rotate: -5, zIndex: 3, drift: -7, duration: 6.8 },
    { right: '34%', top: '8%', rotate: 6, zIndex: 4, drift: 8, duration: 5.8 },
    { right: '20%', top: '18%', rotate: 13, zIndex: 2, drift: -9, duration: 6.5 },
    { right: '4%', top: '7%', rotate: -2, zIndex: 1, drift: 6, duration: 5.9 },
  ],
  [
    { left: '5%', top: '4%', rotate: 10, zIndex: 1, drift: 8, duration: 5.6 },
    { left: '20%', top: '17%', rotate: -13, zIndex: 2, drift: -7, duration: 6.6 },
    { left: '35%', top: '8%', rotate: 4, zIndex: 4, drift: 9, duration: 5.8 },
    { right: '35%', top: '3%', rotate: -7, zIndex: 3, drift: -8, duration: 6.2 },
    { right: '20%', top: '14%', rotate: 11, zIndex: 2, drift: 7, duration: 6.9 },
    { right: '5%', top: '24%', rotate: 5, zIndex: 1, drift: -6, duration: 5.4 },
  ],
]

function WebsiteHandCard({ card, loading = 'lazy' }) {
  return (
    <div className="website-hand-card" tabIndex={0} aria-label={`${card.title} card. ${card.description}`}>
      <div className="website-hand-card-inner">
        <div className="website-hand-card-face website-hand-card-front">
          <img src={card.image} alt={`${card.title} card art`} loading={loading} />
          <div className="hand-card-front-name" aria-hidden="true">
            <span className="hand-card-front-name-outline">{card.title}</span>
            <span className="hand-card-front-name-glow">{card.title}</span>
            <span>{card.title}</span>
          </div>
        </div>
        <div className="website-hand-card-face website-hand-card-back" aria-hidden="true">
          <img className="hand-card-back-art" src={card.image} alt={`${card.title} card background`} loading={loading} />
          <span className="hand-card-shimmer" />
          <div className="hand-card-back-content">
            <div className="hand-card-back-top">
              <strong>{card.title}</strong>
            </div>
            <p>{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardFan({ cards = featuredCards.slice(0, 6), layoutIndex = 0, reduceMotion }) {
  const layout = cardFanLayouts[layoutIndex % cardFanLayouts.length]

  return (
    <div className={`card-fan card-fan-${layoutIndex + 1}`} aria-label="Featured Unkind cards">
      {cards.map((card, index) => (
        <Motion.figure
          key={card.title}
          className="fan-card"
          style={layout[index]}
          whileHover={{
            y: layout[index].drift - 18,
            rotate: layout[index].rotate * 0.35,
            scale: 1.08,
            zIndex: 20,
          }}
          animate={reduceMotion ? undefined : {
            y: [0, layout[index].drift, 0],
            rotate: [layout[index].rotate, layout[index].rotate + Math.sign(layout[index].drift) * 1.4, layout[index].rotate],
          }}
          transition={reduceMotion ? undefined : {
            duration: layout[index].duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: layoutIndex * 0.35 + index * 0.08,
          }}
        >
          <WebsiteHandCard card={card} />
        </Motion.figure>
      ))}
    </div>
  )
}

const featuredCardFan = featuredCards.slice(6, 12)
const extraCards = [
  ...featuredCards.slice(0, 6),
  ...featuredCards.slice(12, 18),
]

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Projekt Lyoon',
      url: SITE_URL,
      sameAs: ['https://github.com/projektlyoon/ProjektLyoonAssetShowcase'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Unkind',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'VideoGame',
      '@id': `${SITE_URL}/#game`,
      name: 'Unkind',
      alternateName: 'UNKIND',
      slogan: 'Friendship-ending Ludo',
      url: SITE_URL,
      description: 'Unkind is a tactical board game by Projekt Lyoon with dice movement, card play, fuel economy, solo practice, global multiplayer, private matches, and an Unkind mode where tokens can die.',
      genre: ['Strategy', 'Board game', 'Card game', 'Dice game', 'Multiplayer'],
      applicationCategory: 'Game',
      operatingSystem: ['iOS', 'Android'],
      gamePlatform: ['iOS', 'Android'],
      playMode: ['SinglePlayer', 'MultiPlayer'],
      numberOfPlayers: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 4,
      },
      downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
      publisher: { '@id': `${SITE_URL}/#organization` },
      creator: {
        '@type': 'Person',
        name: 'Nikhil Yadav',
      },
      sameAs: [
        APP_STORE_URL,
        PLAY_STORE_URL,
        'https://github.com/projektlyoon/ProjektLyoonAssetShowcase',
      ],
      inLanguage: 'en',
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#cards`,
      name: 'Unkind card list',
      itemListElement: featuredCards.map((card, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: card.title,
          description: card.description,
          category: card.type,
        },
      })),
    },
  ],
}

function Home() {
  const reduceMotion = useReducedMotion()
  const titleScatterItems = useMemo(() => createTitleScatterLayout(), [])
  const [hasTitleReachedShapes, setHasTitleReachedShapes] = useState(false)
  const [hasTitleResolved, setHasTitleResolved] = useState(false)
  const [showMoreCards, setShowMoreCards] = useState(false)
  const [hasPassedTitleHero, setHasPassedTitleHero] = useState(false)
  const { logoStoreUrl, logoAriaLabel } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        logoStoreUrl: APP_STORE_URL,
        logoAriaLabel: 'Download Unkind on the App Store',
      }
    }

    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera
    const isApple = /iPad|iPhone|iPod|Mac/i.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

    return isApple
      ? {
          logoStoreUrl: APP_STORE_URL,
          logoAriaLabel: 'Download Unkind on the App Store',
        }
      : {
          logoStoreUrl: PLAY_STORE_URL,
          logoAriaLabel: 'Download Unkind on the Google Play Store',
        }
  }, [])
  const handleTitleRevealComplete = useCallback(() => setHasTitleReachedShapes(true), [])
  const handleTitleResolveComplete = useCallback(() => setHasTitleResolved(true), [])

  useEffect(() => {
    const updateFooterPosition = () => {
      const titleHero = document.querySelector('.title-hero')
      setHasPassedTitleHero((titleHero?.getBoundingClientRect().bottom ?? 1) <= 0)
    }

    updateFooterPosition()
    window.addEventListener('scroll', updateFooterPosition, { passive: true })
    window.addEventListener('resize', updateFooterPosition)

    return () => {
      window.removeEventListener('scroll', updateFooterPosition)
      window.removeEventListener('resize', updateFooterPosition)
    }
  }, [])

  return (
    <div className="site-shell celestial-site">
      <Seo
        title="Unkind | Friendship-ending Ludo by Projekt Lyoon"
        description="Unkind is a tactical board game with dice movement, fuel economy, brutal cards, solo practice, global multiplayer, private matches, and an Unkind mode where tokens can die."
        jsonLd={homeJsonLd}
      />
      <main>
        <section className="title-hero">
          <div className={`title-scatter-field ${hasTitleResolved ? 'is-scattered' : ''}`} aria-hidden="true">
            {titleScatterItems.map((item, index) => (
              <Motion.figure
                key={item.id}
                className="title-scatter-item is-card"
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
                <img src={item.image} alt={item.alt} loading="eager" />
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
              document.getElementById('how-it-plays')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll to main content"
            tabIndex={hasTitleReachedShapes ? 0 : -1}
          >
            Scroll to play
            <ChevronDown size={20} />
          </button>
        </section>

        <section id="how-it-plays" className="section proof-section">
          <div className="section-heading">
            <p className="eyebrow">How it plays</p>
            <h2>Set the trap. Wait for the mistake.</h2>
          </div>
          <div className="moment-grid">
            <article className="moment-card">
              <img src={layTrapShot} alt="Minefield card selected while valid trap cells glow on the Unkind board." loading="lazy" />
              <div>
                <span>01</span>
                <h3>Place a mine on the board.</h3>
              </div>
            </article>
            <article className="moment-card">
              <img src={targetInRangeShot} alt="Enemy token in range after moving close to a hidden trap on the Unkind board." loading="lazy" />
              <div>
                <span>02</span>
                <h3>They move into range.</h3>
              </div>
            </article>
            <article className="moment-card">
              <video
                src={trapTriggerVideo}
                aria-label="Animated mine trigger sequence after a token is eliminated."
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
              <div>
                <span>03</span>
                <h3>Force the capture.</h3>
              </div>
            </article>
          </div>
        </section>

        <section id="cards" className="section cards-section">
          <div className="section-heading">
            <p className="eyebrow">The cards</p>
            <h2>That was just the first bad idea.</h2>
            <p>
              Chain cards, set traps inside traps, and turn one small opening into a full table flip.
            </p>
          </div>
          <div className="card-fan-gallery" aria-label="All Unkind cards">
            <CardFan
              cards={featuredCardFan}
              reduceMotion={reduceMotion}
            />
            {!showMoreCards ? (
              <button
                className="more-cards-line"
                type="button"
                onClick={() => setShowMoreCards(true)}
              >
                And 12 more ways to ruin a perfectly good turn.
              </button>
            ) : null}
            {showMoreCards ? (
              <Motion.div
                className="card-grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.055,
                    },
                  },
                }}
              >
                {extraCards.map((card, index) => (
                  <Motion.figure
                    key={card.title}
                    className="deck-card"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: reduceMotion ? 0 : 24,
                        scale: reduceMotion ? 1 : 0.96,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      },
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.42,
                      ease: 'easeOut',
                      delay: reduceMotion ? 0 : index * 0.015,
                    }}
                  >
                    <WebsiteHandCard card={card} />
                  </Motion.figure>
                ))}
              </Motion.div>
            ) : null}
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
                <img src={mode.image} alt={`${mode.title} mode in Unkind`} loading="lazy" />
                <div className="mode-card-shade" />
                <div className="mode-card-copy">
                  <span><mode.icon size={17} /> {mode.title}</span>
                  <p>{mode.copy}</p>
                </div>
              </Motion.article>
            ))}
          </div>
        </section>

        <section id="about" className="hero">
          <div className="hero-art">
            <figure className="phone-frame">
              <img src={captureOpponent} alt="A live Unkind match with a card selected, opponent tokens threatened, and fuel at maximum." />
            </figure>
            <figure className="hero-card hero-card-left">
              <img src={switchShot} alt="A Switch card being played over the Unkind board." />
            </figure>
            <figure className="hero-card hero-card-right">
              <img src={triggerTrapShot} alt="A mine trigger message showing a token was eliminated." />
            </figure>
            <figure className="hero-card hero-card-top">
              <img src={layTrapShot} alt="Minefield card selected with valid target cells highlighted on the Unkind board." loading="lazy" />
            </figure>
            <figure className="hero-card hero-card-bottom">
              <img src={targetInRangeShot} alt="Enemy token in range after moving close to a hidden trap on the Unkind board." loading="lazy" />
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
              Race your tokens home. Use cards to trap, swap, freeze, steal rolls, and kill
              tokens permanently in Unkind mode.
            </Motion.p>
          </div>
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
      <footer className={`site-footer ${hasPassedTitleHero ? 'is-sticky' : ''}`}>
        <a className="brand-lockup" href={logoStoreUrl} target="_blank" rel="noreferrer" aria-label={logoAriaLabel}>
          <img src={logoIcon} alt="Unkind app icon" />
          <span>Unkind</span>
        </a>

        <nav className="nav-links" aria-label="Footer navigation">
          <Link to="/privacy">Privacy</Link>
          <a href="https://github.com/projektlyoon/ProjektLyoonAssetShowcase" target="_blank" rel="noreferrer">
            <Github size={16} />
            Source
          </a>
        </nav>
      </footer>
    </div>
  )
}

export default Home
