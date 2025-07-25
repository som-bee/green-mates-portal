// src/app/api/members/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    await dbConnect();
    
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { membershipType } = body;

    const user = await User.findByIdAndUpdate(
      id,
      { 
        status: 'ACTIVE',
        membershipType: membershipType || 'ANNUAL',
        approvedBy: decoded.userId,
        approvedAt: new Date()
      },
      { new: true }
    ).select('-password').populate('approvedBy', 'name email');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Member approved successfully', 
      member: user 
    });

  } catch (error) {
    console.error('Member approval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
