import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { withAuth } from '@/lib/apiWrapper';

const reportHandler = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(0);
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

  // --- Member Statistics ---
  const totalMembers = await User.countDocuments({ status: 'ACTIVE' });
  const newMembersInPeriod = await User.countDocuments({
    dateJoined: { $gte: startDate, $lte: endDate }
  });
  
  const membersByRole = await User.aggregate([
    { $match: { status: 'ACTIVE' } },
    { $group: { _id: '$role', count: { $sum: 1 } } },
    { $project: { name: '$_id', value: '$count' } }
  ]);
  
  // --- Activity Statistics ---
  const activitiesInPeriod = await Activity.find({
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  const activitiesByType = await Activity.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $project: { name: '$_id', value: '$count' } }
  ]);

  // --- Impact Statistics ---
  const totalImpact = await Activity.aggregate([
    { $match: { status: 'COMPLETED', date: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: null,
        animalsRescued: { $sum: '$impact.animalsRescued' },
        treesPlanted: { $sum: '$impact.treesPlanted' },
        bloodUnitsCollected: { $sum: '$impact.bloodUnitsCollected' },
        wasteCollected: { $sum: '$impact.wasteCollected' },
      }
    }
  ]);

  return NextResponse.json({
    stats: {
      totalMembers,
      newMembersInPeriod,
      totalActivitiesInPeriod: activitiesInPeriod.length,
      completedActivitiesInPeriod: activitiesInPeriod.filter(a => a.status === 'COMPLETED').length,
    },
    charts: {
      membersByRole,
      activitiesByType,
    },
    impact: totalImpact[0] || { animalsRescued: 0, treesPlanted: 0, bloodUnitsCollected: 0, wasteCollected: 0 },
    dateRange: { startDate, endDate }
  });
};

export const GET = withAuth(['ADMIN', 'SUPER_ADMIN'], reportHandler);