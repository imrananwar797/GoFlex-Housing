import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const COLORS = ['#60a5fa','#34d399','#f59e0b','#ef4444','#a78bfa'];

export function AreaWidget({ data, series }: { data: any[]; series: { dataKey: string; color: string }[] }) {
  return (
    <div className="info-card" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <XAxis dataKey="day" stroke="#9aa4c7"/>
          <YAxis stroke="#9aa4c7"/>
          <Tooltip contentStyle={{ background: '#121726', border: '1px solid rgba(255,255,255,.06)' }}/>
          {series.map((s, i) => (
            <Area key={s.dataKey} type="monotone" dataKey={s.dataKey} stroke={s.color} fill={s.color} fillOpacity={0.2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieWidget({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="info-card" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
            {data.map((_, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#121726', border: '1px solid rgba(255,255,255,.06)' }}/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarWidget({ data }: { data: { day: string; ordered: number; served: number }[] }) {
  return (
    <div className="info-card" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" stroke="#9aa4c7"/>
          <YAxis stroke="#9aa4c7"/>
          <Tooltip contentStyle={{ background: '#121726', border: '1px solid rgba(255,255,255,.06)' }}/>
          <Legend />
          <Bar dataKey="ordered" stackId="a" fill="#60a5fa" />
          <Bar dataKey="served" stackId="a" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
