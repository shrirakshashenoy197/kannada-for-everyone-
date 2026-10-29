'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { HERITAGE_PLACES, type HeritagePlace, type QuizQuestion } from '@/lib/kannada-data'

const HERITAGE_QUIZ: QuizQuestion[] = [
  { id: 'heritage-hampi', prompt: 'Which place is inscribed on UNESCO’s World Heritage List?', options: ['Hampi', 'Mysore Palace', 'Badami'], correctIndex: 0, explanation: 'Hampi is inscribed on UNESCO’s World Heritage List.' },
  { id: 'heritage-hoysala', prompt: 'Which town is closely associated with the Hoysaleswara Temple?', options: ['Halebidu', 'Mysuru', 'Badami'], correctIndex: 0, explanation: 'The Hoysaleswara Temple is in Halebidu and is known for detailed stone sculpture.' },
  { id: 'heritage-belur', prompt: 'Which temple was commissioned by Hoysala king Vishnuvardhana?', options: ['Chennakeshava Temple at Belur', 'Hoysaleswara Temple at Halebidu', 'Cave temples at Badami'], correctIndex: 0, explanation: 'The Chennakeshava Temple at Belur was commissioned in the 12th century by Vishnuvardhana.' },
]

function mixQuestion(question: QuizQuestion): QuizQuestion {
  const choices = question.options.map((label, index) => ({ label, correct: index === question.correctIndex }))
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[choices[index], choices[target]] = [choices[target], choices[index]]
  }
  return { ...question, options: choices.map((choice) => choice.label), correctIndex: choices.findIndex((choice) => choice.correct) }
}

