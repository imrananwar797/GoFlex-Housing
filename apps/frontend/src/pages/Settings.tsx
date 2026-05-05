import React from 'react';
import TwoFactorSettings from '../components/profile/TwoFactorSettings';
import './Dashboard.css';

export default function Settings() {
  return (
    <section className="content-wrap dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Account Settings</h1>
        <p className="dashboard-subtitle">Manage your account security and preferences</p>
      </div>

      <div className="settings-grid mt-8">
        <div className="settings-main">
          <TwoFactorSettings />
        </div>
        
        <div className="settings-sidebar">
          <div className="card">
            <h3 className="card-title text-lg mb-4">Security Tips</h3>
            <ul className="text-secondary list-disc pl-5 gap-2 flex flex-col">
              <li>Use a strong, unique password</li>
              <li>Keep your 2FA device accessible</li>
              <li>Never share your OTP with anyone</li>
              <li>Monitor your login activity regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
