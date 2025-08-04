import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid fields', details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { username, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'This username is already taken' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user with profile
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        profile: {
          create: {
            displayName: username,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
