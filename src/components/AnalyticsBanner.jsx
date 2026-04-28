import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const AnalyticsBanner = ({ 
  title, 
  subtitle1, 
  subtitle2, 
  metrics, 
  healthScore, 
  healthLegend, 
  colors 
}) => {
  const healthData = {
    labels: healthLegend.map(l => l.label),
    datasets: [{
      data: healthLegend.map(l => l.value),
      backgroundColor: healthLegend.map(l => l.color),
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      borderRadius: '24px',
      padding: '2.5rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 10px 40px ${colors[0]}33`
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, margin: 0 }}>{title}</h2>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>REPORT</span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>{subtitle1}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{subtitle2}</div>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '8px', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          <Doughnut
            data={healthData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              events: []
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{healthScore}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.7, letterSpacing: '0.05em' }}>HEALTH SCORE</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {healthLegend.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
              <span style={{ opacity: 0.9 }}>{l.label}: {l.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBanner;
