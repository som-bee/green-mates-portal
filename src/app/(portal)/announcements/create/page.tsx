'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, 
    FileText, 
    ClipboardList, 
    Eye 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'GENERAL',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push('/announcements');
      } else {
        toast.error(data.error || 'Failed to post announcement.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/announcements" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Announcements</span>
      </Link>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">New Announcement</h1>
            <p className="text-slate-600">Share an update with the community.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" required placeholder="Announcement Title" className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content *</label>
            <textarea rows={8} required placeholder="Write the full content of the announcement here..." className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="GENERAL">General</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EVENT">Event</option>
                  <option value="ACHIEVEMENT">Achievement</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
                 <label htmlFor="isPublic" className="flex items-center p-3 border border-secondary rounded-lg w-full cursor-pointer hover:bg-slate-50 h-full">
                    <Eye size={20} className="text-slate-400 mr-4"/>
                    <input type="checkbox" id="isPublic" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked={formData.isPublic} onChange={e => setFormData({ ...formData, isPublic: e.target.checked })} />
                    <span className="ml-3 block text-sm text-slate-700 select-none">Make Public</span>
                </label>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link href="/announcements">
              <button type="button" className="px-6 py-3 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}