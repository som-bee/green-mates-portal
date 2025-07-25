// src/app/(portal)/members/pending/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Calendar,
  Briefcase,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { MemberDataFrontend } from '@/types/member';

// Remove the custom interface and use the shared type
type PendingMember = MemberDataFrontend;

export default function PendingApprovalsPage() {
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<PendingMember | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [membershipType, setMembershipType] = useState('ANNUAL');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingMembers();
  }, []);

  const fetchPendingMembers = async () => {
    try {
      const response = await fetch('/api/members?status=PENDING_APPROVAL&limit=50');
      const data = await response.json();
      
      if (response.ok) {
        setPendingMembers(data.members);
      } else {
        toast.error('Failed to fetch pending members');
      }
    } catch (error) {
      toast.error('Error fetching pending members');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedMember) return;

    try {
      const response = await fetch(`/api/members/${selectedMember._id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType }),
      });

      if (response.ok) {
        toast.success(`${selectedMember.name} approved successfully!`);
        fetchPendingMembers();
        setShowApprovalModal(false);
        setSelectedMember(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to approve member');
      }
    } catch (error) {
      toast.error('Error approving member');
    }
  };

  const handleReject = async () => {
    if (!selectedMember || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch(`/api/members/${selectedMember._id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        toast.success(`${selectedMember.name} rejected successfully!`);
        fetchPendingMembers();
        setShowRejectionModal(false);
        setSelectedMember(null);
        setRejectionReason('');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to reject member');
      }
    } catch (error) {
      toast.error('Error rejecting member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Pending Approvals</h1>
          <p className="text-slate-600">Review and approve new member applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Clock size={20} />
            <span>{pendingMembers.length} pending</span>
          </div>
        </div>
      </div>

      {pendingMembers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All member applications have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-slate-800">{member.name}</h3>
                      <p className="text-slate-500">Applied on {new Date(member.dateJoined).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail size={16} />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Phone size={16} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.occupation && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Briefcase size={16} />
                        <span>{member.occupation}</span>
                      </div>
                    )}
                    {member.address && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPin size={16} />
                        <span className="truncate">{member.address}</span>
                      </div>
                    )}
                    {member.dateOfBirth && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar size={16} />
                        <span>{new Date(member.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills and Interests */}
                  {(member.skills?.length || member.interests?.length) && (
                    <div className="mb-4">
                      {member.skills && member.skills.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-slate-700">Skills: </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {member.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {member.interests && member.interests.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Interests: </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {member.interests.map((interest, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Motivation */}
                  {member.motivation && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-slate-700">Motivation: </span>
                      <p className="text-sm text-slate-600 mt-1">{member.motivation}</p>
                    </div>
                  )}

                  {/* Emergency Contact */}
                  {member.emergencyContact && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                        <Heart size={16} />
                        <span>Emergency Contact:</span>
                      </span>
                      <div className="mt-1 text-sm text-slate-600">
                        <p>{member.emergencyContact.name} ({member.emergencyContact.relationship})</p>
                        <p>{member.emergencyContact.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      // You can implement a detailed view modal here
                    }}
                    className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowApprovalModal(true);
                    }}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Approve Member"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowRejectionModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Reject Member"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Approve {selectedMember.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Membership Type
              </label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="ANNUAL">Annual Member</option>
                <option value="LIFE">Life Member</option>
                <option value="HONORARY">Honorary Member</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedMember(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Reject {selectedMember.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={3}
                required
              />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-red-600 mt-0.5" size={16} />
                <p className="text-sm text-red-700">
                  This action cannot be undone. The applicant will be notified of the rejection.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedMember(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
