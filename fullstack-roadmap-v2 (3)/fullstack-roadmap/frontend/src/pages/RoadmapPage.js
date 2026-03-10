import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProgress, toggleTask } from '../api/client';
import { DATA, TOTAL_TASKS, getRank } from '../data';
import { useAuth } from '../hooks/useAuth';

const C = {
  pageBg: '#060608', sidebarBg: '#060608', midBg: '#07070A',
  border: '#111115', trackHdr: '#333', activePhBg: '#0E0E12', activeTopBg: '#0F0F14',
  topicHover: '#111115', txt: '#D4D4D8', txtDim: '#888', txtDimmer: '#555',
  txtFaint: '#444', txtFaintest: '#333', barBg: '#111', titleClr: '#F0F0F0',
  checkedBg: '#0C1A0E', checkedBdr: '#1A3A1E', uncheckedBg: '#0C0C10',
  uncheckedBdr: '#111115', checkBox: '#2A2A35', checkDone: '#22C55E',
  checkedTxt: '#4ADE80', resLinkBg: '#0C0C10', resLinkBdr: '#111115',
  projBg: '#0D0C00', scrollThumb: '#2a2a35'
};

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 22, right: 22, zIndex: 9999,
      background: '#0a140c', border: '1px solid #22c55e55',
      borderRadius: 6, padding: '9px 16px', color: '#4ade80',
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
      boxShadow: '0 4px 20px #22c55e22', animation: 'fadeUp .25s ease'
    }}>{msg}</div>
  );
}

