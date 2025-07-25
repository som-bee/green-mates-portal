import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Activity, { IActivity } from '@/models/Activity'; // Import the interface
import { withAuth } from '@/lib/apiWrapper';
import { revalidatePath } from 'next/cache';

type RouteContext = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid activity ID format' }, { status: 400 });
    }

    const activityFromDb = await Activity.findById(id)
      .populate('organizerId', 'name email')
      .populate('participants', 'name email profileImage')
      .lean<IActivity>();

    if (!activityFromDb) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    // --- FIX IS HERE ---
    // Destructure organizerId and rename it to organizer for the frontend
    const { _id, organizerId, ...rest } = activityFromDb;
    const activity = {
      id: _id.toString(),
      organizer: organizerId, // The populated object is now named 'organizer'
      ...rest,
    };
    // --------------------

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const updateActivityHandler = async (req: NextRequest & { user: { userId: string, role: string } }, { params }: RouteContext) => {
  const { userId, role } = req.user;
  
  const activity = await Activity.findById(params.id);
  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  // **Permission Check**
  const isOwner = activity.organizerId.toString() === userId;
  const isSuperAdmin = role === 'SUPER_ADMIN';

  if (!isOwner && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden: You are not authorized to edit this activity.' }, { status: 403 });
  }

  const body = await req.json();
  const updatedActivity = await Activity.findByIdAndUpdate(params.id, body, { new: true }).lean<IActivity>();
  
  revalidatePath('/activities');
  revalidatePath(`/activities/${params.id}`);

  return NextResponse.json({ message: 'Activity updated successfully!', activity: updatedActivity });
};

// --- UPDATE: Modified DELETE Handler ---
const deleteActivityHandler = async (req: NextRequest & { user: { userId: string, role: string } }, { params }: RouteContext) => {
  const { userId, role } = req.user;

  const activity = await Activity.findById(params.id);
  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }
  
  // **Permission Check**
  const isOwner = activity.organizerId.toString() === userId;
  const isSuperAdmin = role === 'SUPER_ADMIN';

  if (!isOwner && !isSuperAdmin) {
    return NextResponse.json({ error: 'Forbidden: You are not authorized to delete this activity.' }, { status: 403 });
  }

  await Activity.findByIdAndDelete(params.id);

  revalidatePath('/activities');
  return NextResponse.json({ message: 'Activity deleted successfully' });
};

export const PATCH = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], updateActivityHandler);
export const DELETE = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], deleteActivityHandler);