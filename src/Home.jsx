import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useSyncExternalStore } from 'react'
import {
  ArrowRight,
  BookOpen,
  Dice6,
  Github,
  Sparkles,
  Swords,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from './assets/unkindbaseNobackground.png'
import logoIcon from './assets/unkindico.png'

const screenshotModules = import.meta.glob('./assets/screenshots/*.{PNG,png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const screenshots = Object.fromEntries(
  Object.entries(screenshotModules).map(([path, src]) => [path.split('/').pop(), src]),
)

const heroShots = [
  screenshots['warpjump_showcase.PNG'],
  screenshots['mirrorstep_showcase.PNG'],
  screenshots['sacrifice_showcase.PNG'],
]

const featurePanels = [
  {
    kicker: 'Movement Systems',
    title: 'Position decides tempo.',
    copy:
      'Movement cards manipulate the board state, securing safe ground or setting up captures before the dice even roll.',
    image: screenshots['dash_play.PNG'],
  },
  {
    kicker: 'Control Cards',
    title: 'Safe squares stop feeling safe.',
    copy:
      'Freeze, Minefield, Mirror Step, and Ruin Path change how players read the board and when they commit.',
    image: screenshots['minefield_play.PNG'],
  },
  {
    kicker: 'Solo Play',
    title: 'Offline Clankers hit back.',
    copy:
      'Solo play works fully offline, and the Clankers are strong enough to punish loose turns and greedy pushes.',
    image: screenshots['mirrorstep_play.PNG'],
  },
]

const categoryMeta = {
  Movement: {
    kicker: 'Movement Cards',
    title: 'Tempo starts with movement.',
    description:
      'These cards shape the board state, helping you hold safe ground, pressure key cells, and line up captures ahead of time.',
    image: screenshots['march_play.PNG'],
  },
  'Force Movement': {
    kicker: 'Force Cards',
    title: 'Displacement changes the board.',
    description:
      'Displacement breaks the board. Force cards ignore start-square immunity, dragging opponents out of safety.',
    image: screenshots['force_dash_showcase.PNG'],
  },
  Utility: {
    kicker: 'Utility Cards',
    title: 'Flexible tools for key turns.',
    description:
      'Shield, Deploy, and Switch create swing turns by protecting tempo, accelerating entries, or changing matchups.',
    image: screenshots['switch_play.PNG'],
  },
  Control: {
    kicker: 'Control Cards',
    title: 'Board control without guesswork.',
    description:
      "Dictate the tempo. Trap the board with Minefields or use Mirror Step to turn your opponent's progress against them.",
    image: screenshots['freeze_play.PNG'],
  },
  Chaos: {
    kicker: 'Chaos Cards',
    title: 'High-risk cards with real upside.',
    description:
      'These are the swing cards. Sacrifice your progress for sudden deployment, or Warp Jump across the loop to steal a finish.',
    image: screenshots['warpjump_play.PNG'],
  },
}

const cardShowcaseGroups = {
  Movement: [
    { title: 'Nudge Forward', showcase: 'nudge_showcase.PNG', play: 'nudge_play.PNG' },
    { title: 'Nudge Back', showcase: 'nudge_back_showcase.PNG', play: 'nudge_back_play.PNG' },
    { title: 'March', showcase: 'march_showcase.PNG', play: 'march_play.PNG' },
    { title: 'Backpedal', showcase: 'backpedal_showcase.PNG', play: 'backpedal_play.PNG' },
    { title: 'Dash', showcase: 'dash_showcase.PNG', play: 'dash_play.PNG' },
    { title: 'Retreat', showcase: 'retreat_showcase.PNG', play: 'retreat_play.PNG' },
  ],
  'Force Movement': [
    { title: 'Force Nudge Forward', showcase: 'force_nudge_fw_showcase.PNG' },
    { title: 'Force Nudge Back', showcase: 'force_nudge_back_showcase.PNG' },
    { title: 'Force March', showcase: 'force_march_showcase.PNG' },
    { title: 'Force Backpedal', showcase: 'force_backpedal_showcase.PNG' },
    { title: 'Force Dash', showcase: 'force_dash_showcase.PNG' },
    { title: 'Force Retreat', showcase: 'force_retreat_showcase.PNG' },
  ],
  Utility: [
    { title: 'Shield', showcase: 'shield_showcase.PNG', play: 'shield_play.PNG' },
    { title: 'Deploy', showcase: 'deploy_showcase.PNG', play: 'deploy_play.PNG' },
    { title: 'Switch', showcase: 'switch_showcase.PNG', play: 'switch_play.PNG' },
  ],
  Control: [
    { title: 'Minefield', showcase: 'minefield_showcase.PNG', play: 'minefield_play.PNG' },
    { title: 'Mirror Step', showcase: 'mirrorstep_showcase.PNG', play: 'mirrorstep_play.PNG' },
    { title: 'U-Turn', showcase: 'uturn_showcase.PNG', play: 'uturn_play.PNG' },
    { title: 'Freeze', showcase: 'freeze_showcase.PNG', play: 'freeze_play.PNG' },
    { title: 'Adrenaline', showcase: 'adrenaline_showcase.PNG', play: 'adrenaline_play.PNG' },
  ],
  Chaos: [
    { title: 'Warp Jump', showcase: 'warpjump_showcase.PNG', play: 'warpjump_play.PNG' },
    { title: 'Sacrifice', showcase: 'sacrifice_showcase.PNG', play: 'sacrifice_play.PNG' },
    { title: 'Ruin Path', showcase: 'ruin_showcase.PNG', play: 'ruin_play.PNG' },
  ],
}

const rules = [
  {
    title: 'Victory Conditions',
    blocks: [
      {
        heading: 'Standard',
        bullets: ['First player to get all 4 tokens into the Home Triangle wins.'],
      },
      {
        heading: 'Unkind',
        bullets: [
          'Flawless Victory: 4 tokens in the Home Triangle.',
          "Survivor's Escape: all remaining living tokens are in the Home Triangle, with at least one still alive.",
          'Last Survivor: only one player has tokens that are not DEAD and not in the Home Triangle.',
        ],
      },
    ],
  },
  {
    title: 'Safety and Pressure',
    bullets: [
      'Safe squares block capture and most enemy card targeting unless Ruin Path is active.',
      'Force cards can still target opponents on their own start squares.',
      'Home column and home triangle cannot be captured.',
    ],
  },
  {
    title: 'Turn Lifecycle',
    blocks: [
      { heading: 'Turn start', bullets: ['Each turn starts in WAITING_FOR_ACTION.'] },
      {
        heading: 'Handover',
        bullets: ['Incoming shields are cleared.', 'Incoming hand refills to 3 unique cards.'],
      },
      {
        heading: 'Turn end',
        bullets: [
          'Current hand is flushed to discard.',
          'Pin one card to carry it over to your next turn, bypassing the hand flush.',
        ],
      },
      {
        heading: 'Timer',
        bullets: ['Ruin Path lasts for 2 full rounds.'],
      },
    ],
  },
  {
    title: 'Dice and Movement',
    blocks: [
      {
        heading: 'Core rules',
        bullets: [
          'Rolls resolve from 1 to 6.',
          'A Yard token needs 6 to spawn.',
          'Resolved dice movement grants 7 minus the dice result in fuel.',
          'Fuel caps at 12.',
        ],
      },
      {
        heading: 'Movement limits',
        bullets: [
          'Tokens cannot move backward past their own start.',
          'Home Triangle requires exact entry.',
          'Overshoots are clamped and canceled.',
        ],
      },
      {
        heading: 'Pity fuel',
        bullets: ['If no legal dice move exists, gain +1 fuel.', 'Rolling 6 still retains the extra turn.'],
      },
    ],
  },
  {
    title: 'Capture, Lives, and Scoring Pressure',
    blocks: [
      {
        heading: 'Capture',
        bullets: [
          'Capture applies only when two active tokens share the same public-loop square.',
          'Shielded tokens are immune to capture and enemy card effects.',
          'On capture, the owner loses half their fuel rounded down.',
        ],
      },
      {
        heading: 'Lives',
        bullets: [
          'Unkind tokens start with 2 lives.',
          'Capture or mine hit removes 1 life.',
          'At 0 lives the token becomes DEAD, otherwise it returns to Yard.',
        ],
      },
      {
        heading: 'Endgame points',
        bullets: [
          'Home Triangle: +5.',
          'Active or Home Column: +2.',
          'Yard: +1.',
          'Dead: 0.',
        ],
      },
    ],
  },
  {
    title: 'Card Constraints and Flow',
    blocks: [
      {
        heading: 'General limits',
        bullets: [
          'Cards cannot be played while a dice movement is pending resolution.',
          'Only movement cards can be burned.',
          'Burn grants +2 fuel once per turn.',
        ],
      },
      {
        heading: 'Targeting',
        bullets: [
          'Movement cards target active track tokens or your own Home Column tokens.',
          'Opponent safe-zone targets are blocked unless Ruin Path is active or Force hits a start square.',
          'Switch requires two active targets from different owners.',
        ],
      },
      {
        heading: 'Extra turns',
        bullets: [
          'Roll 6, capture, reaching Home Triangle, and certain cards grant extra turns.',
          'Extra turns do not stack as a counter.',
          'Adrenaline is the exception and guarantees a second bonus turn.',
        ],
      },
    ],
  },
]

const manifestoStats = [
  { icon: Dice6, label: 'Play Anywhere', value: 'Online + Offline' },
  { icon: Swords, label: 'Modes', value: 'Standard + Unkind' },
  { icon: Sparkles, label: 'Hand Size', value: '3 Cards' },
]

const APP_STORE_URL = 'https://apps.apple.com/de/app/unkind/id6760196649?l=en-GB'

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onStoreChange)

      return () => mediaQuery.removeEventListener('change', onStoreChange)
    },
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    () => false,
  )
}

function AppleBrandIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      className="brand-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M17.05 12.536c-.02-2.158 1.763-3.195 1.844-3.244-1.01-1.476-2.58-1.679-3.13-1.702-1.333-.134-2.6.785-3.278.785-.68 0-1.73-.766-2.845-.746-1.462.022-2.812.85-3.563 2.156-1.52 2.634-.387 6.536 1.092 8.673.724 1.044 1.588 2.216 2.722 2.174 1.09-.043 1.5-.702 2.817-.702 1.318 0 1.688.702 2.838.68 1.175-.02 1.918-1.066 2.636-2.114.832-1.214 1.175-2.39 1.194-2.45-.025-.008-2.289-.878-2.327-3.51ZM14.893 6.182c.602-.73 1.008-1.747.897-2.757-.868.035-1.919.579-2.542 1.308-.559.648-1.048 1.684-.917 2.674.968.075 1.959-.49 2.562-1.225Z" />
    </svg>
  )
}

function AndroidBrandIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      className="brand-icon android-brand-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M7.523 7.195 5.867 4.326a.52.52 0 0 1 .19-.709.517.517 0 0 1 .706.19l1.684 2.915A9.782 9.782 0 0 1 12 6.081c1.26 0 2.464.236 3.553.661l1.684-2.915a.518.518 0 0 1 .706-.19.52.52 0 0 1 .19.709l-1.656 2.869c2.325 1.139 3.933 3.108 4.214 5.414H3.31c.28-2.306 1.888-4.275 4.213-5.434Zm8.158 2.53a.62.62 0 1 0 0-1.24.62.62 0 0 0 0 1.24Zm-7.361 0a.62.62 0 1 0 0-1.24.62.62 0 0 0 0 1.24ZM3.318 13.668v5.507c0 .9.728 1.628 1.627 1.628h1.084v2.117c0 .596.484 1.08 1.08 1.08h.217c.596 0 1.08-.484 1.08-1.08v-2.117h7.188v2.117c0 .596.484 1.08 1.08 1.08h.217c.596 0 1.08-.484 1.08-1.08v-2.117h1.084c.9 0 1.627-.728 1.627-1.628v-5.507H3.318Z" />
    </svg>
  )
}

