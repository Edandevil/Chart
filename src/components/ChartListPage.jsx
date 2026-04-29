import React, { useState, useMemo, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Scatter } from 'react-chartjs-2';
import { Sankey, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Search, Grid, List, Filter, ChevronRight, BarChart2, PieChart as PieIcon, TrendingUp, Activity, Target, Share2, Layers, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Examples', icon: <Grid size={18} /> },
  { id: 'line', name: 'Line', icon: <TrendingUp size={18} /> },
  { id: 'bar', name: 'Bar', icon: <BarChart2 size={18} /> },
  { id: 'pie', name: 'Pie / Doughnut', icon: <PieIcon size={18} /> },
  { id: 'radar', name: 'Radar / Polar', icon: <Activity size={18} /> },
  { id: 'sankey', name: 'Sankey Flow', icon: <Share2 size={18} /> },
  { id: 'special', name: 'Special Styles', icon: <Layers size={18} /> },
];

const ChartRenderer = ({ type, data, options }) => {
  const ChartComponent = {
    line: Line, bar: Bar, pie: Pie, doughnut: Doughnut,
    radar: Radar, polarArea: PolarArea, scatter: Scatter, bubble: Scatter,
  }[type] || Line;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {type === 'sankey' ? (
        <ResponsiveContainer width="100%" height="100%">
          <Sankey data={data} node={{ stroke: '#fff', strokeWidth: 2, fill: '#3b82f6' }} nodePadding={40} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} link={{ stroke: '#93c5fd', strokeOpacity: 0.5 }}>
            <RechartsTooltip />
          </Sankey>
        </ResponsiveContainer>
      ) : (
        <ChartComponent data={data} options={{ ...options, maintainAspectRatio: false }} />
      )}
      {options?.customCenterText && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: '1.2' }}>{options.customCenterText.value}</div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>{options.customCenterText.label}</div>
        </div>
      )}
    </div>
  );
};

