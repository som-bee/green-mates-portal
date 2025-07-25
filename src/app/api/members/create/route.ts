// src/app/api/members/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
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
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      membershipType,
      role,
      skills, 
      interests, 
      bio,
      dateOfBirth,
      occupation,
      autoApprove = true
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      membershipType: membershipType || 'ANNUAL',
      role: role || 'MEMBER',
      skills: skills?.split(',').map((s: string) => s.trim()) || [],
      interests: interests?.split(',').map((s: string) => s.trim()) || [],
      bio,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      occupation,
      status: autoApprove ? 'ACTIVE' : 'PENDING_APPROVAL',
      approvedBy: autoApprove ? decoded.userId : undefined,
      approvedAt: autoApprove ? new Date() : undefined,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      message: autoApprove ? 'Member created and approved successfully!' : 'Member created successfully!',
      member: userWithoutPassword
    });

  } catch (error) {
    console.error('Member creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
