import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { knowledgeDocuments } from '@/data/knowledge'

type PageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return knowledgeDocuments.map(document => ({ id: document.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const document = knowledgeDocuments.find(item => item.id === id)
  return { title: document ? `${document.title} | Grounded Knowledge Assistant` : 'Document not found' }
}

export default async function KnowledgePage({ params }: PageProps) {
  const { id } = await params
  const document = knowledgeDocuments.find(item => item.id === id)
  if (!document) notFound()

  return (
    <main className="knowledge-page">
      <Link href="/">← Back to assistant</Link>
      <p className="eyebrow">Synthetic source · {document.id}</p>
      <h1>{document.title}</h1>
      <p className="knowledge-note">Written for this reference project. Contains no client or confidential data.</p>
      <article>
        {document.text.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </main>
  )
}
