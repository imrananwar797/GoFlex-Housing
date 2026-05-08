import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Imran Anwar',
    role: 'Founder & CEO',
    bio: 'Visionary architect behind GoFlex, focusing on merging high-performance living with futuristic aesthetics.',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    category: 'Leadership',
    social: { linkedin: '#', twitter: '#', mail: 'imran@example.com' }
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'Former Big Tech engineer specialized in IoT integration and AI-driven property management systems.',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    category: 'Engineering',
    social: { linkedin: '#', twitter: '#', mail: 'sarah@example.com' }
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Design',
    bio: 'Award-winning designer responsible for the Cyberpunk-inspired aesthetic and premium resident experience.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    category: 'Design',
    social: { linkedin: '#', twitter: '#', mail: 'marcus@example.com' }
  },
  {
    name: 'Elena Rodriguez',
    role: 'Operations Director',
    bio: 'Expert in hospitality and concierge-grade property management with over 15 years of experience.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    category: 'Operations',
    social: { linkedin: '#', twitter: '#', mail: 'elena@example.com' }
  },
  {
    name: 'David Kim',
    role: 'Lead Architect',
    bio: 'Pioneer in sustainable urban living and smart building design.',
    image: 'https://images.pexels.com/photos/2182971/pexels-photo-2182971.jpeg',
    category: 'Design',
    social: { linkedin: '#', twitter: '#', mail: 'david@example.com' }
  },
  {
    name: 'Aisha Gupta',
    role: 'Head of Growth',
    bio: 'Strategy expert focused on expanding the GoFlex ecosystem across emerging tech hubs.',
    image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    category: 'Leadership',
    social: { linkedin: '#', twitter: '#', mail: 'aisha@example.com' }
  }
];

export default function Team() {
  return (
    <PageTransition>
      <div className="bg-obsidian min-h-screen">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-eyebrow mb-6 justify-center"
            >
              The Architects of the Future
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter"
            >
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">GoFlex Team</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              A diverse collective of engineers, designers, and visionaries united by a single mission: to redefine urban living for the high-performance generation.
            </motion.p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {teamMembers.map((member, i) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] mb-8 glass-morphism border-white/10 group-hover:border-neon-blue/30 transition-all duration-500">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                    
                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex gap-4">
                        <a href={member.social.linkedin} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-neon-blue hover:text-obsidian transition-all">
                          <Linkedin size={18} />
                        </a>
                        <a href={member.social.twitter} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-neon-blue hover:text-obsidian transition-all">
                          <Twitter size={18} />
                        </a>
                        <a href={`mailto:${member.social.mail}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-neon-blue hover:text-obsidian transition-all">
                          <Mail size={18} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="px-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-blue mb-2 block">{member.role}</span>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-neon-blue transition-colors">{member.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="bg-obsidian-surface py-32 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="section-eyebrow mb-6">Our DNA</span>
                <h2 className="section-title mb-8">Built on Innovation, <br /> Driven by Community.</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                  At GoFlex, we don't just build housing; we engineer ecosystems. Our culture is a blend of rigorous technical excellence and a deep commitment to human connection.
                </p>
                <div className="space-y-6">
                  {[
                    'Digital-First Mindset',
                    'Aesthetic Obsession',
                    'Radical Transparency',
                    'Future-Proof Engineering'
                  ].map((value, i) => (
                    <motion.div 
                      key={value}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-white font-bold"
                    >
                      <div className="w-2 h-2 rounded-full bg-neon-blue shadow-neon-blue" />
                      {value}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-neon-blue/10 blur-[80px] rounded-full animate-pulse" />
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
                  className="relative rounded-[40px] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" 
                  alt="Team Culture" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-[40px] p-20 text-center border-neon-blue/20"
            >
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Want to build the future <br /> with us?</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">We're always looking for talented individuals who are obsessed with quality and innovation.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-neon-blue text-obsidian font-black rounded-2xl shadow-neon-blue uppercase tracking-widest text-sm flex items-center gap-3"
                >
                  View Openings <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
