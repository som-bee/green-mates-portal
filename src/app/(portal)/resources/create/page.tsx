'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, 
    FileText, 
    ClipboardList, 
    Link as LinkIcon, 
    Tag, 
    Lock 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateResourcePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'DOCUMENT',
    category: 'GUIDELINES',
    accessLevel: 'MEMBERS_ONLY',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push('/resources');
      } else {
        toast.error(data.error || 'Failed to add resource.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/resources" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Resources</span>
      </Link>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Add New Resource</h1>
          <p className="text-slate-600">Upload a file or add a link for members.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" required placeholder="Resource Title" className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="url" required placeholder="https://example.com/file.pdf" className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea rows={3} required placeholder="A brief summary of what this resource is about..." className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="DOCUMENT">Document</option>
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">Link</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="GUIDELINES">Guidelines</option>
                  <option value="TRAINING">Training</option>
                  <option value="FORMS">Forms</option>
                  <option value="REPORTS">Reports</option>
                </select>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Access Level *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select className="w-full pl-12 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none" value={formData.accessLevel} onChange={e => setFormData({ ...formData, accessLevel: e.target.value })}>
                  <option value="MEMBERS_ONLY">Members Only</option>
                  <option value="ADMIN_ONLY">Admins Only</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link href="/resources">
              <button type="button" className="px-6 py-3 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Adding...' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}