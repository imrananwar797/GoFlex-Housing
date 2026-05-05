import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ownerService, PropertyReview } from '../../services/owner.service';
import '../Dashboard.css';

export default function OwnerPropertyReviews() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<PropertyReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const result = await ownerService.getPropertyReviews(propertyId);
      setReviews(result.data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      setResponding(true);
      await ownerService.replyToReview(selectedReview.id, responseText);
      setResponseText('');
      setSelectedReview(null);
      fetchReviews();
    } catch (err) {
      setError('Failed to submit response');
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  if (!propertyId) {
    return (
      <section className="content-wrap">
        <div className="error-state">Property ID not found</div>
      </section>
    );
  }

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Property Reviews</h1>
        <p className="dashboard-subtitle">View and respond to guest reviews</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <p>No reviews yet for this property.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <h3 className="reviewer-name">{review.user_name}</h3>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-rating">
                  <span className="stars">
                    {'⭐'.repeat(review.rating)}
                  </span>
                  <span className="rating-value">{review.rating}/5</span>
                </div>
              </div>

              <div className="review-content">
                <h4 className="review-title">{review.title}</h4>
                <p className="review-text">{review.content}</p>
              </div>

              {review.response ? (
                <div className="response-section">
                  <div className="response-header">
                    <span className="response-label">Your Response</span>
                    <span className="response-date">
                      {new Date(review.response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="response-text">{review.response.responseText}</p>
                </div>
              ) : (
                <button
                  className="btn-ghost response-btn"
                  onClick={() => {
                    setSelectedReview(review);
                    setResponseText('');
                  }}
                >
                  Respond to Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedReview && !selectedReview.response && (
        <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Respond to Review</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedReview(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="review-preview">
                <div className="review-preview-header">
                  <h4>{selectedReview.user_name}</h4>
                  <span className="stars">{'⭐'.repeat(selectedReview.rating)}</span>
                </div>
                <h5>{selectedReview.title}</h5>
                <p>{selectedReview.content}</p>
              </div>

              <label className="form-label">
                Your Response:
                <textarea
                  className="form-textarea"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response to this review..."
                  rows={5}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedReview(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary-btn"
                onClick={handleSubmitResponse}
                disabled={responding || !responseText.trim()}
              >
                {responding ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
