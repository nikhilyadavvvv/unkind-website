import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Dice6, Sparkles, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from './assets/unkindbaseNobackground.png'

const sectionOrder = [
  '1. Objective',
  '2. Board, Path, and Safety',
  '3. Turn Flow',
  '4. Dice, Movement, and Fuel',
  '5. Captures and Penalties',
  '6. Hand and Pin System',
  '7. Card Rules',
  '8. Unkind Scoring (Ranking / Tie-break)',
]

const rules = [
  {
    title: '1. Objective',
    intro: 'Win conditions differ by mode.',
    blocks: [
      {
        heading: 'Standard Mode',
        bullets: ['Be the first player to get all 4 tokens into HOME_TRIANGLE.'],
      },
      {
        heading: 'Unkind Mode',
        bullets: [
          'Flawless Victory: Get all 4 tokens into HOME_TRIANGLE.',
          "Survivor's Escape: Get all your remaining living tokens home.",
          'Last Survivor: Be the last player with any token not DEAD/HOME_TRIANGLE.',
        ],
      },
    ],
  },
  {
    title: '2. Board, Path, and Safety',
    bullets: [
      'Public path length: 52 steps.',
      'Start indices: GREEN 0, BLUE 13, YELLOW 26, RED 39.',
      'Safe-zone indices: 0, 8, 13, 21, 26, 34, 39, 47.',
      'Home column is always safe from opponent displacement/capture.',
    ],
  },
  {
    title: '3. Turn Flow',
    blocks: [
      {
        heading: 'Turn structure',
        bullets: [
          'Start: clear your shield status (if active) and refill hand up to 3 cards.',
          'Action: roll or play cards.',
          'End: flush all unpinned cards; keep only pinned card (if any).',
        ],
      },
      {
        heading: 'Extra turn triggers',
        bullets: [
          'Roll a 6.',
          'Capture with dice or eligible card effects.',
          'One of your tokens reaches HOME_TRIANGLE.',
          'Use Shield, Freeze, or U-Turn.',
          'Adrenaline is active.',
        ],
      },
      {
        heading: 'No legal move after rolling',
        bullets: ['Gain +1 pity fuel.', 'If the roll was 6, you still get the extra turn.'],
      },
    ],
  },
  {
    title: '4. Dice, Movement, and Fuel',
    bullets: [
      'Spawn from Yard requires rolling 6.',
      'Fuel gain from dice: 7 - diceValue.',
      'Fuel cap: 12.',
      'Entering HOME_TRIANGLE requires exact movement.',
      'Overshoot is clamped (token does not move).',
      'Moving backward before start progress is clamped.',
    ],
  },
  {
    title: '5. Captures and Penalties',
    blocks: [
      {
        heading: 'Capture rules',
        bullets: [
          'Capture occurs when an active token lands on an opponent active token on a capturable square.',
          'No normal captures on safe zones (except Sacrifice deploy captures).',
          'Shielded enemy tokens cannot be captured.',
          'Victim fuel penalty: fuel is halved (floor).',
        ],
      },
      {
        heading: 'Unkind Mode lives',
        bullets: [
          'Each token starts with 2 lives.',
          'On capture: lose 1 life.',
          'If life reaches 0, token becomes DEAD; otherwise it returns to Yard.',
        ],
      },
      {
        heading: 'Standard Mode capture result',
        bullets: ['Tokens effectively have unlimited lives and return to Yard on capture.'],
      },
    ],
  },
  {
    title: '6. Hand and Pin System',
    bullets: [
      'Max hand size: 3.',
      'Hand refills to 3 at start of your turn.',
      'End of turn: all unpinned cards are discarded.',
      'You can pin one card; pinning another card replaces the previous one.',
    ],
  },
  {
    title: '7. Card Rules',
    blocks: [
      {
        heading: '7.1 Movement Cards',
        bullets: [
          'Nudge Forward (+1), Nudge Back (-1), March (+3), Backpedal (-3), Dash (+5), Retreat (-5).',
          'Can target active tokens on public track.',
          'Opponent safe-zone tokens cannot be targeted.',
          'Can target your own HOME_COLUMN tokens.',
          'Opponents cannot push your HOME_COLUMN token backward.',
        ],
      },
      {
        heading: '7.2 Utility',
        bullets: [
          'Shield (5): target own active/home-column token; blocks enemy capture/card targeting until your next turn starts; grants extra turn.',
          'Deploy (6): spawn one of your Yard tokens to your start square.',
          'Switch (7): swap two active tokens from different players; opponent safe-zone tokens cannot be targeted.',
        ],
      },
      {
        heading: '7.3 Control',
        bullets: [
          'U-Turn (6): reverse global turn direction (CW <-> CCW) and grant extra turn.',
          'Freeze (8): skip the next player in current direction once, and grant extra turn.',
          'Adrenaline (10): grants chained extra turns via current hasExtraTurn + adrenalineActive flow.',
        ],
      },
      {
        heading: '7.4 Chaos',
        bullets: [
          'Warp Jump (12): teleport your active token to the square immediately before the player on your right (CW neighbor) start square.',
          'Sacrifice (12): requires your active token with progress >= 26.',
          'Sacrifice destroys that token (loses 1 life in Unkind; may become DEAD).',
          'Sacrifice deploys up to 2 of your Yard tokens to your start square.',
          'Those deploys can capture even on safe start squares.',
          'Sacrifice captures apply life/fuel effects, but no capture action-point gain/loss.',
        ],
      },
    ],
  },
  {
    title: '8. Unkind Scoring (Ranking / Tie-break)',
    blocks: [
      {
        heading: 'Combat base score',
        bullets: ['+2 when you capture.', '-1 when you are captured.'],
      },
      {
        heading: 'Token status points',
        bullets: [
          'HOME_TRIANGLE: +5 each',
          'ACTIVE or HOME_COLUMN: +2 each',
          'YARD: +1 each',
          'DEAD: +0',
        ],
      },
      {
        heading: 'Home combo bonus',
        bullets: ['3 home tokens: +5', '4 home tokens: +10'],
      },
      {
        heading: 'Tie-breaker',
        bullets: ['Higher remaining fuel wins tie-break.'],
      },
    ],
  },
]

