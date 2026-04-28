import React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { sales } from '../salesData';
import AnalyticsBanner from './AnalyticsBanner';
import { 
  TrendingUp, TrendingDown, ShoppingCart, 
  DollarSign, Package, Users, Globe, 
  CreditCard, Store 
} from 'lucide-react';

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

const SalesPage = ({ palette }) => {
  const colors = palette.colors;
  const noGrid = { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } };

  const healthLegend = [
    { label: 'Delivered', value: sales.kpi.delivered_orders, color: '#10b981' },
    { label: 'Cancelled', value: sales.kpi.cancelled_orders, color: '#ef4444' },
    { label: 'Avg Value', value: Math.round(sales.kpi.average_order_value/1000) + 'k', color: colors[0] }
  ];

  const metrics = [
    { label: 'Total Orders', value: sales.kpi.total_orders.toLocaleString() },
    { label: 'Total Revenue', value: `Rs. ${(sales.kpi.total_revenue / 10000000).toFixed(2)}B` },
    { label: 'Avg Order Value', value: `Rs. ${sales.kpi.average_order_value.toLocaleString()}` },
    { label: 'Fulfillment', value: `${sales.kpi.fulfillment_rate}%` }
  ];

  return (
    <div className="container" style={{ minWidth: 0 }}>

      {/* Banner */}
      <AnalyticsBanner 
        title="Sales Performance"
        subtitle1="Month-to-Date Analysis · April 2026"
        subtitle2="Period: 2026-04-01 to 2026-04-21 · Region: Global"
        metrics={metrics}
        healthScore={sales.kpi.fulfillment_rate}
        healthLegend={healthLegend}
        colors={colors}
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <KPICard label="Gross Revenue" value={`Rs. ${(sales.kpi.total_revenue / 10000000).toFixed(2)}B`} sub="Total revenue for the period" color={colors[0]} icon={<DollarSign size={18}/>} />
        <KPICard label="Order Fulfillment" value={`${sales.kpi.fulfillment_rate}%`} sub={`${sales.kpi.delivered_orders.toLocaleString()} orders delivered`} color={colors[2]} icon={<Package size={18}/>} />
        <KPICard label="Avg Order Value" value={`Rs. ${sales.kpi.average_order_value.toLocaleString()}`} sub="Per unique transaction" color="#f59e0b" icon={<TrendingUp size={18}/>} />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Daily Revenue Trends (Last 10 Days)</h3>
          <div style={{ height: 260 }}>
            <Line 
              key={palette.id}
              data={{ 
                labels: sales.dailyTrends.map(t => t.date.substring(5)), 
                datasets: [{ 
                  label: 'Revenue', 
                  data: sales.dailyTrends.map(t => t.revenue), 
                  borderColor: colors[0], 
                  backgroundColor: `${colors[0]}22`, 
                  fill: true, 
                  tension: 0.4,
                  pointRadius: 4,
                  pointHoverRadius: 6
                }] 
              }} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: { 
                  y: { grid: { color: '#f3f4f6' }, ticks: { callback: (v) => v/1000000 + 'M' } },
                  x: { grid: { display: false } }
                } 
              }} 
            />
          </div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Warehouse Revenue Share</h3>
          <div style={{ height: 260 }}>
            <Doughnut 
              key={palette.id}
              data={{ 
                labels: sales.warehouseShare.map(w => `WH-${w.warehouse_id}`), 
                datasets: [{ 
                  data: sales.warehouseShare.map(w => w.revenue), 
                  backgroundColor: colors, 
                  borderWidth: 2,
                  borderColor: '#fff',
                  cutout: '70%'
                }] 
              }} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Table Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', minWidth: 0 }}>
        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Top Performing Products</h3>
            <span style={{ fontSize: '0.75rem', color: colors[0], fontWeight: 600, cursor: 'pointer' }}>View All Report <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#6b7280', fontWeight: 600 }}>Product Name</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#6b7280', fontWeight: 600 }}>Orders</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#6b7280', fontWeight: 600 }}>Revenue (NPR)</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#6b7280', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.topProducts.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i === sales.topProducts.length - 1 ? 'none' : '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: '#111827' }}>{p.name}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>{p.orders.toLocaleString()}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700 }}>Rs. {p.revenue.toLocaleString()}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: i < 3 ? '#d1fae5' : '#f3f4f6', color: i < 3 ? '#065f46' : '#6b7280', fontSize: '0.7rem', fontWeight: 700 }}>
                        {i < 3 ? 'TOP SELLER' : 'STABLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Payment Method Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {sales.paymentMethods.map((pm, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length] }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pm.method}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{pm.success_rate}% Success</span>
                </div>
                <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pm.success_rate}%`, background: colors[i % colors.length], borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                  <span>{pm.transactions.toLocaleString()} Txns</span>
                  <span style={{ fontWeight: 600 }}>Rs. {(pm.revenue/1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, style }) => (
  <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default SalesPage;
