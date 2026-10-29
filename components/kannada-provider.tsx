'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Phrase } from '@/lib/kannada-data'

export type DisplayLanguage = 'english' | 'kannada' | 'bilingual'
export type ColorTheme = 'light' | 'dark'

export type SavedPhrase = {
  id: string
  kannada: string
  transliteration: string
  english: string
  category: string
  source: string
  savedAt: string
}

export type QuizAttempt = {
  id: string
  quizId: string
  title: string
  score: number
  total: number
  occurredAt: string
}

export type LearningActivity = {
  id: string
  kind: 'lesson' | 'quiz' | 'survival' | 'conversation' | 'phrase' | 'culture' | 'speech'
  title: string
  occurredAt: string
  xpEarned: number
}

type ProgressData = {
  version: 2
  xp: number
  completedLessons: string[]
  completedStages: string[]
  savedPhrases: SavedPhrase[]
  quizAttempts: QuizAttempt[]
  activities: LearningActivity[]
  xpClaims: string[]
}

type QuizAttemptInput = {
  quizId: string
  title: string
  score: number
  total: number
  xp?: number
  kind?: LearningActivity['kind']
}

type KannadaContextValue = {
  language: DisplayLanguage
  setLanguage: (language: DisplayLanguage) => void
  theme: ColorTheme
  toggleTheme: () => void
  text: (english: string, kannada: string) => string
  progress: ProgressData
  storageMessage: string | null
  isPhraseSaved: (kannada: string) => boolean
  savePhrase: (phrase: Phrase, source?: string) => void
  removePhrase: (id: string) => void
  recordQuizAttempt: (attempt: QuizAttemptInput) => void
  completeLesson: (id: string, title: string, xp?: number) => void
  completeStage: (id: string, title: string, score: number, total: number, xp?: number) => void
  recordActivity: (title: string, kind: LearningActivity['kind']) => void
  resetProgress: () => void
}

const PROGRESS_KEY = 'kannada-everywhere:progress:v2'
const LEGACY_PROGRESS_KEYS = ['kannada-everywhere:progress:v1', 'kannada-everywhere-progress']
const PREFERENCES_KEY = 'kannada-everywhere:preferences:v1'

function emptyProgress(): ProgressData {
  return {
    version: 2,
    xp: 0,
    completedLessons: [],
    completedStages: [],
    savedPhrases: [],
    quizAttempts: [],
    activities: [],
    xpClaims: [],
  }
}

function validStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').slice(0, 500)
}

function normalizeProgress(value: unknown): ProgressData | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Record<string, unknown>
  const hasKnownShape = source.version === 2 ||
    Array.isArray(source.completedLessons) ||
    Array.isArray(source.savedPhrases) ||
    Array.isArray(source.phrasebook) ||
    Array.isArray(source.quizAttempts)
  if (!hasKnownShape) return null

  const phrasesSource = Array.isArray(source.savedPhrases)
    ? source.savedPhrases
    : Array.isArray(source.phrasebook)
      ? source.phrasebook
      : []
  const savedPhrases: SavedPhrase[] = phrasesSource.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return []
    const phrase = item as Record<string, unknown>
    if (typeof phrase.kannada !== 'string' || typeof phrase.english !== 'string') return []
    return [{
      id: typeof phrase.id === 'string' ? phrase.id : `migrated-${index}`,
      kannada: phrase.kannada,
      transliteration: typeof phrase.transliteration === 'string' ? phrase.transliteration : '',
      english: phrase.english,
      category: typeof phrase.category === 'string' ? phrase.category : 'Saved phrase',
      source: typeof phrase.source === 'string' ? phrase.source : 'Migrated phrasebook',
      savedAt: typeof phrase.savedAt === 'string' ? phrase.savedAt : new Date(0).toISOString(),
    }]
  }).slice(0, 1000)

  const quizAttempts: QuizAttempt[] = Array.isArray(source.quizAttempts)
    ? source.quizAttempts.flatMap((item, index) => {
      if (!item || typeof item !== 'object') return []
      const attempt = item as Record<string, unknown>
      if (typeof attempt.title !== 'string') return []
      const score = Number(attempt.score)
      const total = Number(attempt.total)
      if (!Number.isFinite(score) || !Number.isFinite(total) || total < 0) return []
      return [{
        id: typeof attempt.id === 'string' ? attempt.id : `migrated-quiz-${index}`,
        quizId: typeof attempt.quizId === 'string' ? attempt.quizId : `migrated-${index}`,
        title: attempt.title,
        score: Math.max(0, Math.min(score, total)),
        total,
        occurredAt: typeof attempt.occurredAt === 'string' ? attempt.occurredAt : new Date(0).toISOString(),
      }]
    }).slice(0, 1000)
    : []

  const activities: LearningActivity[] = Array.isArray(source.activities)
    ? source.activities.flatMap((item, index) => {
      if (!item || typeof item !== 'object') return []
      const activity = item as Record<string, unknown>
      if (typeof activity.title !== 'string') return []
      const kind = ['lesson', 'quiz', 'survival', 'conversation', 'phrase', 'culture', 'speech'].includes(String(activity.kind))
        ? activity.kind as LearningActivity['kind']
        : 'lesson'
      return [{
        id: typeof activity.id === 'string' ? activity.id : `migrated-activity-${index}`,
        kind,
        title: activity.title,
        occurredAt: typeof activity.occurredAt === 'string' ? activity.occurredAt : new Date(0).toISOString(),
        xpEarned: Number.isFinite(Number(activity.xpEarned)) ? Math.max(0, Number(activity.xpEarned)) : 0,
      }]
    }).slice(0, 100)
    : []

  const xp = Number(source.xp)
  return {
    version: 2,
    xp: Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0,
    completedLessons: validStringArray(source.completedLessons),
    completedStages: validStringArray(source.completedStages),
    savedPhrases,
    quizAttempts,
    activities,
    xpClaims: validStringArray(source.xpClaims),
  }
}

