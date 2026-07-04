import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Shield, User, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  actions?: { label: string; action: string }[];
}

export default function AIConcierge() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || 'resident';

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message based on role
    if (role === 'owner') {
      setMessages([
        {
          id: 'welcome',
          text: "Greetings. I am your GoFlex Portfolio Intelligence Advisor. Ask me to predict occupancy, identify high-priority complaints, or recommend rent adjustments.",
          sender: 'ai',
          timestamp: new Date(),
          actions: [
            { label: 'Suggest Rent Increases', action: 'suggest_rent_increase' },
            { label: 'Predict Occupancy Rate', action: 'predict_occupancy' },
            { label: 'Identify Urgent Complaints', action: 'urgent_complaints' }
          ]
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome',
          text: "Welcome back! I am your Resident Assistant. I can help find quiet rooms, estimate bills, or file maintenance complaints instantly.",
          sender: 'ai',
          timestamp: new Date(),
          actions: [
            { label: 'File Complaint (Leaking Tap)', action: 'raise_complaint_tap' },
            { label: 'Estimate Electricity Bill', action: 'estimate_bill' },
            { label: 'Find Room under ₹8,000', action: 'find_room_8k' }
          ]
        }
      ]);
    }
  }, [role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAction = (actionKey: string, label: string) => {
    // Inject user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: label,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI response based on action
    setTimeout(() => {
      let aiText = '';
      let nextActions: { label: string; action: string }[] | undefined;

      switch (actionKey) {
        // Resident Actions
        case 'raise_complaint_tap':
          aiText = "✅ Action Executed: I have raised a ticket for 'Leaking Tap' in Suite 204. Priority set to Medium. Staff has been notified and scheduled to arrive within 2 hours.";
          break;
        case 'estimate_bill':
          aiText = "📊 Projection: Based on your current 84 units consumed, your estimated electricity bill for this month is ₹1,008 (calculated at ₹12/unit). Systemed average stays within budget.";
          break;
        case 'find_room_8k':
          aiText = "🔍 Search Results: I found 2 available single rooms under ₹8,000 within 2.1 km of Bagmane Tech Park. Would you like to request a booking transfer?";
          nextActions = [{ label: 'Request Booking Transfer', action: 'booking_transfer' }];
          break;
        case 'booking_transfer':
          aiText = "⚙️ Transfer Assistance: Transfer request generated. Once approved by the owner of the Indiranagar Node, your deposit will automatically transfer to the new booking via GoFlex Escrow.";
          break;

        // Owner Actions
        case 'suggest_rent_increase':
          aiText = "📈 Market Insight: High occupancy (94%) at Koramangala and a local market surge of 8.2% suggests a recommended rent increase of 4.5% (approx +₹400/room) for the next cycle.";
          break;
        case 'predict_occupancy':
          aiText = "🔮 Occupancy Forecast: Model predicts 96% occupancy for next month. Churn risk is low (<2%). Direct bookings remain stable.";
          break;
        case 'urgent_complaints':
          aiText = "⚠️ Priority Focus: 1 urgent complaint is pending: 'AC not cooling in Room 204' (Arjun Mehta). Assigning staff immediately is advised to prevent score reduction.";
          break;
        default:
          aiText = "Analyzing task requirements... syncing database states.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
        actions: nextActions
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = input;
    setInput('');

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let reply = '';
      let actions: { label: string; action: string }[] | undefined;

      if (role === 'owner') {
        if (q.includes('rent') || q.includes('increase')) {
          reply = "AI Recommendation: Based on local demand, I suggest a 4.5% rent increase at Indiranagar node.";
        } else if (q.includes('occupancy') || q.includes('predict')) {
          reply = "AI Forecast: Next month occupancy is projected at 95.8% with stable tenant retention.";
        } else if (q.includes('complaint') || q.includes('urgent')) {
          reply = "Urgent attention recommended for: Room 204 AC Maintenance. Resolving this will protect your GoFlex reputation score.";
        } else {
          reply = "Understood. Analyzing portfolio metrics. Ask me about rent increases, occupancy forecasts, or urgent repairs.";
        }
      } else {
        if (q.includes('find') || q.includes('room')) {
          reply = "I found a quiet single sharing room at Indiranagar Node for ₹7,800. Would you like to compare it?";
          actions = [{ label: 'Compare Properties', action: 'find_room_8k' }];
        } else if (q.includes('bill') || q.includes('estimate')) {
          reply = "Your projected electricity bill is ₹1,008 based on your 84 units of monthly consumption.";
        } else if (q.includes('complaint') || q.includes('tap') || q.includes('leak')) {
          reply = "I can raise a maintenance ticket for leaking tap now. Confirm ticket generation?";
          actions = [{ label: 'Confirm Ticket Generation', action: 'raise_complaint_tap' }];
        } else {
          reply = "How can I assist you with your stay? I can estimate bills, track complaints, or browse quieter rooms.";
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
        actions
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
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
            className="w-80 sm:w-[400px] h-[550px] bg-[#080A0E]/95 backdrop-blur-xl border border-neon-blue/20 rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-neon-blue/10 to-purple-500/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">GoFlex AI Concierge</h3>
                  <p className="text-[9px] text-neon-green font-black uppercase tracking-widest">Active · {role === 'owner' ? 'Owner Mode' : 'Resident Mode'}</p>
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
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-semibold leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-neon-blue text-obsidian rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-white rounded-tl-none'}`}
                  >
                    {msg.text}
                  </div>
                  {/* Action buttons inside chat */}
                  {msg.sender === 'ai' && msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3 w-full max-w-[85%]">
                      {msg.actions.map((act, aiIdx) => (
                        <button key={aiIdx} onClick={() => handleAction(act.action, act.label)}
                          className="flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 hover:border-neon-blue/30 text-left text-[10px] text-slate-300 hover:text-neon-blue font-bold rounded-xl transition-all">
                          {act.label} <ArrowUpRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
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
                  placeholder={role === 'owner' ? "Ask about occupancy, rates, complaints..." : "Ask to file ticket, estimate bill, find rooms..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-xs text-white focus:border-neon-blue/50 outline-none transition-all"
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
