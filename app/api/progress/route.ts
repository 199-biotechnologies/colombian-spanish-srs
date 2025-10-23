import { NextRequest, NextResponse } from 'next/server';
import { loadProgressFromKV, saveProgressToKV } from '@/lib/kv';
import { CardProgress } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const progress = await loadProgressFromKV(userId);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error loading progress:', error);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const progress: CardProgress[] = await request.json();
    await saveProgressToKV(userId, progress);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

function getUserId(request: NextRequest): string {
  // For now, use a simple device-based ID from cookies
  // In production, you'd use proper authentication
  const cookies = request.cookies;
  let userId = cookies.get('userId')?.value;

  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  return userId;
}
