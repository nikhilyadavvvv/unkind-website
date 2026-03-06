import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Dice6, Sparkles, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from './assets/unkindbaseNobackground.png'

const sectionOrder = [
  '1. Objective',
  '2. Turn vs Round (Vocabulary)',
  '3. Board and Safety',
  '4. Turn Flow',
  '5. Dice and Fuel',
  '6. Captures and Damage',
  '7. Hand and Pin',
  '8. Card List and Fuel Costs',
  '9. Scoring (Unkind Mode Only)',
  '10. Turn Direction & Sequence',
]

const rules = [
  {
    title: '1. Objective',
    blocks: [
      {
        heading: 'Standard',
        bullets: ['Be the first player to get all 4 tokens into HOME_TRIANGLE.'],
      },
      {
        heading: 'Unkind',
        bullets: [
          'Flawless Victory: Get all 4 tokens into HOME_TRIANGLE.',
          "Survivor's Escape: Get all your remaining living tokens home.",
          'Last Survivor: All other players are completely eliminated (all tokens are DEAD).',
        ],
      },
    ],
  },
  {
    title: '2. Turn vs Round (Vocabulary)',
    blocks: [
      {
        heading: 'Definitions',
        bullets: [
          'Turn: One player action cycle from WAITING_FOR_ACTION until turn passes.',
          'Round: One full table cycle where every active player has taken a turn.',
        ],
      },
      {
        heading: 'Ruin Path and Mirror Step timing',
        bullets: [
          'Ruin Path starts with a countdown equal to turnOrder.length * 2 (8 turns in a 4-player match).',
          'Countdown ticks down by 1 at each turn-end transition.',
        ],
      },
    ],
  },
  {
    title: '3. Board and Safety',
    bullets: [
      'Public path length: 52 steps.',
      'Start indices: GREEN 0, BLUE 13, YELLOW 26, RED 39.',
      'Safe indices: 0, 8, 13, 21, 26, 34, 39, 47.',
      'Home column is always safe from opponent displacement/capture.',
    ],
  },
  {
    title: '4. Turn Flow',
    blocks: [
      {
        heading: 'Start of your turn',
        bullets: [
          'Shields on your own tokens are cleared.',
          'Hand refills to max 3.',
        ],
      },
      {
        heading: 'During your turn',
        bullets: [
          'Roll die or play cards (if fuel allows).',
          'Some cards require target selection (tokens or cells).',
        ],
      },
      {
        heading: 'End of turn',
        bullets: [
          'Unpinned cards are flushed to the discard pile.',
          'Pinned card (if any) is retained for the next turn.',
        ],
      },
      {
        heading: 'Extra turn triggers',
        bullets: [
          'Roll a 6.',
          'Capture an enemy token by dice or card movement.',
          'One of your tokens reaches HOME_TRIANGLE.',
          'Use a card that grants initiative: Shield, Freeze, U-Turn, Adrenaline, Minefield, Mirror Step, Ruin Path.',
        ],
      },
    ],
  },
  {
    title: '5. Dice and Fuel',
    blocks: [
      {
        heading: 'Dice and resource rules',
        bullets: [
          'Spawn: Releasing a token from Yard requires a roll of 6.',
          'Fuel gain per roll: 7 - diceValue.',
          'Fuel cap: 12.',
          'Exact movement required to enter HOME_TRIANGLE.',
          'Overshooting or back-underflow clamps movement to current/start position.',
        ],
      },
      {
        heading: 'Pity fuel',
        bullets: [
          'If no legal move is possible after a roll: gain +1 fuel.',
          'If the roll was 6, player still retains the extra turn.',
        ],
      },
    ],
  },
  {
    title: '6. Captures and Damage',
    blocks: [
      {
        heading: 'Capture resolution',
        bullets: [
          'Active token landing on an enemy active token captures it (if cell is capturable).',
          'Safe cells are normally non-capturable.',
          'If Ruin Path is active, all path cells (including safe/start) become capturable.',
          'Shielded enemy tokens cannot be captured or targeted by enemy effects.',
          'Captured player loses 50% of current fuel (clamped down).',
        ],
      },
      {
        heading: 'Unkind mode damage',
        bullets: [
          'Each token starts with 2 lives.',
          'Any capture (dice, card, or mine) removes 1 life.',
          'At 0 life token becomes DEAD; otherwise it returns to YARD.',
        ],
      },
    ],
  },
  {
    title: '7. Hand and Pin',
    bullets: [
      'Max hand size: 3.',
      'Hand refills to 3 at start of your turn.',
      'Pin keeps one specific card instance across turn flush.',
      'Only one card can be pinned; toggling another unpins the previous one.',
    ],
  },
  {
    title: '8. Card List and Fuel Costs',
    blocks: [
      {
        heading: '8.1 Movement',
        bullets: [
          'Nudge Forward (+1) - 2F',
          'Nudge Back (-1) - 2F',
          'March (+3) - 3F',
          'Backpedal (-3) - 3F',
          'Dash (+5) - 4F',
          'Retreat (-5) - 4F',
        ],
      },
      {
        heading: '8.2 Force Movement',
        bullets: [
          'Force Nudge Forward (+1) - 3F',
          'Force Nudge Back (-1) - 3F',
          'Force March (+3) - 4F',
          'Force Backpedal (-3) - 4F',
          'Force Dash (+5) - 5F',
          'Force Retreat (-5) - 5F',
          'Special: can target tokens on spawn points (start squares) even when safe zones are active.',
        ],
      },
      {
        heading: '8.3 Utility',
        bullets: [
          'Shield - 4F: protect own token until your next turn start; grants extra turn.',
          'Deploy - 5F: spawn one Yard token to your start square.',
          'Switch - 6F: swap track positions of any two active tokens from different players.',
        ],
      },
      {
        heading: '8.4 Control',
        bullets: [
          'Minefield - 5F: place hidden mine on an empty cell; grants extra turn.',
          'Minefield immunity: placer is immune to their own mine.',
          'Minefield detonation: enemy landing on cell returns to Yard/DEAD and takes fuel penalty (in Unkind, -1 life).',
          'Mirror Step - 6F: mark an enemy token; grants extra turn.',
          'Mirror Step trigger: on your next dice-driven progress gain, marked enemy token moves backward by same amount.',
          'U-Turn - 6F: reverse turn direction; grants extra turn.',
          'Freeze - 7F: skip next player in sequence; grants extra turn.',
          'Adrenaline - 8F: grants one immediate extra turn plus a second bonus turn afterward.',
        ],
      },
      {
        heading: '8.5 Chaos',
        bullets: [
          "Warp Jump - 9F: teleport your active token to the square immediately before the right-hand opponent's start.",
          'Sacrifice - 9F: requires own active token at progress >= 26.',
          'Sacrifice destroys that token (lose 1 life).',
          'Sacrifice deploys up to 2 other tokens from Yard to start.',
          'Ruin Path - 10F: disables safe/start protections globally for 2 full rounds; grants extra turn.',
        ],
      },
    ],
  },
  {
    title: '9. Scoring (Unkind Mode Only)',
    blocks: [
      {
        heading: 'Combat events',
        bullets: ['+2 for each capture transition you perform.', '-1 for each time your token is captured.'],
      },
      {
        heading: 'Token status points',
        bullets: [
          'HOME_TRIANGLE: +5',
          'ACTIVE or HOME_COLUMN: +2',
          'YARD: +1 each',
          'DEAD: +0',
        ],
      },
      {
        heading: 'Home combo bonus',
        bullets: ['3 tokens home: +5 bonus', '4 tokens home: +10 bonus'],
      },
      {
        heading: 'Tie-breaker',
        bullets: ['Higher remaining fuel wins tie-break.'],
      },
    ],
  },
  {
    title: '10. Turn Direction & Sequence',
    bullets: [
      'Initial order: RED -> GREEN -> BLUE -> YELLOW.',
      'U-Turn toggles direction between CW and CCW.',
      'Fully eliminated players are removed from rotation.',
      'Freeze and Adrenaline influence immediate next-player selection logic.',
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
