import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Announcement, { IAnnouncement } from '@/models/Announcement';
import { withAuth } from '@/lib/apiWrapper';

// GET: List announcements
// GET: List announcements
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const announcementsFromDb = await Announcement.find({})
      .populate('authorId', 'name') // Populate the author's name
      .sort({ createdAt: -1 })
      .lean<IAnnouncement[]>();

    // Transform the data to match the frontend's 'Announcement' type
    const announcements = announcementsFromDb.map(announcement => {
      // Mongoose's populated field is named after the original field (`authorId`)
      const { _id, authorId, ...rest } = announcement;
      return {
        id: _id.toString(),
        author: authorId, // Rename authorId to author for the frontend
        ...rest
      };
    });
      
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// POST: Create a new announcement
const createAnnouncementHandler = async (req: NextRequest & { user: { userId: string } }) => {
  const { userId } = req.user;
  const body = await req.json();

  const newAnnouncement = await Announcement.create({
    ...body,
    authorId: userId
  });

  return NextResponse.json({ message: 'Announcement created successfully!', announcement: newAnnouncement }, { status: 201 });
};

export const POST = withAuth(['ADMIN', 'SUPER_ADMIN'], createAnnouncementHandler);