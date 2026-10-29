'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioButton, PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { createLessonQuiz, LESSON_CATEGORIES, type LessonCategory, type QuizQuestion } from '@/lib/kannada-data'

function shuffleQuestion(question: QuizQuestion): QuizQuestion {
  const choices = question.options.map((value, index) => ({ value, isCorrect: index === question.correctIndex }))
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[choices[index], choices[target]] = [choices[target], choices[index]]
  }
  return {
    ...question,
    options: choices.map((choice) => choice.value),
    correctIndex: choices.findIndex((choice) => choice.isCorrect),
  }
}

export function LearnPage() {
  const { text, progress, recordQuizAttempt, completeLesson } = useKannada()
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'browse' | 'lesson' | 'quiz' | 'complete'>('browse')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const category = useMemo(() => LESSON_CATEGORIES.find((item) => item.id === categoryId) ?? null, [categoryId])
  const currentQuestion = questions[questionIndex]
  const currentPhrase = category?.phrases[phraseIndex]

  function openCategory(item: LessonCategory) {
    setCategoryId(item.id)
    setPhraseIndex(0)
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinalScore(0)
    setPhase('lesson')
  }

  function startQuiz() {
    if (!category) return
    setQuestions(createLessonQuiz(category).map(shuffleQuestion))
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('quiz')
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !currentQuestion) return
    setSelected(index)
    if (index === currentQuestion.correctIndex) setScore((current) => current + 1)
  }

  function continueQuiz() {
    if (!currentQuestion || !category) return
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
      return
    }
    const completedScore = score
    setFinalScore(completedScore)
    recordQuizAttempt({
      quizId: `lesson-${category.id}`,
      title: `${category.english} lesson quiz`,
      score: completedScore,
      total: questions.length,
      xp: 10,
    })
    completeLesson(category.id, `${category.english} lesson`, 35)
    setPhase('complete')
  }

  if (phase === 'browse' || !category) {
    return (
      <div className="page-container">
        <PageHeading
          eyebrow={text('Build a useful foundation', 'ಉಪಯುಕ್ತ ಅಡಿಪಾಯ ನಿರ್ಮಿಸಿ')}
          title={text('Everyday Kannada lessons', 'ದೈನಂದಿನ ಕನ್ನಡ ಪಾಠಗಳು')}
          description={text('Choose a situation, learn one phrase at a time, then finish with a short quiz. Your completion and quiz score are saved on this device.', 'ಒಂದು ಸಂದರ್ಭ ಆಯ್ಕೆಮಾಡಿ, ಒಂದೊಂದು ನುಡಿಗಟ್ಟನ್ನು ಕಲಿಯಿರಿ, ನಂತರ ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ ಮಾಡಿ. ಪೂರ್ಣಗೊಳಿಸಿದ ಪಾಠ ಮತ್ತು ಅಂಕಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.')}
          action={<Link className="small-button" href="/phrasebook">{text('Open phrasebook', 'ನುಡಿಗಟ್ಟು ಪುಸ್ತಕ ತೆರೆಯಿರಿ')}</Link>}
        />
        <div className="feature-grid">
          {LESSON_CATEGORIES.map((item) => {
            const completed = progress.completedLessons.includes(item.id)
            return (
              <button className="feature-card" key={item.id} type="button" onClick={() => openCategory(item)}>
                <span className="feature-icon"><BookOpen aria-hidden="true" /></span>
                <span className="pill">{item.kannada}</span>
                <h3>{item.english}</h3>
                <p>{item.subtitleEn}</p>
                <span className={`pill${completed ? ' pill-complete' : ''}`} style={{ marginTop: 'auto' }}>
                  {completed ? text('Completed', 'ಪೂರ್ಣಗೊಂಡಿದೆ') : text('6 useful phrases', '6 ಉಪಯುಕ್ತ ನುಡಿಗಟ್ಟುಗಳು')}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (phase === 'lesson' && currentPhrase) {
    const completedCount = phraseIndex + 1
    return (
      <div className="page-container">
        <div className="button-row" style={{ marginBottom: '1.25rem' }}>
          <Button type="button" variant="ghost" onClick={() => setPhase('browse')}>
            <ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('All lessons', 'ಎಲ್ಲ ಪಾಠಗಳು')}
          </Button>
          <span className="pill">{category.kannada} · {category.english}</span>
        </div>
        <PageHeading
          eyebrow={text('Lesson', 'ಪಾಠ')}
          title={text(category.english, category.kannada)}
          description={category.subtitleEn}
        />
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <section className="panel" aria-labelledby="lesson-phrase-heading">
            <ProgressBar label={text(`Phrase ${completedCount} of ${category.phrases.length}`, `${category.phrases.length}ರಲ್ಲಿ ${completedCount}ನೇ ನುಡಿಗಟ್ಟು`)} value={completedCount} max={category.phrases.length} />
            <div style={{ paddingBlock: '1.4rem' }}>
              <p className="eyebrow">{text('Say it in Kannada', 'ಕನ್ನಡದಲ್ಲಿ ಹೇಳಿ')}</p>
              <h2 id="lesson-phrase-heading" className="kannada-text" lang="kn">{currentPhrase.kannada}</h2>
              <p className="transliteration">{currentPhrase.transliteration}</p>
              <p className="page-description">{currentPhrase.english}</p>
              <div className="inline-actions" style={{ marginTop: '1rem' }}>
                <AudioButton textToSpeak={currentPhrase.kannada} />
              </div>
            </div>
            <div className="button-row" style={{ justifyContent: 'space-between' }}>
              <Button type="button" variant="outline" disabled={phraseIndex === 0} onClick={() => setPhraseIndex((current) => Math.max(0, current - 1))}>
                <ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('Previous', 'ಹಿಂದಿನದು')}
              </Button>
              {phraseIndex < category.phrases.length - 1 ? (
                <Button type="button" variant="secondary" onClick={() => setPhraseIndex((current) => current + 1)}>
                  {text('Next phrase', 'ಮುಂದಿನ ನುಡಿಗಟ್ಟು')} <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              ) : (
                <Button type="button" variant="secondary" onClick={startQuiz}>
                  {text('Start lesson quiz', 'ಪಾಠದ ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ')} <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              )}
            </div>
          </section>
          <aside className="panel">
            <p className="eyebrow">{text('Phrase in context', 'ಸಂದರ್ಭದಲ್ಲಿನ ನುಡಿಗಟ್ಟು')}</p>
            <PhraseCard phrase={currentPhrase} source={category.english} />
            <p className="helper-text" style={{ marginTop: '1rem' }}>
              {text('Listen when a Kannada voice is installed in your browser. Speech output varies by device.', 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಇದ್ದರೆ ಆಲಿಸಿ. ಧ್ವನಿ ಸಾಧನದಂತೆ ಬದಲಾಗಬಹುದು.')}
            </p>
          </aside>
        </div>
      </div>
    )
  }

  if (phase === 'quiz' && currentQuestion) {
    const isLast = questionIndex === questions.length - 1
    return (
      <div className="page-container">
        <div className="button-row" style={{ marginBottom: '1.25rem' }}>
          <Button type="button" variant="ghost" onClick={() => setPhase('lesson')}><ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('Back to lesson', 'ಪಾಠಕ್ಕೆ ಹಿಂತಿರುಗಿ')}</Button>
          <span className="pill">{category.kannada} · {category.english}</span>
        </div>
        <section className="panel" style={{ maxWidth: '760px', marginInline: 'auto' }}>
          <ProgressBar label={text(`Question ${questionIndex + 1} of ${questions.length}`, `${questions.length}ರಲ್ಲಿ ${questionIndex + 1}ನೇ ಪ್ರಶ್ನೆ`)} value={questionIndex + 1} max={questions.length} />
          <p className="eyebrow" style={{ marginTop: '1.5rem' }}>{text('Choose the Kannada phrase', 'ಕನ್ನಡ ನುಡಿಗಟ್ಟನ್ನು ಆಯ್ಕೆಮಾಡಿ')}</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>{currentQuestion.prompt}</h1>
          <div className="answer-list" style={{ marginTop: '1.2rem' }}>
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
                <span lang="kn">{option}</span>
                {selected !== null && index === currentQuestion.correctIndex ? <Check aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
          {selected !== null ? (
            <>
              <p className="feedback-box" role="status">{currentQuestion.explanation}</p>
              <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="button" variant="secondary" onClick={continueQuiz}>
                  {isLast ? text('Complete lesson', 'ಪಾಠ ಪೂರ್ಣಗೊಳಿಸಿ') : text('Next question', 'ಮುಂದಿನ ಪ್ರಶ್ನೆ')} <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </div>
            </>
          ) : null}
        </section>
      </div>
    )
  }

  return (
    <div className="page-container">
      <PageHeading eyebrow={text('Lesson completed', 'ಪಾಠ ಪೂರ್ಣಗೊಂಡಿದೆ')} title={text('Nice work!', 'ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದೀರಿ!')} description={text(`${category.english} quiz: ${finalScore} of ${questions.length} correct.`, `${category.kannada} ರಸಪ್ರಶ್ನೆ: ${questions.length}ರಲ್ಲಿ ${finalScore} ಸರಿಯಾಗಿದೆ.`)} />
      <section className="panel" style={{ maxWidth: '720px' }}>
        <div className="inline-actions">
          <span className="pill pill-complete"><Check aria-hidden="true" /> {text('Lesson saved', 'ಪಾಠ ಉಳಿಸಲಾಗಿದೆ')}</span>
          <span className="pill">{text('Completion XP is awarded at most once', 'ಪೂರ್ಣಗೊಳಿಸುವ XP ಒಮ್ಮೆ ಮಾತ್ರ')}</span>
        </div>
        <p className="page-description">{text('Your result and lesson completion are now included in your progress. Replaying is welcome; completion XP is awarded only once.', 'ನಿಮ್ಮ ಅಂಕ ಮತ್ತು ಪೂರ್ಣಗೊಳಿಸಿದ ಪಾಠ ಈಗ ಪ್ರಗತಿಯಲ್ಲಿ ಸೇರಿವೆ. ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಬಹುದು; ಪೂರ್ಣಗೊಳಿಸುವ XP ಒಮ್ಮೆ ಮಾತ್ರ ಸಿಗುತ್ತದೆ.')}</p>
        <div className="button-row" style={{ marginTop: '1.2rem' }}>
          <Button type="button" variant="secondary" onClick={() => openCategory(category)}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Practice again', 'ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ')}</Button>
          <Button type="button" variant="outline" onClick={() => setPhase('browse')}>{text('Choose another lesson', 'ಮತ್ತೊಂದು ಪಾಠ ಆಯ್ಕೆಮಾಡಿ')}</Button>
          <Link className="small-button" href="/progress">{text('View progress', 'ಪ್ರಗತಿ ನೋಡಿ')}</Link>
        </div>
      </section>
    </div>
  )
}
