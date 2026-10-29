'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { DAILY_QUIZ, type QuizQuestion } from '@/lib/kannada-data'

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

function shuffleOptions(question: QuizQuestion): QuizQuestion {
  const options = question.options.map((label, index) => ({ label, correct: index === question.correctIndex }))
  const shuffled = shuffle(options)
  return { ...question, options: shuffled.map((item) => item.label), correctIndex: shuffled.findIndex((item) => item.correct) }
}

export function QuizPage() {
  const { text, recordQuizAttempt } = useKannada()
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const currentQuestion = questions[questionIndex]

  function startQuiz() {
    setQuestions(shuffle(DAILY_QUIZ).map(shuffleOptions))
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinalScore(0)
    setStarted(true)
    setFinished(false)
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !currentQuestion) return
    setSelected(index)
    if (index === currentQuestion.correctIndex) setScore((current) => current + 1)
  }

  function continueQuiz() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
      return
    }
    const totalScore = score
    setFinalScore(totalScore)
    recordQuizAttempt({ quizId: 'daily-mixed', title: 'Daily mixed Kannada quiz', score: totalScore, total: questions.length, xp: 15 })
    setFinished(true)
  }

  if (!started) {
    return (
      <div className="page-container">
        <PageHeading eyebrow={text('Practice', 'ಅಭ್ಯಾಸ')} title={text('Quick Kannada quiz', 'ಸಣ್ಣ ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ')} description={text('A short mixed quiz checks phrases from greetings, travel, food, and everyday situations. Questions and answer order vary each time.', 'ಶುಭಾಶಯ, ಪ್ರಯಾಣ, ಆಹಾರ ಮತ್ತು ದೈನಂದಿನ ಸಂದರ್ಭಗಳ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ ಪರೀಕ್ಷಿಸುತ್ತದೆ. ಪ್ರತಿ ಬಾರಿ ಪ್ರಶ್ನೆ ಮತ್ತು ಆಯ್ಕೆಗಳ ಕ್ರಮ ಬದಲಾಗುತ್ತದೆ.')} />
        <section className="panel" style={{ maxWidth: '680px' }}>
          <p className="eyebrow">{text('No timer, no pressure', 'ಸಮಯದ ಒತ್ತಡವಿಲ್ಲ')}</p>
          <h2>{text('Six questions · immediate feedback', 'ಆರು ಪ್ರಶ್ನೆಗಳು · ತಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ')}</h2>
          <p className="page-description">{text('Your completed attempt and score will appear in Progress. XP is awarded once for this quiz, even if you replay it.', 'ಪೂರ್ಣಗೊಂಡ ಪ್ರಯತ್ನ ಮತ್ತು ಅಂಕಗಳು ಪ್ರಗತಿಯಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ. ಮತ್ತೆ ಮಾಡಿದರೂ ಈ ರಸಪ್ರಶ್ನೆಗೆ XP ಒಮ್ಮೆ ಮಾತ್ರ ಸಿಗುತ್ತದೆ.')}</p>
          <Button type="button" variant="secondary" style={{ marginTop: '1rem' }} onClick={startQuiz}>{text('Start quiz', 'ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
        </section>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="page-container">
        <PageHeading eyebrow={text('Quiz complete', 'ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣ')} title={text('Your result', 'ನಿಮ್ಮ ಫಲಿತಾಂಶ')} description={text(`${finalScore} of ${questions.length} answers correct.`, `${questions.length}ರಲ್ಲಿ ${finalScore} ಉತ್ತರಗಳು ಸರಿಯಾಗಿವೆ.`)} />
        <section className="panel" style={{ maxWidth: '680px' }}>
          <p className="page-description" style={{ marginTop: 0 }}>{text('This attempt has been recorded on this device. Replaying will add another attempt but will not award the same XP again.', 'ಈ ಪ್ರಯತ್ನ ಈ ಸಾಧನದಲ್ಲಿ ದಾಖಲಾಗಿದೆ. ಮತ್ತೆ ಮಾಡಿದರೆ ಹೊಸ ಪ್ರಯತ್ನ ಸೇರುತ್ತದೆ, ಆದರೆ ಅದೇ XP ಮತ್ತೆ ಸಿಗುವುದಿಲ್ಲ.')}</p>
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={startQuiz}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ')}</Button>
            <Link className="small-button" href="/progress">{text('View progress', 'ಪ್ರಗತಿ ನೋಡಿ')}</Link>
          </div>
        </section>
      </div>
    )
  }

  if (!currentQuestion) return null
  const isLast = questionIndex === questions.length - 1

  return (
    <div className="page-container">
      <PageHeading eyebrow={text('Quick quiz', 'ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ')} title={text('Choose the best answer', 'ಉತ್ತಮ ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ')} description={text('Feedback appears as soon as you choose.', 'ಆಯ್ಕೆ ಮಾಡಿದ ತಕ್ಷಣ ಪ್ರತಿಕ್ರಿಯೆ ಕಾಣಿಸುತ್ತದೆ.')} />
      <section className="panel" style={{ maxWidth: '760px', marginInline: 'auto' }}>
        <ProgressBar label={text(`Question ${questionIndex + 1} of ${questions.length}`, `${questions.length}ರಲ್ಲಿ ${questionIndex + 1}ನೇ ಪ್ರಶ್ನೆ`)} value={questionIndex + 1} max={questions.length} />
        <h2 style={{ marginTop: '1.4rem' }}>{currentQuestion.prompt}</h2>
        <div className="answer-list" style={{ marginTop: '1rem' }}>
          {currentQuestion.options.map((option, index) => (
            <button
              className="answer-button"
              key={option}
              type="button"
              disabled={selected !== null}
              aria-pressed={selected === index}
              data-correct={selected !== null && index === currentQuestion.correctIndex ? 'true' : selected === index ? 'false' : undefined}
              onClick={() => chooseAnswer(index)}
            >
              <span>{option}</span>
              {selected !== null && index === currentQuestion.correctIndex ? <Check aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        {selected !== null ? (
          <>
            <p className="feedback-box" role="status">{currentQuestion.explanation}</p>
            <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={continueQuiz}>{isLast ? text('Finish quiz', 'ರಸಪ್ರಶ್ನೆ ಮುಗಿಸಿ') : text('Next question', 'ಮುಂದಿನ ಪ್ರಶ್ನೆ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}
