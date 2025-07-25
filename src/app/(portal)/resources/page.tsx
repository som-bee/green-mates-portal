'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { Plus, FileText, Link as LinkIcon, Image as ImageIcon, Video, Download } from 'lucide-react';
import type { Resource } from '@/types';

// Helper for icons
const TypeIcon = ({ type }: { type: string }) => {
  const props = { size: 24, className: 'text-primary' };
  switch (type) {
    case 'DOCUMENT': return <FileText {...props} />;
    case 'IMAGE': return <ImageIcon {...props} />;
    case 'VIDEO': return <Video {...props} />;
    default: return <LinkIcon {...props} />;
  }
};

// Resource Item Component
function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <div className="flex items-start gap-4 p-4 border-b">
      <TypeIcon type={resource.type} />
      <div className="flex-grow">
        <h4 className="font-semibold text-slate-800">{resource.title}</h4>
        <p className="text-sm text-slate-600">{resource.description}</p>
        <p className="text-xs text-slate-400 mt-1">
          Uploaded by {resource.uploadedBy.name} on {new Date(resource.createdAt).toLocaleDateString()}
        </p>
      </div>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2 !px-3 !py-1.5 text-sm">
        <Download size={16} />
        <span>View</span>
      </a>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      toast.error('Could not fetch resources.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const category = resource.category || 'UNCATEGORIZED';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [resources]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Resources</h1>
          <p className="text-slate-600">Find documents, guidelines, and other materials.</p>
        </div>
        {isAdmin && (
          <Link href="/resources/create" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>Add Resource</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading resources...</div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedResources).map(category => (
            <div key={category} className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-4 capitalize">{category.toLowerCase().replace('_', ' ')}</h3>
              <div className="flex flex-col">
                {groupedResources[category].map(resource => (
                  <ResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          ))}
          {resources.length === 0 && <p className="text-center py-12 text-slate-500">No resources available.</p>}
        </div>
      )}
    </div>
  );
}