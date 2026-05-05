import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { subscriptionService, SubscriptionPlan, Subscription } from '../../services/subscription.service';
import '../Dashboard.css';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlansAndSubscription();
  }, []);

  const fetchPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const [plansResult, subResult] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription(),
      ]);
      setPlans(plansResult.data);
      setCurrentSubscription(subResult.data);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    // Note: In a real implementation, this would integrate with Stripe payment flow
    console.log('Subscribe to plan:', planId);
    setSelectedPlan(planId);
    // Redirect to payment page or show payment modal
  };

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading subscription plans...</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Subscription Plans</h1>
        <p className="dashboard-subtitle">Choose the perfect plan for your needs</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      {currentSubscription && currentSubscription.status === 'active' && (
        <div className="active-subscription-banner">
          <span className="banner-icon">✓</span>
          <div className="banner-content">
            <p>You are currently subscribed to <strong>{currentSubscription.planName}</strong> plan</p>
            <p className="banner-details">
              Next billing: {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
          <NavLink to="/subscriptions/current" className="banner-link">
            Manage Subscription
          </NavLink>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id && currentSubscription?.status === 'active';

          return (
            <div
              key={plan.id}
              className={`plan-card ${isCurrentPlan ? 'current-plan' : ''} ${!plan.isActive ? 'inactive' : ''}`}
            >
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                {isCurrentPlan && <span className="current-badge">Current Plan</span>}
              </div>

              <p className="plan-description">{plan.description}</p>

              <div className="plan-pricing">
                <div className="price-monthly">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.monthlyPrice.toLocaleString()}</span>
                  <span className="period">/month</span>
                </div>
                <div className="price-annual">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.annualPrice.toLocaleString()}</span>
                  <span className="period">/year</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-actions">
                {isCurrentPlan ? (
                  <NavLink to="/subscriptions/current" className="btn-ghost">
                    Manage Plan
                  </NavLink>
                ) : (
                  <button
                    className="btn-cta"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing || !plan.isActive}
                  >
                    {plan.isActive ? 'Subscribe Now' : 'Unavailable'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="plans-comparison">
        <h2>Plan Comparison</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Price</td>
                {plans.map((plan) => (
                  <td key={plan.id}>₹{plan.monthlyPrice.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td>Annual Price</td>
                {plans.map((plan) => (
                  <td key={plan.id}>₹{plan.annualPrice.toLocaleString()}</td>
                ))}
              </tr>
              {Array.from(new Set(plans.flatMap(p => p.features))).map((feature) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  {plans.map((plan) => (
                    <td key={plan.id}>
                      {plan.features.includes(feature) ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          <div className="faq-item">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h4>What happens if I cancel my subscription?</h4>
            <p>Your subscription will end at the end of your current billing period. You'll still have access to all features until then.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Some plans offer a 7-day free trial. You can start a free trial without providing payment information.</p>
          </div>
          <div className="faq-item">
            <h4>Can I get a refund?</h4>
            <p>We offer a 30-day money-back guarantee if you're not satisfied with your subscription.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
