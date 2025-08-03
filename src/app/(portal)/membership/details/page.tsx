'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import {
  Badge,
  Calendar,
  ShieldCheck,
  CreditCard,
  UploadCloud,
  ArrowLeft,
  Info,
  AlertTriangle,
} from 'lucide-react';

// Sub-component for the Offline Payment Form
const OfflinePaymentForm = ({
  onBack,
  onSuccessfulSubmit,
}: {
  onBack: () => void;
  onSuccessfulSubmit: () => void;
}) => {
  const [formData, setFormData] = useState({
    amount: '500',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    transactionId: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/membership/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');
      toast.success(result.message);
      onSuccessfulSubmit(); // Refresh data on the parent component
    } catch (error: any) {
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm text-slate-600 hover:text-primary mb-4 font-medium"
      >
        <ArrowLeft size={16} />
        <span>Back to Payment Options</span>
      </button>
      <h3 className="font-bold text-lg">Submit Offline Payment Proof</h3>
      <p className="text-slate-500 mt-1 mb-4">
        Fill this form if you have already paid via bank transfer, UPI, or cash.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount Paid (₹)*
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Date*
            </label>
            <input
              type="date"
              required
              value={formData.paymentDate}
              onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Method*
          </label>
          <select
            value={formData.paymentMethod}
            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>UPI</option>
            <option>BANK_TRANSFER</option>
            <option>CASH</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Transaction ID / Reference*
          </label>
          <input
            type="text"
            required
            placeholder="Enter the transaction reference number"
            value={formData.transactionId}
            onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Proof of Payment (Screenshot)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-xs text-gray-500">
                File upload feature coming soon. Please provide a clear Transaction ID.
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-primary/20 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
};

// Main Page Component
export default function MyMembershipPage() {
  const { session: user } = useAuth();
  const [membershipData, setMembershipData] = useState<{ user: any; pendingRequest: any } | null>(null);
  const [view, setView] = useState<'main' | 'offlineForm'>('main');
  const [loading, setLoading] = useState(true);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/membership/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setMembershipData(data);
    } catch (error) {
      toast.error("Couldn't load your membership status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const initializePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to pay.");
      return;
    }
    setPaymentInProgress(true);

    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500 }), // The amount in INR
      });
      if (!orderRes.ok) throw new Error("Could not create payment order.");

      const { orderId } = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 500 * 100, // Amount in paise
        currency: "INR",
        name: "Tarakeswar Green Mates",
        description: "Annual Membership Fee",
        order_id: orderId,
        handler: async function (response: any) {
          const verificationRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verificationRes.json();
          if (verificationRes.ok) {
            toast.success(result.message);
            fetchStatus(); // Refresh status after successful payment
          } else {
            toast.error(result.error || "Payment verification failed.");
          }
        },
        prefill: { name: user.name, email: user.email, contact: user.phone || '' },
        theme: { color: "#3D8D7A" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error(response.error);
      });
      rzp.open();

    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred.");
    } finally {
      setPaymentInProgress(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const userStatus = membershipData?.user;
  const pendingRequest = membershipData?.pendingRequest;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-primary">My Membership</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Current Status</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3"><ShieldCheck className="text-green-600" size={20} /><span className="font-medium text-slate-700">Status:</span><span className={`px-2 py-1 rounded-full text-xs font-semibold ${userStatus?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{userStatus?.status?.replace('_', ' ') || 'N/A'}</span></div>
          <div className="flex items-center space-x-3"><Badge className="text-primary" size={20} /><span className="font-medium text-slate-700">Type:</span><span className="text-slate-600">{userStatus?.membershipType || 'N/A'}</span></div>
          <div className="flex items-center space-x-3"><Calendar className="text-primary" size={20} /><span className="font-medium text-slate-700">Expires On:</span><span className="text-slate-600">{userStatus?.expiryDate ? new Date(userStatus.expiryDate).toLocaleDateString() : 'N/A'}</span></div>
        </div>
        
        {pendingRequest && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-lg text-slate-800">Your Submission Status</h3>
            {pendingRequest.status === 'PENDING_APPROVAL' && (
              <div className="mt-2 flex items-start space-x-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <div>Your offline payment submitted on {new Date(pendingRequest.paymentDate).toLocaleDateString()} is being reviewed by an admin. You will be notified upon approval.</div>
              </div>
            )}
            {pendingRequest.status === 'REJECTED' && (
              <div className="mt-2 flex items-start space-x-3 p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Your recent submission was rejected.</p>
                  <p className="text-sm">Reason: {pendingRequest.rejectionReason}</p>
                  <p className="text-sm mt-2">Please correct the issue and submit again, or choose another payment method.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show payment options only if there's no PENDING request */}
        {view === 'main' && (!pendingRequest || pendingRequest.status === 'REJECTED') && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-lg">Renew Your Membership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button
                onClick={initializePayment}
                disabled={paymentInProgress}
                className="p-6 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-10 h-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-primary">
                  {paymentInProgress ? 'Processing...' : 'Pay Online Now'}
                </span>
                <p className="text-xs text-slate-500">Instant activation via Razorpay</p>
              </button>
              <button
                onClick={() => setView('offlineForm')}
                className="p-6 bg-secondary/20 hover:bg-secondary/30 rounded-lg text-center transition-colors group cursor-pointer"
              >
                <UploadCloud className="w-10 h-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-primary">Submit Offline Payment</span>
                <p className="text-xs text-slate-500">For bank transfer, UPI, or cash</p>
              </button>
            </div>
          </div>
        )}

        {view === 'offlineForm' && (
          <OfflinePaymentForm onBack={() => setView('main')} onSuccessfulSubmit={() => { setView('main'); fetchStatus(); }} />
        )}
      </div>
    </div>
  );
}