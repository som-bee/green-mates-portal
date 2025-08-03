// src/app/api/membership/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Payment from '@/models/Payment'; // Import Payment model

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const token = await getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await User.findById(decoded.userId).select('status membershipType expiryDate').lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    // Find the most recent offline payment request that is not yet completed
    const recentOfflinePayment = await Payment.findOne({
      user: decoded.userId,
      status: { $in: ['PENDING_APPROVAL', 'REJECTED'] }
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      user,
      pendingRequest: recentOfflinePayment // Send this back to the client
    });
  } catch (error) {
    console.error("Error in /api/membership/status:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}