// src/lib/memberUtils.ts
import User from '@/models/User';
import { MemberLean, MemberData, PopulatedUser } from '@/types/member';

export async function populateMemberApprovals(member: MemberLean): Promise<MemberData> {
  const populatedMember = { ...member } as MemberData;

  // Populate approvedBy
  if (member.approvedBy && typeof member.approvedBy === 'string') {
    try {
      const approver = await User.findById(member.approvedBy)
        .select('name email')
        .lean<PopulatedUser>();
      
      populatedMember.approvedBy = approver || null;
    } catch {
      console.warn('Could not populate approvedBy for member:', member._id);
      populatedMember.approvedBy = null;
    }
  } else {
    populatedMember.approvedBy = member.approvedBy as PopulatedUser | null;
  }

  // Populate rejectedBy
  if (member.rejectedBy && typeof member.rejectedBy === 'string') {
    try {
      const rejector = await User.findById(member.rejectedBy)
        .select('name email')
        .lean<PopulatedUser>();
      
      populatedMember.rejectedBy = rejector || null;
    } catch {
      console.warn('Could not populate rejectedBy for member:', member._id);
      populatedMember.rejectedBy = null;
    }
  } else {
    populatedMember.rejectedBy = member.rejectedBy as PopulatedUser | null;
  }

  return populatedMember;
}
