import React from 'react';
import { RefreshCw } from 'lucide-react';

const PageHeader = ({ title, subtitle, colors, activeRange, onRangeChange }) => {
  const ranges = ['Yesterday', 'Week to Date', 'Last Week', 'Month to Date', 'Last Month'];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem',
      padding: '0 4px'
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0 0' }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '12px',
          background: colors[0],
          color: 'white',
          border: 'none',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 4px 12px ${colors[0]}44`,
          transition: 'transform 0.2s ease'
        }}>
          <RefreshCw size={16} />
          Sync All
        </button>

        <div style={{ 
          display: 'inline-flex', 
          background: '#f3f4f6', 
          padding: '4px', 
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeRange === range ? 'white' : 'transparent',
                color: activeRange === range ? '#111827' : '#6b7280',
                boxShadow: activeRange === range ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