function FeaturePanel({ panel, index }) {
  return (
    <Motion.article
      className="feature-panel"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <div className="feature-panel-media">
        <img src={panel.image} alt={panel.title} loading="lazy" />
      </div>
      <div className="feature-panel-copy">
        <p>{panel.kicker}</p>
        <h3>{panel.title}</h3>
        <span>{panel.copy}</span>
      </div>
    </Motion.article>
  )
}

function ShowcaseBand({ heading, cards, index, disableMotion }) {
  const bandRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [40, -30] : [-40, 30])
  const cardY = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [-10, 20] : [10, -20])
  const meta = categoryMeta[heading]
  const shouldReduceMotion = prefersReducedMotion || disableMotion

  return (
    <Motion.section
      ref={bandRef}
      className={`showcase-band${index % 2 === 1 ? ' showcase-band-reverse' : ''}`}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7 }}
    >
      <div className="showcase-copy">
        <p className="section-kicker">{meta.kicker}</p>
        <h2>{meta.title}</h2>
        <p className="showcase-description">{meta.description}</p>
      </div>

      <div className="showcase-media">
        <Motion.div
          className="showcase-hero-frame"
          style={{ y: shouldReduceMotion ? 0 : imageY }}
        >
          <img src={meta.image} alt={meta.title} loading="lazy" />
          <div className="showcase-hero-overlay" />
        </Motion.div>

        <Motion.div
          className="showcase-card-strip"
          style={{ y: shouldReduceMotion ? 0 : cardY }}
        >
          {cards.map((card) => (
            <Motion.figure
              key={card.title}
              className="showcase-mini-card"
              whileHover={shouldReduceMotion ? undefined : { y: -8, rotate: 0, scale: 1.02 }}
            >
              <img src={screenshots[card.showcase]} alt={`${card.title} showcase`} loading="lazy" />
              <figcaption>{card.title}</figcaption>
            </Motion.figure>
          ))}
        </Motion.div>
      </div>
    </Motion.section>
  )
}

