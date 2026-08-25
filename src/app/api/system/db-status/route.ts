export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formatDatabaseError } from '@/lib/db-errors';

export async function GET() {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const isPostgresUrl = process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://');

  if (!hasDbUrl) {
    return NextResponse.json({
      status: 'error',
      message: 'DATABASE_URL environment variable is missing on Vercel.',
      configured: false,
    }, { status: 500 });
  }

  try {
    // 1. Test basic raw query
    await db.$queryRaw`SELECT 1 as connected`;

    // 2. Query counts
    const userCount = await db.user.count();
    const companyCount = await db.company.count();
    const opportunityCount = await db.opportunity.count();
    const departmentCount = await db.department.count();

    const users = await db.user.findMany({
      select: { email: true, name: true, role: true },
      take: 10,
    });

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      provider: 'postgresql',
      isPostgresUrl,
      counts: {
        users: userCount,
        companies: companyCount,
        opportunities: opportunityCount,
        departments: departmentCount,
      },
      seededUsers: users,
      message: userCount > 0
        ? 'Database is fully initialized and seeded! 🚀'
        : 'Database is connected, but no records exist. Run "npm run prisma:seed" or use 1-Click Demo Login.',
    });
  } catch (err: any) {
    console.error('[DB_STATUS_ERROR]', err);
    const { userMessage, statusCode, code } = formatDatabaseError(err);

    return NextResponse.json({
      status: 'error',
      connected: false,
      isPostgresUrl,
      errorCode: code,
      error: userMessage,
    }, { status: statusCode });
  }
}
