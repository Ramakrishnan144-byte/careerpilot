export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedDatabase } from '../../../../../prisma/seed';
import { formatDatabaseError } from '@/lib/db-errors';

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
    }

    console.log('[API_INIT_DB] Running seedDatabase on request...');
    await seedDatabase(db);

    const userCount = await db.user.count();
    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with ${userCount} users and complete demo dataset!`,
      totalUsers: userCount,
    });
  } catch (err: any) {
    console.error('[API_INIT_DB_ERROR]', err);
    const { userMessage, statusCode } = formatDatabaseError(err);
    return NextResponse.json({ error: userMessage }, { status: statusCode });
  }
}
