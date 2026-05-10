import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Shield, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to the Cyberpunk Sanctuary. I am your AI Concierge. How can I elevate your living experience today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const getAIResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('property') || q.includes('house') || q.includes('room')) {
      return "I've analyzed your biometric profile. I recommend our new 'Neo-Kyoto' sanctuary in Bengaluru. It features artisan wellness pods and 10Gbps neural-link connectivity.";
    }
    if (q.includes('amenity') || q.includes('service')) {
      return "Our 'Artisan Living' suite includes 24/7 holographic concierge support and organic nutrient-dense meal delivery. Would you like to view the schedule?";
    }
    if (q.includes('hello') || q.includes('hi')) {
      return "Greetings, visionary. Ready to optimize your residential environment?";
    }
    return "Analyzing request... Our systems are currently syncing with your resident preferences. In the meantime, exploring our curated 'Founder Tier' properties is highly recommended.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-neon-blue rounded-full flex items-center justify-center text-obsidian shadow-[0_0_30px_rgba(0,209,255,0.4)] hover:scale-110 transition-transform"
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 h-[500px] bg-[#080A0E]/95 backdrop-blur-xl border border-neon-blue/20 rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-neon-blue/10 to-purple-500/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">Sanctuary AI</h3>
                  <p className="text-[9px] text-neon-green font-black uppercase tracking-widest">Active System</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-neon-blue text-obsidian rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-white rounded-tl-none'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Sync with AI..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:border-neon-blue/50 outline-none transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-obsidian transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
