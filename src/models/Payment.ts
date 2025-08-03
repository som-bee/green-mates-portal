// src/models/Payment.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface describing the Payment document
export interface IPayment extends Document {
  user: Types.ObjectId;
  amount: number;
  membershipType: 'ANNUAL' | 'LIFE';
  paymentDate: Date;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'OTHER' | 'RAZORPAY';
  transactionId?: string;
  notes?: string;
  recordedBy: Types.ObjectId;
  status: 'COMPLETED' | 'PENDING_APPROVAL' | 'REJECTED'; // NEW: To track payment status
  proofOfPayment?: string; // NEW: URL or reference to the uploaded proof
  rejectionReason?: string; // NEW: Reason for rejection by admin
}

// Mongoose Schema for Payments
const PaymentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  membershipType: { type: String, enum: ['ANNUAL', 'LIFE'], required: true },
  paymentDate: { type: Date, default: Date.now, required: true },
  paymentMethod: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER', 'RAZORPAY'], required: true },
  transactionId: { type: String },
  notes: { type: String },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['COMPLETED', 'PENDING_APPROVAL', 'REJECTED'], default: 'COMPLETED' },
  proofOfPayment: { type: String },
  rejectionReason: { type: String },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);