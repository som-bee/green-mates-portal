import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Activity, { IActivity } from '@/models/Activity';
import { withAuth } from '@/lib/apiWrapper';

const ActivitySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(['WILDLIFE_RESCUE', 'TREE_PLANTATION', 'BLOOD_DONATION', 'AWARENESS', 'CLEANUP', 'OTHER']),
  date: z.coerce.date(),
  location: z.string().min(3),
  maxParticipants: z.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    // --- FIX: Correctly combine all query conditions ---
    const queryConditions = [];

    if (searchParams.has('status')) {
      queryConditions.push({ status: searchParams.get('status') });
    }
    if (searchParams.has('type')) {
      queryConditions.push({ type: searchParams.get('type') });
    }
    if (searchParams.has('search')) {
      const search = searchParams.get('search')!;
      queryConditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      });
    }
    if (searchParams.has('userId')) {
      const userId = searchParams.get('userId')!;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }
      queryConditions.push({
        $or: [{ organizerId: userId }, { participants: userId }],
      });
    }

    const query = queryConditions.length > 0 ? { $and: queryConditions } : {};
    
    const activitiesFromDb = await Activity.find(query)
      .populate('organizerId', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IActivity[]>();

    const activities = activitiesFromDb.map((activity) => ({
      id: activity._id.toString(),
      ...activity,
    }));

    const total = await Activity.countDocuments(query);

    return NextResponse.json({
      activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const createActivityHandler = async (req: NextRequest & { user: { userId: string } }) => {
  const body = await req.json();
  const validation = ActivitySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input.', details: validation.error.flatten() }, { status: 400 });
  }

  const { userId } = req.user;
  const newActivity = await Activity.create({ ...validation.data, organizerId: userId });

  return NextResponse.json({ message: 'Activity created successfully!', activity: newActivity }, { status: 201 });
};

export const POST = withAuth(['ADMIN', 'SUPER_ADMIN'], createActivityHandler);