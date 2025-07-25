// src/types/member.ts - Update your existing file
export interface PopulatedUser {
  name: string;
  email: string;
}

// Base member data from database
export interface MemberData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  occupation?: string;
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';
  membershipType?: 'LIFE' | 'ANNUAL' | 'HONORARY';
  dateJoined: Date;
  skills?: string[];
  interests?: string[];
  experience?: string;
  motivation?: string;
  bio?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  approvedBy?: PopulatedUser | null;
  approvedAt?: Date;
  rejectedBy?: PopulatedUser | null;
  rejectedAt?: Date;
  rejectionReason?: string;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend version with string dates (as received from API)
export interface MemberDataFrontend {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string; // String from API JSON
  occupation?: string;
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';
  membershipType?: 'LIFE' | 'ANNUAL' | 'HONORARY';
  dateJoined: string; // String from API JSON
  skills?: string[];
  interests?: string[];
  experience?: string;
  motivation?: string;
  bio?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  approvedBy?: PopulatedUser | null;
  approvedAt?: string;
  rejectedBy?: PopulatedUser | null;
  rejectedAt?: string;
  rejectionReason?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

// For lean queries (before population)
export interface MemberLean extends Omit<MemberData, 'approvedBy' | 'rejectedBy'> {
  approvedBy?: string | PopulatedUser | null;
  rejectedBy?: string | PopulatedUser | null;
}
