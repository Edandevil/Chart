import React, { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2';
import { 
  LayoutDashboard, Table as TableIcon, PieChart as PieIcon, TrendingUp, 
  Settings, Download, RefreshCw, Pin, X, ChevronDown, 
  Search, Bell, User, BarChart2, AlertCircle, CheckCircle2, ArrowRight,
  Palette as PaletteIcon, Plus, Trash2, Edit3, Save, Check, MousePointer2
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Predefined Palettes ---
const INITIAL_PALETTES = [
  { id: 'p1', name: 'Pro Blue', colors: ['#1e3a8a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'] },
  { id: 'p2', name: 'Vibrant Mix', colors: ['#991b1b', '#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777', '#ea580c'] },
  { id: 'p3', name: 'Warm Earth', colors: ['#78350f', '#9a3412', '#ea580c', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7'] },
  { id: 'p4', name: 'Cool Forest', colors: ['#064e3b', '#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] },
  { id: 'p5', name: 'Berry Flush', colors: ['#831843', '#be185d', '#db2777', '#f472b6', '#fbcfe8', '#fce7f3', '#fff1f2'] },
];

// --- Mock Data ---
const campaignData = [
  { name: 'Shopping', spend: 888.93, conv: 42.9, roas: 45.0, cpa: 20.71, type: 'SHOPPING', impr: '181,520', clicks: '3,362', won: 41, budget: 15, rank: 44 },
  { name: 'Search Local', spend: 874.22, conv: 39.4, roas: 37.8, cpa: 22.21, type: 'SEARCH', impr: '4,186', clicks: '493', won: 10, budget: 18, rank: 72 },
  { name: 'Core Terms', spend: 835.27, conv: 98.0, roas: 18.3, cpa: 8.52, type: 'SEARCH', impr: '5,019', clicks: '496', won: 14, budget: 27, rank: 59 },
  { name: 'PMax', spend: 301.07, conv: 117.0, roas: 0.4, cpa: 2.57, type: 'PMAX', impr: '40,100', clicks: '339', won: 23, budget: 4, rank: 73 },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  date: `3/${i + 22}`,
  spend: Math.floor(Math.random() * 80) + 60,
  conv: Math.floor(Math.random() * 12) + 5,
  roas: (Math.random() * 25 + 5).toFixed(1)
}));

const heatmapData = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 15)));

// --- Sub-components ---

const ThemeSwitcher = ({ palettes, setPalettes, activePalette, setActivePalette }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = () => {
    const newPalette = {
      id: Date.now().toString(),
      name: 'New Theme',
      colors: ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc']
    };
    setPalettes([...palettes, newPalette]);
    setEditingId(newPalette.id);
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    if (palettes.length <= 1) return;
    const filtered = palettes.filter(p => p.id !== id);
    setPalettes(filtered);
    if (activePalette.id === id) setActivePalette(filtered[0]);
  };

  const handleColorChange = (id, colorIndex, newColor) => {
    const updated = palettes.map(p => {
      if (p.id === id) {
        const newColors = [...p.colors];
        newColors[colorIndex] = newColor;
        return { ...p, colors: newColors };
      }
      return p;
    });
    setPalettes(updated);
    if (activePalette.id === id) setActivePalette(updated.find(p => p.id === id));
  };

  const handleNameChange = (id, newName) => {
    const updated = palettes.map(p => p.id === id ? { ...p, name: newName } : p);
    setPalettes(updated);
  };

  return (
    <div className="theme-switcher" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className="theme-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      >
        <PaletteIcon size={18} color={activePalette.colors[0]} /> Change Theme <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '350px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', zIndex: 1000, padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dashboard Themes</span>
            <button onClick={handleAdd} style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add New
            </button>
          </div>

          <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
            {palettes.map(p => (
              <div key={p.id} style={{ marginBottom: '8px', padding: '8px', borderRadius: '8px', background: activePalette.id === p.id ? '#f9fafb' : 'transparent', border: activePalette.id === p.id ? '1px solid #e5e7eb' : '1px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: editingId === p.id ? '10px' : '0' }}>
                  <div 
                    onClick={() => setActivePalette(p)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {p.colors.map((c, i) => (
                        <div key={i} style={{ width: '10px', height: '10px', background: c, borderRadius: '2px' }} />
                      ))}
                    </div>
                    {editingId === p.id ? (
                      <input 
                        type="text" 
                        value={p.name} 
                        onChange={(e) => handleNameChange(p.id, e.target.value)}
                        style={{ width: '120px', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 4px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.85rem', fontWeight: activePalette.id === p.id ? 700 : 500 }}>{p.name}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => setEditingId(editingId === p.id ? null : p.id)} style={{ border: 'none', background: 'none', padding: '4px', cursor: 'pointer', color: '#6b7280' }}>
                      {editingId === p.id ? <Check size={14} color="#10b981" /> : <Edit3 size={14} />}
                    </button>
                    <button onClick={(e) => handleRemove(p.id, e)} style={{ border: 'none', background: 'none', padding: '4px', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {editingId === p.id && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                    {p.colors.map((c, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <input 
                          type="color" 
                          value={c} 
                          onChange={(e) => handleColorChange(p.id, i, e.target.value)}
                          style={{ width: '30px', height: '30px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreCard = ({ label, value, color, subtext }) => (
  <div className="section-panel" style={{ padding: '1.25rem', minWidth: 0 }}>
    <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px' }}>{label}</h5>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{value}</div>
    <div className="progress-bar" style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px', marginBottom: '8px' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '2px' }}></div>
    </div>
    <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>{subtext}</div>
  </div>
);

const Heatmap = ({ data, palette }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getColor = (val) => {
    const opacity = Math.min(val / 15, 1);
    return `${palette.colors[0]}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(24, 1fr)', gap: '2px' }}>
        <div />
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{ fontSize: '0.6rem', color: '#9ca3af', textAlign: 'center' }}>
            {i % 3 === 0 ? i.toString().padStart(2, '0') : ''}
          </div>
        ))}
        {days.map((day, di) => (
          <React.Fragment key={day}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#4b5563', alignSelf: 'center' }}>{day}</div>
            {data[di].map((val, hi) => (
              <div 
                key={hi} 
                title={`${day} ${hi}:00 - ${val} conv`}
                style={{ height: '20px', background: val > 0 ? getColor(val) : '#f3f4f6', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: val > 8 ? 'white' : '#1f2937' }}
              >
                {val > 10 ? val : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>Low</span>
        <div style={{ height: '8px', width: '100px', background: `linear-gradient(to right, #f3f4f6, ${palette.colors[0]})`, borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>High</span>
      </div>
    </div>
  );
};

const DashboardOverview = ({ palette }) => {
  const colors = palette.colors;

  return (
    <div className="container" style={{ minWidth: 0 }}>
      {/* Banner */}
      <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, borderRadius: '16px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Google Ads Account Audit <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>DEMO</span></h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Account: <b>XXXX</b> • Vertical: <b>Furniture Retail (Local)</b> • Window: <b>Last 30 days</b></div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '5px' }}>Spend: <b>$3,052</b> • Conv: <b>299</b> • ROAS: <b>30.5x</b></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', border: `4px solid ${colors[2]}`, width: '110px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>70</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700 }}>HEALTH</div>
          </div>
          <div style={{ fontSize: '0.7rem' }}>
            <div style={{ color: '#ef4444' }}>● 3 Critical</div>
            <div style={{ color: '#f59e0b' }}>● 4 High</div>
            <div style={{ color: '#fbbf24' }}>● 3 Medium</div>
            <div style={{ color: '#10b981' }}>● 2 Strengths</div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', minWidth: 0 }}>
        {['Recoverable wasted spend', 'Unrealized volume', 'Auction competitiveness'].map((t, i) => (
          <div key={i} className="section-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: i === 0 ? '#fee2e2' : i === 1 ? '#fef3c7' : '#dbeafe', color: i === 0 ? '#991b1b' : i === 1 ? '#92400e' : '#1e40af' }}>{['IMMEDIATE', 'NEAR-TERM', 'STRATEGIC'][i]}</span>
            <h3 style={{ fontSize: '0.9rem', margin: '10px 0 5px' }}>{t}</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>{['Non-converting terms to negate.', 'Budget-capped campaigns losing 18-27% IS.', '59-73% IS lost to rank.'][i]}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: colors[0] }}>{['~$181 / mo', '~$420 / mo', '2x reach'][i]}</div>
          </div>
        ))}
      </div>

      {/* Audit Overview */}
      <div className="section-panel">
        <div className="section-header"><h2>Audit Overview</h2> <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px' }}>Overall • Needs Improvement</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>HEALTH RADAR — 8 DIMENSIONS</h4>
            <div style={{ height: 260 }}><Radar data={{ labels: ['Impr. Share', 'Keyword', 'QS', 'Waste', 'Device', 'Schedule', 'Tracking', 'Opt.'], datasets: [{ label: 'Current', data: [60, 55, 50, 40, 70, 65, 75, 45], backgroundColor: `${colors[0]}33`, borderColor: colors[0], borderWidth: 2 }, { label: 'Target', data: [80, 70, 65, 60, 85, 75, 90, 55], backgroundColor: `${colors[1]}11`, borderColor: colors[1], borderWidth: 2, borderDash: [5, 5] }] }} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, pointLabels: { font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>FINDINGS BY SEVERITY</h4>
            <div style={{ height: 220, marginTop: '20px' }}><Doughnut data={{ labels: ['Critical', 'High', 'Medium', 'Strength'], datasets: [{ data: [3, 4, 3, 2], backgroundColor: ['#991b1b', '#d97706', '#fbbf24', '#059669'], borderWidth: 0, cutout: '70%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CATEGORY SCORE VS TARGET</h4>
            <div style={{ height: 260 }}><Bar data={{ labels: ['IS', 'Key', 'QS', 'Waste', 'Device', 'Sched', 'Track', 'Opt'], datasets: [{ data: [55, 62, 64, 71, 73, 75, 85, 98], backgroundColor: colors.concat(colors), borderRadius: 4 }] }} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { max: 100 } } }} /></div>
          </div>
        </div>
      </div>

      {/* Impression Share Diagnosis */}
      <div className="section-panel">
        <div className="section-header"><h2>Impression Share Diagnosis</h2> <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px' }}>High rank loss</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '20px' }}>Stacked: won / lost-to-budget / lost-to-rank</h4>
            {campaignData.map((c, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                  <b>XXXX · {c.name}</b>
                  <b style={{ color: '#111827' }}>{c.won}%</b>
                </div>
                <div style={{ height: '24px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.won}%`, background: '#059669' }} title="Won"></div>
                  <div style={{ width: `${c.budget}%`, background: '#f59e0b' }} title="Lost to Budget"></div>
                  <div style={{ width: `${c.rank}%`, background: '#ef4444' }} title="Lost to Rank"></div>
                  <div style={{ flex: 1, background: '#f3f4f6' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>IS COMPOSITION RADAR</h4>
            <div style={{ height: 280 }}><Radar data={{ labels: campaignData.map(c => c.name), datasets: [{ label: 'Won', data: campaignData.map(c => c.won), borderColor: '#059669', backgroundColor: 'transparent' }, { label: 'Lost-Budget', data: campaignData.map(c => c.budget), borderColor: '#f59e0b', backgroundColor: 'transparent' }, { label: 'Lost-Rank', data: campaignData.map(c => c.rank), borderColor: '#ef4444', backgroundColor: 'transparent' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
        </div>
      </div>

      {/* Keyword Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Keyword Analytics</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>QUALITY SCORE DISTRIBUTION</h4>
            <div style={{ height: 220 }}><Bar data={{ labels: [1,2,3,4,5,6,7,8,9,10], datasets: [{ data: [0,0,300,0,450,1420,550,180,170,750], backgroundColor: '#d97706', borderRadius: 4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '10px' }}>Weighted avg: <b style={{ color: '#92400e' }}>5.4</b> • Below target of 7.</div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>MATCH TYPE MIX (SPEND-WEIGHTED)</h4>
            <div style={{ height: 220 }}><Doughnut data={{ labels: ['Phrase', 'Broad', 'Exact'], datasets: [{ data: [45, 50, 5], backgroundColor: [colors[0], colors[1], colors[2]], borderWidth: 0, cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '10px', textAlign: 'center' }}>Broad dominates — shift converting terms to exact.</div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>QS VS COST (SIZE = CONVERSIONS)</h4>
            <div style={{ height: 220 }}><Bubble data={{ datasets: [{ label: 'Ad Groups', data: [{ x: 3, y: 40, r: 8 }, { x: 5, y: 120, r: 25 }, { x: 6, y: 20, r: 12 }, { x: 8, y: 30, r: 15 }, { x: 10, y: 280, r: 35 }], backgroundColor: colors[1] + '80', borderColor: colors[1] }] }} options={{ maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Quality Score', font: { size: 9 } } }, y: { title: { display: true, text: 'Spend ($)', font: { size: 9 } } } } }} /></div>
          </div>
        </div>
      </div>

      {/* Audit Scorecard */}
      <div className="section-panel">
        <div className="section-header"><h2>Audit Scorecard</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', minWidth: 0 }}>
          <ScoreCard label="IMPRESSION SHARE" value={55} color="#ef4444" subtext="2 critical • budget + rank loss" />
          <ScoreCard label="KEYWORD STRUCTURE" value={62} color="#f59e0b" subtext="Brand + competitor terms mixed" />
          <ScoreCard label="QUALITY SCORE" value={64} color="#f59e0b" subtext="Weighted avg QS: 5.4" />
          <ScoreCard label="WASTED SPEND" value={71} color="#fbbf24" subtext="17 wasteful terms flagged" />
          <ScoreCard label="DEVICE STRATEGY" value={73} color="#fbbf24" subtext="Desktop undercapitalized" />
          <ScoreCard label="AD SCHEDULE" value={75} color="#fbbf24" subtext="Overnight spend, low conv." />
          <ScoreCard label="CONVERSION TRACKING" value={85} color="#059669" subtext="Firing, value attached" />
          <ScoreCard label="OPTIMIZATION SCORE" value={98} color="#059669" subtext="Google-reported: 97.8%" />
        </div>
      </div>

      {/* Performance Pulse */}
      <div className="section-panel">
        <div className="section-header"><h2>Performance Pulse — 30-Day Trends</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem', minWidth: 0 }}>
          {['DAILY SPEND', 'DAILY CONVERSIONS', 'ROLLING CPA', 'ROLLING ROAS'].map((t, i) => (
            <div key={i} className="chart-item" style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', marginBottom: '5px' }}>{t}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{['$102 / day', '9.98 / day', '$10.20', '30.5x'][i]}</div>
              <div style={{ height: 60 }}><Line data={{ labels: trendData.map((_, j) => j), datasets: [{ data: trendData.map(d => i === 0 ? d.spend : i === 1 ? d.conv : i === 2 ? Math.random()*20 : d.roas), borderColor: colors[i], backgroundColor: `${colors[i]}11`, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Device, Schedule & Dayparting */}
      <div className="section-panel">
        <div className="section-header"><h2>Device, Schedule & Dayparting</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DEVICE MIX (SPEND)</h4>
            <div style={{ height: 180 }}><Doughnut data={{ labels: ['Mobile', 'Desktop', 'Tablet', 'CTV'], datasets: [{ data: [70, 15, 10, 5], backgroundColor: [colors[0], colors[1], colors[2], colors[3]], borderWidth: 0, cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ROAS BY DEVICE</h4>
            <div style={{ height: 180 }}><Bar data={{ labels: ['Mobile', 'Desktop', 'Tablet', 'CTV'], datasets: [{ data: [28, 46, 31, 0], backgroundColor: [colors[0], colors[1], colors[2], colors[3]] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CONVERSIONS BY HOUR</h4>
            <div style={{ height: 180 }}><Bar data={{ labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), datasets: [{ data: Array.from({ length: 24 }, () => Math.floor(Math.random()*40)), backgroundColor: colors[0] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CONVERSIONS BY DAY</h4>
            <div style={{ height: 180 }}><Bar data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [35, 42, 38, 37, 48, 41, 50], backgroundColor: colors[2] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false } } }} /></div>
          </div>
        </div>
        <h4>CONVERSION HEATMAP — DAY × HOUR</h4>
        <div style={{ marginTop: '20px' }}>
          <Heatmap data={heatmapData} palette={palette} />
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="sidebar" style={{ width: '260px' }}>
    <div className="sidebar-logo"><BarChart2 size={32} /> AUDIT.AI</div>
    <div className="menu-section">
      <div className="menu-label">Navigation</div>
      <div className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /> Dashboard</div>
      <div className={`menu-item ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}><TableIcon size={20} /> Data View</div>
    </div>
    <div style={{ marginTop: 'auto' }}><div className="menu-item"><Settings size={20} /> Settings</div></div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [palettes, setPalettes] = useState(INITIAL_PALETTES);
  const [activePalette, setActivePalette] = useState(INITIAL_PALETTES[0]);

  return (
    <div className="app-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-area">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '12px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder="Search data..." style={{ padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid var(--border)', width: '300px', outline: 'none', background: 'white' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeSwitcher palettes={palettes} setPalettes={setPalettes} activePalette={activePalette} setActivePalette={setActivePalette} />
            <Bell size={22} color="#6b7280" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Alex Rivers</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Admin</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: activePalette.colors[0], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><User size={20} /></div>
            </div>
          </div>
        </header>
        {activeTab === 'overview' ? <DashboardOverview palette={activePalette} /> : <div className="section-panel"><h2>Data Table Content</h2></div>}
      </div>
    </div>
  );
};

export default Dashboard;
