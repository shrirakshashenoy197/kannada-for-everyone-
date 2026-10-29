'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Compass,
  Flame,
  Landmark,
  MessageCircle,
  Mic2,
  ScanLine,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { AudioButton, SectionHeading } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { getWordOfTheDay } from '@/lib/kannada-data'

const features = [
  { href: '/learn', en: 'Learn', kn: 'ಕಲಿಯಿರಿ', subtitleEn: 'Short lessons for everyday Kannada.', subtitleKn: 'ದೈನಂದಿನ ಕನ್ನಡಕ್ಕಾಗಿ ಸಣ್ಣ ಪಾಠಗಳು.', icon: BookOpen },
  { href: '/scan', en: 'Scan', kn: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', subtitleEn: 'Read Kannada text from your own image.', subtitleKn: 'ನಿಮ್ಮ ಚಿತ್ರದಲ್ಲಿನ ಕನ್ನಡ ಪಠ್ಯ ಓದಿ.', icon: ScanLine },
  { href: '/talk', en: 'Talk', kn: 'ಸಂಭಾಷಿಸಿ', subtitleEn: 'Practice real-world conversations.', subtitleKn: 'ನೈಜ ಜೀವನದ ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ.', icon: MessageCircle },
  { href: '/speak', en: 'Speak', kn: 'ಮಾತನಾಡಿ', subtitleEn: 'Listen, record, and try speaking.', subtitleKn: 'ಆಲಿಸಿ, ಧ್ವನಿ ದಾಖಲಿಸಿ, ಮಾತನಾಡಲು ಪ್ರಯತ್ನಿಸಿ.', icon: Mic2 },
  { href: '/heritage', en: 'Heritage', kn: 'ಪಾರಂಪರಿಕ ತಾಣಗಳು', subtitleEn: 'Explore five landmarks across Karnataka.', subtitleKn: 'ಕರ್ನಾಟಕದ ಐದು ಪರಂಪರೆ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.', icon: Landmark },
  { href: '/culture', en: 'Culture', kn: 'ಸಂಸ್ಕೃತಿ', subtitleEn: 'Festivals, traditions, and regional notes.', subtitleKn: 'ಹಬ್ಬಗಳು, ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ನುಡಿಗಳು.', icon: Sparkles },
  { href: '/phrasebook', en: 'Phrasebook', kn: 'ನುಡಿಗಟ್ಟುಗಳ ಪುಸ್ತಕ', subtitleEn: 'Keep the phrases you want to revisit.', subtitleKn: 'ಮತ್ತೆ ಬಳಸಬೇಕಾದ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಉಳಿಸಿ.', icon: BookMarked },
  { href: '/survival', en: 'Survival mode', kn: 'ಸರ್ವೈವಲ್ ಮೋಡ್', subtitleEn: 'Unlock six practical travel stages.', subtitleKn: 'ಆರು ಪ್ರಾಯೋಗಿಕ ಪ್ರಯಾಣ ಹಂತಗಳನ್ನು ತೆರೆಯಿರಿ.', icon: Compass },
  { href: '/progress', en: 'Progress', kn: 'ಪ್ರಗತಿ', subtitleEn: 'Track the activity you have completed.', subtitleKn: 'ನೀವು ಪೂರ್ಣಗೊಳಿಸಿದ ಚಟುವಟಿಕೆಗಳನ್ನು ನೋಡಿ.', icon: BarChart3 },
]

export function HomePage() {
  const { text, progress } = useKannada()
  const word = getWordOfTheDay()

  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <Image
          src="/images/mysore-palace.jpg"
          alt="Mysore Palace illuminated at sunset"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-copy">
          <p className="hero-kannada" lang="kn">ನಮ್ಮ ಕನ್ನಡ</p>
          <p className="hero-roman">Namma Kannada</p>
          <h1 id="home-title" className="hero-title">Kannada Everywhere</h1>
          <p className="hero-description">
            {text('Learn Kannada. Speak confidently.', 'ಕನ್ನಡ ಕಲಿಯಿರಿ. ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮಾತನಾಡಿ.')}
          </p>
          <div className="hero-actions">
            <Link className="btn-secondary" href="/learn">
              {text('Start learning', 'ಕಲಿಯಲು ಆರಂಭಿಸಿ')} <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="btn-outline" href="/heritage">
              {text('Explore Karnataka', 'ಕರ್ನಾಟಕ ಅನ್ವೇಷಿಸಿ')}
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container">
        <section aria-labelledby="features-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{text('Choose your next step', 'ಮುಂದಿನ ಹೆಜ್ಜೆ ಆಯ್ಕೆಮಾಡಿ')}</p>
              <h2 id="features-title">{text('Learn, speak, and explore', 'ಕಲಿಯಿರಿ, ಮಾತನಾಡಿ ಮತ್ತು ಅನ್ವೇಷಿಸಿ')}</h2>
            </div>
            <Link className="small-button" href="/emergency">
              <ShieldAlert data-icon="inline-start" aria-hidden="true" /> {text('Emergency phrases', 'ತುರ್ತು ನುಡಿಗಟ್ಟುಗಳು')}
            </Link>
          </div>
          <div className="feature-grid">
            {features.map(({ href, en, kn, subtitleEn, subtitleKn, icon: Icon }) => (
              <Link className="feature-card" key={href} href={href}>
                <span className="feature-icon"><Icon aria-hidden="true" /></span>
                <h3>{text(en, kn)}</h3>
                <p>{text(subtitleEn, subtitleKn)}</p>
                <span className="card-link">{text('Open section', 'ವಿಭಾಗ ತೆರೆಯಿರಿ')} <ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block grid-2" aria-label={text('Daily practice and current progress', 'ದೈನಂದಿನ ಅಭ್ಯಾಸ ಮತ್ತು ಪ್ರಗತಿ')}>
          <article className="word-card">
            <p className="eyebrow">{text('Word of the day', 'ಇಂದಿನ ಪದ')}</p>
            <div className="phrase-card-content">
              <p className="kannada-text" lang="kn">{word.kannada}</p>
              <p className="transliteration">{word.transliteration}</p>
              <p className="english-meaning">{word.english}</p>
              <p className="muted-text"><span lang="kn">{word.example}</span><br />{word.exampleEnglish}</p>
            </div>
            <div className="inline-actions" style={{ marginTop: '1rem' }}>
              <AudioButton textToSpeak={word.kannada} />
              <Link className="small-button" href="/quiz">{text('Try a quick quiz', 'ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ ಮಾಡಿ')}</Link>
            </div>
          </article>

          <article className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{text('Your learning', 'ನಿಮ್ಮ ಕಲಿಕೆ')}</p>
                <h2>{text('A real record, not sample stats', 'ನಿಜವಾದ ದಾಖಲಾತಿ, ಮಾದರಿ ಅಂಕಿಗಳಲ್ಲ')}</h2>
              </div>
              <Flame aria-hidden="true" />
            </div>
            <p className="page-description" style={{ marginTop: 0 }}>
              {text('Your lessons, quiz attempts, saved phrases, and streak update as you use the app.', 'ನೀವು ಬಳಸುವಂತೆ ಪಾಠಗಳು, ರಸಪ್ರಶ್ನೆಗಳು, ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ಸತತ ದಿನಗಳ ಲೆಕ್ಕ ನವೀಕರಿಸುತ್ತವೆ.')}
            </p>
            <div className="inline-actions" style={{ marginTop: '1.2rem' }}>
              <span className="pill">{progress.xp} XP</span>
              <span className="pill">{progress.savedPhrases.length} {text('saved phrases', 'ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು')}</span>
              <Link className="btn-primary" href="/progress">{text('View progress', 'ಪ್ರಗತಿ ನೋಡಿ')} <ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        </section>

        <section className="section-block" aria-labelledby="culture-callout">
          <div className="panel grid-2" style={{ alignItems: 'center' }}>
            <div>
              <p className="eyebrow">{text('Beyond the phrasebook', 'ನುಡಿಗಟ್ಟುಗಳಾಚೆಗೆ')}</p>
              <h2 id="culture-callout" className="page-title" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)' }}>
                {text('A language connected to place.', 'ಸ್ಥಳದೊಂದಿಗೆ ಬೆಸೆದ ಭಾಷೆ.')}
              </h2>
              <p className="page-description">{text('Explore Karnataka’s living traditions, regional voices, and heritage landmarks while you learn.', 'ಕಲಿಯುವಾಗ ಕರ್ನಾಟಕದ ಜೀವಂತ ಸಂಪ್ರದಾಯಗಳು, ಪ್ರಾದೇಶಿಕ ನುಡಿಗಳು ಮತ್ತು ಪರಂಪರೆಯ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.')}</p>
              <Link className="btn-secondary" style={{ marginTop: '1rem' }} href="/culture">{text('Explore culture', 'ಸಂಸ್ಕೃತಿ ಅನ್ವೇಷಿಸಿ')} <ArrowRight aria-hidden="true" /></Link>
            </div>
            <div className="panel" style={{ background: 'var(--muted)' }}>
              <SectionHeading title={text('Take it one day at a time', 'ಪ್ರತಿದಿನ ಒಂದು ಹೆಜ್ಜೆ')} description={text('A short practice can be more useful than a long list you never revisit.', 'ಮತ್ತೆ ನೋಡದ ದೊಡ್ಡ ಪಟ್ಟಿಗಿಂತ ಚಿಕ್ಕ ಅಭ್ಯಾಸ ಹೆಚ್ಚು ಸಹಾಯಕ.')}/>
              <div className="inline-actions">
                <Link className="small-button" href="/learn">{text('Browse lessons', 'ಪಾಠಗಳನ್ನು ನೋಡಿ')}</Link>
                <Link className="small-button" href="/survival">{text('Open survival mode', 'ಸರ್ವೈವಲ್ ಮೋಡ್ ತೆರೆಯಿರಿ')}</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
