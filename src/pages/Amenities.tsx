import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const AMENITIES_LIST = [
  { id: 'wifi', group: 'Utilities', title: 'High-speed Wi-Fi', icon: '📶', desc: 'Symmetric fiber connection with 100% power backup.' },
  { id: 'laundry', group: 'Utilities', title: 'In-house Laundry', icon: '🧺', desc: 'Modern washing machines and dryers available 24/7.' },
  { id: 'meals', group: 'Canteen', title: 'Curated Meals', icon: '🍱', desc: 'Home-style nutritious meals with regional variety.' },
  { id: 'gym', group: 'Fitness', title: 'Modern Gym', icon: '🏋️', desc: 'Equipped with cardio, free weights, and yoga mats.' },
  { id: 'game', group: 'Recreation', title: 'Game Zone', icon: '🎮', desc: 'Playstation 5, Pool table, and Board game collection.' },
  { id: 'study', group: 'Recreation', title: 'Focus Lounge', icon: '📖', desc: 'Quiet zones designed for high-concentration work.' }
];

const GROUPS = ['All', 'Utilities', 'Canteen', 'Fitness', 'Recreation'] as const;

export default function Amenities() {
  const [group, setGroup] = useState<typeof GROUPS[number]>('All');
  const list = useMemo(() => group === 'All' ? AMENITIES_LIST : AMENITIES_LIST.filter(a => a.group === group), [group]);

  return (
    <PageTransition>
      <section className="content-wrap amenities-page">
        <div className="section-header text-center mb-12">
          <span className="section-eyebrow">Luxury living</span>
          <h1 className="page-title text-5xl mb-4">Concierge-Grade Amenities</h1>
          <p className="page-subtitle max-w-2xl mx-auto">Everything you need to thrive, from lightning-fast connectivity to wellness zones.</p>
        </div>

        <div className="filter-bar flex justify-center gap-4 mb-12">
          {GROUPS.map(g => (
            <button 
              key={g} 
              className={`chip py-2 px-6 rounded-full transition-all ${group === g ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-glass text-secondary hover:bg-secondary/10'}`} 
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((a, index) => (
            <motion.article 
              key={a.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-glass hover:bg-glass-heavy transition-all hover:-translate-y-2 border-primary/10"
            >
              <div className="text-4xl mb-4">{a.icon}</div>
              <h3 className="text-xl font-bold mb-2">{a.title}</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">{a.group}</span>
              <p className="text-secondary text-sm leading-relaxed">{a.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
