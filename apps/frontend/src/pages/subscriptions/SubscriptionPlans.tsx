import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { subscriptionService, SubscriptionPlan, Subscription } from '../../services/subscription.service';
import PageTransition from '../../components/common/PageTransition';
import { 
  Check, 
  ChevronDown, 
  Zap, 
  ShieldCheck, 
  Crown, 
  HelpCircle, 
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';

const FALLBACK_PLANS: SubscriptionPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Perfect for professionals seeking a high-tech, minimal living experience.',
    monthlyPrice: 9999,
    annualPrice: 99990,
    features: ['High-speed WiFi', 'Smart Access Control', 'Bi-weekly Cleaning', 'Community Access'],
    isActive: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'The standard GoFlex experience with full wellness and nutrition perks.',
    monthlyPrice: 19999,
    annualPrice: 199990,
    features: ['All Essential features', 'Gourmet Meal Plan', '24/7 Gym Access', 'Biometric Security', 'Weekly Cleaning'],
    isActive: true
  },
  {
    id: 'founder',
    name: 'Founder',
    description: 'The ultimate urban residency. Engineered for peak performance.',
    monthlyPrice: 34999,
    annualPrice: 349990,
    features: ['All Premium features', 'Private Office Pod', '24/7 AI Concierge', 'Founder Circle Access', 'Daily Cleaning'],
    isActive: true
  }
];

const FAQS = [
  {
    question: "Can I change my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle, and upgrades are prorated immediately."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "Your subscription will end at the end of your current billing period. You'll still have access to all features until then."
  },
  {
    question: "Is there a free trial?",
    answer: "Some plans offer a 7-day free trial. You can start a free trial without providing payment information for the Essential plan."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with your subscription experience."
  }
];

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    fetchPlansAndSubscription();
  }, []);

  const fetchPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const [plansResult, subResult] = await Promise.all([
        subscriptionService.getPlans().catch(() => ({ data: FALLBACK_PLANS })),
        subscriptionService.getCurrentSubscription().catch(() => ({ data: null })),
      ]);
      setPlans(plansResult.data || FALLBACK_PLANS);
      setCurrentSubscription(subResult.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setPlans(FALLBACK_PLANS);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    console.log('Subscribe to plan:', planId);
    // In a real app, redirect to Stripe/Payment
  };

  const allFeatures = useMemo(() => {
    const features = new Set<string>();
    plans.forEach(p => p.features.forEach(f => features.add(f)));
    return Array.from(features);
  }, [plans]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian text-white pt-32 pb-20 px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow mb-6 justify-center"
          >
            Membership
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tighter"
          >
            Subscription <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">Plans</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-12"
          >
            Choose the perfect ecosystem for your lifestyle. Engineered for performance, designed for comfort.
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 bg-white/10 rounded-full p-1 relative transition-all"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                className="w-5 h-5 bg-neon-blue rounded-full shadow-neon-blue"
              />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-500'}`}>
              Annual <span className="text-neon-blue text-[10px] uppercase ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, i) => {
            const isCurrentPlan = currentSubscription?.planId === plan.id && currentSubscription?.status === 'active';
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12;
            const isRecommended = plan.id === 'premium';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-morphism rounded-[40px] p-10 border-white/5 relative overflow-hidden group transition-all duration-500 ${isRecommended ? 'border-neon-blue/30 scale-105 z-10' : ''}`}
              >
                {isRecommended && (
                  <div className="absolute top-0 right-0 bg-neon-blue text-obsidian px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">
                    Recommended
                  </div>
                )}

                <div className="mb-8">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-neon-blue/30 transition-all">
                    {plan.id === 'essential' ? <Zap className="text-slate-400" /> : plan.id === 'premium' ? <ShieldCheck className="text-neon-blue" /> : <Crown className="text-purple-500" />}
                  </div>
                  <h3 className="text-3xl font-black mb-2 tracking-tight">{plan.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">₹{price.toLocaleString()}</span>
                    <span className="text-slate-500 font-bold">/mo</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-[10px] font-black text-neon-blue uppercase mt-1">Billed annually (₹{plan.annualPrice.toLocaleString()})</div>
                  )}
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                        <Check className="text-neon-blue" size={12} />
                      </div>
                      <span className="text-sm text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                    isCurrentPlan 
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10' 
                    : isRecommended 
                      ? 'bg-neon-blue text-obsidian shadow-neon-blue hover:scale-[1.02]' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Subscribe Now'}
                  {!isCurrentPlan && <ArrowRight size={16} />}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Compare Plans</h2>
            <p className="text-slate-500">A detailed breakdown of every feature across our tiers.</p>
          </div>

          <div className="glass-morphism rounded-[40px] border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Feature</th>
                  {plans.map(p => (
                    <th key={p.id} className="p-8 text-center text-lg font-black">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <td className="p-8 text-sm font-bold text-slate-400">Monthly Price</td>
                  {plans.map(p => (
                    <td key={p.id} className="p-8 text-center font-black">₹{p.monthlyPrice.toLocaleString()}</td>
                  ))}
                </tr>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className="p-8 text-sm text-slate-400">{feature}</td>
                    {plans.map(p => (
                      <td key={p.id} className="p-8 text-center">
                        {p.features.some(f => f.includes(feature) || feature.includes(f)) ? (
                          <Check className="mx-auto text-neon-blue" size={20} />
                        ) : (
                          <div className="w-4 h-0.5 bg-white/10 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Common Questions</h2>
            <p className="text-slate-500">Everything you need to know about GoFlex memberships.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="glass-morphism rounded-3xl border-white/5 overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                  >
                    <ChevronDown className="text-slate-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-8 pt-0 text-slate-400 leading-relaxed text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="max-w-7xl mx-auto mt-32">
          <div className="glass-morphism rounded-[40px] p-16 flex flex-col md:flex-row items-center justify-between gap-8 border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 to-purple-500/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                <HelpCircle className="text-neon-blue" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-1">Need a custom plan?</h3>
                <p className="text-slate-400">Contact our corporate sales team for bulk bookings and multi-city access.</p>
              </div>
            </div>
            <NavLink to="/contact" className="px-10 py-5 bg-white text-obsidian font-black rounded-2xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
              Talk to an Expert <Sparkles size={16} />
            </NavLink>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
