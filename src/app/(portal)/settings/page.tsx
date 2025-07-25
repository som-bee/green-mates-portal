'use client';

import { useState, FormEvent, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Lock, Bell, ShieldAlert } from 'lucide-react';

// Reusable card component for consistent section styling
function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <Icon size={24} className="text-primary" />
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || 'Failed to change password.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Settings</h1>
        <p className="text-slate-600">Manage your account settings and preferences.</p>
      </div>

      {/* Change Password Card */}
      <SettingsCard title="Change Password" icon={Lock}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </SettingsCard>

      {/* Notification Settings Card (Placeholder) */}
      <SettingsCard title="Notification Settings" icon={Bell}>
        <p className="text-slate-500">Manage your email notification preferences (coming soon).</p>
      </SettingsCard>

      {/* Danger Zone Card (Placeholder) */}
      <div className="bg-red-50 border-red-200 border rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <ShieldAlert size={24} className="text-red-600" />
          <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
        </div>
        <button className="btn-danger opacity-50 cursor-not-allowed">Deactivate Account</button>
        <p className="text-sm text-red-700 mt-2">Account deactivation is permanent (coming soon).</p>
      </div>
    </div>
  );
}