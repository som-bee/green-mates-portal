// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  profileImage?: string;
  phone?: string;
  address?: string;
  dateJoined: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';
  membershipType?: 'LIFE' | 'ANNUAL' | 'HONORARY';
  skills?: string[];
  interests?: string[];
  lastActive?: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'WILDLIFE_RESCUE' | 'TREE_PLANTATION' | 'BLOOD_DONATION' | 'AWARENESS' | 'CLEANUP' | 'OTHER';
  date: Date;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  organizerId: string;
  organizer: User;
  participants: User[];
  images?: string[];
  impact?: {
    animalsRescued?: number;
    treesPlanted?: number;
    bloodUnitsCollected?: number;
    peopleReached?: number;
    wasteCollected?: number;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'URGENT' | 'EVENT' | 'ACHIEVEMENT';
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  attachments?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'LINK';
  url: string;
  category: 'GUIDELINES' | 'TRAINING' | 'FORMS' | 'REPORTS';
  uploadedBy: string;
  uploadedAt: Date;
  accessLevel: 'PUBLIC' | 'MEMBERS_ONLY' | 'ADMIN_ONLY';
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  upcomingActivities: number;
  completedActivities: number;
  totalImpact: {
    animalsRescued: number;
    treesPlanted: number;
    bloodUnitsCollected: number;
    peopleReached: number;
  };
}
