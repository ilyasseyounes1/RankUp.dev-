import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress, getActivity } from '../api/client';
import { DATA, TOTAL_TASKS, getRank, RANKS } from '../data';
import { useAuth } from '../hooks/useAuth';

const C = {
  pageBg: '#060608', sidebarBg: '#060608', border: '#111115',
  txt: '#D4D4D8', txtDim: '#888', txtFaint: '#444', barBg: '#111', titleClr: '#F0F0F0'
};

function StatCard({ icon, value, label, color, sub }) {
  return (
    <div style={{
      background: '#0C0C10', border: `1px solid #1a1a24`, borderRadius: 4,
      padding: '20px', flex: 1, minWidth: 0,
      borderLeft: `3px solid ${color || '#333'}`
    }}>
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: color || C.titleClr, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 2, fontWeight: 700 }}>{sub}</div>}
      <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ActivityHeatmap({ data }) {
  const max = Math.max(...data.map(d => d.tasks), 1);
  const getColor = (tasks) => {
    if (tasks === 0) return '#0e0e12';
    const intensity = tasks / max;
    if (intensity < 0.33) return '#1a3a2a';
    if (intensity < 0.66) return '#166534';
    return '#22c55e';
  };
  const days = ['S','M','T','W','T','F','S'];
  // pad to start on correct day
  const firstDate = data.length > 0 ? new Date(data[0].date) : new Date();
  const startDow = firstDate.getDay();
  const padded = Array(startDow).fill(null).concat(data);
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i+7));

  return (
    <div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
        {days.map((d, i) => <div key={i} style={{ width: 14, fontSize: 8, color: C.txtFaint, textAlign: 'center' }}>{d}</div>)}
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array(7).fill(null).map((_, di) => {
              const cell = week[di];
              return (
                <div key={di} title={cell ? `${cell.date}: ${cell.tasks} tasks` : ''}
                  style={{
                    width: 14, height: 14, borderRadius: 2,
                    background: cell ? getColor(cell.tasks) : 'transparent',
                    border: cell ? '1px solid #1a1a24' : 'none',
                    cursor: cell && cell.tasks > 0 ? 'help' : 'default'
                  }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 9, color: C.txtFaint }}>Less</span>
        {['#0e0e12','#1a3a2a','#166534','#22c55e'].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: 2, border: '1px solid #1a1a24' }} />
        ))}
        <span style={{ fontSize: 9, color: C.txtFaint }}>More</span>
      </div>
    </div>
  );
}

