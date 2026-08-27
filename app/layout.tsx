import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/Billyflin/grounded-knowledge-assistant'),
  title: 'Grounded Knowledge Assistant',
  description: 'A source-grounded RAG reference with citations, deterministic evals, safe refusals and an optional OpenAI provider.',
  authors: [{ name: 'Billy Martínez', url: 'https://billyflin.dev' }],
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Grounded Knowledge Assistant',
    description: 'Retrieval, evidence gates, safe refusals and validated citations in a tested TypeScript reference.',
    type: 'website'
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
