'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash, Calendar, MapPin, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Activity } from '@/types';
import { useAuth } from '@/components/AuthProvider';

export default function ActivityDetailsPage() {
   const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth(); // Get the current user session

  const id = params.id as string;

  const fetchActivityDetails = useCallback(async () => {
    // We only set the main loading state on the initial fetch
    if (!activity) setLoading(true); 
    try {
      const response = await fetch(`/api/activities/${id}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data.activity);
      } else {
        toast.error('Activity not found.');
        router.push('/activities');
      }
    } catch {
      toast.error('Failed to fetch activity details.');
    } finally {
      setLoading(false);
    }
  }, [id, router, activity]);

  useEffect(() => {
    fetchActivityDetails();
  }, [id, fetchActivityDetails]); // Only run once on mount

  // --- NEW: Logic for Join/Leave Button ---
  const handleJoinLeave = async () => {
    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/activities/${id}/join`, { method: 'POST' });
        const data = await response.json();
        if(response.ok) {
            toast.success(data.message);
            fetchActivityDetails(); // Refresh data after action
        } else {
            toast.error(data.error || "An error occurred.");
        }
    } catch {
        toast.error("Could not perform action.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const isCurrentUserParticipant = useMemo(() => {
    if (!session?._id || !activity?.participants) return false;
    return activity.participants.some(p => p._id === session._id);
  }, [session, activity]);

const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
        try {
            const response = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Activity deleted successfully.');
                router.push('/activities');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete activity.');
            }
        } catch {
            toast.error('An error occurred during deletion.');
        }
    }
  };

   const canModify = useMemo(() => {
    if (!session?._id || !activity?.organizer) return false;
    
    // Check if the user is a SUPER_ADMIN
    if (session.role === 'SUPER_ADMIN') {
        return true;
    }
    
    // Check if the user is the organizer of the activity
    return activity.organizer._id === session._id;
  }, [session, activity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  if (!activity) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/activities" className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Activities</span>
        </Link>
       {canModify && (
          <div className="flex space-x-2">
            <Link href={`/activities/${id}/edit`} className="btn-secondary flex items-center space-x-2">
              <Edit size={16}/><span>Edit</span>
            </Link>
            <button onClick={handleDelete} className="btn-danger flex items-center space-x-2">
              <Trash size={16}/><span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <span className={`px-3 py-1 text-xs font-medium rounded-full mb-4 inline-block`}>
          {activity.status}
        </span>
        <h1 className="text-4xl font-serif font-bold text-primary">{activity.title}</h1>
        <p className="mt-4 text-slate-600 text-lg">{activity.description}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-8 border-t pt-8">
          <div className="flex items-center space-x-3"><Calendar className="text-primary"/><p>{new Date(activity.date).toLocaleString()}</p></div>
          <div className="flex items-center space-x-3"><MapPin className="text-primary"/><p>{activity.location}</p></div>
          <div className="flex items-center space-x-3"><Users className="text-primary"/><p>{activity.currentParticipants} / {activity.maxParticipants || 'Unlimited'}</p></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-xl mb-4">Participants ({activity.participants.length})</h3>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {activity.participants.length > 0 ? (
                activity.participants.map(p => (
                  <div key={p._id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary">{p.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-slate-800">{p.name}</p>
                      <p className="text-sm text-slate-500">{p.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No participants have joined yet.</p>
              )}
            </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-xl mb-4">Organizer</h3>
            <div className="flex items-center space-x-3">
                <Shield size={20} className="text-primary"/>
                <div>
                    <p className="font-medium text-slate-800">{activity.organizer.name}</p>
                    <p className="text-sm text-slate-500">{activity.organizer.email}</p>
                </div>
            </div>
             <button 
                onClick={handleJoinLeave}
                disabled={isSubmitting}
                className={`w-full mt-6 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 ${
                    isCurrentUserParticipant
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'btn-primary'
                }`}
            >
                {isSubmitting 
                    ? 'Submitting...' 
                    : isCurrentUserParticipant 
                    ? 'Leave Activity' 
                    : 'Join Activity'
                }
            </button>
        </div>
      </div>
    </div>
  );
}