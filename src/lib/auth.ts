import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'golden_cuts_fallback_secure_key_2026';
const COOKIE_NAME = 'gc_admin_token';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

// Lightweight, zero-dependency HMAC-SHA256 JWT implementation
export function signToken(payload: Omit<AdminPayload, 'exp'>, expiresInSeconds = 86400 * 7): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: AdminPayload = { ...payload, exp };

  const encodeBase64Url = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const b64Header = encodeBase64Url(header);
  const b64Payload = encodeBase64Url(fullPayload);
  const data = `${b64Header}.${b64Payload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [b64Header, b64Payload, signature] = parts;
    const data = `${b64Header}.${b64Payload}`;

    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: AdminPayload = JSON.parse(
      Buffer.from(b64Payload, 'base64').toString('utf8')
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getAdminCookieHeader(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${86400 * 7}${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
}

export function getAdminLogoutCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
