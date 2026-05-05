import React, { useEffect, useState } from 'react';

function formatNow(tz: string) {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-IN', { timeZone: tz, weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(now);
  return `${date} • ${time} ${tz}`;
}

export default function DateTimeTicker({ timeZone = 'Asia/Kolkata' }: { timeZone?: string }) {
  const [value, setValue] = useState(() => formatNow(timeZone));
  useEffect(() => {
    setValue(formatNow(timeZone));
    const id = setInterval(() => setValue(formatNow(timeZone)), 60 * 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return <span className="time-chip" aria-live="polite">{value}</span>;
}
