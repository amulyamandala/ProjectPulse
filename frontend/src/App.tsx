import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './index.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="navbar-brand">ProjectPulse</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: '14px' }}>Features</a>
          <a href="#pricing" style={{ fontSize: '14px' }}>Pricing</a>
          <button className="btn-outline" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Sign up</button>
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
          <button className="btn-primary" onClick={() => navigate('/register')} style={{ padding: '12px 24px', fontSize: '16px' }}>Start building</button>
          <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', fontSize: '16px' }}>View Dashboard Demo</button>
        </div>
      </main>

      <section id="features" style={{ padding: 'var(--spacing-4xl) var(--spacing-xl)', backgroundColor: 'var(--canvas-soft)', borderTop: '1px solid var(--hairline)' }}>
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

import { setAuthToken } from './api/authHelper';

function AuthForm({ title }: { title: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const isLogin = title === 'Log In';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = isLogin ? { email, password } : { firstName, lastName, email, password };

      const res = await fetch(`https://projectpulse-s6d2.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.errors)) {
          throw new Error(data.errors.map((err: any) => err.message).join(', '));
        }
        throw new Error(data.error || data.message || 'Authentication failed');
      }

      // Save token
      if (data.accessToken) {
        setAuthToken(data.accessToken);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Link to="/" style={{ position: 'absolute', top: 'var(--spacing-xl)', left: 'var(--spacing-xl)' }} className="mono-caption">
        &larr; Back home
      </Link>
      <form onSubmit={handleSubmit} className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: '32px' }}>{title}</h2>
        
        {error && <div style={{ color: 'var(--accent-sunset)', fontSize: '14px' }}>{error}</div>}

        {!isLogin && (
          <>
            <input 
              className="input" 
              placeholder="First Name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input 
              className="input" 
              placeholder="Last Name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}
        <input 
          className="input" 
          placeholder="Email address" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className="input" 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
          {loading ? 'Processing...' : title}
        </button>
      </form>
    </div>
  );
}

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthForm title="Log In" />} />
      <Route path="/register" element={<AuthForm title="Sign Up" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
