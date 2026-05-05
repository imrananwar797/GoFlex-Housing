import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { kycService, KYCStatus as KYCStatusType, KYCDocument } from '../../services/kyc.service';
import '../Dashboard.css';

export default function KYCStatus() {
  const [status, setStatus] = useState<KYCStatusType | null>(null);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      const [statusResult, docsResult] = await Promise.all([
        kycService.getKYCStatus(),
        kycService.getDocuments(),
      ]);
      setStatus(statusResult.data);
      setDocuments(docsResult.data);
    } catch (err) {
      setError('Failed to load KYC information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'premium':
        return 'premium';
      case 'verified':
        return 'verified';
      case 'basic':
        return 'basic';
      default:
        return 'basic';
    }
  };

  const getProgressPercentage = (level: string) => {
    switch (level) {
      case 'premium':
        return 100;
      case 'verified':
        return 66;
      case 'basic':
        return 33;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading KYC information...</div>
      </section>
    );
  }

  const progress = status ? getProgressPercentage(status.level) : 0;

  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Identity Verification (KYC)</h1>
        <p className="dashboard-subtitle">Verify your identity to unlock premium features</p>
      </div>

      {error && <div className="error-state">{error}</div>}

      {status && (
        <>
          <div className="kyc-status-card">
            <div className="status-header">
              <h2>Verification Status</h2>
              <span className={`level-badge level-${getLevelColor(status.level)}`}>
                {status.level.toUpperCase()}
              </span>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-text">{progress}% Complete</p>
            </div>

            <div className="verification-checklist">
              <div className={`check-item ${status.emailVerified ? 'completed' : 'pending'}`}>
                <span className="check-icon">{status.emailVerified ? '✓' : '○'}</span>
                <span className="check-label">Email Verified</span>
                {!status.emailVerified && (
                  <NavLink to="/kyc/verify" className="check-action">
                    Verify Email
                  </NavLink>
                )}
              </div>

              <div className={`check-item ${status.phoneVerified ? 'completed' : 'pending'}`}>
                <span className="check-icon">{status.phoneVerified ? '✓' : '○'}</span>
                <span className="check-label">Phone Verified</span>
                {!status.phoneVerified && (
                  <NavLink to="/kyc/verify" className="check-action">
                    Verify Phone
                  </NavLink>
                )}
              </div>

              <div className={`check-item ${status.documentsApproved?.length > 0 ? 'completed' : 'pending'}`}>
                <span className="check-icon">{status.documentsApproved?.length > 0 ? '✓' : '○'}</span>
                <span className="check-label">Documents Approved</span>
                {!status.documentsApproved?.length && (
                  <NavLink to="/kyc/upload" className="check-action">
                    Upload Documents
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          <div className="kyc-levels-info">
            <h3>Verification Levels</h3>
            <div className="levels-grid">
              <div className={`level-card ${status.level === 'basic' || status.level === 'verified' || status.level === 'premium' ? 'achieved' : ''}`}>
                <h4>Level 1: Basic</h4>
                <p className="level-requirements">
                  ✓ Email Verified
                </p>
                <span className="level-description">Access basic features</span>
              </div>

              <div className={`level-card ${status.level === 'verified' || status.level === 'premium' ? 'achieved' : ''}`}>
                <h4>Level 2: Verified</h4>
                <p className="level-requirements">
                  ✓ Email Verified<br />
                  ✓ Phone Verified
                </p>
                <span className="level-description">Access all features</span>
              </div>

              <div className={`level-card ${status.level === 'premium' ? 'achieved' : ''}`}>
                <h4>Level 3: Premium</h4>
                <p className="level-requirements">
                  ✓ Email Verified<br />
                  ✓ Phone Verified<br />
                  ✓ Documents Approved
                </p>
                <span className="level-description">Premium member status</span>
              </div>
            </div>
          </div>

          <div className="documents-section">
            <div className="documents-header">
              <h3>Uploaded Documents</h3>
              {documents.some(d => d.status === 'pending') && (
                <span className="pending-badge">
                  {documents.filter(d => d.status === 'pending').length} Pending Review
                </span>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="no-documents">
                <p>No documents uploaded yet.</p>
                <NavLink to="/kyc/upload" className="btn-cta">
                  Upload Documents
                </NavLink>
              </div>
            ) : (
              <div className="documents-list">
                {documents.map((doc) => (
                  <div key={doc.id} className={`document-item status-${doc.status}`}>
                    <div className="doc-info">
                      <h4>{doc.documentType.toUpperCase()}</h4>
                      <p className="doc-number">ID: {doc.documentNumber}</p>
                      <p className="doc-date">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="doc-status">
                      <span className={`status-badge status-${doc.status}`}>
                        {doc.status === 'approved' && '✓ Approved'}
                        {doc.status === 'pending' && '⏱ Pending Review'}
                        {doc.status === 'rejected' && '✗ Rejected'}
                      </span>
                      {doc.rejectionReason && (
                        <p className="rejection-reason">{doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(documents.length === 0 || documents.some(d => d.status !== 'approved')) && (
              <NavLink to="/kyc/upload" className="btn-cta upload-btn">
                Upload More Documents
              </NavLink>
            )}
          </div>
        </>
      )}
    </section>
  );
}
