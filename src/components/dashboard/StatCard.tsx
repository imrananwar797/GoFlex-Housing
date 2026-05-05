import React from 'react';

export default function StatCard({ title, value, suffix, trend }: { title: string; value: number | string; suffix?: string; trend?: number }) {
  const isUp = (trend ?? 0) >= 0;
  return (
    <div className="info-card">
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        {trend != null && <span style={{ color: isUp ? '#22c55e' : '#ef4444', fontSize: 12 }}>{isUp ? '▲' : '▼'} {Math.abs(trend)}%</span>}
      </div>
      <p className="card-text" style={{ fontSize: 22, color: '#fff' }}>
        {value}{suffix ? ` ${suffix}` : ''}
      </p>
    </div>
  );
}
