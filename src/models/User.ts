// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  profileImage?: string;
  phone?: string;
  address?: string;
  dateJoined: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';
  membershipType?: 'LIFE' | 'ANNUAL' | 'HONORARY';
  skills?: string[];
  interests?: string[];
  lastActive?: Date;
  bio?: string;
  dateOfBirth?: Date;
  occupation?: string;
  experience?: string;
  motivation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['MEMBER', 'ADMIN', 'SUPER_ADMIN'], 
    default: 'MEMBER' 
  },
  profileImage: { type: String },
  phone: { type: String },
  address: { type: String },
  dateJoined: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL', 'REJECTED'], 
    default: 'PENDING_APPROVAL' 
  },
  membershipType: { 
    type: String, 
    enum: ['LIFE', 'ANNUAL', 'HONORARY'] 
  },
  skills: [{ type: String }],
  interests: [{ type: String }],
  lastActive: { type: Date },
  bio: { type: String },
  dateOfBirth: { type: Date },
  occupation: { type: String },
  experience: { type: String },
  motivation: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String },
  },
  // Add these fields with proper schema definition
  approvedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  approvedAt: { 
    type: Date,
    required: false 
  },
  rejectedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  rejectedAt: { 
    type: Date,
    required: false 
  },
  rejectionReason: { 
    type: String,
    required: false 
  },
}, {
  timestamps: true,
  // Add this to handle strict population
  strict: false
});

// Ensure we're not redefining the model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