const ChartCard = ({ title, type, data, options, onClick }) => (
  <div className="section-panel" onClick={onClick} style={{ padding: '1.25rem', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '320px', border: 'none' }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', margin: 0 }}>{title}</h3>
      <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#f3f4f6', color: '#6b7280', textTransform: 'uppercase' }}>{type}</span>
    </div>
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
      <ChartRenderer type={type} data={data} options={options} />
    </div>
  </div>
);

const ChartDetailView = ({ chart, onBack, colors }) => {
  const initialCode = [
    `let option = {`,
    `  type: '${chart.type}',`,
    ...(chart.title ? [`  title: '${chart.title}',`] : []),
    `  data: {`,
    ...(chart.data.labels ? [`    labels: [${chart.data.labels.map(l => `'${l}'`).join(', ')}],`] : []),
    `    datasets: [`,
    ...(chart.data.datasets || []).map((ds, i) => [
      `      {`,
      `        // Dataset ${i + 1}`,
      ds.label ? `        label: '${ds.label}',` : null,
      Array.isArray(ds.data) ? `        data: [${ds.data.join(', ')}],` : null,
      ds.backgroundColor && typeof ds.backgroundColor === 'string' ? `        backgroundColor: '${ds.backgroundColor}',` : `        backgroundColor: colors[${i}],`,
      ds.borderColor && typeof ds.borderColor === 'string' ? `        borderColor: '${ds.borderColor}',` : null,
      ds.tension != null ? `        tension: ${ds.tension},` : null,
      ds.fill != null ? `        fill: ${ds.fill},` : null,
      ds.cutout ? `        cutout: '${ds.cutout}',` : null,
      ds.borderRadius ? `        borderRadius: ${ds.borderRadius},` : null,
      `      },`
    ].filter(Boolean)).flat(),
    `    ],`,
    `  },`,
    `  options: {`,
    chart.options?.rotation != null ? `    rotation: ${chart.options.rotation},` : null,
    chart.options?.circumference != null ? `    circumference: ${chart.options.circumference},` : null,
    chart.options?.indexAxis ? `    indexAxis: '${chart.options.indexAxis}',` : null,
    chart.options?.scales?.x?.stacked ? `    stacked: true,` : null,
    `    plugins: {`,
    `      legend: { display: ${chart.options?.plugins?.legend?.display !== false ? 'true' : 'false'} },`,
    `      tooltip: { enabled: true },`,
    `    },`,
    `    scales: {`,
    `      x: { grid: { display: false } },`,
    `      y: { grid: { color: '#f3f4f6' } },`,
    `    },`,
    `  }`,
    `};`,
  ].filter(l => l !== null).join('\n');

  const [liveCode, setLiveCode] = useState(initialCode);
  const [liveConfig, setLiveConfig] = useState({ type: chart.type, data: chart.data, options: chart.options });
  const [error, setError] = useState(null);

  useEffect(() => {
    setLiveCode(initialCode);
    setLiveConfig({ type: chart.type, data: chart.data, options: chart.options });
    setError(null);
  }, [chart.id]);

  const handleApply = () => {
    try {
      // Safely evaluate the user's code to extract the option object
      const parsedConfig = new Function('colors', `${liveCode}\nreturn option;`)(colors);
      
      if (!parsedConfig || !parsedConfig.type || !parsedConfig.data) {
        throw new Error("Invalid configuration structure. Must have 'type' and 'data'.");
      }

      setLiveConfig(parsedConfig);
      setError(null);
    } catch (err) {
      setError(err.message || 'Syntax error in configuration');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Back button */}
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <ArrowLeft size={16} /> Back to Chart Library
      </button>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>{chart.title}</h1>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{chart.type}</span>
      </div>

      {/* Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>

        {/* Left: Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Config Code */}
          <div style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginLeft: '8px' }}>chart.config.js</span>
              </div>
              <button 
                onClick={handleApply}
                style={{ padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Run Code
              </button>
            </div>
            {error && (
              <div style={{ padding: '8px 16px', background: '#7f1d1d', color: '#fca5a5', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #991b1b' }}>
                Error: {error}
              </div>
            )}
            <div style={{ position: 'relative', display: 'flex', flex: 1 }}>
              {/* Line Numbers */}
              <div style={{ padding: '20px 0 20px 10px', background: '#0f172a', color: '#334155', fontSize: '0.78rem', lineHeight: '1.7', fontFamily: `'Fira Code', 'Consolas', monospace`, textAlign: 'right', userSelect: 'none', minWidth: '35px' }}>
                {liveCode.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea 
                value={liveCode}
                onChange={(e) => setLiveCode(e.target.value)}
                spellCheck={false}
                style={{ 
                  flex: 1, margin: 0, padding: '20px 16px', background: 'transparent', color: '#e2e8f0', 
                  fontSize: '0.78rem', lineHeight: '1.7', fontFamily: `'Fira Code', 'Consolas', monospace`, 
                  border: 'none', outline: 'none', resize: 'vertical', minHeight: '400px', whiteSpace: 'pre' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Chart */}
        <div className="section-panel" style={{ padding: '2rem', border: 'none', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Live Preview</h3>
            <span style={{ fontSize: '0.7rem', color: colors[0], fontWeight: 700, background: `${colors[0]}15`, padding: '3px 10px', borderRadius: '6px' }}>INTERACTIVE</span>
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: '500px' }}>
            <ChartRenderer type={liveConfig.type} data={liveConfig.data} options={{ ...liveConfig.options, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartListPage = ({ palette }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChart, setSelectedChart] = useState(null);
  const colors = palette.colors;

  const chartExamples = useMemo(() => [
    // --- Line Charts ---
    {
      id: 'line-basic',
      title: 'Basic Line Chart',
      type: 'line',
      category: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Traffic', data: [120, 200, 150, 80, 70, 110, 130], borderColor: colors[0], tension: 0.4, pointRadius: 4, fill: false }]
      },
      options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }
    },
    {
      id: 'line-area',
      title: 'Area Stacked Chart',
      type: 'line',
      category: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Group A', data: [45, 52, 38, 24, 33, 10], borderColor: colors[1], backgroundColor: `${colors[1]}44`, fill: true, tension: 0.4 },
          { label: 'Group B', data: [35, 41, 62, 42, 13, 18], borderColor: colors[2], backgroundColor: `${colors[2]}44`, fill: true, tension: 0.4 }
        ]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }, scales: { x: { grid: { display: false } }, y: { stacked: true } } }
    },
    {
      id: 'line-gradient',
      title: 'Gradient Smooth Line',
      type: 'line',
      category: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'Value',
          data: [15, 25, 12, 45, 32, 28, 55],
          borderColor: colors[0],
          borderWidth: 4,
          pointRadius: 0,
          tension: 0.5,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, `${colors[0]}00`);
            gradient.addColorStop(1, `${colors[0]}66`);
            return gradient;
          }
        }]
      },
      options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    },

    // --- Bar Charts ---
    {
      id: 'bar-basic',
      title: 'Rounded Bar Chart',
      type: 'bar',
      category: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [{ label: 'Revenue', data: [65, 45, 75, 50, 90], backgroundColor: colors, borderRadius: 8 }]
      },
      options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }
    },
    {
      id: 'bar-horizontal',
      title: 'Horizontal Bar Analysis',
      type: 'bar',
      category: 'bar',
      data: {
        labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
        datasets: [{ label: 'Sales', data: [320, 450, 210, 580], backgroundColor: colors[2], borderRadius: 4 }]
      },
      options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }
    },
    {
      id: 'bar-stacked',
      title: 'Stacked Performance',
      type: 'bar',
      category: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'Direct', data: [120, 132, 101, 134], backgroundColor: colors[0] },
          { label: 'Email', data: [220, 182, 191, 234], backgroundColor: colors[1] },
          { label: 'Social', data: [150, 232, 201, 154], backgroundColor: colors[2] }
        ]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } }, scales: { x: { stacked: true }, y: { stacked: true } } }
    },

    // --- Pie / Doughnut Charts ---
    {
      id: 'pie-basic',
      title: 'Market Share Pie',
      type: 'pie',
      category: 'pie',
      data: {
        labels: ['Search', 'Direct', 'Video', 'Social'],
        datasets: [{ data: [1048, 735, 580, 484], backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
      },
      options: { plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } } }
    },
    {
      id: 'doughnut-rounded',
      title: 'Custom Doughnut',
      type: 'doughnut',
      category: 'pie',
      data: {
        labels: ['Completed', 'Pending', 'Failed'],
        datasets: [{ data: [65, 25, 10], backgroundColor: [colors[2], colors[3], '#ef4444'], cutout: '70%', borderRadius: 5 }]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
    },
    {
      id: 'doughnut-gauge',
      title: 'Performance Gauge',
      type: 'doughnut',
      category: 'pie',
      data: {
        labels: ['Achieved', 'Remaining'],
        datasets: [{ data: [85.77, 14.23], backgroundColor: ['#3b82f6', '#f3f4f6'], cutout: '75%', borderWidth: 0 }]
      },
      options: { 
        rotation: 270, 
        circumference: 180, 
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        customCenterText: { value: '85.77%', label: 'Fulfillment Rate' }
      }
    },

    // --- Radar / Polar ---
    {
      id: 'radar-basic',
      title: 'Capability Radar',
      type: 'radar',
      category: 'radar',
      data: {
        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Tech', 'Price'],
        datasets: [
          { label: 'Model X', data: [90, 80, 70, 95, 100, 60], borderColor: colors[0], backgroundColor: `${colors[0]}33`, pointRadius: 2 },
          { label: 'Model Y', data: [70, 95, 90, 80, 85, 85], borderColor: colors[4], backgroundColor: `${colors[4]}33`, pointRadius: 2 }
        ]
      },
      options: { scales: { r: { grid: { color: '#f3f4f6' }, ticks: { display: false } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }
    },
    {
      id: 'polar-basic',
      title: 'Polar Area Distribution',
      type: 'polarArea',
      category: 'radar',
      data: {
        labels: ['North', 'East', 'South', 'West', 'Central'],
        datasets: [{ data: [11, 16, 7, 3, 14], backgroundColor: colors.slice(0, 5) }]
      },
      options: { scales: { r: { grid: { color: '#f3f4f6' }, ticks: { display: false } } }, plugins: { legend: { display: false } } }
    },

    // --- Sankey ---
    {
      id: 'sankey-basic',
      title: 'Customer Journey Flow',
      type: 'sankey',
      category: 'sankey',
      data: {
        nodes: [{ name: 'Landing' }, { name: 'Product' }, { name: 'Checkout' }, { name: 'Purchase' }, { name: 'Drop-off' }],
        links: [
          { source: 0, target: 1, value: 800 },
          { source: 0, target: 4, value: 200 },
          { source: 1, target: 2, value: 400 },
          { source: 1, target: 4, value: 400 },
          { source: 2, target: 3, value: 300 },
          { source: 2, target: 4, value: 100 }
        ]
      },
      options: {}
    },

    // --- Special Styles ---
    {
      id: 'bar-mixed',
      title: 'Mixed Bar-Line',
      type: 'bar',
      category: 'special',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { type: 'bar', label: 'Sales', data: [450, 520, 380, 240, 330, 410], backgroundColor: colors[0], borderRadius: 4 },
          { type: 'line', label: 'Trend', data: [400, 480, 420, 300, 380, 450], borderColor: '#111827', borderWidth: 2, tension: 0.4, fill: false, pointRadius: 3 }
        ]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
    }
  ], [colors]);

  const filteredCharts = chartExamples.filter(chart => {
    const matchesCategory = activeCategory === 'all' || chart.category === activeCategory;
    const matchesSearch = chart.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chart.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', gap: '30px', padding: selectedChart ? '0' : '0 0 40px 0', minHeight: 'calc(100vh - 120px)', alignItems: 'stretch', width: '100%' }}>
      
      {/* Chart Category Sidebar — hidden in detail view */}
      {!selectedChart && (
      <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '0 0 15px 5px', borderBottom: '1px solid #e5e7eb', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={20} color={colors[0]} /> Categories
          </h2>
        </div>
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 16px', 
              borderRadius: '12px', 
              cursor: 'pointer',
              background: activeCategory === cat.id ? `${colors[0]}11` : 'transparent',
              color: activeCategory === cat.id ? colors[0] : '#6b7280',
              fontWeight: activeCategory === cat.id ? 700 : 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {cat.icon}
              <span style={{ fontSize: '0.85rem' }}>{cat.name}</span>
            </div>
            {activeCategory === cat.id && <ChevronRight size={14} />}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#475569' }}>
            <Share2 size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Custom Styles</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: '1.4', margin: 0 }}>
            Every chart supports custom themes, gradients, and interactive tooltips out of the box.
          </p>
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedChart ? (
          <ChartDetailView chart={selectedChart} onBack={() => setSelectedChart(null)} colors={colors} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 5px 0' }}>Chart Library</h1>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Discover {chartExamples.length} individual chart styles and configurations.</p>
              </div>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Search charts by name or type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', background: 'white', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} />
              </div>
            </div>

            {filteredCharts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredCharts.map(chart => (
                  <ChartCard key={chart.id} {...chart} onClick={() => setSelectedChart(chart)} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '24px', border: '1px dashed #e5e7eb' }}>
                <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '20px', background: '#f3f4f6', color: '#9ca3af', marginBottom: '15px' }}><Search size={40} /></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#374151' }}>No charts found</h3>
                <p style={{ color: '#6b7280' }}>Try adjusting your search or category filters.</p>
                <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} style={{ marginTop: '10px', padding: '8px 20px', borderRadius: '10px', background: colors[0], color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Reset Filters</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChartListPage;
