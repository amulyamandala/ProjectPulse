import './index.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="navbar-brand">ProjectPulse</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: '14px' }}>Features</a>
          <a href="#pricing" style={{ fontSize: '14px' }}>Pricing</a>
          <button className="btn-outline">Log in</button>
          <button className="btn-primary">Sign up</button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--spacing-4xl) var(--spacing-xl)' }}>
        <div className="mono-caption" style={{ marginBottom: 'var(--spacing-md)' }}>
          Adaptive Delivery Engine
        </div>
        <h1 style={{ fontSize: '72px', lineHeight: '72px', letterSpacing: '-1.8px', marginBottom: 'var(--spacing-xl)', maxWidth: '800px' }}>
          Software delivery,<br />engineered for clarity.
        </h1>
        <p style={{ color: 'var(--body-mid)', fontSize: '18px', maxWidth: '600px', marginBottom: 'var(--spacing-2xl)', lineHeight: '28px' }}>
          ProjectPulse is a multi-tenant agile collaboration suite that continuously analyzes your sprint data to predict delivery risks and enforce strict quality definitions.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>Start building</button>
          <button className="btn-outline" style={{ padding: '12px 24px', fontSize: '16px' }}>Read docs</button>
        </div>
      </main>

      <section style={{ padding: 'var(--spacing-4xl) var(--spacing-xl)', backgroundColor: 'var(--canvas-soft)', borderTop: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)' }}>
          
          <div className="card">
            <div className="mono-caption" style={{ color: 'var(--accent-sunset)', marginBottom: 'var(--spacing-sm)' }}>01 / Sprints</div>
            <h3 style={{ fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>Agile Engine</h3>
            <p style={{ color: 'var(--body)', fontSize: '14px', lineHeight: '20px' }}>
              Create sprints, estimate tasks in story points, and run Scrum workflows with built-in blocker detection.
            </p>
          </div>

          <div className="card">
            <div className="mono-caption" style={{ color: 'var(--accent-dusk)', marginBottom: 'var(--spacing-sm)' }}>02 / Quality</div>
            <h3 style={{ fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>Definition of Done</h3>
            <p style={{ color: 'var(--body)', fontSize: '14px', lineHeight: '20px' }}>
              Enforce rigorous QA checklists before tasks can transition to DONE. Create and trace bugs seamlessly.
            </p>
          </div>

          <div className="card">
            <div className="mono-caption" style={{ color: 'var(--accent-breeze)', marginBottom: 'var(--spacing-sm)' }}>03 / Analytics</div>
            <h3 style={{ fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>Adaptive Delivery</h3>
            <p style={{ color: 'var(--body)', fontSize: '14px', lineHeight: '20px' }}>
              Our engine analyzes velocity and time-elapsed to surface medium and high-risk delivery alerts automatically.
            </p>
          </div>

        </div>
      </section>

      <footer style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)', borderTop: '1px solid var(--hairline)', textAlign: 'center' }}>
        <p style={{ color: 'var(--mute)', fontSize: '14px' }}>&copy; 2026 ProjectPulse Inc. Engineered for the future.</p>
      </footer>
    </div>
  );
}

export default App;
