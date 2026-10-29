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
const TESSDATA_PATH = 'https://tessdata.projectnaptha.com/4.0.0'
const MIN_IMAGE_DIMENSION = 1600
const MAX_IMAGE_DIMENSION = 3600
const MAX_IMAGE_PIXELS = 8_000_000
const MIN_OCR_CONFIDENCE = 80

function normalizeKannada(value: string) {
  return value.replace(/[\s\p{P}\p{S}]+/gu, '').toLocaleLowerCase()
}

function findReviewedPhrase(value: string) {
  const normalized = normalizeKannada(value)
  if (!normalized) return undefined
  return ALL_PHRASES.find((phrase) => normalizeKannada(phrase.kannada) === normalized)
}

function hasSupportedLetters(value: string) {
  return /[A-Za-z\u0C85-\u0CB9]/u.test(value)
}

async function prepareOcrCanvas(file: File): Promise<HTMLCanvasElement> {
  let bitmap: ImageBitmap | null = null
  let fallbackImage: HTMLImageElement | null = null
  let fallbackUrl: string | null = null

  try {
    if (typeof createImageBitmap === 'function') {
      try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      } catch {
        bitmap = null
      }
    }

    if (!bitmap) {
      fallbackUrl = URL.createObjectURL(file)
      fallbackImage = document.createElement('img')
      fallbackImage.decoding = 'async'
      fallbackImage.src = fallbackUrl
      await fallbackImage.decode()
    }

    const source: CanvasImageSource = bitmap ?? fallbackImage!
    const width = bitmap?.width ?? fallbackImage!.naturalWidth
    const height = bitmap?.height ?? fallbackImage!.naturalHeight
    const longestDimension = Math.max(width, height)
    if (!width || !height || !longestDimension) throw new Error('The image has no readable dimensions.')

    const maxScale = Math.min(
      MAX_IMAGE_DIMENSION / longestDimension,
      Math.sqrt(MAX_IMAGE_PIXELS / (width * height)),
    )
    const requestedScale = longestDimension < MIN_IMAGE_DIMENSION ? MIN_IMAGE_DIMENSION / longestDimension : 1
    const scale = Math.min(maxScale, requestedScale)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas image processing is unavailable.')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(source, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    for (let index = 0; index < pixels.length; index += 4) {
      const luminance = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114
      const enhanced = Math.max(0, Math.min(255, Math.round((luminance - 128) * 1.18 + 128)))
      pixels[index] = enhanced
      pixels[index + 1] = enhanced
      pixels[index + 2] = enhanced
      pixels[index + 3] = 255
    }
    context.putImageData(imageData, 0, 0)
    return canvas
  } finally {
    bitmap?.close()
    if (fallbackUrl) URL.revokeObjectURL(fallbackUrl)
  }
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
  const [includeEnglish, setIncludeEnglish] = useState(false)
  const [reviewConfirmed, setReviewConfirmed] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const matchedPhrase = useMemo(() => findReviewedPhrase(recognizedText), [recognizedText])
  const reviewedLineMatches = useMemo(() => recognizedText.split(/\r?\n/u).flatMap((line, index) => {
    const phrase = findReviewedPhrase(line)
    return phrase ? [{ key: `${index}-${phrase.id}`, line: line.trim(), phrase }] : []
  }), [recognizedText])

  const scannedPhrase: Phrase | null = useMemo(() => recognizedText.trim() ? {
    id: 'scan-result',
    kannada: recognizedText.trim(),
    transliteration: matchedPhrase?.transliteration ?? text('Transliteration unavailable for this OCR text.', 'ಈ OCR ಪಠ್ಯಕ್ಕೆ ಲಿಪ್ಯಂತರ ಲಭ್ಯವಿಲ್ಲ.'),
    english: matchedPhrase?.english ?? text('No verified translation is available. OCR does not translate text.', 'ಪರಿಶೀಲಿತ ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ. OCR ಪಠ್ಯವನ್ನು ಅನುವಾದಿಸುವುದಿಲ್ಲ.'),
    category: 'Scanned sign',
  } : null, [matchedPhrase, recognizedText, text])

  function clearImage() {
    setFile(null)
    setPreview(null)
    setRecognizedText('')
    setConfidence(null)
    setProgress(0)
    setError('')
    setStatus('')
    setReviewConfirmed(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0]
    if (!selectedFile) return
    setError('')
    setRecognizedText('')
    setConfidence(null)
    setProgress(0)
    setStatus('')
    setReviewConfirmed(false)
    setFile(null)
    setPreview(null)
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
    setRecognizedText('')
    setConfidence(null)
    setReviewConfirmed(false)
    setStatus(text('Preparing the uploaded image…', 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…'))
    setProgress(0)
    let worker: Awaited<ReturnType<(typeof import('tesseract.js'))['createWorker']>> | null = null

    try {
      const ocrCanvas = await prepareOcrCanvas(file)
      setStatus(includeEnglish
        ? text('Loading Kannada and English OCR data…', 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ OCR ಡೇಟಾ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…')
        : text('Loading Kannada OCR data…', 'ಕನ್ನಡ OCR ಡೇಟಾ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…'))
      const tesseract = await import('tesseract.js')
      const languages = includeEnglish ? ['kan', 'eng'] : ['kan']
      worker = await tesseract.createWorker(languages, tesseract.OEM.LSTM_ONLY, {
        langPath: TESSDATA_PATH,
        cacheMethod: 'write',
        logger: (message) => {
          const currentStatus = message.status.toLowerCase()
          if (currentStatus === 'recognizing text') {
            setStatus(includeEnglish
              ? text('Reading Kannada and English text…', 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಪಠ್ಯ ಓದಲಾಗುತ್ತಿದೆ…')
              : text('Reading Kannada text…', 'ಕನ್ನಡ ಪಠ್ಯ ಓದಲಾಗುತ್ತಿದೆ…'))
          } else if (currentStatus.includes('traineddata') || currentStatus.includes('language')) {
            setStatus(text('Downloading or loading OCR language data…', 'OCR ಭಾಷಾ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ…'))
          } else {
            setStatus(text('Preparing the OCR engine…', 'OCR ಎಂಜಿನ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…'))
          }
          if (Number.isFinite(message.progress)) {
            setProgress(Math.max(0, Math.min(100, Math.round(message.progress * 100))))
          }
        },
      })
      await worker.setParameters({
        tessedit_pageseg_mode: tesseract.PSM.AUTO,
        preserve_interword_spaces: '1',
        user_defined_dpi: '300',
      })

      let result = await worker.recognize(ocrCanvas, { rotateAuto: true })
      let output = result.data.text.replace(/\r\n?/gu, '\n').trim()
      let confidenceValue = Number.isFinite(result.data.confidence) ? Math.round(result.data.confidence) : 0

      if (confidenceValue < MIN_OCR_CONFIDENCE) {
        setStatus(text('Trying a second OCR layout for clearer text…', 'ಹೆಚ್ಚು ಸ್ಪಷ್ಟ ಪಠ್ಯಕ್ಕಾಗಿ ಎರಡನೇ OCR ವಿನ್ಯಾಸ ಪ್ರಯತ್ನಿಸಲಾಗುತ್ತಿದೆ…'))
        await worker.setParameters({
          tessedit_pageseg_mode: tesseract.PSM.SINGLE_BLOCK,
          preserve_interword_spaces: '1',
          user_defined_dpi: '300',
        })
        const alternate = await worker.recognize(file)
        const alternateText = alternate.data.text.replace(/\r\n?/gu, '\n').trim()
        const alternateConfidence = Number.isFinite(alternate.data.confidence) ? Math.round(alternate.data.confidence) : 0
        const primaryMatchesReviewedPhrase = Boolean(findReviewedPhrase(output)) || output.split(/\r?\n/u).some((line) => Boolean(findReviewedPhrase(line)))
        const alternateMatchesReviewedPhrase = Boolean(findReviewedPhrase(alternateText)) || alternateText.split(/\r?\n/u).some((line) => Boolean(findReviewedPhrase(line)))

        if ((alternateMatchesReviewedPhrase && !primaryMatchesReviewedPhrase) || alternateConfidence > confidenceValue) {
          result = alternate
          output = alternateText
          confidenceValue = alternateConfidence
        }
      }

      setConfidence(confidenceValue)
      setProgress(100)

      if (!output || !hasSupportedLetters(output)) {
        setError(text('No reliable Kannada or English text was detected. Upload a sharper, closer image with good lighting.', 'ವಿಶ್ವಾಸಾರ್ಹ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಪಠ್ಯ ಸಿಗಲಿಲ್ಲ. ಹೆಚ್ಚು ಸ್ಪಷ್ಟವಾದ, ಹತ್ತಿರದ ಮತ್ತು ಚೆನ್ನಾಗಿ ಬೆಳಗಿದ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.'))
        setStatus('')
        return
      }

      const hasReviewedPhraseMatch = Boolean(findReviewedPhrase(output)) || output.split(/\r?\n/u).some((line) => Boolean(findReviewedPhrase(line)))
      if (confidenceValue < MIN_OCR_CONFIDENCE && !hasReviewedPhraseMatch) {
        setError(text(`Recognition confidence was only ${confidenceValue}%. The result was hidden. Upload a clearer image and try again.`, `ಗುರುತಿಸುವಿಕೆಯ ವಿಶ್ವಾಸಾರ್ಹತೆ ${confidenceValue}% ಮಾತ್ರ. ಫಲಿತಾಂಶವನ್ನು ಮರೆಮಾಡಲಾಗಿದೆ. ಇನ್ನಷ್ಟು ಸ್ಪಷ್ಟವಾದ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`))
        setStatus('')
        return
      }

      setRecognizedText(output)
      setStatus(confidenceValue < 65
        ? text('OCR found text, but confidence is low. Review each line carefully before using it.', 'OCR ಪಠ್ಯ ಕಂಡುಹಿಡಿದಿದೆ, ಆದರೆ ವಿಶ್ವಾಸಾರ್ಹತೆ ಕಡಿಮೆ. ಬಳಸುವ ಮೊದಲು ಪ್ರತಿಯೊಂದು ಸಾಲನ್ನೂ ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಿ.')
        : text('OCR finished. Review the text before using or saving it.', 'OCR ಪೂರ್ಣಗೊಂಡಿದೆ. ಬಳಸುವ ಅಥವಾ ಉಳಿಸುವ ಮೊದಲು ಪಠ್ಯ ಪರಿಶೀಲಿಸಿ.'))
    } catch {
      setError(includeEnglish
        ? text('OCR could not process this image or load Kannada and English language data. Confirm the file is a valid JPG, PNG, or WebP image and that you are online for the first model download, then try again.', 'ಈ ಚಿತ್ರವನ್ನು OCR ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಅಥವಾ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷಾ ಡೇಟಾ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಫೈಲ್ ಮಾನ್ಯ JPG, PNG ಅಥವಾ WebP ಚಿತ್ರವಾಗಿದೆಯೇ ಮತ್ತು ಮೊದಲ ಮಾದರಿ ಡೌನ್‌ಲೋಡ್‌ಗೆ ಸಂಪರ್ಕವಿದೆಯೇ ಪರಿಶೀಲಿಸಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
        : text('OCR could not process this image or load Kannada language data. Confirm the file is a valid JPG, PNG, or WebP image and that you are online for the first model download, then try again.', 'ಈ ಚಿತ್ರವನ್ನು OCR ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಅಥವಾ ಕನ್ನಡ ಭಾಷಾ ಡೇಟಾ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಫೈಲ್ ಮಾನ್ಯ JPG, PNG ಅಥವಾ WebP ಚಿತ್ರವಾಗಿದೆಯೇ ಮತ್ತು ಮೊದಲ ಮಾದರಿ ಡೌನ್‌ಲೋಡ್‌ಗೆ ಸಂಪರ್ಕವಿದೆಯೇ ಪರಿಶೀಲಿಸಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'))
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
        title={text('Scan Kannada and English text', 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಪಠ್ಯ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ')}
        description={text('Upload a sign, menu, or document image. Kannada OCR runs locally by default; enable English for bilingual images. The image is never uploaded. English meaning appears only for exact matches in the reviewed phrase set.', 'ಫಲಕ, ಮೆನು ಅಥವಾ ದಾಖಲೆ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಕನ್ನಡ OCR ಸ್ಥಳೀಯವಾಗಿ ನಡೆಯುತ್ತದೆ; ದ್ವಿಭಾಷಾ ಚಿತ್ರಗಳಿಗೆ ಇಂಗ್ಲಿಷ್ ಆಯ್ಕೆ ಸಕ್ರಿಯಗೊಳಿಸಿ. ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದಿಲ್ಲ. ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟುಗಳೊಂದಿಗೆ ನಿಖರ ಹೊಂದಾಣಿಕೆ ಇದ್ದಾಗ ಮಾತ್ರ ಇಂಗ್ಲಿಷ್ ಅರ್ಥ ತೋರಿಸಲಾಗುತ್ತದೆ.')}
      />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <section className="panel" aria-labelledby="upload-heading">
          <div className="section-heading">
            <div><p className="eyebrow">{text('Image input', 'ಚಿತ್ರ ಇನ್‌ಪುಟ್')}</p><h2 id="upload-heading">{text('Choose a Kannada or bilingual image', 'ಕನ್ನಡ ಅಥವಾ ದ್ವಿಭಾಷಾ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ')}</h2></div>
            <ImagePlus aria-hidden="true" />
          </div>
          <p className="muted-text">{text('JPG, PNG, or WebP · Up to 5 MB · Processing stays on this device. Kannada OCR data downloads on first use; English data is only added for bilingual scans and may be cached.', 'JPG, PNG ಅಥವಾ WebP · ಗರಿಷ್ಠ 5 MB · ಪ್ರಕ್ರಿಯೆ ಈ ಸಾಧನದಲ್ಲೇ ನಡೆಯುತ್ತದೆ. ಕನ್ನಡ OCR ಡೇಟಾ ಮೊದಲ ಬಳಕೆಯಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತದೆ; ದ್ವಿಭಾಷಾ ಸ್ಕ್ಯಾನ್‌ಗಳಿಗೆ ಮಾತ್ರ ಇಂಗ್ಲಿಷ್ ಡೇಟಾ ಸೇರಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಅದು ಕ್ಯಾಶ್ ಆಗಿರಬಹುದು.')}</p>
          <label className="form-field" style={{ marginTop: '1rem' }}>
            <span className="form-label">{text('Select or take a text photo', 'ಪಠ್ಯದ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ತೆಗೆದುಕೊಳ್ಳಿ')}</span>
            <input ref={inputRef} className="text-input" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleFileChange} aria-describedby="scan-file-hint" disabled={busy} />
          </label>
          <p className="helper-text" id="scan-file-hint">{text('Use a clear, upright image with good lighting. The original preview stays unchanged while OCR processes a separate enhanced copy.', 'ಸ್ಪಷ್ಟ, ನೇರ ಮತ್ತು ಚೆನ್ನಾಗಿ ಬೆಳಗಿದ ಚಿತ್ರ ಬಳಸಿ. OCR ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಾಗ ಮೂಲ ಪೂರ್ವವೀಕ್ಷಣೆ ಬದಲಾಗುವುದಿಲ್ಲ; ಪ್ರತ್ಯೇಕವಾಗಿ ಸುಧಾರಿಸಿದ ಪ್ರತಿಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.')}</p>
          <label className="helper-text" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginTop: '0.75rem' }}>
            <input
              type="checkbox"
              checked={includeEnglish}
              disabled={busy}
              onChange={(event) => {
                setIncludeEnglish(event.target.checked)
                setRecognizedText('')
                setConfidence(null)
                setReviewConfirmed(false)
                setStatus('')
                setError('')
                setProgress(0)
              }}
            />
            <span>{text('This image also contains English text. Enable bilingual OCR; the English model downloads once and may be cached.', 'ಈ ಚಿತ್ರದಲ್ಲಿ ಇಂಗ್ಲಿಷ್ ಪಠ್ಯವೂ ಇದೆ. ದ್ವಿಭಾಷಾ OCR ಸಕ್ರಿಯಗೊಳಿಸಿ; ಇಂಗ್ಲಿಷ್ ಮಾದರಿ ಒಮ್ಮೆ ಡೌನ್‌ಲೋಡ್ ಆಗಿ ನಂತರ ಕ್ಯಾಶ್ ಆಗಿರಬಹುದು.')}</span>
          </label>
          {error ? <p className="status-note status-error" role="alert">{error}</p> : null}
          {status ? <p className="status-note" role="status" aria-live="polite">{status}</p> : null}
          {busy ? <div style={{ marginTop: '1rem' }}><ProgressBar label={text('OCR progress', 'OCR ಪ್ರಗತಿ')} value={progress} max={100} /></div> : null}
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <Button type="button" variant="secondary" disabled={!file || busy} onClick={runOcr}>
              {busy ? <LoaderCircle data-icon="inline-start" aria-hidden="true" className="animate-spin" /> : <ScanLine data-icon="inline-start" aria-hidden="true" />}
              {busy ? text('Reading…', 'ಓದುತ್ತಿದೆ…') : text('Read image text', 'ಚಿತ್ರದ ಪಠ್ಯ ಓದಿ')}
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
                <span className="form-label">{text('Review or correct the detected text', 'ಗುರುತಿಸಿದ ಪಠ್ಯ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಸರಿಪಡಿಸಿ')}</span>
                <textarea className="textarea-input" lang="kn" value={recognizedText} onChange={(event) => {
                setRecognizedText(event.target.value)
                setReviewConfirmed(false)
                setConfidence(null)
                setStatus(text('Text edited; the original OCR confidence no longer applies.', 'ಪಠ್ಯವನ್ನು ಸಂಪಾದಿಸಲಾಗಿದೆ; ಮೂಲ OCR ವಿಶ್ವಾಸಾರ್ಹತೆ ಇನ್ನು ಅನ್ವಯಿಸುವುದಿಲ್ಲ.'))
              }} />
              </label>
              {confidence !== null ? <p className="helper-text">{text('OCR confidence (not translation confidence)', 'OCR ನಿಖರತೆ (ಅನುವಾದದ ನಿಖರತೆ ಅಲ್ಲ)')}: {confidence}%</p> : null}
              {matchedPhrase ? (
                <p className="status-note" style={{ marginTop: '1rem' }}>{text('Exact full-text match in the reviewed phrase set:', 'ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟುಗಳಲ್ಲಿ ಪೂರ್ಣ ಪಠ್ಯಕ್ಕೆ ನಿಖರ ಹೊಂದಾಣಿಕೆ:')} <strong>{matchedPhrase.english}</strong></p>
              ) : reviewedLineMatches.length > 0 ? (
                <div className="status-note" style={{ marginTop: '1rem' }}>
                  <p>{text('Verified English matches for exact Kannada lines:', 'ನಿಖರ ಕನ್ನಡ ಸಾಲುಗಳಿಗೆ ಪರಿಶೀಲಿಸಿದ ಇಂಗ್ಲಿಷ್ ಅರ್ಥಗಳು:')}</p>
                  <ul>
                    {reviewedLineMatches.map((match) => <li key={match.key}><span lang="kn">{match.line}</span> — <strong>{match.phrase.english}</strong></li>)}
                  </ul>
                </div>
              ) : (
                <p className="status-note" style={{ marginTop: '1rem' }}>{text('No exact match in the reviewed phrase set. OCR does not translate text, so no English translation is shown.', 'ಪರಿಶೀಲಿಸಿದ ನುಡಿಗಟ್ಟುಗಳಲ್ಲಿ ನಿಖರ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ. OCR ಪಠ್ಯವನ್ನು ಅನುವಾದಿಸುವುದಿಲ್ಲ; ಆದ್ದರಿಂದ ಇಂಗ್ಲಿಷ್ ಅನುವಾದ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ.')}</p>
              )}
              <div style={{ marginTop: '1rem' }}>
                <Button
                  type="button"
                  variant={reviewConfirmed ? 'secondary' : 'outline'}
                  aria-pressed={reviewConfirmed}
                  disabled={reviewConfirmed}
                  onClick={() => setReviewConfirmed(true)}
                >
                  {reviewConfirmed ? text('Text reviewed', 'ಪಠ್ಯ ಪರಿಶೀಲಿಸಲಾಗಿದೆ') : text('Confirm this text before enabling Save Phrase', 'ಉಳಿಸುವ ಮೊದಲು ಈ ಪಠ್ಯವನ್ನು ದೃಢಪಡಿಸಿ')}
                </Button>
                <div style={{ marginTop: '1rem' }}>
                  <PhraseCard phrase={scannedPhrase} source={reviewConfirmed ? 'Scanned Kannada sign' : undefined} />
                </div>
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
