import { useEffect, useMemo, useState } from 'react';
import { State, City } from 'country-state-city';
import { useSearchParams } from 'react-router-dom';
import { fetchProperties, PropertyRecord } from '../services/property.service';
import PropertyCard from '../components/dashboard/PropertyCard';
import PageTransition from '../components/common/PageTransition';

export default function Properties(){
  const [params] = useSearchParams();
  const [stateIso, setStateIso] = useState<string>(params.get('state') || 'KA');
  const [city, setCity] = useState<string>(params.get('city') || '');
  const [q, setQ] = useState(params.get('search') || '');
  const [min, setMin] = useState(Number(params.get('min') || 8000));
  const [max, setMax] = useState(Number(params.get('max') || 20000));
  const [beds, setBeds] = useState<'All'|'Single'|'Double'|'Triple'>((params.get('beds') as any) || 'All');
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const states = useMemo(()=> State.getStatesOfCountry('IN'),[]);
  const cities = useMemo(()=> City.getCitiesOfState('IN', stateIso) || [], [stateIso]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProperties({
          stateIso,
          city,
          minRent: min,
          maxRent: max,
          beds,
          search: q,
        });
        if (!ignore) {
          setProperties(data);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError('We could not load properties right now. Please try again in a moment.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [stateIso, city, min, max, beds, q]);

  return (
    <PageTransition>
      <section className="content-wrap pt-40">
        <div className="section-header">
          <span className="section-eyebrow">Inventory</span>
          <h1 className="section-title">Discover Your Future Home</h1>
          <p className="section-subtitle">Browse through our curated selection of high-performance living spaces designed for modern residents.</p>
        </div>
        <div className="filter-grid">
          <input className="input" placeholder="Search name" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={stateIso} onChange={(e)=>{setStateIso(e.target.value); setCity('');}}>
            {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
          </select>
          <select className="input" value={city} onChange={(e)=>setCity(e.target.value)}>
            <option value="">All cities</option>
            {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select className="input" value={beds} onChange={(e)=>setBeds(e.target.value as any)}>
            <option>All</option>
            <option>Single</option>
            <option>Double</option>
            <option>Triple</option>
          </select>
          <div className="range">
            <input className="input" type="number" value={min} onChange={(e)=>setMin(Number(e.target.value))} />
            <span className="range-sep">to</span>
            <input className="input" type="number" value={max} onChange={(e)=>setMax(Number(e.target.value))} />
          </div>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="cards-grid" aria-live="polite">
          {loading && properties.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <article key={`skeleton-${index}`} className="property-card property-placeholder" aria-hidden="true">
                <div className="property-placeholder-thumb" />
                <div className="property-body">
                  <div className="property-placeholder-line property-placeholder-title" />
                  <div className="property-placeholder-line property-placeholder-meta" />
                  <div className="property-placeholder-line property-placeholder-occupancy" />
                </div>
              </article>
            ))
          ) : (
            properties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))
          )}

          {!loading && properties.length === 0 && !error && (
            <p>No properties matched your filters. Try adjusting the criteria.</p>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
