/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth } from '@/lib/apiWrapper';

// PATCH: Update the current user's profile information
const updateProfileHandler = async (req: NextRequest & { user: { userId: string } }) => {
  const { userId } = req.user;
  const body = await req.json();

  // Ensure sensitive/immutable fields are not updated through this endpoint
  const { email, password, role, status, ...updateData } = body;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

  if (!updatedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Profile updated successfully!', user: updatedUser });
};

export const PATCH = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], updateProfileHandler);