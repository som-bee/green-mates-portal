/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { MemberDataFrontend } from '@/types/member';
import toast from 'react-hot-toast';

export function useMembers(initialParams: URLSearchParams) {
  const [members, setMembers] = useState<MemberDataFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  // ... other state like pagination, filters

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/members?${initialParams.toString()}`);
      // ... handle response
    } catch {
      toast.error("Error fetching members");
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, fetchMembers };
}