function Home() {
  const pageRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isCompactLayout = useMediaQuery('(max-width: 900px)')
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  })

  const heroLeftY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const heroCenterY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroRightY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div ref={pageRef} className="site-shell reimagined-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-lines" />
      <div className="hero-noise" />

      <header className="top-bar top-bar-floating">
        <div className="top-bar-brand">
          <a href={APP_STORE_URL} target="_blank" rel="noreferrer" aria-label="Download Unkind on the App Store">
            <img className="top-bar-logo" src={logoIcon} alt="Unkind logo" />
          </a>
          <p className="kicker">Unkind from Projekt Lyoon</p>
        </div>
        <div className="top-bar-links">
          <a
            className="pill-link"
            href="https://github.com/projektlyoon/ProjektLyoonAssetShowcase"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={14} />
            Open Source
          </a>
          <Link className="pill-link" to="/privacy">
            Privacy
          </Link>
        </div>
      </header>

      <main className="hero-wrap cinematic-home">
        <section className="hero-stage-section">
          <div className="hero-copy-column">
            <Motion.p
              className="section-kicker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tactical board game
            </Motion.p>
            <Motion.h1
              className="hero-title hero-title-giant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
            >
              Play Mean.
              <span className="hero-title-sub">Become Unkind.</span>
            </Motion.h1>
            <Motion.p
              className="hero-copy hero-copy-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              Unkind is a tactical board game where dice movement, card play, and fuel economy shape
              every turn. Play offline against sharp Clankers or jump into multiplayer and learn how
              standard play changes under Unkind mode.
            </Motion.p>

            <Motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              <a
                className="cta-primary"
                href={APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
              >
                <AppleBrandIcon size={18} />
                Download on the App Store
                <ArrowRight size={18} />
              </a>
              <a className="cta-secondary" href="mailto:projektlyoon@gmail.com">
                Contact Developer
              </a>
              <span className="cta-secondary cta-disabled" aria-label="Android version coming soon">
                <AndroidBrandIcon size={18} />
                Android Coming Soon
              </span>
            </Motion.div>

            <Motion.div
              className="manifesto-stats"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
            >
              {manifestoStats.map((item) => (
                <div key={item.label} className="manifesto-stat">
                  <item.icon size={18} />
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </Motion.div>
          </div>

          <div className="hero-visual-column">
            <Motion.div
              className="hero-shot hero-shot-left"
              style={{ y: prefersReducedMotion || isCompactLayout ? 0 : heroLeftY }}
            >
              <img src={heroShots[0]} alt="Warp Jump showcase" />
            </Motion.div>
            <Motion.div
              className="hero-shot hero-shot-center"
              style={{ y: prefersReducedMotion || isCompactLayout ? 0 : heroCenterY }}
            >
              <img src={heroShots[1]} alt="Mirror Step showcase" />
            </Motion.div>
            <Motion.div
              className="hero-shot hero-shot-right"
              style={{ y: prefersReducedMotion || isCompactLayout ? 0 : heroRightY }}
            >
              <img src={heroShots[2]} alt="Sacrifice showcase" />
            </Motion.div>
            <Motion.img
              className="hero-logo-mark"
              src={logo}
              alt="Unkind logo"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            />
          </div>
        </section>

        <section className="feature-rail">
          {featurePanels.map((panel, index) => (
            <FeaturePanel key={panel.title} panel={panel} index={index} />
          ))}
        </section>

        <section className="systems-banner">
          <div className="systems-copy">
            <p className="section-kicker">Solo Play</p>
            <h2>Play offline against Clankers that make you earn every win.</h2>
            <p className="systems-copy-body">
              Solo matches run offline, and the Clankers are built to punish lazy sequencing,
              careless pushes, and weak fuel management.
            </p>
          </div>
        </section>

        {Object.entries(cardShowcaseGroups).map(([heading, cards], index) => (
          <ShowcaseBand
            key={heading}
            heading={heading}
            cards={cards}
            index={index}
            disableMotion={isCompactLayout}
          />
        ))}

        <section className="rules-manifesto">
          <div className="rules-manifesto-header">
            <p className="section-kicker">Rules Reference</p>
            <h2>Core rules, win conditions, card flow, and board logic in one place.</h2>
          </div>

          <div className="rules-manifesto-grid">
            {rules.map((section, index) => (
              <Motion.article
                key={section.title}
                className="manifesto-card"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, delay: index * 0.04 }}
              >
                <div className="manifesto-card-index">{String(index + 1).padStart(2, '0')}</div>
                <h3>{section.title}</h3>

                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {section.blocks
                  ? section.blocks.map((block) => (
                      <div key={block.heading} className="manifesto-block">
                        <h4>{block.heading}</h4>
                        <ul>
                          {block.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  : null}
              </Motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
