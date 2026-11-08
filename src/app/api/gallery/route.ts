import { NextResponse } from 'next/server';
import { getGalleryItems } from '@/lib/gallery';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getGalleryItems();
    // Only return active items for public visitors
    const publicItems = items.filter((item) => item.isActive !== false);
    return NextResponse.json({ success: true, items: publicItems });
  } catch (error) {
    console.error('Fetch public gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve gallery items' }, { status: 500 });
  }
}
