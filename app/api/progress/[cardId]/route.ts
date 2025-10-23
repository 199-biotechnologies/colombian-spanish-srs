import { NextRequest, NextResponse } from 'next/server';
import { saveProgressItemToKV } from '@/lib/kv';
import { CardProgress } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ cardId: string }> }
) {
  try {
    const params = await context.params;
    const userId = getUserId(request);
    const progressItem: CardProgress = await request.json();

    // Ensure the cardId matches
    if (progressItem.cardId !== params.cardId) {
      return NextResponse.json(
        { error: 'Card ID mismatch' },
        { status: 400 }
      );
    }

    await saveProgressItemToKV(userId, progressItem);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving progress item:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

function getUserId(request: NextRequest): string {
  const cookies = request.cookies;
  let userId = cookies.get('userId')?.value;

  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  return userId;
}