function PhaseRadar({ phaseStats }) {
  const size = 220;
  const cx = size / 2, cy = size / 2, r = 80;
  const n = phaseStats.length;
  const points = phaseStats.map((p, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const pct = p.pct / 100;
    return { x: cx + r * pct * Math.cos(angle), y: cy + r * pct * Math.sin(angle), label: p.icon, color: p.color, pct: p.pct, angle };
  });
  const gridPoints = (f) => phaseStats.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return `${cx + r * f * Math.cos(angle)},${cy + r * f * Math.sin(angle)}`;
  }).join(' ');
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={gridPoints(f)} fill="none" stroke="#1a1a24" strokeWidth={1} />
      ))}
      {phaseStats.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#1a1a24" strokeWidth={1} />;
      })}
      <polygon points={polyPoints} fill="#8B5CF620" stroke="#8B5CF6" strokeWidth={1.5} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.color} />
          <text x={cx + (r + 20) * Math.cos(p.angle)} y={cy + (r + 20) * Math.sin(p.angle)}
            textAnchor="middle" dominantBaseline="middle" fontSize={16}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const [progress, setProgress] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    Promise.all([getProgress(), getActivity()]).then(([prog, act]) => {
      setProgress(prog);
      setActivityData(act.activity || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", color: C.txtDim }}>
      Loading...
    </div>
  );

  const completedKeys = new Set(progress?.completedKeys || []);
  const totalDone = completedKeys.size;
  const overallPct = totalDone / TOTAL_TASKS;
  const rank = getRank(overallPct);
  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  const streak = progress?.streak || 0;
  const xpToNext = 200 - (xp % 200);
  const levelPct = ((xp % 200) / 200) * 100;

  const phaseStats = DATA.map(ph => {
    let done = 0, total = 0;
    ph.tracks.forEach(tr => tr.topics.forEach(tp => {
      tp.checklist.forEach((_, i) => {
        total++;
        if (completedKeys.has(`${ph.id}__${tr.name}__${tp.name}__${i}`)) done++;
      });
    }));
    return { ...ph, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  });

  const masteredPhases = phaseStats.filter(p => p.pct === 100).length;
  const nextRankIdx = RANKS.findIndex(r => r.label === rank.label);
  const nextRank = RANKS[nextRankIdx + 1];
  const nextRankPct = nextRank ? Math.round(nextRank.min * 100) : 100;

  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, fontFamily: "'JetBrains Mono', monospace", color: C.txt }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a2a35; border-radius: 2px; }
      `}</style>

      {/* Top Nav */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, background: '#07070a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: C.titleClr }}>Full Stack Roadmap</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => nav('/roadmap')} style={{ background: 'transparent', border: `1px solid #1a1a24`, borderRadius: 3, color: C.txtDim, padding: '7px 16px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>
            📋 Roadmap
          </button>
          <div style={{ fontSize: 11, color: C.txtDim }}>{auth?.displayName}</div>
          <button onClick={logout} style={{ background: 'transparent', border: `1px solid #1a1a24`, borderRadius: 3, color: C.txtFaint, padding: '6px 12px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '28px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'stretch' }}>
          {/* Profile block */}
          <div style={{ background: '#0C0C10', border: '1px solid #1a1a24', borderRadius: 4, padding: '24px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 8,
                background: `${rank.color}18`, border: `2px solid ${rank.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: rank.color,
                boxShadow: `0 0 20px ${rank.color}33`
              }}>{rank.badge}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.titleClr }}>{auth?.displayName}</div>
                <div style={{ fontSize: 10, color: rank.color, letterSpacing: 2, fontWeight: 700 }}>{rank.label.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: C.txtFaint, marginTop: 2 }}>Level {level}</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2 }}>LEVEL PROGRESS</span>
                <span style={{ fontSize: 9, color: rank.color }}>{xp % 200}/200 XP</span>
              </div>
              <div style={{ height: 6, background: '#111', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${levelPct}%`, height: '100%', background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`, borderRadius: 3, transition: 'width .3s' }} />
              </div>
              <div style={{ fontSize: 9, color: C.txtFaint, marginTop: 4 }}>{xpToNext} XP to Level {level + 1}</div>
            </div>
            {nextRank && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2 }}>NEXT RANK</span>
                  <span style={{ fontSize: 9, color: nextRank.color }}>{nextRank.label} at {nextRankPct}%</span>
                </div>
                <div style={{ height: 4, background: '#111', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round(overallPct * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${rank.color}, ${nextRank.color})`, borderRadius: 2 }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {RANKS.map(r => (
                <div key={r.badge} title={r.label} style={{
                  flex: 1, padding: '6px 0', textAlign: 'center', borderRadius: 3,
                  background: r.label === rank.label ? `${r.color}20` : '#0a0a0e',
                  border: `1px solid ${r.label === rank.label ? r.color : '#1a1a24'}`,
                  fontSize: 10, fontWeight: 800, color: r.label === rank.label ? r.color : '#333'
                }}>{r.badge}</div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ flex: 1, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatCard icon="✓" value={totalDone} label="Tasks Completed" color="#22C55E" sub={`of ${TOTAL_TASKS} total`} />
            <StatCard icon="🔥" value={streak} label="Day Streak" color="#F59E0B" sub={streak > 0 ? 'Keep going!' : 'Start today'} />
            <StatCard icon="⚡" value={xp} label="Total XP" color="#8B5CF6" sub={`Level ${level}`} />
            <StatCard icon="🏆" value={masteredPhases} label="Phases Mastered" color="#38BDF8" sub={`of ${DATA.length} phases`} />
            <StatCard icon="📈" value={`${Math.round(overallPct * 100)}%`} label="Overall Progress" color={rank.color} sub={rank.label} />
          </div>
        </div>

        {/* Middle row: Radar + Activity */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          {/* Skill Radar */}
          <div style={{ background: '#0C0C10', border: '1px solid #1a1a24', borderRadius: 4, padding: '24px', flex: '0 0 auto' }}>
            <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Skill Map</div>
            <PhaseRadar phaseStats={phaseStats} />
          </div>

          {/* Activity Heatmap */}
          <div style={{ background: '#0C0C10', border: '1px solid #1a1a24', borderRadius: 4, padding: '24px', flex: 1 }}>
            <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              Activity — Last 30 Days
            </div>
            {activityData.length > 0 ? <ActivityHeatmap data={activityData} /> : (
              <div style={{ color: C.txtFaint, fontSize: 11 }}>No activity yet — start completing tasks!</div>
            )}
            <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#22C55E' }}>{streak}</div>
                <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2 }}>CURRENT STREAK</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#38BDF8' }}>
                  {activityData.reduce((s, d) => s + d.tasks, 0)}
                </div>
                <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2 }}>TASKS THIS MONTH</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#F59E0B' }}>
                  {activityData.filter(d => d.tasks > 0).length}
                </div>
                <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 2 }}>ACTIVE DAYS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase breakdown */}
        <div style={{ background: '#0C0C10', border: '1px solid #1a1a24', borderRadius: 4, padding: '24px' }}>
          <div style={{ fontSize: 9, color: C.txtFaint, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Phase Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
            {phaseStats.map(ph => (
              <div key={ph.id} style={{
                padding: '16px', background: '#07070a', border: `1px solid #1a1a24`,
                borderLeft: `3px solid ${ph.color}`, borderRadius: 3,
                cursor: 'pointer'
              }} onClick={() => nav('/roadmap', { state: { phase: ph.id } })}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{ph.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.titleClr }}>{ph.title}</div>
                    <div style={{ fontSize: 9, color: C.txtFaint }}>{ph.subtitle}</div>
                  </div>
                  <div style={{
                    background: ph.pct === 100 ? '#22C55E20' : `${ph.color}18`,
                    border: `1px solid ${ph.pct === 100 ? '#22C55E' : ph.color}`,
                    borderRadius: 3, padding: '3px 8px',
                    fontSize: 11, fontWeight: 800,
                    color: ph.pct === 100 ? '#22C55E' : ph.color
                  }}>{ph.pct}%</div>
                </div>
                <div style={{ height: 4, background: '#111', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${ph.pct}%`, height: '100%', background: ph.pct === 100 ? '#22C55E' : ph.color, borderRadius: 2, transition: 'width .3s' }} />
                </div>
                <div style={{ fontSize: 9, color: C.txtFaint }}>
                  {ph.done}/{ph.total} tasks · {ph.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
