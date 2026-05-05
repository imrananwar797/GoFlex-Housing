import React, { useState, useEffect } from 'react';
import { paymentService, PaymentMethod } from '../../services/payment.service';
import '../Dashboard.css';

interface BookingFormProps {
  propertyId: number;
  rent: number;
}

export default function BookingForm({ propertyId, rent }: BookingFormProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    paymentService.getMethods().then(data => {
      setMethods(data.methods);
      if (data.methods.length > 0) setSelectedMethod(data.methods[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await paymentService.initiatePayment({
        booking_id: propertyId, // Mock booking ID
        amount: rent,
        method: selectedMethod
      });
      window.location.href = res.gateway_url;
    } catch (err) {
      console.error('Payment initiation failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form card">
      <h3 className="card-title mb-6">Book this property</h3>
      
      <div className="rent-summary mb-6 p-4 bg-glass rounded">
        <div className="flex justify-between mb-2">
          <span>Monthly Rent</span>
          <span className="font-bold">₹{rent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Security Deposit</span>
          <span className="font-bold">₹{(rent * 2).toLocaleString()}</span>
        </div>
        <hr className="my-2 border-secondary/20" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total to Pay</span>
          <span>₹{(rent * 3).toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-6">
          <label className="form-label">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {methods.map(m => (
              <label 
                key={m.id} 
                className={`payment-method-option p-3 border rounded cursor-pointer flex items-center gap-3 transition-all ${selectedMethod === m.id ? 'border-primary bg-primary/10' : 'border-secondary/20'}`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value={m.id} 
                  checked={selectedMethod === m.id}
                  onChange={() => setSelectedMethod(m.id)}
                  className="hidden"
                />
                <span className="text-2xl">{m.icon === 'card' ? '💳' : m.icon === 'upi' ? '📱' : m.icon === 'bank' ? '🏦' : '💰'}</span>
                <span className="text-sm font-medium">{m.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-cta w-full py-4 text-lg"
          disabled={submitting}
        >
          {submitting ? 'Initiating Secure Payment...' : 'Proceed to Pay'}
        </button>
        
        <p className="mt-4 text-xs text-center text-secondary">
          🔒 Payments are held in <strong>Secure Escrow</strong> until you move in.
        </p>
      </form>
    </div>
  );
}
