'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Award,
  Calendar,
  Banknote,
  Hash,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Define the shape of a simplified member object for the dropdown
interface Member {
  _id: string;
  name: string;
  email: string;
}

export default function PayMembershipPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);
  const [formData, setFormData] = useState({
    memberId: '',
    membershipType: 'ANNUAL',
    paymentDate: new Date().toISOString().split('T')[0], // Default to today
    amount: '',
    paymentMethod: 'CASH',
    transactionId: '',
    notes: '',
  });

  // Fetch active members to populate the selection dropdown
  useEffect(() => {
    const fetchActiveMembers = async () => {
      try {
        // Fetch all active members for the dropdown
        const response = await fetch('/api/members?status=ACTIVE&limit=1000');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        toast.error('Could not load member list.');
      } finally {
        setIsFetchingMembers(false);
      }
    };
    fetchActiveMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId || !formData.amount) {
      toast.error('Please select a member and enter an amount.');
      return;
    }
    setLoading(true);

    try {
      // This is a hypothetical API endpoint for recording payments
      const response = await fetch('/api/membership/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Payment recorded successfully!');
        router.push('/membership/details'); // Redirect after success
      } else {
        toast.error(data.error || 'Failed to record payment.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard">
          <button className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Record Membership Payment
          </h1>
          <p className="text-slate-600">
            Manually record a new membership fee payment for a user.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member & Membership Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Member *
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <select
                  id="memberId"
                  required
                  disabled={isFetchingMembers}
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                  value={formData.memberId}
                  onChange={e =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                >
                  <option value="" disabled>
                    {isFetchingMembers ? 'Loading members...' : 'Select a member'}
                  </option>
                  {members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="membershipType"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Membership Type *
              </label>
              <div className="relative">
                <Award
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <select
                  id="membershipType"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                  value={formData.membershipType}
                  onChange={e =>
                    setFormData({ ...formData, membershipType: e.target.value })
                  }
                >
                  <option value="ANNUAL">Annual</option>
                  <option value="LIFE">Life</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Payment Date *
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  id="paymentDate"
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.paymentDate}
                  onChange={e =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Amount (₹) *
              </label>
              <div className="relative">
                <Banknote
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  id="amount"
                  type="number"
                  required
                  min="0"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g., 500"
                  value={formData.amount}
                  onChange={e =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.paymentMethod}
                onChange={e =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="transactionId"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Transaction ID (Optional)
              </label>
              <div className="relative">
                <Hash
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  id="transactionId"
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Payment reference or ID"
                  value={formData.transactionId}
                  onChange={e =>
                    setFormData({ ...formData, transactionId: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Notes (Optional)
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute left-3 top-5 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <textarea
                id="notes"
                rows={3}
                className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Any additional details about the payment..."
                value={formData.notes}
                onChange={e =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-200 space-x-4">
            <Link href="/dashboard">
              <button
                type="button"
                className="px-6 py-3 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading || isFetchingMembers}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}