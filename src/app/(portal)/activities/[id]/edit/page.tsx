'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Activity } from '@/types';
import Link from 'next/link';

const activityTypes = ['WILDLIFE_RESCUE', 'TREE_PLANTATION', 'BLOOD_DONATION', 'AWARENESS', 'CLEANUP', 'OTHER'];

export default function EditActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Activity>>({});
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // Format date for datetime-local input
      const date = new Date(data.activity.date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      setFormData({ ...data.activity, date: date.toISOString().slice(0, 16) });
    } catch (e) {
      toast.error('Could not load activity data.');
      router.push('/activities');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push(`/activities/${id}`);
      } else {
        toast.error(data.error || 'Failed to update activity.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) return <div className="text-center py-12">Loading form...</div>;

  return (
    <div className="space-y-6">
       <Link href={`/activities/${id}`} className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary">
        <ArrowLeft size={20} /><span>Back to Details</span>
      </Link>
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Edit Activity</h1>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Form fields pre-filled with formData */}
            <div>
              <label className="label-style">Title *</label>
              <input name="title" type="text" required className="input-style" value={formData.title || ''} onChange={handleInputChange} />
            </div>
            {/* ... other fields like description, location, etc. ... */}
             <div className="flex justify-end pt-6 border-t">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}