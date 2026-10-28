import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, signToken, getAdminCookieHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    response.headers.set('Set-Cookie', getAdminCookieHeader(token));
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service encountered an error' },
      { status: 500 }
    );
  }
}
