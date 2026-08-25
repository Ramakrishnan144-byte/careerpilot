import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';

export const AUTH_COOKIE_NAME = 'careerpilot_session';

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[AUTH_WARNING] AUTH_SECRET is not configured in production environment variables. Using fallback.');
    }
    return 'careerpilot_super_secret_jwt_key_development_2026';
  }
  return secret;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string; // STUDENT, RECRUITER, PLACEMENT_OFFICER, ADMIN
  name: string;
  studentProfileId?: string;
  recruiterProfileId?: string;
  companyId?: string;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getFullUserProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          department: true,
          skills: { include: { skill: true } },
          projects: true,
          certifications: true,
          internships: true,
        },
      },
      recruiterProfile: {
        include: {
          company: true,
        },
      },
    },
  });
}
