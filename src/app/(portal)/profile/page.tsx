'use client';

import { useState, useEffect, ChangeEvent, ElementType } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { User, Mail, Phone, MapPin, Briefcase, Edit, Save, XCircle } from 'lucide-react';
import type { User as UserType } from '@/types';

// Define strict props for the helper component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  icon: ElementType;
  isEditing: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Helper component with correct styling from your UI pattern
const InputField = ({ label, name, value, icon: Icon, isEditing, onChange }: InputFieldProps) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          name={name}
          value={value}
          readOnly={!isEditing}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            !isEditing ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'
          }`}
        />
      </div>
    </div>
);

export default function ProfilePage() {
    const { session, setSession } = useAuth();
    const [formData, setFormData] = useState<Partial<UserType>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const displayData = isEditing ? formData : session;

    const handleEditClick = () => {
        setFormData(session || {});
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                if(setSession) setSession(data.user);
                setIsEditing(false);
            } else {
                toast.error(data.error || 'Failed to update profile.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">My Profile</h1>
                    <p className="text-slate-600">View and manage your personal information.</p>
                </div>
                {!isEditing ? (
                    <button onClick={handleEditClick} className="btn-primary flex items-center gap-2">
                        <Edit size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
                            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={handleCancelClick} className="btn-secondary flex items-center gap-2">
                            <XCircle size={16} /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Full Name" name="name" value={displayData?.name || ''} icon={User} onChange={handleInputChange} isEditing={isEditing} />
                    <InputField label="Email Address" name="email" value={displayData?.email || ''} icon={Mail} isEditing={false} />
                    <InputField label="Phone Number" name="phone" value={displayData?.phone || ''} icon={Phone} onChange={handleInputChange} isEditing={isEditing} />
                    <InputField label="Address" name="address" value={displayData?.address || ''} icon={MapPin} onChange={handleInputChange} isEditing={isEditing} />
                    <InputField label="Occupation" name="occupation" value={displayData?.occupation || ''} icon={Briefcase} isEditing={isEditing} onChange={handleInputChange} />
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea 
                        name="bio" 
                        rows={4} 
                        value={displayData?.bio || ''} 
                        onChange={handleInputChange} 
                        readOnly={!isEditing} 
                        className={`w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                            !isEditing ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'
                        }`}
                        placeholder={!isEditing && !displayData?.bio ? "No bio provided." : "Tell us a bit about yourself..."}
                    />
                </div>
            </div>
        </div>
    );
}