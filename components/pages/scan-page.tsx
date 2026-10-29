'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Camera, ImagePlus, LoaderCircle, ScanLine, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { ALL_PHRASES, type Phrase } from '@/lib/kannada-data'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function normalizeKannada(value: string) {
  return value.replace(/[\s\p{P}\p{S}]+/gu, '').toLocaleLowerCase()
}

export function ScanPage() {
  const { text } = useKannada()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [recognizedText, setRecognizedText] = useState('')
  const [confidence, setConfidence] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const matchedPhrase = useMemo(() => {
    const normalized = normalizeKannada(recognizedText)
    if (!normalized) return undefined
    return ALL_PHRASES.find((phrase) => normalizeKannada(phrase.kannada) === normalized)
  }, [recognizedText])

  const scannedPhrase: Phrase | null = recognizedText.trim() ? {
    id: `scan-${Date.now()}`,
    kannada: recognizedText.trim(),
    transliteration: matchedPhrase?.transliteration ?? text('Transliteration unavailable', 'ಲಿಪ್ಯಂತರ ಲಭ್ಯವಿಲ್ಲ'),
    english: matchedPhrase?.english ?? text('No reviewed English translation is available offline.', 'ಪರಿಶೀಲಿತ ಇಂಗ್ಲಿಷ್ ಅನುವಾದ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.'),
    category: 'Scanned sign',
  } : null

  function clearImage() {
    setFile(null)
    setPreview(null)
    setRecognizedText('')
    setConfidence(null)
    setProgress(0)
    setError('')
    setStatus('')
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0]
    if (!selectedFile) return
    setError('')
    setRecognizedText('')
    setConfidence(null)
    setStatus('')
    if (!ACCEPTED_TYPES.has(selectedFile.type)) {
      setError(text('Choose a JPG, PNG, or WebP image.', 'JPG, PNG ಅಥವಾ WebP ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ.'))
      event.currentTarget.value = ''
      return
    }
    if (selectedFile.size > MAX_IMAGE_BYTES) {
      setError(text('This image is larger than 5 MB. Choose a smaller file.', 'ಈ ಚಿತ್ರ 5 MB ಗಿಂತ ದೊಡ್ಡದು. ಚಿಕ್ಕ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.'))
      event.currentTarget.value = ''
      return
    }
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  async function runOcr() {
    if (!file || busy) return
    setBusy(true)
    setError('')
    setStatus(text('Loading the Kannada OCR model…', 'ಕನ್ನಡ OCR ಮಾದರಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…'))
    setProgress(0)
    let worker: Awaited<ReturnType<(typeof import('tesseract.js'))['createWorker']>> | null = null
    try {
      const tesseract = await import('tesseract.js')
      worker = await tesseract.createWorker('kan', tesseract.OEM.LSTM_ONLY, {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        logger: (message) => {
          if (message.status === 'recognizing text') {
            setStatus(text('Reading Kannada text…', 'ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಓದಲಾಗುತ್ತಿದೆ…'))
          } else if (message.status) {
            setStatus(message.status)
          }
          if (Number.isFinite(message.progress)) setProgress(Math.round(message.progress * 100))
        },
      })
      const result = await worker.recognize(file)
      const output = result.data.text.trim()
      setRecognizedText(output)
      setConfidence(Math.round(result.data.confidence))
      setProgress(100)
      setStatus(output ? text('OCR finished. Review the text before using it.', 'OCR ಪೂರ್ಣಗೊಂಡಿದೆ. ಬಳಸುವ ಮೊದಲು ಪಠ್ಯ ಪರಿಶೀಲಿಸಿ.') : text('No readable Kannada text was found. Try a sharper, well-lit image.', 'ಓದಬಹುದಾದ ಕನ್ನಡ ಪಠ್ಯ ಸಿಗಲಿಲ್ಲ. ಸ್ಪಷ್ಟವಾದ, ಚೆನ್ನಾಗಿ ಬೆಳಗಿದ ಚಿತ್ರ ಪ್ರಯತ್ನಿಸಿ.'))
    } catch {
      setError(text('Kannada OCR could not start. Check your connection for the first model download, then try again.', 'ಕನ್ನಡ OCR ಆರಂಭವಾಗಲಿಲ್ಲ. ಮೊದಲ ಮಾದರಿ ಡೌನ್‌ಲೋಡ್‌ಗಾಗಿ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'))
      setStatus('')
    } finally {
      if (worker) await worker.terminate().catch(() => undefined)
      setBusy(false)
    }
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('Read the world around you', 'ನಿಮ್ಮ ಸುತ್ತಲಿನ ಪಠ್ಯ ಓದಿ')}
        title={text('Scan Kannada text', 'ಕನ್ನಡ ಪಠ್ಯ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ')}
        description={text('Upload a sign or menu image. Kannada OCR runs in your browser using Tesseract; the image is not uploaded. English translation is shown only for an exact match in the reviewed phrase set.', 'ಫಲಕ ಅಥವಾ ಮೆನು ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. Tesseract ಬಳಸಿ ಕನ್ನಡ OCR ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ನಡೆಯುತ್ತದೆ; ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ. ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟುಗಳಿಗೆ ನಿಖರ ಹೊಂದಾಣಿಕೆಯಿದ್ದಾಗ ಮಾತ್ರ ಇಂಗ್ಲಿಷ್ ಅನುವಾದ ತೋರಿಸಲಾಗುತ್ತದೆ.')}
      />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <section className="panel" aria-labelledby="upload-heading">
          <div className="section-heading">
            <div><p className="eyebrow">{text('Image input', 'ಚಿತ್ರ ಇನ್‌ಪುಟ್')}</p><h2 id="upload-heading">{text('Choose a Kannada image', 'ಕನ್ನಡ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ')}</h2></div>
            <ImagePlus aria-hidden="true" />
          </div>
          <p className="muted-text">{text('JPG, PNG, or WebP · Up to 5 MB · Processing stays on this device. First use downloads about 2 MB of Kannada OCR language data.', 'JPG, PNG ಅಥವಾ WebP · ಗರಿಷ್ಠ 5 MB · ಪ್ರಕ್ರಿಯೆ ಈ ಸಾಧನದಲ್ಲೇ ನಡೆಯುತ್ತದೆ. ಮೊದಲ ಬಳಕೆಯಲ್ಲಿ ಸುಮಾರು 2 MB ಕನ್ನಡ OCR ಭಾಷಾ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತದೆ.')}</p>
          <label className="form-field" style={{ marginTop: '1rem' }}>
            <span className="form-label">{text('Select or take a photo', 'ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ತೆಗೆದುಕೊಳ್ಳಿ')}</span>
            <input ref={inputRef} className="text-input" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleFileChange} aria-describedby="scan-file-hint" />
          </label>
          <p className="helper-text" id="scan-file-hint">{text('Use a clear, front-facing image with good lighting for better recognition.', 'ಉತ್ತಮ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ಸ್ಪಷ್ಟ, ನೇರ ಮತ್ತು ಚೆನ್ನಾಗಿ ಬೆಳಗಿದ ಚಿತ್ರ ಬಳಸಿ.')}</p>
          {error ? <p className="status-note status-error" role="alert">{error}</p> : null}
          {status ? <p className="status-note" role="status" aria-live="polite">{status}</p> : null}
          {busy ? <div style={{ marginTop: '1rem' }}><ProgressBar label={text('OCR progress', 'OCR ಪ್ರಗತಿ')} value={progress} max={100} /></div> : null}
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <Button type="button" variant="secondary" disabled={!file || busy} onClick={runOcr}>
              {busy ? <LoaderCircle data-icon="inline-start" aria-hidden="true" className="animate-spin" /> : <ScanLine data-icon="inline-start" aria-hidden="true" />}
              {busy ? text('Reading…', 'ಓದುತ್ತಿದೆ…') : text('Read Kannada text', 'ಕನ್ನಡ ಪಠ್ಯ ಓದಿ')}
            </Button>
            {file ? <Button type="button" variant="outline" disabled={busy} onClick={clearImage}><Trash2 data-icon="inline-start" aria-hidden="true" /> {text('Clear image', 'ಚಿತ್ರ ತೆರವುಗೊಳಿಸಿ')}</Button> : null}
          </div>
          {preview ? (
            <figure style={{ margin: '1.3rem 0 0' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: '1rem', background: 'var(--muted)' }}>
                <Image src={preview} alt={file?.name ? text(`Preview of ${file.name}`, `${file.name} ಪೂರ್ವವೀಕ್ಷಣೆ`) : text('Selected image preview', 'ಆಯ್ಕೆಮಾಡಿದ ಚಿತ್ರ ಪೂರ್ವವೀಕ್ಷಣೆ')} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: 'contain' }} />
              </div>
              <figcaption className="helper-text" style={{ marginTop: '0.45rem' }}>{file?.name}</figcaption>
            </figure>
          ) : (
            <div className="empty-state" style={{ minHeight: '210px', marginTop: '1rem' }}>
              <div><Camera aria-hidden="true" /><h3>{text('Your image preview will appear here', 'ನಿಮ್ಮ ಚಿತ್ರದ ಪೂರ್ವವೀಕ್ಷಣೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ')}</h3><p>{text('No sample result is shown. Recognition starts only after you choose an image.', 'ಮಾದರಿ ಫಲಿತಾಂಶ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ. ನೀವು ಚಿತ್ರ ಆಯ್ಕೆ ಮಾಡಿದ ನಂತರ ಮಾತ್ರ ಗುರುತಿಸುವಿಕೆ ಆರಂಭವಾಗುತ್ತದೆ.')}</p></div>
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="scan-result-heading">
          <div className="section-heading">
            <div><p className="eyebrow">{text('Actual OCR result', 'ನಿಜವಾದ OCR ಫಲಿತಾಂಶ')}</p><h2 id="scan-result-heading">{text('Recognized text', 'ಗುರುತಿಸಿದ ಪಠ್ಯ')}</h2></div>
          </div>
          {scannedPhrase ? (
            <>
              <label className="form-field">
                <span className="form-label">{text('Review or correct the detected Kannada', 'ಗುರುತಿಸಿದ ಕನ್ನಡ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಸರಿಪಡಿಸಿ')}</span>
                <textarea className="textarea-input" lang="kn" value={recognizedText} onChange={(event) => setRecognizedText(event.target.value)} />
              </label>
              {confidence !== null ? <p className="helper-text">{text('OCR confidence (not translation confidence)', 'OCR ನಿಖರತೆ (ಅನುವಾದದ ನಿಖರತೆ ಅಲ್ಲ)')}: {confidence}%</p> : null}
              {matchedPhrase ? (
                <p className="status-note" style={{ marginTop: '1rem' }}>{text('Exact match in the reviewed phrase set:', 'ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟುಗಳಲ್ಲಿ ನಿಖರ ಹೊಂದಾಣಿಕೆ:')} <strong>{matchedPhrase.english}</strong></p>
              ) : (
                <p className="status-note" style={{ marginTop: '1rem' }}>{text('No exact reviewed phrase match. This page does not invent an English translation.', 'ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟಿನಲ್ಲಿ ನಿಖರ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ. ಈ ಪುಟ ಇಂಗ್ಲಿಷ್ ಅನುವಾದವನ್ನು ಕಲ್ಪಿಸುವುದಿಲ್ಲ.')}</p>
              )}
              <div style={{ marginTop: '1rem' }}>
                <PhraseCard phrase={scannedPhrase} source="Scanned Kannada sign" />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div><ScanLine aria-hidden="true" /><h3>{text('Nothing scanned yet', 'ಇನ್ನೂ ಏನೂ ಸ್ಕ್ಯಾನ್ ಆಗಿಲ್ಲ')}</h3><p>{text('Choose a real image, then run OCR to see text detected from that image.', 'ನಿಜವಾದ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ, ನಂತರ OCR ನಡೆಸಿ ಅದರಲ್ಲಿರುವ ಪಠ್ಯ ನೋಡಿ.')}</p></div>
            </div>
          )}
        </section>
      </div>
      <p className="helper-text" style={{ marginTop: '1rem' }}>{text('OCR quality depends on image focus, contrast, font, and lighting. Always verify recognized text before relying on it.', 'OCR ಫಲಿತಾಂಶ ಚಿತ್ರ ಸ್ಪಷ್ಟತೆ, ಕಾಂಟ್ರಾಸ್ಟ್, ಅಕ್ಷರಶೈಲಿ ಮತ್ತು ಬೆಳಕಿನ ಮೇಲೆ ಅವಲಂಬಿತ. ಬಳಸುವ ಮೊದಲು ಗುರುತಿಸಿದ ಪಠ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ.')}</p>
    </div>
  )
}
