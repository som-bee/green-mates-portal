// src/components/Breadcrumbs.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <div className="bg-gray-50 border-b border-secondary">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link href="/" className="flex items-center hover:text-primary transition-colors">
            <Home size={16} />
            <span className="ml-1">Home</span>
          </Link>
          
          {segments.map((segment, index) => {
            const path = '/' + segments.slice(0, index + 1).join('/');
            const isLast = index === segments.length - 1;
            const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
            
            return (
              <div key={path} className="flex items-center space-x-2">
                <ChevronRight size={16} className="text-slate-400" />
                {isLast ? (
                  <span className="text-primary font-medium">{label}</span>
                ) : (
                  <Link href={path} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
