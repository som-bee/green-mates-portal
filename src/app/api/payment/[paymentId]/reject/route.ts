import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import Payment from '@/models/Payment';

export async function PATCH(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    await dbConnect();
    const token = await getTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { paymentId } = params;
    const { reason } = await request.json();
    if (!reason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'Payment not found or not pending approval' }, { status: 404 });
    }

    payment.status = 'REJECTED';
    payment.rejectionReason = reason;
    await payment.save();

    return NextResponse.json({ message: 'Payment request has been rejected.' });
  } catch (error) {
    console.error("Reject payment error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}