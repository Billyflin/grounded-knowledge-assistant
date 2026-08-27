import { AskPanel } from './components/ask-panel'

const controls = [
  ['01', 'Retrieval gate', 'Questions below the evidence threshold return a refusal instead of a plausible guess.'],
  ['02', 'Untrusted context', 'Retrieved documents are delimited as untrusted data, never supplied as system instructions.'],
  ['03', 'Citation validator', 'Answers with missing or unknown source markers are blocked before reaching the client.'],
  ['04', 'Repeatable evals', 'The zero-key provider makes retrieval and refusal behavior deterministic in CI.']
]

export default function Home() {
  const mode = process.env.RAG_PROVIDER === 'openai'
    ? 'OpenAI provider mode'
    : 'Local deterministic mode'

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Grounded Knowledge Assistant home">
          GKA<span>/01</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#demo">Demo</a>
          <a href="#controls">Controls</a>
          <a href="https://github.com/Billyflin/grounded-knowledge-assistant">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Independent RAG engineering reference</p>
          <h1>Answers that earn the right to be generated.</h1>
          <p className="hero-lead">
            A small Next.js and TypeScript system that retrieves evidence, validates citations,
            refuses unsupported questions, and keeps model providers behind a tested boundary.
          </p>
          <div className="hero-links">
            <a href="#demo">Run the retrieval path ↓</a>
            <a href="https://github.com/Billyflin/grounded-knowledge-assistant">Read the implementation ↗</a>
          </div>
        </div>
        <aside className="system-card" aria-label="Request flow">
          <p>POST /api/ask</p>
          <ol>
            <li><span>01</span> Validate input</li>
            <li><span>02</span> Embed and retrieve</li>
            <li><span>03</span> Apply evidence gate</li>
            <li><span>04</span> Generate from context</li>
            <li><span>05</span> Validate citations</li>
          </ol>
          <p className="system-result">answer | refusal</p>
        </aside>
      </section>

      <section className="proof-strip" aria-label="Technical profile">
        <div><strong>0 keys</strong><span>required for local demo and CI</span></div>
        <div><strong>2 providers</strong><span>deterministic + OpenAI adapter</span></div>
        <div><strong>3 gates</strong><span>retrieval, grounding, citations</span></div>
      </section>

      <div id="demo" className="section-shell">
        <AskPanel mode={mode} />
      </div>

      <section className="controls-section" id="controls">
        <div className="section-heading">
          <p className="eyebrow">Engineering controls</p>
          <h2>The failure modes are part of the design.</h2>
          <p>This is an independent reference, not a claim of client or production RAG ownership.</p>
        </div>
        <div className="control-grid">
          {controls.map(([index, title, body]) => (
            <article key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>Built by Billy Martínez · independent technical evidence</p>
        <div>
          <a href="https://billyflin.dev">Portfolio</a>
          <a href="https://github.com/Billyflin">GitHub</a>
          <a href="mailto:hello@billyflin.dev">Email</a>
        </div>
      </footer>
    </main>
  )
}
