// src/app/(portal)/dashboard/page.tsx
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
  Plus,
  Activity,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
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
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  date: string;
  participants: number;
  status: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user info
      const userResponse = await fetch('/api/auth/me');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }

      // Mock dashboard stats - replace with actual API calls
      setStats({
        totalMembers: 124,
        activeMembers: 118,
        upcomingActivities: 8,
        completedActivities: 45,
        pendingApprovals: 5,
        totalImpact: {
          animalsRescued: 1000,
          treesPlanted: 3547,
          bloodUnitsCollected: 612,
          peopleReached: 35000,
        }
      });

      // Mock recent activities
      setRecentActivities([
        {
          id: '1',
          title: 'Tree Plantation Drive',
          type: 'TREE_PLANTATION',
          date: '2024-03-15',
          participants: 23,
          status: 'COMPLETED',
        },
        {
          id: '2',
          title: 'Wildlife Rescue Training',
          type: 'WILDLIFE_RESCUE',
          date: '2024-03-20',
          participants: 15,
          status: 'UPCOMING',
        },
        {
          id: '3',
          title: 'Blood Donation Camp',
          type: 'BLOOD_DONATION',
          date: '2024-03-25',
          participants: 45,
          status: 'UPCOMING',
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Update the statsCards array type definition
  interface StatsCard {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral'; // Add 'neutral' here
    icon: React.ElementType;
    color: string;
    href: string;
  }


  const statsCards: StatsCard[] = [
    {
      title: 'Total Members',
      value: stats?.totalMembers?.toString() || '0',
      change: '+12 this month',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      href: '/members',
    },
    {
      title: 'Active Activities',
      value: stats?.upcomingActivities?.toString() || '0',
      change: '3 upcoming',
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      href: '/activities',
    },
    {
      title: 'Trees Planted',
      value: stats?.totalImpact?.treesPlanted?.toLocaleString() || '0',
      change: '+47 this week',
      changeType: 'positive' as const,
      icon: TreePine,
      color: 'bg-primary/10 text-primary',
      href: '/reports',
    },
    {
      title: 'Blood Units',
      value: stats?.totalImpact?.bloodUnitsCollected?.toString() || '0',
      change: '+24 last drive',
      changeType: 'positive' as const,
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
          Here's what's happening with Tarakeswar Green Mates today.
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
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  <p className="text-sm text-slate-500">{card.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp
                  size={16}
                  className={`${card.changeType === 'positive'
                      ? 'text-green-500'
                      : card.changeType === 'negative'
                        ? 'text-red-500'
                        : 'text-slate-400' // This handles 'neutral' and any other cases
                    }`}
                />
                <span
                  className={`text-sm ${card.changeType === 'positive'
                      ? 'text-green-600'
                      : card.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-slate-600' // This handles 'neutral' and any other cases
                    }`}
                >
                  {card.change}
                </span>
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
              Recent Activities
            </h2>
            <Link href="/activities" className="text-primary hover:text-secondary text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <Eye size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-slate-800">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {new Date(activity.date).toLocaleDateString()} • {activity.participants} participants
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/activities/create">
              <div className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors group cursor-pointer">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary">
                  Create Activity
                </span>
              </div>
            </Link>

            {isAdmin && (
              <Link href="/members">
                <div className="p-4 bg-secondary/20 hover:bg-secondary/30 rounded-lg text-center transition-colors group cursor-pointer">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-primary">
                    Manage Members
                  </span>
                </div>
              </Link>
            )}

            <Link href="/announcements">
              <div className="p-4 bg-accent/30 hover:bg-accent/40 rounded-lg text-center transition-colors group cursor-pointer">
                <Award className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary">
                  Announcements
                </span>
              </div>
            </Link>

            <Link href="/reports">
              <div className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-center transition-colors group cursor-pointer">
                <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-yellow-600">
                  View Reports
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-serif font-bold text-slate-800 mb-6">
          Upcoming This Week
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">Wildlife Rescue Training</h3>
              <p className="text-sm text-slate-600">March 20, 2024 • 10:00 AM</p>
              <p className="text-sm text-blue-600 mt-1">15 members registered</p>
            </div>
            <Link href="/activities/2" className="text-blue-600 hover:text-blue-700">
              <Eye size={20} />
            </Link>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="text-red-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">Blood Donation Camp</h3>
              <p className="text-sm text-slate-600">March 25, 2024 • 9:00 AM</p>
              <p className="text-sm text-red-600 mt-1">45 members registered</p>
            </div>
            <Link href="/activities/3" className="text-red-600 hover:text-red-700">
              <Eye size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
