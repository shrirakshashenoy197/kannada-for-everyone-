import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-content">
        <p><strong>ನಮ್ಮ ಕನ್ನಡ — Our Kannada</strong><br />Karnataka · Language, heritage & living traditions</p>
        <p><Link href="/emergency">Emergency Kannada</Link> · <Link href="/phrasebook">Phrasebook</Link></p>
      </div>
    </footer>
  )
}
