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
  Palette as PaletteIcon, Plus, Trash2, Edit3, Save, Check, MousePointer2, ExternalLink,
  Wallet, Activity, Target, Heart, Footprints, Flame, Moon, Smile, Scale, Calendar, Droplets, Dumbbell,
  Clock
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

const campaignPerformance = [
  { name: 'XXXX · Shopping Local Inventory', type: 'SHOPPING', impr: '181,520', clicks: '3,362', ctr: '1.85%', cpc: '$0.26', spend: '$888.93', conv: '42.9', cpa: '$20.71', roas: '45.0x', status: 'GOOD' },
  { name: 'XXXX · Search Local Keywords', type: 'SEARCH', impr: '4,186', clicks: '493', ctr: '11.78%', cpc: '$1.77', spend: '$874.22', conv: '39.4', cpa: '$22.21', roas: '37.8x', status: 'GOOD' },
  { name: 'XXXX · Search Core Terms', type: 'SEARCH', impr: '5,019', clicks: '496', ctr: '9.88%', cpc: '$1.68', spend: '$835.27', conv: '98.0', cpa: '$8.52', roas: '18.3x', status: 'GOOD' },
  { name: 'XXXX · Performance Max', type: 'PMAX', impr: '40,100', clicks: '339', ctr: '0.85%', cpc: '$0.89', spend: '$301.07', conv: '117.0', cpa: '$2.57', roas: '0.4x', status: 'CRITICAL' },
  { name: 'XXXX · Display Remarketing', type: 'DISPLAY', impr: '9,550', clicks: '162', ctr: '1.70%', cpc: '$0.94', spend: '$152.83', conv: '2.0', cpa: '$76.42', roas: '30.8x', status: 'STRENGTH' },
];

const problemMatrix = [
  { adgroup: 'Shopping Ad Group', campaign: 'XXXX · Shopping', clicks: '3,362', spend: '$888.93', conv: '42.9', roas: '45.0x', flag: 'OK' },
  { adgroup: 'In-Stock Furniture', campaign: 'XXXX · Search Local', clicks: '263', spend: '$498.61', conv: '24.5', roas: '35.0x', flag: 'OK' },
  { adgroup: 'Location Terms XXXX', campaign: 'XXXX · Core Terms', clicks: '306', spend: '$383.42', conv: '36.0', roas: '32.0x', flag: 'OK' },
  { adgroup: 'American-Made / Quality', campaign: 'XXXX · Core Terms', clicks: '105', spend: '$258.48', conv: '41.0', roas: '2.7x', flag: 'LOW VALUE' },
  { adgroup: 'Best Keywords', campaign: 'XXXX · Core Terms', clicks: '74', spend: '$164.21', conv: '19.0', roas: '14.0x', flag: 'OK' },
  { adgroup: 'Competitor A', campaign: 'XXXX · Search Local', clicks: '93', spend: '$129.78', conv: '8.9', roas: '99.3x', flag: 'BRAND LEAK' },
];

const wasteParetoData = {
  labels: ['XXXX furniture', 'XXXX XXXX furn.', 'furniture stores', 'XXXX furniture', 'furniture store near me', 'XXXX furniture', 'XXXX furn. XXXX', 'XXXX furn.', 'XXXX XXXX XXXX'],
  spend: [25.0, 22.1, 14.5, 12.0, 11.2, 11.0, 9.1, 8.5, 8.2],
  cumulative: [18, 35, 48, 58, 68, 76, 84, 91, 100]
};

const opportunityParetoData = {
  labels: ['XXXX XXXX XXXX', 'XXXX XXXX', 'wayfair near me', 'XXXX furniture', 'furniture store XXXX', 'furniture store XXXX', 'queen bed frame', 'furniture gallery XXXX', 'day bed', 'sofa set'],
  spend: [78, 22, 21, 9, 18, 11, 2, 2, 1, 1],
  cumulative: [38, 48, 58, 62, 71, 76, 88, 93, 98, 100]
};

