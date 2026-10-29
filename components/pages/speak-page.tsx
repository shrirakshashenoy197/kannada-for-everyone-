'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AudioLines, Mic, MicOff, Radio, RotateCcw, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioButton, PageHeading, PhraseCard } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { ALL_PHRASES } from '@/lib/kannada-data'

type RecognitionResult = Event & { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type RecognitionError = Event & { error?: string }
type BrowserRecognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionResult) => void) | null
  onerror: ((event: RecognitionError) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type RecognitionConstructor = new () => BrowserRecognition

type BrowserWindow = Window & {
  SpeechRecognition?: RecognitionConstructor
  webkitSpeechRecognition?: RecognitionConstructor
}

export function SpeakPage() {
  const { text, recordActivity } = useKannada()
  const [phraseId, setPhraseId] = useState(ALL_PHRASES[0]?.id ?? '')
  const [category, setCategory] = useState('all')
  const [recording, setRecording] = useState(false)
  const [recognizing, setRecognizing] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [recognitionMessage, setRecognitionMessage] = useState('')
  const [transcript, setTranscript] = useState('')
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [recordedAt, setRecordedAt] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<BrowserRecognition | null>(null)

  const categories = useMemo(() => Array.from(new Set(ALL_PHRASES.map((phrase) => phrase.category))).sort(), [])
  const phrases = useMemo(() => category === 'all' ? ALL_PHRASES : ALL_PHRASES.filter((phrase) => phrase.category === category), [category])
  const selectedPhrase = phrases.find((phrase) => phrase.id === phraseId) ?? phrases[0]

  useEffect(() => {
    if (selectedPhrase && selectedPhrase.id !== phraseId) setPhraseId(selectedPhrase.id)
  }, [phraseId, selectedPhrase])

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') recorder.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      recognitionRef.current?.stop()
    }
  }, [])

  useEffect(() => {
    if (!recordedUrl) return
    return () => URL.revokeObjectURL(recordedUrl)
  }, [recordedUrl])

  async function startRecording() {
    setRecordingError('')
    setRecordedAt('')
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError(text('Audio recording is not supported in this browser. You can still listen and use speech recognition if available.', 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಬೆಂಬಲವಿಲ್ಲ. ಲಭ್ಯವಿದ್ದರೆ ಆಲಿಸುವುದು ಮತ್ತು ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ಬಳಸಬಹುದು.'))
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      setRecordedUrl(null)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : undefined
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onerror = () => setRecordingError(text('The recording stopped because of a browser or microphone error.', 'ಬ್ರೌಸರ್ ಅಥವಾ ಮೈಕ್ರೋಫೋನ್ ದೋಷದಿಂದ ರೆಕಾರ್ಡಿಂಗ್ ನಿಂತಿದೆ.'))
      recorder.onstop = () => {
        const tracks = streamRef.current?.getTracks() ?? []
        tracks.forEach((track) => track.stop())
        streamRef.current = null
        setRecording(false)
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
          setRecordedUrl(URL.createObjectURL(blob))
          setRecordedAt(new Date().toLocaleTimeString())
          recordActivity('Recorded a Kannada speaking practice', 'speech')
        }
      }
      recorder.start()
      setRecording(true)
    } catch (error) {
      const permissionDenied = error instanceof DOMException && error.name === 'NotAllowedError'
      setRecordingError(permissionDenied
        ? text('Microphone permission was denied. Allow microphone access in your browser to record.', 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ರೆಕಾರ್ಡ್ ಮಾಡಲು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಸಿ.')
        : text('The microphone could not be opened. Check that it is connected and available.', 'ಮೈಕ್ರೋಫೋನ್ ತೆರೆಯಲಾಗಲಿಲ್ಲ. ಅದು ಸಂಪರ್ಕಗೊಂಡಿದೆ ಮತ್ತು ಲಭ್ಯವಿದೆ ಎಂದು ಪರಿಶೀಲಿಸಿ.'))
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') recorder.stop()
  }

  function clearPractice() {
    if (recording || recognizing) return
    setRecordedUrl(null)
    setRecordedAt('')
    setTranscript('')
    setRecordingError('')
    setRecognitionMessage('')
  }

  function startSpeechRecognition() {
    setRecognitionMessage('')
    setRecordingError('')
    if (typeof window === 'undefined') return
    const browserWindow = window as BrowserWindow
    const Constructor = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition
    if (!Constructor) {
      setRecognitionMessage(text('This browser does not provide speech recognition. Recording and listening still work; no pronunciation score is available.', 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ಇಲ್ಲ. ರೆಕಾರ್ಡಿಂಗ್ ಮತ್ತು ಆಲಿಸುವಿಕೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ; ಉಚ್ಚಾರಣಾ ಅಂಕ ಲಭ್ಯವಿಲ್ಲ.'))
      return
    }
    try {
      recognitionRef.current?.stop()
      const recognition = new Constructor()
      recognition.lang = 'kn-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const spoken = event.results[0]?.[0]?.transcript ?? ''
        setTranscript(spoken)
        setRecognitionMessage(spoken ? text('Browser transcript received. It is not a pronunciation score.', 'ಬ್ರೌಸರ್ ಮಾತಿನ ಲಿಪ್ಯಂತರ ಪಡೆದಿದೆ. ಇದು ಉಚ್ಚಾರಣಾ ಅಂಕವಲ್ಲ.') : text('No words were recognized. Try speaking clearly and again.', 'ಯಾವುದೇ ಪದ ಗುರುತಿಸಲಿಲ್ಲ. ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತೆ ಮಾತನಾಡಿ.'))
        if (spoken) recordActivity('Used Kannada speech recognition', 'speech')
      }
      recognition.onerror = (event) => {
        const reason = event.error === 'not-allowed'
          ? text('Microphone permission was denied. Allow it in your browser and retry.', 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
          : text('Speech recognition stopped. Check your connection and microphone, then retry.', 'ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ನಿಂತಿದೆ. ಸಂಪರ್ಕ ಮತ್ತು ಮೈಕ್ರೋಫೋನ್ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
        setRecognitionMessage(reason)
        setRecognizing(false)
      }
      recognition.onend = () => setRecognizing(false)
      recognitionRef.current = recognition
      setRecognizing(true)
      recognition.start()
    } catch {
      setRecognizing(false)
      setRecognitionMessage(text('Speech recognition could not start on this device.', 'ಈ ಸಾಧನದಲ್ಲಿ ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ಆರಂಭವಾಗಲಿಲ್ಲ.'))
    }
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('Listen and speak', 'ಆಲಿಸಿ ಮತ್ತು ಮಾತನಾಡಿ')}
        title={text('Practice Kannada aloud', 'ಕನ್ನಡವನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಅಭ್ಯಾಸ ಮಾಡಿ')}
        description={text('Choose a phrase, listen for an installed Kannada voice, then record yourself or use your browser’s Kannada speech recognition. Pronunciation is not automatically graded.', 'ಒಂದು ನುಡಿಗಟ್ಟು ಆಯ್ಕೆಮಾಡಿ, ಲಭ್ಯವಿರುವ ಕನ್ನಡ ಧ್ವನಿಯನ್ನು ಆಲಿಸಿ, ನಂತರ ನಿಮ್ಮನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ ಅಥವಾ ಬ್ರೌಸರ್‌ನ ಕನ್ನಡ ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ಬಳಸಿ. ಉಚ್ಚಾರಣೆಗೆ ಸ್ವಯಂಚಾಲಿತ ಅಂಕ ನೀಡುವುದಿಲ್ಲ.')}
      />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <section className="panel" aria-labelledby="speak-phrase-heading">
          <p className="eyebrow">{text('Choose a phrase', 'ನುಡಿಗಟ್ಟು ಆಯ್ಕೆಮಾಡಿ')}</p>
          <label className="form-field">
            <span className="form-label">{text('Category', 'ವರ್ಗ')}</span>
            <select className="select-input" value={category} disabled={recording || recognizing} onChange={(event) => { clearPractice(); setCategory(event.target.value) }}>
              <option value="all">{text('All phrases', 'ಎಲ್ಲ ನುಡಿಗಟ್ಟುಗಳು')}</option>
              {categories.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-field" style={{ marginTop: '0.8rem' }}>
            <span className="form-label">{text('Phrase', 'ನುಡಿಗಟ್ಟು')}</span>
            <select className="select-input" value={selectedPhrase?.id ?? ''} disabled={recording || recognizing} onChange={(event) => { clearPractice(); setPhraseId(event.target.value) }}>
              {phrases.map((phrase) => <option value={phrase.id} key={phrase.id}>{phrase.kannada} — {phrase.english}</option>)}
            </select>
          </label>
          {selectedPhrase ? (
            <div style={{ marginTop: '1rem' }}>
              <PhraseCard phrase={selectedPhrase} source="Speaking practice" />
              <p className="helper-text" id="speak-phrase-heading">{text('Choose Listen to hear it only when your device has a Kannada speech voice.', 'ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಇದ್ದಾಗ ಮಾತ್ರ ಆಲಿಸಿ ಬಟನ್‌ನಲ್ಲಿ ಕೇಳಬಹುದು.')}</p>
            </div>
          ) : null}
        </section>

        <section className="panel" aria-labelledby="record-heading">
          <p className="eyebrow">{text('Private speaking practice', 'ಖಾಸಗಿ ಮಾತಿನ ಅಭ್ಯಾಸ')}</p>
          <h2 id="record-heading">{text('Record on this device', 'ಈ ಸಾಧನದಲ್ಲೇ ರೆಕಾರ್ಡ್ ಮಾಡಿ')}</h2>
          <p className="muted-text">{text('Microphone access is requested only after you press Record. Audio stays in this page and is not uploaded or saved after you leave.', 'ರೆಕಾರ್ಡ್ ಒತ್ತಿದಾಗ ಮಾತ್ರ ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ಕೇಳಲಾಗುತ್ತದೆ. ಧ್ವನಿ ಈ ಪುಟದಲ್ಲೇ ಇರುತ್ತದೆ; ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ ಅಥವಾ ಹೊರಬಂದ ನಂತರ ಉಳಿಯುವುದಿಲ್ಲ.')}</p>
          <div className="button-row" style={{ marginTop: '1rem' }}>
            {recording ? (
              <Button type="button" variant="destructive" onClick={stopRecording}><MicOff data-icon="inline-start" aria-hidden="true" /> {text('Stop recording', 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ')}</Button>
            ) : (
              <Button type="button" variant="secondary" disabled={recognizing} onClick={startRecording}><Mic data-icon="inline-start" aria-hidden="true" /> {text('Record my voice', 'ನನ್ನ ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ')}</Button>
            )}
            <Button type="button" variant="outline" disabled={recording || recognizing} onClick={startSpeechRecognition}>
              {recognizing ? <AudioLines data-icon="inline-start" aria-hidden="true" className="animate-pulse" /> : <Radio data-icon="inline-start" aria-hidden="true" />}
              {recognizing ? text('Listening…', 'ಆಲಿಸುತ್ತಿದೆ…') : text('Recognize my speech', 'ನನ್ನ ಮಾತು ಗುರುತಿಸಿ')}
            </Button>
            {recordedUrl || transcript || recordingError || recognitionMessage ? (
              <Button type="button" variant="outline" disabled={recording || recognizing} onClick={clearPractice}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Retry this phrase', 'ಈ ನುಡಿಗಟ್ಟು ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ')}</Button>
            ) : null}
          </div>
          {recording ? <p className="status-note" role="status">{text('Recording now. Press Stop when you are done.', 'ಈಗ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ. ಮುಗಿದಾಗ ನಿಲ್ಲಿಸಿ ಒತ್ತಿ.')}</p> : null}
          {recordingError ? <p className="status-note status-error" role="alert">{recordingError}</p> : null}
          {recognitionMessage ? <p className="status-note" role="status" aria-live="polite">{recognitionMessage}</p> : null}
          {recordedUrl ? (
            <div className="panel" style={{ marginTop: '1rem', background: 'var(--muted)' }}>
              <p className="form-label">{text(`Your recording · ${recordedAt}`, `ನಿಮ್ಮ ರೆಕಾರ್ಡಿಂಗ್ · ${recordedAt}`)}</p>
              <audio controls src={recordedUrl} aria-label={text('Play your Kannada recording', 'ನಿಮ್ಮ ಕನ್ನಡ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ಲೇ ಮಾಡಿ')} style={{ width: '100%' }} />
            </div>
          ) : null}
          {transcript ? (
            <div className="panel" style={{ marginTop: '1rem' }}>
              <p className="eyebrow">{text('Browser transcript', 'ಬ್ರೌಸರ್ ಲಿಪ್ಯಂತರ')}</p>
              <p className="kannada-text" lang="kn">{transcript}</p>
              <p className="helper-text">{text('Speech recognition can be inaccurate and availability varies by browser. This transcript does not evaluate pronunciation.', 'ಮಾತಿನ ಗುರುತಿಸುವಿಕೆ ತಪ್ಪಾಗಬಹುದು ಮತ್ತು ಬ್ರೌಸರ್‌ನಂತೆ ಲಭ್ಯತೆ ಬದಲಾಗುತ್ತದೆ. ಈ ಲಿಪ್ಯಂತರ ಉಚ್ಚಾರಣೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುವುದಿಲ್ಲ.')}</p>
            </div>
          ) : null}
        </section>
      </div>
      <p className="helper-text" style={{ marginTop: '1rem' }}><Volume2 aria-hidden="true" /> {text('A Kannada voice is not included with the app. If your browser has no Kannada voice, the Listen control will explain that instead of playing a different language.', 'ಅಪ್‌ನಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಸೇರಿಲ್ಲ. ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಇಲ್ಲದಿದ್ದರೆ ಬೇರೆ ಭಾಷೆ ಪ್ಲೇ ಮಾಡುವ ಬದಲು ಆಲಿಸಿ ನಿಯಂತ್ರಣ ಅದನ್ನು ತಿಳಿಸುತ್ತದೆ.')}</p>
    </div>
  )
}
