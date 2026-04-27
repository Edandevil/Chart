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
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble, PolarArea } from 'react-chartjs-2';
import { 
  LayoutDashboard, Table as TableIcon, PieChart as PieIcon, TrendingUp, 
  Settings, Download, RefreshCw, Pin, X, ChevronDown, 
  Search, Bell, User, BarChart2, AlertCircle, CheckCircle2, ArrowRight,
  Palette as PaletteIcon, Plus, Trash2, Edit3, Save, Check, MousePointer2, ExternalLink,
  Wallet, Activity, Target, Heart, Footprints, Flame, Moon, Smile, Scale, Calendar, Droplets, Dumbbell,
  Clock, LineChart
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

// --- Real Data Import ---
import realData from '../data.json';

const timePeriod = 'last_month';
const queries = realData[timePeriod]?.queries || [];
const getQuery = (name) => queries.find(q => q.query_name === name)?.result || [];

const kpis = getQuery('Order Performance KPI Summary')[0] || {};
const revenueGrowth = getQuery('Revenue Growth Monthly Comparison') || [];
const orderTrends = getQuery('Daily Order Performance Trends') || [];
const cartAbandonmentTrends = getQuery('Daily Cart Abandonment Trend') || [];
const paymentConversionTrends = getQuery('Daily Payment Conversion Trend') || [];
const warehouseShare = getQuery('Warehouse Market Share Distribution') || [];
const warehouseSummary = getQuery('Warehouse Performance Summary') || [];
const weeklyRevenue = getQuery('Weekly Revenue Pattern Analysis') || [];
const transactionVolume = getQuery('Transaction Volume by Payment Method') || [];
const orderStatus = getQuery('Order Status Distribution Breakdown') || [];
const paymentChannel = getQuery('Payment Channel Performance Breakdown') || [];
const categoryLevel = getQuery('Category Distribution - Level-wise Breakdown') || [];
const topProducts = getQuery('Top Products Performance Analysis') || [];

// Map to legacy structures so we don't have to remove components
const campaignData = warehouseShare.slice(0, 4).map(w => ({
  name: `Warehouse ${w.warehouse_id}`,
  spend: w.revenue,
  conv: w.order_count,
  roas: w.revenue_share_pct,
  cpa: w.revenue / w.order_count,
  type: 'WAREHOUSE',
  won: w.order_share_pct,
  budget: 100 - w.order_share_pct,
  rank: 0
}));

const campaignPerformance = warehouseSummary.slice(0, 5).map(w => ({
  name: `Warehouse ${w.warehouse_id}`,
  type: 'WAREHOUSE',
  impr: w.total_orders,
  clicks: w.delivered_orders,
  ctr: `${w.fulfillment_rate}%`,
  cpc: `Rs. ${w.avg_order_value}`,
  spend: `Rs. ${w.total_revenue}`,
  conv: w.cancelled_orders,
  cpa: `${w.cancellation_rate}%`,
  roas: 'N/A',
  status: w.fulfillment_rate > 90 ? 'STRENGTH' : 'CRITICAL'
}));

const problemMatrix = topProducts.slice(0, 6).map(p => ({
  adgroup: p.product_name.substring(0, 20) + '...',
  campaign: `Category ${p.category_id}`,
  clicks: p.total_quantity_sold,
  spend: `Rs. ${p.total_revenue}`,
  conv: p.order_count,
  roas: `Rs. ${p.avg_unit_price}`,
  flag: p.order_count > 100 ? 'OK' : 'LOW VALUE'
}));

const wasteParetoData = {
  labels: categoryLevel.slice(0, 6).map(c => `Level ${c.category_level}`),
  spend: categoryLevel.slice(0, 6).map(c => c.product_count),
  cumulative: categoryLevel.slice(0, 6).map((_, i, arr) => {
    let sum = 0;
    for (let j = 0; j <= i; j++) sum += arr[j].product_count;
    let total = arr.reduce((a, b) => a + b.product_count, 0);
    return Math.round((sum / total) * 100);
  })
};

const opportunityParetoData = {
  labels: paymentChannel.slice(0, 6).map(p => p.payment_method),
  spend: paymentChannel.slice(0, 6).map(p => p.transaction_count),
  cumulative: paymentChannel.slice(0, 6).map((_, i, arr) => {
    let sum = 0;
    for (let j = 0; j <= i; j++) sum += arr[j].transaction_count;
    let total = arr.reduce((a, b) => a + b.transaction_count, 0);
    return Math.round((sum / total) * 100);
  })
};

const trendData = orderTrends.slice(0, 30).map(t => ({
  date: t.order_date.substring(5),
  spend: t.daily_revenue,
  conv: t.daily_orders,
  roas: t.avg_order_value,
  clicks: t.unique_customers
}));

const heatmapData = Array.from({ length: 7 }, () => Array.from({ length: 24 }, (_, hour) => {
  const isPeak = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 20);
  const baseTraffic = isPeak ? 15 : 5;
  return Math.floor(baseTraffic + Math.random() * 10);
}));

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
  const totalProdRev = topProducts.reduce((sum, p) => sum + Number(p.total_revenue || 0), 0) || 1;
  const items = topProducts.slice(0, 4).map((p, i) => ({
    name: p.product_name.substring(0, 15),
    pct: Math.round((Number(p.total_revenue) / totalProdRev) * 100),
    color: colors[i]
  }));

  return (
    <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Revenue Analysis</h3>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Category distribution</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '5px' }}>Last 30d <ChevronDown size={14} /></div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Rs. {kpis.total_revenue?.toLocaleString() || 0}</div>
      <div style={{ height: '30px', display: 'flex', gap: '4px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ width: `${item.pct}%`, background: item.color }} />
        ))}
        <div style={{ flex: 1, background: '#e5e7eb' }} title="Other Categories" />
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order Performance</h3>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Average Order Value</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '5px' }}>30d <ChevronDown size={14} /></div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>Rs. {Math.round(kpis.average_order_value || 0).toLocaleString()}</div>
      <div style={{ fontSize: '0.85rem', color: colors[2], display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
        <TrendingUp size={16} /> 12% <span style={{ color: '#6b7280' }}>from last month</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: '220px', height: '110px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: '25px solid #f3f4f6', position: 'absolute', top: 0 }}></div>
          <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: '25px solid transparent', borderTopColor: colors[2], borderLeftColor: colors[2], position: 'absolute', top: 0, transform: `rotate(${((kpis.fulfillment_rate || 0) / 100) * 180 - 90}deg)` }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{kpis.fulfillment_rate}%</div>
            <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Fulfillment Rate</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>Based on aggregated transaction metrics over the past 30 days</div>
    </div>
  );
};

