import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService, Subscription } from '../../services/subscription.service';
import '../Dashboard.css';

export default function SubscriptionCurrent() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'pause' | 'resume' | 'cancel' | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const result = await subscriptionService.getCurrentSubscription();
      if (!result.data) {
        navigate('/subscriptions/plans');
        return;
      }
      setSubscription(result.data);
    } catch (err) {
      setError('Failed to load subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'pause' | 'resume' | 'cancel') => {
    if (!subscription) return;

    try {
      setActionInProgress(true);

      if (action === 'pause') {
        await subscriptionService.pauseSubscription(subscription.id);
      } else if (action === 'resume') {
        await subscriptionService.resumeSubscription(subscription.id);
      } else if (action === 'cancel') {
        await subscriptionService.cancelSubscription(subscription.id);
      }

      setShowConfirmModal(false);
      setConfirmAction(null);
      fetchSubscription();
    } catch (err) {
      setError(`Failed to ${action} subscription`);
      console.error(err);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleConfirm = (action: 'pause' | 'resume' | 'cancel') => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading your subscription...</div>
      </section>
    );
  }

  if (!subscription) {
    return (
      <section className="content-wrap dashboard-page">
        <div className="dashboard-header">
          <h1 className="dashboard-title">No Active Subscription</h1>
        </div>
        <div className="empty-state">
          <p>You don't have an active subscription yet.</p>
          <button
            className="btn-cta"
            onClick={() => navigate('/subscriptions/plans')}
          >
            View Plans
          </button>
        </div>
      </section>
    );
  }

  const daysUntilNextBilling = Math.ceil(
    (new Date(subscription.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manage Your Subscription</h1>
        <p className="dashboard-subtitle">View and manage your current plan</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="subscription-card main-card">
        <div className="subscription-header">
          <div className="subscription-info">
            <h2>{subscription.planName}</h2>
            <span className={`status-badge status-${subscription.status}`}>
              {subscription.status === 'active' && '✓ Active'}
              {subscription.status === 'paused' && '⏸ Paused'}
              {subscription.status === 'cancelled' && '✗ Cancelled'}
            </span>
          </div>
          <div className="subscription-price">
            <span className="currency">₹</span>
            <span className="amount">{subscription.monthlyPrice.toLocaleString()}</span>
            <span className="period">/month</span>
          </div>
        </div>

        <div className="subscription-details">
          <div className="detail-row">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">
              {new Date(subscription.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Next Billing Date:</span>
            <span className="detail-value">
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
              <span className="days-remaining">({daysUntilNextBilling} days remaining)</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Stripe Subscription ID:</span>
            <span className="detail-value">
              <code>{subscription.stripeSubscriptionId}</code>
            </span>
          </div>
          {subscription.cancelledAt && (
            <div className="detail-row">
              <span className="detail-label">Cancelled Date:</span>
              <span className="detail-value">
                {new Date(subscription.cancelledAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="subscription-actions">
          {subscription.status === 'active' && (
            <>
              <button
                className="btn-ghost"
                onClick={() => handleConfirm('pause')}
                disabled={actionInProgress}
              >
                Pause Subscription
              </button>
              <button
                className="btn-danger"
                onClick={() => handleConfirm('cancel')}
                disabled={actionInProgress}
              >
                Cancel Subscription
              </button>
            </>
          )}
          {subscription.status === 'paused' && (
            <>
              <button
                className="btn-cta"
                onClick={() => handleConfirm('resume')}
                disabled={actionInProgress}
              >
                Resume Subscription
              </button>
              <button
                className="btn-danger"
                onClick={() => handleConfirm('cancel')}
                disabled={actionInProgress}
              >
                Cancel Subscription
              </button>
            </>
          )}
        </div>
      </div>

      <div className="billing-info">
        <h3>Billing Information</h3>
        <div className="billing-details">
          <p>
            Your subscription will automatically renew on{' '}
            <strong>{new Date(subscription.nextBillingDate).toLocaleDateString()}</strong>.
          </p>
          <p>
            {subscription.status === 'paused' &&
              'Your subscription is currently paused. It will not renew until you resume it.'}
            {subscription.status === 'active' &&
              'You will be charged automatically on your next billing date.'}
            {subscription.status === 'cancelled' &&
              'Your subscription has been cancelled. You can resubscribe at any time.'}
          </p>
        </div>
      </div>

      <div className="actions-section">
        <h3>Other Actions</h3>
        <div className="action-links">
          <button
            className="action-link"
            onClick={() => navigate('/subscriptions/history')}
          >
            📜 View Billing History
          </button>
          <button
            className="action-link"
            onClick={() => navigate('/subscriptions/plans')}
          >
            💳 Change Plan
          </button>
          <button
            className="action-link"
            onClick={() => navigate('/billing/invoices')}
          >
            📋 Download Invoices
          </button>
        </div>
      </div>

      {showConfirmModal && confirmAction && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Action</h2>
              <button
                className="modal-close"
                onClick={() => setShowConfirmModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {confirmAction === 'pause' && (
                <p>
                  Are you sure you want to pause your subscription? You can resume it anytime.
                  You won't be charged during the pause period.
                </p>
              )}
              {confirmAction === 'resume' && (
                <p>
                  Are you sure you want to resume your subscription? Billing will resume
                  on your next billing date.
                </p>
              )}
              {confirmAction === 'cancel' && (
                <div>
                  <p className="warning-text">
                    ⚠️ Cancelling your subscription is permanent. You'll lose access to all premium features
                    at the end of your billing period.
                  </p>
                  <p>Are you sure you want to cancel?</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowConfirmModal(false)}
                disabled={actionInProgress}
              >
                No, Keep It
              </button>
              <button
                className={`modal-btn ${confirmAction === 'cancel' ? 'danger-btn' : 'primary-btn'}`}
                onClick={() => handleAction(confirmAction)}
                disabled={actionInProgress}
              >
                {actionInProgress ? 'Processing...' : `Yes, ${confirmAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
