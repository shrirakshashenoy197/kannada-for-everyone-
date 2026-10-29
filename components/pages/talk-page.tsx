'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Car, HeartPulse, Map, RotateCcw, ShoppingBag, Utensils, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioButton, PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { CONVERSATIONS, type ConversationScenario } from '@/lib/kannada-data'

function ScenarioIcon({ icon }: { icon: ConversationScenario['icon'] }) {
  if (icon === 'car') return <Car aria-hidden="true" />
  if (icon === 'food') return <Utensils aria-hidden="true" />
  if (icon === 'map') return <Map aria-hidden="true" />
  if (icon === 'shop') return <ShoppingBag aria-hidden="true" />
  if (icon === 'health') return <HeartPulse aria-hidden="true" />
  return <Users aria-hidden="true" />
}

export function TalkPage() {
  const { text, recordQuizAttempt } = useKannada()
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [turnIndex, setTurnIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)
  const [finished, setFinished] = useState(false)

  const scenario = CONVERSATIONS.find((item) => item.id === scenarioId)
  const turn = scenario?.turns[turnIndex]

  function startScenario(item: ConversationScenario) {
    setScenarioId(item.id)
    setTurnIndex(0)
    setSelected(null)
    setScore(0)
    setHintOpen(false)
    setFinished(false)
  }

  function chooseReply(index: number) {
    if (selected !== null || !turn) return
    setSelected(index)
    if (turn.replies[index].correct) setScore((current) => current + 1)
  }

  function continueConversation() {
    if (!scenario) return
    if (turnIndex < scenario.turns.length - 1) {
      setTurnIndex((current) => current + 1)
      setSelected(null)
      setHintOpen(false)
      return
    }
    recordQuizAttempt({
      quizId: `talk:${scenario.id}`,
      title: scenario.english,
      score,
      total: scenario.turns.length,
      xp: 20,
      kind: 'conversation',
    })
    setFinished(true)
  }

  if (!scenario) {
    return (
      <div className="page-container">
        <PageHeading
          eyebrow={text('Practice real-life exchanges', 'ನೈಜ ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ')}
          title={text('Talk through a situation', 'ಸಂದರ್ಭದಲ್ಲಿ ಮಾತನಾಡಿ')}
          description={text('Choose a short roleplay. Hear the other speaker, select a reply, and get feedback after every turn. Your conversation score is recorded when you finish.', 'ಸಣ್ಣ ಪಾತ್ರಾಭಿನಯ ಆಯ್ಕೆಮಾಡಿ. ಎದುರಾಳಿಯ ಮಾತು ಆಲಿಸಿ, ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ, ಪ್ರತಿ ಹಂತದ ನಂತರ ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಿರಿ. ಮುಗಿಸಿದಾಗ ಅಂಕ ದಾಖಲಾಗುತ್ತದೆ.')}
        />
        <div className="scenario-grid">
          {CONVERSATIONS.map((item) => (
            <button className="scenario-card" key={item.id} type="button" onClick={() => startScenario(item)}>
              <span className="feature-icon"><ScenarioIcon icon={item.icon} /></span>
              <span className="pill">{item.kannada}</span>
              <h3>{item.english}</h3>
              <p>{item.description}</p>
              <span className="card-link">{text('Start conversation', 'ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ')} <ArrowRight aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="page-container">
        <PageHeading eyebrow={text('Conversation complete', 'ಸಂಭಾಷಣೆ ಪೂರ್ಣ')} title={text('How did it go?', 'ಹೇಗಾಯಿತು?')} description={text(`${scenario.english}: ${score} of ${scenario.turns.length} replies matched the situation.`, `${scenario.kannada}: ${scenario.turns.length}ರಲ್ಲಿ ${score} ಉತ್ತರಗಳು ಸಂದರ್ಭಕ್ಕೆ ಸರಿಹೊಂದಿದವು.`)} />
        <section className="panel" style={{ maxWidth: '760px' }}>
          <ProgressBar label={text('Conversation score', 'ಸಂಭಾಷಣೆ ಅಂಕ')} value={score} max={scenario.turns.length} />
          <p className="page-description">{text('Your score has been added to Progress. You can replay this scenario; XP for the same scenario is granted only once.', 'ನಿಮ್ಮ ಅಂಕ ಪ್ರಗತಿಗೆ ಸೇರಿದೆ. ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಬಹುದು; ಇದೇ ಸಂದರ್ಭಕ್ಕೆ XP ಒಮ್ಮೆ ಮಾತ್ರ ಸಿಗುತ್ತದೆ.')}</p>
          <div className="button-row" style={{ marginTop: '1.1rem' }}>
            <Button type="button" variant="secondary" onClick={() => startScenario(scenario)}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ')}</Button>
            <Button type="button" variant="outline" onClick={() => setScenarioId(null)}>{text('Choose another', 'ಮತ್ತೊಂದು ಆಯ್ಕೆಮಾಡಿ')}</Button>
            <Link className="small-button" href="/progress">{text('View progress', 'ಪ್ರಗತಿ ನೋಡಿ')}</Link>
          </div>
        </section>
      </div>
    )
  }

  if (!turn) return null
  const answered = selected !== null
  const selectedReply = answered ? turn.replies[selected] : null
  const answeredCount = turnIndex + (answered ? 1 : 0)

  return (
    <div className="page-container">
      <div className="button-row" style={{ marginBottom: '1rem' }}>
        <Button type="button" variant="ghost" onClick={() => setScenarioId(null)}><ArrowLeft data-icon="inline-start" aria-hidden="true" /> {text('All situations', 'ಎಲ್ಲ ಸಂದರ್ಭಗಳು')}</Button>
        <span className="pill">{scenario.kannada} · {scenario.english}</span>
      </div>
      <PageHeading eyebrow={text('Conversation practice', 'ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ')} title={scenario.english} description={scenario.description} />
      <section className="panel" style={{ maxWidth: '820px', marginInline: 'auto' }} aria-labelledby="conversation-turn-heading">
        <ProgressBar label={text(`Turn ${turnIndex + 1} of ${scenario.turns.length}`, `${scenario.turns.length}ರಲ್ಲಿ ${turnIndex + 1}ನೇ ಹಂತ`)} value={turnIndex + 1} max={scenario.turns.length} />
        <p className="helper-text" style={{ marginTop: '0.8rem' }}>{text(`Correct replies so far: ${score} / ${answeredCount}`, `ಇಲ್ಲಿಯವರೆಗೆ ಸರಿಯಾದ ಉತ್ತರಗಳು: ${score} / ${answeredCount}`)}</p>
        <div className="panel" style={{ marginTop: '1rem', background: 'var(--muted)' }}>
          <p className="eyebrow">{text('Other speaker', 'ಎದುರಾಳಿಯ ಮಾತು')}</p>
          <h2 id="conversation-turn-heading" className="kannada-text" lang="kn">{turn.other.kannada}</h2>
          <p className="transliteration">{turn.other.transliteration}</p>
          <p className="english-meaning">{turn.other.english}</p>
          <div className="inline-actions" style={{ marginTop: '0.8rem' }}><AudioButton textToSpeak={turn.other.kannada} /></div>
        </div>
        <div className="section-heading" style={{ marginTop: '1.4rem' }}>
          <div><p className="eyebrow">{text('Your reply', 'ನಿಮ್ಮ ಉತ್ತರ')}</p><h2>{text('Choose the best response', 'ಉತ್ತಮ ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ')}</h2></div>
          <Button type="button" variant="outline" size="sm" aria-expanded={hintOpen} aria-controls="conversation-hint" onClick={() => setHintOpen((open) => !open)}>
            {hintOpen ? text('Hide hint', 'ಸುಳಿವು ಮುಚ್ಚಿ') : text('Show hint', 'ಸುಳಿವು ನೋಡಿ')}
          </Button>
        </div>
        {hintOpen ? <p className="status-note" id="conversation-hint">{turn.hint}</p> : null}
        <div className="answer-list" style={{ marginTop: '0.8rem' }}>
          {turn.replies.map((item, index) => (
            <button
              className="answer-button"
              key={item.phrase.id}
              type="button"
              disabled={answered}
              aria-pressed={selected === index}
              data-correct={answered && item.correct ? 'true' : selected === index ? 'false' : undefined}
              onClick={() => chooseReply(index)}
            >
              <span><strong lang="kn">{item.phrase.kannada}</strong><br /><span className="transliteration">{item.phrase.transliteration}</span><br />{item.phrase.english}</span>
            </button>
          ))}
        </div>
        {selectedReply ? (
          <>
            <p className="feedback-box" role="status">{selectedReply.feedback}</p>
            <div style={{ marginTop: '0.8rem' }}><PhraseCard phrase={selectedReply.phrase} source={`Conversation: ${scenario.english}`} /></div>
            <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="button" variant="outline" onClick={() => {
                if (selectedReply.correct) setScore((current) => Math.max(0, current - 1))
                setSelected(null)
              }}>{text('Retry this turn', 'ಈ ಹಂತ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ')}</Button>
              <Button type="button" variant="secondary" onClick={continueConversation}>
                {turnIndex === scenario.turns.length - 1 ? text('Finish conversation', 'ಸಂಭಾಷಣೆ ಮುಗಿಸಿ') : text('Next turn', 'ಮುಂದಿನ ಹಂತ')} <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}
