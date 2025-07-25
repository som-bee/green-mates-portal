// src/models/Activity.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  type: 'WILDLIFE_RESCUE' | 'TREE_PLANTATION' | 'BLOOD_DONATION' | 'AWARENESS' | 'CLEANUP' | 'OTHER';
  date: Date;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  organizerId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  images?: string[];
  impact?: {
    animalsRescued?: number;
    treesPlanted?: number;
    bloodUnitsCollected?: number;
    peopleReached?: number;
    wasteCollected?: number;
  };
}

const ActivitySchema = new Schema<IActivity>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['WILDLIFE_RESCUE', 'TREE_PLANTATION', 'BLOOD_DONATION', 'AWARENESS', 'CLEANUP', 'OTHER'],
    required: true
  },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxParticipants: Number,
  currentParticipants: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  images: [String],
  impact: {
    animalsRescued: Number,
    treesPlanted: Number,
    bloodUnitsCollected: Number,
    peopleReached: Number,
    wasteCollected: Number,
  }
}, {
  timestamps: true
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
