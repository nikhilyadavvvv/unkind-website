import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Dice6, Sparkles, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from './assets/unkindbaseNobackground.png'

const sectionOrder = [
  '1. Victory Conditions',
  '2. Board / Path / Safety',
  '3. Turn Lifecycle',
  '4. Dice and Movement',
  '5. Extra Turn Sources',
  '6. Capture, Lives, Fuel Penalty',
  '7. Hand, Pin, Burn',
  '8. Card Targeting Constraints',
  '9. Card List (Fuel Cost)',
  '10. Unkind Scoring / Tiebreak',
  '11. Turn Order and Direction',
]

const rules = [
  {
    title: '1. Victory Conditions',
    blocks: [
      {
        heading: 'Standard',
        bullets: ['First player to get all 4 tokens into Home wins.'],
      },
      {
        heading: 'Unkind',
        bullets: [
          'Flawless Victory: 4 home tokens.',
          "Survivor's Escape: all of your surviving tokens are in Home.",
          'Last Survivor: only one player still has tokens left in play.',
        ],
      },
    ],
  },
  {
    title: '2. Board / Path / Safety',
    bullets: [
      'Public loop length: 52.',
      'Start indices: GREEN 0, BLUE 13, YELLOW 26, RED 39.',
      'Safe indices: 0, 8, 13, 21, 26, 34, 39, 47.',
      'Safe squares are non-capturable unless Ruin Path is active.',
      'Home column / home triangle cannot be captured.',
    ],
  },
  {
    title: '3. Turn Lifecycle',
    blocks: [
      {
        heading: 'Turn state',
        bullets: ['Each turn starts in the normal action phase.'],
      },
      {
        heading: 'On player handover',
        bullets: [
          "The incoming player's shields are removed.",
          "The incoming player's hand refills to 3 cards.",
        ],
      },
      {
        heading: 'On turn end',
        bullets: [
          "The current player's unpinned cards are discarded.",
          'Only the pinned card stays for next turn.',
        ],
      },
      {
        heading: 'Ruin Path timer',
        bullets: ['Ruin Path timer decreases by 1 each completed turn.'],
      },
    ],
  },
  {
    title: '4. Dice and Movement',
    blocks: [
      {
        heading: 'Dice rules',
        bullets: [
          'Roll result is 1..6.',
          'Yard token needs 6 to spawn.',
          'Fuel gain on resolved dice move: 7 - dice.',
          'Fuel cap: 12.',
        ],
      },
      {
        heading: 'No legal dice move',
        bullets: [
          'Gain +1 pity fuel.',
          'If roll was 6, still keep extra turn.',
        ],
      },
      {
        heading: 'Movement clamping',
        bullets: [
          'Cannot move backward past your own starting point.',
          'You must land exactly on Home to enter it.',
          'Overshoot is clamped (no move).',
        ],
      },
    ],
  },
  {
    title: '5. Extra Turn Sources',
    bullets: [
      'Dice roll 6.',
      'Capture caused by dice move or card-caused movement.',
      'Reaching Home.',
      'Cards that grant extra turns: Shield, Mirror Step, Freeze, U-Turn, Adrenaline, Ruin Path, Sacrifice.',
    ],
  },
  {
    title: '6. Capture, Lives, Fuel Penalty',
    blocks: [
      {
        heading: 'Capture rules',
        bullets: [
          'Capture applies only when two tokens are active on the same board square.',
          'Shielded enemy tokens cannot be captured or card-targeted.',
          'Captured player loses half their fuel (rounded down).',
        ],
      },
      {
        heading: 'Unkind lives',
        bullets: [
          'Tokens start with 2 lives.',
          'Capture or mine hit removes 1 life.',
          'At 0 lives token is eliminated; otherwise it returns to the yard.',
        ],
      },
      {
        heading: 'Standard mode behavior',
        bullets: ['Standard mode uses non-lethal captures, and captured tokens return to the yard.'],
      },
    ],
  },
  {
    title: '7. Hand, Pin, Burn',
    blocks: [
      {
        heading: 'Hand and pin',
        bullets: [
          'Max hand size: 3.',
          'One pinned card instance can be retained through flush.',
        ],
      },
      {
        heading: 'Burn mechanic',
        bullets: [
          'Only MOVEMENT cards can be burned.',
          'Burn is limited to once per turn (hasBurntCardThisTurn).',
          'Burn grants +2 fuel, capped by max fuel.',
          'Burned card goes to discard.',
        ],
      },
    ],
  },
  {
    title: '8. Card Targeting Constraints',
    blocks: [
      {
        heading: 'Movement targeting',
        bullets: [
          'Movement cards target tokens currently on the main track.',
          'You can also target your own token in your home lane.',
          'Opponent safe-zone targets are blocked unless Ruin Path is active, or you use a Force Movement card on a start square.',
        ],
      },
      {
        heading: 'Switch targeting',
        bullets: [
          'First target must be your active token.',
          'Second target must be opponent active token.',
          'Same-owner pair is invalid.',
        ],
      },
      {
        heading: 'Minefield targeting',
        bullets: [
          'Minefield targets one specific board square.',
          'That square must be outside safe/start zones, empty, and not already mined.',
        ],
      },
    ],
  },
  {
    title: '9. Card List (Fuel Cost)',
    blocks: [
      {
        heading: 'Movement',
        bullets: [
          'Nudge Forward +1 (2F)',
          'Nudge Back -1 (2F)',
          'March +3 (3F)',
          'Backpedal -3 (3F)',
          'Dash +5 (4F)',
          'Retreat -5 (4F)',
        ],
      },
      {
        heading: 'Force Movement',
        bullets: [
          'Force Nudge Forward +1 (3F)',
          'Force Nudge Back -1 (3F)',
          'Force March +3 (4F)',
          'Force Backpedal -3 (4F)',
          'Force Dash +5 (5F)',
          'Force Retreat -5 (5F)',
        ],
      },
      {
        heading: 'Utility',
        bullets: [
          'Shield (4F): shield one of your tokens on the track or home lane, extra turn.',
          'Deploy (5F): deploy own yard token to start.',
          'Switch (6F): swap two active enemy/own tokens with different owners.',
        ],
      },
      {
        heading: 'Control',
        bullets: [
          'Minefield (5F): place one hidden mine, owner-immune. Mine detonates on enemy landing and is consumed.',
          'Mirror Step (6F): mark enemy token, extra turn. On your next dice movement resolution, move marked token backward by your forward dice steps if any.',
          'U-Turn (6F): reverse turn direction, extra turn.',
          'Freeze (7F): next eligible player is skipped once, extra turn.',
          'Adrenaline (8F): immediate extra turn plus one delayed bonus turn.',
        ],
      },
      {
        heading: 'Chaos',
        bullets: [
          "Warp Jump (9F): move your active token to the square before the right-side opponent's start; if that would move backward, it jumps near your own home-side end instead.",
          'Sacrifice (9F): choose one of your active tokens past mid-path to lose 1 life, then deploy up to 2 of your yard tokens to start, always extra turn.',
          'Sacrifice bonus fuel: if no deployable yard token, fuel becomes 10; if exactly one deploy, gain +5 fuel up to 10.',
          'Ruin Path (10F): safe/start become capturable for two full rounds, extra turn.',
        ],
      },
    ],
  },
  {
    title: '10. Unkind Scoring / Tiebreak',
    blocks: [
      {
        heading: 'Base combat score',
        bullets: [
          '+2 per capture.',
          '+1 assist capture (forced movement assist).',
          '-1 when your token is captured.',
        ],
      },
      {
        heading: 'Token-state points',
        bullets: [
          'In Home: +5',
          'On board or in home lane: +2',
          'In yard: +1',
          'Eliminated: +0',
        ],
      },
      {
        heading: 'Home combo',
        bullets: ['3 home tokens: +5', '4 home tokens: +10'],
      },
      {
        heading: 'Final tiebreak',
        bullets: ['Higher remaining fuel.'],
      },
    ],
  },
  {
    title: '11. Turn Order and Direction',
    bullets: [
      'Canon order is RED -> GREEN -> BLUE -> YELLOW, rotated by selected starting player.',
      'Direction starts clockwise.',
      'U-Turn toggles direction.',
      'Eliminated players are skipped in next-player selection.',
      'Freeze adds a one-time skip marker for the next eligible player.',
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