function GameBar({ completedKeys }) {
  const overallDone = completedKeys.size;
  const overallPct = TOTAL_TASKS ? overallDone / TOTAL_TASKS : 0;
  const rank = getRank(overallPct);
  const xp = overallDone * 50;
  const level = 1 + Math.floor(xp / 200);
  const lvlPct = ((xp % 200) / 200) * 100;
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
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, background: '#07070a', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: `${rank.color}18`, border: `1.5px solid ${rank.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: rank.color, boxShadow: `0 0 10px ${rank.color}33` }}>{rank.badge}</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: rank.color, letterSpacing: 1 }}>{rank.label.toUpperCase()}</div>
          <div style={{ fontSize: 9, color: C.txtDimmer, letterSpacing: 1 }}>RANK</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <div><div style={{ fontSize: 15, fontWeight: 900, color: C.txt, lineHeight: 1 }}>Lv.{level}</div><div style={{ fontSize: 9, color: C.txtDimmer, letterSpacing: 1 }}>LEVEL</div></div>
        <div>
          <div style={{ fontSize: 9, color: C.txtDimmer, marginBottom: 3 }}>{xp % 200}/200</div>
          <div style={{ width: 56, height: 4, background: C.barBg, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${lvlPct}%`, height: '100%', background: rank.color, transition: 'width .35s', borderRadius: 2 }} />
          </div>
        </div>
      </div>
      <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
        {phaseStats.map(ph => (
          <div key={ph.id} title={`${ph.title} — ${ph.pct}%`} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12, lineHeight: 1 }}>{ph.icon}</span>
            <div style={{ width: 48, height: 3, background: '#1a1a22', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${ph.pct}%`, height: '100%', background: ph.color, transition: 'width .35s', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, minWidth: 22, color: ph.pct > 0 ? ph.color : C.txtDimmer }}>{ph.pct}%</span>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: C.txt, fontWeight: 700 }}>
          <span style={{ color: '#A78BFA' }}>{overallDone}</span>
          <span style={{ color: C.txtDimmer }}>/{TOTAL_TASKS}</span>
        </div>
        <div style={{ fontSize: 9, color: C.txtDimmer, letterSpacing: 1 }}>{Math.round(overallPct * 100)}% DONE</div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [completedKeys, setCompletedKeys] = useState(new Set());
  const [activePhase, setActivePhase] = useState(1);
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [toast, setToast] = useState(null);
  const [toggling, setToggling] = useState(new Set());
  const { auth, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProgress().then(p => {
      setCompletedKeys(new Set(p.completedKeys || []));
      if (location.state?.phase) setActivePhase(location.state.phase);
    });
  }, []);

  const handleToggle = async (phaseId, trackName, topicName, idx) => {
    const key = `${phaseId}__${trackName}__${topicName}__${idx}`;
    if (toggling.has(key)) return;
    setToggling(prev => new Set([...prev, key]));
    const wasChecked = completedKeys.has(key);
    setCompletedKeys(prev => {
      const next = new Set(prev);
      if (wasChecked) next.delete(key); else next.add(key);
      return next;
    });
    try {
      const res = await toggleTask(key);
      if (!wasChecked) setToast(`+50 XP · ${res.totalTasksDone} tasks done`);
    } catch {
      setCompletedKeys(prev => {
        const next = new Set(prev);
        if (wasChecked) next.add(key); else next.delete(key);
        return next;
      });
    } finally {
      setToggling(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  };

  const getTopicProg = (phaseId, trackName, topicName, checklist) => {
    const done = checklist.filter((_, i) => completedKeys.has(`${phaseId}__${trackName}__${topicName}__${i}`)).length;
    return { done, total: checklist.length, pct: Math.round((done / checklist.length) * 100) };
  };

  const getPhaseProg = (ph) => {
    let done = 0, total = 0;
    ph.tracks.forEach(tr => tr.topics.forEach(tp => tp.checklist.forEach((_, i) => {
      total++;
      if (completedKeys.has(`${ph.id}__${tr.name}__${tp.name}__${i}`)) done++;
    })));
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const phase = DATA.find(p => p.id === activePhase);
  const track = phase?.tracks.find(t => t.name === activeTrack);
  const topic = track?.topics.find(t => t.name === activeTopic);
  const overallDone = completedKeys.size;
  const overallPct = Math.round((overallDone / TOTAL_TASKS) * 100);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", background: C.pageBg, minHeight: '100vh', color: C.txt }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 2px; }
        button { font-family: inherit; cursor: pointer; border: none; }
        .topic-btn:hover { background: ${C.topicHover} !important; }
        .res-link:hover { opacity: .8; }
        .phase-btn:hover { filter: brightness(1.06); }
        .check-row:hover { filter: brightness(1.05); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      {toast && <Toast msg={`✦ ${toast}`} onDone={() => setToast(null)} />}

      {/* Top Bar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '18px 24px', background: C.pageBg, position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: C.titleClr, letterSpacing: -0.5 }}>Full Stack Roadmap</div>
          <div style={{ fontSize: 10, color: C.txtFaint, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Java · Spring Boot · React · Design Patterns</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: C.txtDimmer, letterSpacing: 1 }}>OVERALL</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: overallPct > 0 ? '#A78BFA' : C.txtFaint }}>
              {overallPct}% <span style={{ fontSize: 10, color: C.txtFaint }}>({overallDone}/{TOTAL_TASKS})</span>
            </div>
          </div>
          <div style={{ width: 80, height: 6, background: C.barBg, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${overallPct}%`, height: '100%', background: 'linear-gradient(90deg,#8B5CF6,#38BDF8)', transition: 'width .3s', borderRadius: 3 }} />
          </div>
          <button onClick={() => nav('/dashboard')} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 5, color: C.txtDimmer, padding: '5px 10px', fontSize: 11 }}>Dashboard</button>
          <button onClick={logout} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 5, color: C.txtFaint, padding: '5px 10px', fontSize: 10 }}>Logout</button>
        </div>
      </div>

      <GameBar completedKeys={completedKeys} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Left Sidebar */}
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, background: C.sidebarBg, flexShrink: 0, padding: '16px 0' }}>
          {DATA.map(ph => {
            const pp = getPhaseProg(ph);
            const active = activePhase === ph.id;
            return (
              <button key={ph.id} className="phase-btn" onClick={() => { setActivePhase(ph.id); setActiveTrack(null); setActiveTopic(null); }}
                style={{ width: '100%', padding: '14px 20px', textAlign: 'left', background: active ? C.activePhBg : 'transparent', borderLeft: `3px solid ${active ? ph.color : 'transparent'}`, borderTop: 'none', borderRight: 'none', borderBottom: `1px solid ${C.border}`, transition: 'all .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{ph.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: active ? ph.color : C.txtDimmer, letterSpacing: 1.5, textTransform: 'uppercase' }}>Phase {ph.id}</span>
                </div>
                <div style={{ fontSize: 11, color: active ? C.txt : C.txtDim, marginBottom: 8, fontWeight: active ? 700 : 400 }}>{ph.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: C.barBg, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pp.pct}%`, height: '100%', background: ph.color, transition: 'width .3s', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 9, color: pp.pct > 0 ? ph.color : C.txtFaintest, fontWeight: 700 }}>{pp.pct}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle */}
        <div style={{ width: 240, borderRight: `1px solid ${C.border}`, background: C.midBg, flexShrink: 0, padding: '16px 0', overflowY: 'auto' }}>
          {phase && (
            <>
              <div style={{ padding: '0 16px 16px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 16, color: C.titleClr, marginBottom: 4 }}>{phase.title}</div>
                <div style={{ fontSize: 10, color: C.txtFaint, letterSpacing: 1 }}>{phase.duration}</div>
              </div>
              {phase.tracks.map(tr => (
                <div key={tr.name}>
                  <div style={{ padding: '12px 16px 6px', fontSize: 9, color: C.trackHdr, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{tr.name}</div>
                  {tr.topics.map(tp => {
                    const tprog = getTopicProg(phase.id, tr.name, tp.name, tp.checklist);
                    const isActive = activeTrack === tr.name && activeTopic === tp.name;
                    return (
                      <button key={tp.name} className="topic-btn" onClick={() => { setActiveTrack(tr.name); setActiveTopic(tp.name); }}
                        style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: isActive ? C.activeTopBg : 'transparent', borderLeft: `2px solid ${isActive ? phase.color : 'transparent'}`, borderTop: 'none', borderRight: 'none', borderBottom: 'none', transition: 'all .1s' }}>
                        <div style={{ fontSize: 11, color: isActive ? C.txt : C.txtDim, marginBottom: 5, fontWeight: isActive ? 600 : 400, lineHeight: 1.3 }}>{tp.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, height: 2, background: C.barBg, borderRadius: 1, overflow: 'hidden' }}>
                            <div style={{ width: `${tprog.pct}%`, height: '100%', background: tprog.pct === 100 ? '#22C55E' : phase.color, transition: 'width .2s', borderRadius: 1 }} />
                          </div>
                          <span style={{ fontSize: 9, color: tprog.pct === 100 ? '#22C55E' : tprog.pct > 0 ? phase.color : C.txtFaintest, minWidth: 24, textAlign: 'right' }}>
                            {tprog.done}/{tprog.total}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Detail */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: C.midBg }}>
          {!topic ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, opacity: .3 }}>
              <div style={{ fontSize: 48 }}>{phase?.icon}</div>
              <div style={{ fontSize: 14, color: C.txtDim, textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>Select a topic from the list to see the checklist and learning resources</div>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: phase.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{activeTrack}</div>
                  <span style={{ color: C.border }}>›</span>
                  <div style={{ fontSize: 10, color: C.txtDimmer, letterSpacing: 2, textTransform: 'uppercase' }}>{activeTopic}</div>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 26, color: C.titleClr, marginBottom: 8, letterSpacing: -0.5 }}>{topic.name}</h2>
                <p style={{ fontSize: 12, color: C.txtDim, lineHeight: 1.7 }}>{topic.detail}</p>
              </div>

              {/* Checklist */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.txtFaint, letterSpacing: 3, textTransform: 'uppercase' }}>✓ Skills Checklist</div>
                  {(() => {
                    const tp = getTopicProg(phase.id, activeTrack, activeTopic, topic.checklist);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: C.barBg, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${tp.pct}%`, height: '100%', background: tp.pct === 100 ? '#22C55E' : phase.color, transition: 'width .2s', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: tp.pct === 100 ? '#22C55E' : phase.color, fontWeight: 700 }}>{tp.pct}%</span>
                      </div>
                    );
                  })()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topic.checklist.map((item, idx) => {
                    const key = `${phase.id}__${activeTrack}__${activeTopic}__${idx}`;
                    const checked = completedKeys.has(key);
                    const busy = toggling.has(key);
                    return (
                      <div key={idx} className="check-row" onClick={() => handleToggle(phase.id, activeTrack, activeTopic, idx)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: checked ? C.checkedBg : C.uncheckedBg, border: `1px solid ${checked ? C.checkedBdr : C.uncheckedBdr}`, cursor: busy ? 'wait' : 'pointer', transition: 'all .15s', borderRadius: 2, opacity: busy ? 0.6 : 1 }}>
                        <div style={{ width: 18, height: 18, border: `1.5px solid ${checked ? C.checkDone : C.checkBox}`, borderRadius: 3, flexShrink: 0, marginTop: 1, background: checked ? C.checkDone : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                          {checked && <span style={{ fontSize: 10, color: '#000', fontWeight: 900 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 12, color: checked ? C.checkedTxt : C.txt, lineHeight: 1.6, textDecoration: checked ? 'line-through' : 'none', textDecorationColor: '#2A4A2E' }}>{item}</span>
                        {!checked && <span style={{ marginLeft: 'auto', fontSize: 9, color: '#8B5CF666', flexShrink: 0, marginTop: 3 }}>+50 XP</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div style={{ fontSize: 10, color: C.txtFaint, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>📚 Best Learning Resources</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topic.resources.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="res-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: C.resLinkBg, border: `1px solid ${C.resLinkBdr}`, textDecoration: 'none', color: C.txtDim, fontSize: 12, transition: 'opacity .15s', borderRadius: 2 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>
                        {res.label.includes('YouTube') ? '▶' : res.label.includes('Book') ? '📖' : '🔗'}
                      </span>
                      <span style={{ flex: 1, color: C.txt }}>{res.label}</span>
                      <span style={{ fontSize: 10, color: C.txtFaintest }}>→</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Phase project */}
              {topic === track?.topics[track.topics.length - 1] && track === phase?.tracks[phase.tracks.length - 1] && (
                <div style={{ marginTop: 32, padding: '16px 20px', background: C.projBg, border: `1px solid ${phase.color}33`, borderLeft: `3px solid ${phase.color}`, borderRadius: 2 }}>
                  <div style={{ fontSize: 9, color: phase.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>🔨 Phase {phase.id} Project</div>
                  <div style={{ fontSize: 12, color: C.txtDim, lineHeight: 1.7 }}>{phase.project}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
