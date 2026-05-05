import React, { useEffect, useMemo, useState } from 'react';

function getDeviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

function tzToCity(tz: string): string {
  const parts = tz.split('/');
  const city = parts[parts.length - 1] || tz;
  return city.replace(/_/g, ' ');
}

function getSelectedCityFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    if (city && city.trim()) return city.trim();
  } catch {}
  return null;
}

function formatDate(now: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(now);
}

function formatClock(now: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
}

export default function LocationClock({ timeZone }: { timeZone?: string }) {
  const tz = useMemo(() => timeZone || getDeviceTimeZone(), [timeZone]);
  const [now, setNow] = useState(() => new Date());

  const displayCity = useMemo(() => {
    const selected = getSelectedCityFromUrl();
    return selected || tzToCity(tz);
  }, [tz]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="nav-left-time" aria-live="polite">
      <div className="ltb-location" title={tz}>{displayCity}</div>
      <div className="ltb-date">{formatDate(now, tz)}</div>
      <div className="ltb-clock" aria-label="Digital clock">
        {formatClock(now, tz)}
      </div>
    </div>
  );
}
