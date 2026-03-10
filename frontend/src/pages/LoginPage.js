import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const S = {
  page: {
    minHeight: '100vh', background: '#060608', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", position: 'relative', overflow: 'hidden'
  },
  bg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #8B5CF622 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, #10B98118 0%, transparent 60%)'
  },
  card: {
    width: 400, background: '#0C0C10', border: '1px solid #1a1a24',
    borderRadius: 4, padding: '40px', position: 'relative', zIndex: 1
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 28,
    color: '#F0F0F0', marginBottom: 4, letterSpacing: -0.5
  },
  sub: { fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 },
  tabs: { display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid #1a1a24' },
  tab: (active) => ({
    flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
    borderBottom: `2px solid ${active ? '#8B5CF6' : 'transparent'}`,
    color: active ? '#A78BFA' : '#555', fontSize: 11, letterSpacing: 2,
    textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
    transition: 'all .2s', marginBottom: -1
  }),
  label: { fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, display: 'block' },
  input: {
    width: '100%', background: '#0a0a0e', border: '1px solid #1a1a24', borderRadius: 3,
    padding: '12px 14px', color: '#D4D4D8', fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
    outline: 'none', boxSizing: 'border-box', marginBottom: 16, transition: 'border-color .15s'
  },
  btn: (loading) => ({
    width: '100%', padding: '14px', background: loading ? '#333' : '#8B5CF6',
    border: 'none', borderRadius: 3, color: '#fff', fontSize: 12, fontWeight: 700,
    letterSpacing: 2, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: "'JetBrains Mono', monospace", transition: 'all .2s', marginTop: 8
  }),
  error: { fontSize: 11, color: '#EF4444', marginBottom: 12, padding: '10px 14px', background: '#EF444415', borderRadius: 3, border: '1px solid #EF444430' }
};

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      let data;
      if (tab === 'login') {
        data = await apiLogin(username, password);
      } else {
        data = await apiRegister(username, password, displayName || username);
      }
      login(data);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <div style={S.card}>
        <div style={S.title}>Full Stack Roadmap</div>
        <div style={S.sub}>Java · Spring Boot · React</div>
        <div style={S.tabs}>
          <button style={S.tab(tab === 'login')} onClick={() => { setTab('login'); setError(''); }}>Login</button>
          <button style={S.tab(tab === 'register')} onClick={() => { setTab('register'); setError(''); }}>Register</button>
        </div>
        {error && <div style={S.error}>{error}</div>}
        <form onSubmit={handle}>
          {tab === 'register' && (
            <div>
              <label style={S.label}>Display Name</label>
              <input style={S.input} value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="How should we call you?" />
            </div>
          )}
          <div>
            <label style={S.label}>Username</label>
            <input style={S.input} value={username} onChange={e => setUsername(e.target.value)}
              placeholder="username" required autoFocus />
          </div>
          <div>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          <button type="submit" style={S.btn(loading)} disabled={loading}>
            {loading ? '...' : tab === 'login' ? '→ Enter' : '→ Create Account'}
          </button>
        </form>
        {tab === 'register' && (
          <div style={{ marginTop: 16, fontSize: 10, color: '#444', textAlign: 'center' }}>
            Progress is saved to your account · XP system · streaks
          </div>
        )}
      </div>
    </div>
  );
}
