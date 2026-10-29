'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioButton, EmptyState, PageHeading } from '@/components/kannada-ui'
import { useKannada } from '@/components/kannada-provider'

export function PhrasebookPage() {
  const { text, progress, removePhrase } = useKannada()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => Array.from(new Set(progress.savedPhrases.map((phrase) => phrase.category))).sort(), [progress.savedPhrases])
  const visiblePhrases = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    return progress.savedPhrases.filter((phrase) => {
      const categoryMatches = category === 'all' || phrase.category === category
      const queryMatches = !normalized || [phrase.kannada, phrase.transliteration, phrase.english, phrase.category]
        .some((value) => value.toLocaleLowerCase().includes(normalized))
      return categoryMatches && queryMatches
    })
  }, [category, progress.savedPhrases, query])

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={text('Your saved words', 'ನೀವು ಉಳಿಸಿದ ಪದಗಳು')}
        title={text('Phrasebook', 'ನುಡಿಗಟ್ಟುಗಳ ಪುಸ್ತಕ')}
        description={text('Save phrases from lessons, conversations, heritage, or scan results. They stay on this device and can be searched or removed anytime.', 'ಪಾಠ, ಸಂಭಾಷಣೆ, ಪರಂಪರೆ ಅಥವಾ ಸ್ಕ್ಯಾನ್ ಫಲಿತಾಂಶದಿಂದ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಉಳಿಸಿ. ಅವು ಈ ಸಾಧನದಲ್ಲೇ ಇರುತ್ತವೆ; ಯಾವಾಗ ಬೇಕಾದರೂ ಹುಡುಕಬಹುದು ಅಥವಾ ತೆಗೆದುಹಾಕಬಹುದು.')}
      />

      <section className="panel" aria-label={text('Search saved phrases', 'ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಹುಡುಕಿ')} style={{ marginBottom: '1.2rem' }}>
        <div className="grid-2">
          <label className="form-field">
            <span className="form-label">{text('Search your phrasebook', 'ನಿಮ್ಮ ನುಡಿಗಟ್ಟು ಪುಸ್ತಕದಲ್ಲಿ ಹುಡುಕಿ')}</span>
            <span style={{ position: 'relative' }}>
              <Search aria-hidden="true" style={{ position: 'absolute', left: '0.8rem', top: '0.8rem' }} />
              <input className="text-input" style={{ paddingLeft: '2.5rem' }} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text('Kannada, transliteration, or English', 'ಕನ್ನಡ, ಲಿಪ್ಯಂತರ ಅಥವಾ ಇಂಗ್ಲಿಷ್')} />
            </span>
          </label>
          <label className="form-field">
            <span className="form-label">{text('Filter by category', 'ವರ್ಗದಂತೆ ವಿಂಗಡಿಸಿ')}</span>
            <select className="select-input" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">{text('All categories', 'ಎಲ್ಲ ವರ್ಗಗಳು')}</option>
              {categories.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      {progress.savedPhrases.length === 0 ? (
        <EmptyState
          title={text('Your phrasebook is ready', 'ನಿಮ್ಮ ನುಡಿಗಟ್ಟು ಪುಸ್ತಕ ಸಿದ್ಧವಾಗಿದೆ')}
          description={text('Save a phrase from any learning page and it will appear here. Nothing is prefilled, so this list reflects your real activity.', 'ಯಾವುದೇ ಕಲಿಕೆ ಪುಟದಿಂದ ನುಡಿಗಟ್ಟನ್ನು ಉಳಿಸಿದರೆ ಅದು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ. ಮಾದರಿ ಪದಗಳನ್ನು ಸೇರಿಸಿಲ್ಲ; ಈ ಪಟ್ಟಿ ನಿಮ್ಮ ನಿಜವಾದ ಚಟುವಟಿಕೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.')}
          action={<Link className="btn-secondary" href="/learn">{text('Browse lessons', 'ಪಾಠಗಳನ್ನು ನೋಡಿ')}</Link>}
        />
      ) : visiblePhrases.length === 0 ? (
        <EmptyState title={text('No matching phrases', 'ಹೊಂದುವ ನುಡಿಗಟ್ಟುಗಳಿಲ್ಲ')} description={text('Try another search or category filter.', 'ಮತ್ತೊಂದು ಪದ ಅಥವಾ ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ.')} />
      ) : (
        <div className="phrase-grid">
          {visiblePhrases.map((phrase) => (
            <article className="phrase-card" key={phrase.id}>
              <div className="phrase-card-content">
                <span className="pill">{phrase.category}</span>
                <p className="kannada-text" lang="kn" style={{ marginTop: '0.55rem' }}>{phrase.kannada}</p>
                <p className="transliteration">{phrase.transliteration}</p>
                <p className="english-meaning">{phrase.english}</p>
                <p className="helper-text">{text('Saved', 'ಉಳಿಸಿದ ದಿನ')}: {new Date(phrase.savedAt).toLocaleDateString()}</p>
              </div>
              <div className="phrase-actions">
                <AudioButton textToSpeak={phrase.kannada} />
                <Button type="button" variant="outline" size="icon" aria-label={text(`Remove ${phrase.english} from phrasebook`, `${phrase.english} ನುಡಿಗಟ್ಟು ತೆಗೆದುಹಾಕಿ`)} onClick={() => removePhrase(phrase.id)}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="helper-text" style={{ marginTop: '1rem' }}><Bookmark aria-hidden="true" /> {text(`${progress.savedPhrases.length} saved phrase${progress.savedPhrases.length === 1 ? '' : 's'}`, `ಒಟ್ಟು ${progress.savedPhrases.length} ಉಳಿಸಿದ ನುಡಿಗಟ್ಟು`)}</p>
    </div>
  )
}