function localDateKey(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function withActivity(
  current: ProgressData,
  title: string,
  kind: LearningActivity['kind'],
  xp: number,
  claimKey?: string,
): ProgressData {
  const hasClaim = Boolean(claimKey && current.xpClaims.includes(claimKey))
  const xpEarned = xp > 0 && !hasClaim ? xp : 0
  const occurredAt = new Date().toISOString()
  const event: LearningActivity = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    title,
    occurredAt,
    xpEarned,
  }
  return {
    ...current,
    xp: current.xp + xpEarned,
    xpClaims: claimKey && xp > 0 && !hasClaim ? [...current.xpClaims, claimKey] : current.xpClaims,
    activities: [event, ...current.activities].slice(0, 100),
  }
}

export function calculateLearningStreak(activities: LearningActivity[], now = new Date()): number {
  const activeDays = new Set(activities.map((activity) => localDateKey(activity.occurredAt)).filter(Boolean))
  const today = localDateKey(now)
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = localDateKey(yesterdayDate)
  if (!activeDays.has(today) && !activeDays.has(yesterday)) return 0

  let cursor = activeDays.has(today) ? new Date(now) : yesterdayDate
  let streak = 0
  while (activeDays.has(localDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const KannadaContext = createContext<KannadaContextValue | null>(null)

export function KannadaProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<DisplayLanguage>('bilingual')
  const [theme, setTheme] = useState<ColorTheme>('light')
  const [progress, setProgress] = useState<ProgressData>(emptyProgress)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [storageMessage, setStorageMessage] = useState<string | null>(null)
  const backupRef = useRef<string | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    try {
      const currentRaw = window.localStorage.getItem(PROGRESS_KEY)
      if (currentRaw) {
        try {
          const normalized = normalizeProgress(JSON.parse(currentRaw))
          if (normalized) setProgress(normalized)
          else {
            backupRef.current = currentRaw
            setStorageMessage('Stored learning data could not be read. A recovery copy will be kept before a new save.')
          }
        } catch {
          backupRef.current = currentRaw
          setStorageMessage('Stored learning data could not be read. A recovery copy will be kept before a new save.')
        }
      } else {
        for (const legacyKey of LEGACY_PROGRESS_KEYS) {
          const legacyRaw = window.localStorage.getItem(legacyKey)
          if (!legacyRaw) continue
          try {
            const migrated = normalizeProgress(JSON.parse(legacyRaw))
            if (migrated) {
              setProgress(migrated)
              break
            }
            backupRef.current = legacyRaw
          } catch {
            backupRef.current = legacyRaw
          }
        }
      }
      const preferences = window.localStorage.getItem(PREFERENCES_KEY)
      if (preferences) {
        try {
          const parsed = JSON.parse(preferences) as Record<string, unknown>
          if (parsed.language === 'english' || parsed.language === 'kannada' || parsed.language === 'bilingual') {
            setLanguage(parsed.language)
          }
          if (parsed.theme === 'light' || parsed.theme === 'dark') setTheme(parsed.theme)
        } catch {
          setStorageMessage('Display preferences could not be read; the default language and theme are active.')
        }
      }
    } catch {
      setStorageMessage('This browser blocked local storage. Progress will not persist between visits.')
    }
    loadedRef.current = true
    setProgressLoaded(true)
    setPreferencesLoaded(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.lang = language === 'kannada' ? 'kn' : 'en'
  }, [language, theme])

  useEffect(() => {
    if (!progressLoaded) return
    try {
      if (backupRef.current) {
        const backupKey = `${PROGRESS_KEY}:recovery-copy`
        if (!window.localStorage.getItem(backupKey)) window.localStorage.setItem(backupKey, backupRef.current)
        backupRef.current = null
      }
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      setStorageMessage('This browser could not save progress. Free up local storage or allow site storage to keep your activity.')
    }
  }, [progress, progressLoaded])

  useEffect(() => {
    if (!preferencesLoaded) return
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ language, theme }))
    } catch {
      setStorageMessage('Display preferences cannot be saved because browser storage is unavailable.')
    }
  }, [language, theme, preferencesLoaded])

  const text = useCallback((english: string, kannada: string) => {
    if (language === 'english') return english
    if (language === 'kannada') return kannada
    return `${kannada} · ${english}`
  }, [language])

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }, [])

  const update = useCallback((updater: (current: ProgressData) => ProgressData) => {
    if (!loadedRef.current) return
    setProgress((current) => updater(current))
  }, [])

  const isPhraseSaved = useCallback((kannada: string) => {
    return progress.savedPhrases.some((saved) => saved.kannada === kannada)
  }, [progress.savedPhrases])

  const savePhrase = useCallback((phrase: Phrase, source = phrase.category) => {
    update((current) => {
      if (current.savedPhrases.some((saved) => saved.kannada === phrase.kannada)) return current
      const saved: SavedPhrase = {
        id: createId('phrase'),
        kannada: phrase.kannada,
        transliteration: phrase.transliteration,
        english: phrase.english,
        category: phrase.category,
        source,
        savedAt: new Date().toISOString(),
      }
      const next = { ...current, savedPhrases: [saved, ...current.savedPhrases] }
      return withActivity(next, `Saved “${phrase.english}” to the phrasebook`, 'phrase', 0)
    })
  }, [update])

  const removePhrase = useCallback((id: string) => {
    update((current) => ({
      ...current,
      savedPhrases: current.savedPhrases.filter((phrase) => phrase.id !== id),
    }))
  }, [update])

  const recordQuizAttempt = useCallback((input: QuizAttemptInput) => {
    update((current) => {
      const score = Math.max(0, Math.min(Math.floor(input.score), Math.floor(input.total)))
      const total = Math.max(0, Math.floor(input.total))
      const occurredAt = new Date().toISOString()
      const attempt: QuizAttempt = {
        id: createId('quiz'),
        quizId: input.quizId,
        title: input.title,
        score,
        total,
        occurredAt,
      }
      const next = withActivity(
        current,
        `${input.title}: ${score}/${total}`,
        input.kind ?? 'quiz',
        input.xp ?? 10,
        `quiz:${input.quizId}`,
      )
      return { ...next, quizAttempts: [attempt, ...current.quizAttempts].slice(0, 1000) }
    })
  }, [update])

  const completeLesson = useCallback((id: string, title: string, xp = 40) => {
    update((current) => {
      const isNew = !current.completedLessons.includes(id)
      const next = isNew
        ? { ...current, completedLessons: [...current.completedLessons, id] }
        : current
      return withActivity(next, `Completed ${title}`, 'lesson', isNew ? xp : 0, `lesson:${id}`)
    })
  }, [update])

  const completeStage = useCallback((id: string, title: string, score: number, total: number, xp = 35) => {
    update((current) => {
      const isNew = !current.completedStages.includes(id)
      const next = isNew
        ? { ...current, completedStages: [...current.completedStages, id] }
        : current
      const withCompletion = withActivity(next, `Completed ${title} (${score}/${total})`, 'survival', isNew ? xp : 0, `stage:${id}`)
      const attempt: QuizAttempt = {
        id: createId('stage-quiz'),
        quizId: `survival:${id}`,
        title: `Survival · ${title}`,
        score: Math.max(0, Math.min(score, total)),
        total,
        occurredAt: new Date().toISOString(),
      }
      return { ...withCompletion, quizAttempts: [attempt, ...current.quizAttempts].slice(0, 1000) }
    })
  }, [update])

  const recordActivity = useCallback((title: string, kind: LearningActivity['kind']) => {
    update((current) => withActivity(current, title, kind, 0))
  }, [update])

  const resetProgress = useCallback(() => {
    update(() => emptyProgress())
  }, [update])

  const value = useMemo<KannadaContextValue>(() => ({
    language,
    setLanguage,
    theme,
    toggleTheme,
    text,
    progress,
    storageMessage,
    isPhraseSaved,
    savePhrase,
    removePhrase,
    recordQuizAttempt,
    completeLesson,
    completeStage,
    recordActivity,
    resetProgress,
  }), [
    language, theme, toggleTheme, text, progress, storageMessage,
    isPhraseSaved, savePhrase, removePhrase, recordQuizAttempt,
    completeLesson, completeStage, recordActivity, resetProgress,
  ])

  return <KannadaContext.Provider value={value}>{children}</KannadaContext.Provider>
}

export function useKannada() {
  const context = useContext(KannadaContext)
  if (!context) throw new Error('useKannada must be used within KannadaProvider')
  return context
}
