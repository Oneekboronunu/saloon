import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { memoryStore } from '@/lib/memoryStore';
import { DEFAULT_SERVICES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (services && services.length > 0) {
      return NextResponse.json({ success: true, services });
    }
  } catch (error) {
    // Fallback to memoryStore
  }

  return NextResponse.json({
    success: true,
    services: memoryStore.getServices().filter((s) => s.isActive),
  });
}
