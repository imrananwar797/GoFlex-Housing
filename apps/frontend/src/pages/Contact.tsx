import React, { useState } from 'react';
import { api } from '../services/api';

export default function Contact(){
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', property: '' });
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/api/contact', form);
      setStatus('ok');
      setForm({ name:'', email:'', phone:'', message:'', property:'' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="content-wrap">
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">We typically reply within 24 hours.</p>
      <form className="form-grid" onSubmit={onSubmit}>
        <input className="input" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
        <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        <input className="input" name="property" placeholder="Property (optional)" value={form.property} onChange={onChange} />
        <textarea className="input" name="message" placeholder="Tell us about your requirement" rows={4} value={form.message} onChange={onChange} required />
        <div className="form-actions">
          <button className="btn-cta" disabled={status==='sending'} type="submit">Send</button>
          {status==='ok' && <span className="form-hint">Thanks! We received your message.</span>}
          {status==='error' && <span className="form-error">Could not send. Try again.</span>}
        </div>
      </form>
      <div className="contact-ways">
        <a className="chip" href="mailto:sales@example.com">sales@example.com</a>
        <a className="chip" href="tel:+919999999999">+91 99999 99999</a>
      </div>
    </section>
  );
}
