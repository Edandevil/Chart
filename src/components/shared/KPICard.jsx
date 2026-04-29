import React from 'react';

/**
 * Shared KPI Card component used across all dashboard pages.
 * Displays a metric label, value, sub-text, and a colored icon badge.
 *
 * @param {string} label - Uppercase label shown at the top
 * @param {string|number} value - Primary metric value
 * @param {string} sub - Secondary descriptive text
 * @param {string} color - Hex color for icon badge background + icon tint
 * @param {ReactNode} icon - Lucide icon element
 */
const KPICard = ({ label, value, sub, color, icon }) => (
  <div className="section-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}22`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{sub}</div>
  </div>
);

export default KPICard;
