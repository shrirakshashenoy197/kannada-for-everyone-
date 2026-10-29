'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen, ChevronDown, Home, Menu, Moon, Phone, ScanLine, Sun, Users, Volume2, X } from 'lucide-react'
import { useKannada, type DisplayLanguage } from '@/components/kannada-provider'

const mainLinks = [
  { href: '/', en: 'Home', kn: 'ಮುಖಪುಟ', icon: Home },
  { href: '/learn', en: 'Learn', kn: 'ಕಲಿಯಿರಿ', icon: BookOpen },
  { href: '/scan', en: 'Scan', kn: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', icon: ScanLine },
  { href: '/talk', en: 'Talk', kn: 'ಸಂಭಾಷಿಸಿ', icon: Users },
  { href: '/speak', en: 'Speak', kn: 'ಮಾತನಾಡಿ', icon: Volume2 },
  { href: '/heritage', en: 'Heritage', kn: 'ಪಾರಂಪರಿಕ ತಾಣಗಳು' },
  { href: '/culture', en: 'Culture', kn: 'ಸಂಸ್ಕೃತಿ' },
  { href: '/progress', en: 'Progress', kn: 'ಪ್ರಗತಿ' },
]

const moreLinks = [
  { href: '/phrasebook', en: 'Phrasebook', kn: 'ನುಡಿಗಟ್ಟುಗಳ ಪುಸ್ತಕ' },
  { href: '/quiz', en: 'Quiz', kn: 'ರಸಪ್ರಶ್ನೆ' },
  { href: '/survival', en: 'Survival mode', kn: 'ಸರ್ವೈವಲ್ ಮೋಡ್' },
]

const languageOptions: Array<{ value: DisplayLanguage; label: string }> = [
  { value: 'kannada', label: 'ಕನ್ನಡ' },
  { value: 'english', label: 'English' },
  { value: 'bilingual', label: 'Bilingual' },
]

function LanguageSwitcher() {
  const { language, setLanguage, text } = useKannada()
  return (
    <div className="language-switcher" role="group" aria-label={text('Display language', 'ಪ್ರದರ್ಶನ ಭಾಷೆ')}>
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, toggleTheme, text } = useKannada()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <header className="site-header">
      <div className="site-container header-top">
        <Link href="/" className="header-brand" aria-label="ನಮ್ಮ ಕನ್ನಡ — Our Kannada home">
          <span className="brand-mark" aria-hidden="true">ಕ</span>
          <span>
            <span className="brand-title">ನಮ್ಮ ಕನ್ನಡ</span>
            <span className="brand-subtitle">— Our Kannada · Heritage at a Glance</span>
          </span>
        </Link>

        <div className="header-controls">
          <LanguageSwitcher />
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? text('Switch to light theme', 'ಬೆಳಕಿನ ಥೀಮ್ ಬಳಸಿ') : text('Switch to dark theme', 'ಕತ್ತಲಿನ ಥೀಮ್ ಬಳಸಿ')}
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <Link className="emergency-link" href="/emergency" aria-label={text('Emergency Kannada', 'ತುರ್ತು ಕನ್ನಡ')}>
            <Phone aria-hidden="true" />
            <span>{text('Emergency', 'ತುರ್ತು ಸಹಾಯ')}</span>
          </Link>
        </div>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileOpen ? text('Close navigation menu', 'ನ್ಯಾವಿಗೇಶನ್ ಮುಚ್ಚಿ') : text('Open navigation menu', 'ನ್ಯಾವಿಗೇಶನ್ ತೆರೆಯಿರಿ')}
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="primary-navigation"
        className="main-nav"
        data-open={mobileOpen}
        aria-label={text('Main navigation', 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್')}
      >
        <div className="site-container nav-links">
          {mainLinks.map(({ href, en, kn, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link" aria-current={isActive(href) ? 'page' : undefined}>
              {Icon ? <Icon aria-hidden="true" /> : null}
              <span>{text(en, kn)}</span>
            </Link>
          ))}
          <details className="more-menu">
            <summary>
              <span>{text('More', 'ಇನ್ನಷ್ಟು')}</span>
              <ChevronDown aria-hidden="true" />
            </summary>
            <div className="more-menu-links">
              {moreLinks.map(({ href, en, kn }) => (
                <Link key={href} href={href} className="nav-link" aria-current={isActive(href) ? 'page' : undefined}>
                  {text(en, kn)}
                </Link>
              ))}
            </div>
          </details>
          <div className="mobile-controls">
            <LanguageSwitcher />
            <button
              className="theme-toggle"
              type="button"
              aria-label={theme === 'dark' ? text('Switch to light theme', 'ಬೆಳಕಿನ ಥೀಮ್ ಬಳಸಿ') : text('Switch to dark theme', 'ಕತ್ತಲಿನ ಥೀಮ್ ಬಳಸಿ')}
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <Link className="emergency-link" href="/emergency">
              <Phone aria-hidden="true" /> {text('Emergency', 'ತುರ್ತು ಸಹಾಯ')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
