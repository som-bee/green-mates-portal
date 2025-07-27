'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  TreePine,
  Heart,
  TrendingUp,
  Award,
  AlertCircle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

// Define the shape of the API response
interface DashboardData {
  stats: {
    totalMembers: number;
    activeMembers: number;
    upcomingActivities: number;
    completedActivities: number;
    pendingApprovals?: number;
    totalImpact: {
      animalsRescued: number;
      treesPlanted: number;
      bloodUnitsCollected: number;
      peopleReached: number;
    };
  };
  recentActivities: {
    id: string;
    title: string;
    date: string;
    participants: number;
    status: string;
  }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { session: user } = useAuth(); // Get user from context

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        toast.error("Could not load dashboard data.");
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const isAdmin = user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
  const stats = dashboardData?.stats;
  const recentActivities = dashboardData?.recentActivities || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers?.toString() || '0',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      href: '/members',
    },
    {
      title: 'Upcoming Activities',
      value: stats?.upcomingActivities?.toString() || '0',
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      href: '/activities',
    },
    {
      title: 'Trees Planted',
      value: stats?.totalImpact?.treesPlanted?.toLocaleString() || '0',
      icon: TreePine,
      color: 'bg-primary/10 text-primary',
      href: '/reports',
    },
    {
      title: 'Blood Units Donated',
      value: stats?.totalImpact?.bloodUnitsCollected?.toString() || '0',
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      href: '/reports',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-lg opacity-90">
          Here&apos;s what&apos;s happening with Tarakeswar Green Mates today.
        </p>
        {isAdmin && stats?.pendingApprovals && stats.pendingApprovals > 0 && (
          <div className="mt-4 flex items-center space-x-2 bg-white/20 rounded-lg p-3">
            <AlertCircle size={20} />
            <span>You have {stats.pendingApprovals} pending member approvals</span>
            <Link href="/members/pending" className="underline hover:no-underline">
              Review now
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  <p className="text-sm text-slate-500">{card.title}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-slate-800">
              Recent & Upcoming Activities
            </h2>
            <Link href="/activities" className="text-primary hover:text-secondary text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <Eye size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`}>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <h3 className="font-medium text-slate-800">{activity.title}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(activity.date).toLocaleDateString()} • {activity.participants} participants
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      activity.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/activities/create" className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors group cursor-pointer">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary">Create Activity</span>
            </Link>
            {isAdmin && (
              <Link href="/members" className="p-4 bg-secondary/20 hover:bg-secondary/30 rounded-lg text-center transition-colors group cursor-pointer">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-primary">Manage Members</span>
              </Link>
            )}
            <Link href="/announcements" className="p-4 bg-accent/30 hover:bg-accent/40 rounded-lg text-center transition-colors group cursor-pointer">
                <Award className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary">Announcements</span>
            </Link>
            <Link href="/reports" className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-center transition-colors group cursor-pointer">
                <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-yellow-600">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}