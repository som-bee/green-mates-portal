// src/app/api/membership/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Admin authentication
    const token = await getTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 1. Calculate Total and Typed Revenue
    const revenueByType = await Payment.aggregate([
      { $group: { _id: '$membershipType', total: { $sum: '$amount' } } }
    ]);
    const annualRevenue = revenueByType.find(r => r._id === 'ANNUAL')?.total || 0;
    const lifeRevenue = revenueByType.find(r => r._id === 'LIFE')?.total || 0;
    const totalRevenue = annualRevenue + lifeRevenue;

    // 2. Count Payments This Month
    const thisMonthStart = startOfMonth(new Date());
    const paymentsThisMonth = await Payment.countDocuments({
      paymentDate: { $gte: thisMonthStart }
    });
    
    // 3. Count Total Life Members
    const newLifeMembers = await Payment.countDocuments({ membershipType: 'LIFE' });

    // 4. Aggregate Monthly Revenue for the last 6 months
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyRevenueResult = await Payment.aggregate([
        { $match: { paymentDate: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format the monthly data for the chart labels
    const monthlyRevenue: { month: string, total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStr = format(date, 'MMM yyyy');
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const data = monthlyRevenueResult.find(d => d._id.year === year && d._id.month === month);
        monthlyRevenue.push({ month: monthStr, total: data?.total || 0 });
    }

    return NextResponse.json({
      totalRevenue,
      annualRevenue,
      paymentsThisMonth,
      newLifeMembers,
      monthlyRevenue,
    });

  } catch (error) {
    console.error('Membership report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}