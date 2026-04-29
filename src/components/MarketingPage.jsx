import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import realData from '../data.json';
import AnalyticsBanner from './AnalyticsBanner';
import { TrendingUp, TrendingDown, Users, Gift, ShoppingCart, CreditCard, MapPin, Star } from 'lucide-react';

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

const MarketingPage = ({ palette }) => {
  const timePeriod = 'last_month';
  const queries = realData[timePeriod]?.queries || [];
  const getQuery = (name) => queries.find(q => q.query_name === name)?.result || [];

  const customerHealth = getQuery('Customer Base Health Overview')[0] || {};
  const campaigns = getQuery('Active Marketing Campaign Inventory') || [];
  const cartAbandonment = getQuery('Cart Abandonment Rate and Lost Revenue')[0] || {};
  const paymentOverall = getQuery('Overall Payment Success Rate and Transaction Volume')[0] || {};
  const customerStatus = getQuery('Customer Status and Verification Breakdown') || [];
  const customerGroups = getQuery('Customer Distribution Across Groups') || [];
  const loyaltyPoints = getQuery('Loyalty Points Accumulation Velocity') || [];
  const loyaltyBySegment = getQuery('Loyalty Points by Customer Segment') || [];
  const campaignLaunch = getQuery('Monthly Campaign Launch Activity') || [];
  const coupons = getQuery('Coupon Redemption Rate Analysis') || [];
  const dailyCartAbandonment = getQuery('Daily Cart Abandonment Trend') || [];
  const dailyPayments = getQuery('Daily Payment Conversion Trend') || [];
  const paymentChannels = getQuery('Payment Channel Performance Breakdown') || [];
  const topAddresses = getQuery('Geographic Customer Concentration') || [];
  const loyaltyParticipation = getQuery('Loyalty Program Participation by Activity Level') || [];
  const highRiskCampaigns = getQuery('High-Risk Campaign Alerts') || [];

  const colors = palette.colors;
  const chartOpts = (horizontal) => ({ maintainAspectRatio: false, plugins: { legend: { display: false } }, indexAxis: horizontal ? 'y' : 'x', scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } });

  const healthLegend = [
    { label: 'High Success', value: 8, color: '#10b981' },
    { label: 'Active Loyalty', value: 4, color: '#fbbf24' },
    { label: 'Abandoned Carts', value: 3, color: '#f97316' },
    { label: 'Failed Txns', value: 1, color: '#ef4444' }
  ];

  const totalCampaigns = campaigns.reduce((s, c) => s + (c.total_count || 0), 0);

  const metrics = [
    { label: 'Total Customers', value: (customerHealth.total_customers || 0).toLocaleString() },
    { label: 'Campaign Inventory', value: totalCampaigns.toLocaleString() },
    { label: 'Loyalty Rate', value: `${customerHealth.loyalty_participation_rate || 0}%` },
    { label: 'Payment Success', value: `${paymentOverall.success_rate_pct || 0}%` },
    { label: 'Lost Cart Value', value: (cartAbandonment.abandoned_cart_value || 0) > 1000000 ? `Rs. ${(cartAbandonment.abandoned_cart_value/1000000).toFixed(1)}M` : `Rs. ${(cartAbandonment.abandoned_cart_value || 0).toLocaleString()}` }
  ];

  return (
    <div className="container" style={{ minWidth: 0 }}>

      {/* Banner */}
      <AnalyticsBanner 
        title="Marketing Dashboard"
        subtitle1="Month-to-Date Performance · April 2026"
        subtitle2="Period: Dynamic · Region: Global"
        metrics={metrics}
        healthScore={84}
        healthLegend={healthLegend}
        colors={colors}
      />

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <KPICard label="Total Customers" value={(customerHealth.total_customers || 0).toLocaleString()} sub={`${customerHealth.active_customers || 0} active • ${customerHealth.email_verification_rate || 0}% verified`} color={colors[0]} icon={<Users size={18}/>} />
        <KPICard label="Campaign Inventory" value={totalCampaigns.toLocaleString()} sub={`${(campaigns[0]?.active_count || 0)} coupons • ${(campaigns[1]?.active_count || 0)} offers active`} color={colors[1]} icon={<Gift size={18}/>} />
        <KPICard label="Cart Abandonment" value={`${cartAbandonment.abandonment_rate_pct || 0}%`} sub={`Rs. ${((cartAbandonment.abandoned_cart_value || 0)/1000000).toFixed(1)}M lost value`} color="#ef4444" icon={<ShoppingCart size={18}/>} />
        <KPICard label="Payment Success" value={`${paymentOverall.success_rate_pct || 0}%`} sub={`${(paymentOverall.successful_transactions || 0).toLocaleString()} of ${(paymentOverall.total_transactions || 0).toLocaleString()} txns`} color={colors[2]} icon={<CreditCard size={18}/>} />
      </div>

      {/* Customer Health + Campaign Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Customer Verification</h3>
          <div style={{ height: 180 }}>
            <Doughnut key={palette.id} data={{ labels: customerStatus.map(s => `${s.is_active ? 'Active' : 'Inactive'} / ${s.is_verified ? 'Verified' : 'Unverified'}`), datasets: [{ data: customerStatus.map(s => s.customer_count || 0), backgroundColor: [colors[0], colors[3], colors[1], colors[2]], borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>{customerHealth.email_verification_rate || 0}% email-verified</div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Campaign Inventory</h3>
          <div style={{ height: 180 }}>
            <Bar key={palette.id} data={{ labels: campaigns.map(c => c.campaign_type), datasets: [{ data: campaigns.map(c => c.active_count || 0), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Total: {totalCampaigns} campaigns active</div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Customer Groups</h3>
          <div style={{ height: 180 }}>
            <Doughnut key={palette.id} data={{ labels: customerGroups.map(g => g.group_name), datasets: [{ data: customerGroups.map(g => g.member_count || 0), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
        </div>
      </div>

      {/* Loyalty + Campaign Launch */}
      <div className="section-panel">
        <div className="section-header"><h2>Loyalty & Campaign Analytics</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>LOYALTY POINTS BY PLATFORM</h4>
            <div style={{ height: 220 }}>
              <Bar key={palette.id} data={{ labels: loyaltyPoints.map(l => l.platform_type), datasets: [{ label: 'Points Awarded', data: loyaltyPoints.map(l => l.total_points_awarded || 0), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
            </div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>LOYALTY POINTS BY SEGMENT</h4>
            <div style={{ height: 220 }}>
              <Bar key={palette.id} data={{ labels: loyaltyBySegment.map(s => s.group_name), datasets: [{ label: 'Avg Points', data: loyaltyBySegment.map(s => s.avg_loyalty_points || 0), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
            </div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CAMPAIGN LAUNCH MIX</h4>
            <div style={{ height: 220 }}>
              <Doughnut key={palette.id} data={{ labels: campaignLaunch.map(c => c.campaign_type), datasets: [{ data: campaignLaunch.map(c => c.campaigns_launched || 0), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', cutout: '60%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Performance */}
      <div className="section-panel">
        <div className="section-header"><h2>Coupon Performance</h2> <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px' }}>{highRiskCampaigns.length} High-Risk Coupons</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minWidth: 0, alignItems: 'start' }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>REDEMPTION RATE BY COUPON</h4>
            <div style={{ height: 200 }}>
              <Bar key={palette.id} data={{ labels: coupons.map(c => c.code), datasets: [{ data: coupons.map(c => c.redemption_rate_pct || 0), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } }, scales: { ...chartOpts(false).scales, y: { max: 100, grid: { display: false } } } }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coupons.slice(0, 5).map((c, i) => (
              <div key={i} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.code}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af' }}>{c.performance_tier}</span>
                </div>
                <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${Math.min(c.redemption_rate_pct || 0, 100)}%`, background: colors[i % colors.length], borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{c.total_usage || 0}/{c.usage_limit || 0} used • Rs.{c.discount_value || 0} discount</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Abandonment */}
      <div className="section-panel">
        <div className="section-header"><h2>Cart Abandonment Analysis</h2> <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px' }}>Rs. {((cartAbandonment.abandoned_cart_value || 0)/1000000).toFixed(1)}M Lost</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY CART ABANDONMENT TREND</h4>
            <div style={{ height: 260 }}>
              <Line key={palette.id} data={{ labels: dailyCartAbandonment.slice(-10).map(d => d.cart_date), datasets: [{ label: 'Abandoned Carts', data: dailyCartAbandonment.slice(-10).map(d => d.abandoned_count || 0), borderColor: '#ef4444', backgroundColor: '#ef444422', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ef4444' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Payment Channel Performance</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY PAYMENT CONVERSION TREND</h4>
            <div style={{ height: 260 }}>
              <Line key={palette.id} data={{ labels: dailyPayments.slice(-10).map(d => d.transaction_date), datasets: [{ label: 'Success Rate %', data: dailyPayments.slice(-10).map(d => d.success_rate_pct || 0), borderColor: colors[2], backgroundColor: `${colors[2]}22`, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[2] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PAYMENT METHOD MIX</h4>
            <div style={{ height: 260 }}>
              <Doughnut key={palette.id} data={{ labels: paymentChannels.map(p => p.payment_method), datasets: [{ data: paymentChannels.map(p => p.transaction_count || 0), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Concentration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '0' }}>
        <div className="section-panel" style={{ marginBottom: 0 }}>
          <div className="section-header"><h2>Top Customer Locations</h2></div>
          {topAddresses.slice(0, 8).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topAddresses.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${colors[i % colors.length]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors[i % colors.length] }}><MapPin size={14} /></div>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#374151' }}>{a.address || 'Unknown'}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{a.customer_count || 0}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MarketingPage;
