import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth } from '@/lib/apiWrapper';
import { verifyPassword, hashPassword } from '@/lib/auth';

// POST: Change the current user's password
const changePasswordHandler = async (req: NextRequest & { user: { userId: string } }) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'Invalid input. New password must be at least 8 characters.' }, { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isPasswordCorrect = await verifyPassword(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Incorrect current password.' }, { status: 403 });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return NextResponse.json({ message: 'Password updated successfully!' });
};

export const POST = withAuth(['MEMBER', 'ADMIN', 'SUPER_ADMIN'], changePasswordHandler);