function Home() {
  return (
    <div className="site-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-lines" />

      <header className="top-bar">
        <p className="kicker">Unkind from Projekt Lyoon</p>
        <Link className="pill-link" to="/privacy">
          Privacy
        </Link>
      </header>

      <main className="hero-wrap">
        <motion.img
          className="hero-logo"
          src={logo}
          alt="Unkind logo"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ rotate: -2, scale: 1.02 }}
        />

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Play Mean.
        </motion.h1>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <Link className="cta-primary" to="/privacy">
            Read Privacy Policy
            <ArrowRight size={18} />
          </Link>
          <a className="cta-secondary" href="mailto:projektlyoon@gmail.com">
            Contact Developer
          </a>
        </motion.div>

        <motion.section
          className="rules-overview glass-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <div className="overview-chip">
            <BookOpen size={18} />
            <span>Rule Sections: {rules.length}</span>
          </div>
          <div className="overview-chip">
            <Dice6 size={18} />
            <span>Path Length: 52</span>
          </div>
          <div className="overview-chip">
            <Swords size={18} />
            <span>Modes: Standard + Unkind</span>
          </div>
          <div className="overview-chip">
            <Sparkles size={18} />
            <span>Max Hand: 3</span>
          </div>
        </motion.section>

        <section className="toc-grid" aria-label="Rulebook section list">
          {sectionOrder.map((item, idx) => (
            <a key={item} href={`#rule-${idx + 1}`} className="toc-item">
              {item}
            </a>
          ))}
        </section>

        <section className="rules-grid" aria-label="Detailed mechanics">
          {rules.map((section, idx) => (
            <motion.article
              id={`rule-${idx + 1}`}
              key={section.title}
              className="rule-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.45 }}
            >
              <h2>{section.title}</h2>

              {section.intro ? <p className="rule-intro">{section.intro}</p> : null}

              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {section.blocks
                ? section.blocks.map((block) => (
                    <div key={block.heading} className="rule-block">
                      <h3>{block.heading}</h3>
                      <ul>
                        {block.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                : null}
            </motion.article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Home
