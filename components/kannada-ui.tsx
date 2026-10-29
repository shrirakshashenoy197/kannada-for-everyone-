'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Bookmark, BookmarkCheck, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKannada } from '@/components/kannada-provider'
import type { Phrase } from '@/lib/kannada-data'

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div className="page-heading-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  )
}

export function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0
  return (
    <div aria-label={`${label}: ${percentage}%`}>
      <div className="progress-meta"><span>{label}</span><span>{percentage}%</span></div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export function AudioButton({ textToSpeak, className = '', label }: { textToSpeak: string; className?: string; label?: string }) {
  const { text } = useKannada()
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null)
  const [playbackMessage, setPlaybackMessage] = useState('')

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setVoiceAvailable(false)
      return
    }
    const updateVoices = () => {
      setVoiceAvailable(window.speechSynthesis.getVoices().some((voice) => voice.lang.toLowerCase().startsWith('kn')))
    }
    updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices)
  }, [])

  const noVoiceMessage = text(
    'No Kannada speech voice is available in this browser; the text remains available.',
    'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ ಮಾತಿನ ಧ್ವನಿ ಇಲ್ಲ; ಪಠ್ಯವನ್ನು ಬಳಸಬಹುದು.',
  )
  const status = playbackMessage || (voiceAvailable === false ? noVoiceMessage : '')

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setVoiceAvailable(false)
      setPlaybackMessage(text('Speech synthesis is not supported in this browser.', 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತಿನ ಧ್ವನಿ ಬೆಂಬಲವಿಲ್ಲ.'))
      return
    }
    const voice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith('kn'))
    if (!voice) {
      setVoiceAvailable(false)
      setPlaybackMessage('')
      return
    }
    setPlaybackMessage('')
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = voice.lang || 'kn-IN'
    utterance.voice = voice
    utterance.rate = 0.86
    utterance.onerror = () => setPlaybackMessage(text('Audio playback failed on this device.', 'ಈ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ಪ್ಲೇ ಆಗಲಿಲ್ಲ.'))
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="audio-control">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={className}
        aria-label={label ?? text('Listen in Kannada', 'ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸಿ')}
        onClick={speak}
      >
        <Volume2 aria-hidden="true" />
      </Button>
      {status ? <span className="audio-status" role="status" aria-live="polite">{status}</span> : null}
    </div>
  )
}

export function PhraseCard({
  phrase,
  source,
  emergency = false,
  onFullScreen,
}: {
  phrase: Phrase
  source?: string
  emergency?: boolean
  onFullScreen?: () => void
}) {
  const { isPhraseSaved, savePhrase, text } = useKannada()
  const saved = isPhraseSaved(phrase.kannada)

  return (
    <article className={`phrase-card${emergency ? ' emergency-phrase' : ''}`}>
      <div className="phrase-card-content">
        <p className="kannada-text" lang="kn">{phrase.kannada}</p>
        <p className="transliteration">{phrase.transliteration}</p>
        <p className="english-meaning">{phrase.english}</p>
      </div>
      <div className="phrase-actions">
        <AudioButton textToSpeak={phrase.kannada} label={text(`Listen to ${phrase.english}`, `${phrase.english} ಆಲಿಸಿ`)} />
        {source ? (
          <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            size="sm"
            aria-pressed={saved}
            onClick={() => savePhrase(phrase, source)}
          >
            {saved ? <BookmarkCheck data-icon="inline-start" aria-hidden="true" /> : <Bookmark data-icon="inline-start" aria-hidden="true" />}
            {saved ? text('Saved', 'ಉಳಿಸಲಾಗಿದೆ') : text('Save phrase', 'ನುಡಿಗಟ್ಟು ಉಳಿಸಿ')}
          </Button>
        ) : null}
        {onFullScreen ? (
          <Button type="button" variant="outline" size="sm" onClick={onFullScreen}>
            {text('Full screen', 'ಪೂರ್ಣ ಪರದೆ')}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        {action}
      </div>
    </div>
  )
}
