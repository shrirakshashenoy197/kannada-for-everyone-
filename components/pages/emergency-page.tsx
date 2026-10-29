'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AlertTriangle, Copy, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, PhraseCard } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { EMERGENCY_PHRASES, type Phrase } from '@/lib/kannada-data'

export function EmergencyPage() {
  const { text } = useKannada()
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)
  const [copyMessage, setCopyMessage] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selectedPhrase && !dialog.open) dialog.showModal()
    if (!selectedPhrase && dialog.open) dialog.close()
  }, [selectedPhrase])

  async function copyPhrase(phrase: Phrase) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(phrase.kannada)
      setCopyMessage(text('Kannada phrase copied.', 'ಕನ್ನಡ ನುಡಿಗಟ್ಟು ನಕಲಿಸಲಾಗಿದೆ.'))
    } catch {
      setCopyMessage(text('Clipboard access is unavailable here. Select the Kannada text and copy it manually.', 'ಇಲ್ಲಿ ಕ್ಲಿಪ್‌ಬೋರ್ಡ್ ಲಭ್ಯವಿಲ್ಲ. ಕನ್ನಡ ಪಠ್ಯ ಆಯ್ಕೆಮಾಡಿ ಕೈಯಾರೆ ನಕಲಿಸಿ.'))
    }
  }

  function confirmCall(event: MouseEvent<HTMLAnchorElement>, number: string) {
    const confirmed = window.confirm(text(`Call ${number} using your phone app? This site will not place a call by itself.`, `${number}ಕ್ಕೆ ನಿಮ್ಮ ಫೋನ್ ಅಪ್ ಮೂಲಕ ಕರೆ ಮಾಡಬೇಕೇ? ಈ ವೆಬ್‌ಸೈಟ್ ಸ್ವತಃ ಕರೆ ಮಾಡುವುದಿಲ್ಲ.`))
    if (!confirmed) event.preventDefault()
  }

  return (
    <div className="page-container emergency-page">
      <PageHeading
        eyebrow={text('Keep this page easy to reach', 'ಈ ಪುಟವನ್ನು ಸುಲಭವಾಗಿ ತೆರೆಯಿರಿ')}
        title={text('Emergency Kannada', 'ತುರ್ತು ಕನ್ನಡ')}
        description={text('Show a phrase to someone nearby or copy it. This is a language aid, not an emergency service.', 'ಹತ್ತಿರದವರಿಗೆ ನುಡಿಗಟ್ಟು ತೋರಿಸಿ ಅಥವಾ ನಕಲಿಸಿ. ಇದು ಭಾಷಾ ಸಹಾಯ ಮಾತ್ರ, ತುರ್ತು ಸೇವೆಯಲ್ಲ.')}
      />
      <div className="emergency-intro" role="note">
        <div className="inline-actions"><AlertTriangle aria-hidden="true" /><strong>{text('If there is immediate danger in India, call 112.', 'ಭಾರತದಲ್ಲಿ ತಕ್ಷಣದ ಅಪಾಯವಿದ್ದರೆ 112ಕ್ಕೆ ಕರೆ ಮಾಡಿ.')}</strong></div>
        <p className="muted-text" style={{ marginBottom: 0 }}>{text('Use your phone’s emergency service directly. 108 ambulance availability can vary by state. If you are not in India, use your local emergency number.', 'ನಿಮ್ಮ ಫೋನ್‌ನ ತುರ್ತು ಸೇವೆಯನ್ನು ನೇರವಾಗಿ ಬಳಸಿ. 108 ಆಂಬುಲೆನ್ಸ್ ಸೇವೆ ರಾಜ್ಯದಂತೆ ಬದಲಾಗಬಹುದು. ನೀವು ಭಾರತದಲ್ಲಿಲ್ಲದಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ.')}</p>
      </div>

      <section className="section-block" aria-labelledby="emergency-phrases-heading">
        <div className="section-heading"><div><p className="eyebrow">{text('Show or say', 'ತೋರಿಸಿ ಅಥವಾ ಹೇಳಿ')}</p><h2 id="emergency-phrases-heading">{text('Essential phrases', 'ಅಗತ್ಯ ನುಡಿಗಟ್ಟುಗಳು')}</h2></div></div>
        <div className="phrase-grid">
          {EMERGENCY_PHRASES.map((phrase) => (
            <div key={phrase.id}>
              <PhraseCard phrase={phrase} source="Emergency Kannada" emergency onFullScreen={() => setSelectedPhrase(phrase)} />
              <Button type="button" variant="outline" style={{ marginTop: '0.55rem' }} onClick={() => copyPhrase(phrase)}>
                <Copy data-icon="inline-start" aria-hidden="true" /> {text('Copy Kannada', 'ಕನ್ನಡ ನಕಲಿಸಿ')}
              </Button>
            </div>
          ))}
        </div>
        {copyMessage ? <p className="status-note" role="status" aria-live="polite" style={{ marginTop: '1rem' }}>{copyMessage}</p> : null}
      </section>

      <section className="section-block" aria-labelledby="emergency-call-heading">
        <div className="section-heading"><div><p className="eyebrow">{text('Phone numbers', 'ದೂರವಾಣಿ ಸಂಖ್ಯೆಗಳು')}</p><h2 id="emergency-call-heading">{text('Call only after you choose to', 'ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ನಂತರ ಮಾತ್ರ ಕರೆ ಮಾಡಿ')}</h2></div></div>
        <div className="emergency-call-grid">
          <a className="emergency-call" href="tel:112" onClick={(event) => confirmCall(event, '112')}>
            <span className="feature-icon"><Phone aria-hidden="true" /></span>
            <span><strong>112</strong><span>{text('India emergency response', 'ಭಾರತದ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ')}</span></span>
          </a>
          <a className="emergency-call" href="tel:108" onClick={(event) => confirmCall(event, '108')}>
            <span className="feature-icon"><Phone aria-hidden="true" /></span>
            <span><strong>108</strong><span>{text('Ambulance service · availability varies', 'ಆಂಬುಲೆನ್ಸ್ ಸೇವೆ · ಲಭ್ಯತೆ ಬದಲಾಗಬಹುದು')}</span></span>
          </a>
        </div>
        <p className="helper-text" style={{ marginTop: '0.65rem' }}>{text('Tapping a number opens your phone app only after the browser confirmation. No call is made automatically.', 'ಬ್ರೌಸರ್ ದೃಢೀಕರಣದ ನಂತರ ಮಾತ್ರ ಸಂಖ್ಯೆ ಒತ್ತಿದರೆ ಫೋನ್ ಅಪ್ ತೆರೆಯುತ್ತದೆ. ಸ್ವಯಂಚಾಲಿತ ಕರೆ ನಡೆಯುವುದಿಲ್ಲ.')}</p>
      </section>

      <dialog className="detail-dialog emergency-dialog" ref={dialogRef} aria-labelledby="emergency-dialog-title" onClose={() => setSelectedPhrase(null)}>
        {selectedPhrase ? (
          <div className="dialog-content">
            <div className="section-heading">
              <div><p className="eyebrow">{text('Show this message', 'ಈ ಸಂದೇಶ ತೋರಿಸಿ')}</p><h2 id="emergency-dialog-title">{text('Emergency phrase', 'ತುರ್ತು ನುಡಿಗಟ್ಟು')}</h2></div>
              <Button type="button" variant="ghost" size="icon" aria-label={text('Close full-screen phrase', 'ಪೂರ್ಣಪರದೆ ನುಡಿಗಟ್ಟು ಮುಚ್ಚಿ')} onClick={() => setSelectedPhrase(null)}><X aria-hidden="true" /></Button>
            </div>
            <p className="kannada-text" lang="kn" style={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)' }}>{selectedPhrase.kannada}</p>
            <p className="transliteration">{selectedPhrase.transliteration}</p>
            <p className="page-description">{selectedPhrase.english}</p>
            <div className="inline-actions" style={{ marginTop: '1.1rem' }}>
              <Button type="button" variant="secondary" onClick={() => copyPhrase(selectedPhrase)}><Copy data-icon="inline-start" aria-hidden="true" /> {text('Copy phrase', 'ನುಡಿಗಟ್ಟು ನಕಲಿಸಿ')}</Button>
              <Button type="button" variant="outline" onClick={() => setSelectedPhrase(null)}>{text('Close', 'ಮುಚ್ಚಿ')}</Button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  )
}
