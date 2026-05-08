import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { Target, Eye, Lightbulb, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const teamMembers = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    bio: 'Former real estate entrepreneur with 12+ years of experience in premium residential spaces',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  },
  {
    name: 'Vikram Patel',
    role: 'Chief Operations Officer',
    bio: 'Operations expert with background in hospitality and community management',
    image: 'https://images.pexels.com/photos/416782/pexels-photo-416782.jpeg',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Head of Technology',
    bio: 'Tech innovator specializing in IoT and smart building solutions',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
];

const milestones = [
  { year: '2021', event: 'GoFlex founded in Bengaluru' },
  { year: '2022', event: '500+ residents across 5 cities' },
  { year: '2023', event: '20 premium properties launched' },
  { year: '2024', event: 'Expanded to pan-India operations' },
];

export default function About() {
  return (
    <PageTransition>
      <div className="bg-obsidian min-h-screen text-white">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-eyebrow mb-6 justify-center"
            >
              Our Mission
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter"
            >
              Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">Urban Living</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              GoFlex Housing brings together premium spaces, cutting-edge technology, and vibrant communities to create the perfect living experience for high-performance residents.
            </motion.p>
          </div>
        </section>

        {/* Mission/Vision/Values */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <Target className="text-neon-blue" />, title: 'Our Mission', desc: 'To empower young professionals with thoughtfully designed living spaces that foster community and productivity.' },
                { icon: <Eye className="text-purple-500" />, title: 'Our Vision', desc: 'To become the most trusted co-living platform in India, setting new standards for residential excellence.' },
                { icon: <Lightbulb className="text-amber-400" />, title: 'Our Values', desc: 'Authenticity, Innovation, Community, and Excellence guide everything we do - from design to delivery.' }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-morphism p-10 rounded-[40px] border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-obsidian-surface py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="section-eyebrow mb-6">Our Story</span>
              <h2 className="section-title mb-8">From Idea to <br /> Nationwide Reality.</h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p>GoFlex Housing was born from a simple observation: India's young professionals were underserved in the housing market. High rents and inflexible terms were the norm. We believed there had to be a better way.</p>
                <p>Today, GoFlex is home to thousands of residents across India's premier cities. But we're just getting started. Our vision is to create a nationwide network of premium spaces where every resident feels at home.</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-neon-blue/10 blur-[80px] rounded-full" />
              <img src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg" className="relative rounded-[40px] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" alt="GoFlex Story" />
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <span className="section-eyebrow mb-6 justify-center">Leadership</span>
              <h2 className="section-title">Meet Our Founders</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {teamMembers.map((member, i) => (
                <motion.article 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[40px] mb-8 glass-morphism border-white/5">
                    <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 group-hover:text-neon-blue transition-colors">{member.name}</h3>
                  <p className="text-neon-blue text-[10px] font-black uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-32 bg-obsidian-surface border-y border-white/5">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-wrap justify-between items-center gap-12">
              {milestones.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-black text-neon-blue mb-2 tracking-tighter">{m.year}</div>
                  <div className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{m.event}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-[40px] p-20 text-center border-neon-blue/20"
            >
              <h2 className="text-5xl font-black mb-8 tracking-tighter">Experience it first-hand.</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">Join the community of thousands already living the future.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <NavLink to="/properties" className="px-12 py-6 bg-neon-blue text-obsidian font-black rounded-2xl shadow-neon-blue uppercase tracking-widest text-sm flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                  Explore Properties <ArrowRight size={18} />
                </NavLink>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
