'use client'

import type { ReactNode } from 'react'
import { KannadaProvider, useKannada } from '@/components/kannada-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

function ShellContent({ children }: { children: ReactNode }) {
  const { storageMessage } = useKannada()
  return (
    <>
      <SiteHeader />
      {storageMessage ? (
        <div className="site-container" role="status" aria-live="polite" style={{ paddingTop: '0.75rem' }}>
          <p className="status-note">{storageMessage}</p>
        </div>
      ) : null}
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <KannadaProvider>
      <a className="sr-only" href="#main-content">Skip to content</a>
      <ShellContent>{children}</ShellContent>
    </KannadaProvider>
  )
}
