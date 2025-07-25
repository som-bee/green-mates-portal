import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'LINK';
  url: string;
  category: 'GUIDELINES' | 'TRAINING' | 'FORMS' | 'REPORTS';
  uploadedBy: mongoose.Types.ObjectId;
  accessLevel: 'PUBLIC' | 'MEMBERS_ONLY' | 'ADMIN_ONLY';
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['DOCUMENT', 'IMAGE', 'VIDEO', 'LINK'],
    required: true,
  },
  url: { type: String, required: true },
  category: {
    type: String,
    enum: ['GUIDELINES', 'TRAINING', 'FORMS', 'REPORTS'],
    required: true,
  },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessLevel: {
    type: String,
    enum: ['PUBLIC', 'MEMBERS_ONLY', 'ADMIN_ONLY'],
    default: 'MEMBERS_ONLY',
  },
}, {
  timestamps: true
});

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);