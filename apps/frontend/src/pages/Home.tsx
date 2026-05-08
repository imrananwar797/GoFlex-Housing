import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import PopularLocations from '../components/locations/PopularLocations';
import AutoGallery from '../components/gallery/AutoGallery';
import PropertyCard from '../components/dashboard/PropertyCard';
import PageTransition from '../components/common/PageTransition';
import StickyBookingBar from '../components/common/StickyBookingBar';
import { fetchTestimonials, fetchFaqs, TestimonialRecord, FaqRecord } from '../services/content.service';
import { integrationService } from '../services/integration.service';
import { 
  Sparkles,
  Wind,
  Coffee,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

const signatureAmenities = [
  { title: 'Soulful Spaces', desc: 'Light-filled suites designed to nurture creativity and calm.', icon: Wind, color: 'text-blue-300' },
  { title: 'Artisan Living', desc: 'Hand-picked textures and bespoke finishes in every corner.', icon: Sparkles, color: 'text-amber-200' },
  { title: 'Global Pulse', desc: 'A diverse community of visionaries and dreamers.', icon: Globe, color: 'text-purple-300' }
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [faqList, setFaqList] = useState<FaqRecord[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    let ignore = false;
    fetchTestimonials(3).then(items => { if (!ignore) setTestimonials(items); });
    fetchFaqs().then(items => { if (!ignore) setFaqList(items); });
    integrationService.getRecommendations().then(data => { if (!ignore) setRecommendations(data.recommendations); });
    return () => { ignore = true; };
  }, []);

  return (
    <PageTransition>
      <div className="relative">
        {/* Ethereal Hero Section */}
        <section className="relative min-h-screen mesh-gradient-beauty overflow-visible flex items-center pt-20">
          <motion.div 
            style={{ y: y1, opacity }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-40 mix-blend-overlay scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/50 to-obsidian" />
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center lg:text-left grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "circOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mb-8 justify-center lg:justify-start"
              >
                <div className="h-[1px] w-12 bg-neon-blue/50" />
                <span className="text-neon-blue text-[10px] font-black uppercase tracking-[0.5em]">The Art of Living</span>
              </motion.div>

              <h1 className="font-beauty text-7xl lg:text-[110px] text-white leading-[0.85] tracking-tighter mb-10">
                Your <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20">Sanctuary</span>. <br />
                <span className="text-beauty-gradient">Reimagined.</span>
              </h1>

              <p className="text-xl text-slate-300 max-w-xl mb-12 leading-relaxed font-medium mx-auto lg:mx-0">
                Beyond co-living. A curated ecosystem for those who seek elegance, inspiration, and a place to truly belong.
              </p>

              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 209, 255, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-white text-obsidian font-black rounded-[20px] flex items-center gap-3 uppercase tracking-widest text-xs transition-all shadow-2xl"
                >
                  Discover the Suites <ArrowRight size={16} />
                </motion.button>
                <NavLink to="/properties">
                  <motion.div 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)" }}
                    className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-[20px] flex items-center gap-3 uppercase tracking-widest text-xs backdrop-blur-md transition-all"
                  >
                    View Destinations
                  </motion.div>
                </NavLink>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-20 bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
              <div className="glass-beauty p-4 rounded-[50px] rotate-3 hover:rotate-0 transition-transform duration-1000 group">
                <img 
                  src="https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg" 
                  className="rounded-[40px] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/5]" 
                  alt="Beautiful Interior" 
                />
                <div className="absolute -bottom-8 -left-8 glass-beauty p-8 rounded-[30px] shadow-2xl max-w-[200px] -rotate-6">
                  <p className="font-beauty text-3xl text-white mb-1">9.8</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Resident Bliss Score</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Particles/Dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
                animate={{ 
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>

          {/* Sticky Booking Bar - Centered and overlapping bottom boundary */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 flex justify-center z-50">
            <StickyBookingBar />
          </div>
        </section>
      </div>

      {/* Signature Experience Section */}
      <section className="bg-obsidian py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="section-eyebrow justify-center mb-6"
            >
              The Signature Experience
            </motion.span>
            <h2 className="font-beauty text-5xl lg:text-7xl text-white tracking-tighter">Crafted for the <span className="italic font-normal">Discerning</span>.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {signatureAmenities.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mx-auto mb-10 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-700">
                  <item.icon className={`${item.color}`} size={32} />
                </div>
                <h3 className="font-beauty text-3xl text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium px-6">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section (Re-styled) */}
      <section className="bg-obsidian-surface py-40 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8"
          >
            <div className="max-w-2xl">
              <span className="section-eyebrow mb-6">Our Destinations</span>
              <h2 className="font-beauty text-5xl lg:text-7xl text-white tracking-tighter leading-none">Global Reach. <br /> <span className="italic font-normal">Local Soul.</span></h2>
            </div>
            <p className="text-slate-400 max-w-sm mb-2 font-medium">Explore neighborhoods hand-picked for their culture, connectivity, and character.</p>
          </motion.div>
          <PopularLocations />
        </div>
      </section>

      {/* Gallery Section - Cinematic */}
      <section className="py-40 bg-obsidian">
        <div className="max-w-7xl mx-auto px-8 mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Visual Poetry</span>
          </div>
          <h2 className="font-beauty text-5xl lg:text-6xl text-white tracking-tighter">A glimpse into the <br /> <span className="italic font-normal">extraordinary</span>.</h2>
        </div>
        <div className="px-4">
          <AutoGallery />
        </div>
      </section>

      {/* Resident Voices */}
      <section className="bg-obsidian-surface py-40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="section-eyebrow justify-center mb-6">Resident Voices</span>
            <h2 className="font-beauty text-5xl lg:text-6xl text-white tracking-tighter italic font-normal">Testimonials</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {testimonials.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="glass-beauty p-10 rounded-[40px] relative group"
              >
                <div className="text-neon-blue/20 group-hover:text-neon-blue transition-colors duration-500 mb-6">
                  <Sparkles size={32} />
                </div>
                <blockquote className="font-beauty text-2xl text-white leading-tight mb-10 italic">"{item.quote}"</blockquote>
                <div className="flex items-center gap-4">
                  {item.avatar_url && (
                    <img className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={item.avatar_url} alt={item.resident_name} />
                  )}
                  <div>
                    <p className="text-white font-bold text-sm tracking-tight">{item.resident_name}</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.city || 'Resident'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-40 relative overflow-hidden bg-obsidian">
        <div className="absolute inset-0 mesh-gradient-beauty opacity-20" />
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-beauty rounded-[60px] p-24 text-center border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h2 className="font-beauty text-6xl lg:text-8xl text-white mb-10 tracking-tighter leading-none">Ready to <span className="italic font-normal">begin</span>?</h2>
            <p className="text-xl text-slate-400 max-w-xl mx-auto mb-14 font-medium">Join a community where every detail is an invitation to live more beautifully.</p>
            <div className="flex flex-wrap justify-center gap-8">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-6 bg-white text-obsidian font-black rounded-2xl shadow-2xl uppercase tracking-widest text-xs" 
                href="mailto:concierge@goflex.com"
              >
                Inquire Now
              </motion.a>
              <NavLink to="/amenities" className="px-16 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase tracking-widest text-xs backdrop-blur-lg hover:bg-white/10 transition-all">
                Explore Amenities
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
