'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Users,
  Activity,
  Download,
  Leaf,
  Droplets,
  Trash2,
  HeartHandshake,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';

// Consistent colors for charts
const COLORS = ['#3D8D7A', '#6EAF99', '#A0D1B8', '#D1E3D7'];

// Reusable Stat Card Component (inspired by your dashboard)
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const fetchReports = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      const response = await fetch(`/api/reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      toast.error('Could not fetch report data.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading || !reportData) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Reports & Analytics</h1>
          <p className="text-slate-600">Insights into member and activity performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Active Members" value={reportData.stats.totalMembers} icon={Users} color="bg-blue-100 text-blue-600"/>
        <StatCard title="New Members This Period" value={reportData.stats.newMembersInPeriod} icon={Users} color="bg-green-100 text-green-600"/>
        <StatCard title="Activities This Period" value={reportData.stats.totalActivitiesInPeriod} icon={Activity} color="bg-primary/10 text-primary" />
        <StatCard title="Completed Activities" value={reportData.stats.completedActivitiesInPeriod} icon={TrendingUp} color="bg-yellow-100 text-yellow-600"/>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Members by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={reportData.charts.membersByRole} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label >
                {reportData.charts.membersByRole.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Activities by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.charts.activitiesByType} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" fill="#3D8D7A" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Impact Summary */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-800">Total Impact in Selected Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
                <Leaf className="mx-auto text-green-600 mb-2" size={32}/>
                <p className="text-2xl font-bold text-slate-800">{reportData.impact.treesPlanted || 0}</p>
                <p className="text-sm text-slate-500">Trees Planted</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
                <Droplets className="mx-auto text-red-600 mb-2" size={32}/>
                <p className="text-2xl font-bold text-slate-800">{reportData.impact.bloodUnitsCollected || 0}</p>
                <p className="text-sm text-slate-500">Blood Units</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
                <HeartHandshake className="mx-auto text-yellow-600 mb-2" size={32}/>
                <p className="text-2xl font-bold text-slate-800">{reportData.impact.animalsRescued || 0}</p>
                <p className="text-sm text-slate-500">Animals Rescued</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
                <Trash2 className="mx-auto text-blue-600 mb-2" size={32}/>
                <p className="text-2xl font-bold text-slate-800">{reportData.impact.wasteCollected || 0} kg</p>
                <p className="text-sm text-slate-500">Waste Collected</p>
            </div>
        </div>
      </div>
    </div>
  );
}