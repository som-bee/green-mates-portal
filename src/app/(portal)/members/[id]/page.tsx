// src/app/(portal)/members/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  User,
  Shield,
  Heart,
  Clock,
  Check,
  X,
  Edit,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface MemberDetails {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  occupation?: string;
  role: string;
  status: string;
  membershipType?: string;
  dateJoined: string;
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
  approvedBy?: {
    name: string;
    email: string;
  };
  approvedAt?: string;
  rejectedBy?: {
    name: string;
    email: string;
  };
  rejectedAt?: string;
  rejectionReason?: string;
  lastActive?: string;
}

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchMemberDetails = async (memberId: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMember(data.member);
      } else {
        toast.error('Failed to fetch member details');
        router.push('/members');
      }
    } catch (error) {
      toast.error('Error fetching member details');
      router.push('/members');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (params.id) {
      fetchMemberDetails(params.id as string);
    }
  }, [params.id, fetchMemberDetails]);


  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
      REJECTED: 'bg-red-100 text-red-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      SUPER_ADMIN: 'bg-red-100 text-red-700',
      ADMIN: 'bg-purple-100 text-purple-700',
      MEMBER: 'bg-blue-100 text-blue-700',
    };
    return styles[role as keyof typeof styles] || 'bg-blue-100 text-blue-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-600">Member not found</h2>
        <Link href="/members" className="text-primary hover:text-secondary">
          Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/members">
            <button className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Members</span>
            </button>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/members/${member._id}/edit`}>
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit size={16} />
              <span>Edit</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Member Profile */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-6 mb-8">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-2xl">
              {member.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-serif font-bold text-primary">{member.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(member.status)}`}>
                {member.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(member.role)}`}>
                {member.role}
                {['ADMIN', 'SUPER_ADMIN'].includes(member.role) && (
                  <Shield size={12} className="inline ml-1" />
                )}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-slate-600">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{member.email}</span>
              </div>
              {member.membershipType && (
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{member.membershipType} Member</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Joined {new Date(member.dateJoined).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {member.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-600">{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <span className="text-slate-600">{member.address}</span>
                </div>
              )}
              {member.dateOfBirth && (
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-600">
                    Born on {new Date(member.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              )}
              {member.occupation && (
                <div className="flex items-center space-x-3">
                  <Briefcase size={16} className="text-slate-400" />
                  <span className="text-slate-600">{member.occupation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {member.emergencyContact && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Emergency Contact</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart size={16} className="text-red-600" />
                  <span className="font-medium text-red-800">{member.emergencyContact.name}</span>
                </div>
                <div className="space-y-1 text-sm text-red-700">
                  <p>Phone: {member.emergencyContact.phone}</p>
                  <p>Relationship: {member.emergencyContact.relationship}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skills and Interests */}
        {(member.skills?.length || member.interests?.length) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Skills & Interests</h3>
            <div className="space-y-4">
              {member.skills && member.skills.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {member.interests && member.interests.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Interests:</span>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience and Motivation */}
        {(member.experience || member.motivation || member.bio) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Background</h3>
            <div className="space-y-4">
              {member.experience && (
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Experience:</span>
                  <p className="text-slate-600 bg-gray-50 p-3 rounded-lg">{member.experience}</p>
                </div>
              )}
              {member.motivation && (
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Motivation:</span>
                  <p className="text-slate-600 bg-gray-50 p-3 rounded-lg">{member.motivation}</p>
                </div>
              )}
              {member.bio && (
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Bio:</span>
                  <p className="text-slate-600 bg-gray-50 p-3 rounded-lg">{member.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approval/Rejection Information */}
        {(member.approvedBy || member.rejectedBy) && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Status</h3>
            
            {member.approvedBy && member.approvedAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Check className="text-green-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-green-800">Application Approved</p>
                    <p className="text-sm text-green-700">
                      Approved by {member.approvedBy.name} on {new Date(member.approvedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {member.rejectedBy && member.rejectedAt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <X className="text-red-600 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-red-800">Application Rejected</p>
                    <p className="text-sm text-red-700 mb-2">
                      Rejected by {member.rejectedBy.name} on {new Date(member.rejectedAt).toLocaleString()}
                    </p>
                    {member.rejectionReason && (
                      <div className="bg-white p-3 rounded border border-red-200">
                        <span className="text-sm font-medium text-red-800">Reason:</span>
                        <p className="text-sm text-red-700 mt-1">{member.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
