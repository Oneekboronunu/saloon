import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  getGalleryItems,
  saveGalleryItems,
  GalleryItem,
  getVideoThumbnail,
  extractYouTubeId,
} from '@/lib/gallery';

export const dynamic = 'force-dynamic';

// GET: Retrieve all gallery items for the admin panel
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const items = await getGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Admin gallery fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST: Create a new gallery item or update an existing one
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, category, tag, description, mediaType, mediaUrl, thumbnailUrl, isActive } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and Media (photo or video link) are required.' },
        { status: 400 }
      );
    }

    const items = await getGalleryItems();

    // Auto-detect thumbnail for videos if not explicitly provided
    let computedThumbnail = thumbnailUrl;
    if (mediaType === 'VIDEO') {
      computedThumbnail = getVideoThumbnail(mediaUrl, thumbnailUrl);
    }

    if (id) {
      // Update existing item
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
      }

      items[index] = {
        ...items[index],
        title: title.trim(),
        category: category || 'HAIRCUTS',
        tag: tag || 'Signature Styling',
        description: description ? description.trim() : '',
        mediaType: mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: computedThumbnail,
        isActive: isActive !== undefined ? Boolean(isActive) : items[index].isActive,
      };
    } else {
      // Create new item
      const newItem: GalleryItem = {
        id: `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        category: category || 'HAIRCUTS',
        tag: tag || 'Signature Styling',
        description: description ? description.trim() : '',
        mediaType: mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: computedThumbnail,
        sortOrder: items.length + 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date().toISOString(),
      };

      items.unshift(newItem); // Place at the beginning so the newest appears first
    }

    await saveGalleryItems(items);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Admin gallery save error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save gallery item' }, { status: 500 });
  }
}

// DELETE: Delete a gallery item by id (passed via query or JSON body)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const items = await getGalleryItems();
    const filtered = items.filter((item) => item.id !== id);

    await saveGalleryItems(filtered);
    return NextResponse.json({ success: true, items: filtered });
  } catch (error) {
    console.error('Admin gallery delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete gallery item' }, { status: 500 });
  }
}

// PATCH: Toggle active status or update reordering
export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, newOrder } = body;

    const items = await getGalleryItems();

    if (action === 'toggleActive' && id) {
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        items[index].isActive = !items[index].isActive;
        await saveGalleryItems(items);
        return NextResponse.json({ success: true, items });
      }
    }

    if (action === 'reorder' && Array.isArray(newOrder)) {
      await saveGalleryItems(newOrder);
      return NextResponse.json({ success: true, items: newOrder });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin gallery patch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update gallery' }, { status: 500 });
  }
}
