import { motion as Motion } from 'framer-motion'
import Seo from './components/Seo'

const privacyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Privacy Policy for WizBid',
  url: 'https://www.projektlyoon.com/wizbid/privacy',
  dateModified: '2026-10-13',
  publisher: {
    '@type': 'Person',
    name: 'Nikhil Yadav',
  },
  inLanguage: 'en',
}

const sections = [
  {
    heading: '1. Information We Collect',
    blocks: [
      {
        subheading: 'a) Information stored on your device',
        text: 'WizBid stores gameplay and settings data locally on your device, including:',
        items: [
          'Display name / player nickname',
          'Selected avatar',
          'Theme, card back, and graphics preferences',
          'Audio and sound effects preferences',
          'Local game settings and offline practice stats',
        ],
      },
      {
        subheading: 'b) Information used for online play',
        text: 'When you use online matchmaking, private tables, or multiplayer rooms, WizBid uses Firebase services and processes:',
        items: [
          'Anonymous account identifier (Firebase UID)',
          'Display name and avatar selection',
          'Table/match data (table code, seat assignment, ready/deal status)',
          'Live game state, bids, tricks won, and actions required for multiplayer gameplay',
        ],
      },
      {
        subheading: 'c) Service-provider technical data',
        text: 'Our backend provider (Google Firebase) may process technical/network metadata needed to operate and secure the service (for example IP/device/network information), according to Firebase\'s own policies.',
      },
    ],
  },
  {
    heading: '2. How We Use Information',
    lead: 'We use data only to:',
    bullets: [
      'Authenticate players anonymously',
      'Match players and create/join game tables',
      'Synchronize multiplayer game state, bids, and trick scores in real time',
      'Save user settings/preferences',
      'Operate and maintain core game functionality',
    ],
  },
  {
    heading: '3. Tracking, Ads, and Analytics',
    bullets: [
      'WizBid does not use third-party advertising SDKs.',
      'WizBid does not use cross-app tracking for advertising.',
      'WizBid does not sell personal data.',
    ],
  },
  {
    heading: '4. Permissions and Sensitive Data',
    paragraphs: [
      'WizBid does not require contacts, photos, microphone, or location for core gameplay.',
      'If platform-level permissions appear on a device build, they are not used by us to collect personal content unless explicitly needed for a feature and disclosed in-app.',
    ],
  },
  {
    heading: '5. Data Sharing',
    lead: 'We share data only with service providers required to run the app:',
    bullets: [
      'We do not share personal data with data brokers.',
      'Google Firebase (authentication and real-time multiplayer backend)',
    ],
  },
  {
    heading: '6. Data Retention',
    bullets: [
      'Local settings remain on your device until you clear app data or uninstall.',
      'Multiplayer/session records are retained in backend systems as needed for game operation, integrity, and troubleshooting.',
    ],
  },
  {
    heading: '7. Your Choices and Account Deletion',
    lead: 'Inside the app, you can use the settings or device storage management to:',
    bullets: [
      'Delete your anonymous account (when supported by the auth session), and',
      'Clear locally stored app data from your device.',
    ],
    paragraphs: [
      'You may also contact us by email to request deletion of any server-side records associated with your anonymous user ID.',
    ],
  },
  {
    heading: '8. Children\'s Privacy',
    paragraphs: [
      'WizBid is not directed to children under 13 (or equivalent minimum age in your region). We do not knowingly collect personal data from children.',
    ],
  },
  {
    heading: '9. Security',
    paragraphs: [
      'We use reasonable technical measures and established backend providers to protect data. No method of transmission or storage is 100% secure.',
    ],
  },
  {
    heading: '10. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. The Last updated date will reflect the latest revision.',
    ],
  },
]

function WizBidPrivacy() {
  return (
    <div className="privacy-shell">
      <Seo
        title="WizBid Privacy Policy | Projekt Lyoon"
        description="Privacy policy for the WizBid mobile app, covering local settings, Firebase multiplayer data, tracking, permissions, account deletion, and contact details."
        path="/wizbid/privacy"
        type="article"
        jsonLd={privacyJsonLd}
      />
      <header className="privacy-nav">
        <a href="https://www.projektlyoon.com/" className="pill-link">
          Back to Home
        </a>
      </header>

      <Motion.main
        className="privacy-main"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <article className="policy-card">
          <h1>Privacy Policy for WizBid</h1>
          <p className="updated-line">
            <strong>Last updated:</strong> October 13, 2026
          </p>
          <p>
            This Privacy Policy describes how <strong>Nikhil Yadav</strong> ("we," "our," or "us") handles information in the <strong>WizBid</strong> mobile app.
          </p>

          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>

              {section.lead ? <p>{section.lead}</p> : null}

              {section.blocks
                ? section.blocks.map((block) => (
                    <div key={block.subheading} className="policy-block">
                      <h3>{block.subheading}</h3>
                      <p>{block.text}</p>
                      {block.items ? (
                        <ul>
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))
                : null}

              {section.paragraphs
                ? section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                : null}

              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section>
            <h2>11. Contact</h2>
            <p>For privacy questions or requests, contact:</p>
            <ul>
              <li>
                <strong>Name:</strong> Nikhil Yadav
              </li>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:projektlyoon@gmail.com">projektlyoon@gmail.com</a>
              </li>
            </ul>
          </section>
        </article>
      </Motion.main>
    </div>
  )
}

export default WizBidPrivacy
