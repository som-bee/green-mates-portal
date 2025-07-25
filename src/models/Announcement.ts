import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: 'GENERAL' | 'URGENT' | 'EVENT' | 'ACHIEVEMENT';
  authorId: mongoose.Types.ObjectId;
  isPublic: boolean;
  attachments?: string[];
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['GENERAL', 'URGENT', 'EVENT', 'ACHIEVEMENT'],
    default: 'GENERAL'
  },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  attachments: [String],
}, {
  timestamps: true
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);