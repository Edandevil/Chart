import React from 'react';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import { drv } from '../driverData';
import AnalyticsBanner from './AnalyticsBanner';
import { Truck, Users, CheckCircle2, Activity, MapPin, AlertTriangle, TrendingUp, Award } from 'lucide-react';

const KPICard = ({ label, value, sub, color, icon }) => (
  <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}22`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{sub}</div>
  </div>
);

const DriverPage = ({ palette }) => {
  const colors = palette.colors;
  const noGrid = { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } };
  const peakHour = drv.hourlyActivity.reduce((a, b) => a.pings > b.pings ? a : b);
  const totalPings = drv.dailyTrend.reduce((s, d) => s + d.pings, 0);

  const healthLegend = [
    { label: 'Verified', value: drv.workforce.verified_drivers, color: '#10b981' },
    { label: 'Active', value: drv.workforce.active_drivers, color: '#fbbf24' },
    { label: 'Alerts', value: drv.workloadAlerts.length, color: '#f97316' },
    { label: 'Warehouses', value: drv.byWarehouse.length, color: colors[0] }
  ];

  const metrics = [
    { label: 'Total Drivers', value: drv.workforce.total_drivers },
    { label: 'Active Drivers', value: drv.workforce.active_drivers },
    { label: 'Total Deliveries', value: drv.workforce.total_deliveries.toLocaleString() },
    { label: 'Verification Rate', value: `${drv.workforce.verification_rate_pct}%` },
    { label: 'Peak Hour', value: `${peakHour.hour}:00` }
  ];

  return (
    <div className="container" style={{ minWidth: 0 }}>

      {/* Banner */}
      <AnalyticsBanner 
        title="Driver Operations Dashboard"
        subtitle1="Month-to-Date Operations · April 2026"
        subtitle2="Period: 2026-04-13 to 2026-04-19 · Fleet Status: Healthy"
        metrics={metrics}
        healthScore={92}
        healthLegend={healthLegend}
        colors={colors}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <KPICard label="Total Drivers" value={drv.workforce.total_drivers} sub={`${drv.workforce.active_drivers} active • ${drv.workforce.verified_drivers} verified`} color={colors[0]} icon={<Users size={18}/>} />
        <KPICard label="Total Deliveries" value={drv.workforce.total_deliveries.toLocaleString()} sub={`Avg ${drv.workforce.avg_deliveries_per_active_driver.toLocaleString()} per active driver`} color={colors[1]} icon={<Truck size={18}/>} />
        <KPICard label="Verification Rate" value={`${drv.workforce.verification_rate_pct}%`} sub={`${drv.workforce.verified_drivers} of ${drv.workforce.total_drivers} drivers verified`} color={colors[2]} icon={<CheckCircle2 size={18}/>} />
        <KPICard label="Peak Hour" value={`${peakHour.hour}:00`} sub={`${peakHour.pings.toLocaleString()} pings • ${peakHour.active_drivers} drivers active`} color="#f59e0b" icon={<Activity size={18}/>} />
      </div>

      {/* Workforce Status + Day of Week */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Workforce Status Mix</h3>
          <div style={{ height: 180 }}>
            <Doughnut key={palette.id} data={{ labels: drv.statusBreakdown.map(s => s.label), datasets: [{ data: drv.statusBreakdown.map(s => s.driver_count), backgroundColor: [colors[1], colors[0]], borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem' }}>
            {drv.statusBreakdown.map((s, i) => <div key={i} style={{ textAlign: 'center' }}><b style={{ color: i === 0 ? colors[1] : colors[0] }}>{s.pct_of_workforce}%</b><br/>{s.is_active ? 'Active' : 'Inactive'}</div>)}
          </div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Pings by Day of Week</h3>
          <div style={{ height: 180 }}>
            <Bar key={palette.id} data={{ labels: drv.dayOfWeek.map(d => d.day_name), datasets: [{ data: drv.dayOfWeek.map(d => d.pings), backgroundColor: colors, borderRadius: 6 }] }} options={noGrid} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#6b7280', textAlign: 'center' }}>Fri peak: {drv.dayOfWeek[4].pings.toLocaleString()} pings</div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Workload Distribution</h3>
          <div style={{ height: 180 }}>
            <Bar key={palette.id} data={{ labels: drv.percentiles.map(p => p.percentile), datasets: [{ data: drv.percentiles.map(p => p.delivery_threshold), backgroundColor: colors, borderRadius: 4 }] }} options={{ ...noGrid, indexAxis: 'y' }} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#6b7280', textAlign: 'center' }}>Median: {drv.workloadSummary.median_deliveries} deliveries • Std Dev: {drv.workloadSummary.std_dev_deliveries}</div>
        </div>
      </div>

      {/* Hourly + Daily Trends */}
      <div className="section-panel">
        <div className="section-header"><h2>Driver Activity Trends</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>HOURLY LOCATION PINGS (ALL HOURS)</h4>
            <div style={{ height: 260 }}>
              <Bar key={palette.id} data={{ labels: drv.hourlyActivity.map(h => `${h.hour}:00`), datasets: [{ label: 'Location Pings', data: drv.hourlyActivity.map(h => h.pings), backgroundColor: drv.hourlyActivity.map(h => h.pings === peakHour.pings ? colors[2] : `${colors[0]}99`), borderRadius: 4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ACTIVE DRIVERS BY HOUR</h4>
            <div style={{ height: 260 }}>
              <Line key={palette.id} data={{ labels: drv.hourlyActivity.map(h => `${h.hour}h`), datasets: [{ label: 'Active Drivers', data: drv.hourlyActivity.map(h => h.active_drivers), borderColor: colors[1], backgroundColor: `${colors[1]}22`, fill: true, tension: 0.4, pointRadius: 2, pointBackgroundColor: colors[1] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { grid: { color: '#f3f4f6' } } } }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY PING VOLUME & ACTIVE DRIVERS</h4>
            <div style={{ height: 220 }}>
              <Line key={palette.id} data={{ labels: drv.dailyTrend.map(d => d.date), datasets: [{ label: 'Location Pings', data: drv.dailyTrend.map(d => d.pings), borderColor: colors[0], backgroundColor: `${colors[0]}22`, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[0], yAxisID: 'y' }, { label: 'Active Drivers', data: drv.dailyTrend.map(d => d.active_drivers), borderColor: colors[2], backgroundColor: `${colors[2]}11`, fill: false, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[2], yAxisID: 'y1' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } }, scales: { y: { type: 'linear', position: 'left', grid: { display: false }, title: { display: true, text: 'Pings', font: { size: 9 } } }, y1: { type: 'linear', position: 'right', grid: { display: false }, title: { display: true, text: 'Drivers', font: { size: 9 } } }, x: { grid: { display: false } } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Performance */}
      <div className="section-panel">
        <div className="section-header"><h2>Warehouse Performance</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>TOTAL DELIVERIES BY WAREHOUSE</h4>
            <div style={{ height: 260 }}>
              <Bar key={palette.id} data={{ labels: drv.byWarehouse.map(w => `WH-${w.warehouse_id}`), datasets: [{ label: 'Deliveries', data: drv.byWarehouse.map(w => w.total_deliveries), backgroundColor: colors, borderRadius: 6 }] }} options={noGrid} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DRIVER DISTRIBUTION</h4>
            <div style={{ height: 260 }}>
              <Doughnut key={palette.id} data={{ labels: drv.byWarehouse.map(w => `WH-${w.warehouse_id}`), datasets: [{ data: drv.byWarehouse.map(w => w.drivers_count), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', cutout: '60%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Warehouse', 'Total Drivers', 'Active', 'Verified', 'Deliveries', 'Avg/Active Driver'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drv.byWarehouse.map((w, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>WH-{w.warehouse_id}</td>
                  <td style={{ padding: '10px 12px' }}>{w.drivers_count}</td>
                  <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: w.active_drivers > 0 ? '#d1fae5' : '#fee2e2', color: w.active_drivers > 0 ? '#065f46' : '#991b1b', fontWeight: 700 }}>{w.active_drivers}</span></td>
                  <td style={{ padding: '10px 12px' }}>{w.verified_drivers}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{w.total_deliveries.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: w.avg_deliveries_per_driver ? colors[2] : '#9ca3af' }}>{w.avg_deliveries_per_driver ? w.avg_deliveries_per_driver.toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Drivers + Workload Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="section-panel" style={{ marginBottom: 0 }}>
          <div className="section-header"><h2>Top Drivers (MTD)</h2></div>
          {drv.topDriversMTD.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < drv.topDriversMTD.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '10px', background: `${colors[i % colors.length]}22`, color: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>#{d.rank}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{d.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>WH-{d.warehouse_id} • {d.is_active ? <span style={{ color: '#059669' }}>Active</span> : <span style={{ color: '#ef4444' }}>Inactive</span>}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>{d.total_deliveries.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.pct}% of total</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-panel" style={{ marginBottom: 0 }}>
          <div className="section-header"><h2>Workload Alerts</h2></div>

          {/* Overloaded drivers */}
          {drv.workloadAlerts.map((d, i) => (
            <div key={i} style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color="#d97706" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{d.first_name} {d.last_name}</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px' }}>{d.workload_status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                <div><div style={{ color: '#6b7280' }}>Deliveries</div><div style={{ fontWeight: 700 }}>{d.delivery_count}</div></div>
                <div><div style={{ color: '#6b7280' }}>Fleet Avg</div><div style={{ fontWeight: 700 }}>{d.fleet_avg}</div></div>
                <div><div style={{ color: '#6b7280' }}>Z-Score</div><div style={{ fontWeight: 700, color: '#d97706' }}>+{d.z_score}</div></div>
              </div>
              <div style={{ marginTop: '10px', height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ height: '100%', width: `${Math.min((d.delivery_count / 250) * 100, 100)}%`, background: '#f59e0b', borderRadius: '3px' }} />
              </div>
            </div>
          ))}

          {/* Workload stats */}
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem', marginTop: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>Fleet Workload Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Min Deliveries', value: drv.workloadSummary.min_deliveries },
                { label: 'Max Deliveries', value: drv.workloadSummary.max_deliveries },
                { label: 'Avg Deliveries', value: drv.workloadSummary.avg_deliveries },
                { label: 'Std Deviation', value: drv.workloadSummary.std_dev_deliveries },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: colors[i] }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DriverPage;
