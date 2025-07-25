// src/components/portal/Sidebar.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Calendar,
  Bell,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronDown,
  Shield,
  UserCheck,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Activities',
      href: '/activities',
      icon: Calendar,
      subItems: [
        { name: 'All Activities', href: '/activities' },
        { name: 'My Activities', href: '/activities/my' },
        { name: 'Create Activity', href: '/activities/create' },
      ],
    },
    {
      name: 'Members',
      href: '/members',
      icon: Users,
      adminOnly: true,
      subItems: [
        { name: 'All Members', href: '/members' },
        { name: 'Pending Approvals', href: '/members/pending' },
        { name: 'Add Member', href: '/members/create' },
        { name: 'Member Statistics', href: '/members/stats' },
      ],
    },
    {
      name: 'Announcements',
      href: '/announcements',
      icon: Bell,
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: FileText,
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      adminOnly: true,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserCheck,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const filteredItems = navigationItems.filter(item =>
    !item.adminOnly || isAdmin
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Updated with Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="TGM Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-primary">TGM Portal</h1>
                <p className="text-xs text-slate-500">Green Mates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isExpanded = expandedItems.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}

                  {/* Sub-items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.subItems!.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === subItem.href
                              ? 'bg-secondary text-primary font-medium'
                              : 'text-slate-600 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-700">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
                  {isAdmin && (
                    <Shield size={12} className="text-primary" />
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
