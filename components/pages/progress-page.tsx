'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Award, BookOpen, Bookmark, ClipboardList, Flame, RotateCcw, Star, Target, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, PageHeading, ProgressBar } from '@/components/kannada-ui'
import { calculateLearningStreak, useKannada } from '@/components/kannada-provider'

const badgeDefinitions = [
  { id: 'first-lesson', title: 'First lesson', detail: 'Finish your first lesson.', icon: BookOpen, earned: (data: ReturnType<typeof useKannada>['progress']) => data.completedLessons.length >= 1 },
  { id: 'phrase-collector', title: 'Phrase collector', detail: 'Save five phrases to your phrasebook.', icon: Star, earned: (data: ReturnType<typeof useKannada>['progress']) => data.savedPhrases.length >= 5 },
  { id: 'quiz-practice', title: 'Quiz practice', detail: 'Complete three quiz attempts.', icon: Target, earned: (data: ReturnType<typeof useKannada>['progress']) => data.quizAttempts.length >= 3 },
  { id: 'survival-ready', title: 'Survival ready', detail: 'Complete three survival stages.', icon: Trophy, earned: (data: ReturnType<typeof useKannada>['progress']) => data.completedStages.length >= 3 },
]

export function ProgressPage() {
  const { text, progress, resetProgress } = useKannada()
  const streak = calculateLearningStreak(progress.activities)
  const questionsAnswered = progress.quizAttempts.reduce((sum, attempt) => sum + attempt.total, 0)
  const correctAnswers = progress.quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
  const earnedBadges = badgeDefinitions.filter((badge) => badge.earned(progress)).length
  const nextLesson = Math.min(progress.completedLessons.length, 6)
  const activity = useMemo(() => progress.activities.slice(0, 12), [progress.activities])

  function clearProgress() {
    const confirmed = window.confirm(text('Reset all local learning progress, saved phrases, and quiz history? This cannot be undone.', 'ಎಲ್ಲಾ ಸ್ಥಳೀಯ ಕಲಿಕೆ ಪ್ರಗತಿ, ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ರಸಪ್ರಶ್ನೆ ಇತಿಹಾಸವನ್ನು ಮರುಹೊಂದಿಸಬೇಕೇ? ಇದನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗುವುದಿಲ್ಲ.'))
    if (confirmed) resetProgress()
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('Your learning journey', 'ನಿಮ್ಮ ಕಲಿಕೆಯ ಪಯಣ')}
        title={text('Progress', 'ಪ್ರಗತಿ')}
        description={text('Every number below is calculated from activity you completed on this device. A fresh profile starts at zero; no sample stats are shown.', 'ಕೆಳಗಿನ ಪ್ರತಿಯೊಂದು ಅಂಕವೂ ಈ ಸಾಧನದಲ್ಲಿ ನೀವು ಪೂರ್ಣಗೊಳಿಸಿದ ಚಟುವಟಿಕೆಯಿಂದ ಲೆಕ್ಕಿಸಲಾಗಿದೆ. ಹೊಸ ಪ್ರೊಫೈಲ್ ಶೂನ್ಯದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ; ಮಾದರಿ ಅಂಕಿಗಳಿಲ್ಲ.')}
        action={<Button type="button" variant="outline" onClick={clearProgress}><RotateCcw data-icon="inline-start" aria-hidden="true" /> {text('Reset progress', 'ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ')}</Button>}
      />

      <section className="stat-grid" aria-label={text('Progress statistics', 'ಪ್ರಗತಿ ಅಂಕಿಅಂಶಗಳು')}>
        <article className="stat-card"><div className="stat-top"><span>{text('Experience points', 'ಅನುಭವ ಅಂಕಗಳು')}</span><span className="stat-icon"><Star aria-hidden="true" /></span></div><div><div className="stat-value">{progress.xp} XP</div><p className="stat-caption">{text('Earned by completing activities', 'ಚಟುವಟಿಕೆ ಪೂರ್ಣಗೊಳಿಸಿದಾಗ ಗಳಿಸಿದ್ದು')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Lessons', 'ಪಾಠಗಳು')}</span><span className="stat-icon"><BookOpen aria-hidden="true" /></span></div><div><div className="stat-value">{progress.completedLessons.length}</div><p className="stat-caption">{text('Completed once', 'ಒಮ್ಮೆ ಪೂರ್ಣಗೊಳಿಸಿದವು')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Quiz accuracy', 'ರಸಪ್ರಶ್ನೆ ನಿಖರತೆ')}</span><span className="stat-icon"><Target aria-hidden="true" /></span></div><div><div className="stat-value">{questionsAnswered ? `${accuracy}%` : '—'}</div><p className="stat-caption">{questionsAnswered ? `${correctAnswers}/${questionsAnswered} ${text('correct', 'ಸರಿಯಾಗಿದೆ')}` : text('No quiz answers yet', 'ಇನ್ನೂ ರಸಪ್ರಶ್ನೆ ಉತ್ತರಗಳಿಲ್ಲ')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Learning streak', 'ಕಲಿಕೆಯ ಸತತ ದಿನಗಳು')}</span><span className="stat-icon"><Flame aria-hidden="true" /></span></div><div><div className="stat-value">{streak} {text(streak === 1 ? 'day' : 'days', 'ದಿನ')}</div><p className="stat-caption">{text('Based on dated activity', 'ದಿನಾಂಕದ ಚಟುವಟಿಕೆಯ ಆಧಾರ')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Quiz attempts', 'ರಸಪ್ರಶ್ನೆ ಪ್ರಯತ್ನಗಳು')}</span><span className="stat-icon"><ClipboardList aria-hidden="true" /></span></div><div><div className="stat-value">{progress.quizAttempts.length}</div><p className="stat-caption">{text('Finished attempts recorded', 'ಪೂರ್ಣಗೊಂಡ ಪ್ರಯತ್ನಗಳು ದಾಖಲಾಗಿವೆ')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Survival stages', 'ಸರ್ವೈವಲ್ ಹಂತಗಳು')}</span><span className="stat-icon"><Trophy aria-hidden="true" /></span></div><div><div className="stat-value">{progress.completedStages.length}/6</div><p className="stat-caption">{text('Completed and unlocked', 'ಪೂರ್ಣಗೊಂಡು ತೆರೆಯಲ್ಪಟ್ಟವು')}</p></div></article>
        <article className="stat-card"><div className="stat-top"><span>{text('Saved phrases', 'ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು')}</span><span className="stat-icon"><Bookmark aria-hidden="true" /></span></div><div><div className="stat-value">{progress.savedPhrases.length}</div><p className="stat-caption">{text('Available in your phrasebook', 'ನಿಮ್ಮ ನುಡಿಗಟ್ಟು ಪುಸ್ತಕದಲ್ಲಿವೆ')}</p></div></article>
      </section>

      <section className="section-block grid-2">
        <article className="panel">
          <div className="section-heading"><div><p className="eyebrow">{text('Next milestone', 'ಮುಂದಿನ ಮೈಲಿಗಲ್ಲು')}</p><h2>{text('A little progress adds up', 'ಚಿಕ್ಕ ಪ್ರಗತಿಯೂ ದೊಡ್ಡದು')}</h2></div><Award aria-hidden="true" /></div>
          <ProgressBar label={text(`${nextLesson} of 6 lessons completed`, `6ರಲ್ಲಿ ${nextLesson} ಪಾಠಗಳು ಪೂರ್ಣ`)} value={nextLesson} max={6} />
          <div className="inline-actions" style={{ marginTop: '1.1rem' }}>
            <span className="pill">{progress.savedPhrases.length} {text('phrases saved', 'ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು')}</span>
            <span className="pill">{progress.completedStages.length}/6 {text('survival stages', 'ಸರ್ವೈವಲ್ ಹಂತಗಳು')}</span>
            <span className="pill">{earnedBadges}/4 {text('badges earned', 'ಬ್ಯಾಡ್ಜ್ ಗಳಿಕೆ')}</span>
          </div>
          <div className="button-row" style={{ marginTop: '1.2rem' }}>
            <Link className="btn-secondary" href="/learn">{text('Continue learning', 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ')}</Link>
            <Link className="small-button" href="/survival">{text('Survival mode', 'ಸರ್ವೈವಲ್ ಮೋಡ್')}</Link>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading"><div><p className="eyebrow">{text('Milestones', 'ಮೈಲಿಗಲ್ಲುಗಳು')}</p><h2>{text('Badges', 'ಬ್ಯಾಡ್ಜ್‌ಗಳು')}</h2></div><Trophy aria-hidden="true" /></div>
          <div className="badge-list">
            {badgeDefinitions.map((badge) => {
              const Icon = badge.icon
              const earned = badge.earned(progress)
              return (
                <div className="badge-row" key={badge.id}>
                  <span className="inline-actions"><span className="feature-icon"><Icon aria-hidden="true" /></span><span><strong>{badge.title}</strong><br /><span className="helper-text">{badge.detail}</span></span></span>
                  <span className={`pill${earned ? ' pill-complete' : ' pill-locked'}`}>{earned ? text('Earned', 'ಗಳಿಸಲಾಗಿದೆ') : text('Locked', 'ಲಾಕ್ ಆಗಿದೆ')}</span>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <section className="section-block panel" aria-labelledby="activity-heading">
        <div className="section-heading"><div><p className="eyebrow">{text('Recent activity', 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ')}</p><h2 id="activity-heading">{text('Your learning history', 'ನಿಮ್ಮ ಕಲಿಕೆಯ ಇತಿಹಾಸ')}</h2></div></div>
        {activity.length === 0 ? (
          <EmptyState title={text('Your journey starts here', 'ನಿಮ್ಮ ಪಯಣ ಇಲ್ಲಿ ಆರಂಭವಾಗುತ್ತದೆ')} description={text('Complete a lesson, try a quiz, save a phrase, or finish a survival stage to see it recorded here.', 'ಪಾಠ ಪೂರ್ಣಗೊಳಿಸಿ, ರಸಪ್ರಶ್ನೆ ಮಾಡಿ, ನುಡಿಗಟ್ಟು ಉಳಿಸಿ ಅಥವಾ ಸರ್ವೈವಲ್ ಹಂತ ಮುಗಿಸಿದರೆ ಅದು ಇಲ್ಲಿ ದಾಖಲಾಗುತ್ತದೆ.')} action={<Link className="btn-primary" href="/learn">{text('Start a lesson', 'ಪಾಠ ಪ್ರಾರಂಭಿಸಿ')}</Link>} />
        ) : (
          <div className="activity-list">
            {activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <span><strong>{item.title}</strong><br /><span className="helper-text">{new Date(item.occurredAt).toLocaleString()}</span></span>
                <span className="pill">{item.xpEarned > 0 ? `+${item.xpEarned} XP` : item.kind}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <p className="helper-text" style={{ marginTop: '1rem' }}>{text('Your profile is stored in this browser only. Clearing browser site data will remove it.', 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ. ಬ್ರೌಸರ್ ಡೇಟಾ ಅಳಿಸಿದರೆ ಇದು ಹೋಗುತ್ತದೆ.')}</p>
    </div>
  )
}
