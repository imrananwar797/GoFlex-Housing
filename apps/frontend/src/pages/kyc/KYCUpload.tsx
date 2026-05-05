import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kyc.service';
import { integrationService } from '../../services/integration.service';
import '../Dashboard.css';

const DOCUMENT_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'dl', label: 'Driver License' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'other', label: 'Other Government ID' },
];

export default function KYCUpload() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await integrationService.uploadToS3(file);
      setDocumentUrl(url);
      setError(null);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType || !documentNumber || !documentUrl) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setUploading(true);
      await kycService.uploadDocument(documentType, documentNumber, documentUrl);
      setSuccess(true);
      setDocumentType('');
      setDocumentNumber('');
      setDocumentUrl('');
      setError(null);

      setTimeout(() => {
        navigate('/kyc/status');
      }, 2000);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Upload Identity Documents</h1>
        <p className="dashboard-subtitle">Upload government-issued ID documents for verification</p>
      </div>

      {error && <div className="error-state">{error}</div>}
      {success && (
        <div className="success-state">
          Document uploaded successfully! Redirecting to status page...
        </div>
      )}

      <div className="form-section">
        <div className="form-card">
          <h2>Document Upload</h2>

          <form onSubmit={handleSubmit}>
            <label className="form-label">
              Document Type:
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select document type...</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              Document Number/ID:
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Enter document number"
                className="form-input"
                required
              />
            </label>

            <label className="form-label">
              Document Image/PDF:
              <div className="file-upload-section">
                {documentUrl && (
                  <div className="file-preview">
                    <span className="file-icon">📄</span>
                    <span className="file-name">Document uploaded</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => setDocumentUrl('')}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!documentUrl && (
                  <label className="file-input-label">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="file-input"
                      disabled={uploading}
                    />
                    <span className="file-input-text">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="file-input-hint">PNG, JPG, PDF up to 10MB</span>
                  </label>
                )}
              </div>
            </label>

            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/kyc/status')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-cta"
                disabled={uploading || !documentType || !documentNumber || !documentUrl}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>

          <div className="form-info">
            <h3>Document Requirements</h3>
            <ul className="requirements-list">
              <li>Document must be clear and legible</li>
              <li>All corners of the document should be visible</li>
              <li>Document must not be expired</li>
              <li>File size must be less than 10MB</li>
              <li>Supported formats: PNG, JPG, PDF</li>
            </ul>
          </div>
        </div>

        <div className="document-guidelines">
          <h3>Accepted Documents</h3>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h4>Aadhar Card</h4>
              <p>12-digit unique identification number issued by UIDAI</p>
            </div>
            <div className="guideline-card">
              <h4>PAN Card</h4>
              <p>Permanent Account Number issued by the Indian Income Tax Department</p>
            </div>
            <div className="guideline-card">
              <h4>Passport</h4>
              <p>Valid passport issued by the government</p>
            </div>
            <div className="guideline-card">
              <h4>Driver License</h4>
              <p>Valid driver license issued by RTO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
