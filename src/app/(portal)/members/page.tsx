// src/app/(portal)/members/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Clock,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MemberData, MemberDataFrontend } from '@/types/member';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  role: string;
  membershipType?: string;
  dateJoined: string;
  skills?: string[];
  interests?: string[];
  approvedBy?: { name: string; email: string };
  approvedAt?: string;
}

export default function MembersPage() {
   const [members, setMembers] = useState<MemberDataFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const fetchMembers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
        ...(roleFilter && { role: roleFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/members?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data.members);
        setTotalPages(data.pagination.pages);
      } else {
        toast.error('Failed to fetch members');
      }
    } catch (error) {
      toast.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, roleFilter, searchQuery]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleApprove = async (memberId: string, membershipType: string = 'ANNUAL') => {
    try {
      const response = await fetch(`/api/members/${memberId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType }),
      });

      if (response.ok) {
        toast.success('Member approved successfully!');
        fetchMembers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to approve member');
      }
    } catch (error) {
      toast.error('Error approving member');
    }
  };

  const handleReject = async (memberId: string, reason: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        toast.success('Member rejected successfully!');
        fetchMembers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to reject member');
      }
    } catch (error) {
      toast.error('Error rejecting member');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Member Management</h1>
          <p className="text-slate-600">Manage member registrations, approvals, and profiles</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
          <Link href="/members/create">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
              <Plus size={20} />
              <span>Add Member</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded border-secondary text-primary focus:ring-primary/20"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers(members.map(m => m._id));
                      } else {
                        setSelectedMembers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-secondary text-primary focus:ring-primary/20"
                      checked={selectedMembers.includes(member._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member._id]);
                        } else {
                          setSelectedMembers(selectedMembers.filter(id => id !== member._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {member.phone && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone size={14} />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.address && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin size={14} />
                          <span className="truncate max-w-32">{member.address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                      {member.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                      {member.role}
                      {['ADMIN', 'SUPER_ADMIN'].includes(member.role) && (
                        <Shield size={12} className="inline ml-1" />
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      <span>{new Date(member.dateJoined).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/members/${member._id}`}>
                        <button className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </Link>
                      
                      {member.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleApprove(member._id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Approve Member"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection:');
                              if (reason) handleReject(member._id, reason);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reject Member"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-secondary text-slate-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {members.filter(m => m.status === 'ACTIVE').length}
              </p>
              <p className="text-sm text-slate-500">Active Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {members.filter(m => m.status === 'PENDING_APPROVAL').length}
              </p>
              <p className="text-sm text-slate-500">Pending Approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {members.filter(m => ['ADMIN', 'SUPER_ADMIN'].includes(m.role)).length}
              </p>
              <p className="text-sm text-slate-500">Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {members.filter(m => {
                  const joinDate = new Date(m.dateJoined);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return joinDate > thirtyDaysAgo;
                }).length}
              </p>
              <p className="text-sm text-slate-500">New This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
