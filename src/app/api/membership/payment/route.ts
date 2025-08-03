// src/app/api/membership/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import Payment from '@/models/Payment';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate and authorize the admin
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
      memberId,
      amount,
      membershipType,
      paymentDate,
      paymentMethod,
      transactionId,
      notes,
    } = body;

    // Validate required fields from the form
    if (!memberId || !amount || !membershipType || !paymentDate) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // When a payment is made, update the user's status and last payment date
    await User.findByIdAndUpdate(memberId, {
        membershipType,
        lastPaymentDate: new Date(paymentDate),
        status: 'ACTIVE' // A payment makes a member active
    });

    // Create the new payment record in the database
    const payment = await Payment.create({
      user: memberId,
      amount,
      membershipType,
      paymentDate: new Date(paymentDate),
      paymentMethod,
      transactionId,
      notes,
      recordedBy: decoded.userId, // Link the payment to the admin who recorded it
    });

    return NextResponse.json({
      message: 'Payment recorded successfully!',
      payment,
    }, { status: 201 });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}