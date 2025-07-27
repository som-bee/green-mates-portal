'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, 
    FileText, 
    Calendar, 
    MapPin, 
    Users, 
    ClipboardList // A suitable icon for 'Type'
} from 'lucide-react';
import toast from 'react-hot-toast';

const activityTypes = ['WILDLIFE_RESCUE', 'TREE_PLANTATION', 'BLOOD_DONATION', 'AWARENESS', 'CLEANUP', 'OTHER'];

export default function CreateActivityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'OTHER', date: '', location: '', maxParticipants: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push('/activities');
      } else {
        toast.error(data.error || 'Failed to create activity.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/activities" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Activities</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Create New Activity</h1>
            <p className="text-slate-600">Plan and schedule a new event for the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g., Annual Tree Plantation Drive" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea rows={4} required className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Provide details about the event..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select required className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {activityTypes.map(type => <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="datetime-local" required className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" required className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g., City Park" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="number" min="1" className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Leave blank for unlimited" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link href="/activities">
              <button type="button" className="px-6 py-3 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}