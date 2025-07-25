// src/app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const activities = await Activity.find(query)
      .populate('organizerId', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });

    return NextResponse.json({ activities });

  } catch (error) {
    console.error('Activities fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, type, date, location, maxParticipants } = body;

    const activity = await Activity.create({
      title,
      description,
      type,
      date: new Date(date),
      location,
      maxParticipants,
      organizerId: decoded.userId
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('organizerId', 'name email');

    return NextResponse.json({
      message: 'Activity created successfully',
      activity: populatedActivity
    });

  } catch (error) {
    console.error('Activity creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
