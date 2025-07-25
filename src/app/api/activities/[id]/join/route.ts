// src/app/api/activities/[id]/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params Promise to access the id
  const { id } = await params;

  try {
    await dbConnect();

    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const activity = await Activity.findById(id);
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Check if user already joined
    if (activity.participants.includes(decoded.userId)) {
      return NextResponse.json(
        { error: 'Already joined this activity' },
        { status: 400 }
      );
    }

    // Check if activity is full
    if (
      activity.maxParticipants &&
      activity.participants.length >= activity.maxParticipants
    ) {
      return NextResponse.json({ error: 'Activity is full' }, { status: 400 });
    }

    // Add user to participants
    activity.participants.push(decoded.userId);
    activity.currentParticipants = activity.participants.length;
    await activity.save();

    return NextResponse.json({
      message: 'Successfully joined activity',
    });
  } catch (error) {
    console.error('Join activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
