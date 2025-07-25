// src/types/index.ts

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'LINK';
  url: string;
  category: 'GUIDELINES' | 'TRAINING' | 'FORMS' | 'REPORTS';
  
  // FIX: Change 'uploadedBy' from a simple string to an object
  uploadedBy: {
    _id: string;
    name: string;
  };

  accessLevel: 'PUBLIC' | 'MEMBERS_ONLY' | 'ADMIN_ONLY';

  // FIX: Add the timestamp properties
  createdAt: string; // Dates are serialized as strings in JSON
  updatedAt: string;
}


export interface User {
  _id: string;
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