const GoalTrackerCard = ({ colors }) => {
  const goals = [
    { name: 'Total Orders', current: kpis.total_orders || 0, target: 15000, time: 'Target: 15k orders', color: colors[2], icon: <Target size={18} /> },
    { name: 'Revenue (Rs.)', current: kpis.total_revenue || 0, target: 500000000, time: 'Target: 500M Rs.', color: colors[1], icon: <Wallet size={18} /> },
    { name: 'Customers', current: kpis.unique_customers || 0, target: 10000, time: 'Target: 10k users', color: colors[1], icon: <User size={18} /> },
  ];

  return (
    <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Platform Goals</h3>
        <button style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><Plus size={14} /> Add goals</button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Goal</div>
        {goals.slice(0, 1).map((goal, i) => (
          <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f3f4f6' }}>{goal.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>{goal.name}</span>
                <span style={{ color: '#6b7280' }}>{goal.current.toLocaleString()}/{goal.target.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '5px' }}>
                <div style={{ height: '100%', width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, background: goal.color, borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{goal.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Targets</div>
        {goals.slice(1).map((goal, i) => (
          <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f3f4f6' }}>{goal.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700 }}>{goal.name}</span>
                <span style={{ color: '#6b7280' }}>{goal.current.toLocaleString()}/{goal.target.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '5px' }}>
                <div style={{ height: '100%', width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, background: goal.color, borderRadius: '4px' }} />
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
            <div style={{ width: 42, height: 42, borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={22} fill="white" /></div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Platform KPIs</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>Total Orders <ChevronDown size={14} /></div>
        </div>
        <div style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>{kpis.total_orders?.toLocaleString() || 0} <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.7 }}>orders</span></div>
        <div style={{ height: '28px', display: 'flex', gap: '4px', marginBottom: '0.8rem' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i < 12 ? 'white' : 'rgba(255,255,255,0.25)', borderRadius: '3px' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>
          <span>0</span>
          <span>5000</span>
          <span>10000</span>
        </div>
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order status:</span>
          <span style={{ background: '#fff', color: '#166534', padding: '4px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534' }} /> Healthy</span>
        </div>
      </div>
      <div style={{ padding: '2rem 1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Order Flow Summary</h4>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>{kpis.fulfillment_rate || 0}% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>fulfillment rate</span></div>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 800, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KEY METRICS:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><User size={18} strokeWidth={2.5} /> Unique Customers</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{kpis.unique_customers?.toLocaleString() || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><CheckCircle2 size={18} strokeWidth={2.5} /> Delivered Orders</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{kpis.delivered_orders?.toLocaleString() || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 500 }}><X size={18} strokeWidth={2.5} /> Cancelled Orders</div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{kpis.cancelled_orders?.toLocaleString() || 0}</span>
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
    { label: "Active Restaurants", value: '248', unit: 'locations', info: 'Operational across network', time: 'Live', icon: <Pin size={18} />, color: colors[0] },
    { label: "Service Hours", value: '14.5', unit: 'avg hours', info: 'Daily active operations', time: 'Daily', icon: <Clock size={18} />, color: colors[1] },
    { label: "Peak Timing", value: '18:00', unit: 'PM', info: 'Highest order frequency', time: 'Peak', icon: <Activity size={18} />, color: colors[2] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="section-panel" style={{ padding: '1.8rem', borderRadius: '24px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[4]}22`, color: colors[4], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} strokeWidth={2.5} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Operations Overview</h3>
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
              <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[2]}22`, color: colors[2], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={20} strokeWidth={2.5} /></div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Platform Score</h3>
            </div>
            <ArrowRight size={20} color="#9ca3af" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <div style={{ width: '280px', height: '140px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '280px', height: '280px', borderRadius: '50%', border: '40px solid #f3f4f6', position: 'absolute', top: 0 }}></div>
              <div style={{ width: '280px', height: '280px', borderRadius: '50%', border: '40px solid transparent', borderTopColor: colors[1], borderLeftColor: colors[1], position: 'absolute', top: 0, transform: `rotate(${((kpis.fulfillment_rate || 0) / 100) * 180 - 90}deg)` }}></div>
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800 }}>{kpis.fulfillment_rate || 0}<span style={{ fontSize: '1rem', opacity: 0.5 }}>/100</span></div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Fulfillment Score</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '20px', marginTop: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[1] }} /> Delivery Success
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{kpis.fulfillment_rate || 0}%</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[3] }} /> Customer Activity
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Active</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-panel" style={{ padding: '1.8rem', borderRadius: '24px', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '12px', background: `${colors[3]}22`, color: colors[3], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PieIcon size={20} strokeWidth={2.5} /></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Insights</h3>
              </div>
              <ArrowRight size={20} color="#9ca3af" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#f9fafb', padding: '1.2rem', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>{topProducts[0]?.product_name?.substring(0, 10)} <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.6 }}>Top</span></div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>Best performing<br/>category overall</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.2rem', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>{categoryLevel.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.6 }}>Levels</span></div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>Active category<br/>distribution depth</div>
              </div>
            </div>
          </div>

          <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, padding: '1.8rem', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: '1.3' }}>Set and Achieve Your Growth Goals!</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '1.2rem' }}>Your Goal: Reach {((kpis.total_orders || 0) * 1.1).toLocaleString()} Orders</p>
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

  return (
    <div className="container" style={{ minWidth: 0 }}>
      <div className="section-panel" style={{ padding: '2rem' }}>
        <div className="section-header"><h2>Revenue & Transaction Analysis</h2></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>WEEKLY REVENUE PATTERN</h4>
            <div style={{ height: 260 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: weeklyRevenue.slice(0, 8).reverse().map(w => w.week_start ? w.week_start.substring(5) : ''), 
                  datasets: [{ 
                    label: 'Revenue (Rs.)',
                    data: weeklyRevenue.slice(0, 8).reverse().map(w => w.weekly_revenue), 
                    backgroundColor: colors[0], 
                    borderRadius: 4 
                  }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} 
              />
            </div>
          </div>
          
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PAYMENT METHOD VOLUME</h4>
            <div style={{ height: 260 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: transactionVolume.map(t => t.payment_method), 
                  datasets: [{ 
                    label: 'Transactions',
                    data: transactionVolume.map(t => t.transaction_count), 
                    backgroundColor: colors[1], 
                    borderRadius: 4 
                  }] 
                }} 
                options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} 
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>WAREHOUSE REVENUE</h4>
            <div style={{ height: 200 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: warehouseShare.map(w => `WH ${w.warehouse_id}`), 
                  datasets: [{ data: warehouseShare.map(w => w.revenue), backgroundColor: colors }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} 
              />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>TOP PRODUCTS (SOLD)</h4>
            <div style={{ height: 200 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: topProducts.slice(0, 5).map(p => p.product_name.substring(0, 10) + '...'), 
                  datasets: [{ label: 'Units Sold', data: topProducts.slice(0, 5).map(p => p.total_quantity_sold), backgroundColor: colors[2] }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: true, grid: { display: false } } } }} 
              />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>TOP CATEGORIES (PRODUCTS)</h4>
            <div style={{ height: 200 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: categoryLevel.map(c => `Level ${c.category_level}`), 
                  datasets: [{ label: 'Products', data: categoryLevel.map(c => c.product_count), backgroundColor: colors[3] }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: true, grid: { display: false } } } }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonutChartsPage = ({ palette }) => {
  const colors = palette.colors;

  return (
    <div className="container" style={{ minWidth: 0 }}>
      <div className="section-panel" style={{ padding: '2rem' }}>
        <div className="section-header"><h2>Distribution Analytics</h2></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ORDER STATUS (DONUT)</h4>
            <div style={{ height: 280 }}>
              <Doughnut 
                key={palette.id}
                data={{ 
                  labels: orderStatus.map(o => o.order_status), 
                  datasets: [{ 
                    data: orderStatus.map(o => o.order_count), 
                    backgroundColor: colors, 
                    borderWidth: 3, 
                    borderColor: '#ffffff', 
                    cutout: '70%' 
                  }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }} 
              />
            </div>
          </div>
          
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PAYMENT CHANNELS (PIE)</h4>
            <div style={{ height: 280 }}>
              <Pie 
                key={palette.id}
                data={{ 
                  labels: paymentChannel.map(p => p.payment_method), 
                  datasets: [{ 
                    data: paymentChannel.map(p => p.transaction_count), 
                    backgroundColor: colors, 
                    borderWidth: 3, 
                    borderColor: '#ffffff'
                  }] 
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }} 
              />
            </div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CATEGORY LEVEL (POLAR)</h4>
            <div style={{ height: 280 }}>
              <PolarArea 
                key={palette.id}
                data={{ 
                  labels: categoryLevel.map(c => `Level ${c.category_level}`), 
                  datasets: [{ 
                    data: categoryLevel.map(c => c.product_count), 
                    backgroundColor: colors.map(c => `${c}88`),
                    borderColor: colors,
                    borderWidth: 1
                  }] 
                }} 
                options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, grid: { color: '#f3f4f6' } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }} 
              />
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
      y: { type: 'linear', position: 'left', title: { display: true, text: yTitle, font: { size: 9 } }, grid: { display: false } },
      y1: { type: 'linear', position: 'right', min: 0, max: 100, title: { display: true, text: 'Cumulative %', font: { size: 9 } }, grid: { display: false }, ticks: { callback: v => v + '%' } },
      x: { ticks: { font: { size: 8 }, maxRotation: 45, minRotation: 45 }, grid: { display: false } }
    }
  });

  return (
    <div className="container" style={{ minWidth: 0 }}>
      {/* Banner */}
      <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, borderRadius: '16px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Platform Performance Dashboard <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>LIVE</span></h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Data Source: <b>Production Database</b> • Environment: <b>Main</b> • Window: <b>Last 30 days</b></div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '5px' }}>Total Orders: <b>{kpis.total_orders?.toLocaleString()}</b> • Revenue: <b>Rs. {kpis.total_revenue?.toLocaleString()}</b> • Fulfillment: <b>{kpis.fulfillment_rate}%</b></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', border: `4px solid ${colors[2]}`, width: '110px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{Math.round(kpis.fulfillment_rate || 0)}</div>
            <div style={{ fontSize: '0.5rem', fontWeight: 700 }}>FULFILLMENT %</div>
          </div>
          <div style={{ fontSize: '0.7rem' }}>
            <div style={{ color: '#ef4444' }}>● 3 Critical Alerts</div>
            <div style={{ color: '#f59e0b' }}>● 4 High Priority</div>
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
        {['Cancelled orders impact', 'Underperforming categories', 'Growth opportunities'].map((t, i) => (
          <div key={i} className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: i === 0 ? '#fee2e2' : i === 1 ? '#fef3c7' : `${colors[4]}22`, color: i === 0 ? '#991b1b' : i === 1 ? '#92400e' : colors[4] }}>{['IMMEDIATE', 'NEAR-TERM', 'STRATEGIC'][i]}</span>
            <h3 style={{ fontSize: '0.9rem', margin: '10px 0 5px' }}>{t}</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>{['High cancellation rates affect revenue.', 'Review product quality for low-rated items.', 'Expand top-selling categories to new regions.'][i]}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: colors[0] }}>{[`Rs. ${Math.round((kpis.total_revenue || 0) * 0.05).toLocaleString()}`, `${categoryLevel.length - 2 || 0} categories`, `+15% reach`][i]}</div>
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
        <div className="section-header"><h2>Platform Overview</h2> <span style={{ fontSize: '0.7rem', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '6px' }}>Network Insights</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PLATFORM HEALTH RADAR</h4>
            <div style={{ height: 260 }}><Radar key={palette.id} data={{ labels: ['Fulfillment', 'AOV', 'Conv. Rate', 'Delivery', 'Retention', 'Traffic'], datasets: [{ label: 'Current', data: [kpis.fulfillment_rate || 0, Math.min(((kpis.average_order_value || 0) / 10), 100), 85, 95, 80, 90], backgroundColor: `${colors[0]}33`, borderColor: colors[0], borderWidth: 2 }, { label: 'Target', data: [100, 100, 90, 98, 90, 95], backgroundColor: `${colors[1]}11`, borderColor: colors[1], borderWidth: 2, borderDash: [5, 5] }] }} options={{ maintainAspectRatio: false, scales: { r: { ticks: { display: false }, pointLabels: { font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ORDER STATUS DISTRIBUTION</h4>
            <div style={{ height: 220, marginTop: '20px' }}><Doughnut key={palette.id} data={{ labels: orderStatus.map(o => o.order_status), datasets: [{ data: orderStatus.map(o => o.status_count), backgroundColor: [colors[0], colors[1], colors[2], colors[3]], borderWidth: 3, borderColor: '#ffffff', cutout: '70%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CATEGORY PERFORMANCE SCORE</h4>
            <div style={{ height: 260 }}><Bar key={palette.id} data={{ labels: topProducts.slice(0, 8).map(p => p.product_name.substring(0, 10)), datasets: [{ data: topProducts.slice(0, 8).map(p => p.total_quantity_sold), backgroundColor: colors.concat(colors), borderRadius: 4 }] }} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} /></div>
          </div>
        </div>
      </div>

      {/* Impression Share Diagnosis */}
      <div className="section-panel">
        <div className="section-header"><h2>Market Share Diagnosis</h2> <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '6px' }}>Warehouse Reach</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '20px' }}>Stacked: captured / lost-to-logistics / lost-to-competition</h4>
            {campaignData.map((c, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                  <b>WH · {c.name}</b>
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
            <div style={{ height: 280 }}><Radar key={palette.id} data={{ labels: campaignData.map(c => c.name), datasets: [{ label: 'Won', data: campaignData.map(c => c.won), borderColor: colors[2], backgroundColor: 'transparent' }, { label: 'Lost-Budget', data: campaignData.map(c => c.budget), borderColor: '#f59e0b', backgroundColor: 'transparent' }, { label: 'Lost-Rank', data: campaignData.map(c => c.rank), borderColor: '#ef4444', backgroundColor: 'transparent' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
        </div>
      </div>

      {/* Keyword Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Category Analytics</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CATEGORY PERFORMANCE DISTRIBUTION</h4>
            <div style={{ height: 220 }}><Bar key={palette.id} data={{ labels: categoryLevel.slice(0, 10).map(c => `L${c.category_level}`), datasets: [{ data: categoryLevel.slice(0, 10).map(c => c.product_count), backgroundColor: colors[4], borderRadius: 4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} /></div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '10px' }}>Product count by category level depth.</div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PAYMENT CHANNEL MIX</h4>
            <div style={{ height: 220 }}><Doughnut key={palette.id} data={{ labels: paymentChannel.slice(0, 4).map(p => p.payment_method), datasets: [{ data: paymentChannel.slice(0, 4).map(p => p.transaction_count), backgroundColor: [colors[0], colors[1], colors[2], colors[3]], borderWidth: 3, borderColor: '#ffffff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '10px', textAlign: 'center' }}>Breakdown of preferred payment channels.</div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>TOP PRODUCTS BY VOLUME</h4>
            <div style={{ height: 220 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: topProducts.slice(0, 6).map(p => p.product_name.substring(0, 15) + '...'), 
                  datasets: [{ 
                    label: 'Volume Sold', 
                    data: topProducts.slice(0, 6).map(p => Number(p.total_quantity_sold)), 
                    backgroundColor: colors[1],
                    borderRadius: 4
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 } } } 
                  } 
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Strategic Analytics</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CONVERSION VALUE TREND</h4>
            <div style={{ height: 260 }}>
              <Line 
                key={palette.id}
                data={{ 
                  labels: trendData.map(d => d.date), 
                  datasets: [{ 
                    label: 'Daily Revenue', 
                    data: trendData.map(d => d.spend), 
                    borderColor: colors[0], 
                    backgroundColor: `${colors[0]}22`, 
                    fill: true, 
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: colors[0]
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: { display: false },
                      ticks: { font: { size: 10 } }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 9 } }
                    }
                  }
                }} 
              />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PRODUCTS BY CATEGORY LEVEL</h4>
            <div style={{ height: 260 }}>
              <Bar 
                key={palette.id} 
                data={{ 
                  labels: categoryLevel.slice(0, 6).map(c => `Level ${c.category_level}`), 
                  datasets: [{ 
                    label: 'Products', 
                    data: categoryLevel.slice(0, 6).map(c => Number(c.product_count)), 
                    backgroundColor: colors[2],
                    borderRadius: 4
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 11 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } }, beginAtZero: true } 
                  } 
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Scorecard */}
      <div className="section-panel">
        <div className="section-header"><h2>Platform Scorecard</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', minWidth: 0 }}>
          <ScoreCard label="ORDER SHARE" value={55} color="#ef4444" subtext="Overall market capture" />
          <ScoreCard label="CATEGORY MIX" value={62} color="#f59e0b" subtext="Top performing categories" />
          <ScoreCard label="QUALITY SCORE" value={64} color="#f59e0b" subtext="Weighted avg performance: 8.4" />
          <ScoreCard label="CANCELLATION RATE" value={71} color="#fbbf24" subtext="Tracked across all orders" />
          <ScoreCard label="PLATFORM REACH" value={73} color="#fbbf24" subtext="Multi-channel presence" />
          <ScoreCard label="DELIVERY TIME" value={75} color="#fbbf24" subtext="Average dispatch speed" />
          <ScoreCard label="FULFILLMENT" value={85} color={colors[2]} subtext="Successful deliveries" />
          <ScoreCard label="PLATFORM HEALTH" value={98} color={colors[2]} subtext="System-reported: 98.5%" />
        </div>
      </div>

      {/* Performance Pulse */}
      <div className="section-panel">
        <div className="section-header"><h2>Performance Pulse — 30-Day Trends</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem', minWidth: 0 }}>
          {['TOTAL REVENUE', 'TOTAL ORDERS', 'AVERAGE AOV', 'FULFILLMENT RATE'].map((t, i) => (
            <div key={i} className="chart-item" style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', marginBottom: '5px' }}>{t}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{[`Rs. ${((kpis.total_revenue || 0) / 1000000).toFixed(1)}M`, `${kpis.total_orders || 0}`, `Rs. ${Math.round(kpis.average_order_value || 0).toLocaleString()}`, `${kpis.fulfillment_rate || 0}%`][i]}</div>
              <div style={{ height: 60 }}><Line key={palette.id} data={{ labels: trendData.map((_, j) => j), datasets: [{ data: trendData.map(d => i === 0 ? d.spend : i === 1 ? d.conv : i === 2 ? d.roas : (kpis.fulfillment_rate || 85) + (Math.random() * 4 - 2)), borderColor: colors[i], backgroundColor: `${colors[i]}11`, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false, grid: { display: false } }, y: { display: false, grid: { display: false } } } }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Trends & Distribution */}
      <div className="section-panel">
        <div className="section-header"><h2>Platform Trends & Distribution</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>WAREHOUSE MIX (REVENUE)</h4>
            <div style={{ height: 180 }}><Doughnut key={palette.id} data={{ labels: warehouseShare.slice(0, 4).map(w => `WH-${w.warehouse_id}`), datasets: [{ data: warehouseShare.slice(0, 4).map(w => w.total_revenue), backgroundColor: [colors[0], colors[1], colors[2], colors[3]], borderWidth: 3, borderColor: '#ffffff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ORDERS BY CATEGORY</h4>
            <div style={{ height: 180 }}><Bar key={palette.id} data={{ labels: categoryLevel.slice(0, 4).map(c => `L${c.category_level}`), datasets: [{ data: categoryLevel.slice(0, 4).map(c => c.product_count), backgroundColor: [colors[0], colors[1], colors[2], colors[3]] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>HOURLY TRAFFIC (EST.)</h4>
            <div style={{ height: 180 }}><Bar key={palette.id} data={{ labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), datasets: [{ label: 'Traffic', data: Array.from({ length: 24 }, (_, hour) => { const isPeak = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 20); return Math.floor((isPeak ? 15 : 5) + Math.random() * 10); }), backgroundColor: colors[0] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: true, grid: { display: false } } } }} /></div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ORDERS BY DAY (LAST 7)</h4>
            <div style={{ height: 180 }}><Bar key={palette.id} data={{ labels: trendData.slice(0, 7).map(t => new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' })), datasets: [{ label: 'Orders', data: trendData.slice(0, 7).map(t => t.conv), backgroundColor: colors[2] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: true, grid: { display: false } } } }} /></div>
          </div>
        </div>
        <h4>ORDER TREND HEATMAP — DAY × HOUR</h4>
        <div style={{ marginTop: '20px' }}>
          <Heatmap data={heatmapData} palette={palette} />
        </div>
      </div>

      {/* Category vs Payment Pareto */}
      <div className="section-panel">
        <div className="section-header"><h2>Category vs Payment Distribution Pareto</h2></div>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>Where the highest volumes are concentrated — 80/20 view of categories and payment channels.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[0], marginBottom: '15px' }}>CATEGORY DISTRIBUTION PARETO</h4>
            <div style={{ height: 320 }}>
              <Bar key={palette.id} data={{ labels: wasteParetoData.labels, datasets: [{ type: 'bar', label: 'Products', data: wasteParetoData.spend, backgroundColor: colors[0], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: wasteParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Product Count', colors[0])} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4 style={{ color: colors[2], marginBottom: '15px' }}>PAYMENT CHANNEL PARETO</h4>
            <div style={{ height: 320 }}>
              <Bar key={palette.id} data={{ labels: opportunityParetoData.labels, datasets: [{ type: 'bar', label: 'Transactions', data: opportunityParetoData.spend, backgroundColor: colors[2], borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Cumulative %', data: opportunityParetoData.cumulative, borderColor: '#111827', borderWidth: 2, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }} options={paretoOptions('Transaction Count', colors[2])} />
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
          category="Fulfillment · Logistics" 
          title="High Cancellation Rate in East Region Warehouses"
          description="Three out of five regional warehouses are experiencing cancellation rates above 15% due to delayed dispatch times. Order volume (44%), Revenue Loss (59%), Delivery Delays (73%)."
          action="Optimize last-mile delivery partnerships and increase local inventory limits for high-velocity products."
          uplift="Revenue uplift: ~12% increase if cancellation rate halved."
          themeColors={colors}
        />

        <RecommendationCard 
          severity="CRITICAL" 
          category="Product · Conversion Leak" 
          title="Premium Products experiencing cart abandonment"
          description="High-tier electronics are seeing a 65% cart abandonment rate while identical sub-categories in mid-tier return 3x higher conversion."
          action="Introduce flexible payment options and optimize checkout flow for premium SKUs; retarget abandoned carts with dynamic offers."
          themeColors={colors}
        />

        <RecommendationCard 
          severity="STRENGTH" 
          category="Performance" 
          title="Platform AOV: Rs. 12,000 • High Customer Retention"
          description="Top decile of system-reported platform health. Strategic priority is scale, not repair."
          action="Strategic priority is scale, not repair."
          themeColors={colors}
        />
      </div>

      {/* Campaign Performance Summary */}
      <div className="section-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }}><h2>Warehouse Performance Summary</h2></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px 1.5rem' }}>WAREHOUSE</th>
              <th style={{ padding: '12px 1rem' }}>TYPE</th>
              <th style={{ padding: '12px 1rem' }}>TOTAL ORDERS</th>
              <th style={{ padding: '12px 1rem' }}>DELIVERED</th>
              <th style={{ padding: '12px 1rem' }}>FULFILLMENT</th>
              <th style={{ padding: '12px 1rem' }}>AOV</th>
              <th style={{ padding: '12px 1rem' }}>REVENUE</th>
              <th style={{ padding: '12px 1rem' }}>CANCELLED</th>
              <th style={{ padding: '12px 1rem' }}>CANCEL RATE</th>
              <th style={{ padding: '12px 1.5rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {campaignPerformance.map((c, i) => (
              <tr key={i} style={{ borderBottom: i === campaignPerformance.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 1.5rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 1rem' }}><span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: `${colors[0]}22`, color: colors[0] }}>{c.type}</span></td>
                <td style={{ padding: '12px 1rem' }}>{c.impr}</td>
                <td style={{ padding: '12px 1rem' }}>{c.clicks}</td>
                <td style={{ padding: '12px 1rem' }}>{c.ctr}</td>
                <td style={{ padding: '12px 1rem' }}>{c.cpc}</td>
                <td style={{ padding: '12px 1rem' }}>{c.spend}</td>
                <td style={{ padding: '12px 1rem' }}>{c.conv}</td>
                <td style={{ padding: '12px 1rem' }}>{c.cpa}</td>
                <td style={{ padding: '12px 1.5rem', fontWeight: 700, color: c.status === 'CRITICAL' ? '#ef4444' : c.status === 'STRENGTH' ? colors[2] : '#111827' }}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '12px 1.5rem', fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb' }}>* Warehouse data excludes internal transfers.</div>
      </div>

      {/* Ad Group Problem Matrix */}
      <div className="section-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }}><h2>Product Problem Matrix</h2></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px 1.5rem' }}>PRODUCT</th>
              <th style={{ padding: '12px 1rem' }}>CATEGORY</th>
              <th style={{ padding: '12px 1rem' }}>SOLD</th>
              <th style={{ padding: '12px 1rem' }}>REVENUE</th>
              <th style={{ padding: '12px 1rem' }}>ORDERS</th>
              <th style={{ padding: '12px 1rem' }}>AVG UNIT PRICE</th>
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

const LineChartsPage = ({ palette }) => {
  const colors = palette.colors;

  return (
    <div className="container" style={{ minWidth: 0 }}>
      <div className="section-panel" style={{ padding: '2rem' }}>
        <div className="section-header"><h2>Daily E-commerce Trends</h2></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY REVENUE TREND</h4>
            <div style={{ height: 260 }}>
              <Line 
                key={palette.id}
                data={{ 
                  labels: trendData.slice(0, 14).reverse().map(d => d.date), 
                  datasets: [{ 
                    label: 'Revenue (Rs.)', 
                    data: trendData.slice(0, 14).reverse().map(d => d.spend), 
                    borderColor: colors[0], 
                    backgroundColor: `${colors[0]}22`, 
                    fill: true, 
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: colors[0]
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 } } } 
                  } 
                }} 
              />
            </div>
          </div>
          
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>AVERAGE ORDER VALUE (AOV) TREND</h4>
            <div style={{ height: 260 }}>
              <Line 
                key={palette.id}
                data={{ 
                  labels: trendData.slice(0, 14).reverse().map(d => d.date), 
                  datasets: [{ 
                    label: 'AOV (Rs.)', 
                    data: trendData.slice(0, 14).reverse().map(d => d.roas), 
                    borderColor: colors[1], 
                    backgroundColor: `${colors[1]}22`, 
                    fill: true, 
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: colors[1]
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 } } } 
                  } 
                }} 
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY ORDERS TREND</h4>
            <div style={{ height: 260 }}>
              <Line 
                key={palette.id}
                data={{ 
                  labels: trendData.slice(0, 14).reverse().map(d => d.date), 
                  datasets: [{ 
                    label: 'Orders', 
                    data: trendData.slice(0, 14).reverse().map(d => d.conv), 
                    borderColor: '#ef4444', 
                    backgroundColor: '#ef444422', 
                    fill: true, 
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#ef4444'
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 } } } 
                  } 
                }} 
              />
            </div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY UNIQUE CUSTOMERS</h4>
            <div style={{ height: 260 }}>
              <Line 
                key={palette.id}
                data={{ 
                  labels: trendData.slice(0, 14).reverse().map(d => d.date), 
                  datasets: [{ 
                    label: 'Customers', 
                    data: trendData.slice(0, 14).reverse().map(d => d.clicks), 
                    borderColor: colors[2], 
                    backgroundColor: `${colors[2]}22`, 
                    fill: true, 
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: colors[2]
                  }] 
                }} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
                    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 } } } 
                  } 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="sidebar" style={{ width: '260px' }}>
    <div className="sidebar-logo"><BarChart2 size={32} /> PLATFORM.AI</div>
    <div className="menu-section">
      <div className="menu-label">Navigation</div>
      <div className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /> Dashboard Overview</div>
      <div className={`menu-item ${activeTab === 'barchart' ? 'active' : ''}`} onClick={() => setActiveTab('barchart')}><BarChart2 size={20} /> Bar Chart</div>
      <div className={`menu-item ${activeTab === 'donutchart' ? 'active' : ''}`} onClick={() => setActiveTab('donutchart')}><PieIcon size={20} /> Donut Chart</div>
      <div className={`menu-item ${activeTab === 'linechart' ? 'active' : ''}`} onClick={() => setActiveTab('linechart')}><LineChart size={20} /> Line Chart</div>
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
        {activeTab === 'barchart' && <BarChartsPage palette={activePalette} />}
        {activeTab === 'donutchart' && <DonutChartsPage palette={activePalette} />}
        {activeTab === 'linechart' && <LineChartsPage palette={activePalette} />}
      </div>
    </div>
  );
};

export default Dashboard;
