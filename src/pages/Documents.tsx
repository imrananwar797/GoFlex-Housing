import React from 'react';

const residentDocs = [
  'Government ID (Aadhaar / Passport / DL)',
  'Address Proof (Utility bill / Bank statement)',
  'Employment/Student ID',
  '2 Passport-size Photos',
  'Emergency Contact Details',
  'Security Deposit Acknowledgement',
  'Signed License/Rental Agreement'
];

const adminDocs = [
  'Property Compliance Certificates (Fire, Safety, Occupancy)',
  'Tenant KYC Records',
  'Lease/License Agreements Archive',
  'Maintenance & Housekeeping Logs',
  'Vendor Contracts & AMC Documents',
  'GST & PAN Details',
  'Bank Details (Refunds & Payouts)'
];

export default function Documents(){
  return (
    <section className="content-wrap">
      <h1 className="page-title">Documents</h1>
      <p className="page-subtitle">Required documentation for residents and administration. Keep copies handy for a smooth move‑in.</p>

      <div className="doc-grid">
        <article className="doc-card">
          <h2 className="doc-title">Resident Requirements</h2>
          <ul className="doc-list">
            {residentDocs.map(item => <li key={item}>{item}</li>)}
          </ul>
          <div className="doc-actions">
            <a className="btn-ghost" href="mailto:support@example.com?subject=Submit%20Resident%20Documents">Email Documents</a>
            <a className="btn-cta" href="/register">Start Registration</a>
          </div>
        </article>

        <article className="doc-card">
          <h2 className="doc-title">Administrative Checklist</h2>
          <ul className="doc-list">
            {adminDocs.map(item => <li key={item}>{item}</li>)}
          </ul>
          <div className="doc-actions">
            <a className="btn-ghost" href="mailto:ops@example.com?subject=Submit%20Administrative%20Documents">Share Documents</a>
            <a className="btn-cta" href="/dashboard-admin">Go to Admin</a>
          </div>
        </article>
      </div>
    </section>
  );
}
