'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import type { Activity } from '@/types';
import { MapPin, Users } from 'lucide-react';

// Reusable ActivityCard component (can be moved to its own file)
const statusStyles: Record<string, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link href={`/activities/${activity.id}`} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[activity.status] || 'bg-gray-100'}`}>
          {activity.status}
        </span>
        <span className="text-sm text-slate-500">{new Date(activity.date).toLocaleDateString()}</span>
      </div>
      <h3 className="text-xl font-serif font-bold text-primary mt-4 group-hover:underline">{activity.title}</h3>
      <p className="text-slate-600 text-sm mt-2 h-10 line-clamp-2">{activity.description}</p>
      <div className="mt-4 border-t pt-4 space-y-2 text-sm text-slate-700">
        <div className="flex items-center space-x-2"><MapPin size={14} /> <span>{activity.location}</span></div>
        <div className="flex items-center space-x-2"><Users size={14} /> <span>{activity.currentParticipants} / {activity.maxParticipants || '∞'}</span></div>
      </div>
    </Link>
  );
}


// The "My Activities" Page Component
export default function MyActivitiesPage() {
const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth(); // session has { _id: "...", name: "..." }

  const fetchMyActivities = useCallback(async (userId: string) => {
    // setLoading is set to true initially, no need to set it again here
    try {
      const response = await fetch(`/api/activities?userId=${userId}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setMyActivities(data.activities);
    } catch (error) {
      toast.error('Could not fetch your activities.');
      console.error(error);
    } finally {
      setLoading(false); // This will now be called
    }
  }, []);

  useEffect(() => {
    // --- FIX IS HERE ---
    // Check for session._id instead of session.id
    if (session?._id) {
      fetchMyActivities(session._id);
    } else {
      // If there's no session after the initial check, stop loading.
      // This handles the case where the auth provider is still loading.
      if (!session) {
         setLoading(false);
      }
    }
  }, [session, fetchMyActivities]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">My Activities</h1>
        <p className="text-slate-600">A list of all activities you are organizing or participating in.</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myActivities.length > 0 ? (
            myActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border">
                <p className="text-slate-600 font-medium">You are not involved in any activities yet.</p>
                <Link href="/activities" className="text-primary hover:underline mt-2 inline-block">
                    Explore all activities
                </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}