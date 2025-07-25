'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import type { Activity, Pagination } from '@/types';
import ActivityCard from '@/components/portal/activities/ActivityCard';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
// You should create a generic PaginationControls component

const activityTypes = ['WILDLIFE_RESCUE', 'TREE_PLANTATION', 'BLOOD_DONATION', 'AWARENESS', 'CLEANUP', 'OTHER'];
const statusTypes = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', type: '' });
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const searchParams = useSearchParams(); // Get URL search params
  const { session } = useAuth(); // Get the current user

  const view = searchParams.get('view'); // Check for 'view=my'

  const fetchActivities = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
      });

      // --- ADD THIS LOGIC ---
      // If the view is 'my' and we have a user session, add the userId to the query
      if (view === 'my' && session?.id) {
        params.append('userId', session.id);
      }
      // ---------------------

      const response = await fetch(`/api/activities?${params}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch activities.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching activities.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.type, view, session]); // Add view and session to dependencies

  useEffect(() => {
    // Only fetch if we are viewing 'all' or if we have a session ID for the 'my' view
    if (view !== 'my' || (view === 'my' && session?.id)) {
      fetchActivities();
    }
  }, [fetchActivities, view, session]);

  const pageTitle = view === 'my' ? 'My Activities' : 'Activities Management';
  const pageDescription = view === 'my' ? 'Activities you are organizing or participating in.' : 'Oversee and manage all community activities.';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">{pageTitle}</h1>
          <p className="text-slate-600">{pageDescription}</p>
        </div>
        <Link href="/activities/create" className="btn-primary flex items-center space-x-2">
          <Plus size={20} /><span>Create Activity</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search by title or location..." className="input-style pl-10" value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="input-style" value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          {statusTypes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-style" value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          {activityTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading Activities...</div>
      ) : (
       <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.length > 0 ? (
              activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)
            ) : (
              <p className="col-span-full text-center py-12 text-slate-500">
                {view === 'my' ? 'You are not involved in any activities yet.' : 'No activities found.'}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}