import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error('Error fetching admin services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, durationMinutes, category, imageUrl, isActive, sortOrder } = body;

    if (!name || !price || !durationMinutes) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and duration are required.' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10),
        category: category?.trim() || 'HAIRCUT',
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== false,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
