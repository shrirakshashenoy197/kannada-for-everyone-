import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AppShell } from '@/components/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kannada Everywhere — Learn Kannada, Speak Confidently',
    template: '%s | Kannada Everywhere',
  },
  description:
    'Learn practical Kannada through short lessons, real-life conversations, sign reading, pronunciation practice, and Karnataka heritage.',
  applicationName: 'Kannada Everywhere',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#fbf9f3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
