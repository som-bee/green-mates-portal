import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// Server-side price list. This is our single source of truth for prices.
const membershipPlans = {
    ANNUAL: { amount: 10, description: 'Annual Membership Fee' },
    LIFE: { amount: 5000, description: 'Life Membership Fee' },
};

export async function POST(request: NextRequest) {
    try {
        const token = await getTokenFromRequest(request);
        const decoded = token ? verifyToken(token) : null;
        if (!decoded) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
      
        const { planType } = await request.json();
        
        if (planType !== 'ANNUAL' && planType !== 'LIFE') {
            return NextResponse.json({ error: 'Invalid membership plan' }, { status: 400 });
        }
        
        const selectedPlan = membershipPlans[planType];

        // --- THIS IS THE FIX ---
        // Create a shorter receipt ID that is well under the 40-character limit.
        // We use a short prefix, a portion of the user ID, and a compact timestamp.
        const shortUserId = decoded.userId.slice(-6);
        const compactTimestamp = Date.now().toString(36);
        const receiptId = `rcpt_${shortUserId}_${compactTimestamp}`;

        const options = {
            amount: selectedPlan.amount * 100, // Amount in paise
            currency: 'INR',
            receipt: receiptId, // Use the new, shorter receipt ID
            notes: {
                userId: decoded.userId,
                planType: planType,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ 
            orderId: order.id, 
            amount: options.amount,
            description: selectedPlan.description,
        });

    } catch (error: any) {
        console.error("Razorpay order creation error:", error);
        // Pass the actual error from Razorpay back to the client if available
        const description = error.error?.description || 'Error creating payment order';
        return NextResponse.json({ error: description }, { status: 500 });
    }
}