import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }
      
    // Payment is authentic, now update the database
    await dbConnect();
    
    // 1. Update User's membership expiry date
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    const currentExpiry = user.expiryDate && user.expiryDate > new Date() ? user.expiryDate : new Date();
    const newExpiryDate = new Date(currentExpiry);
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    
    await User.findByIdAndUpdate(decoded.userId, {
        status: 'ACTIVE',
        membershipType: 'ANNUAL',
        expiryDate: newExpiryDate,
        lastPaymentDate: new Date(),
    });

    // 2. Create a payment record
    await Payment.create({
      user: decoded.userId,
      amount: 500, // The fixed membership amount
      membershipType: 'ANNUAL',
      paymentDate: new Date(),
      paymentMethod: 'RAZORPAY',
      transactionId: razorpay_payment_id,
      status: 'COMPLETED',
      recordedBy: decoded.userId,
    });

    return NextResponse.json({ message: 'Payment successful! Your membership has been renewed.' });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}