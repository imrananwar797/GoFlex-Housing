import React, { useEffect, useState } from 'react';
import { securityService } from '../../services/security.service';
import '../Dashboard.css';

export default function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [step, setStep] = useState<'status' | 'verify'>('status');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await securityService.get2FAStatus();
      setEnabled(data.enabled);
    } catch (err) {
      console.error('Failed to fetch 2FA status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    try {
      setError(null);
      const data = await securityService.setup2FA();
      setQrCode(data.qr_code);
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initiate 2FA setup');
    }
  };

  const handleVerify = async () => {
    try {
      setError(null);
      await securityService.verify2FA(otp);
      setSuccess('Two-Factor Authentication enabled successfully!');
      setEnabled(true);
      setStep('status');
      setOtp('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    }
  };

  const handleDisable = async () => {
    if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) return;
    try {
      setError(null);
      await securityService.disable2FA('123456'); // Mock OTP for disabling
      setSuccess('Two-Factor Authentication disabled.');
      setEnabled(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to disable 2FA');
    }
  };

  if (loading) return <div className="loading-state">Loading security settings...</div>;

  return (
    <div className="security-settings card">
      <div className="card-header">
        <h2 className="card-title">Two-Factor Authentication (2FA)</h2>
        <p className="card-subtitle">Add an extra layer of security to your account</p>
      </div>

      <div className="card-body">
        {error && <div className="error-message mb-4">{error}</div>}
        {success && <div className="success-message mb-4">{success}</div>}

        {step === 'status' ? (
          <div className="tfa-status">
            <div className="status-indicator mb-4">
              <span className={`status-badge ${enabled ? 'status-active' : 'status-inactive'}`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <p className="mb-6 text-secondary">
              {enabled 
                ? 'Your account is protected with 2FA. Each time you sign in, you’ll need to enter an OTP code.' 
                : 'To protect your account, we recommend enabling 2FA. You will receive an OTP via your registered email or phone.'}
            </p>

            <button 
              className={`btn ${enabled ? 'btn-danger' : 'btn-primary'}`}
              onClick={enabled ? handleDisable : handleEnable}
            >
              {enabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        ) : (
          <div className="tfa-verify text-center">
            {qrCode && (
              <div className="qr-code-container mb-6 flex flex-col items-center">
                <p className="mb-4">Scan this QR code with your Authenticator app (Google, Authy, etc.)</p>
                <img src={qrCode} alt="2FA QR Code" className="max-w-[200px] border p-2 bg-white" />
              </div>
            )}
            <p className="mb-4">Enter the 6-digit code from your app to complete setup.</p>
            <div className="form-group mb-6">
              <label className="form-label">Verification Code (OTP)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex gap-4">
              <button className="btn btn-primary" onClick={handleVerify}>Verify & Enable</button>
              <button className="btn btn-ghost" onClick={() => setStep('status')}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
