import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { mkt } from '../marketingData';
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
  const colors = palette.colors;
  const chartOpts = (horizontal) => ({ maintainAspectRatio: false, plugins: { legend: { display: false } }, indexAxis: horizontal ? 'y' : 'x', scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } });

  return (
    <div className="container" style={{ minWidth: 0 }}>

      {/* Banner */}
      <div className="banner" style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, borderRadius: '16px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Marketing Dashboard <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>LAST WEEK</span></h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Period: <b>2026-04-13 to 2026-04-19</b> • Customers: <b>{mkt.customerHealth.total_customers.toLocaleString()}</b> • Loyalty: <b>{mkt.customerHealth.loyalty_participation_rate}%</b></div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '5px' }}>Total Transactions: <b>{mkt.paymentOverall.total_transactions.toLocaleString()}</b> • Success Rate: <b>{mkt.paymentOverall.success_rate_pct}%</b> • Cart Abandonment: <b>{mkt.cartAbandonment.abandonment_rate_pct}%</b></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', border: `4px solid ${colors[2]}`, width: '110px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{mkt.paymentOverall.success_rate_pct}%</div>
            <div style={{ fontSize: '0.5rem', fontWeight: 700 }}>PAYMENT SUCCESS</div>
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ color: '#ef4444', marginBottom: 4 }}>● Cart Abandon: {mkt.cartAbandonment.abandonment_rate_pct}%</div>
            <div style={{ color: '#f59e0b', marginBottom: 4 }}>● Coupon Redemptions: {mkt.campaigns[0].total_redemptions}</div>
            <div style={{ color: colors[2], marginBottom: 4 }}>● Loyalty Rate: {mkt.customerHealth.loyalty_participation_rate}%</div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>● Active Offers: {mkt.campaigns[1].active_count}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <KPICard label="Total Customers" value={mkt.customerHealth.total_customers.toLocaleString()} sub={`${mkt.customerHealth.active_customers} active • ${mkt.customerHealth.email_verification_rate}% verified`} color={colors[0]} icon={<Users size={18}/>} />
        <KPICard label="Campaign Inventory" value={(mkt.campaigns[0].total_count + mkt.campaigns[1].total_count).toLocaleString()} sub={`${mkt.campaigns[0].active_count} coupons • ${mkt.campaigns[1].active_count} offers active`} color={colors[1]} icon={<Gift size={18}/>} />
        <KPICard label="Cart Abandonment" value={`${mkt.cartAbandonment.abandonment_rate_pct}%`} sub={`Rs. ${(mkt.cartAbandonment.abandoned_cart_value/1000000).toFixed(1)}M lost value`} color="#ef4444" icon={<ShoppingCart size={18}/>} />
        <KPICard label="Payment Success" value={`${mkt.paymentOverall.success_rate_pct}%`} sub={`${mkt.paymentOverall.successful_transactions.toLocaleString()} of ${mkt.paymentOverall.total_transactions.toLocaleString()} txns`} color={colors[2]} icon={<CreditCard size={18}/>} />
      </div>

      {/* Customer Health + Campaign Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px', minWidth: 0 }}>
        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Customer Verification</h3>
          <div style={{ height: 180 }}>
            <Doughnut key={palette.id} data={{ labels: mkt.customerStatus.map(s => `${s.status} / ${s.verified ? 'Verified' : 'Unverified'}`), datasets: [{ data: mkt.customerStatus.map(s => s.customer_count), backgroundColor: [colors[0], colors[3]], borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>{mkt.customerHealth.email_verification_rate}% email-verified</div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Campaign Inventory</h3>
          <div style={{ height: 180 }}>
            <Bar key={palette.id} data={{ labels: mkt.campaigns.map(c => c.campaign_type), datasets: [{ data: mkt.campaigns.map(c => c.active_count || 0), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Total redemptions: {mkt.campaigns[0].total_redemptions} coupons • Rs.{(mkt.campaigns[3].total_redemptions/1000).toFixed(0)}K donations</div>
        </div>

        <div className="section-panel" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Customer Groups</h3>
          <div style={{ height: 180 }}>
            <Doughnut key={palette.id} data={{ labels: mkt.customerGroups.map(g => g.group_name), datasets: [{ data: mkt.customerGroups.map(g => g.member_count), backgroundColor: [colors[0], colors[1], colors[2]], borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem' }}>
            {mkt.customerGroups.map((g, i) => <div key={i} style={{ textAlign: 'center' }}><b style={{ color: colors[i] }}>{g.percentage}%</b><br/>{g.group_name}</div>)}
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
              <Bar key={palette.id} data={{ labels: mkt.loyaltyPoints.map(l => l.platform_type), datasets: [{ label: 'Points Awarded', data: mkt.loyaltyPoints.map(l => l.total_points_awarded), backgroundColor: colors, borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#6b7280' }}>Total: {mkt.loyaltyPoints.reduce((s, l) => s + l.total_points_awarded, 0).toLocaleString()} pts across {mkt.loyaltyPoints.reduce((s, l) => s + l.total_transactions, 0).toLocaleString()} txns</div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>LOYALTY POINTS BY SEGMENT</h4>
            <div style={{ height: 220 }}>
              <Bar key={palette.id} data={{ labels: mkt.loyaltyBySegment.map(s => s.group_name), datasets: [{ label: 'Avg Points', data: mkt.loyaltyBySegment.map(s => s.avg_loyalty_points), backgroundColor: [colors[2], colors[1], colors[0]], borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } } }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#6b7280' }}>Gold avg: {mkt.loyaltyBySegment[0].avg_loyalty_points.toLocaleString()} pts</div>
          </div>

          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>CAMPAIGN LAUNCH MIX</h4>
            <div style={{ height: 220 }}>
              <Doughnut key={palette.id} data={{ labels: mkt.campaignLaunch.map(c => c.campaign_type), datasets: [{ data: mkt.campaignLaunch.map(c => c.campaigns_launched), backgroundColor: [colors[1], colors[0], colors[2]], borderWidth: 3, borderColor: '#fff', cutout: '60%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#6b7280', textAlign: 'center' }}>464 total campaigns launched this period</div>
          </div>
        </div>
      </div>

      {/* Coupon Performance */}
      <div className="section-panel">
        <div className="section-header"><h2>Coupon Performance</h2> <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px' }}>{mkt.highRiskCampaigns.length} High-Risk Coupons</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minWidth: 0, alignItems: 'start' }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>REDEMPTION RATE BY COUPON</h4>
            <div style={{ height: 200 }}>
              <Bar key={palette.id} data={{ labels: mkt.coupons.map(c => c.code), datasets: [{ data: mkt.coupons.map(c => c.redemption_rate_pct), backgroundColor: mkt.coupons.map(c => c.performance_tier === 'Fully Redeemed' ? colors[2] : c.performance_tier === 'High Performer' ? colors[1] : '#ef4444'), borderRadius: 6 }] }} options={{ ...chartOpts(false), plugins: { legend: { display: false } }, scales: { ...chartOpts(false).scales, y: { max: 100, grid: { display: false } } } }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mkt.coupons.map((c, i) => (
              <div key={i} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.code}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: c.performance_tier === 'Fully Redeemed' ? '#d1fae5' : c.performance_tier === 'High Performer' ? '#dbeafe' : '#fee2e2', color: c.performance_tier === 'Fully Redeemed' ? '#065f46' : c.performance_tier === 'High Performer' ? '#1e40af' : '#991b1b' }}>{c.performance_tier}</span>
                </div>
                <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${Math.min(c.redemption_rate_pct, 100)}%`, background: c.performance_tier === 'Fully Redeemed' ? colors[2] : c.performance_tier === 'High Performer' ? colors[1] : '#ef4444', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{c.total_usage}/{c.usage_limit} used • Rs.{c.discount_value} discount • {c.redemption_rate_pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Abandonment */}
      <div className="section-panel">
        <div className="section-header"><h2>Cart Abandonment Analysis</h2> <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px' }}>Rs. {(mkt.cartAbandonment.abandoned_cart_value/1000000).toFixed(1)}M Lost</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY CART ABANDONMENT TREND</h4>
            <div style={{ height: 260 }}>
              <Line key={palette.id} data={{ labels: mkt.dailyCartAbandonment.map(d => d.cart_date), datasets: [{ label: 'Abandoned Carts', data: mkt.dailyCartAbandonment.map(d => d.abandoned_count), borderColor: '#ef4444', backgroundColor: '#ef444422', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ef4444' }, { label: 'Total Carts', data: mkt.dailyCartAbandonment.map(d => d.carts_created), borderColor: colors[0], backgroundColor: `${colors[0]}11`, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[0] }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>ABANDONMENT BY CART VALUE</h4>
            <div style={{ height: 260 }}>
              <Bar key={palette.id} data={{ labels: mkt.cartBySegment.map(s => s.cart_value_segment), datasets: [{ label: 'Abandon Rate %', data: mkt.cartBySegment.map(s => s.abandonment_rate_pct), backgroundColor: mkt.cartBySegment.map((_, i) => colors[i] || colors[0]), borderRadius: 4 }] }} options={{ ...chartOpts(true), plugins: { legend: { display: false } }, scales: { x: { max: 100, grid: { display: false } }, y: { grid: { display: false } } } }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
          {[{ label: 'Abandonment Rate', value: `${mkt.cartAbandonment.abandonment_rate_pct}%`, color: '#ef4444' }, { label: 'Avg Abandoned Value', value: `Rs. ${Math.round(mkt.cartAbandonment.avg_abandoned_cart_value).toLocaleString()}`, color: colors[1] }, { label: 'Converted Value', value: `Rs. ${(mkt.cartAbandonment.converted_cart_value/1000).toFixed(0)}K`, color: colors[2] }].map((m, i) => (
            <div key={i} style={{ background: '#f9fafb', padding: '1.2rem', borderRadius: '12px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="section-panel">
        <div className="section-header"><h2>Payment Channel Performance</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', minWidth: 0 }}>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>DAILY PAYMENT CONVERSION TREND</h4>
            <div style={{ height: 260 }}>
              <Line key={palette.id} data={{ labels: mkt.dailyPayments.map(d => d.transaction_date), datasets: [{ label: 'Success Rate %', data: mkt.dailyPayments.map(d => d.success_rate_pct), borderColor: colors[2], backgroundColor: `${colors[2]}22`, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[2], yAxisID: 'y' }, { label: 'Transactions', data: mkt.dailyPayments.map(d => d.daily_transactions), borderColor: colors[0], backgroundColor: `${colors[0]}11`, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: colors[0], yAxisID: 'y1' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } }, scales: { y: { type: 'linear', position: 'left', grid: { display: false }, title: { display: true, text: 'Success %', font: { size: 9 } } }, y1: { type: 'linear', position: 'right', grid: { display: false }, title: { display: true, text: 'Transactions', font: { size: 9 } } }, x: { grid: { display: false } } } }} />
            </div>
          </div>
          <div className="chart-item" style={{ minWidth: 0 }}>
            <h4>PAYMENT METHOD MIX</h4>
            <div style={{ height: 260 }}>
              <Doughnut key={palette.id} data={{ labels: mkt.paymentChannels.map(p => p.payment_method), datasets: [{ data: mkt.paymentChannels.map(p => p.transaction_count), backgroundColor: colors, borderWidth: 3, borderColor: '#fff', cutout: '65%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Payment Method', 'Transactions', 'Successful', 'Success Rate', 'Total Revenue', 'Successful Revenue'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {mkt.paymentChannels.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.payment_method}</td>
                  <td style={{ padding: '10px 12px' }}>{p.transaction_count.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px' }}>{p.successful_count.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: p.success_rate_pct > 90 ? '#d1fae5' : p.success_rate_pct > 50 ? '#fef3c7' : '#fee2e2', color: p.success_rate_pct > 90 ? '#065f46' : p.success_rate_pct > 50 ? '#92400e' : '#991b1b', fontWeight: 700 }}>{p.success_rate_pct}%</span></td>
                  <td style={{ padding: '10px 12px' }}>Rs. {(p.total_revenue/1000000).toFixed(2)}M</td>
                  <td style={{ padding: '10px 12px', color: colors[2], fontWeight: 600 }}>Rs. {(p.successful_revenue/1000000).toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Concentration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '0' }}>
        <div className="section-panel" style={{ marginBottom: 0 }}>
          <div className="section-header"><h2>Top Customer Locations</h2></div>
          {mkt.topAddresses.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < mkt.topAddresses.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${colors[i % colors.length]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors[i % colors.length] }}><MapPin size={14} /></div>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#374151' }}>{a.address}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{a.customer_count}</span>
            </div>
          ))}
        </div>

        <div className="section-panel" style={{ marginBottom: 0 }}>
          <div className="section-header"><h2>Loyalty Participation</h2></div>
          <div style={{ height: 200 }}>
            <Doughnut key={palette.id} data={{ labels: mkt.loyaltyParticipation.map(l => l.loyalty_status), datasets: [{ data: mkt.loyaltyParticipation.map(l => l.customer_count), backgroundColor: [colors[2], colors[3]], borderWidth: 3, borderColor: '#fff', cutout: '68%' }] }} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mkt.loyaltyParticipation.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', padding: '10px 14px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={14} color={colors[i]} /><span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{l.loyalty_status}</span></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>{l.customer_count.toLocaleString()}</div><div style={{ fontSize: '0.7rem', color: '#6b7280' }}>avg {l.avg_loyalty_points} pts • {l.percentage}%</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MarketingPage;
