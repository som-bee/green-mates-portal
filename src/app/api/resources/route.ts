import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resource, { IResource } from '@/models/Resource';
import { withAuth } from '@/lib/apiWrapper';
import { getAuthenticatedUser } from '@/lib/auth';

// GET: List resources based on user role
export async function GET() {
  await dbConnect();
  const session = await getAuthenticatedUser();
  
  let query: Record<string, unknown> = { accessLevel: 'PUBLIC' };
  
  if (session) {
    // Logged-in members can see PUBLIC and MEMBERS_ONLY
    query = { accessLevel: { $in: ['PUBLIC', 'MEMBERS_ONLY'] } };
  }
  if (session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN') {
    // Admins can see everything
    query = {}; 
  }
  
  const resourcesFromDb = await Resource.find(query)
    .populate('uploadedBy', 'name')
    .sort({ createdAt: -1 })
    .lean<IResource[]>();

  const resources = resourcesFromDb.map(resource => ({
    id: resource._id.toString(),
    ...resource,
  }));

  return NextResponse.json({ resources });
}


// POST: Create a new resource (Admin only)
const createResourceHandler = async (req: NextRequest & { user: { userId: string } }) => {
  const { userId } = req.user;
  const body = await req.json();

  const newResource = await Resource.create({
    ...body,
    uploadedBy: userId,
  });

  return NextResponse.json({ message: 'Resource added successfully!', resource: newResource }, { status: 201 });
};

export const POST = withAuth(['ADMIN', 'SUPER_ADMIN'], createResourceHandler);