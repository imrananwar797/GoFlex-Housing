import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const INITIAL_EVENTS = [
  { 
    id: 'e1', 
    title: 'Open Mic Night', 
    when: 'Friday • 7:00 PM', 
    interested: 24, 
    going: 12, 
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
    desc: 'Share your talent or enjoy the music at our monthly social mixer.'
  },
  { 
    id: 'e2', 
    title: 'Rooftop Yoga', 
    when: 'Saturday • 7:00 AM', 
    interested: 31, 
    going: 18, 
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg',
    desc: 'Start your weekend with mindfulness and community energy.'
  },
  { 
    id: 'e3', 
    title: 'Tech & Networking', 
    when: 'Sunday • 11:00 AM', 
    interested: 19, 
    going: 9, 
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    desc: 'Connect with fellow developers and entrepreneurs in our community.'
  }
];

export default function Community() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const rsvp = (id: string, field: 'interested' | 'going') => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: (e as any)[field] + 1 } : e));
  };

  return (
    <PageTransition>
      <section className="content-wrap community-page">
        <div className="section-header text-center mb-12">
          <span className="section-eyebrow">Better together</span>
          <h1 className="page-title text-5xl mb-4">Resident Community</h1>
          <p className="page-subtitle max-w-2xl mx-auto">Build lasting connections through our curated weekly events and social mixers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((e, index) => (
            <motion.article 
              key={e.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-0 overflow-hidden bg-glass border-primary/10 hover:shadow-2xl transition-all"
            >
              <img src={e.image} alt={e.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{e.title}</h3>
                    <p className="text-primary text-sm font-medium">{e.when}</p>
                  </div>
                  <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Verified Event</div>
                </div>
                <p className="text-secondary text-sm mb-6 leading-relaxed">{e.desc}</p>
                <div className="flex gap-4">
                  <button 
                    className="btn-ghost flex-1 text-xs py-2" 
                    onClick={() => rsvp(e.id, 'interested')}
                  >
                    Interested ({e.interested})
                  </button>
                  <button 
                    className="btn-cta flex-1 text-xs py-2" 
                    onClick={() => rsvp(e.id, 'going')}
                  >
                    Going ({e.going})
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 p-12 rounded-3xl bg-glass-heavy text-center">
          <h2 className="text-3xl font-bold mb-4">Want to host an event?</h2>
          <p className="text-secondary mb-8">Suggest an activity or workshop to your community manager.</p>
          <button className="btn-cta px-12 py-4">Submit Proposal</button>
        </div>
      </section>
    </PageTransition>
  );
}
