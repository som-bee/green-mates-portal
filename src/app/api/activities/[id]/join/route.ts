import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { withAuth } from '@/lib/apiWrapper';

type RouteContext = {
  params: { id: string };
};

const joinLeaveHandler = async (req: NextRequest & { user: { userId: string } }, { params }: RouteContext) => {
  const { id: activityId } = params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(activityId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  const activity = await Activity.findById(activityId);

  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  // --- FIX IS HERE: Add the type to the parameter ---
  const isAlreadyParticipant = activity.participants.some(
    (participantId: mongoose.Types.ObjectId) => participantId.toString() === userId
  );

  let message;

  if (isAlreadyParticipant) {
    // User wants to leave
    // --- AND FIX IS HERE: Add the type to the parameter ---
    activity.participants = activity.participants.filter(
      (participantId: mongoose.Types.ObjectId) => participantId.toString() !== userId
    );
    message = 'You have left the activity.';
  } else {
    // User wants to join
    if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
      return NextResponse.json({ error: 'Activity is already full' }, { status: 409 });
    }
    activity.participants.push(new mongoose.Types.ObjectId(userId));
    message = 'You have successfully joined the activity!';
  }

  // Update participant count
  activity.currentParticipants = activity.participants.length;
  await activity.save();

  // Re-populate the activity to return the latest data
  const updatedActivity = await Activity.findById(activityId).populate('participants', 'name email profileImage').lean();

  return NextResponse.json({ message, activity: updatedActivity });
};

export const POST = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], joinLeaveHandler);