import { NextResponse } from 'next/server';
import { getAdminLogoutCookieHeader, getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.headers.set('Set-Cookie', getAdminLogoutCookieHeader());
  return response;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
