import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { City } from 'country-state-city';

type Suggestion = { label: string; city: string; stateIso: string };

export default function HeaderSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo<Suggestion[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const cities = City.getCitiesOfCountry('IN') || [];
    return cities
      .filter(c => c.name.toLowerCase().includes(term))
      .slice(0, 8)
      .map(c => ({ label: `${c.name}, ${c.stateCode}`, city: c.name, stateIso: c.stateCode || '' }));
  }, [q]);

  function goTo(city?: string, stateIso?: string){
    const qs = new URLSearchParams();
    if (q.trim()) qs.set('search', q.trim());
    if (city) qs.set('city', city);
    if (stateIso) qs.set('state', stateIso);
    nav(`/properties?${qs.toString()}`);
    setOpen(false);
  }

  function onSubmit(e: React.FormEvent){
    e.preventDefault();
    const pick = suggestions[idx];
    if (open && pick){
      goTo(pick.city, pick.stateIso);
    } else {
      goTo();
    }
  }

  return (
    <form className="nav-search" onSubmit={onSubmit} role="search" aria-label="Search">
      <input
        ref={inputRef}
        className="nav-search-input"
        placeholder="Search properties, cities..."
        value={q}
        onChange={(e)=>{setQ(e.target.value); setOpen(true); setIdx(0);}}
        onFocus={()=> suggestions.length && setOpen(true)}
        onBlur={()=> setTimeout(()=>setOpen(false), 120)}
        onKeyDown={(e)=>{
          if (!open || !suggestions.length) return;
          if (e.key==='ArrowDown'){ e.preventDefault(); setIdx((i)=> (i+1)%suggestions.length); }
          if (e.key==='ArrowUp'){ e.preventDefault(); setIdx((i)=> (i-1+suggestions.length)%suggestions.length); }
          if (e.key==='Escape'){ setOpen(false); }
        }}
      />
      {open && suggestions.length>0 && (
        <ul className="search-suggest" role="listbox" aria-label="Search suggestions">
          {suggestions.map((s, i)=> (
            <li
              key={s.label}
              role="option"
              aria-selected={i===idx}
              className={i===idx? 'suggest-item active':'suggest-item'}
              onMouseDown={(e)=>{e.preventDefault(); goTo(s.city, s.stateIso);}}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
