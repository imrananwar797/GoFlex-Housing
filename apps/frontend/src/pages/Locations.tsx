import React, { useMemo, useState } from 'react';
import PopularLocations from '../components/locations/PopularLocations';
import { State, City } from 'country-state-city';

export default function Locations(){
  const [stateIso, setStateIso] = useState('KA');
  const [city, setCity] = useState('');
  const states = useMemo(()=> State.getStatesOfCountry('IN'),[]);
  const cities = useMemo(()=> City.getCitiesOfState('IN', stateIso) || [], [stateIso]);

  return (
    <section className="content-wrap pt-40">
      <div className="section-header">
        <span className="section-eyebrow">Network</span>
        <h1 className="section-title">Expansive Footprint</h1>
        <p className="section-subtitle">We are strategically located in India's leading tech hubs and metropolitan centers.</p>
      </div>
      <div className="filter-grid">
        <select className="input" value={stateIso} onChange={(e)=>{setStateIso(e.target.value); setCity('');}}>
          {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
        </select>
        <select className="input" value={city} onChange={(e)=>setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <a className="btn-ghost" href={`/properties?state=${encodeURIComponent(stateIso)}&city=${encodeURIComponent(city)}`}>View Properties</a>
      </div>

      <PopularLocations />
    </section>
  );
}
