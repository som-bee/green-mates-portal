// src/app/api/membership/request-approval/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import Payment from '@/models/Payment';

// NOTE: For a real application, you would handle file uploads here
// using a service like AWS S3, Cloudinary, or Vercel Blob Storage.
// For now, we are just accepting the form data.

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // In a real app, you would get the form data with a file using `request.formData()`
    const body = await request.json(); 
    const { amount, paymentDate, paymentMethod, transactionId, notes } = body;

    if (!amount || !paymentDate || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required payment details' }, { status: 400 });
    }

    // Create a new payment record with a 'PENDING_APPROVAL' status
    await Payment.create({
      user: decoded.userId,
      amount: parseFloat(amount),
      membershipType: 'ANNUAL', // Assuming offline payments are for annual renewal
      paymentDate: new Date(paymentDate),
      paymentMethod,
      transactionId,
      notes,
      recordedBy: decoded.userId, // User is recording their own payment
      status: 'PENDING_APPROVAL', // This is key for the admin approval workflow
      // proofOfPayment: 'URL_from_your_file_upload_service'
    });

    return NextResponse.json({
      message: 'Your payment proof has been submitted successfully! An admin will review it shortly.',
    }, { status: 201 });

  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}