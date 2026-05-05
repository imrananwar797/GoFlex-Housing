import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kyc.service';
import '../Dashboard.css';

type VerificationType = 'email' | 'phone' | null;

export default function KYCVerify() {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [verificationType, setVerificationType] = useState<VerificationType>(null);
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSendCode = async (type: VerificationType) => {
    if (!type) return;

    try {
      setSending(true);
      setError(null);

      if (type === 'email') {
        await kycService.sendEmailVerificationCode();
        setVerificationType('email');
      } else {
        await kycService.sendPhoneOTP();
        setVerificationType('phone');
      }

      setCodeSent(true);
      setCountdown(60);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(`Failed to send ${type === 'email' ? 'verification email' : 'OTP'}. Please try again.`);
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationType || !code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setVerifying(true);
      setError(null);

      if (verificationType === 'email') {
        await kycService.verifyEmail(code);
      } else {
        await kycService.verifyPhone(code);
      }

      setSuccess(true);
      setCode('');
      setCodeSent(false);
      setVerificationType(null);

      setTimeout(() => {
        navigate('/kyc/status');
      }, 2000);
    } catch (err) {
      setError(`Invalid ${verificationType === 'email' ? 'verification code' : 'OTP'}. Please try again.`);
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Verify Contact Information</h1>
        <p className="dashboard-subtitle">Verify your email and phone number</p>
      </div>

      {error && <div className="error-state">{error}</div>}
      {success && (
        <div className="success-state">
          Verification successful! Redirecting to status page...
        </div>
      )}

      <div className="verification-grid">
        <div className="verification-card">
          <div className="card-header">
            <h3>Email Verification</h3>
            <span className="verification-icon">📧</span>
          </div>

          {verificationType !== 'email' && !codeSent ? (
            <button
              className="btn-cta"
              onClick={() => handleSendCode('email')}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Verify Email'}
            </button>
          ) : verificationType === 'email' && codeSent ? (
            <form onSubmit={handleVerify}>
              <label className="form-label">
                Verification Code:
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="form-input"
                  maxLength={6}
                  required
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                    }
                    setCode('');
                    setCodeSent(false);
                    setVerificationType(null);
                    setCountdown(0);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-cta"
                  disabled={verifying || !code.trim()}
                >
                  {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>

              <p className="resend-text">
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : `Didn't receive the code? `}
                {countdown === 0 && (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={() => handleSendCode('email')}
                    disabled={sending}
                  >
                    Resend
                  </button>
                )}
              </p>
            </form>
          ) : null}

          <p className="card-description">
            We'll send a verification code to your registered email address.
          </p>
        </div>

        <div className="verification-card">
          <div className="card-header">
            <h3>Phone Verification</h3>
            <span className="verification-icon">📱</span>
          </div>

          {verificationType !== 'phone' && !codeSent ? (
            <button
              className="btn-cta"
              onClick={() => handleSendCode('phone')}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Verify Phone'}
            </button>
          ) : verificationType === 'phone' && codeSent ? (
            <form onSubmit={handleVerify}>
              <label className="form-label">
                OTP Code:
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="form-input"
                  maxLength={6}
                  required
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                    }
                    setCode('');
                    setCodeSent(false);
                    setVerificationType(null);
                    setCountdown(0);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-cta"
                  disabled={verifying || !code.trim()}
                >
                  {verifying ? 'Verifying...' : 'Verify Phone'}
                </button>
              </div>

              <p className="resend-text">
                {countdown > 0
                  ? `Resend OTP in ${countdown}s`
                  : `Didn't receive the OTP? `}
                {countdown === 0 && (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={() => handleSendCode('phone')}
                    disabled={sending}
                  >
                    Resend
                  </button>
                )}
              </p>
            </form>
          ) : null}

          <p className="card-description">
            We'll send an OTP to your registered phone number.
          </p>
        </div>
      </div>

      <div className="verification-info">
        <h3>Why We Need Verification</h3>
        <ul className="info-list">
          <li><strong>Security:</strong> Verify that you own the contact information</li>
          <li><strong>Communication:</strong> Ensure we can reach you with important updates</li>
          <li><strong>Account Recovery:</strong> Help you regain access if you forget your password</li>
          <li><strong>Trust:</strong> Verified accounts get higher visibility and better credibility</li>
        </ul>
      </div>
    </section>
  );
}
