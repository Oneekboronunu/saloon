import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, price, durationMinutes, category, imageUrl, isActive, sortOrder } = body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(durationMinutes !== undefined && { durationMinutes: parseInt(durationMinutes, 10) }),
        ...(category !== undefined && { category: category.trim() }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl ? imageUrl.trim() : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
