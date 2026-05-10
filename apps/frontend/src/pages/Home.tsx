import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import PopularLocations from '../components/locations/PopularLocations';
import AutoGallery from '../components/gallery/AutoGallery';
import PageTransition from '../components/common/PageTransition';
import StickyBookingBar from '../components/common/StickyBookingBar';
import CommunityPulse from '../components/home/CommunityPulse';
import SanctuaryMoodExplorer from '../components/home/SanctuaryMoodExplorer';
import FounderSpotlight from '../components/home/FounderSpotlight';
import LogicOverlay from '../components/home/LogicOverlay';
import TechnicalNodeCard from '../components/home/TechnicalNodeCard';
import NeuralMap from '../components/home/NeuralMap';
import TrustProtocol from '../components/home/TrustProtocol';
import FastSearchOverlay from '../components/home/FastSearchOverlay';
import { 
  Sparkles,
  Wind,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  MousePointer2,
  Lock,
  Activity,
  Box,
  Coffee,
  Clock
} from 'lucide-react';

const MOCK_NODES = [
  { id: '42', name: 'Salt Lake Nexus', location: '6 mins to Sector V • Near Blue Tokai', image: 'https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg', stats: { latency: '5ms', environment: 'Active', occupancy: '88%' } },
  { id: '89', name: 'New Town Node', location: 'Walking distance to Candor • Near Mall', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', stats: { latency: '8ms', environment: 'Zen', occupancy: '94%' } },
  { id: '21', name: 'Gariahat Terminal', location: 'Heart of South Kolkata • Near Metro', image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg', stats: { latency: '12ms', environment: 'Artisan', occupancy: '76%' } }
];

const HEADLINES = [
  { main: "Live where your", highlight: "Ambition", suffix: "meets Infrastructure." },
  { main: "Your sanctuary for", highlight: "Deep Work", suffix: "and Circadian Rest." },
  { main: "Redefining home for the", highlight: "High-Performer", suffix: "community." }
];

export default function Home() {
  const containerRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [networkStats, setNetworkStats] = useState({ active_nodes: 0, total_residents: 0, energy_saved_kwh: 0 });
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/network/stats`)
      .then(res => res.json())
      .then(data => setNetworkStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNight, setIsNight] = useState(false);

  // Magnetic Glow Physics
  const glowX = useSpring(0, { stiffness: 100, damping: 30 });
  const glowY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // Headline Rotation
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 5000);

    // Time-Sync Logic (Kolkata Time)
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour > 18);

    // Magnetic Glow Tracking
    const handleMouseMove = (e: MouseEvent) => {
      glowX.set(e.clientX - 200);
      glowY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <PageTransition>
      <div ref={containerRef} className="relative bg-obsidian overflow-x-hidden noise-texture haptic-container">
        
        {/* MAGNETIC GLOW (Optimized with transform) */}
        <motion.div 
          style={{ x: glowX, y: glowY, translateZ: 0 }}
          className="magnetic-glow hidden lg:block will-change-transform" 
        />

        {/* CINEMATIC HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-40 haptic-section">
          {/* Parallax Layers */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')] bg-cover bg-center opacity-30 grayscale mix-blend-screen will-change-transform" 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
          </div>

          {/* HUMAN TRACE COUNTER */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 right-4 lg:top-32 lg:right-8 hidden md:flex items-center gap-4 px-4 py-2 lg:px-6 lg:py-3 bg-white/5 border border-white/10 rounded-full z-50 transition-opacity"
          >
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-obsidian bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover grayscale" />
                 </div>
               ))}
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
               <span className="text-neon-blue">{networkStats.total_residents}</span> High-Performers Synced
            </p>
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <Clock className="text-neon-blue" size={14} />
                <span className="text-neon-blue text-[10px] font-black uppercase tracking-[1em] animate-pulse">
                   {isNight ? 'Rest Mode Synchronized' : 'Focus Mode Online'}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-12"
                >
                  <h1 className="text-[7vw] lg:text-[100px] font-black text-white leading-[0.8] tracking-tighter uppercase mb-6">
                    {HEADLINES[headlineIndex].main} <br />
                    <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-br from-white via-white/50 to-transparent">
                       {HEADLINES[headlineIndex].highlight}
                    </span> <br />
                    {HEADLINES[headlineIndex].suffix}
                  </h1>
                </motion.div>
              </AnimatePresence>

              <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed italic">
                "GoFlex isn't just about where you sleep; it's about how you grow. We handle the friction of living so you can stay in your flow."
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8">
                <NavLink to="/properties">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0, 209, 255, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-16 py-8 bg-neon-blue text-obsidian font-black rounded-3xl uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all"
                  >
                    Join the Network
                  </motion.button>
                </NavLink>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-all">
                    <MousePointer2 size={18} className="group-hover:translate-y-1 transition-transform" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">Explore the Flow</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BENTO UTILITY GRID */}
        <section className="haptic-section">
          <LogicOverlay />
        </section>

        {/* NEIGHBORHOOD INTELLIGENCE & TELEMETRY */}
        <section className="py-40 bg-obsidian relative haptic-section">
           <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <span className="section-eyebrow mb-6">Neighborhood Intelligence</span>
                 <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-none">
                    Life Around <br /> <span className="italic font-normal text-slate-500">Your Node</span>.
                 </h2>
                 
                 <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <Coffee className="text-amber-400 mb-4" size={24} />
                       <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Artisan Coffee</p>
                       <p className="text-xs text-slate-500 font-medium">Blue Tokai, Starbucks within 200m radius.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <Zap className="text-neon-blue mb-4" size={24} />
                       <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Tech Hubs</p>
                       <p className="text-xs text-slate-500 font-medium">6 mins to Salt Lake Sector V HQ.</p>
                    </div>
                 </div>

                 <p className="text-lg text-slate-400 font-medium leading-relaxed">
                    A modern PropTech site doesn't ignore the world outside. We integrate your sanctuary with the best of Kolkata’s high-performance infrastructure.
                 </p>
              </div>

              <NeuralMap />
           </div>
        </section>

        {/* SET YOUR MOOD - MOOD EXPLORER */}
        <section className="bg-obsidian-surface border-y border-white/5 haptic-section">
          <div className="max-w-7xl mx-auto px-8 py-10">
             <div className="flex items-center gap-4">
                <Sparkles className="text-neon-blue" size={20} />
                <span className="text-white text-xs font-black uppercase tracking-[0.4em]">Set Your Mood</span>
             </div>
          </div>
          <SanctuaryMoodExplorer />
        </section>

        {/* HOW IT WORKS FOR YOU - NODE INTELLIGENCE */}
        <section className="py-40 bg-obsidian haptic-section">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
              <div className="max-w-2xl">
                <span className="section-eyebrow mb-6">Your Node</span>
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                   How It Works <br /> <span className="italic font-normal">For You</span>.
                </h2>
                <p className="text-lg text-slate-400 font-medium italic">"Real-world utility meets architectural soul in every node."</p>
              </div>
              <NavLink to="/properties">
                <motion.button className="px-10 py-5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                  Browse All Nodes
                </motion.button>
              </NavLink>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {MOCK_NODES.map((node) => (
                <TechnicalNodeCard key={node.id} {...node} />
              ))}
            </div>
          </div>
        </section>

        {/* TRUST & SETTLEMENT */}
        <section className="haptic-section">
           <TrustProtocol />
        </section>

        {/* THE HUMAN NETWORK */}
        <section className="py-40 bg-obsidian relative overflow-hidden haptic-section">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-24">
              <span className="section-eyebrow justify-center mb-6">Our Community</span>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase">The Human <span className="italic font-normal text-slate-500">Trace</span></h2>
            </div>
            <FounderSpotlight />
          </div>
        </section>

        {/* AESTHETIC TELEMETRY */}
        <section className="py-40 bg-obsidian-surface border-y border-white/5 haptic-section">
          <div className="max-w-7xl mx-auto px-8 mb-20 text-center">
            <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter uppercase italic">Visual Poetry</h2>
          </div>
          <AutoGallery />
        </section>

        {/* START YOUR JOURNEY */}
        <section className="py-60 relative overflow-hidden flex items-center justify-center haptic-section">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-purple-900/10 to-obsidian" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center gap-6">
                <Shield className="text-neon-blue" size={64} />
                <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-none">Start Your <br /><span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-white/10">Journey</span></h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8">
                <NavLink to="/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-16 py-8 bg-white text-obsidian font-black rounded-3xl shadow-2xl uppercase tracking-[0.3em] text-[10px]"
                  >
                    Initialize Onboarding
                  </motion.button>
                </NavLink>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SENTINEL FAB & OVERLAY */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSearchOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[1000] w-10 h-10 lg:w-12 lg:h-12 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-md flex items-center justify-center group transition-all"
        >
          <Cpu size={20} className="group-hover:text-neon-blue transition-colors" />
          <div className="absolute -top-10 right-0 bg-obsidian-surface border border-white/10 px-3 py-1.5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Sentinel Search
          </div>
        </motion.button>

        <FastSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      </div>
    </PageTransition>
  );
}
