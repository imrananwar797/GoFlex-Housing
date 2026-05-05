import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DateTimeTicker from '../common/DateTimeTicker';

export default function DashboardLayout({ title, children, nav }: { title: string; children: React.ReactNode; nav: { to: string; label: string }[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={open ? 'dash wrap' : 'dash wrap collapsed'}>
      <aside className="dash-aside">
        <button className="dash-toggle" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">≡</button>
        <div className="dash-menu">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'dash-link active' : 'dash-link')}>{n.label}</NavLink>
          ))}
        </div>
      </aside>
      <section className="dash-main">
        <header className="dash-topbar">
          <h1 className="dash-title">{title}</h1>
          <DateTimeTicker />
        </header>
        <div className="dash-content">{children}</div>
      </section>
    </div>
  );
}
