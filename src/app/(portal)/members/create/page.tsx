// src/app/(portal)/members/create/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    membershipType: 'ANNUAL',
    role: 'MEMBER',
    skills: '',
    interests: '',
    bio: '',
    autoApprove: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/members/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push('/members');
      } else {
        toast.error(data.error || 'Failed to create member');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/members">
          <button className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Members</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Add New Member</h1>
          <p className="text-slate-600">Create a new member account with admin privileges</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Role and Membership */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select
                  required
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Membership Type *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
              >
                <option value="ANNUAL">Annual</option>
                <option value="LIFE">Life</option>
                <option value="HONORARY">Honorary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Occupation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Skills & Expertise
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="e.g. Photography, Teaching, Medical (comma separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Areas of Interest
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="e.g. Wildlife rescue, Tree plantation (comma separated)"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Brief description about the member..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {/* Auto Approve Option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoApprove"
              className="rounded border-secondary text-primary focus:ring-primary/20"
              checked={formData.autoApprove}
              onChange={(e) => setFormData({ ...formData, autoApprove: e.target.checked })}
            />
            <label htmlFor="autoApprove" className="text-sm text-slate-700">
              Auto-approve this member (they can login immediately)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link href="/members">
              <button
                type="button"
                className="px-6 py-3 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Member...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
