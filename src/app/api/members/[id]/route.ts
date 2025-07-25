// src/app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { MemberLean, MemberData } from '@/types/member';
import { populateMemberApprovals } from '@/lib/memberUtils';

export async function GET(
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const member: MemberLean | null = await User.findById(id)
      .select('-password')
      .lean<MemberLean>();

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Populate approval/rejection info using shared utility
    const populatedMember: MemberData = await populateMemberApprovals(member);

    return NextResponse.json({ member: populatedMember });

  } catch (error) {
    console.error('Member details fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
