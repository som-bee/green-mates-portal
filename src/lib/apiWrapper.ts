// src/lib/apiWrapper.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { IUser } from '@/models/User';

type Role = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';

interface AuthenticatedRequest extends NextRequest {
  user: { userId: string; role: Role };
}

type ApiHandler = (
  req: AuthenticatedRequest,
  params: { params: any }
) => Promise<NextResponse>;

export function withAuth(roles: Role[], handler: ApiHandler) {
  return async (request: NextRequest, params: { params: any }) => {
    try {
      await dbConnect();

      const token = await getTokenFromRequest(request);
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      if (!roles.includes(decoded.role)) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      const authRequest = request as AuthenticatedRequest;
      authRequest.user = decoded;

      return handler(authRequest, params);
    } catch (error) {
      console.error('API wrapper error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}