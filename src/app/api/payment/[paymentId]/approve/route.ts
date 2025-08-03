import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import Payment from '@/models/Payment';
import User from '@/models/User';

export async function PATCH(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    await dbConnect();
    const token = await getTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { paymentId } = params;
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'Payment not found or not pending approval' }, { status: 404 });
    }

    // 1. Update Payment status
    payment.status = 'COMPLETED';
    await payment.save();

    // 2. Update User's membership
    const user = await User.findById(payment.user);
    if (user) {
        // If user's membership is already active, extend it. Otherwise, start from today.
        const currentExpiry = user.expiryDate && user.expiryDate > new Date() ? user.expiryDate : new Date();
        const newExpiryDate = new Date(currentExpiry);
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
        
        user.status = 'ACTIVE';
        user.expiryDate = newExpiryDate;
        user.lastPaymentDate = payment.paymentDate;
        await user.save();
    }

    return NextResponse.json({ message: 'Payment approved and membership updated.' });
  } catch (error) {
    console.error("Approve payment error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}