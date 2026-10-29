'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, LockKeyhole, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { SURVIVAL_STAGES, type QuizQuestion, type SurvivalStage } from '@/lib/kannada-data'

function randomizeQuestion(question: QuizQuestion): QuizQuestion {
  const options = question.options.map((value, index) => ({ value, correct: index === question.correctIndex }))
  for (let index = options.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[options[index], options[target]] = [options[target], options[index]]
  }
  return { ...question, options: options.map((option) => option.value), correctIndex: options.findIndex((option) => option.correct) }
}

export function SurvivalPage() {
  const { text, progress, completeStage } = useKannada()
  const [stageId, setStageId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'browse' | 'study' | 'quiz' | 'complete'>('browse')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const stage = SURVIVAL_STAGES.find((item) => item.id === stageId)
  const question = questions[questionIndex]
  const stageIndex = SURVIVAL_STAGES.findIndex((item) => item.id === stageId)

  function isUnlocked(index: number) {
    return index === 0 || progress.completedStages.includes(SURVIVAL_STAGES[index - 1].id)
  }

  function selectStage(item: SurvivalStage) {
    setStageId(item.id)
    setPhase('study')
    setQuestions([])
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinalScore(0)
  }

  function startCheck() {
    if (!stage) return
    setQuestions(stage.questions.map(randomizeQuestion))
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('quiz')
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !question) return
    setSelected(index)
    if (index === question.correctIndex) setScore((current) => current + 1)
  }

  function continueCheck() {
    if (!stage) return
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
      return
    }
    setFinalScore(score)
    completeStage(stage.id, stage.title, score, questions.length, 35)
    setPhase('complete')
  }

  if (!stage || phase === 'browse') {
    return (
      <div className="page-container">
        <PageHeading eyebrow={text('Travel-ready Kannada', 'ಪ್ರಯಾಣಕ್ಕೆ ಸಿದ್ಧ ಕನ್ನಡ')} title={text('Survival mode', 'ಸರ್ವೈವಲ್ ಮೋಡ್')} description={text('Six short stages build practical phrases for greetings, directions, transport, food, shopping, and asking for help. Complete a stage to unlock the next one.', 'ಶುಭಾಶಯ, ದಾರಿ, ಸಾರಿಗೆ, ಆಹಾರ, ಖರೀದಿ ಮತ್ತು ಸಹಾಯ ಕೇಳುವ ಆರು ಸಣ್ಣ ಹಂತಗಳು. ಮುಂದಿನ ಹಂತ ತೆರೆಯಲು ಒಂದು ಹಂತ ಪೂರ್ಣಗೊಳಿಸಿ.')} />
        <section className="panel" style={{ marginBottom: '1rem' }}>
          <ProgressBar label={text(`${progress.completedStages.length} of ${SURVIVAL_STAGES.length} stages complete`, `${SURVIVAL_STAGES.length}ರಲ್ಲಿ ${progress.completedStages.length} ಹಂತಗಳು ಪೂರ್ಣ`)} value={progress.completedStages.length} max={SURVIVAL_STAGES.length} />
        </section>
        <div className="stage-grid">
          {SURVIVAL_STAGES.map((item, index) => {
            const unlocked = isUnlocked(index)
            const completed = progress.completedStages.includes(item.id)
            return (
              <button className="stage-card" type="button" key={item.id} disabled={!unlocked} onClick={() => selectStage(item)} aria-disabled={!unlocked}>
                <span className="feature-icon">{unlocked ? <span aria-hidden="true">{index + 1}</span> : <LockKeyhole aria-hidden="true" />}</span>
                <span className={`pill${completed ? ' pill-complete' : unlocked ? '' : ' pill-locked'}`}>
                  {completed ? text('Completed', 'ಪೂರ್ಣಗೊಂಡಿದೆ') : unlocked ? text('Unlocked', 'ತೆರೆದಿದೆ') : text('Complete the previous stage', 'ಹಿಂದಿನ ಹಂತ ಪೂರ್ಣಗೊಳಿಸಿ')}
                </span>
                <span className="kannada-label" lang="kn">{item.kannada}</span>
                <h3>{item.title}</h3>
                <p>{item.intro}</p>
                <span className="card-link">{unlocked ? text('Open stage', 'ಹಂತ ತೆರೆಯಿರಿ') : text('Locked', 'ಲಾಕ್ ಆಗಿದೆ')} <ArrowRight aria-hidden="true" /></span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (phase === 'study') {
    return (
      <div className="page-container">
        <div className="button-row" style={{ marginBottom: '1rem' }}><Button type="button" variant="ghost" onClick={() => setPhase('browse')}><ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('All stages', 'ಎಲ್ಲ ಹಂತಗಳು')}</Button><span className="pill">Stage {stageIndex + 1} of {SURVIVAL_STAGES.length}</span></div>
        <PageHeading eyebrow={stage.kannada} title={stage.title} description={stage.intro} />
        <div className="status-note survival-scenario"><strong>{text('Real-life scenario', 'ನೈಜ ಜೀವನದ ಸಂದರ್ಭ')}</strong><p>{text(stage.scenario, stage.scenarioKn)}</p></div>
        <div className="phrase-grid">
          {stage.phrases.map((phrase) => <PhraseCard key={phrase.id} phrase={phrase} source={`Survival: ${stage.title}`} />)}
        </div>
        <section className="panel" style={{ marginTop: '1rem' }}>
          <p className="muted-text">{text('Listen, review the meaning, then check what you remember. Each stage has three questions and immediate feedback.', 'ಆಲಿಸಿ, ಅರ್ಥವನ್ನು ಓದಿ, ನಂತರ ನೆನಪಿರುವುದನ್ನು ಪರೀಕ್ಷಿಸಿ. ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲಿ ಮೂರು ಪ್ರಶ್ನೆ ಮತ್ತು ತಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ ಇರುತ್ತದೆ.')}</p>
          <Button type="button" variant="secondary" onClick={startCheck}>{text('Start stage check', 'ಹಂತದ ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
        </section>
      </div>
    )
  }

  if (phase === 'quiz' && question) {
    const isLast = questionIndex === questions.length - 1
    return (
      <div className="page-container">
        <div className="button-row" style={{ marginBottom: '1rem' }}><Button type="button" variant="ghost" onClick={() => setPhase('study')}><ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('Review phrases', 'ನುಡಿಗಟ್ಟುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ')}</Button><span className="pill">{stage.title}</span></div>
        <section className="panel" style={{ maxWidth: '760px', marginInline: 'auto' }}>
          <ProgressBar label={text(`Question ${questionIndex + 1} of ${questions.length}`, `${questions.length}ರಲ್ಲಿ ${questionIndex + 1}ನೇ ಪ್ರಶ್ನೆ`)} value={questionIndex + 1} max={questions.length} />
          <p className="eyebrow" style={{ marginTop: '1.4rem' }}>{text('Stage check', 'ಹಂತದ ಪರೀಕ್ಷೆ')}</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>{question.prompt}</h1>
          <div className="answer-list" style={{ marginTop: '1rem' }}>
            {question.options.map((option, index) => (
              <button className="answer-button" key={option} type="button" disabled={selected !== null} aria-pressed={selected === index} data-correct={selected !== null && index === question.correctIndex ? 'true' : selected === index ? 'false' : undefined} onClick={() => chooseAnswer(index)}>{option}</button>
            ))}
          </div>
          {selected !== null ? (
            <>
              <p className="feedback-box" role="status">{question.explanation}</p>
              <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="button" variant="secondary" onClick={continueCheck}>{isLast ? text('Complete stage', 'ಹಂತ ಪೂರ್ಣಗೊಳಿಸಿ') : text('Next question', 'ಮುಂದಿನ ಪ್ರಶ್ನೆ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
              </div>
            </>
          ) : null}
        </section>
      </div>
    )
  }

  return (
    <div className="page-container">
        <PageHeading eyebrow={text('Stage complete', 'ಹಂತ ಪೂರ್ಣ')} title={text(stageIndex === SURVIVAL_STAGES.length - 1 ? 'All stages complete' : 'You unlocked the next step', stageIndex === SURVIVAL_STAGES.length - 1 ? 'ಎಲ್ಲ ಹಂತಗಳು ಪೂರ್ಣ' : 'ಮುಂದಿನ ಹೆಜ್ಜೆ ತೆರೆಯಲಾಗಿದೆ')} description={text(`${stage.title}: ${finalScore} of ${questions.length} correct.`, `${stage.title}: ${questions.length}ರಲ್ಲಿ ${finalScore} ಸರಿಯಾಗಿದೆ.`)} />
      <section className="panel" style={{ maxWidth: '760px' }}>
        <ProgressBar label={text('Stage result', 'ಹಂತದ ಫಲಿತಾಂಶ')} value={finalScore} max={questions.length} />
        <div className="inline-actions" style={{ marginTop: '1rem' }}><span className="pill pill-complete"><Check aria-hidden="true" /> {text('Progress saved', 'ಪ್ರಗತಿ ಉಳಿಸಲಾಗಿದೆ')}</span><span className="pill">{progress.completedStages.length}/{SURVIVAL_STAGES.length} {text('stages complete', 'ಹಂತಗಳು ಪೂರ್ಣ')}</span></div>
        <div className="button-row" style={{ marginTop: '1.1rem' }}>
          <Button type="button" variant="secondary" onClick={() => selectStage(stage)}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Repeat stage', 'ಹಂತ ಮತ್ತೆ ಮಾಡಿ')}</Button>
          <Button type="button" variant="outline" onClick={() => setPhase('browse')}>{text('View all stages', 'ಎಲ್ಲ ಹಂತಗಳನ್ನು ನೋಡಿ')}</Button>
          <Link className="small-button" href="/progress">{text('Progress', 'ಪ್ರಗತಿ')}</Link>
        </div>
      </section>
    </div>
  )
}
