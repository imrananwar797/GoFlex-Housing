import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact(){
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', property: '' });
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/api/contact', form);
      setStatus('ok');
      setForm({ name:'', email:'', phone:'', message:'', property:'' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <PageTransition>
      <div className="bg-obsidian min-h-screen text-white py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Info Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="section-eyebrow mb-6">Get in Touch</span>
              <h1 className="text-6xl lg:text-7xl font-black mb-8 tracking-tighter">Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">future home</span>.</h1>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">Have questions about our spaces, amenities, or the GoFlex community? Our concierge team is here to help you 24/7.</p>
              
              <div className="space-y-8">
                {[
                  { icon: <Mail className="text-neon-blue" />, label: 'Email Us', value: 'concierge@goflex.com', href: 'mailto:concierge@goflex.com' },
                  { icon: <Phone className="text-purple-500" />, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: <MapPin className="text-amber-400" />, label: 'Visit HQ', value: 'Indiranagar, Bengaluru, KA', href: '#' }
                ].map((item, i) => (
                  <motion.a 
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-neon-blue/30 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</div>
                      <div className="text-lg font-bold group-hover:text-neon-blue transition-colors">{item.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism p-10 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <form className="space-y-6 relative z-10" onSubmit={onSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all"
                      name="name" 
                      placeholder="Elon Musk" 
                      value={form.name} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all"
                      type="email" 
                      name="email" 
                      placeholder="elon@mars.com" 
                      value={form.email} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all"
                      name="phone" 
                      placeholder="+91 00000 00000" 
                      value={form.phone} 
                      onChange={onChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Interested In</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all"
                      name="property" 
                      placeholder="Silicon Oasis" 
                      value={form.property} 
                      onChange={onChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all min-h-[150px]"
                    name="message" 
                    placeholder="Tell us about your requirement" 
                    value={form.message} 
                    onChange={onChange} 
                    required 
                  />
                </div>

                <button 
                  className={`w-full py-6 bg-neon-blue text-obsidian font-black rounded-2xl shadow-neon-blue uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={status==='sending'} 
                  type="submit"
                >
                  {status === 'sending' ? 'Sending Message...' : 'Send Message'}
                  {status !== 'sending' && <Send size={18} />}
                </button>

                <AnimatePresence>
                  {status === 'ok' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold flex items-center gap-3"
                    >
                      <CheckCircle2 size={16} />
                      Transmission Received. Our team will contact you shortly.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3"
                    >
                      <AlertCircle size={16} />
                      Communication Error. Please check your connection and try again.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
