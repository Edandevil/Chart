import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DateFilter = ({ colors }) => {
  const [activeRange, setActiveRange] = useState('Month to Date');
  const ranges = ['Yesterday', 'Week to Date', 'Last Week', 'Month to Date', 'Last Month'];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Calendar size={16} color="#6b7280" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>Date Range</span>
      </div>
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
            onClick={() => setActiveRange(range)}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              fontSize: '0.85rem',
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
  );
};

export default DateFilter;
