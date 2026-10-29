'use client'

import { useState } from 'react'
import { ArrowRight, Check, Compass, Music2, Sparkles, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeading, PhraseCard, ProgressBar } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'
import { CULTURE_QUIZ, FESTIVALS, type QuizQuestion } from '@/lib/kannada-data'

const cultureSections = [
  { id: 'festivals', en: 'Festivals', kn: 'ಹಬ್ಬಗಳು' },
  { id: 'voices', en: 'Regional voices', kn: 'ಪ್ರಾದೇಶಿಕ ನುಡಿಗಳು' },
  { id: 'traditions', en: 'Traditions', kn: 'ಸಂಪ್ರದಾಯಗಳು' },
] as const

type CultureSection = typeof cultureSections[number]['id']

function mixQuestion(question: QuizQuestion): QuizQuestion {
  const options = question.options.map((label, index) => ({ label, correct: index === question.correctIndex }))
  for (let index = options.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[options[index], options[target]] = [options[target], options[index]]
  }
  return { ...question, options: options.map((option) => option.label), correctIndex: options.findIndex((option) => option.correct) }
}

export function CulturePage() {
  const { text, recordQuizAttempt } = useKannada()
  const [section, setSection] = useState<CultureSection>('festivals')
  const [expandedFestival, setExpandedFestival] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const question = questions[questionIndex]

  function startQuiz() {
    setQuestions(CULTURE_QUIZ.map(mixQuestion))
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setFinalScore(0)
    setQuizStarted(true)
    setQuizFinished(false)
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !question) return
    setSelected(index)
    if (index === question.correctIndex) setScore((current) => current + 1)
  }

  function continueQuiz() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1)
      setSelected(null)
      return
    }
    setFinalScore(score)
    recordQuizAttempt({ quizId: 'culture-festivals', title: 'Karnataka culture quiz', score, total: questions.length, xp: 10, kind: 'culture' })
    setQuizFinished(true)
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('Language in its living context', 'ಜೀವಂತ ಸಂದರ್ಭದಲ್ಲಿನ ಭಾಷೆ')}
        title={text('Culture & traditions', 'ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಂಪ್ರದಾಯಗಳು')}
        description={text('Explore festival notes, regional language variation, and everyday traditions. Dates and practices vary; use this as an introduction, not a complete guide.', 'ಹಬ್ಬಗಳ ಮಾಹಿತಿ, ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ವ್ಯತ್ಯಾಸ ಮತ್ತು ದೈನಂದಿನ ಸಂಪ್ರದಾಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ದಿನಾಂಕ ಮತ್ತು ಆಚರಣೆಗಳು ಬದಲಾಗುತ್ತವೆ; ಇದನ್ನು ಪರಿಚಯವಾಗಿ ನೋಡಿ, ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿಯಾಗಿ ಅಲ್ಲ.')}
      />

      <div className="toolbar" role="group" aria-label={text('Culture topics', 'ಸಂಸ್ಕೃತಿ ವಿಷಯಗಳು')} style={{ flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {cultureSections.map((item) => (
          <button key={item.id} className="tab-button" type="button" aria-pressed={section === item.id} onClick={() => setSection(item.id)}>{text(item.en, item.kn)}</button>
        ))}
      </div>

      {section === 'festivals' ? (
        <section aria-labelledby="festival-heading">
          <div className="section-heading"><div><p className="eyebrow">{text('Calendar and community', 'ಪಂಚಾಂಗ ಮತ್ತು ಸಮುದಾಯ')}</p><h2 id="festival-heading">{text('Festivals of Karnataka', 'ಕರ್ನಾಟಕದ ಹಬ್ಬಗಳು')}</h2></div></div>
          <div className="feature-grid">
            {FESTIVALS.map((festival) => {
              const expanded = expandedFestival === festival.id
              return (
                <article className="feature-card" key={festival.id}>
                  <span className="feature-icon"><Sparkles aria-hidden="true" /></span>
                  <span className="pill">{festival.kannada} · {festival.transliteration}</span>
                  <h3>{festival.english}</h3>
                  <p>{festival.summary}</p>
                  {expanded ? <p className="status-note">{festival.detail}</p> : null}
                  <PhraseCard phrase={festival.vocabulary} source={`Culture: ${festival.english}`} />
                  <div className="card-actions" style={{ marginTop: 'auto', paddingTop: '0.8rem' }}>
                    <Button type="button" variant="outline" size="sm" aria-expanded={expanded} onClick={() => setExpandedFestival(expanded ? null : festival.id)}>{expanded ? text('Show less', 'ಕಡಿಮೆ ತೋರಿಸಿ') : text('Learn more', 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ')}</Button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ) : section === 'voices' ? (
        <section className="grid-2" aria-labelledby="regional-voices-heading">
          <article className="panel">
            <div className="section-heading"><div><p className="eyebrow">{text('Listen with curiosity', 'ಕುತೂಹಲದಿಂದ ಆಲಿಸಿ')}</p><h2 id="regional-voices-heading">{text('Regional voices', 'ಪ್ರಾದೇಶಿಕ ನುಡಿಗಳು')}</h2></div><Compass aria-hidden="true" /></div>
            <p className="page-description" style={{ marginTop: 0 }}>{text('Kannada pronunciation, rhythm, vocabulary, and forms of address vary across northern, southern, coastal, and urban communities. A place name is not a reliable boundary for how every speaker talks.', 'ಉತ್ತರ, ದಕ್ಷಿಣ, ಕರಾವಳಿ ಮತ್ತು ನಗರ ಸಮುದಾಯಗಳಲ್ಲಿ ಕನ್ನಡದ ಉಚ್ಚಾರಣೆ, ಲಯ, ಪದಸಂಪತ್ತು ಮತ್ತು ಸಂಬೋಧನೆ ಬದಲಾಗುತ್ತದೆ. ಒಂದು ಸ್ಥಳದ ಹೆಸರಿನಿಂದ ಎಲ್ಲರೂ ಹೇಗೆ ಮಾತನಾಡುತ್ತಾರೆ ಎಂದು ನಿರ್ಧರಿಸಲಾಗುವುದಿಲ್ಲ.')}</p>
            <ul className="detail-list" style={{ paddingInlineStart: '1.1rem' }}>
              <li>{text('The lessons use widely understood introductory phrases, not a dialect dictionary.', 'ಪಾಠಗಳಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಅರ್ಥವಾಗುವ ಪರಿಚಯಾತ್ಮಕ ನುಡಿಗಟ್ಟುಗಳಿವೆ; ಪ್ರಾದೇಶಿಕ ನಿಘಂಟಲ್ಲ.')}</li>
              <li>{text('Listen for local word choices and ask whether a phrase sounds natural in that area.', 'ಸ್ಥಳೀಯ ಪದ ಬಳಕೆಯನ್ನು ಆಲಿಸಿ; ಆ ಪ್ರದೇಶದಲ್ಲಿ ನುಡಿಗಟ್ಟು ಸಹಜವಾಗಿದೆಯೇ ಎಂದು ಕೇಳಿ.')}</li>
              <li>{text('Use polite forms with new people and follow the other speaker’s preferred form of address.', 'ಹೊಸ ಜನರೊಂದಿಗೆ ಗೌರವಪೂರ್ಣ ರೂಪ ಬಳಸಿ; ಎದುರಾಳಿಯ ಇಷ್ಟದ ಸಂಬೋಧನೆಯನ್ನು ಅನುಸರಿಸಿ.')}</li>
            </ul>
          </article>
          <article className="panel">
            <p className="eyebrow">{text('A useful starter phrase', 'ಉಪಯುಕ್ತ ಆರಂಭಿಕ ನುಡಿಗಟ್ಟು')}</p>
            <PhraseCard phrase={{ id: 'culture-speak-slow', kannada: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', transliteration: 'Dayaviṭṭu nidhānavāgi mātanāḍi.', english: 'Please speak slowly.', category: 'Regional voices' }} source="Culture and regional voices" />
            <p className="helper-text" style={{ marginTop: '1rem' }}>{text('Asking someone to slow down is more useful than pretending to understand. Speech synthesis depends on installed browser voices.', 'ಅರ್ಥವಾಗದಿದ್ದರೆ ನಿಧಾನವಾಗಿ ಮಾತನಾಡಲು ಕೇಳುವುದು ನಟಿಸುವುದಕ್ಕಿಂತ ಉಪಯುಕ್ತ. ಮಾತಿನ ಧ್ವನಿ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಧ್ವನಿಗಳ ಮೇಲೆ ಅವಲಂಬಿತ.')}</p>
          </article>
        </section>
      ) : (
        <section aria-labelledby="traditions-heading">
          <div className="section-heading"><div><p className="eyebrow">{text('Practices can be personal', 'ಆಚರಣೆಗಳು ವೈಯಕ್ತಿಕವಾಗಿರಬಹುದು')}</p><h2 id="traditions-heading">{text('Everyday traditions', 'ದೈನಂದಿನ ಸಂಪ್ರದಾಯಗಳು')}</h2></div></div>
          <div className="grid-3">
            <article className="panel"><span className="feature-icon"><Utensils aria-hidden="true" /></span><h3>Bevu-bella · ಬೇವು-ಬೆಲ್ಲ</h3><p className="muted-text">{text('A blend of neem and jaggery associated with Ugadi in Karnataka. Families may describe it as a reminder to meet life’s different experiences.', 'ಕರ್ನಾಟಕದ ಯುಗಾದಿಯೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ಬೇವು ಮತ್ತು ಬೆಲ್ಲದ ಮಿಶ್ರಣ. ಜೀವನದ ವಿಭಿನ್ನ ಅನುಭವಗಳನ್ನು ಸ್ವೀಕರಿಸುವ ನೆನಪಾಗಿ ಕುಟುಂಬಗಳು ಇದನ್ನು ವಿವರಿಸಬಹುದು.')}</p></article>
            <article className="panel"><span className="feature-icon"><Sparkles aria-hidden="true" /></span><h3>Bombe habba · ಬೊಂಬೆ ಹಬ್ಬ</h3><p className="muted-text">{text('Some families display dolls during Navaratri. The name and details of the practice vary by region and household.', 'ಕೆಲವು ಕುಟುಂಬಗಳು ನವರಾತ್ರಿಯಲ್ಲಿ ಗೊಂಬೆಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತವೆ. ಆಚರಣೆಯ ಹೆಸರು ಮತ್ತು ವಿವರ ಪ್ರದೇಶ ಹಾಗೂ ಕುಟುಂಬದಂತೆ ಬದಲಾಗಬಹುದು.')}</p></article>
            <article className="panel"><span className="feature-icon"><Music2 aria-hidden="true" /></span><h3>Music & community · ಸಂಗೀತ</h3><p className="muted-text">{text('Public festivals and local gatherings may include music, dance, and storytelling; programs change from year to year.', 'ಸಾರ್ವಜನಿಕ ಹಬ್ಬಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಕೂಟಗಳಲ್ಲಿ ಸಂಗೀತ, ನೃತ್ಯ ಮತ್ತು ಕಥನ ಇರಬಹುದು; ಕಾರ್ಯಕ್ರಮಗಳು ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ ಬದಲಾಗುತ್ತವೆ.')}</p></article>
          </div>
          <p className="helper-text" style={{ marginTop: '1rem' }}>{text('These notes are introductory. Ask local hosts about current customs, etiquette, and event schedules.', 'ಈ ಮಾಹಿತಿ ಪರಿಚಯಾತ್ಮಕ. ಪ್ರಸ್ತುತ ಆಚರಣೆ, ಶಿಷ್ಟಾಚಾರ ಮತ್ತು ಕಾರ್ಯಕ್ರಮದ ವೇಳಾಪಟ್ಟಿ ಕುರಿತು ಸ್ಥಳೀಯರನ್ನು ಕೇಳಿ.')}</p>
        </section>
      )}

      <section className="section-block panel" aria-labelledby="culture-quiz-heading">
        <div className="section-heading"><div><p className="eyebrow">{text('Check what you learned', 'ಕಲಿತದ್ದನ್ನು ಪರಿಶೀಲಿಸಿ')}</p><h2 id="culture-quiz-heading">{text('Culture quiz', 'ಸಂಸ್ಕೃತಿ ರಸಪ್ರಶ್ನೆ')}</h2></div></div>
        {!quizStarted ? (
          <><p className="muted-text">{text('Three questions about the festival notes above. Completed attempts are added to your Progress page.', 'ಮೇಲಿನ ಹಬ್ಬಗಳ ಕುರಿತು ಮೂರು ಪ್ರಶ್ನೆಗಳು. ಪೂರ್ಣಗೊಂಡ ಪ್ರಯತ್ನಗಳು ಪ್ರಗತಿ ಪುಟಕ್ಕೆ ಸೇರುತ್ತವೆ.')}</p><Button type="button" variant="secondary" onClick={startQuiz}>{text('Start culture quiz', 'ಸಂಸ್ಕೃತಿ ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ')}</Button></>
        ) : quizFinished ? (
          <><p className="page-description" style={{ marginTop: 0 }}>{text(`You scored ${finalScore} of ${questions.length}.`, `${questions.length}ರಲ್ಲಿ ${finalScore} ಅಂಕ ಗಳಿಸಿದ್ದೀರಿ.`)}</p><Button type="button" variant="outline" onClick={startQuiz}>{text('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ')}</Button></>
        ) : question ? (
          <>
            <ProgressBar label={text(`Question ${questionIndex + 1} of ${questions.length}`, `${questions.length}ರಲ್ಲಿ ${questionIndex + 1}ನೇ ಪ್ರಶ್ನೆ`)} value={questionIndex + 1} max={questions.length} />
            <h3 style={{ marginTop: '1rem' }}>{question.prompt}</h3>
            <div className="answer-list" style={{ marginTop: '0.8rem' }}>
              {question.options.map((option, index) => <button className="answer-button" key={option} type="button" disabled={selected !== null} aria-pressed={selected === index} data-correct={selected !== null && index === question.correctIndex ? 'true' : selected === index ? 'false' : undefined} onClick={() => chooseAnswer(index)}>{option}{selected !== null && index === question.correctIndex ? <Check aria-hidden="true" /> : null}</button>)}
            </div>
            {selected !== null ? <><p className="feedback-box" role="status">{question.explanation}</p><Button type="button" variant="secondary" style={{ marginTop: '0.8rem' }} onClick={continueQuiz}>{questionIndex === questions.length - 1 ? text('Finish quiz', 'ರಸಪ್ರಶ್ನೆ ಮುಗಿಸಿ') : text('Next question', 'ಮುಂದಿನ ಪ್ರಶ್ನೆ')} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Button></> : null}
          </>
        ) : null}
      </section>
    </div>
  )
}
