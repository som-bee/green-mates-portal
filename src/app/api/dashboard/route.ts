import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity, { IActivity } from '@/models/Activity';
import { withAuth } from '@/lib/apiWrapper';

const dashboardHandler = async (req: NextRequest & { user: { role: string } }) => {
  await dbConnect();
  
  const { role } = req.user;

  // --- Aggregate Member Stats ---
  const memberStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalMembers: { $sum: 1 },
        activeMembers: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } },
        pendingApprovals: { $sum: { $cond: [{ $eq: ['$status', 'PENDING_APPROVAL'] }, 1, 0] } },
      },
    },
  ]);

  // --- Aggregate Activity Stats ---
  const activityStats = await Activity.aggregate([
    {
      $group: {
        _id: null,
        upcomingActivities: { $sum: { $cond: [{ $eq: ['$status', 'UPCOMING'] }, 1, 0] } },
        completedActivities: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
        animalsRescued: { $sum: '$impact.animalsRescued' },
        treesPlanted: { $sum: '$impact.treesPlanted' },
        bloodUnitsCollected: { $sum: '$impact.bloodUnitsCollected' },
        peopleReached: { $sum: '$impact.peopleReached' },
      },
    },
  ]);

  // --- Fetch Recent Activities ---
   const recentActivitiesFromDb = await Activity.find({})
    .sort({ date: -1 })
    .limit(5)
    // FIX: Expect an array of IActivity
    .lean<IActivity[]>(); 

  // TypeScript now correctly understands recentActivitiesFromDb is an array
  const recentActivities = recentActivitiesFromDb.map(act => ({
      id: act._id.toString(),
      title: act.title,
      date: act.date.toISOString(),
      participants: act.currentParticipants,
      status: act.status
  }));


  const stats = {
    totalMembers: memberStats[0]?.totalMembers || 0,
    activeMembers: memberStats[0]?.activeMembers || 0,
    upcomingActivities: activityStats[0]?.upcomingActivities || 0,
    completedActivities: activityStats[0]?.completedActivities || 0,
    pendingApprovals: role === 'ADMIN' || role === 'SUPER_ADMIN' ? memberStats[0]?.pendingApprovals : undefined,
    totalImpact: {
      animalsRescued: activityStats[0]?.animalsRescued || 0,
      treesPlanted: activityStats[0]?.treesPlanted || 0,
      bloodUnitsCollected: activityStats[0]?.bloodUnitsCollected || 0,
      peopleReached: activityStats[0]?.peopleReached || 0,
    },
  };

  return NextResponse.json({
    stats,
    recentActivities,
  });
};

export const GET = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], dashboardHandler);