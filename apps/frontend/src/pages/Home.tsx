import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import PopularLocations from '../components/locations/PopularLocations';
import AutoGallery from '../components/gallery/AutoGallery';
import PropertyCard from '../components/dashboard/PropertyCard';
import PageTransition from '../components/common/PageTransition';
import StickyBookingBar from '../components/common/StickyBookingBar';
import { fetchTestimonials, fetchFaqs, TestimonialRecord, FaqRecord } from '../services/content.service';
import { integrationService } from '../services/integration.service';
import { 
  Monitor, 
  Cpu, 
  Activity,
  ArrowRight
} from 'lucide-react';

const valueProps = [
  {
    title: 'Zero-CAPEX Workspace',
    description: 'Elite workstations with Herman Miller seating and high-speed symmetric fiber, pre-integrated into your living suite.',
    icon: Monitor,
    color: 'text-neon-blue'
  },
  {
    title: 'Tech-Enabled Ops',
    description: 'Digital-first property management with instant KYC, IoT utility tracking, and smart access control.',
    icon: Cpu,
    color: 'text-neon-green'
  },
  {
    title: 'Real-time Transparency',
    description: 'Power BI style dashboards for residents and owners to track consumption, billing, and maintenance in real-time.',
    icon: Activity,
    color: 'text-neon-red'
  }
];

function withParams(src: string, w: number) {
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
}

export default function Home() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [faqList, setFaqList] = useState<FaqRecord[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchTestimonials(4).then(items => { if (!ignore) setTestimonials(items); });
    fetchFaqs().then(items => { if (!ignore) setFaqList(items); });
    setRecLoading(true);
    integrationService.getRecommendations().then(data => { if (!ignore) setRecommendations(data.recommendations); }).finally(() => { if (!ignore) setRecLoading(false); });
    return () => { ignore = true; };
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-obsidian-radial overflow-hidden flex items-center pt-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg')] bg-cover bg-center opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/0 via-obsidian/80 to-obsidian" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Future of PropTech
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[1] tracking-tight mb-8">
              Premium Living <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">
                High-Performance
              </span> <br />
              Residents.
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed">
              Experience the world's first Cyberpunk-inspired co-living ecosystem. Tech-enabled, concierge-grade, and built for those who define the future.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="px-10 py-5 bg-neon-blue text-obsidian font-black rounded-2xl flex items-center gap-3 hover:scale-[1.05] active:scale-[0.95] transition-transform shadow-neon-blue uppercase tracking-widest text-sm">
                Explore Suites <ArrowRight size={18} />
              </button>
              <NavLink to="/properties" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors uppercase tracking-widest text-sm">
                View Cities
              </NavLink>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-neon-blue/20 blur-3xl rounded-full" />
            <img 
              src="https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg" 
              className="relative rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
              alt="Premium Suite" 
            />
            <div className="absolute -bottom-10 -right-10 bg-obsidian/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-neon-green text-3xl font-black tracking-tighter mb-1">92%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Average Occupancy</p>
              <div className="mt-4 flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-obsidian bg-slate-800" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sticky Booking Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-30">
          <StickyBookingBar />
        </div>
      </section>

      {/* Value Props Section */}
      <section className="bg-obsidian py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {valueProps.map((prop, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-obsidian-surface border border-white/5 hover:border-white/20 transition-all duration-500"
              >
                <div className={`p-4 rounded-2xl bg-white/5 inline-block mb-8 ${prop.color}`}>
                  <prop.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{prop.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-wrap" aria-labelledby="locs">
        <div className="section-header">
          <span id="locs" className="section-eyebrow">Citywide network</span>
          <h2 className="section-title">Explore neighbourhoods that match your rhythm</h2>
          <p className="section-subtitle">Filter by metro, amenities, or occupancy levels to discover residences that fit your lifestyle.</p>
        </div>
        <PopularLocations />
      </section>

      {recommendations.length > 0 && (
        <section className="content-wrap bg-glass py-12" aria-labelledby="recs">
          <div className="section-header">
            <span id="recs" className="section-eyebrow">Personalized AI Picks</span>
            <h2 className="section-title">Recommended for You</h2>
            <p className="section-subtitle">Based on your preferences and browsing history, we think you'll love these residences.</p>
          </div>
          <div className="cards-grid">
            {recommendations.map((rec: any) => (
              <div key={rec.property_id} className="relative">
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs px-2 py-1 rounded">
                  {rec.score * 100}% Match
                </div>
                {/* For demo, we use placeholder data since we don't have full property records here */}
                <PropertyCard property={{
                  id: Number(rec.property_id),
                  name: `Residency ${rec.property_id}`,
                  city: 'Bengaluru',
                  state_iso: 'KA',
                  beds: 'Double',
                  rent: 15000,
                  occupancy: 85,
                  cover_image_url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'
                }} />
                <p className="mt-2 text-xs text-secondary italic">"{rec.reason}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="content-wrap" aria-labelledby="gallery">
        <div className="section-header">
          <span id="gallery" className="section-eyebrow">Spaces in motion</span>
          <h2 className="section-title">Take a cinematic walk-through</h2>
          <p className="section-subtitle">From rooftop lounges to dedicated focus rooms, every GoFlex property is staged for productivity and downtime.</p>
        </div>
        <AutoGallery />
      </section>

      <section className="content-wrap" aria-labelledby="testimonials">
        <div className="section-header">
          <span id="testimonials" className="section-eyebrow">Resident stories</span>
          <h2 className="section-title">Communities that feel like home</h2>
          <p className="section-subtitle">Real feedback from residents who balance careers, wellness, and community inside GoFlex spaces.</p>
        </div>
        <div className="testimonials-grid" aria-live="polite">
          {testimonials.map((item) => (
            <figure key={item.id} className="testimonial-card">
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                {item.avatar_url ? (
                  <img className="avatar" src={withParams(item.avatar_url, 256)} alt={item.resident_name} />
                ) : null}
                <div>
                  <strong>{item.resident_name}</strong>
                  {item.city ? <span> · {item.city}</span> : null}
                </div>
              </figcaption>
            </figure>
          ))}
          {testimonials.length === 0 && (
            <p className="empty-state">No stories to display yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="content-wrap" aria-labelledby="faq">
        <div className="section-header">
          <span id="faq" className="section-eyebrow">Know before you move</span>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">Transparent policies and concierge support help you move in with confidence.</p>
        </div>
        <div className="faq-panel" aria-live="polite">
          {faqList.map((faq) => (
            <details key={faq.id} className="faq-item">
              <summary className="faq-q">{faq.question}</summary>
              <p className="faq-a">{faq.answer}</p>
            </details>
          ))}
          {faqList.length === 0 && (
            <p className="empty-state">We are preparing the most common questions. Please reach out if you need personal assistance.</p>
          )}
        </div>
      </section>

      <section id="contact" className="cta-strip">
        <div className="cta-strip-inner">
          <div>
            <h3 className="cta-strip-title">Ready to design your stay?</h3>
            <p className="cta-strip-sub">Connect with our concierge team for property walkthroughs, availability, and corporate tie-ups.</p>
          </div>
          <a className="btn-cta" href="mailto:sales@example.com">Talk to us</a>
        </div>
      </section>
    </PageTransition>
  );
}
