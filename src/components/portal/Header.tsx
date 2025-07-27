// src/components/portal/Header.tsx
'use client';
import { Bell, Menu, Search, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface User {
  name?: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  user: User;
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu size={24} />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search activities, members..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <MessageSquare size={16} />
              <span>New Announcement</span>
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="hidden md:inline font-medium">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
