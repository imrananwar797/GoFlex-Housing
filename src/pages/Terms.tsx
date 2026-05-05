import React from 'react';

export default function Terms(){
  return (
    <section className="content-wrap">
      <h1 className="page-title">Terms & Conditions</h1>
      <p className="page-subtitle">Please review these terms before booking or moving in.</p>

      <div className="doc-grid">
        <article className="doc-card">
          <h2 className="doc-title">Bookings & Payment</h2>
          <ul className="doc-list">
            <li>Booking confirmation subject to document verification and availability.</li>
            <li>Security deposit and first month rent payable prior to move‑in.</li>
            <li>Payments are non‑transferable; late fee may apply after due date.</li>
          </ul>
        </article>
        <article className="doc-card">
          <h2 className="doc-title">Stay & Conduct</h2>
          <ul className="doc-list">
            <li>Respect quiet hours and shared spaces; no illegal activities.</li>
            <li>Guests permitted as per property rules; register overnight stays.</li>
            <li>Damages beyond normal wear are chargeable.</li>
          </ul>
        </article>
        <article className="doc-card">
          <h2 className="doc-title">Cancellations & Refunds</h2>
          <ul className="doc-list">
            <li>Cancellation/notice as per agreement; early exit may incur fees.</li>
            <li>Security deposit refunds processed post inspection and clearances.</li>
          </ul>
        </article>
        <article className="doc-card">
          <h2 className="doc-title">Privacy</h2>
          <ul className="doc-list">
            <li>We collect KYC and contact information to provide services.</li>
            <li>Data handled per applicable law; see our Privacy Policy.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
