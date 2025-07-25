import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';
import type { Activity } from '@/types';

const statusStyles: Record<string, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function ActivityCard({ activity }: { activity: Activity }) {
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