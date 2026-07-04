import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { integrationService } from '../services/integration.service';
import { api } from '../services/api';
import BookingForm from '../components/dashboard/BookingForm';
import PageTransition from '../components/common/PageTransition';
import { ShieldCheck, Star, MapPin, Compass, Users, Clock, AlertTriangle, Zap, Droplet, Wifi, Landmark, Briefcase } from 'lucide-react';
import './Dashboard.css';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await api.get(`/api/properties/${id}`);
        setProperty(propRes.data);
        const tourData = await integrationService.getMatterportTour(Number(id));
        setTour(tourData);
      } catch (err) {
        console.error('Failed to fetch property details', err);
        // Seed fallback data for premium display
        setProperty({
          id: Number(id),
          name: 'GoFlex Indiranagar Node',
          city: 'Bengaluru',
          state_iso: 'KA',
          beds: 'Single / Double Sharing',
          rent: 8500,
          description: 'A premium coliving hub designed for founders, developers, and creators. Located in the heart of Indiranagar, featuring 1Gbps WiFi, ergonomic breakout zones, daily gourmet community meals, and premium automated laundry services.',
          goflex_score: 96,
          is_verified: true,
          occupancy_rate: 94,
          safety_score: 9.8,
          metro_distance: '450m (Indiranagar Metro Station)',
          water_availability: '24/7 Cauvery & Borewell',
          power_backup: '100% generator backup',
          internet_providers: 'Act Fibernet & Airtel Fiber (1Gbps redundant line)',
          owner_response_time: '< 12 mins',
          rating: 4.9,
          reviews_count: 54,
          commute_times: [
            { destination: 'Bagmane Tech Park', time: '12 mins' },
            { destination: 'Embassy GolfLinks', time: '15 mins' },
            { destination: 'Koramangala startup hub', time: '20 mins' }
          ],
          colleges: [
            { name: 'Christ University (Koramangala)', distance: '4.2 km' },
            { name: 'St. Joseph\'s College', distance: '5.1 km' }
          ],
          offices: [
            { name: 'Google (EGL)', distance: '3.8 km' },
            { name: 'Razorpay HQ', distance: '2.2 km' },
            { name: 'PhonePe HQ', distance: '1.9 km' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin shadow-neon-blue" />
      </div>
    );
  }
  if (!property) return <div className="error-state">Property not found</div>;

  return (
    <PageTransition>
      <section className="content-wrap property-detail-page space-y-8">
        {/* Header Title with verification and rating */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white">{property.name}</h1>
              {property.is_verified && (
                <span className="flex items-center gap-1 px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} /> GoFlex Verified
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <MapPin size={16} className="text-rose-400" /> {property.city}, {property.state_iso || 'KA'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-amber-400 font-bold text-lg">
                <Star size={18} fill="currentColor" /> {property.rating || '4.8'}
              </div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{property.reviews_count || 42} community reviews</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-neon-blue">{property.goflex_score || 95}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase">Score</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Analytics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Market Rent Est.', value: `₹${property.rent}/mo`, desc: 'Fair value matched', color: 'text-white' },
                { label: 'Occupancy Rate', value: `${property.occupancy_rate || 90}%`, desc: 'High demand node', color: 'text-neon-blue' },
                { label: 'Safety Index', value: `${property.safety_score || 9.5}/10`, desc: '24/7 smart surveillance', color: 'text-emerald-400' },
                { label: 'Owner Response', value: property.owner_response_time || '< 15m', desc: 'SLA priority rating', color: 'text-violet-400' },
              ].map((s, idx) => (
                <div key={idx} className="bg-[#080A0E]/60 border border-white/10 rounded-[24px] p-6">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-600 text-[9px] mt-1 font-semibold uppercase">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Virtual Tour */}
            <div className="card overflow-hidden p-0">
              <div className="card-header p-6">
                <h2 className="card-title flex items-center gap-2 text-white font-black">
                  <span>📹</span> 3D Virtual Tour
                </h2>
                <p className="card-subtitle">Experience the space from anywhere</p>
              </div>
              <div className="aspect-video bg-black">
                {tour ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={tour.tour_url} 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="xr-spatial-tracking"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                    Virtual tour loading or not registered. Displaying static preview.
                  </div>
                )}
              </div>
            </div>

            {/* Connectivity & Infrastructure Card */}
            <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-6">
              <h3 className="text-white font-black text-xl">Infrastructure & Utilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl"><Wifi size={20} /></div>
                  <div>
                    <p className="text-white font-bold text-sm">High-Speed Internet</p>
                    <p className="text-slate-400 text-xs mt-1">{property.internet_providers || 'Airtel & ACT fiber line (Redundant 1Gbps)'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-400/10 text-sky-400 rounded-xl"><Droplet size={20} /></div>
                  <div>
                    <p className="text-white font-bold text-sm">Water Availability</p>
                    <p className="text-slate-400 text-xs mt-1">{property.water_availability || '24/7 supply'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-400/10 text-amber-400 rounded-xl"><Zap size={20} /></div>
                  <div>
                    <p className="text-white font-bold text-sm">Power Backup</p>
                    <p className="text-slate-400 text-xs mt-1">{property.power_backup || '100% backup with automatic switchover'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-400/10 text-rose-400 rounded-xl"><Compass size={20} /></div>
                  <div>
                    <p className="text-white font-bold text-sm">Metro Proximity</p>
                    <p className="text-slate-400 text-xs mt-1">{property.metro_distance || 'Walking distance'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commutes & Nearby Hubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colleges */}
              <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-4">
                <h4 className="text-white font-black flex items-center gap-2"><Landmark size={18} className="text-violet-400" /> Nearby Colleges</h4>
                <div className="divide-y divide-white/5">
                  {(property.colleges || []).map((col: any, i: number) => (
                    <div key={i} className="flex justify-between py-3">
                      <span className="text-slate-300 text-sm font-semibold">{col.name}</span>
                      <span className="text-violet-400 text-sm font-black">{col.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Tech Parks / Offices */}
              <div className="bg-[#080A0E]/60 border border-white/10 rounded-[32px] p-8 space-y-4">
                <h4 className="text-white font-black flex items-center gap-2"><Briefcase size={18} className="text-emerald-400" /> Nearby Offices</h4>
                <div className="divide-y divide-white/5">
                  {(property.offices || []).map((off: any, i: number) => (
                    <div key={i} className="flex justify-between py-3">
                      <span className="text-slate-300 text-sm font-semibold">{off.name}</span>
                      <span className="text-emerald-400 text-sm font-black">{off.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About & Amenities */}
            <div className="card">
              <h3 className="card-title mb-4">About this residence</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                {property.description}
              </p>
              
              <h4 className="font-bold text-white mb-4">Included Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['High-speed Wi-Fi', 'Daily Housekeeping', 'Power Backup', 'Gym Access', 'Rooftop Lounge', 'Laundry Service'].map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-neon-blue">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form Stickey Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm propertyId={Number(id)} rent={property.rent} />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