export function HeritagePage() {
  const { text, recordQuizAttempt } = useKannada()
  const [selectedPlace, setSelectedPlace] = useState<HeritagePlace | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selectedPlace && !dialog.open) dialog.showModal()
    if (!selectedPlace && dialog.open) dialog.close()
  }, [selectedPlace])

  const question = questions[quizIndex]

  function startQuiz() {
    setQuestions(HERITAGE_QUIZ.map(mixQuestion))
    setQuizIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinalScore(0)
    setQuizStarted(true)
    setQuizFinished(false)
  }

  function chooseAnswer(index: number) {
    if (selectedAnswer !== null || !question) return
    setSelectedAnswer(index)
    if (index === question.correctIndex) setScore((current) => current + 1)
  }

  function nextQuizStep() {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((current) => current + 1)
      setSelectedAnswer(null)
      return
    }
    setFinalScore(score)
    recordQuizAttempt({ quizId: 'heritage-landmarks', title: 'Karnataka heritage quiz', score, total: questions.length, xp: 10, kind: 'culture' })
    setQuizFinished(true)
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('A journey through Karnataka', 'ಕರ್ನಾಟಕದ ಪಯಣ')}
        title={text('Heritage at a glance', 'ಒಂದು ನೋಟದಲ್ಲಿ ಪರಂಪರೆ')}
        description={text('Explore five landmarks through concise historical context and a practical Kannada phrase for each visit. Destination details are factual; some images are illustrative.', 'ಐದು ತಾಣಗಳನ್ನು ಚಿಕ್ಕ ಐತಿಹಾಸಿಕ ಮಾಹಿತಿ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಕನ್ನಡ ನುಡಿಗಟ್ಟಿನೊಂದಿಗೆ ಅನ್ವೇಷಿಸಿ. ತಾಣಗಳ ವಿವರಗಳು ವಾಸ್ತವಾಂಶಗಳು; ಕೆಲವು ಚಿತ್ರಗಳು ವಿವರಣಾತ್ಮಕವಾಗಿವೆ.')}
      />

      <section className="destination-grid" aria-label={text('Karnataka heritage destinations', 'ಕರ್ನಾಟಕದ ಪರಂಪರೆ ತಾಣಗಳು')}>
        {HERITAGE_PLACES.map((place) => (
          <button className="destination-card" type="button" key={place.id} onClick={() => setSelectedPlace(place)} aria-haspopup="dialog">
            <div className="destination-image-frame">
              <Image src={place.image} alt={place.imageAlt} fill unoptimized sizes="(max-width: 700px) 100vw, (max-width: 960px) 50vw, 33vw" className="destination-image" />
            </div>
            <div className="destination-card-content">
              <span className="pill"><MapPin aria-hidden="true" /> {place.location}</span>
              <h3>{place.kannada} · {place.name}</h3>
              <p className="muted-text">{place.description}</p>
              <span className="card-link">{text('View details', 'ವಿವರ ನೋಡಿ')} <ArrowRight aria-hidden="true" /></span>
            </div>
          </button>
        ))}
      </section>

      <section className="section-block panel" aria-labelledby="heritage-quiz-heading">
        <div className="section-heading"><div><p className="eyebrow">{text('Optional knowledge check', 'ಐಚ್ಛಿಕ ಜ್ಞಾನ ಪರೀಕ್ಷೆ')}</p><h2 id="heritage-quiz-heading">{text('What do you remember?', 'ನಿಮಗೆ ಏನು ನೆನಪಿದೆ?')}</h2></div></div>
        {!quizStarted ? (
          <>
            <p className="muted-text">{text('Three short questions about the landmarks on this page. The score is saved with your other quiz attempts.', 'ಈ ಪುಟದ ತಾಣಗಳ ಕುರಿತು ಮೂರು ಸಣ್ಣ ಪ್ರಶ್ನೆಗಳು. ನಿಮ್ಮ ಇತರ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ಅಂಕ ಉಳಿಯುತ್ತದೆ.')}</p>
            <Button type="button" variant="secondary" onClick={startQuiz}>{text('Start heritage quiz', 'ಪರಂಪರೆ ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ')}</Button>
          </>
        ) : quizFinished ? (
          <>
            <p className="page-description" style={{ marginTop: 0 }}>{text(`You scored ${finalScore} of ${questions.length}.`, `${questions.length}ರಲ್ಲಿ ${finalScore} ಅಂಕ ಗಳಿಸಿದ್ದೀರಿ.`)}</p>
            <Button type="button" variant="outline" onClick={startQuiz}>{text('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ')}</Button>
          </>
        ) : question ? (
          <>
            <ProgressBar label={text(`Question ${quizIndex + 1} of ${questions.length}`, `${questions.length}ರಲ್ಲಿ ${quizIndex + 1}ನೇ ಪ್ರಶ್ನೆ`)} value={quizIndex + 1} max={questions.length} />
            <h3 style={{ marginTop: '1rem' }}>{question.prompt}</h3>
            <div className="answer-list" style={{ marginTop: '0.8rem' }}>
              {question.options.map((option, index) => (
                <button className="answer-button" type="button" key={option} disabled={selectedAnswer !== null} aria-pressed={selectedAnswer === index} data-correct={selectedAnswer !== null && index === question.correctIndex ? 'true' : selectedAnswer === index ? 'false' : undefined} onClick={() => chooseAnswer(index)}>{option}{selectedAnswer !== null && index === question.correctIndex ? <Check aria-hidden="true" /> : null}</button>
              ))}
            </div>
            {selectedAnswer !== null ? <><p className="feedback-box" role="status">{question.explanation}</p><Button type="button" variant="secondary" style={{ marginTop: '0.8rem' }} onClick={nextQuizStep}>{quizIndex === questions.length - 1 ? text('Finish quiz', 'ರಸಪ್ರಶ್ನೆ ಮುಗಿಸಿ') : text('Next question', 'ಮುಂದಿನ ಪ್ರಶ್ನೆ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button></> : null}
          </>
        ) : null}
      </section>

      <dialog className="detail-dialog" ref={dialogRef} aria-labelledby="heritage-dialog-title" onClose={() => setSelectedPlace(null)}>
        {selectedPlace ? (
          <div className="dialog-content">
            <div className="section-heading">
              <div><p className="eyebrow">{selectedPlace.location}</p><h2 id="heritage-dialog-title">{selectedPlace.kannada} · {selectedPlace.name}</h2></div>
              <Button type="button" variant="ghost" size="icon" aria-label={text('Close destination details', 'ತಾಣದ ವಿವರ ಮುಚ್ಚಿ')} onClick={() => setSelectedPlace(null)}><X aria-hidden="true" /></Button>
            </div>
            <div className="destination-image-frame" style={{ height: '220px', marginBottom: '1rem' }}>
              <Image src={selectedPlace.image} alt={selectedPlace.imageAlt} fill unoptimized sizes="(max-width: 700px) 90vw, 560px" className="destination-image" />
            </div>
            <p className="page-description" style={{ marginTop: 0 }}>{selectedPlace.description}</p>
            <div className="status-note"><strong>{text('Did you know?', 'ನಿಮಗೆ ಗೊತ್ತೇ?')}</strong> {selectedPlace.fact}</div>
            <div style={{ marginTop: '1rem' }}><PhraseCard phrase={selectedPlace.vocabulary} source={`Heritage: ${selectedPlace.name}`} /></div>
            <p className="helper-text" style={{ marginBottom: 0 }}>{text('Kannada phrasing and pronunciation vary by region and speaker; this is an introductory, widely understandable form.', 'ಕನ್ನಡ ಪದಪ್ರಯೋಗ ಮತ್ತು ಉಚ್ಚಾರಣೆ ಪ್ರದೇಶ ಮತ್ತು ಮಾತನಾಡುವವರಂತೆ ಬದಲಾಗಬಹುದು; ಇದು ಪರಿಚಯಾತ್ಮಕ, ಸಾಮಾನ್ಯವಾಗಿ ಅರ್ಥವಾಗುವ ರೂಪ.')}</p>
          </div>
        ) : null}
      </dialog>
    </div>
  )
}
