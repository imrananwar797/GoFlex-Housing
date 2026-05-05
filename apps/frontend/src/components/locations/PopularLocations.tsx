import React, { useMemo, useState } from 'react';
import { State, City } from 'country-state-city';

function withParams(src: string, w: number){
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
}

const cityPhotoMap: Record<string,string> = {
  Mumbai: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
  "New Delhi": 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg',
  Delhi: 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg',
  Jaipur: 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg',
  Agra: 'https://images.pexels.com/photos/204354/pexels-photo-204354.jpeg',
  Varanasi: 'https://images.pexels.com/photos/1574677/pexels-photo-1574677.jpeg',
  Kolkata: 'https://images.pexels.com/photos/532557/pexels-photo-532557.jpeg',
  Chennai: 'https://images.pexels.com/photos/1739476/pexels-photo-1739476.jpeg',
  Bengaluru: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
  Bangalore: 'https://images.pexels.com/photos/1819644/pexels-photo-1819644.jpeg',
  Hyderabad: 'https://images.pexels.com/photos/415640/pexels-photo-415640.jpeg',
  Panaji: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
  Goa: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
  Pune: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
  Ahmedabad: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg',
  "Port Blair": 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg'
};

const scenicFallbacks = [
  'https://images.pexels.com/photos/204354/pexels-photo-204354.jpeg',
  'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg',
  'https://images.pexels.com/photos/1574677/pexels-photo-1574677.jpeg',
  'https://images.pexels.com/photos/415640/pexels-photo-415640.jpeg',
  'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg',
  'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg'
];

function photoForCity(name: string){
  if (cityPhotoMap[name]) return cityPhotoMap[name];
  // deterministic fallback by hashing name
  let h = 0; for (let i=0;i<name.length;i++){h = (h*31 + name.charCodeAt(i))>>>0;}
  return scenicFallbacks[h % scenicFallbacks.length];
}

export default function PopularLocations() {
  const states = useMemo(() => State.getStatesOfCountry('IN'), []);
  const [activeIso, setActiveIso] = useState(states[0]?.isoCode || 'KA');
  const [query, setQuery] = useState('');

  const cities = useMemo(() => {
    try {
      const list = City.getCitiesOfState('IN', activeIso) || [];
      const q = query.trim().toLowerCase();
      return q ? list.filter(c => c.name.toLowerCase().includes(q)) : list;
    } catch {
      return [] as ReturnType<typeof City.getCitiesOfState>;
    }
  }, [activeIso, query]);

  return (
    <div className="locations-full">
      <div
        className="state-scroller"
        role="tablist"
        aria-label="States of India"
        onKeyDown={(e) => {
          const idx = states.findIndex(s => s.isoCode === activeIso);
          if (e.key === 'ArrowRight') setActiveIso(states[(idx + 1) % states.length]?.isoCode || activeIso);
          if (e.key === 'ArrowLeft') setActiveIso(states[(idx - 1 + states.length) % states.length]?.isoCode || activeIso);
        }}
        tabIndex={0}
      >
        {states.map((s) => (
          <button
            key={s.isoCode}
            role="tab"
            aria-selected={activeIso === s.isoCode}
            className={activeIso === s.isoCode ? 'state-chip active' : 'state-chip'}
            onClick={() => setActiveIso(s.isoCode)}
            title={`${s.name}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="city-toolbar">
        <input
          className="city-search"
          placeholder="Search cities"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="city-count">{cities.length} cities</div>
      </div>

      <div className="cities-grid animated-cities">
        {cities.map((c) => {
          const src = photoForCity(c.name);
          return (
            <a key={c.name} className="location-tile reveal-tile" aria-label={c.name} href={`/properties?state=${encodeURIComponent(activeIso)}&city=${encodeURIComponent(c.name)}`}>
              <div className="location-thumb">
                <img
                  className="location-photo"
                  loading="lazy"
                  decoding="async"
                  src={withParams(src, 640)}
                  srcSet={[
                    `${withParams(src,640)} 640w`,
                    `${withParams(src,960)} 960w`,
                    `${withParams(src,1280)} 1280w`,
                    `${withParams(src,1920)} 1920w`,
                  ].join(', ')}
                  sizes="(max-width: 640px) 45vw, (max-width: 1100px) 22vw, 200px"
                  alt={c.name}
                />
              </div>
              <div className="location-name">{c.name}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
