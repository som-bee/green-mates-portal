'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'; // Correct import for charting
import toast from 'react-hot-toast';

// Define the shape of the data from our report API
interface ReportData {
  totalRevenue: number;
  annualRevenue: number;
  paymentsThisMonth: number;
  newLifeMembers: number;
  monthlyRevenue: { month: string; total: number }[];
}

// Reusable Stat Card Component
function StatCard({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string | number, color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  );
}


export default function MembershipReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('/api/membership/report');
        if (!response.ok) throw new Error('Failed to fetch report');
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        toast.error('Could not load report data.');
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);


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
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Membership Report</h1>
        <p className="text-slate-600">Analytics and insights on membership payments.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} title="Total Revenue" value={`₹${reportData.totalRevenue.toLocaleString()}`} color="bg-green-100 text-green-600" />
        <StatCard icon={Calendar} title="Payments This Month" value={reportData.paymentsThisMonth} color="bg-blue-100 text-blue-600" />
        <StatCard icon={Award} title="Total Life Members" value={reportData.newLifeMembers} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={Users} title="Annual Revenue" value={`₹${reportData.annualRevenue.toLocaleString()}`} color="bg-sky-100 text-sky-600" />
      </div>
      
      {/* Revenue Chart using Recharts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-slate-800">
          Revenue Over Last 6 Months
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={reportData.monthlyRevenue} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
              cursor={{ fill: 'rgba(210, 227, 215, 0.4)' }}
            />
            <Legend />
            <Bar dataKey="total" name="Total Revenue" fill="#3D8D7A" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}