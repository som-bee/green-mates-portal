// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      phone, 
      address,
      dateOfBirth,
      occupation,
      skills, 
      interests, 
      experience,
      motivation,
      bio,
      emergencyContact
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with enhanced fields
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      occupation,
      // Fix the TypeScript error by adding proper type annotations
      skills: skills?.split(',').map((s: string) => s.trim()).filter((s: string) => s) || [],
      interests: interests?.split(',').map((s: string) => s.trim()).filter((s: string) => s) || [],
      experience,
      motivation,
      bio,
      emergencyContact: emergencyContact ? {
        name: emergencyContact.name,
        phone: emergencyContact.phone,
        relationship: emergencyContact.relationship,
      } : undefined,
      status: 'PENDING_APPROVAL',
      role: 'MEMBER'
    });

    // Send notification email to admins (implement later)
    // await sendNewMemberNotification(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      message: 'Registration successful! Please wait for admin approval.',
      user: userWithoutPassword,
      status: 'PENDING_APPROVAL'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