const trendData = Array.from({ length: 30 }, (_, i) => ({
  date: `3/${i + 22}`,
  spend: Math.floor(Math.random() * 80) + 60,
  conv: Math.floor(Math.random() * 12) + 5,
  roas: (Math.random() * 25 + 5).toFixed(1)
}));

const heatmapData = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 15)));

// --- Sub-components ---

const RecommendationCard = ({ severity, category, title, description, action, uplift, themeColors }) => {
  const accentColor = severity === 'CRITICAL' ? '#ef4444' : severity === 'STRENGTH' ? themeColors[2] : '#f59e0b';
  return (
    <div style={{ marginBottom: '1.5rem', borderLeft: `4px solid ${accentColor}`, padding: '1.5rem', background: 'white', borderRadius: '0 12px 12px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: severity === 'CRITICAL' ? '#fee2e2' : severity === 'STRENGTH' ? `${themeColors[2]}22` : '#fef3c7', color: severity === 'CRITICAL' ? '#b91c1c' : severity === 'STRENGTH' ? themeColors[2] : '#92400e' }}>{severity}</span>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{category}</span>
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{title}</h4>
      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '12px' }}>{description}</p>
      <div style={{ background: `${themeColors[0]}08`, padding: '12px', borderRadius: '8px', border: `1px solid ${themeColors[0]}22` }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: themeColors[0] }}>Action: </span>
        <span style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>{action}</span>
      </div>
      {uplift && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '10px' }}>{uplift}</div>}
    </div>
  );
};

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
  <div style={{ padding: '1.25rem', minWidth: 0, border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
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

// --- Finance Cards ---

const CostAnalysisCard = ({ colors }) => {
  const items = [
    { name: 'Housing', pct: 18, color: colors[1] },
    { name: 'Debt payments', pct: 7, color: colors[2] },
    { name: 'Food', pct: 6, color: colors[3] },
    { name: 'Transportation', pct: 9, color: colors[4] },
    { name: 'Healthcare', pct: 10, color: colors[5] },
    { name: 'Investments', pct: 17, color: colors[6] },
    { name: 'Other', pct: 33, color: '#f3f4f6' },
  ];

  return (
    <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cost analysis</h3>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Spending overview</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '5px' }}>January <ChevronDown size={14} /></div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>$8,450</div>
      <div style={{ height: '30px', display: 'flex', gap: '4px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ width: `${item.pct}%`, background: item.color }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '2px', background: item.color }} />
              <span style={{ color: '#4b5563' }}>{item.name}</span>
            </div>
            <span style={{ fontWeight: 600 }}>{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FinancialHealthCard = ({ colors }) => {
  return (
    <div className="section-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Financial health</h3>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Current status</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '5px' }}>30d <ChevronDown size={14} /></div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$15,780</div>
      <div style={{ fontSize: '0.85rem', color: colors[2], display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
        <TrendingUp size={16} /> 17.5% <span style={{ color: '#6b7280' }}>from last month</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: '220px', height: '110px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: '25px solid #f3f4f6', position: 'absolute', top: 0 }}></div>
          <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: '25px solid transparent', borderTopColor: colors[2], borderLeftColor: colors[2], position: 'absolute', top: 0, transform: 'rotate(45deg)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>75%</div>
            <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Of monthly income saved</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>Based on aggregated transaction metrics over the past 30 days</div>
    </div>
  );
};

const GoalTrackerCard = ({ colors }) => {
  const goals = [
    { name: 'Reserve', current: 7000, target: 10000, time: 'Left to save 4 months', color: colors[2], icon: <Wallet size={18} /> },
    { name: 'Travel', current: 2500, target: 4000, time: 'Left to save 3 months', color: colors[1], icon: <Download size={18} /> },
    { name: 'Car', current: 1600, target: 20000, time: 'Left to save 3 years 6 months', color: colors[1], icon: <Activity size={18} /> },
    { name: 'Real estate', current: 8300, target: 70000, time: 'Left to save 5 years 8 months', color: colors[1], icon: <Target size={18} /> },
  ];

  return (
    <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Goal tracker</h3>
        <button style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><Plus size={14} /> Add goals</button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This year</div>
        {goals.slice(0, 1).map((goal, i) => (
          <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f3f4f6' }}>{goal.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>{goal.name}</span>
                <span style={{ color: '#6b7280' }}>${goal.current.toLocaleString()}/${goal.target.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '5px' }}>
                <div style={{ height: '100%', width: `${(goal.current / goal.target) * 100}%`, background: goal.color, borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{goal.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Long term</div>
        {goals.slice(1).map((goal, i) => (
          <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f3f4f6' }}>{goal.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>{goal.name}</span>
                <span style={{ color: '#6b7280' }}>${goal.current.toLocaleString()}/${goal.target.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '5px' }}>
                <div style={{ height: '100%', width: `${(goal.current / goal.target) * 100}%`, background: goal.color, borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{goal.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Health Tracker Modules (MATCHING REFERENCE) ---

const VitalStatsCard = ({ colors }) => {
  return (
    <div className="section-panel" style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: 0 }}>
      <div style={{ background: colors[0], padding: '2rem 1.5rem 1.5rem', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={22} fill="white" /></div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Vital Stats</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>Cholesterol <ChevronDown size={14} /></div>
        </div>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>150/200 <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.7 }}>mg/dL</span></div>
        <div style={{ height: '28px', display: 'flex', gap: '4px', marginBottom: '0.8rem' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i < 12 ? 'white' : 'rgba(255,255,255,0.25)', borderRadius: '3px' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>
          <span>0</span>
          <span>100</span>
          <span>200</span>
        </div>
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cholesterol level:</span>
          <span style={{ background: '#fff', color: '#166534', padding: '4px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534' }} /> Normal</span>
        </div>
      </div>
      <div style={{ padding: '2rem 1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Report Details</h4>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>75% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>of the healthy limit</span></div>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 800, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>REMINDER:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><Calendar size={18} strokeWidth={2.5} /> Next check-up</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>28 Feb 2025</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><Droplets size={18} strokeWidth={2.5} /> Hydrated</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>3.5L / day</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><Dumbbell size={18} strokeWidth={2.5} /> Exercise</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>30-min jogging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ colors }) => {
  const tabs = ['All Activity', 'Daily Overview', 'Progress', 'Performance Insights'];
  const cards = [
    { label: "Today's Steps", value: '8,200', unit: 'steps', info: 'Route: Home → Central Park', time: '45 min', icon: <Footprints size={18} />, color: colors[0] },
    { label: "Workout", value: '450', unit: 'Kcal burned', info: 'Workout type: HIIT', time: '30 min', icon: <Flame size={18} />, color: colors[1] },
    { label: "Sleep & Recovery", value: '85/100', unit: 'sleep', info: 'Deep Sleep: 2h 10m', time: '7h 45m', icon: <Moon size={18} />, color: colors[2] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-panel" style={{ padding: '1.8rem', borderRadius: '24px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[4]}22`, color: colors[4], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} strokeWidth={2.5} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Activity</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: '#f3f4f6', padding: '5px', borderRadius: '12px' }}>
            {tabs.map((tab, i) => (
              <div key={i} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, background: i === 0 ? 'white' : 'transparent', color: i === 0 ? '#111827' : '#6b7280', cursor: 'pointer', boxShadow: i === 0 ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{tab}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {cards.map((card, i) => (
            <div key={i} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{card.label}</span>
                <span style={{ fontSize: '0.75rem', color: card.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {card.time}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1.2rem' }}>{card.info}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{card.value} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#9ca3af' }}>{card.unit}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div className="section-panel" style={{ padding: '1.8rem', borderRadius: '24px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[2]}22`, color: colors[2], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Smile size={20} strokeWidth={2.5} /></div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Mental Health Score</h3>
            </div>
            <ArrowRight size={20} color="#9ca3af" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <div style={{ width: '280px', height: '140px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '280px', height: '280px', borderRadius: '50%', border: '40px solid #f3f4f6', position: 'absolute', top: 0 }}></div>
              <div style={{ width: '280px', height: '280px', borderRadius: '50%', border: '40px solid transparent', borderTopColor: colors[1], borderLeftColor: colors[1], position: 'absolute', top: 0, transform: 'rotate(45deg)' }}></div>
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800 }}>78<span style={{ fontSize: '1rem', opacity: 0.5 }}>/100</span></div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Mental Health Score</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '20px', marginTop: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[1] }} /> Mindfulness
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>82%</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[3] }} /> Stress Management
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>68%</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-panel" style={{ padding: '1.8rem', borderRadius: '24px', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[3]}22`, color: colors[3], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scale size={20} strokeWidth={2.5} /></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Body Composition</h3>
              </div>
              <ArrowRight size={20} color="#9ca3af" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#f9fafb', padding: '1.2rem', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>68 <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.6 }}>Kg</span></div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>Your weight is within<br/>a healthy range</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.2rem', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>22%</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>Your body fat is at<br/>an ideal level</div>
              </div>
            </div>
          </div>

          <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, padding: '1.8rem', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: '1.3' }}>Set and Achieve Your Health Goals!</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '1.2rem' }}>Your Goal: Lose 3kg in 1 month</p>
              <button style={{ background: 'white', color: colors[0], border: 'none', padding: '10px 20px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>Adjust My Goal <ArrowRight size={16} /></button>
            </div>
            <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChartsPage = ({ palette }) => {
  const colors = palette.colors;

  const paretoOptions = (yTitle, color) => ({
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } },
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: yTitle, font: { size: 9 } } },
      y1: { type: 'linear', position: 'right', min: 0, max: 100, title: { display: true, text: 'Cumulative %', font: { size: 9 } }, grid: { display: false }, ticks: { callback: v => v + '%' } },
      x: { ticks: { font: { size: 8 }, maxRotation: 45, minRotation: 45 } }
    }
  });

  return (
    <div className="container" style={{ minWidth: 0 }}>
      <div className="section-panel" style={{ padding: '2rem' }}>
        <div className="section-header"><h2>All Bar Charts</h2></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CATEGORY SCORE VS TARGET</h4>
            <div style={{ height: 260 }}><Bar data={{ labels: ['IS', 'Key', 'QS', 'Waste', 'Device', 'Sched', 'Track', 'Opt'], datasets: [{ data: [55, 62, 64, 71, 73, 75, 85, 98], backgroundColor: colors.concat(colors), borderRadius: 4 }] }} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { max: 100 } } }} /></div>
          </div>
          
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>QUALITY SCORE DISTRIBUTION</h4>
            <div style={{ height: 260 }}><Bar data={{ labels: [1,2,3,4,5,6,7,8,9,10], datasets: [{ data: [0,0,300,0,450,1420,550,180,170,750], backgroundColor: colors[4], borderRadius: 4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ROAS BY DEVICE</h4>
            <div style={{ height: 200 }}><Bar data={{ labels: ['Mobile', 'Desktop', 'Tablet', 'CTV'], datasets: [{ data: [28, 46, 31, 0], backgroundColor: [colors[0], colors[1], colors[2], colors[3]] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CONVERSIONS BY HOUR</h4>
            <div style={{ height: 200 }}><Bar data={{ labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), datasets: [{ data: Array.from({ length: 24 }, () => Math.floor(Math.random()*40)), backgroundColor: colors[0] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CONVERSIONS BY DAY</h4>
            <div style={{ height: 200 }}><Bar data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [35, 42, 38, 37, 48, 41, 50], backgroundColor: colors[2] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false } } }} /></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[0], marginBottom: '15px' }}>WASTE PARETO</h4>
            <div style={{ height: 320 }}>
              <Bar data={{ labels: wasteParetoData.labels, datasets: [{ type: 'bar', label: 'Waste ($)', data: wasteParetoData.spend, backgroundColor: colors[0], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: wasteParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Waste ($)', colors[0])} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[2], marginBottom: '15px' }}>OPPORTUNITY PARETO</h4>
            <div style={{ height: 320 }}>
              <Bar data={{ labels: opportunityParetoData.labels, datasets: [{ type: 'bar', label: 'Current spend ($)', data: opportunityParetoData.spend, backgroundColor: colors[2], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: opportunityParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Spend ($)', colors[2])} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DashboardOverview = ({ palette }) => {
  const colors = palette.colors;

  const paretoOptions = (yTitle, color) => ({
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } },
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: yTitle, font: { size: 9 } } },
      y1: { type: 'linear', position: 'right', min: 0, max: 100, title: { display: true, text: 'Cumulative %', font: { size: 9 } }, grid: { display: false }, ticks: { callback: v => v + '%' } },
      x: { ticks: { font: { size: 8 }, maxRotation: 45, minRotation: 45 } }
    }
  });

  return (
    <div className="container" style={{ minWidth: 0 }}>
      {/* Banner */}
      <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, borderRadius: '16px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
            <div style={{ color: colors[2] }}>● 2 Strengths</div>
          </div>
        </div>
      </div>

      {/* Finance Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <CostAnalysisCard colors={colors} />
        <FinancialHealthCard colors={colors} />
        <GoalTrackerCard colors={colors} />
      </div>

      {/* Opportunities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        {['Recoverable wasted spend', 'Unrealized volume', 'Auction competitiveness'].map((t, i) => (
          <div key={i} className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: i === 0 ? '#fee2e2' : i === 1 ? '#fef3c7' : `${colors[4]}22`, color: i === 0 ? '#991b1b' : i === 1 ? '#92400e' : colors[4] }}>{['IMMEDIATE', 'NEAR-TERM', 'STRATEGIC'][i]}</span>
            <h3 style={{ fontSize: '0.9rem', margin: '10px 0 5px' }}>{t}</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>{['Non-converting terms to negate.', 'Budget-capped campaigns losing 18-27% IS.', '59-73% IS lost to rank.'][i]}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: colors[0] }}>{['~$181 / mo', '~$420 / mo', '2x reach'][i]}</div>
          </div>
        ))}
      </div>

      {/* Health Tracker Row (REFINED) */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', marginBottom: '20px', minWidth: 0, alignItems: 'start' }}>
        <VitalStatsCard colors={colors} />
        <ActivityCard colors={colors} />
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
            <div style={{ height: 220, marginTop: '20px' }}><Doughnut data={{ labels: ['Critical', 'High', 'Medium', 'Strength'], datasets: [{ data: [3, 4, 3, 2], backgroundColor: ['#991b1b', '#d97706', '#fbbf24', colors[2]], borderWidth: 3, borderColor: '#ffffff', cutout: '70%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
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
                  <div style={{ width: `${c.won}%`, background: colors[2] }} title="Won"></div>
                  <div style={{ width: `${c.budget}%`, background: '#f59e0b' }} title="Lost to Budget"></div>
                  <div style={{ width: `${c.rank}%`, background: '#ef4444' }} title="Lost to Rank"></div>
                  <div style={{ flex: 1, background: '#f3f4f6' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>IS COMPOSITION RADAR</h4>
            <div style={{ height: 280 }}><Radar data={{ labels: campaignData.map(c => c.name), datasets: [{ label: 'Won', data: campaignData.map(c => c.won), borderColor: colors[2], backgroundColor: 'transparent' }, { label: 'Lost-Budget', data: campaignData.map(c => c.budget), borderColor: '#f59e0b', backgroundColor: 'transparent' }, { label: 'Lost-Rank', data: campaignData.map(c => c.rank), borderColor: '#ef4444', backgroundColor: 'transparent' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
        </div>
      </div>

      {/* Keyword Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Keyword Analytics</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>QUALITY SCORE DISTRIBUTION</h4>
            <div style={{ height: 220 }}><Bar data={{ labels: [1,2,3,4,5,6,7,8,9,10], datasets: [{ data: [0,0,300,0,450,1420,550,180,170,750], backgroundColor: colors[4], borderRadius: 4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '10px' }}>Weighted avg: <b style={{ color: '#92400e' }}>5.4</b> • Below target of 7.</div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>MATCH TYPE MIX (SPEND-WEIGHTED)</h4>
            <div style={{ height: 220 }}><Doughnut data={{ labels: ['Phrase', 'Broad', 'Exact'], datasets: [{ data: [45, 50, 5], backgroundColor: [colors[0], colors[1], colors[2]], borderWidth: 3, borderColor: '#ffffff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
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
          <ScoreCard label="CONVERSION TRACKING" value={85} color={colors[2]} subtext="Firing, value attached" />
          <ScoreCard label="OPTIMIZATION SCORE" value={98} color={colors[2]} subtext="Google-reported: 97.8%" />
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
            <div style={{ height: 180 }}><Doughnut data={{ labels: ['Mobile', 'Desktop', 'Tablet', 'CTV'], datasets: [{ data: [70, 15, 10, 5], backgroundColor: [colors[0], colors[1], colors[2], colors[3]], borderWidth: 3, borderColor: '#ffffff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
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

      {/* Waste vs Opportunity Pareto */}
      <div className="section-panel">
        <div className="section-header"><h2>Waste vs Opportunity Pareto</h2></div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>Where the biggest dollars are concentrated — 80/20 view of wasteful terms and high-ROAS opportunities.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[0], marginBottom: '15px' }}>WASTE PARETO (ADD AS NEGATIVES)</h4>
            <div style={{ height: 320 }}>
              <Bar data={{ labels: wasteParetoData.labels, datasets: [{ type: 'bar', label: 'Waste ($)', data: wasteParetoData.spend, backgroundColor: colors[0], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: wasteParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Waste ($)', colors[0])} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[2], marginBottom: '15px' }}>OPPORTUNITY PARETO (ADD AS EXACT-MATCH)</h4>
            <div style={{ height: 320 }}>
              <Bar data={{ labels: opportunityParetoData.labels, datasets: [{ type: 'bar', label: 'Current spend ($)', data: opportunityParetoData.spend, backgroundColor: colors[2], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: opportunityParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Spend ($)', colors[2])} />
            </div>
          </div>
        </div>
      </div>

      {/* Findings & Recommendations */}
      <div className="section-panel">
        <div className="section-header"><h2>Findings & Recommendations</h2> <div style={{ display: 'flex', gap: '8px' }}><span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>3 Critical</span> <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>4 High</span> <span style={{ background: `${colors[2]}22`, color: colors[2], padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>3 Medium</span></div></div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>Ordered by severity and financial impact.</p>
        
        <RecommendationCard 
          severity="CRITICAL" 
          category="Impression Share · Auction" 
          title="Search Impression Share lost to rank across 4 campaigns"
          description="Four of five enabled campaigns are losing the majority of impression share to ad rank (not budget). Bids or QS are insufficient for the auction. Shopping (44%), Core Terms (59%), PMax (73%), Search Local (72%)."
          action="Migrate Search to tROAS (start at 1500%). Rewrite ads in the two lowest-QS ad groups; consolidate near-duplicates."
          uplift="Reach uplift: ~2x eligible search impressions if rank loss halved."
          themeColors={colors}
        />

        <RecommendationCard 
          severity="CRITICAL" 
          category="Structure · Brand Leak" 
          title="Brand queries triggering ads inside competitor ad group"
          description="Search term 'XXXX furniture XXXX' spent $22.36 / 0 conv in ad group 'Competitor A' while identical terms in properly-targeted ad groups return 3 conv at $9.60."
          action="Add brand terms as exact-match negatives in non-brand ad groups; tighten competitor groups from broad to phrase; split brand into dedicated low-CPC campaign."
          themeColors={colors}
        />

        <RecommendationCard 
          severity="STRENGTH" 
          category="Performance" 
          title="Account ROAS: 30.5x • $93k conversion value on $3k spend"
          description="Top decile of Google-reported account health. Strategic priority is scale, not repair."
          action="Strategic priority is scale, not repair."
          themeColors={colors}
        />
      </div>

      {/* Campaign Performance Summary */}
      <div className="section-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }}><h2>Campaign Performance Summary</h2></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px 1.5rem' }}>CAMPAIGN</th>
              <th style={{ padding: '12px 1rem' }}>TYPE</th>
              <th style={{ padding: '12px 1rem' }}>IMPR.</th>
              <th style={{ padding: '12px 1rem' }}>CLICKS</th>
              <th style={{ padding: '12px 1rem' }}>CTR</th>
              <th style={{ padding: '12px 1rem' }}>AVG. CPC</th>
              <th style={{ padding: '12px 1rem' }}>SPEND</th>
              <th style={{ padding: '12px 1rem' }}>CONV.</th>
              <th style={{ padding: '12px 1rem' }}>CPA</th>
              <th style={{ padding: '12px 1.5rem' }}>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaignPerformance.map((c, i) => (
              <tr key={i} style={{ borderBottom: i === campaignPerformance.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 1.5rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 1rem' }}><span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: c.type === 'SHOPPING' ? `${colors[2]}22` : c.type === 'SEARCH' ? `${colors[0]}22` : c.type === 'PMAX' ? `${colors[1]}22` : `${colors[4]}22`, color: c.type === 'SHOPPING' ? colors[2] : c.type === 'SEARCH' ? colors[0] : c.type === 'PMAX' ? colors[1] : colors[4] }}>{c.type}</span></td>
                <td style={{ padding: '12px 1rem' }}>{c.impr}</td>
                <td style={{ padding: '12px 1rem' }}>{c.clicks}</td>
                <td style={{ padding: '12px 1rem' }}>{c.ctr}</td>
                <td style={{ padding: '12px 1rem' }}>{c.cpc}</td>
                <td style={{ padding: '12px 1rem' }}>{c.spend}</td>
                <td style={{ padding: '12px 1rem' }}>{c.conv}</td>
                <td style={{ padding: '12px 1rem' }}>{c.cpa}</td>
                <td style={{ padding: '12px 1.5rem', fontWeight: 700, color: c.status === 'CRITICAL' ? '#ef4444' : c.status === 'STRENGTH' ? colors[2] : '#111827' }}>{c.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '12px 1.5rem', fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb' }}>* PMax conversion value likely miscounted — see conversion-tracking finding.</div>
      </div>

      {/* Ad Group Problem Matrix */}
      <div className="section-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }}><h2>Ad Group Problem Matrix</h2></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px 1.5rem' }}>AD GROUP</th>
              <th style={{ padding: '12px 1rem' }}>CAMPAIGN</th>
              <th style={{ padding: '12px 1rem' }}>CLICKS</th>
              <th style={{ padding: '12px 1rem' }}>SPEND</th>
              <th style={{ padding: '12px 1rem' }}>CONV.</th>
              <th style={{ padding: '12px 1rem' }}>ROAS</th>
              <th style={{ padding: '12px 1.5rem' }}>FLAG</th>
            </tr>
          </thead>
          <tbody>
            {problemMatrix.map((m, i) => (
              <tr key={i} style={{ borderBottom: i === problemMatrix.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 1.5rem', fontWeight: 600 }}>{m.adgroup}</td>
                <td style={{ padding: '12px 1rem', color: '#6b7280' }}>{m.campaign}</td>
                <td style={{ padding: '12px 1rem' }}>{m.clicks}</td>
                <td style={{ padding: '12px 1rem' }}>{m.spend}</td>
                <td style={{ padding: '12px 1rem' }}>{m.conv}</td>
                <td style={{ padding: '12px 1rem', fontWeight: 700 }}>{m.roas}</td>
                <td style={{ padding: '12px 1.5rem' }}>
                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: m.flag === 'OK' ? `${colors[2]}22` : m.flag === 'LOW VALUE' ? '#fef3c7' : '#fee2e2', color: m.flag === 'OK' ? colors[2] : m.flag === 'LOW VALUE' ? '#92400e' : '#b91c1c' }}>{m.flag}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className={`menu-item ${activeTab === 'barchart' ? 'active' : ''}`} onClick={() => setActiveTab('barchart')}><BarChart2 size={20} /> Bar Chart</div>
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
        {activeTab === 'overview' && <DashboardOverview palette={activePalette} />}
        {activeTab === 'table' && <div className="section-panel"><h2>Data Table Content</h2></div>}
        {activeTab === 'barchart' && <BarChartsPage palette={activePalette} />}
      </div>
    </div>
  );
};

export default Dashboard;
