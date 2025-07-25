'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { Plus, Megaphone, Zap, Calendar, Award } from 'lucide-react';
import type { Announcement } from '@/types';

// Helper to get an icon based on announcement type
const TypeIcon = ({ type }: { type: string }) => {
  const props = { size: 20, className: 'text-white' };
  switch (type) {
    case 'URGENT': return <Zap {...props} />;
    case 'EVENT': return <Calendar {...props} />;
    case 'ACHIEVEMENT': return <Award {...props} />;
    default: return <Megaphone {...props} />;
  }
};

const typeColor: Record<string, string> = {
    URGENT: 'bg-red-500',
    EVENT: 'bg-blue-500',
    ACHIEVEMENT: 'bg-yellow-500',
    GENERAL: 'bg-primary',
}

// Announcement Card Component
function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColor[announcement.type]}`}>
            <TypeIcon type={announcement.type} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{announcement.title}</h3>
            <p className="text-sm text-slate-500">
              Posted by {announcement.author.name} on {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{announcement.type}</span>
      </div>
      <p className="text-slate-700 mt-4">{announcement.content}</p>
    </div>
  );
}


export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      toast.error('Could not fetch announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Announcements</h1>
          <p className="text-slate-600">Latest news and updates for all members.</p>
        </div>
        {isAdmin && (
          <Link href="/announcements/create" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>New Announcement</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <p className="text-center py-12 text-slate-500">No announcements yet.</p>
          )}
        </div>
      )}
    </div>
  );
}